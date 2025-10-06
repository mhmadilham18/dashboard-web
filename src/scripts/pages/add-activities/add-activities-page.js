import { createAddActivityPageTemplate } from "../../templates/template-creator.js";
import AddActivityPresenter from "./add-activities-presenter.js";
import * as Api from "../../data/api.js";
import "../../../styles/form-style.css";

class AddActivityPage {
  render() {
    return createAddActivityPageTemplate();
  }

  afterRender() {
    const hash = window.location.hash;
    const pathParts = hash.split("/");
    const activityId = pathParts[2];

    new AddActivityPresenter({
      view: this,
      model: Api,
      activityId: activityId === "add" ? null : activityId,
    });

    lucide.createIcons();
  }
}

export default AddActivityPage;
