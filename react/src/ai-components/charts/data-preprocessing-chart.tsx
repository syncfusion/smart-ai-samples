// // export default DataPreprocessing;
// import React, { useState, useRef, useEffect } from "react";
// import {
//   ChartComponent,
//   SeriesCollectionDirective,
//   SeriesDirective,
//   Inject,
//   MultiColoredLineSeries,
//   DateTime,
//   Legend,
//   Tooltip,
// } from "@syncfusion/ej2-react-charts";
// import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
// import { createSpinner, showSpinner, hideSpinner } from "@syncfusion/ej2-popups";

// import "./DataPreprocessing.css"; // Import the CSS file

// interface ChartDataPoint {
//   time: Date;
//   visitors: number | null;
//   color?: string;
// }

// const originalList: ChartDataPoint[] = [
//   { time: new Date(2024, 6, 1, 0, 0, 0), visitors: 150 },
//   { time: new Date(2024, 6, 1, 1, 0, 0), visitors: 160 },
//   { time: new Date(2024, 6, 1, 2, 0, 0), visitors: 155 },
//   { time: new Date(2024, 6, 1, 3, 0, 0), visitors: null },
//   { time: new Date(2024, 6, 1, 4, 0, 0), visitors: 170 },
//   { time: new Date(2024, 6, 1, 5, 0, 0), visitors: 175 },
//   { time: new Date(2024, 6, 1, 6, 0, 0), visitors: 145 },
//   { time: new Date(2024, 6, 1, 7, 0, 0), visitors: 180 },
//   { time: new Date(2024, 6, 1, 8, 0, 0), visitors: null },
//   { time: new Date(2024, 6, 1, 9, 0, 0), visitors: 185 },
//   { time: new Date(2024, 6, 1, 10, 0, 0), visitors: 200 },
//   { time: new Date(2024, 6, 1, 11, 0, 0), visitors: null },
//   { time: new Date(2024, 6, 1, 12, 0, 0), visitors: 220 },
//   { time: new Date(2024, 6, 1, 13, 0, 0), visitors: 230 },
//   { time: new Date(2024, 6, 1, 14, 0, 0), visitors: null },
//   { time: new Date(2024, 6, 1, 15, 0, 0), visitors: 250 },
//   { time: new Date(2024, 6, 1, 16, 0, 0), visitors: 260 },
//   { time: new Date(2024, 6, 1, 17, 0, 0), visitors: 270 },
//   { time: new Date(2024, 6, 1, 18, 0, 0), visitors: null },
//   { time: new Date(2024, 6, 1, 19, 0, 0), visitors: 280 },
//   { time: new Date(2024, 6, 1, 20, 0, 0), visitors: 250 },
//   { time: new Date(2024, 6, 1, 21, 0, 0), visitors: 290 },
//   { time: new Date(2024, 6, 1, 22, 0, 0), visitors: 300 },
//   { time: new Date(2024, 6, 1, 23, 0, 0), visitors: null },
// ];

// const DataPreprocessing: React.FC = () => {
//   const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
//   const chartWrapperRef = useRef<HTMLDivElement>(null);

//   // Equivalent to OnInitialized → load original data
//   useEffect(() => {
//     loadOriginalData();
//   }, []);

//   const loadOriginalData = () => {
//     setChartData([...originalList]); // reset chart data from original list
//   };

//   // GeneratePrompt (convert chartData to AI input format)
//   const generatePrompt = (data: ChartDataPoint[]): string => {
//     let prompt =
//       "Clean the following e-commerce website traffic data, resolve outliers and fill missing values:\n";
//     data.forEach((d) => {
//       prompt += `${d.time
//         .toISOString()
//         .replace("T", "-")
//         .slice(0, 19)
//         .replace(/:/g, "-")}: ${d.visitors}\n`;
//     });
//     prompt +=
//       "and the output cleaned data should be in the yyyy-MM-dd-HH-m-ss:Value format, no other explanation required";
//     return prompt;
//   };

