import Swal from "sweetalert2";

class AddActivityPresenter {
  #view;
  #model;
  #activityId;

  constructor({ view, model, activityId }) {
    this.#view = view;
    this.#model = model;
    this.#activityId = activityId;
    this._initialize();
  }

  async _initialize() {
    await this._populateInitialData();
    this._setupEventListeners();
  }

  async _populateInitialData() {
    try {
      const categoriesResult = await this.#model.getActivityCategories();
      const categorySelect = document.getElementById("category_id");
      categorySelect.innerHTML = '<option value="">Pilih Kategori...</option>';
      categoriesResult.data.forEach((cat) =>
        categorySelect.add(new Option(cat.name, cat.id))
      );
    } catch {
      Swal.fire("Error", "Gagal memuat kategori aktivitas.", "error");
    }

    if (this.#activityId) {
      document.querySelector(".card-title").innerText = "Edit Data Aktivitas";
      document.querySelector(".card-subtitle").innerText =
        "Perbarui detail aktivitas di bawah ini.";
      document.querySelector("#submitBtn .btn-text").innerText =
        "Simpan Perubahan";

      try {
        const activityData = await this.#model.getActivityById(
          this.#activityId
        );
        if (activityData?.data?.activity) {
          this._fillForm(activityData.data.activity);
        } else {
          Swal.fire("Error", "Data aktivitas tidak ditemukan.", "error");
          window.location.hash = "#/activities";
        }
      } catch {
        Swal.fire("Error", "Gagal memuat data aktivitas.", "error");
        window.location.hash = "#/activities";
      }
    }
  }

  _fillForm(activity) {
    const setVal = (id, val) => (document.getElementById(id).value = val || "");
    setVal("name", activity.name);
    setVal("description", activity.description);
    setVal("category_id", activity.category_id);
    setVal("calories_burned", activity.calories_burned);
    setVal("duration", activity.duration);
    setVal("duration_unit", activity.duration_unit);

    if (activity.photo_url) {
      document.getElementById("imagePreview").src = activity.photo_url;
      document.getElementById("imagePreviewWrapper").style.display = "block";
      document.getElementById("fileDropText").textContent =
        "Klik untuk mengganti foto";
    }
  }

  _setupEventListeners() {
    this.form = document.getElementById("activityForm");
    this.form.addEventListener("submit", (e) => this._handleFormSubmit(e));

    const photoInput = document.getElementById("photo_file");
    const fileDropArea = document.getElementById("fileDropArea");
    const removeImageBtn = document.getElementById("removeImageBtn");

    photoInput.addEventListener("change", () =>
      this._handleImagePreview(photoInput.files[0])
    );
    removeImageBtn.addEventListener("click", () => this._resetImageSelection());
    fileDropArea.addEventListener("click", () => photoInput.click());

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
      if (e.dataTransfer.files.length > 0) {
        photoInput.files = e.dataTransfer.files;
        this._handleImagePreview(e.dataTransfer.files[0]);
      }
    });
  }

  _handleImagePreview(file) {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.getElementById("imagePreview").src = e.target.result;
        document.getElementById("imagePreviewWrapper").style.display = "block";
        document.getElementById(
          "fileDropText"
        ).textContent = `File terpilih: ${file.name}`;
      };
      reader.readAsDataURL(file);
    }
  }

  _resetImageSelection() {
    document.getElementById("photo_file").value = "";
    document.getElementById("imagePreviewWrapper").style.display = "none";
    document.getElementById("imagePreview").src = "#";
    document.getElementById("fileDropText").textContent =
      "Klik atau drag & drop foto di sini";
  }

  _setLoadingState(isLoading) {
    const submitBtn = document.getElementById("submitBtn");
    const btnText = submitBtn.querySelector(".btn-text");
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle("loading", isLoading);
    btnText.textContent = isLoading
      ? "Menyimpan..."
      : this.#activityId
      ? "Simpan Perubahan"
      : "Simpan Data Aktivitas";
  }

  async _handleFormSubmit(e) {
    e.preventDefault();
    this._setLoadingState(true);

    const formData = new FormData(this.form);

    // pastikan nilai numerik dikonversi
    const numericFields = ["category_id", "calories_burned", "duration"];
    numericFields.forEach((key) => {
      const value = formData.get(key);
      if (value !== null && value !== "" && !isNaN(value)) {
        formData.set(key, parseFloat(value));
      } else if (value === "") {
        formData.delete(key);
      }
    });

    // hapus field kosong/null
    for (let [key, value] of formData.entries()) {
      if (
        value === "" ||
        value === null ||
        value === "null" ||
        value === "undefined" ||
        Number.isNaN(value)
      ) {
        formData.delete(key);
      }
    }

    // validasi kategori
    const categoryId = formData.get("category_id");
    const categoryName = formData.get("category_name");
    if (!categoryId && !categoryName) {
      Swal.fire(
        "Error",
        "Kategori wajib diisi (pilih atau buat baru).",
        "error"
      );
      this._setLoadingState(false);
      return;
    }

    // jika tidak ada foto baru, hapus field upload
    const fileInput = document.getElementById("photo_file");
    if (fileInput && fileInput.files.length === 0) {
      formData.delete("photo_file");
    }

    try {
      if (this.#activityId) {
        await this.#model.updateActivity(this.#activityId, formData);
        await Swal.fire(
          "Sukses!",
          "Data aktivitas berhasil diperbarui.",
          "success"
        );
      } else {
        await this.#model.createActivity(formData);
        await Swal.fire(
          "Sukses!",
          "Data aktivitas berhasil ditambahkan.",
          "success"
        );
      }
      window.location.hash = "#/activities";
    } catch (error) {
      console.error("❌ Error response:", error);
      Swal.fire("Error", error.message || "Gagal menyimpan data.", "error");
    } finally {
      this._setLoadingState(false);
    }
  }
}

export default AddActivityPresenter;
