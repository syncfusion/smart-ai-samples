import { Component, ViewChild } from '@angular/core';
import { ChartComponent, ChartAllModule, SeriesCollectionDirective, SeriesDirective } from '@syncfusion/ej2-angular-charts';
import { ButtonComponent } from '@syncfusion/ej2-angular-buttons';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { getAzureChatAIRequest } from '../../ai-models/azure_openai';  // your AI service
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';

interface ChartData {
  Time: Date;
  Visitors: number | null;
  Color?: string | null;
}


@Component({
  selector: 'app-data-preprocessing',
  standalone: true,

   imports: [ChartAllModule,  ButtonModule],
  templateUrl: './data-preprocessing.component.html',
  styleUrls: ['./data-preprocessing.component.css']
})



export class DataPreprocessingComponent {
  @ViewChild('chart', { static: true }) chart!: ChartComponent;

  public chartData: ChartData[] = [];
  public originalData: ChartData[] = [
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

  ngOnInit(): void {
    this.loadOriginalData();
  }

  loadOriginalData(): void {
    this.chartData = [...this.originalData];
  }

  // async processChartData(): Promise<void> {
  //   const chartContainer = document.getElementById('chart-wrapper') as HTMLElement;
  //   createSpinner({ target: chartContainer });
  //   showSpinner(chartContainer);

  //   const prompt = this.generatePrompt(this.originalData);
  //   let response: string = await getAzureChatAIRequest({
  //     messages: [{ role: 'user', content: prompt }]
  //   });

  //   response = response.replace('```json', '').replace('```', '');
  //   const processed = this.convertAIResponseToChartData(response, this.originalData);

  //   if (processed.length) {
  //     this.chartData = [...processed];
  //   }

  //   hideSpinner(chartContainer);
  // }
   
  async processChartData(): Promise<void> {
  const chartContainer = document.getElementById('chart-wrapper') as HTMLElement;
  createSpinner({ target: chartContainer });
  showSpinner(chartContainer);

  // Hide spinner after 3 seconds, regardless of AI response
  setTimeout(() => {
    hideSpinner(chartContainer);
  }, 1000);

  const prompt = this.generatePrompt(this.originalData);
  let response: string = await getAzureChatAIRequest({
    messages: [{ role: 'user', content: prompt }]
  });

  response = response.replace('```json', '').replace('```', '');
  const processed = this.convertAIResponseToChartData(response, this.originalData);

  if (processed.length) {
    this.chartData = [...processed];
  }
}


  generatePrompt(data: ChartData[]): string {
    let prompt = 'Clean the following e-commerce website traffic data, resolve outliers and fill missing values:\n';
    for (let d of data) {
      prompt += `${d.Time.getFullYear()}-${(d.Time.getMonth() + 1)
        .toString().padStart(2, '0')}-${d.Time.getDate().toString().padStart(2, '0')}-${d.Time.getHours().toString().padStart(2, '0')}-00-00: ${d.Visitors}\n`;
    }
    prompt += 'and the output cleaned data should be in the yyyy-MM-dd-HH-m-ss:Value format, no other explanation required';
    return prompt;
  }

  convertAIResponseToChartData(response: string, original: ChartData[]): ChartData[] {
    const lines = response.split('\n').filter(l => l.trim().length > 0);
    const result: ChartData[] = [];
    let count = 0;

    for (let line of lines) {
      const parts = line.split(':');
      if (parts.length === 2) {
        const dateStr = parts[0].trim();
        const valueStr = parts[1].trim();

        const [yyyy, MM, dd, HH, mm, ss] = dateStr.split('-').map(Number);
        const date = new Date(yyyy, MM - 1, dd, HH, mm, ss);
        const visitors = Number(valueStr);

        const isCurrNull = original[count]?.Visitors == null;
        const isNextNull = original[count + 1]?.Visitors == null;
        const color = (isCurrNull || isNextNull) ? '#D84227' : null;

        result.push({ Time: date, Visitors: visitors, Color: color });
        count++;
      }
    }
    return result;
  }
}
