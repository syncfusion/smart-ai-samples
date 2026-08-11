<template>
  <div class="control-pane">
    <div class="control-section">
      <h4 style="text-align:center;">Data Preprocessing</h4>
      <p style="max-width:900px; margin:0 auto; text-align:center;">
        The <b>Data Preprocessing</b> sample uses Syncfusion Vue Charts to clean and visualize datasets containing missing values.
        Click the AI Assist button to preprocess the data. Missing values will be handled by AI.
      </p>

      <div id="chart-wrapper" class="chart-wrapper" style="margin-top:20px;">
        <!-- Chart -->
        <ejs-chart
          id="chart-container"
          :primaryXAxis="primaryXAxis"
          :primaryYAxis="primaryYAxis"
          :chartArea="chartArea"
          :title="title"
          :subTitle="subTitle"
          :legendSettings="legendSettings"
        >
          <e-series-collection>
            <e-series
              :dataSource="chartData"
              type="MultiColoredLine"
              xName="time"
              yName="visitors"
              name="Visitors"
              pointColorMapping="color"
              :fill="fillColor"
              :emptyPointSettings="emptyPointSettings"
            ></e-series>
          </e-series-collection>
        </ejs-chart>

        <!-- AI Button -->
        <ejs-button
          cssClass="e-primary chart-action-button"
          iconCss="e-icons e-ai-chat"
          @click="onAIButtonClick"
        ></ejs-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  LineSeries,
  MultiColoredLineSeries,
  DateTime,
  Legend,
  Tooltip,
} from "@syncfusion/ej2-vue-charts";
import { ButtonComponent } from "@syncfusion/ej2-vue-buttons";
import { createSpinner, showSpinner, hideSpinner } from "@syncfusion/ej2-popups";

