import {
  createEventsPageTemplate,
  createEventCardTemplate,
} from "../../templates/template-event.js";
import EventsPresenter from "./events-presenter.js";
import * as Api from "../../data/api.js";
import "../../../styles/article-style.css";  

class EventsPage {
  render() {
    return createEventsPageTemplate();
  }

  afterRender() {
    new EventsPresenter({ view: this, model: Api });
    lucide.createIcons();
  }

  displayEvents(events) {
    const container = document.getElementById("eventsListContainer");
    if (!container) return;
    container.innerHTML =
      events.length > 0
        ? events.map(createEventCardTemplate).join("")
        : '<p style="text-align: center; grid-column: 1 / -1;">Tidak ada data event yang ditemukan.</p>';
    lucide.createIcons();
  }

  displayCategories(categories) {
    const container = document.getElementById("categoryFilterContainer");
    if (!container) return;
    let buttons = '<button class="active" data-id="">Semua Kategori</button>';
    buttons += categories
      .map((cat) => `<button data-id="${cat.id}">${cat.name}</button>`)
      .join("");
    container.innerHTML = buttons;
  }

  updateStatCards({ totalEvents, totalCategories }) {
    const totalEventsStat = document.getElementById("total-events-stat");
    const totalCategoriesStat = document.getElementById(
      "total-categories-stat"
    );
    if (totalEventsStat) totalEventsStat.innerText = totalEvents ?? 0;
    if (totalCategoriesStat)
      totalCategoriesStat.innerText = totalCategories ?? 0;
  }

  updateActiveCategoryButton(categoryId) {
    document
      .querySelectorAll("#categoryFilterContainer button")
      .forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.id === categoryId);
      });
  }

  displayPagination(meta) {
    const { page, total, limit } = meta;
    const totalPages = Math.ceil(total / limit);
    const container = document.getElementById("pagination-controls");
    if (!container || totalPages <= 1) {
      if (container) container.innerHTML = "";
      return;
    }

    let paginationHTML = `<button id="prevPageBtn" ${
      page === 1 ? "disabled" : ""
    }><i data-lucide="chevron-left"></i></button>`;
    for (let i = 1; i <= totalPages; i++) {
      paginationHTML += `<button class="${
        i === page ? "active" : ""
      }" data-page="${i}">${i}</button>`;
    }
    paginationHTML += `<button id="nextPageBtn" ${
      page >= totalPages ? "disabled" : ""
    }><i data-lucide="chevron-right"></i></button>`;
    container.innerHTML = paginationHTML;
    lucide.createIcons();
  }

  showLoading() {
    const container = document.getElementById("eventsListContainer");
    if (container)
      container.innerHTML =
        '<p style="text-align: center; grid-column: 1 / -1;">Memuat data event...</p>';
  }
}

export default EventsPage;
