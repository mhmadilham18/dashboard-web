// src/scripts/templates/template-event.js

const formatDate = (isoString) => {
  if (!isoString) return "Tanggal tidak tersedia";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(isoString).toLocaleDateString("id-ID", options);
};

// Helper untuk format YYYY-MM-DD
const formatDateForInput = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  // Menyesuaikan dengan timezone lokal agar tanggal tidak bergeser
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().split("T")[0];
};

export const createEventsPageTemplate = () => `
  <div class="page-header">
    <h1>Manajemen Event</h1>
    <p>Tambah, perbarui, atau hapus data event untuk pengguna.</p>
  </div>
  <div class="stat-cards-container">
    <div class="stat-card-alt">
        <div class="stat-icon"><i data-lucide="calendar-check"></i></div>
        <div class="stat-content">
            <h4>Total Event</h4>
            <p id="total-events-stat" class="stat-value">0</p>
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
        <input type="search" id="searchInput" placeholder="Cari judul event...">
      </div>
    </div>
    <a href="#/events/add" class="btn-primary">
      <i data-lucide="plus"></i> Tambah Event
    </a>
  </div>
  <div class="filters-wrapper">
    <div id="categoryFilterContainer" class="category-filters"></div>
  </div>
  <div id="eventsListContainer" class="articles-grid"></div>
  <div class="card-table-footer">
    <div id="pagination-controls" class="pagination"></div>
  </div>
`;

export const createEventCardTemplate = (event) => `
  <div class="article-card">
    <img src="${event.cover_url || "./images/placeholder-image.jpg"}" alt="${
  event.title
}" class="article-card-cover">
    <div class="article-card-body">
      <h3 class="article-card-title">${event.title}</h3>
      <p class="article-card-meta">
        <i data-lucide="calendar" class="icon-meta"></i> ${formatDate(
          event.event_date
        )}
      </p>
      <p class="article-card-meta">
        <i data-lucide="map-pin" class="icon-meta"></i> ${
          event.location || "Lokasi tidak ditentukan"
        }
      </p>
      <div class="article-card-actions">
        <a href="#/events/${
          event.id
        }" class="btn-secondary"><i data-lucide="pencil"></i> Edit</a>
        <button class="btn-danger" data-id="${
          event.id
        }" data-action="delete"><i data-lucide="trash-2"></i> Hapus</button>
      </div>
    </div>
  </div>
`;

export const createEventFormTemplate = (event = {}) => {
  const isEdit = !!event.id;
  return `
    <div class="form-container">
      <div class="card-header">
          <div class="header-icon"><i data-lucide="calendar-plus" style="width:28px; height:28px;"></i></div>
          <div>
              <h1 class="card-title">${
                isEdit ? "Edit Event" : "Formulir Event Baru"
              }</h1>
              <p class="card-subtitle">${
                isEdit
                  ? "Perbarui detail event di bawah ini."
                  : "Lengkapi semua field yang dibutuhkan."
              }</p>
          </div>
      </div>
      <form id="eventForm" class="card-body" data-id="${event.id || ""}">
        <div class="form-group span-2">
            <label for="title">Judul Event <span class="required">*</span></label>
            <input type="text" id="title" name="title" value="${
              event.title || ""
            }" placeholder="Judul yang menarik..." required>
        </div>

        <div class="form-group">
            <label for="event_date">Tanggal Event <span class="required">*</span></label>
            <input type="date" id="event_date" name="event_date" value="${
              formatDateForInput(event.event_date) || ""
            }" required>
        </div>
        <div class="form-group form-group-inline">
            <div>
              <label for="event_start">Waktu Mulai <span class="required">*</span></label>
              <input type="time" id="event_start" name="event_start" value="${
                event.event_start || ""
              }" required>
            </div>
            <div>
              <label for="event_end">Waktu Selesai <span class="required">*</span></label>
              <input type="time" id="event_end" name="event_end" value="${
                event.event_end || ""
              }" required>
            </div>
        </div>

        <div class="form-group">
            <label for="category_id">Kategori</label>
            <div class="select-wrapper"><select id="category_id" name="category_id"></select></div>
        </div>
        <div class="form-group">
            <label for="category_name">Atau Buat Kategori Baru</label>
            <input type="text" id="category_name" name="category_name" placeholder="cth: Webinar">
        </div>
        
        <div class="form-group">
            <label for="location">Lokasi</label>
            <input type="text" id="location" name="location" value="${
              event.location || ""
            }" placeholder="cth: Zoom Meeting">
        </div>
        <div class="form-group">
            <label for="location_detail">Detail Lokasi</label>
            <input type="text" id="location_detail" name="location_detail" value="${
              event.location_detail || ""
            }" placeholder="Link atau alamat lengkap...">
        </div>

        <div class="form-group span-2">
            <label for="cover_file">Gambar Sampul</label>
            <div class="file-upload-wrapper">
                <input type="file" id="cover_file" name="cover_file" accept="image/*" class="file-input">
                <div id="fileDropArea" class="file-drop-area"><p>${
                  event.cover_url
                    ? "Klik untuk mengganti gambar"
                    : "Klik atau drag & drop gambar"
                }</p></div>
            </div>
            <div id="imagePreviewWrapper" class="image-preview-wrapper" style="${
              event.cover_url ? "display: block;" : ""
            }">
                <img id="imagePreview" src="${
                  event.cover_url || "#"
                }" class="image-preview" alt="Pratinjau">
                <button type="button" id="removeImageBtn" class="remove-image-btn">&times;</button>
            </div>
        </div>

        <div class="form-group span-2">
            <label>Deskripsi Event</label>
            <div id="editor"></div>
        </div>

        <div class="form-footer span-2">
            <button type="submit" id="submitBtn" class="submit-btn">
                <span class="spinner"></span>
                <span class="btn-text">${
                  isEdit ? "Simpan Perubahan" : "Simpan Event"
                }</span>
            </button>
        </div>
      </form>
    </div>`;
};