export default {
  name: "DataPreprocessing",
  components: {
    "ejs-chart": ChartComponent,
    "e-series-collection": SeriesCollectionDirective,
    "e-series": SeriesDirective,
    "ejs-button": ButtonComponent,
  },
  data() {
    return {
      title: "E-Commerce Website Traffic Data",
      subTitle: "AI-powered data cleaning and preprocessing for tracking hourly website visitors",
      legendSettings: { visible: true, position: "Top" },
      primaryXAxis: {
        valueType: "DateTime",
        minimum: new Date(2024, 6, 1, 0, 0, 0),
        maximum: new Date(2024, 6, 1, 23, 0, 0),
        labelFormat: "h a",
        edgeLabelPlacement: "Shift",
        majorGridLines: { width: 0 },
      },
      primaryYAxis: { minimum: 140, maximum: 320, interval: 30 },
      chartArea: { border: { width: 0 } },
      fillColor: "#6f16ef",
      emptyPointSettings: { mode: "Connect" },
      originalList: [
        { time: new Date(2024, 6, 1, 0, 0), visitors: 150 },
        { time: new Date(2024, 6, 1, 1, 0), visitors: 160 },
        { time: new Date(2024, 6, 1, 2, 0), visitors: 155 },
        { time: new Date(2024, 6, 1, 3, 0), visitors: null },
        { time: new Date(2024, 6, 1, 4, 0), visitors: 170 },
        { time: new Date(2024, 6, 1, 5, 0), visitors: 175 },
        { time: new Date(2024, 6, 1, 6, 0), visitors: 145 },
        { time: new Date(2024, 6, 1, 7, 0), visitors: 180 },
        { time: new Date(2024, 6, 1, 8, 0), visitors: null },
        { time: new Date(2024, 6, 1, 9, 0), visitors: 185 },
        { time: new Date(2024, 6, 1, 10, 0), visitors: 200 },
        { time: new Date(2024, 6, 1, 11, 0), visitors: null },
        { time: new Date(2024, 6, 1, 12, 0), visitors: 220 },
        { time: new Date(2024, 6, 1, 13, 0), visitors: 230 },
        { time: new Date(2024, 6, 1, 14, 0), visitors: null },
        { time: new Date(2024, 6, 1, 15, 0), visitors: 250 },
        { time: new Date(2024, 6, 1, 16, 0), visitors: 260 },
        { time: new Date(2024, 6, 1, 17, 0), visitors: 270 },
        { time: new Date(2024, 6, 1, 18, 0), visitors: null },
        { time: new Date(2024, 6, 1, 19, 0), visitors: 280 },
        { time: new Date(2024, 6, 1, 20, 0), visitors: 250 },
        { time: new Date(2024, 6, 1, 21, 0), visitors: 290 },
        { time: new Date(2024, 6, 1, 22, 0), visitors: 300 },
        { time: new Date(2024, 6, 1, 23, 0), visitors: null },
      ],
      chartData: [],
    };
  },
  mounted() {
    this.loadOriginalData();
  },
  methods: {
    loadOriginalData() {
      // Load chart data as-is; missing values are null
      this.chartData = this.originalList.map((d) => ({ ...d, color: null }));
    },

    async onAIButtonClick() {
      const spinnerTarget = document.getElementById("chart-wrapper");

      // Create spinner if not already present
      if (!spinnerTarget.querySelector(".e-spinner-pane")) {
        createSpinner({
          target: spinnerTarget,
          cssClass: "chart-spinner-overlay",
        });
      }

      // Show spinner immediately
      showSpinner(spinnerTarget);

      // Wait for browser to render spinner
      await new Promise(requestAnimationFrame);

      try {
        // Generate AI prompt
        const prompt = this.generatePrompt(this.originalList);

        // Call AI service (replace with actual API call)
        const response = await this.mockAIService(prompt);

        // Convert AI response to chart data
        const processedData = this.convertAIResponseToChartData(response, this.originalList);

        // Update chart data
        if (processedData.length > 0) {
          this.chartData = processedData;
        }
      } catch (err) {
        console.error("Error during AI processing:", err);
      } finally {
        // Hide spinner after 1 second max
        setTimeout(() => hideSpinner(spinnerTarget), 1000);
      }
    },

    generatePrompt(data) {
      let prompt = "Clean the following e-commerce website traffic data, resolve outliers and fill missing values:\n";
      data.forEach((d) => {
        const timeStr = d.time.toISOString().replace("T", "-").split(".")[0];
        prompt += `${timeStr}: ${d.visitors}\n`;
      });
      prompt += "and the output cleaned data should be in the yyyy-MM-dd-HH-m-ss:Value format, no other explanation required";
      return prompt;
    },

    mockAIService(prompt) {
      // Simulate AI response; missing points will be handled by AI
      return new Promise((resolve) => {
        setTimeout(() => {
          const lines = this.originalList.map((d) => {
            const value = d.visitors !== null ? d.visitors : null; // AI will handle nulls
            const timeStr = d.time.toISOString().replace("T", "-").split(".")[0];
            return `${timeStr}:${value}`;
          });
          resolve(lines.join("\n"));
        }, 1000);
      });
    },

    convertAIResponseToChartData(response, original) {
      const lines = response.split("\n").filter((l) => l.trim() !== "");
      const result = [];
      let count = 0;

      for (let line of lines) {
        const parts = line.split(":");
        if (parts.length === 2) {
          const [timeStr, valueStr] = parts;
          const [y, m, d, h, min, s] = timeStr.trim().split("-").map(Number);
          const date = new Date(y, m - 1, d, h, min, s);
          const visitors = parseFloat(valueStr.trim());

          const isCurrNull = original[count]?.visitors === null;
          const isNextNull = !original[count + 1] || original[count + 1].visitors === null;
          const color = (isCurrNull || isNextNull) ? "#D84227" : "#6f16ef";

          result.push({ time: date, visitors, color });
          count++;
        }
      }
      return result;
    },
  },
  provide: {
    chart: [LineSeries, MultiColoredLineSeries, DateTime, Legend, Tooltip],
  },
};
</script>

<style scoped>
.chart-wrapper {
  position: relative;
}

#aiAssistBtn.e-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px;
  line-height: 14px;
  font-size: 16px;
  padding: 8.2px 16px;
  
}

.chart-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
}

.chart-action-button {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
   font-size: 16px;
   
    
        padding: 8.2px 16px;
}

.chart-action-button .e-icons {
  color: rgba(255, 255, 255, 1);
  font-size: 17px;
  line-height: 17px;
  font-weight: 400;
}

.chart-spinner-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Make the spinner overlay cover the chart and center the spinner */
.chart-spinner-overlay {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  z-index: 1000;
}
</style>