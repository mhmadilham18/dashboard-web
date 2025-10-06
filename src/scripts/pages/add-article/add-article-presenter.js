import Swal from "sweetalert2";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { createArticleFormTemplate } from "../../templates/template-article.js";

class AddArticlePresenter {
  #container;
  #model;
  #articleId;
  #quill;
  #removedCover = false;  

  constructor({ container, model, articleId }) {
    this.#container = container;
    this.#model = model;
    this.#articleId = articleId;
    this._initialize();
  }

  async _initialize() {
    this.#container.innerHTML = createArticleFormTemplate();
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
      placeholder: "Tuliskan konten artikel di sini...",
    });
  }

  async _populateInitialData() {
    await this._loadCategories();

    if (this.#articleId) {
      try {
        const result = await this.#model.getArticleById(this.#articleId);
        const articleData = result.data.article || result.data;
        if (articleData && typeof articleData === "object") {
          this._fillForm(articleData);
        } else {
          throw new Error(
            "Format data artikel tidak valid atau tidak ditemukan."
          );
        }
      } catch (e) {
        Swal.fire("Error", `Gagal memuat data artikel: ${e.message}`, "error");
        window.location.hash = "#/articles";
      }
    }
  }

  async _loadCategories() {
    try {
      const categoriesResult = await this.#model.getArticleCategories();
      const categorySelect = document.getElementById("category_id");
      categorySelect.innerHTML = '<option value="">Pilih Kategori...</option>';
      categoriesResult.data.forEach((cat) => {
        categorySelect.add(new Option(cat.name, cat.id));
      });
    } catch (e) {
      console.error("Gagal memuat kategori:", e);
    }
  }

  _fillForm(article) {
    this.#removedCover = false;
    document.getElementById("title").value = article.title || "";

    if (article.cover_url) {
      document.getElementById("imagePreview").src = article.cover_url;
      document.getElementById("imagePreviewWrapper").style.display = "block";
    }

    document.getElementById("category_id").value = article.category_id || "";

    if (article.content) {
      try {
        const delta = JSON.parse(article.content);
        if (delta && delta.ops) {
          this.#quill.setContents(delta, "silent");
        } else {
          throw new Error("Format Delta tidak valid");
        }
      } catch (e) {
        console.warn("Konten bukan JSON valid, fallback ke HTML:", e.message);
        this.#quill.root.innerHTML = article.content;
      }
    }
  }

  _setupEventListeners() {
    this.form = document.getElementById("articleForm");
    this.form.addEventListener("submit", (e) => this._handleFormSubmit(e));

    const coverInput = document.getElementById("cover_file");
    const fileDropArea = document.getElementById("fileDropArea");
    const removeImageBtn = document.getElementById("removeImageBtn");

    coverInput.addEventListener("change", () => {
      this.#removedCover = false;
      this._handleImagePreview(coverInput.files[0]);
    });

    removeImageBtn.addEventListener("click", () => {
      this.#removedCover = true;
      this._resetImageSelection();
    });

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

    const htmlContent = this.#quill.root.innerHTML.trim();
    if (htmlContent && htmlContent !== "<p><br></p>") {
      formData.append("content", htmlContent);
    }

    for (let [key, value] of formData.entries()) {
      if ((value === "" || value === null) && key !== "content") {
        formData.delete(key);
      }
    }

    const categoryId = formData.get("category_id");
    const categoryName = formData.get("category_name");
    if (!categoryId && !categoryName) {
      Swal.fire("Validasi Gagal", "Pilih atau buat kategori baru.", "error");
      this._setLoadingState(false);
      return;
    }

    const fileInput = document.getElementById("cover_file");
    if (this.#articleId) {
      if (this.#removedCover) {
        formData.append("remove_cover", "1");
        formData.delete("cover_file");
      } else if (!fileInput || fileInput.files.length === 0) {
        formData.delete("cover_file");
      }
    }

    try {
      if (this.#articleId) {
        await this.#model.updateArticle(this.#articleId, formData);
        await Swal.fire("Sukses!", "Artikel berhasil diperbarui.", "success");
      } else {
        await this.#model.createArticle(formData);
        await Swal.fire("Sukses!", "Artikel berhasil ditambahkan.", "success");
      }
      window.location.hash = "#/articles";
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
      : this.#articleId
      ? "Simpan Perubahan"
      : "Simpan Artikel";
  }
}

export default AddArticlePresenter;
