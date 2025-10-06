import { createNotFoundPageTemplate } from "../../templates/template-creator.js";

class NotFoundPage {
  render() {
    return createNotFoundPageTemplate();
  }

  afterRender() {
    // Tidak ada aksi setelah render untuk halaman ini
  }
}

export default NotFoundPage;
