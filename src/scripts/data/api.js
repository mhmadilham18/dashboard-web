import { API_CONFIG } from "../config.js";
import { getAccessToken } from "../utils/auth.js";

const ENDPOINTS = {
  LOGIN: `${API_CONFIG.BASE_URL}/login`,
  FOODS: `${API_CONFIG.BASE_URL}/foods`,
  FOOD_CATEGORIES: `${API_CONFIG.BASE_URL}/food-categories`,
  ACTIVITIES: `${API_CONFIG.BASE_URL}/activities`,
  ACTIVITY_CATEGORIES: `${API_CONFIG.BASE_URL}/activity-categories`,
  ARTICLES: `${API_CONFIG.BASE_URL}/articles`,
  ARTICLE_CATEGORIES: `${API_CONFIG.BASE_URL}/article-categories`,
  EVENTS: `${API_CONFIG.BASE_URL}/events`,
  EVENT_CATEGORIES: `${API_CONFIG.BASE_URL}/event-categories`,
  ADMIN_SUMMARY: `${API_CONFIG.BASE_URL}/admin-summary`,
};

export async function getAdminSummary() {
  const token = getAccessToken();
  const response = await fetch(ENDPOINTS.ADMIN_SUMMARY, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Gagal mengambil data summary admin.");
  return response.json();
}

export async function loginUser({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login gagal. Silakan coba lagi.");
    } catch (e) {
      if (response.status === 400 || response.status === 401) {
        throw new Error("Email atau password yang Anda masukkan salah.");
      }
      throw new Error(
        `Terjadi kesalahan pada server (Status: ${response.status})`
      );
    }
  }

  return response.json();
}

// GET /foods
export async function getFoods({
  q = "",
  category_id = "",
  page = 1,
  limit = 10,
}) {
  const params = new URLSearchParams({ page, limit });
  if (q) params.append("q", q);
  if (category_id) params.append("category_id", category_id);

  const response = await fetch(`${ENDPOINTS.FOODS}?${params.toString()}`);
  if (!response.ok) throw new Error("Gagal mengambil data makanan.");
  return response.json();
}

// GET /foods/{id}
export async function getFoodById(id) {
  const response = await fetch(`${ENDPOINTS.FOODS}/${id}`);
  if (!response.ok) throw new Error("Gagal mengambil detail makanan.");
  return response.json();
}

