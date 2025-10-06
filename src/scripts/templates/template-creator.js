const menuData = [
  { type: "title", label: "Menu" },
  { type: "link", label: "Overview", href: "#/home", icon: "layout-grid" },

  {
    type: "link",
    label: "Data Makanan",
    href: "#/foods",
    icon: "utensils-crossed",
  },
  {
    type: "link",
    label: "Data Aktivitas",
    href: "#/activities",
    icon: "activity",
  },

  {
    type: "link",
    label: "Artikel",
    href: "#/articles",
    icon: "file-text",
  },
  { type: "link", label: "Event", href: "#/events", icon: "calendar" },
];

// Fungsi untuk membuat template navigasi sidebar berdasarkan menuData
export const createSidebarNavTemplate = () => {
  const navItems = menuData
    .map((item) => {
      if (item.type === "title") {
        return `<li class="nav-title">${item.label}</li>`;
      }
      if (item.type === "link") {
        return `
        <li>
          <a href="${item.href}" class="nav-link" data-path="${item.href}">
            <i data-lucide="${item.icon}"></i>
            <span class="nav-text">${item.label}</span>
          </a>
        </li>
      `;
      }
      if (item.type === "parent") {
        const childLinks = item.children
          .map(
            (child) => `
        <li><a href="${child.href}" data-path="${child.href}">${child.label}</a></li>
      `
          )
          .join("");
        return `
        <li>
          <details class="nav-group">
            <summary class="nav-parent">
              <i data-lucide="${item.icon}"></i>
              <span class="nav-text">${item.label}</span>
              <span class="arrow"><i data-lucide="chevron-down"></i></span>
            </summary>
            <ul class="nav-children">${childLinks}</ul>
          </details>
        </li>
      `;
      }
      return "";
    })
    .join("");
  return `<ul>${navItems}</ul>`;
};

// Template untuk Halaman Login
export const createLoginPageTemplate = () => `
  <div class="login-page-container">
    <div class="login-container">
      <div class="login-left">
        <div class="login-header"><h2>Selamat Datang Kembali</h2><p>Silakan masuk untuk mulai pengelolaan.</p></div>
        <form id="loginForm" class="login-form">
          <div class="form-group"><label for="email">Alamat Email</label><div class="input-wrapper"><input type="email" id="email" name="email" placeholder="contoh@sahabatgula.com" required/></div></div>
          <div class="form-group"><label for="password">Password</label><div class="input-wrapper"><input type="password" id="password" name="password" placeholder="Masukkan password Anda" required/></div></div>
          <div id="submit-container"><button type="submit" class="submit-btn"><span class="btn-text">Masuk</span></button></div>
        </form>
      </div>
      <div class="login-right"><div class="login-right-content"><h3>Analisis Data Menjadi Lebih Mudah</h3><p>Pantau metrik penting dan kelola konten secara efisien.</p></div></div>
    </div>
  </div>
`;

// Template untuk Layout Utama Dashboard
export const createDashboardLayoutTemplate = () => `
  <aside id="sidebar" class="sidebar">
    <div class="sidebar-header">
      <a class="brand-link" href="#/">
        <img src="/images/logo.png" alt="Logo" class="brand-logo" />
        <span class="brand-text">Sahabat Gula</span>
      </a>
    </div>
    <nav id="sidebar-nav" class="sidebar-nav">
      ${createSidebarNavTemplate()}
      
      <ul class="mt-auto p-4">
        <li>
          <a href="#" id="logoutButton" class="nav-link">
            <i data-lucide="log-out"></i>
            <span class="nav-text">Logout</span>
          </a>
        </li>
      </ul>
    </nav>
  </aside>

  <div class="main-wrapper">
    <header class="header">
      <div class="header-left">
        <button id="sidebar-toggle-mobile" class="sidebar-toggle mobile-toggle"><i data-lucide="menu"></i></button>
        <button id="sidebar-toggle-desktop" class="sidebar-toggle desktop-toggle"><i data-lucide="menu"></i></button>
      </div>
      <div class="header-right">
        <div class="user-profile">
          <span id="user-name" class="user-name">Loading...</span>
          <div id="user-avatar" class="user-avatar">?</div>
        </div>
      </div>
    </header>
    <main id="main-content" class="main-content" tabindex="-1"></main>
  </div>
`;

