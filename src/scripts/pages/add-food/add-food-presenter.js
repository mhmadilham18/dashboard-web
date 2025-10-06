import Swal from "sweetalert2";

class AddFoodPresenter {
  #view;
  #model;
  #foodId;

  constructor({ view, model, foodId }) {
    this.#view = view;
    this.#model = model;
    this.#foodId = foodId;
    this._initialize();
  }

  async _initialize() {
    await this._populateInitialData();
    this._setupEventListeners();
  }

  async _populateInitialData() {
    try {
      const categoriesResult = await this.#model.getFoodCategories();
      const categorySelect = document.getElementById("category_id");
      categorySelect.innerHTML = '<option value="">Pilih Kategori...</option>';
      categoriesResult.data.forEach((cat) =>
        categorySelect.add(new Option(cat.name, cat.id))
      );
    } catch {
      Swal.fire("Error", "Gagal memuat kategori makanan.", "error");
    }

    if (this.#foodId) {
      document.querySelector(".card-title").innerText = "Edit Data Makanan";
      document.querySelector(".card-subtitle").innerText =
        "Perbarui detail makanan di bawah ini.";
      document.querySelector("#submitBtn .btn-text").innerText =
        "Simpan Perubahan";

      try {
        const foodData = await this.#model.getFoodById(this.#foodId);
        if (foodData?.data?.food) {
          this._fillForm(foodData.data.food);
        } else {
          Swal.fire(
            "Error",
            "Data makanan dengan ID ini tidak ditemukan.",
            "error"
          );
          window.location.hash = "#/foods";
        }
      } catch {
        Swal.fire("Error", "Gagal memuat data makanan untuk diedit.", "error");
        window.location.hash = "#/foods";
      }
    }
  }

  _fillForm(food) {
    const setVal = (id, val) => (document.getElementById(id).value = val || "");
    setVal("name", food.name);
    setVal("description", food.description);
    setVal("category_id", food.category_id);
    setVal("serving_size", food.serving_size);
    setVal("serving_unit", food.serving_unit);
    setVal("weight_size", food.weight_size);
    setVal("weight_unit", food.weight_unit);
    setVal("calories", food.calories);
    setVal("carbs", food.carbs);
    setVal("protein", food.protein);
    setVal("fat", food.fat);
    setVal("sugar", food.sugar);
    setVal("sodium", food.sodium ? food.sodium * 1000 : "");
    setVal("fiber", food.fiber);
    setVal("potassium", food.potassium ? food.potassium * 1000 : "");

    if (food.photo_url) {
      document.getElementById("imagePreview").src = food.photo_url;
      document.getElementById("imagePreviewWrapper").style.display = "block";
      document.getElementById("fileDropText").textContent =
        "Klik untuk mengganti foto";
    }
  }

  _setupEventListeners() {
    this.form = document.getElementById("foodForm");
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
      : this.#foodId
      ? "Simpan Perubahan"
      : "Simpan Data Makanan";
  }

  async _handleFormSubmit(e) {
    e.preventDefault();
    this._setLoadingState(true);

    const formData = new FormData(this.form);

    const numericFields = [
      "category_id",
      "serving_size",
      "weight_size",
      "calories",
      "carbs",
      "protein",
      "fat",
      "sugar",
      "sodium",
      "fiber",
      "potassium",
    ];

    numericFields.forEach((key) => {
      const value = formData.get(key);
      if (value !== null && value !== "" && !isNaN(value)) {
        formData.set(key, parseFloat(value));
      } else if (value === "") {
        formData.delete(key);
      }
    });

    const sodium = formData.get("sodium");
    const potassium = formData.get("potassium");
    if (sodium) formData.set("sodium", parseFloat(sodium) / 1000);
    if (potassium) formData.set("potassium", parseFloat(potassium) / 1000);

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

    const fileInput = document.getElementById("photo_file");
    if (fileInput && fileInput.files.length === 0) {
      formData.delete("photo_file");
    }

    try {
      if (this.#foodId) {
        await this.#model.updateFood(this.#foodId, formData);
        await Swal.fire(
          "Sukses!",
          "Data makanan berhasil diperbarui.",
          "success"
        );
      } else {
        await this.#model.createFood(formData);
        await Swal.fire(
          "Sukses!",
          "Data makanan berhasil ditambahkan.",
          "success"
        );
      }
      window.location.hash = "#/foods";
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      this._setLoadingState(false);
    }
  }
}

export default AddFoodPresenter;