// POST /foods
export async function createFood(formData) {
  const token = getAccessToken();
  const response = await fetch(ENDPOINTS.FOODS, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Gagal menambahkan makanan.");
  return result;
}

// PUT /foods/{id}
export async function updateFood(id, formData) {
  const token = getAccessToken();
  const response = await fetch(`${ENDPOINTS.FOODS}/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Gagal memperbarui makanan.");
  return result;
}

// DELETE /foods/{id}
export async function deleteFood(id) {
  const token = getAccessToken();
  const response = await fetch(`${ENDPOINTS.FOODS}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Gagal menghapus makanan.");
  return result;
}

// GET /food-categories
export async function getFoodCategories() {
  const response = await fetch(ENDPOINTS.FOOD_CATEGORIES);
  if (!response.ok) throw new Error("Gagal mengambil kategori makanan.");
  return response.json();
}

// GET /activities
export async function getActivities({
  q = "",
  category_id = "",
  page = 1,
  limit = 12,
}) {
  const params = new URLSearchParams({ page, limit });
  if (q) params.append("q", q);
  if (category_id) params.append("category_id", category_id);

  const response = await fetch(`${ENDPOINTS.ACTIVITIES}?${params.toString()}`);
  if (!response.ok) throw new Error("Gagal mengambil data aktivitas.");
  return response.json();
}

// GET /activities/{id}
export async function getActivityById(id) {
  const response = await fetch(`${ENDPOINTS.ACTIVITIES}/${id}`);
  if (!response.ok) throw new Error("Gagal mengambil detail aktivitas.");
  return response.json();
}

// POST /activities
export async function createActivity(formData) {
  const token = getAccessToken();
  const response = await fetch(ENDPOINTS.ACTIVITIES, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Gagal menambahkan aktivitas.");
  return result;
}

// PUT /activities/{id}
export async function updateActivity(id, formData) {
  const token = getAccessToken();
  const response = await fetch(`${ENDPOINTS.ACTIVITIES}/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Gagal memperbarui aktivitas.");
  return result;
}

// DELETE /activities/{id}
export async function deleteActivity(id) {
  const token = getAccessToken();
  const response = await fetch(`${ENDPOINTS.ACTIVITIES}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Gagal menghapus aktivitas.");
  return result;
}

// GET /activity-categories
export async function getActivityCategories() {
  const response = await fetch(ENDPOINTS.ACTIVITY_CATEGORIES);
  if (!response.ok) throw new Error("Gagal mengambil kategori aktivitas.");
  return response.json();
}

// GET /articles
export async function getArticles({
  q = "",
  category_id = "",
  page = 1,
  limit = 10,
}) {
  const params = new URLSearchParams({ page, limit });
  if (q) params.append("q", q);
  if (category_id) params.append("category_id", category_id);

  const response = await fetch(`${ENDPOINTS.ARTICLES}?${params.toString()}`);
  if (!response.ok) throw new Error("Gagal mengambil data artikel.");
  return response.json();
}

// GET /articles/{id}
export async function getArticleById(id) {
  const response = await fetch(`${ENDPOINTS.ARTICLES}/${id}`);
  if (!response.ok) throw new Error("Gagal mengambil detail artikel.");
  return response.json();
}

// POST /articles
export async function createArticle(formData) {
  const token = getAccessToken();
  const response = await fetch(ENDPOINTS.ARTICLES, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Gagal menambahkan artikel.");
  return result;
}

// PUT /articles/{id}
export async function updateArticle(id, formData) {
  const token = getAccessToken();
  const response = await fetch(`${ENDPOINTS.ARTICLES}/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Gagal memperbarui artikel.");
  return result;
}

// DELETE /articles/{id}
export async function deleteArticle(id) {
  const token = getAccessToken();
  const response = await fetch(`${ENDPOINTS.ARTICLES}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Gagal menghapus artikel.");
  return result;
}

// GET /article-categories
export async function getArticleCategories() {
  const response = await fetch(ENDPOINTS.ARTICLE_CATEGORIES);
  if (!response.ok) throw new Error("Gagal mengambil kategori artikel.");
  return response.json();
}

// GET /events
export async function getEvents({
  q = "",
  category_id = "",
  page = 1,
  limit = 10,
}) {
  const params = new URLSearchParams({ page, limit });
  if (q) params.append("q", q);
  if (category_id) params.append("category_id", category_id);

  const response = await fetch(`${ENDPOINTS.EVENTS}?${params.toString()}`);
  if (!response.ok) throw new Error("Gagal mengambil data event.");
  return response.json();
}

// GET /events/{id}
export async function getEventById(id) {
  const response = await fetch(`${ENDPOINTS.EVENTS}/${id}`);
  if (!response.ok) throw new Error("Gagal mengambil detail event.");
  return response.json();
}

// POST /events
export async function createEvent(formData) {
  const token = getAccessToken();
  const response = await fetch(ENDPOINTS.EVENTS, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Gagal menambahkan event.");
  return result;
}

// PUT /events/{id}
export async function updateEvent(id, formData) {
  const token = getAccessToken();
  const response = await fetch(`${ENDPOINTS.EVENTS}/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.message || "Gagal memperbarui event.");
  return result;
}

// DELETE /events/{id}
export async function deleteEvent(id) {
  const token = getAccessToken();
  const response = await fetch(`${ENDPOINTS.EVENTS}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Gagal menghapus event.");
  return result;
}

// GET /event-categories
export async function getEventCategories() {
  const response = await fetch(ENDPOINTS.EVENT_CATEGORIES);
  if (!response.ok) throw new Error("Gagal mengambil kategori event.");
  return response.json();
}
