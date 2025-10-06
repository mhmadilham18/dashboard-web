import Swal from "sweetalert2";

class EventsPresenter {
  #view;
  #model;
  #currentQuery = { q: "", category_id: "", page: 1, limit: 10 };
  #debounceTimer;
  #allStats = { totalEvents: 0, totalCategories: 0 };

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
    this._initialize();
  }

  async _initialize() {
    try {
      const categoriesResult = await this.#model.getEventCategories();
      this.#allStats.totalCategories = categoriesResult.data.length;
      this.#view.displayCategories(categoriesResult.data);
    } catch (error) {
      console.error("Gagal memuat kategori event:", error);
    }

    this._setupEventListeners();
    await this._loadData();
  }

  async _loadData() {
    this.#view.showLoading();
    try {
      const eventsResult = await this.#model.getEvents(this.#currentQuery);
      this.#view.displayEvents(eventsResult.data);
      this.#view.displayPagination(eventsResult.meta);
      this.#view.updateActiveCategoryButton(this.#currentQuery.category_id);

      if (
        this.#allStats.totalEvents === 0 &&
        !this.#currentQuery.category_id &&
        !this.#currentQuery.q
      ) {
        this.#allStats.totalEvents = eventsResult.meta.total;
      }

      this.#view.updateStatCards({
        totalEvents: this.#allStats.totalEvents,
        totalCategories: this.#allStats.totalCategories,
      });
    } catch (error) {
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

    const listContainer = document.getElementById("eventsListContainer");
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
      text: "Event ini akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await this.#model.deleteEvent(id);
          Swal.fire("Dihapus!", "Data event telah dihapus.", "success");
          this.#allStats.totalEvents--;
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

export default EventsPresenter;