//   // Convert AI Response → ChartData
  
// //   const convertAIResponseToChartData = (
// //   response: string,
// //   original: ChartDataPoint[]
// // ): ChartDataPoint[] => {
// //   const lines = response.split("\n").filter((line) => line.trim() !== "");
// //   const result: ChartDataPoint[] = [];

// //   lines.forEach((line, idx) => {
// //     const match = line.match(
// //       /^(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2}):\s*([\d.]+)$/
// //     );
// //     if (!match) return; // skip invalid lines

// //     const [, year, month, day, hour, min, sec, valueStr] = match;
// //     const date = new Date(
// //       Number(year),
// //       Number(month) - 1,
// //       Number(day),
// //       Number(hour),
// //       Number(min),
// //       Number(sec)
// //     );
// //     const visitors = parseFloat(valueStr);

// //     const isCurrNull = original[idx]?.visitors == null;
// //     const isNextNull = original[idx + 1]?.visitors == null;
// //     const color = isCurrNull || isNextNull ? "#D84227" : "#3C78D8";

// //     result.push({ time: date, visitors, color });
// //   });

// //   return result;
// // };

// const fakeResponse = originalList
//   .map(
//     (d) =>
//       `${d.time.getFullYear()}-${String(d.time.getMonth() + 1).padStart(2, "0")}-${String(
//         d.time.getDate()
//       ).padStart(2, "0")}-${String(d.time.getHours()).padStart(2, "0")}-${String(
//         d.time.getMinutes()
//       ).padStart(2, "0")}-${String(d.time.getSeconds()).padStart(2, "0")}:${d.visitors ?? Math.floor(
//         Math.random() * 50 + 160
//       )}`
//   )
//   .join("\n");


//   // Process chart data (simulate AI call like in Blazor)
//   const processChartData = async (): Promise<void> => {
//     const spinnerTarget = chartWrapperRef.current;
//     if (!spinnerTarget) return;

//     if (!spinnerTarget.querySelector(".e-spinner-pane")) {
//       createSpinner({
//         target: spinnerTarget,
//         cssClass: "chart-spinner-overlay",
//       });
//     }
//     showSpinner(spinnerTarget);

//     const prompt = generatePrompt(originalList);

//     // Simulate OpenAIService.GetCompletionAsync
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     // Fake AI response (normally call API)
//     const fakeResponse = originalList
//       .map(
//         (d) =>
//           `${d.time
//             .toISOString()
//             .replace("T", "-")
//             .slice(0, 19)
//             .replace(/:/g, "-")}:${d.visitors ?? Math.floor(Math.random() * 50 + 160)}`
//       )
//       .join("\n");

//     // const processedData = convertAIResponseToChartData(
//     //   fakeResponse,
//     //   originalList
//     // );
//     // if (processedData.length > 0) {
//     //   setChartData(processedData);
//     // }

//     hideSpinner(spinnerTarget);
//   };

//   return (
//     <div className="control-pane">
//       <div className="control-section">
//         <h4 style={{ textAlign: "center" }}>Data Preprocessing</h4>
//         <p>
//           The <b>Data Preprocessing</b> sample uses Syncfusion React Charts to visualize datasets
//           containing missing or inconsistent values. Click the AI Assist button to simulate AI processing.
//         </p>

//         <div id="chart-wrapper" className="chart-wrapper" ref={chartWrapperRef}>
//           <ButtonComponent
//             cssClass="e-primary chart-action-button-right"
//             iconCss="e-icons e-ai-chat"
//             onClick={processChartData}
//           />

