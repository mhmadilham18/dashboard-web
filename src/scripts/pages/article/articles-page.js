import {
  createArticlesPageTemplate,
  createArticleCardTemplate,
} from "../../templates/template-article.js"; 
import ArticlesPresenter from "./articles-presenter.js";
import * as Api from "../../data/api.js";
import "../../../styles/article-style.css";   

class ArticlesPage {
  render() {
    return createArticlesPageTemplate();
  }

  afterRender() {
    new ArticlesPresenter({ view: this, model: Api });
    lucide.createIcons();
  }

  displayArticles(articles) {
    const container = document.getElementById("articlesListContainer");
    if (!container) return;
    container.innerHTML =
      articles.length > 0
        ? articles.map(createArticleCardTemplate).join("")
        : '<p style="text-align: center; grid-column: 1 / -1;">Tidak ada data artikel yang ditemukan.</p>';
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

  updateStatCards({ totalArticles, totalCategories }) {
    const totalArticlesStat = document.getElementById("total-articles-stat");
    const totalCategoriesStat = document.getElementById(
      "total-categories-stat"
    );
    if (totalArticlesStat) totalArticlesStat.innerText = totalArticles ?? 0;
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
    const container = document.getElementById("articlesListContainer");
    if (container)
      container.innerHTML =
        '<p style="text-align: center; grid-column: 1 / -1;">Memuat data artikel...</p>';
  }
}

export default ArticlesPage;
