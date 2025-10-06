const formatDate = (isoString) => {
  if (!isoString) return "Tanggal tidak tersedia";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(isoString).toLocaleDateString("id-ID", options);
};


export const createArticlesPageTemplate = () => `
  <div class="page-header">
    <h1>Manajemen Artikel</h1>
    <p>Tambah, lihat, perbarui, atau hapus artikel edukasi untuk pengguna.</p>
  </div>
  <div class="stat-cards-container">
    <div class="stat-card-alt">
        <div class="stat-icon"><i data-lucide="file-text"></i></div>
        <div class="stat-content">
            <h4>Total Artikel</h4>
            <p id="total-articles-stat" class="stat-value">0</p>
        </div>
    </div>
    <div class="stat-card-alt">
        <div class="stat-icon"><i data-lucide="folder-open"></i></div>
        <div class="stat-content">
            <h4>Total Kategori</h4>
            <p id="total-categories-stat" class="stat-value">0</p>
        </div>
    </div>
    <div class="stat-card-alt">
      <div class="stat-icon">
        <i data-lucide="circle-plus"></i>
      </div>
      <div class="stat-content">
        <h4>Total Data Ditambahkan</h4>
        <p class="stat-value">2</p>
      </div>
    </div>
  </div>
  <div class="card-table-header">
    <div class="search-filter-container">
      <div class="input-icon-wrapper">
        <i data-lucide="search"></i>
        <input type="search" id="searchInput" placeholder="Cari judul artikel...">
      </div>
    </div>
    <a href="#/articles/add" class="btn-primary">
      <i data-lucide="plus"></i> Tambah Artikel
    </a>
  </div>
  <div class="filters-wrapper">
    <div id="categoryFilterContainer" class="category-filters"></div>
  </div>
  <div id="articlesListContainer" class="articles-grid"></div>
  <div class="card-table-footer">
    <div id="pagination-controls" class="pagination"></div>
  </div>
`;

// src/scripts/templates/template-article.js

// ... (kode lainnya tetap sama)

export const createArticleCardTemplate = (article) => `
  <div class="article-card">
    <img src="${article.cover_url || "./images/placeholder-image.jpg"}" alt="${
  article.title
}" class="article-card-cover">
    <div class="article-card-body">
      <h3 class="article-card-title">${article.title}</h3>
      <p class="article-card-meta">${formatDate(
        article.created_at
      )} - Tim Sahabat Gula</p>
      <div class="article-card-actions">
        
        <a href="#/articles/${
          article.id
        }" class="btn-secondary"><i data-lucide="pencil"></i> Edit</a>
        <button class="btn-danger" data-id="${
          article.id
        }" data-action="delete"><i data-lucide="trash-2"></i> Hapus</button>
      </div>
    </div>
  </div>
`;



export const createArticleFormTemplate = (article = {}) => {
  const isEdit = !!article.id;
  return `
    <div class="form-container">
      <div class="card-header">
          <div class="header-icon"><i data-lucide="file-pen-line" style="width:28px; height:28px;"></i></div>
          <div>
              <h1 class="card-title">${
                isEdit ? "Edit Artikel" : "Formulir Artikel Baru"
              }</h1>
              <p class="card-subtitle">${
                isEdit
                  ? "Perbarui detail artikel di bawah ini."
                  : "Lengkapi semua field yang dibutuhkan."
              }</p>
          </div>
      </div>
      <form id="articleForm" class="card-body" data-id="${article.id || ""}">
        <div class="form-group span-2">
            <label for="title">Judul Artikel <span class="required">*</span></label>
            <input type="text" id="title" name="title" value="${
              article.title || ""
            }" placeholder="Judul yang menarik..." required>
        </div>
        <div class="form-group">
            <label for="category_id">Kategori</label>
            <div class="select-wrapper"><select id="category_id" name="category_id"></select></div>
        </div>
        <div class="form-group">
            <label for="category_name">Atau Buat Kategori Baru</label>
            <input type="text" id="category_name" name="category_name" placeholder="cth: Gaya Hidup Sehat">
        </div>
        <div class="form-group span-2">
            <label for="cover_file">Gambar Sampul</label>
            <div class="file-upload-wrapper">
                <input type="file" id="cover_file" name="cover_file" accept="image/*" class="file-input">
                <div id="fileDropArea" class="file-drop-area"><p>${
                  article.cover_url
                    ? "Klik untuk mengganti gambar"
                    : "Klik atau drag & drop gambar"
                }</p></div>
            </div>
            <div id="imagePreviewWrapper" class="image-preview-wrapper" style="${
              article.cover_url ? "display: block;" : ""
            }">
                <img id="imagePreview" src="${
                  article.cover_url || "#"
                }" class="image-preview" alt="Pratinjau">
                <button type="button" id="removeImageBtn" class="remove-image-btn">&times;</button>
            </div>
        </div>
        <div class="form-group span-2">
            <label>Konten Artikel</label>
            <div id="editor"></div>
        </div>
        <div class="form-footer span-2">
            <button type="submit" id="submitBtn" class="submit-btn">
                <span class="spinner"></span>
                <span class="btn-text">${
                  isEdit ? "Simpan Perubahan" : "Simpan Artikel"
                }</span>
            </button>
        </div>
      </form>
    </div>`;
};

export const createSidebarArticleTemplate = (article) => `
  <a href="#/articles/detail/${article.id}" class="sidebar-article-card">
    <img src="${article.cover_url || "./images/placeholder-image.jpg"}" alt="${
  article.title
}">
    <div>
      <h4>${article.title}</h4>
    </div>
  </a>
`;
