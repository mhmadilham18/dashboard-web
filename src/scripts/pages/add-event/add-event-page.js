import AddEventPresenter from "./add-event-presenter.js";
import * as Api from "../../data/api.js";
import "../../../styles/form-article-style.css";  

class AddEventPage {
  render() {
    return `
      <a href="#/events" class="back-link"><i data-lucide="arrow-left"></i> Kembali ke Daftar Event</a>
      <div id="form-container-wrapper"></div>
    `;
  }

  afterRender() {
    const hash = window.location.hash;
    const pathParts = hash.split("/");
    const eventId = pathParts[2] === "add" ? null : pathParts[2];

    new AddEventPresenter({
      container: document.getElementById("form-container-wrapper"),
      model: Api,
      eventId,
    });
  }
}

export default AddEventPage;