// Template Navigasi
export const createAuthenticatedNavTemplate = () => `
  <a href="#/home">Overview</a>
  <a href="#/articles">Articles</a>
  <a href="#" id="logoutButton">Logout</a>
`;

export const createUnauthenticatedNavTemplate = () => `
  <a href="#/login">Login</a>
`;

// Template Halaman Home
export const createHomePageTemplate = () => `
  <div class="page-header">
    <h1 id="welcome-title">Dashboard Overview</h1>
    <p id="welcome-message">Selamat datang kembali!</p>
  </div>

  
`;

// Template Halaman Not Found
export const createNotFoundPageTemplate = () => `
  <div class="not-found-page">
    <div class="not-found-content">
      <h1 class="not-found-title">
        ERROR 404
      </h1>
  
      <p class="not-found-text">
        Halaman yang Anda cari tidak dapat ditemukan!
      </p>

      <a href="/#/" class="not-found-button">
        Kembali ke Halaman Utama
      </a>
    </div>
  </div>
`;

// Template form tambah/edit makanan
export const createFoodFormTemplate = (food = {}) => {
  const isEdit = !!food.id;
  // Konversi kembali ke mg untuk ditampilkan di form jika mode edit
  const sodiumMg = food.sodium ? food.sodium * 1000 : "";
  const potassiumMg = food.potassium ? food.potassium * 1000 : "";

  return `
    <div class="card" style="box-shadow: none;">
      <div class="card-header">
        <div class="header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <div>
          <h1 class="card-title">${
            isEdit ? "Edit Data Makanan" : "Formulir Input Makanan"
          }</h1>
          <p class="card-subtitle">${
            isEdit
              ? "Perbarui detail makanan di bawah ini."
              : "Lengkapi semua field yang dibutuhkan."
          }</p>
        </div>
      </div>
      
      <form id="foodForm" class="card-body" data-id="${food.id || ""}">
        <div class="form-group span-2">
            <label for="name">Nama Makanan <span class="required">*</span></label>
            <input type="text" id="name" name="name" placeholder="cth: Bakso Mercon" value="${
              food.name || ""
            }" required>
        </div>

        <div class="form-group span-2">
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" placeholder="Deskripsi singkat makanan...">${
              food.description || ""
            }</textarea>
        </div>

        <div class="form-group">
            <label for="category_id">Kategori</label>
            <div class="select-wrapper">
                <select id="category_id" name="category_id">
                    </select>
            </div>
        </div>
        <div class="form-group">
            <label for="category_name">Atau Buat Kategori Baru</label>
            <input type="text" id="category_name" name="category_name" placeholder="cth: Olahan Ayam">
        </div>

        <div class="form-group span-2">
            <label for="photo_file">Foto Makanan (Max 5MB)</label>
            <div class="file-upload-wrapper">
                <input type="file" id="photo_file" name="photo_file" accept="image/*" class="file-input">
                <div id="fileDropArea" class="file-drop-area">
                    <p id="fileDropText" class="file-text">${
                      food.photo_url
                        ? "Klik untuk mengganti foto"
                        : "Klik atau drag & drop foto di sini"
                    }</p>
                </div>
            </div>
            <div id="imagePreviewWrapper" class="image-preview-wrapper" style="${
              food.photo_url ? "display: block;" : "display: none;"
            }">
                <img id="imagePreview" class="image-preview" src="${
                  food.photo_url || "#"
                }" alt="Pratinjau Gambar">
                <button type="button" id="removeImageBtn" class="remove-image-btn" title="Hapus Gambar">&times;</button>
            </div>
        </div>
        
        <hr class="separator span-2">

        <h3 class="section-title span-2">Informasi Porsi & Berat</h3>
        <div class="form-group">
            <label for="serving_size">Ukuran Porsi <span class="required">*</span></label>
            <input type="number" id="serving_size" name="serving_size" placeholder="cth: 1" value="${
              food.serving_size || ""
            }" required>
        </div>
        <div class="form-group">
            <label for="serving_unit">Satuan Porsi</label>
            <input type="text" id="serving_unit" name="serving_unit" placeholder="cth: piring, mangkuk" value="${
              food.serving_unit || ""
            }">
        </div>
        <div class="form-group">
            <label for="weight_size">Berat <span class="required">*</span></label>
            <input type="number" id="weight_size" name="weight_size" placeholder="cth: 250" value="${
              food.weight_size || ""
            }" required>
        </div>
        <div class="form-group">
            <label for="weight_unit">Satuan Berat</label>
            <input type="text" id="weight_unit" name="weight_unit" placeholder="cth: gr, mg" value="${
              food.weight_unit || ""
            }">
        </div>

        <hr class="separator span-2">
        <h3 class="section-title span-2">Informasi Nutrisi</h3>

        <div class="form-group"><label for="calories">Kalori</label><input type="number" id="calories" name="calories" step="0.01" placeholder="0.00" value="${
          food.calories || ""
        }"></div>
        <div class="form-group"><label for="carbs">Karbohidrat (g)</label><input type="number" id="carbs" name="carbs" step="0.01" placeholder="0.00" value="${
          food.carbs || ""
        }"></div>
        <div class="form-group"><label for="protein">Protein (g)</label><input type="number" id="protein" name="protein" step="0.01" placeholder="0.00" value="${
          food.protein || ""
        }"></div>
        <div class="form-group"><label for="fat">Lemak (g)</label><input type="number" id="fat" name="fat" step="0.01" placeholder="0.00" value="${
          food.fat || ""
        }"></div>
        <div class="form-group"><label for="sugar">Gula (g)</label><input type="number" id="sugar" name="sugar" step="0.01" placeholder="0.00" value="${
          food.sugar || ""
        }"></div>
        <div class="form-group"><label for="sodium">Sodium (mg)</label><input type="number" id="sodium" name="sodium" step="0.01" placeholder="0.00" value="${sodiumMg}"></div>
        <div class="form-group"><label for="fiber">Serat (g)</label><input type="number" id="fiber" name="fiber" step="0.01" placeholder="0.00" value="${
          food.fiber || ""
        }"></div>
        <div class="form-group"><label for="potassium">Kalium (mg)</label><input type="number" id="potassium" name="potassium" step="0.01" placeholder="0.00" value="${potassiumMg}"></div>

        <div class="form-footer span-2">
            <button type="submit" id="submitBtn" class="submit-btn">
                <span class="spinner"></span>
                <span class="btn-text">${
                  isEdit ? "Simpan Perubahan" : "Simpan Data Makanan"
                }</span>
            </button>
        </div>
      </form>
    </div>
  `;
};