//           <ChartComponent
//             id="chart-container"
//             primaryXAxis={{
//               valueType: "DateTime",
//               minimum: new Date(2024, 6, 1, 0, 0),
//               maximum: new Date(2024, 6, 1, 23, 0),
//               labelFormat: "h tt",
//               edgeLabelPlacement: "Shift",
//               majorGridLines: { width: 0 },
//             }}
//             primaryYAxis={{ minimum: 140, maximum: 320, interval: 30 }}
//             title="E-Commerce Website Traffic Data"
//             subTitle="AI-powered data cleaning and preprocessing for tracking hourly website visitors"
//             legendSettings={{ visible: true, position: "Top" }}
//             chartArea={{ border: { width: 0 } }}
//             tooltip={{ enable: true }}
//           >
//             <Inject services={[MultiColoredLineSeries, DateTime, Legend, Tooltip]} />
//             <SeriesCollectionDirective>
//               <SeriesDirective
//                 dataSource={chartData}
//                 type="MultiColoredLine"
//                 xName="time"
//                 yName="visitors"
//                 name="Visitors"
//                 pointColorMapping="color"
//               />
//             </SeriesCollectionDirective>
//           </ChartComponent>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DataPreprocessing;

// DataPreprocessing.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  MultiColoredLineSeries,
  DateTime,
  Legend,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { createSpinner, showSpinner, hideSpinner } from "@syncfusion/ej2-popups";
import "./DataPreprocessing.css";

interface ChartDataPoint {
  time: Date;
  visitors: number | null;
  color?: string;
}

const originalList: ChartDataPoint[] = [
  { time: new Date(2024, 6, 1, 0, 0, 0), visitors: 150 },
  { time: new Date(2024, 6, 1, 1, 0, 0), visitors: 160 },
  { time: new Date(2024, 6, 1, 2, 0, 0), visitors: 155 },
  { time: new Date(2024, 6, 1, 3, 0, 0), visitors: null },
  { time: new Date(2024, 6, 1, 4, 0, 0), visitors: 170 },
  { time: new Date(2024, 6, 1, 5, 0, 0), visitors: 175 },
  { time: new Date(2024, 6, 1, 6, 0, 0), visitors: 145 },
  { time: new Date(2024, 6, 1, 7, 0, 0), visitors: 180 },
  { time: new Date(2024, 6, 1, 8, 0, 0), visitors: null },
  { time: new Date(2024, 6, 1, 9, 0, 0), visitors: 185 },
  { time: new Date(2024, 6, 1, 10, 0, 0), visitors: 200 },
  { time: new Date(2024, 6, 1, 11, 0, 0), visitors: null },
  { time: new Date(2024, 6, 1, 12, 0, 0), visitors: 220 },
  { time: new Date(2024, 6, 1, 13, 0, 0), visitors: 230 },
  { time: new Date(2024, 6, 1, 14, 0, 0), visitors: null },
  { time: new Date(2024, 6, 1, 15, 0, 0), visitors: 250 },
  { time: new Date(2024, 6, 1, 16, 0, 0), visitors: 260 },
  { time: new Date(2024, 6, 1, 17, 0, 0), visitors: 270 },
  { time: new Date(2024, 6, 1, 18, 0, 0), visitors: null },
  { time: new Date(2024, 6, 1, 19, 0, 0), visitors: 280 },
  { time: new Date(2024, 6, 1, 20, 0, 0), visitors: 250 },
  { time: new Date(2024, 6, 1, 21, 0, 0), visitors: 290 },
  { time: new Date(2024, 6, 1, 22, 0, 0), visitors: 300 },
  { time: new Date(2024, 6, 1, 23, 0, 0), visitors: null },
];

