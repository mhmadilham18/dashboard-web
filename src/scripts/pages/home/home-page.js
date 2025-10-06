import { createOverviewPageTemplate } from "../../templates/template-overview.js";
import OverviewPresenter from "./home-presenter.js";
import * as Api from "../../data/api.js";
import "../../../styles/overview-style.css";

class OverviewPage {
  render() {
    return createOverviewPageTemplate();
  }

  afterRender() {
    new OverviewPresenter({ view: this, model: Api });   
  }
}

export default OverviewPage;
