import AddArticlePresenter from "./add-article-presenter.js";
import * as Api from "../../data/api.js";
import "../../../styles/form-article-style.css";

class AddArticlePage {
  render() {
    return `
      <a href="#/articles" class="back-link"><i data-lucide="arrow-left"></i> Kembali ke Daftar Artikel</a>
      <div id="form-container-wrapper"></div>
    `;
  }

  afterRender() {
    const hash = window.location.hash;
    const pathParts = hash.split("/");
    const articleId = pathParts[2] === "add" ? null : pathParts[2];

    console.log("📝 Article ID from URL:", articleId);
    new AddArticlePresenter({
      container: document.getElementById("form-container-wrapper"),
      model: Api,
      articleId,
    });
  }
}

export default AddArticlePage;
