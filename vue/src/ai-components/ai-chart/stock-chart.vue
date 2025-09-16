<template>
  <div class="chart-wrapper" id="chart-wrapper">
    <h4 style="text-align:center;">Stock Forecasting</h4>

    <div class="description">
      <p>
        The <b>Stock Forecasting</b> sample uses Syncfusion Vue Charts to
        visualize historical stock data and predict future trends using AI.
      </p>
    </div>

    <div class="control-section">
      <!-- Left Panel -->
      <div class="left-panel">
        <div style="display:flex; align-items:center; gap:12px;">
          <!-- Stock DropdownButton -->
         
          <ejs-dropdownbutton
            id="stock-dropdown"
            :items="stockItems"
            :select="onStockSelect"
            cssClass="e-dropdown-btn"
            :iconCss="selectedStock.iconCss"
            :content="selectedStock.symbol"
           >
         </ejs-dropdownbutton>

          <!-- Stock Info -->
          <div class="stock-info">
            <div>
              <span id="stock-close" class="price">{{ selectedStock.close.toFixed(2) }}</span> USD
              <br>
              <p
                id="stock-change"
                :style="{ color: selectedStock.change < 0 ? 'red' : 'green', margin: 0 }"
              >
                {{ selectedStock.change }} ({{ selectedStock.percentChange }}%)
              </p>
            </div>
          </div>
        </div>

        <!-- Company Name -->
        <p class="para">{{ selectedStock.name }}</p>
      </div>

      <!-- Right Panel (Buttons + Chart Controls) -->
      <div class="button-and-chart-controls">
        <div class="left-buttons">
          <button class="e-btn" @click="setRange(3)">3 Month</button>
          <button class="e-btn" @click="setRange(6)">6 Month</button>
          <button class="e-btn" @click="setRange(12)">1 Year</button>
        </div>

        <div class="chart-controls">
          <!-- Series Dropdown -->
          <ejs-dropdownlist
            id="series-dropdown"
            :dataSource="seriesOptions"
            :change="onSeriesChange"
            width="150px"
            :value="selectedSeriesType"
          >
          </ejs-dropdownlist>

          <!-- AI Assist Button -->
          <ejs-button
            id="aiAssistBtn"
            cssClass="e-primary e-icon-btn chart-action-button"
            iconCss="e-icons e-ai-chat"
            @click="simulateAiAssist"
          ></ejs-button>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div id="chart-container"></div>
  </div>
</template>

<script>
import {
  Chart,
  CandleSeries,
  LineSeries,
  HiloOpenCloseSeries,
  DateTime,
  Crosshair,
  Tooltip,
  Legend,
} from "@syncfusion/ej2-charts";
import { DropDownButtonComponent as EjsDropdownbutton } from "@syncfusion/ej2-vue-splitbuttons";
import { DropDownListComponent as EjsDropdownlist } from "@syncfusion/ej2-vue-dropdowns";
import { ButtonComponent as EjsButton } from "@syncfusion/ej2-vue-buttons";
import { createSpinner, showSpinner, hideSpinner } from "@syncfusion/ej2-popups";

// Import stock data
import msftData from "./data/msft-data.json";
import googData from "./data/goog-data.json";
import amznData from "./data/amzn-data.json";
import tslaData from "./data/tsla-data.json";

Chart.Inject(
  CandleSeries,
  LineSeries,
  HiloOpenCloseSeries,
  DateTime,
  Crosshair,
  Tooltip,
  Legend
);

