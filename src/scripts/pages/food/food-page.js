import {
  createFoodsPageTemplate,
  createFoodCardTemplate,
} from "../../templates/template-creator.js";
import FoodsPresenter from "./food-presenter.js";
import * as Api from "../../data/api.js";
import "../../../styles/food-style.css";

class FoodsPage {
  render() {
    return createFoodsPageTemplate();
  }

  afterRender() {
    this._presenter = new FoodsPresenter({ view: this, model: Api });
    lucide.createIcons();
  }

  displayFoods(foods) {
    const container = document.getElementById("foodsListContainer");
    container.innerHTML =
      foods.length > 0
        ? foods.map(createFoodCardTemplate).join("")
        : "<p>Tidak ada data makanan yang ditemukan.</p>";
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

  updateStatCards({ totalFoods, totalCategories }) {
    if (document.getElementById("total-foods-stat")) {
      document.getElementById("total-foods-stat").innerText = totalFoods ?? 0;
    }
    if (document.getElementById("total-categories-stat")) {
      document.getElementById("total-categories-stat").innerText =
        totalCategories ?? 0;
    }
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
    document.getElementById("foodsListContainer").innerHTML =
      "<p>Memuat data makanan...</p>";
  }
}

export default FoodsPage;