// Template Utama Halaman Daftar Makanan
export const createFoodsPageTemplate = () => `
  <div class="page-header">
    <h1>Manajemen Data Makanan</h1>
    <p>Tambah, lihat, perbarui, atau hapus data makanan dalam sistem.</p>
  </div>
  
  <div class="stat-cards-container">
    <!-- Total Makanan -->
    <div class="stat-card-alt">
      <div class="stat-icon">
        <i data-lucide="utensils-crossed"></i>
      </div>
      <div class="stat-content">
        <h4>Total Data Makanan</h4>
        <p id="total-foods-stat" class="stat-value">0</p>
      </div>
    </div>

    <!-- Total Kategori -->
    <div class="stat-card-alt">
      <div class="stat-icon">
        <i data-lucide="folder-open"></i>
      </div>
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
        <p class="stat-value">60</p>
      </div>
    </div>
  </div>

  <div class="card-table-header">
    <div class="search-filter-container">
      <div class="input-icon-wrapper">
        <i data-lucide="search"></i>
        <input type="search" id="searchInput" placeholder="Cari nama makanan...">
      </div>
    </div>
    <a href="#/foods/add" class="btn-primary">
      <i data-lucide="plus"></i> Tambah Makanan
    </a>
  </div>

  <div class="filters-wrapper"> <div id="categoryFilterContainer" class="category-filters">
      </div>
  </div>
  
  <div id="foodsListContainer" class="foods-grid"></div>
  <div class="card-table-footer">
    <div id="pagination-controls" class="pagination"></div>
  </div>
`;

