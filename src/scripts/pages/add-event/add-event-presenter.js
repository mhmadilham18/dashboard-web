import Swal from "sweetalert2";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { createEventFormTemplate } from "../../templates/template-event.js";

class AddEventPresenter {
  #container;
  #model;
  #eventId;
  #quill;
  #removedCover = false;

  constructor({ container, model, eventId }) {
    this.#container = container;
    this.#model = model;
    this.#eventId = eventId;
    this._initialize();
  }

  async _initialize() {
    this.#container.innerHTML = createEventFormTemplate();
    this._initQuill();
    await this._populateInitialData();
    this._setupEventListeners();
    lucide.createIcons();
  }

  _initQuill() {
    this.#quill = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "blockquote"],
          ["clean"],
        ],
      },
      placeholder: "Tuliskan deskripsi lengkap event di sini...",
    });
  }

  async _populateInitialData() {
    await this._loadCategories();

    if (this.#eventId) {
      try {
        const result = await this.#model.getEventById(this.#eventId);
        const eventData = result.data.event || result.data;
        if (eventData && typeof eventData === "object") {
          this._fillForm(eventData);
        } else {
          throw new Error(
            "Format data event tidak valid atau tidak ditemukan."
          );
        }
      } catch (e) {
        Swal.fire("Error", `Gagal memuat data event: ${e.message}`, "error");
        window.location.hash = "#/events";
      }
    }
  }

  async _loadCategories() {
    try {
      const categoriesResult = await this.#model.getEventCategories();
      const categorySelect = document.getElementById("category_id");
      categorySelect.innerHTML = '<option value="">Pilih Kategori...</option>';
      categoriesResult.data.forEach((cat) => {
        categorySelect.add(new Option(cat.name, cat.id));
      });
    } catch (e) {
      console.error("Gagal memuat kategori:", e);
    }
  }

  _fillForm(event) {
    this.#removedCover = false;

    document.getElementById("title").value = event.title || "";
    document.getElementById("category_id").value = event.category_id || "";

    // Gambar
    if (event.cover_url) {
      document.getElementById("imagePreview").src = event.cover_url;
      document.getElementById("imagePreviewWrapper").style.display = "block";
    }

    // Field tambahan event
    if (event.event_date) {
      const date = new Date(event.event_date);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      document.getElementById("event_date").value = date
        .toISOString()
        .split("T")[0];
    }
    document.getElementById("event_start").value = event.event_start || "";
    document.getElementById("event_end").value = event.event_end || "";
    document.getElementById("location").value = event.location || "";
    document.getElementById("location_detail").value =
      event.location_detail || "";

    // Isi Quill editor
    if (event.content) {
      try {
        // Coba parse Delta
        const delta = JSON.parse(event.content);
        if (delta && delta.ops) {
          this.#quill.setContents(delta, "silent");
        } else {
          throw new Error("Format Delta tidak valid");
        }
      } catch (e) {
        console.warn("Konten bukan JSON valid, fallback ke HTML:", e.message);
        this.#quill.root.innerHTML = event.content;
      }
    }
  }

  _setupEventListeners() {
    this.form = document.getElementById("eventForm");
    this.form.addEventListener("submit", (e) => this._handleFormSubmit(e));

    const coverInput = document.getElementById("cover_file");
    const fileDropArea = document.getElementById("fileDropArea");
    const removeImageBtn = document.getElementById("removeImageBtn");

    // Preview gambar baru
    coverInput.addEventListener("change", () => {
      this.#removedCover = false;
      this._handleImagePreview(coverInput.files[0]);
    });

    // Hapus gambar
    removeImageBtn.addEventListener("click", () => {
      this.#removedCover = true;
      this._resetImageSelection();
    });

    // Drag and drop
    fileDropArea.addEventListener("click", () => coverInput.click());
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      fileDropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
    fileDropArea.addEventListener("dragover", () =>
      fileDropArea.classList.add("dragover")
    );
    ["dragleave", "drop"].forEach((eventName) => {
      fileDropArea.addEventListener(eventName, () =>
        fileDropArea.classList.remove("dragover")
      );
    });
    fileDropArea.addEventListener("drop", (e) => {
      if (e.dataTransfer.files.length) {
        coverInput.files = e.dataTransfer.files;
        this.#removedCover = false;
        this._handleImagePreview(e.dataTransfer.files[0]);
      }
    });
  }

  async _handleFormSubmit(e) {
    e.preventDefault();
    this._setLoadingState(true);

    const formData = new FormData(this.form);

    // Ambil HTML dari Quill
    const htmlContent = this.#quill.root.innerHTML.trim();
    if (htmlContent && htmlContent !== "<p><br></p>") {
      formData.append("content", htmlContent);
    }

    // Hapus field kosong kecuali content
    for (let [key, value] of formData.entries()) {
      if ((value === "" || value === null) && key !== "content") {
        formData.delete(key);
      }
    }

    // Validasi kategori
    const categoryId = formData.get("category_id");
    const categoryName = formData.get("category_name");
    if (!categoryId && !categoryName) {
      Swal.fire("Validasi Gagal", "Pilih atau buat kategori baru.", "error");
      this._setLoadingState(false);
      return;
    }

    // Logika gambar
    const fileInput = document.getElementById("cover_file");
    if (this.#eventId) {
      if (this.#removedCover) {
        formData.append("remove_cover", "1");
        formData.delete("cover_file");
      } else if (!fileInput || fileInput.files.length === 0) {
        formData.delete("cover_file");
      }
    }

    try {
      if (this.#eventId) {
        await this.#model.updateEvent(this.#eventId, formData);
        await Swal.fire("Sukses!", "Event berhasil diperbarui.", "success");
      } else {
        await this.#model.createEvent(formData);
        await Swal.fire("Sukses!", "Event berhasil ditambahkan.", "success");
      }
      window.location.hash = "#/events";
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      this._setLoadingState(false);
    }
  }

  _handleImagePreview(file) {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById("imagePreview").src = e.target.result;
        document.getElementById("imagePreviewWrapper").style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  }

  _resetImageSelection() {
    const coverInput = document.getElementById("cover_file");
    coverInput.value = "";
    document.getElementById("imagePreviewWrapper").style.display = "none";
    document.getElementById("imagePreview").src = "#";
  }

  _setLoadingState(isLoading) {
    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn.querySelector(".btn-text");
    if (!submitBtn || !btnText) return;
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle("loading", isLoading);
    btnText.textContent = isLoading
      ? "Menyimpan..."
      : this.#eventId
      ? "Simpan Perubahan"
      : "Simpan Event";
  }
}

export default AddEventPresenter;
