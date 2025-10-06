import Swal from "sweetalert2";

class ArticlesPresenter {
  #view;
  #model;
  #currentQuery = { q: "", category_id: "", page: 1, limit: 10 };
  #debounceTimer;
  #allStats = { totalArticles: 0, totalCategories: 0 };

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
    this._initialize();
  }

  async _initialize() {
    try {
      const categoriesResult = await this.#model.getArticleCategories();
      this.#allStats.totalCategories = categoriesResult.data.length;
      this.#view.displayCategories(categoriesResult.data);
    } catch (error) {
      console.error("Gagal memuat kategori artikel:", error);
    }

    this._setupEventListeners();
    await this._loadData();
  }

  async _loadData() {
    this.#view.showLoading();
    try {
      const articlesResult = await this.#model.getArticles(this.#currentQuery);
      this.#view.displayArticles(articlesResult.data);
      this.#view.displayPagination(articlesResult.meta);
      this.#view.updateActiveCategoryButton(this.#currentQuery.category_id);

      if (
        this.#allStats.totalArticles === 0 &&
        !this.#currentQuery.category_id &&
        !this.#currentQuery.q
      ) {
        this.#allStats.totalArticles = articlesResult.meta.total;
      }

      this.#view.updateStatCards({
        totalArticles: this.#allStats.totalArticles,
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

    const categoryContainer = document.getElementById(
      "categoryFilterContainer"
    );
    categoryContainer.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (button) {
        this.#currentQuery.category_id = button.dataset.id;
        this.#currentQuery.page = 1;
        this._loadData();
      }
    });

    const paginationContainer = document.getElementById("pagination-controls");
    paginationContainer.addEventListener("click", (e) => {
      const button = e.target.closest("button");
      if (!button || button.disabled) return;
      if (button.id === "prevPageBtn") this.#currentQuery.page--;
      else if (button.id === "nextPageBtn") this.#currentQuery.page++;
      else this.#currentQuery.page = Number(button.dataset.page);
      this._loadData();
    });

    const listContainer = document.getElementById("articlesListContainer");
    listContainer.addEventListener("click", (e) => {
      const button = e.target.closest('button[data-action="delete"]');
      if (!button) return;
      const { id } = button.dataset;
      this._handleDelete(id);
    });
  }

  _handleDelete(id) {
    Swal.fire({
      title: "Anda yakin?",
      text: "Artikel ini akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.#model.deleteArticle(id);
          Swal.fire("Dihapus!", "Data artikel telah dihapus.", "success");
          this.#allStats.totalArticles--;
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

export default ArticlesPresenter;