// createFoodCardTemplate
export const createFoodCardTemplate = (food) => `
  <div class="food-card">
    <img src="${food.photo_url || "./images/placeholder-food.png"}" alt="${
  food.name
}" class="food-card-image">
    <div class="food-card-body">
      <h3 class="food-card-title">${food.name}</h3>
      <p class="food-card-portion">${food.serving_size || 1} ${
  food.serving_unit || "Porsi"
} (${food.weight_size || 0} ${food.weight_unit || "gr"})</p>
      <p class="food-card-description">${
        food.description || "Tidak ada deskripsi."
      }</p>
      <div class="food-card-calories">
        <i data-lucide="flame"></i>
        <span>${food.calories || 0} kcal</span>
      </div>
      <div class="food-card-actions">
        <button class="btn-secondary" data-id="${
          food.id
        }" data-action="edit"><i data-lucide="pencil"></i> Edit</button>
        <button class="btn-danger" data-id="${
          food.id
        }" data-action="delete"><i data-lucide="trash-2"></i> Hapus</button>
      </div>
    </div>
  </div>
`;

// Template untuk Halaman Form Tambah/Edit Makanan
export const createAddFoodPageTemplate = () => `
  <div class="page-header">
    <a href="#/foods" class="back-link"><i data-lucide="arrow-left"></i> Kembali ke Daftar Makanan</a>
    </div>
  <div class="form-container">
    ${createFoodFormTemplate()}
  </div>
`;

//  Template Utama Halaman Daftar Aktivitas
export const createActivitiesPageTemplate = () => `
  <div class="page-header">
    <h1>Manajemen Data Aktivitas</h1>
    <p>Tambah, lihat, perbarui, atau hapus data aktivitas dalam sistem.</p>
  </div>

  <div class="stat-cards-container">
    <div class="stat-card-alt">
      <div class="stat-icon"><i data-lucide="activity"></i></div>
      <div class="stat-content">
        <h4>Total Data Aktivitas</h4>
        <p id="total-activities-stat" class="stat-value">0</p>
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
        <p class="stat-value">20</p>
      </div>
    </div>
  </div>

  <div class="card-table-header">
    <div class="search-filter-container">
      <div class="input-icon-wrapper">
        <i data-lucide="search"></i>
        <input type="search" id="searchInput" placeholder="Cari nama aktivitas...">
      </div>
    </div>
    <a href="#/activities/add" class="btn-primary">
      <i data-lucide="plus"></i> Tambah Aktivitas
    </a>
  </div>

  <div class="filters-wrapper">
    <div id="categoryFilterContainer" class="category-filters"></div>
  </div>

  <div id="activitiesListContainer" class="foods-grid"></div>
  <div class="card-table-footer">
    <div id="pagination-controls" class="pagination"></div>
  </div>
`;

// Template untuk setiap card
export const createActivityCardTemplate = (activity) => `
  <div class="food-card">
    <img src="${
      activity.photo_url || "./images/placeholder-activity.png"
    }" alt="${activity.name}" class="food-card-image">
    <div class="food-card-body">
      <h3 class="food-card-title">${activity.name}</h3>
      <p class="food-card-portion">${activity.duration || 0} ${
  activity.duration_unit || "menit"
}</p>
      <p class="food-card-description">${
        activity.description || "Tidak ada deskripsi."
      }</p>
      <div class="food-card-calories">
        <i data-lucide="flame"></i>
        <span>${activity.calories_burned || 0} Kalori</span>
      </div>
      <div class="food-card-actions">
        <button class="btn-secondary" data-id="${
          activity.id
        }" data-action="edit"><i data-lucide="pencil"></i> Edit</button>
        <button class="btn-danger" data-id="${
          activity.id
        }" data-action="delete"><i data-lucide="trash-2"></i> Hapus</button>
      </div>
    </div>
  </div>
`;