export default {
  name: "StockForecasting",
  components: { EjsDropdownbutton, EjsDropdownlist, EjsButton },
  data() {
    return {
      chart: null,
      selectedRange: 3,
      selectedSeriesType: "Candle",
      stockItems: [
  { text: "MSFT", id: "MSFT", iconCss: "e-logo-msft" },
  { text: "GOOG", id: "GOOG", iconCss: "e-logo-goog" },
  { text: "AMZN", id: "AMZN", iconCss: "e-logo-amzn" },
  { text: "TSLA", id: "TSLA", iconCss: "e-logo-tsla" },
],
selectedStock: {
  symbol: "MSFT",
  name: "Microsoft Corp",
  close: 138.35,
  change: -2.0,
  percentChange: -0.22,
  iconCss: "e-logo-msft",   // 👈 use iconCss instead of icon
},


      seriesOptions: ["Line", "HiloOpenClose", "Candle"],
      chartData: [],
    };
  },
  mounted() {
    this.loadChartData();
    this.initializeChart();
    this.renderChart();
  },
  methods: {
    getStockData(symbol) {
      switch (symbol) {
        case "GOOG":
          return googData;
        case "AMZN":
          return amznData;
        case "TSLA":
          return tslaData;
        default:
          return msftData;
      }
    },
    loadChartData() {
      const json = this.getStockData(this.selectedStock.symbol);
      this.chartData = json.map((d) => ({
        date: new Date(d.Date || d.date),
        high: Number(d.High ?? d.high),
        low: Number(d.Low ?? d.low),
        open: Number(d.Open ?? d.open),
        close: Number(d.Close ?? d.close),
      }));
    },
    filterChartData(months) {
      if (!this.chartData.length) return [];
      const latestDate = new Date(
        Math.max(...this.chartData.map((p) => p.date.getTime()))
      );
      const cutoffDate = new Date(latestDate);
      cutoffDate.setMonth(cutoffDate.getMonth() - months + 1);
      return this.chartData
        .filter((p) => p.date >= cutoffDate)
        .sort((a, b) => a.date - b.date);
    },
    initializeChart() {
      this.chart = new Chart({
        width: "100%",
        chartArea: { border: { width: 0 } },
        primaryXAxis: {
          valueType: "DateTime",
          labelFormat: "MMM yyyy",
          crosshairTooltip: { enable: true },
          majorGridLines: { width: 0 },
        },
        primaryYAxis: {
          labelFormat: "n0",
          lineStyle: { width: 0 },
          majorTickLines: { width: 0 },
          rangePadding: "None",
        },
        legendSettings: { visible: false },
        tooltip: { enable: true, shared: true },
        crosshair: { enable: true, lineType: "Vertical" },
        series: [],
      });
      this.chart.appendTo("#chart-container");
    },
    renderChart() {
      const filteredData = this.filterChartData(this.selectedRange);
      this.chart.series = [
        {
          dataSource: filteredData,
          xName: "date",
          type: this.selectedSeriesType,
          name: this.selectedStock.name,
          high: this.selectedSeriesType !== "Line" ? "high" : undefined,
          low: this.selectedSeriesType !== "Line" ? "low" : undefined,
          open: this.selectedSeriesType !== "Line" ? "open" : undefined,
          close: this.selectedSeriesType !== "Line" ? "close" : undefined,
          yName: this.selectedSeriesType === "Line" ? "close" : undefined,
          bearFillColor:
            this.selectedSeriesType === "Candle" ? "#2ecd71" : undefined,
          bullFillColor:
            this.selectedSeriesType === "Candle" ? "#e74c3d" : undefined,
        },
      ];
      this.chart.refresh();
    },
    setRange(months) {
      this.selectedRange = months;
      this.renderChart();
    },
    onSeriesChange(e) {
      this.selectedSeriesType = e.value;
      this.renderChart();
    },
onStockSelect(args) {
  this.selectedStock = {
    symbol: args.item.text,
    name: this.mapCompanyName(args.item.text),
    close: 200 + Math.random() * 100,
    change: (Math.random() * 2 - 1).toFixed(2),
    percentChange: (Math.random() * 2 - 1).toFixed(2),
    iconCss: args.item.iconCss,   // fixed naming
  };

  //  these belong inside the method
  this.loadChartData();
  this.renderChart();
},


     
    mapCompanyName(symbol) {
      switch (symbol) {
        case "GOOG":
          return "Google Inc";
        case "AMZN":
          return "Amazon Inc";
        case "TSLA":
          return "Tesla Inc";
        default:
          return "Microsoft Corp";
      }
    },
    async simulateAiAssist() {
      const target = document.getElementById("chart-wrapper");
      if (!target.querySelector(".e-spinner-pane")) {
        createSpinner({ target });
      }
      showSpinner(target);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      hideSpinner(target);

      try {
        const response = await fetch("https://your-backend-api/forecast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            symbol: this.selectedStock.symbol,
            data: this.chartData,
          }),
        });

        const forecastData = await response.json();
        const nextData = forecastData.map((d) => ({
          date: new Date(d.date),
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }));

        this.chartData.push(...nextData);
        this.renderChart();
      } catch (err) {
        console.error("AI Assist failed:", err);
      }
    },
  },
};
</script>

<style>
.chart-wrapper {
  position: relative;
  padding: 10px;
}
.description {
  margin-bottom: 12px;
}
.para {
  padding-top: 5px;
}

.control-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}
.left-panel {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.stock-info {
  display: flex;
  align-items: center;
}
.price {
  font-size: 20px;
  font-weight: bold;
  padding-right: 2px;
}

.button-and-chart-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  gap: 12px;

}
.left-buttons {
  display: flex;
  gap: 8px;
}
.chart-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}



/* Dropdown item styling like Blazor */
.e-dropdown-popup ul .e-item {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  line-height: 22px;
  padding: 8px;
}

/* Logo icons inside dropdown */
.e-logo-msft,
.e-logo-goog,
.e-logo-amzn,
.e-logo-tsla {
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 8px;
  display: inline-block;
}

.e-logo-msft {
  background-image: url('./chart/microsoft.png');
}
.e-logo-goog {
  background-image: url('./chart/google.png');
}
.e-logo-amzn {
  background-image: url('./chart/amazon.png');
}
.e-logo-tsla {
  background-image: url('./chart/tesla.png');
}
/* Dropdown items spacing */
.e-dropdown-popup ul .e-item {
  display: flex;
  align-items: center;
  gap: 8px;
}



/* Spinner overlay */
.chart-spinner-overlay {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  z-index: 1000;
}
.chart-action-button
{
    border: 1px solid;
    border-radius: 4px;
    font-weight: 600;
    color:white;
}

</style>


