import {
  createActivitiesPageTemplate,
  createActivityCardTemplate,
} from "../../templates/template-creator.js";
import ActivitiesPresenter from "./activities-presenter.js";
import * as Api from "../../data/api.js";
import "../../../styles/food-style.css";  

class ActivitiesPage {
  render() {
    return createActivitiesPageTemplate();
  }

  afterRender() {
    new ActivitiesPresenter({ view: this, model: Api });
    lucide.createIcons();
  }

  displayActivities(activities) {
    const container = document.getElementById("activitiesListContainer");
    container.innerHTML =
      activities.length > 0
        ? activities.map(createActivityCardTemplate).join("")
        : "<p>Tidak ada data aktivitas yang ditemukan.</p>";
    lucide.createIcons();
  }

  displayCategories(categories) {
    const container = document.getElementById("categoryFilterContainer");
    let buttons = '<button class="active" data-id="">Semua</button>';
    buttons += categories
      .map((cat) => `<button data-id="${cat.id}">${cat.name}</button>`)
      .join("");
    container.innerHTML = buttons;
  }

  updateStatCards({ totalActivities, totalCategories }) {
    document.getElementById("total-activities-stat").innerText =
      totalActivities ?? 0;
    document.getElementById("total-categories-stat").innerText =
      totalCategories ?? 0;
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
    if (totalPages <= 1) {
      container.innerHTML = "";
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
    document.getElementById("activitiesListContainer").innerHTML =
      "<p>Memuat data aktivitas...</p>";
  }
}

export default ActivitiesPage;