const DataPreprocessing: React.FC = () => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const chartWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChartData([...originalList]);
  }, []);

  const generatePrompt = (data: ChartDataPoint[]): string => {
    let prompt =
      "Clean the following e-commerce website traffic data, resolve outliers and fill missing values:\n";
    data.forEach((d) => {
      prompt += `${d.time
        .toISOString()
        .replace("T", "-")
        .slice(0, 19)
        .replace(/:/g, "-")}: ${d.visitors}\n`;
    });
    prompt +=
      "and the output cleaned data should be in the yyyy-MM-dd-HH-m-ss:Value format, no other explanation required";
    return prompt;
  };

  const convertAIResponseToChartData = (
    response: string,
    original: ChartDataPoint[]
  ): ChartDataPoint[] => {
    const lines = response.split("\n").filter((line) => line.trim() !== "");
    const result: ChartDataPoint[] = [];
    let count = 0;

    lines.forEach((line) => {
      const [dateStr, valueStr] = line.split(":");
      if (dateStr && valueStr) {
        const date = new Date(dateStr.replace(/-/g, "/"));
        const visitors = parseFloat(valueStr.trim());
        if (!isNaN(date.getTime()) && !isNaN(visitors)) {
          const isCurrNull = original[count]?.visitors == null;
          const isNextNull = original[count + 1]?.visitors == null;
          const color = isCurrNull || isNextNull ? "#D84227" : undefined;

          result.push({
            time: date,
            visitors,
            color,
          });
          count++;
        }
      }
    });

    return result;
  };

  const processChartData = async () => {
    const spinnerTarget = chartWrapperRef.current;
    if (!spinnerTarget) return;

    if (!spinnerTarget.querySelector(".e-spinner-pane")) {
      createSpinner({
        target: spinnerTarget,
        cssClass: "chart-spinner-overlay",
      });
    }
    showSpinner(spinnerTarget);

    const prompt = generatePrompt(originalList);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const fakeResponse = originalList
      .map(
        (d) =>
          `${d.time
            .toISOString()
            .replace("T", "-")
            .slice(0, 19)
            .replace(/:/g, "-")}:${d.visitors ?? Math.floor(Math.random() * 50 + 160)}`
      )
      .join("\n");

    const processedData = convertAIResponseToChartData(fakeResponse, originalList);
    if (processedData.length > 0) {
      setChartData(processedData);
    }

    hideSpinner(spinnerTarget);
  };

  return (
    <div className="control-pane">
      <div className="control-section">
        <h4 style={{ textAlign: "center" }}>Data Preprocessing</h4>
        <p>
          The <b>Data Preprocessing</b> sample uses Syncfusion React Charts to
          visualize datasets containing missing or inconsistent values. Click the
          AI Assist button to simulate AI processing.
        </p>

        <div id="chart-wrapper" className="chart-wrapper" ref={chartWrapperRef}>
          <ButtonComponent
            cssClass="e-primary chart-action-button-right"
            iconCss="e-icons e-ai-chat"
            onClick={processChartData}
          />

          <ChartComponent
            id="chart-container"
            primaryXAxis={{
              valueType: "DateTime",
              minimum: new Date(2024, 6, 1, 0, 0),
              maximum: new Date(2024, 6, 1, 23, 0),
              labelFormat: "h tt",
              edgeLabelPlacement: "Shift",
              majorGridLines: { width: 0 },
            }}
            primaryYAxis={{ minimum: 140, maximum: 320, interval: 30 }}
            title="E-Commerce Website Traffic Data"
            subTitle="AI-powered data cleaning and preprocessing for tracking hourly website visitors"
            legendSettings={{ visible: true, position: "Top" }}
            chartArea={{ border: { width: 0 } }}
            tooltip={{ enable: true }}
          >
            <Inject services={[MultiColoredLineSeries, DateTime, Legend, Tooltip]} />
            <SeriesCollectionDirective>
              <SeriesDirective
                dataSource={chartData}
                type="MultiColoredLine"
                xName="time"
                yName="visitors"
                name="Visitors"
                pointColorMapping="color"
              />
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>
      </div>
    </div>
  );
};

export default DataPreprocessing;





// //AI********************

// import React, { useEffect, useRef, useState } from "react";
// import {
//   ChartComponent,
//   SeriesCollectionDirective,
//   SeriesDirective,
//   Inject,
//   MultiColoredLineSeries,
//   DateTime,
//   Legend,
//   Tooltip,
// } from "@syncfusion/ej2-react-charts";
// import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
// import { createSpinner, showSpinner, hideSpinner } from "@syncfusion/ej2-popups";
// import "./DataPreprocessing.css";

