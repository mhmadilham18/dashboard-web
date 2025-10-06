import ApexCharts from "apexcharts";
import Swal from "sweetalert2";
import {
  createLatestFoodCardTemplate,
  createLatestActivityCardTemplate,
  createLatestArticleCardTemplate,
  createLatestEventCardTemplate,
} from "../../templates/template-overview.js";

class OverviewPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
    this._initialize();
  }

  async _initialize() {
    try {
      const summaryResult = await this.#model.getAdminSummary();
      const data = summaryResult.data;

      this._renderStatCards(data);
      this._renderNutritionChart(data.nutrition);
      this._renderLatestContent(data.content);

      lucide.createIcons();
    } catch (error) {
      console.error("Failed to initialize overview:", error);
      Swal.fire(
        "Gagal Memuat Data",
        `Terjadi kesalahan saat memuat data dasbor: ${error.message}`,
        "error"
      );
    }
  }

  _renderStatCards(data) {
    const safeUpdate = (selector, value) => {
      const element = document.querySelector(selector);
      if (element) {
        element.innerText = value;
      } else {
        console.warn(`Element with selector "${selector}" not found.`);
      }
    };

    safeUpdate("#total-users-card .stat-value", data.users.total_users || 0);
    safeUpdate(
      "#avg-bmi-card .stat-value",
      data.users.avg_bmi.overall.toFixed(2) || "0.00"
    );
    safeUpdate(
      "#avg-risk-card .stat-value",
      data.users.avg_risk_index.overall.toFixed(2) || "0.00"
    );
  }

  _renderNutritionChart(nutritionData) {
    const periodElement = document.getElementById("nutrition-period");
    if (periodElement) {
      periodElement.innerText = `Periode: ${nutritionData.period}`;
    }

    const labels = nutritionData.daily.map((d) =>
      new Date(d.date).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "short",
      })
    );
    const caloriesData = nutritionData.daily.map((d) =>
      Math.round(d.avg_calories)
    );

    const options = {
      series: [{ name: "Rata-rata Kalori", data: caloriesData }],
      colors: ["#3b82f6"],  
      chart: {
        type: "area",
        height: 380,
        fontFamily: "'Outfit', sans-serif",
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        },
      },
      grid: {
        show: false,  
        padding: {
          top: 5,
          right: 20,
          bottom: 0,
          left: 30,
        },
      },
      xaxis: {
        categories: labels,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          show: true,
          style: { colors: "#64748b", fontWeight: 500 },
        },
      },
      yaxis: {
        labels: {
          show: false,
          style: { colors: "#64748b", fontWeight: 500 },
          formatter: (val) => `${val} kcal`,
        },
      },
      tooltip: {
        enabled: true,
        theme: "dark",
        x: {
          show: true,  
        },
        y: {
          formatter: (val) => `${val} kcal`,
          title: {
            formatter: () => "",  
          },
        },
      },
    };

    const chartElement = document.querySelector("#nutritionChart");
    if (chartElement) {
      const chart = new ApexCharts(chartElement, options);
      chart.render();
    }
  }

  _renderLatestContent(contentData) {
    const renderList = (selector, data, template, limit, emptyMessage) => {
      const container = document.getElementById(selector);
      if (container) {
        container.innerHTML =
          data?.length > 0
            ? data.slice(0, limit).map(template).join("")
            : `<p class="loader">${emptyMessage}</p>`;
      }
    };

    renderList(
      "latest-foods-list",
      contentData.latest_foods,
      createLatestFoodCardTemplate,
      6,
      "Tidak ada data makanan terbaru."
    );
    renderList(
      "latest-activities-list",
      contentData.latest_activities,
      createLatestActivityCardTemplate,
      6,
      "Tidak ada data aktivitas terbaru."
    );
    renderList(
      "latest-articles-list",
      contentData.latest_articles,
      createLatestArticleCardTemplate,
      6,
      "Tidak ada data artikel terbaru."
    );
    renderList(
      "latest-events-list",
      contentData.latest_events,
      createLatestEventCardTemplate,
      6,
      "Tidak ada data event terbaru."
    );
  }
}

export default OverviewPresenter;
