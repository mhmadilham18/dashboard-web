import Swal from "sweetalert2";

class FoodsPresenter {
  #view;
  #model;
  #currentQuery = { q: "", category_id: "", page: 1, limit: 12 };
  #debounceTimer;
  #allStats = { totalFoods: 0, totalCategories: 0 };

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
    this._initialize();
  }

  async _initialize() {
    try {
      const categoriesResult = await this.#model.getFoodCategories();
      this.#allStats.totalCategories = categoriesResult.data.length;
      this.#view.displayCategories(categoriesResult.data);
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    }

    this._setupEventListeners();
    await this._loadData();
  }

  async _loadData() {
    this.#view.showLoading();
    try {
      const foodsResult = await this.#model.getFoods(this.#currentQuery);

      this.#view.displayFoods(foodsResult.data);
      this.#view.displayPagination(foodsResult.meta);
      this.#view.updateActiveCategoryButton(this.#currentQuery.category_id);

      if (this.#allStats.totalFoods === 0 && !this.#currentQuery.category_id) {
        this.#allStats.totalFoods = foodsResult.meta.total;
      }

      this.#view.updateStatCards({
        totalFoods: this.#allStats.totalFoods,
        totalCategories: this.#allStats.totalCategories,
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.message, "error");
    }
  }

  _setupEventListeners() {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", () => {
      this._debounce(() => {
        this.#currentQuery.q = searchInput.value;
        this.#currentQuery.page = 1;
        this._loadData();
      }, 500);
    });

    document
      .getElementById("categoryFilterContainer")
      .addEventListener("click", (e) => {
        const button = e.target.closest("button");
        if (button) {
          this.#currentQuery.category_id = button.dataset.id;
          this.#currentQuery.page = 1;
          this.#view.updateActiveCategoryButton(button.dataset.id);
          this._loadData();
        }
      });

    document
      .getElementById("pagination-controls")
      .addEventListener("click", (e) => {
        const button = e.target.closest("button");
        if (!button || button.disabled) return;

        if (button.id === "prevPageBtn") this.#currentQuery.page--;
        else if (button.id === "nextPageBtn") this.#currentQuery.page++;
        else this.#currentQuery.page = Number(button.dataset.page);

        this._loadData();
      });

    document
      .getElementById("foodsListContainer")
      .addEventListener("click", (e) => {
        const button = e.target.closest("button[data-action]");
        if (!button) return;

        const { id, action } = button.dataset;

        if (action === "edit") {
          window.location.hash = `#/foods/${id}`;
        } else if (action === "delete") {
          this._handleDelete(id);
        }
      });
  }

  _handleDelete(id) {
    Swal.fire({
      title: "Anda yakin?",
      text: "Data makanan ini akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.#model.deleteFood(id);
          Swal.fire("Dihapus!", "Data makanan telah dihapus.", "success");
          this.#allStats.totalFoods--;  
          this._loadData();
        } catch (error) {
          Swal.fire("Error", error.message, "error");
        }
      }
    });
  }

  _debounce(func, delay) {
    clearTimeout(this.#debounceTimer);
    this.#debounceTimer = setTimeout(func, delay);
  }
}

export default FoodsPresenter;