// // Data model
// interface ChartDataPoint {
//   time: Date;
//   visitors: number | null;
//   color?: string | null;
// }

// // Original list (equivalent to Blazor originalList)
// const originalList: ChartDataPoint[] = [
//   { time: new Date(2024, 6, 1, 0, 0, 0), visitors: 150 },
//   { time: new Date(2024, 6, 1, 1, 0, 0), visitors: 160 },
//   { time: new Date(2024, 6, 1, 2, 0, 0), visitors: 155 },
//   { time: new Date(2024, 6, 1, 3, 0, 0), visitors: null },
//   { time: new Date(2024, 6, 1, 4, 0, 0), visitors: 170 },
//   { time: new Date(2024, 6, 1, 5, 0, 0), visitors: 175 },
//   { time: new Date(2024, 6, 1, 6, 0, 0), visitors: 145 },
//   { time: new Date(2024, 6, 1, 7, 0, 0), visitors: 180 },
//   { time: new Date(2024, 6, 1, 8, 0, 0), visitors: null },
//   { time: new Date(2024, 6, 1, 9, 0, 0), visitors: 185 },
//   { time: new Date(2024, 6, 1, 10, 0, 0), visitors: 200 },
//   { time: new Date(2024, 6, 1, 11, 0, 0), visitors: null },
//   { time: new Date(2024, 6, 1, 12, 0, 0), visitors: 220 },
//   { time: new Date(2024, 6, 1, 13, 0, 0), visitors: 230 },
//   { time: new Date(2024, 6, 1, 14, 0, 0), visitors: null },
//   { time: new Date(2024, 6, 1, 15, 0, 0), visitors: 250 },
//   { time: new Date(2024, 6, 1, 16, 0, 0), visitors: 260 },
//   { time: new Date(2024, 6, 1, 17, 0, 0), visitors: 270 },
//   { time: new Date(2024, 6, 1, 18, 0, 0), visitors: null },
//   { time: new Date(2024, 6, 1, 19, 0, 0), visitors: 280 },
//   { time: new Date(2024, 6, 1, 20, 0, 0), visitors: 250 },
//   { time: new Date(2024, 6, 1, 21, 0, 0), visitors: 290 },
//   { time: new Date(2024, 6, 1, 22, 0, 0), visitors: 300 },
//   { time: new Date(2024, 6, 1, 23, 0, 0), visitors: null },
// ];

// const DataPreprocessing: React.FC = () => {
//   const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
//   const chartWrapperRef = useRef<HTMLDivElement>(null);

//   // Equivalent to OnInitialized → load original data
//   useEffect(() => {
//     loadOriginalData();
//   }, []);

//   const loadOriginalData = () => {
//     setChartData([...originalList]); // reset chart data from original list
//   };

//   // GeneratePrompt (convert chartData to AI input format)
//   const generatePrompt = (data: ChartDataPoint[]): string => {
//     let prompt =
//       "Clean the following e-commerce website traffic data, resolve outliers and fill missing values:\n";
//     data.forEach((d) => {
//       prompt += `${d.time
//         .toISOString()
//         .replace("T", "-")
//         .slice(0, 19)
//         .replace(/:/g, "-")}: ${d.visitors}\n`;
//     });
//     prompt +=
//       "and the output cleaned data should be in the yyyy-MM-dd-HH-m-ss:Value format, no other explanation required";
//     return prompt;
//   };

//   // Convert AI Response → ChartData
//   const convertAIResponseToChartData = (
//     response: string,
//     original: ChartDataPoint[]
//   ): ChartDataPoint[] => {
//     const lines = response.split("\n").filter((line) => line.trim() !== "");
//     const result: ChartDataPoint[] = [];
//     let count = 0;

