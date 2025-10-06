import { createAddFoodPageTemplate } from "../../templates/template-creator.js";
import AddFoodPresenter from "./add-food-presenter.js";  
import * as Api from "../../data/api.js";
import { getActiveRoute } from "../../routes/url-parser.js";
import '../../../styles/form-style.css'

class AddFoodPage {
  render() {
    return createAddFoodPageTemplate();
  }

  afterRender() {
    const hash = window.location.hash;
    const pathParts = hash.split("/");
    const foodId = pathParts[2];

    new AddFoodPresenter({
      view: this,
      model: Api,
      foodId: foodId === "add" ? null : foodId,
    });

    lucide.createIcons();
  }
}

export default AddFoodPage;
