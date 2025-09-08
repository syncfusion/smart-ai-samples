import { Chart, DateTime, MultiColoredLineSeries, Legend, Tooltip, Category } from '@syncfusion/ej2-charts';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { Button } from '@syncfusion/ej2-buttons';
import { getAzureChatAIRequest } from '../../ai-models';

// ------------------------
// Chart Data Interface
// ------------------------
export interface ChartData {
  Time: Date;
  Visitors: number | null;
  Color?: string;
}

// Original dataset with nulls
export const originalList: ChartData[] = [
  { Time: new Date(2024, 6, 1, 0, 0, 0), Visitors: 150 },
  { Time: new Date(2024, 6, 1, 1, 0, 0), Visitors: 160 },
  { Time: new Date(2024, 6, 1, 2, 0, 0), Visitors: 155 },
  { Time: new Date(2024, 6, 1, 3, 0, 0), Visitors: null },
  { Time: new Date(2024, 6, 1, 4, 0, 0), Visitors: 170 },
  { Time: new Date(2024, 6, 1, 5, 0, 0), Visitors: 175 },
  { Time: new Date(2024, 6, 1, 6, 0, 0), Visitors: 145 },
  { Time: new Date(2024, 6, 1, 7, 0, 0), Visitors: 180 },
  { Time: new Date(2024, 6, 1, 8, 0, 0), Visitors: null },
  { Time: new Date(2024, 6, 1, 9, 0, 0), Visitors: 185 },
  { Time: new Date(2024, 6, 1, 10, 0, 0), Visitors: 200 },
  { Time: new Date(2024, 6, 1, 11, 0, 0), Visitors: null },
  { Time: new Date(2024, 6, 1, 12, 0, 0), Visitors: 220 },
  { Time: new Date(2024, 6, 1, 13, 0, 0), Visitors: 230 },
  { Time: new Date(2024, 6, 1, 14, 0, 0), Visitors: null },
  { Time: new Date(2024, 6, 1, 15, 0, 0), Visitors: 250 },
  { Time: new Date(2024, 6, 1, 16, 0, 0), Visitors: 260 },
  { Time: new Date(2024, 6, 1, 17, 0, 0), Visitors: 270 },
  { Time: new Date(2024, 6, 1, 18, 0, 0), Visitors: null },
  { Time: new Date(2024, 6, 1, 19, 0, 0), Visitors: 280 },
  { Time: new Date(2024, 6, 1, 20, 0, 0), Visitors: 250 },
  { Time: new Date(2024, 6, 1, 21, 0, 0), Visitors: 290 },
  { Time: new Date(2024, 6, 1, 22, 0, 0), Visitors: 300 },
  { Time: new Date(2024, 6, 1, 23, 0, 0), Visitors: null },
];

// ------------------------
// Chart Setup
// ------------------------
Chart.Inject(DateTime, MultiColoredLineSeries, Legend, Tooltip, Category);

let ChartDataCollection: ChartData[] = [...originalList];

const chart = new Chart({
  primaryXAxis: {
    valueType: 'DateTime',
    minimum: new Date(2024, 6, 1, 0, 0, 0),
    maximum: new Date(2024, 6, 1, 23, 0, 0),
    labelFormat: 'h a',
    majorGridLines: { width: 0 },
  },
  primaryYAxis: { minimum: 140, maximum: 320, interval: 30 },
  legendSettings: { visible: true, position: 'Top' },
  series: [{
    dataSource: ChartDataCollection,
    xName: 'Time',
    yName: 'Visitors',
    pointColorMapping: 'Color',
    name: 'Visitors',
    type: 'MultiColoredLine',
    width: 1,
    fill: '#6f16ef',
   
  }],
  title: 'E-Commerce Website Traffic Data',
  subTitle: 'AI-powered data cleaning and preprocessing for tracking hourly website visitors',
});

chart.appendTo('#Chart');

// ------------------------
// Spinner Setup
// ------------------------
const chartWrapper = document.querySelector('.chart-wrapper') as HTMLElement;
createSpinner({
  target: chartWrapper,
  cssClass: 'chart-spinner-overlay',
});

// ------------------------
// AI Assist Button
// ------------------------
const button = new Button({
  cssClass: 'chart-action-button',
  isPrimary: true,

  iconCss: 'e-icons e-ai-chat',
});
button.appendTo('#aiAssistBtn');

button.element.addEventListener('click', async () => {
  // Show spinner immediately
  showSpinner(chartWrapper);

  // Wait for browser to render spinner
  await new Promise(requestAnimationFrame);

  try {
    const prompt = GeneratePrompt(originalList);
    const response: string | null = await getAzureChatAIRequest({ messages: [{ role: 'user', content: prompt }] });

    if (!response) {
      console.error('AI response is null');
      return;
    }

    const processed = ConvertAIResponseToChartData(response, originalList);

    if (processed.length > 0) {
      ChartDataCollection = processed;
      chart.series[0].dataSource = ChartDataCollection;
      chart.refresh();
    }

  } catch (err) {
    console.error('Error during AI processing:', err);
  } finally {
    // Hide spinner after 3 seconds max
    setTimeout(() => hideSpinner(chartWrapper), 1000);
  }
});

// ------------------------
// Utility Functions
// ------------------------
function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function GeneratePrompt(data: ChartData[]): string {
  let prompt = 'Clean the following e-commerce website traffic data, resolve outliers and fill missing values:\n';
  data.forEach(d => {
    prompt += `${d.Time.getFullYear()}-${pad(d.Time.getMonth()+1)}-${pad(d.Time.getDate())}-${pad(d.Time.getHours())}-${pad(d.Time.getMinutes())}-${pad(d.Time.getSeconds())}: ${d.Visitors}\n`;
  });
  prompt += 'and the output cleaned data should be in the yyyy-MM-dd-HH-m-ss:Value format, no other explanation required';
  return prompt;
}

function ConvertAIResponseToChartData(response: string, original: ChartData[]): ChartData[] {
  const lines = response.split('\n').filter(l => l.trim() !== '');
  const result: ChartData[] = [];
  let count = 0;

  for (let line of lines) {
    const parts = line.split(':');
    if (parts.length === 2) {
      const [timeStr, valueStr] = parts;
      const [y, m, d, h, min, s] = timeStr.trim().split('-').map(Number);
      const date = new Date(y, m - 1, d, h, min, s);
      const visitors = parseFloat(valueStr.trim());

      const isCurrNull = original[count]?.Visitors === null;
      const isNextNull = !original[count + 1] || original[count + 1].Visitors === null;
      const color = (isCurrNull || isNextNull) ? '#D84227' : '#6f16ef';

      result.push({ Time: date, Visitors: visitors, Color: color });
      count++;
    }
  }
  return result;
}