//     for (const line of lines) {
//       const parts = line.split(":");
//       if (parts.length === 2) {
//         const dateStr = parts[0].trim();
//         const valueStr = parts[1].trim();
//         const date = new Date(dateStr.replace(/-/g, ":").replace(" ", "T")); // simple parse
//         const visitors = parseFloat(valueStr);

//         const isCurrNull = original[count]?.visitors == null;
//         const isNextNull = original[count + 1]?.visitors == null;
//         const color = isCurrNull || isNextNull ? "#D84227" : "#3C78D8";

//         result.push({ time: date, visitors, color });
//         count++;
//       }
//     }
//     return result;
//   };

//   // Process chart data (simulate AI call like in Blazor)
//   const processChartData = async (): Promise<void> => {
//     const spinnerTarget = chartWrapperRef.current;
//     if (!spinnerTarget) return;

//     if (!spinnerTarget.querySelector(".e-spinner-pane")) {
//       createSpinner({
//         target: spinnerTarget,
//         cssClass: "chart-spinner-overlay",
//       });
//     }
//     showSpinner(spinnerTarget);

//     const prompt = generatePrompt(originalList);

//     // Simulate OpenAIService.GetCompletionAsync
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     // Fake AI response (normally call API)
//     const fakeResponse = originalList
//       .map(
//         (d) =>
//           `${d.time
//             .toISOString()
//             .replace("T", "-")
//             .slice(0, 19)
//             .replace(/:/g, "-")}:${
//             d.visitors ?? Math.floor(Math.random() * 50 + 160)
//           }`
//       )
//       .join("\n");

//     const processedData = convertAIResponseToChartData(
//       fakeResponse,
//       originalList
//     );
//     if (processedData.length > 0) {
//       setChartData(processedData);
//     }

//     // Auto-hide spinner after 3 seconds
//     setTimeout(() => {
//       hideSpinner(spinnerTarget);
//     }, 3000);
//   };

//   return (
//     <div className="control-pane">
//       <div className="control-section">
//         <h4 style={{ textAlign: "center" }}>Data Preprocessing</h4>
//         <p>
//           The <b>Data Preprocessing</b> sample uses Syncfusion React Charts to
//           clean and visualize datasets containing missing or inconsistent
//           values. Click the AI Assist button to preprocess missing data.
//         </p>

//         <div
//           id="chart-wrapper"
//           className="chart-wrapper"
//           ref={chartWrapperRef}
//         >
//           <ButtonComponent
//             cssClass="e-primary chart-action-button"
//             iconCss="e-icons e-ai-chat"
//             onClick={processChartData}
//           />

//           <ChartComponent
//             id="chart-container"
//             primaryXAxis={{
//               valueType: "DateTime",
//               minimum: new Date(2024, 6, 1, 0, 0),
//               maximum: new Date(2024, 6, 1, 23, 0),
//               labelFormat: "h tt",
//               edgeLabelPlacement: "Shift",
//               majorGridLines: { width: 0 },
//             }}
//             primaryYAxis={{ minimum: 140, maximum: 320, interval: 30 }}
//             title="E-Commerce Website Traffic Data"
//             subTitle="AI-powered data cleaning and preprocessing for tracking hourly website visitors"
//             legendSettings={{ visible: true, position: "Top" }}
//             chartArea={{ border: { width: 0 } }}
//             tooltip={{ enable: true }}
//           >
//             <Inject
//               services={[MultiColoredLineSeries, DateTime, Legend, Tooltip]}
//             />
//             <SeriesCollectionDirective>
//               <SeriesDirective
//                 dataSource={chartData}
//                 type="MultiColoredLine"
//                 xName="time"
//                 yName="visitors"
//                 name="Visitors"
//                 pointColorMapping="color"
//               />
//             </SeriesCollectionDirective>
//           </ChartComponent>
//         </div>
//       </div>
//     </div>
//   );
// };

//  export default DataPreprocessing;