// Template form tambah/edit aktivitas
export const createActivityFormTemplate = (activity = {}) => {
  const isEdit = !!activity.id;
  return `
    <div class="card" style="box-shadow: none;">
      <div class="card-header">
        <div class="header-icon"><i data-lucide="activity" style="width: 28px; height: 28px;"></i></div>
        <div>
          <h1 class="card-title">${
            isEdit ? "Edit Data Aktivitas" : "Formulir Input Aktivitas"
          }</h1>
          <p class="card-subtitle">${
            isEdit
              ? "Perbarui detail aktivitas di bawah ini."
              : "Lengkapi semua field yang dibutuhkan."
          }</p>
        </div>
      </div>
     
      <form id="activityForm" class="card-body" data-id="${activity.id || ""}">
        <div class="form-group span-2">
            <label for="name">Nama Aktivitas <span class="required">*</span></label>
            <input type="text" id="name" name="name" placeholder="cth: Lari Pagi" value="${
              activity.name || ""
            }" required>
        </div>

        <div class="form-group span-2">
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" placeholder="Deskripsi singkat aktivitas...">${
              activity.description || ""
            }</textarea>
        </div>

        <div class="form-group">
            <label for="category_id">Kategori</label>
            <div class="select-wrapper">
                <select id="category_id" name="category_id"></select>
            </div>
        </div>
        <div class="form-group">
            <label for="category_name">Atau Buat Kategori Baru</label>
            <input type="text" id="category_name" name="category_name" placeholder="cth: Kardio">
        </div>

        <div class="form-group span-2">
            <label for="photo_file">Foto Aktivitas (Max 5MB)</label>
            <div class="file-upload-wrapper">
                <input type="file" id="photo_file" name="photo_file" accept="image/*" class="file-input">
                <div id="fileDropArea" class="file-drop-area">
                    <p id="fileDropText" class="file-text">${
                      activity.photo_url
                        ? "Klik untuk mengganti foto"
                        : "Klik atau drag & drop foto di sini"
                    }</p>
                </div>
            </div>
            <div id="imagePreviewWrapper" class="image-preview-wrapper" style="${
              activity.photo_url ? "display: block;" : "display: none;"
            }">
                <img id="imagePreview" class="image-preview" src="${
                  activity.photo_url || "#"
                }" alt="Pratinjau Gambar">
                <button type="button" id="removeImageBtn" class="remove-image-btn" title="Hapus Gambar">&times;</button>
            </div>
        </div>
       
        <hr class="separator span-2">
        <h3 class="section-title span-2">Detail Aktivitas</h3>

        <div class="form-group">
            <label for="calories_burned">Kalori Terbakar</label>
            <input type="number" id="calories_burned" name="calories_burned" placeholder="cth: 150" value="${
              activity.calories_burned || ""
            }">
        </div>
        <div class="form-group">
            <label for="duration">Durasi</label>
            <input type="number" id="duration" name="duration" placeholder="cth: 30" value="${
              activity.duration || ""
            }">
        </div>
        <div class="form-group span-2">
            <label for="duration_unit">Satuan Durasi</label>
            <input type="text" id="duration_unit" name="duration_unit" placeholder="cth: menit, jam" value="${
              activity.duration_unit || ""
            }">
        </div>

        <div class="form-footer span-2">
            <button type="submit" id="submitBtn" class="submit-btn">
                <span class="spinner"></span>
                <span class="btn-text">${
                  isEdit ? "Simpan Perubahan" : "Simpan Data Aktivitas"
                }</span>
            </button>
        </div>
      </form>
    </div>
  `;
};

// Template untuk Halaman Form Tambah/Edit Aktivitas
export const createAddActivityPageTemplate = () => `
  <div class="page-header">
    <a href="#/activities" class="back-link"><i data-lucide="arrow-left"></i> Kembali ke Daftar Aktivitas</a>
    </div>
  <div class="form-container">
    ${createActivityFormTemplate()}
  </div>
`;

