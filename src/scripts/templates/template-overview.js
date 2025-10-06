// src/scripts/templates/template-overview.js

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  const options = { day: "numeric", month: "long", year: "numeric" };
  return new Date(isoString).toLocaleDateString("id-ID", options);
};

export const createOverviewPageTemplate = () => `
  <div class="page-header">
    <h1>Overview Dasbor</h1>
    <p>Ringkasan data pengguna, nutrisi, dan konten terkini dalam platform.</p>
  </div>

  <div class="stat-cards-container">
    <div class="stat-card-alt" id="total-users-card">
      <div class="stat-icon"><i data-lucide="users-2"></i></div>
      <div class="stat-content">
        <h4>Total Pengguna</h4>
        <p class="stat-value">0</p>
      </div>
    </div>
    <div class="stat-card-alt" id="avg-bmi-card">
      <div class="stat-icon"><i data-lucide="activity"></i></div>
      <div class="stat-content">
        <h4>Rata-rata BMI</h4>
        <p class="stat-value">0.00</p>
      </div>
    </div>
    <div class="stat-card-alt" id="avg-risk-card">
      <div class="stat-icon"><i data-lucide="shield-alert"></i></div>
      <div class="stat-content">
        <h4>Indeks Risiko</h4>
        <p class="stat-value">0.00</p>
      </div>
    </div>
  </div>

  <div class="chart-card-full">
    <div class="card-header">
      <h3>Rata-rata Asupan Kalori Harian</h3>
      </div>
    <div class="card-body">
      <div id="nutritionChart"></div>
    </div>
  </div>

  <div class="latest-content-section">
    <div class="content-section-header">
      <h2>Makanan Terbaru</h2>
      <a href="#/foods">Lihat Semua</a>
    </div>
    <div class="content-horizontal-list" id="latest-foods-list">
      <p class="loader">Memuat data makanan...</p>
    </div>
  </div>

  <div class="latest-content-section">
    <div class="content-section-header">
      <h2>Aktivitas Terbaru</h2>
      <a href="#/activities">Lihat Semua</a>
    </div>
    <div class="content-horizontal-list" id="latest-activities-list">
      <p class="loader">Memuat data aktivitas...</p>
    </div>
  </div>
  
  <div class="latest-content-section">
    <div class="content-section-header">
      <h2>Artikel Terbaru</h2>
      <a href="#/articles">Lihat Semua</a>
    </div>
    <div class="content-horizontal-list" id="latest-articles-list">
      <p class="loader">Memuat data artikel...</p>
    </div>
  </div>

  <div class="latest-content-section">
    <div class="content-section-header">
      <h2>Event Terbaru</h2>
      <a href="#/events">Lihat Semua</a>
    </div>
    <div class="content-horizontal-list" id="latest-events-list">
      <p class="loader">Memuat data event...</p>
    </div>
  </div>
`;

// Card Template untuk Makanan
export const createLatestFoodCardTemplate = (food) => `
  <div class="food-card">
    <img src="${food.photo_url || "./images/placeholder-food.png"}" alt="${
  food.name
}" class="food-card-image" loading="lazy">
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
        <a href="#/foods/${
          food.id
        }" class="btn-secondary"><i data-lucide="pencil"></i> Edit</a>
      </div>
    </div>
  </div>
`;

// Card Template untuk Aktivitas
export const createLatestActivityCardTemplate = (activity) => `
  <div class="food-card">
    <img src="${
      activity.photo_url || "./images/placeholder-activity.png"
    }" alt="${activity.name}" class="food-card-image" loading="lazy">
    <div class="food-card-body">
      <h3 class="food-card-title">${activity.name}</h3>
      <p class="food-card-portion">${activity.duration || 0} ${
  activity.duration_unit || "menit"
}</p>
      <p class="food-card-description">${
        activity.description || "Tidak ada deskripsi."
      }</p>
      <div class="food-card-calories">
        <i data-lucide="zap"></i>
        <span>${activity.calories_burned || 0} Kalori Terbakar</span>
      </div>
       <div class="food-card-actions">
        <a href="#/activities/${
          activity.id
        }" class="btn-secondary"><i data-lucide="pencil"></i> Edit</a>
      </div>
    </div>
  </div>
`;

// Card Template untuk Artikel
export const createLatestArticleCardTemplate = (article) => `
  <div class="article-card">
    <img src="${article.cover_url || "./images/placeholder-image.jpg"}" alt="${
  article.title
}" class="article-card-cover" loading="lazy">
    <div class="article-card-body">
      <h3 class="article-card-title">${article.title}</h3>
      <p class="article-card-meta">${formatDate(
        article.created_at
      )} - Tim Sahabat Gula</p>
      <div class="article-card-actions">
        <a href="#/articles/${
          article.id
        }" class="btn-secondary"><i data-lucide="pencil"></i> Edit</a>
      </div>
    </div>
  </div>
`;

// Card Template untuk Event
export const createLatestEventCardTemplate = (event) => `
  <div class="article-card">
    <img src="${event.cover_url || "./images/placeholder-image.jpg"}" alt="${
  event.title
}" class="article-card-cover" loading="lazy">
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
      </div>
    </div>
  </div>
`;
