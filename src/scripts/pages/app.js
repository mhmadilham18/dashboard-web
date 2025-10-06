import { getActiveRoute } from "../routes/url-parser.js";
import routes from "../routes/routes.js";
import NotFoundPage from "./not-found/not-found-page.js";
import {
  getAccessToken,
  getLogout,
  parseJwt,
  capitalizeEachWord,
} from "../utils/auth.js";
import { createDashboardLayoutTemplate } from "../templates/template-creator.js";

class App {
  constructor({ appContainer }) {
    this._appContainer = appContainer;
  }

  _initialDashboardShell() {
    const sidebar = document.getElementById("sidebar");
    const toggleDesktop = document.getElementById("sidebar-toggle-desktop");
    const toggleMobile = document.getElementById("sidebar-toggle-mobile");
    const mainContent = document.getElementById("main-content");

    // Tombol minimize/maximize untuk desktop
    toggleDesktop.addEventListener("click", () =>
      sidebar.classList.toggle("minimized")
    );

    // Tombol hamburger untuk mobile (off-canvas)
    toggleMobile.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("open");
    });
    mainContent.addEventListener("click", () =>
      sidebar.classList.remove("open")
    );

    // Tombol Logout
    document.getElementById("logoutButton").addEventListener("click", (e) => {
      e.preventDefault();
      getLogout();
    });

    // Inisialisasi ikon
    lucide.createIcons();

    // Tampilkan informasi pengguna
    this._updateUserInfo();
    this._updateActiveMenu();
  }

  _updateUserInfo() {
    const token = getAccessToken();
    if (token) {
      const decodedToken = parseJwt(token);
      const username = decodedToken.username || "Admin";
      const capitalizeEachWordUsername = capitalizeEachWord(username);
      document.getElementById("user-name").innerText =
        capitalizeEachWordUsername;
      document.getElementById("user-avatar").innerText =
        capitalizeEachWordUsername.charAt(0).toUpperCase();
    }
  }

  _updateActiveMenu() {
    let currentHash = window.location.hash || "#/";
    const sidebarNav = document.getElementById("sidebar-nav");
    if (!sidebarNav) return;

    if (currentHash === "#/" || currentHash === "#") {
      currentHash = "#/home";
    }

    // Hapus semua status aktif sebelumnya
    sidebarNav.querySelectorAll(".active, .active-parent").forEach((el) => {
      el.classList.remove("active", "active-parent");
    });

    // Cari kecocokan persis terlebih dahulu
    let activeLink = sidebarNav.querySelector(`a[data-path="${currentHash}"]`);

    // Jika tidak ada kecocokan persis, cari parent-nya
    if (!activeLink) {
      const links = sidebarNav.querySelectorAll("a[data-path]");
      for (const link of links) {
        const linkPath = link.dataset.path;
        if (
          currentHash.startsWith(linkPath) &&
          linkPath !== "#/home" &&
          linkPath !== "#/"
        ) {
          activeLink = link;
          break;
        }
      }
    }

    if (activeLink) {
      activeLink.classList.add("active");
      const parentDetails = activeLink.closest("details");
      if (parentDetails) parentDetails.classList.add("active-parent");
    }
  }

  async renderPage() {
    const url = getActiveRoute() || "/";
    const page = routes[url] ? routes[url]() : new NotFoundPage();

    if (page) {
      const isSpecialPage = url === "/login" || page instanceof NotFoundPage;
      if (isSpecialPage) {
        this._appContainer.innerHTML = await page.render();
      } else {
        this._appContainer.innerHTML = createDashboardLayoutTemplate();
        const mainContent = document.getElementById("main-content");
        mainContent.innerHTML = await page.render();
        this._initialDashboardShell();
      }
      await page.afterRender();
    }
    if (document.getElementById("sidebar-nav")) {
      this._updateActiveMenu();
    }
  }
}

export default App;
