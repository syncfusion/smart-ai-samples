import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChartModule, ChartComponent, CandleSeriesService, LineSeriesService, HiloOpenCloseSeriesService, DateTimeService, CrosshairService, TooltipService, LegendService } from '@syncfusion/ej2-angular-charts';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import msftData from '../data/msft-data.json';
import googData from '../data/goog-data.json';
import amznData from '../data/amzn-data.json';
import tslaData from '../data/tsla-data.json';

interface StockInfo {
  symbol: string;
  text: string;
  close: number;
  change: number;
  percentChange: number;
}

interface ChartPoint {
  date: Date;
  high: number;
  low: number;
  open: number;
  close: number;
}

@Component({
  selector: 'app-stock-forecast',
  templateUrl: './stockForecast.component.html',
  styleUrls: ['./stockForecast.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ChartModule, ButtonModule],
  providers: [CandleSeriesService, LineSeriesService, HiloOpenCloseSeriesService, DateTimeService, CrosshairService, TooltipService, LegendService]
})
export class StockForecastComponent implements AfterViewInit {
  @ViewChild('chart', { static: true }) chartObject!: ChartComponent;

  selectedSymbol: string = 'MSFT';
  selectedSeriesType: string = 'Candle';
  selectedRange: number = 3;
  chartData: ChartPoint[] = [];
  stripStartDate: Date = new Date();
  stripEndDate: Date = new Date();
  selectedStockInfo: StockInfo = this.getDefaultStockInfo('MSFT');
  isSpinnerVisible: boolean = false;

  stocks = [
    { symbol: 'MSFT', text: 'Microsoft Corp', icon: '../image/microsoft.png' },
    { symbol: 'GOOG', text: 'Alphabet Inc', icon: '../image/google.png' },
    { symbol: 'AMZN', text: 'Amazon Inc', icon: '../image/amazon.png' },
    { symbol: 'TSLA', text: 'Tesla Inc', icon: '../image/tesla.png' }
  ];

  seriesOptions: string[] = ['Candle', 'Line', 'HiloOpenClose'];

  public primaryXAxis = {
    valueType: 'DateTime',
    labelFormat: 'MMM yyyy',
    crosshairTooltip: { enable: true },
    majorGridLines: { width: 0 },
    stripLines: [{ start: this.stripStartDate, end: this.stripEndDate, color: '#E0E0E0' }]
  };

  public primaryYAxis = {
    rangePadding: 'None',
    labelFormat: 'n0',
    lineStyle: { width: 0 },
    majorTickLines: { width: 0 }
  };

  public legendSettings = { visible: false };
  public tooltip = { enable: true, shared: true, header: '' };
  public crosshair = { enable: true, lineType: 'Vertical' };
  public chartArea = { border: { width: 0 } };
  public width = '100%';
  public theme: string = this.getTheme();

  ngAfterViewInit(): void {
    this.loadChartData();
  }

  private getTheme(): string {
    const mode = window.location.href.includes('dark') ? 'Dark' : 'Light';
    return `Material${mode}`;
  }

  public onChartLoad(args: any): void {
    args.chart.theme = this.getTheme();
  }

  private getDefaultStockInfo(symbol: string): StockInfo {
    switch (symbol) {
      case 'MSFT':
        return { symbol: 'MSFT', text: 'Microsoft Corp', close: 138.35, change: -2.0, percentChange: -0.22 };
      case 'GOOG':
        return { symbol: 'GOOG', text: 'Alphabet Inc', close: 152.83, change: -2.0, percentChange: -0.22 };
      case 'AMZN':
        return { symbol: 'AMZN', text: 'Amazon Inc', close: 222.27, change: -2.0, percentChange: -0.22 };
      case 'TSLA':
        return { symbol: 'TSLA', text: 'Tesla Inc', close: 201.73, change: -2.0, percentChange: -0.22 };
      default:
        return { symbol, text: '', close: 0.0, change: 0.0, percentChange: 0.0 };
    }
  }

  private loadChartData(): void {
    try {
      let json: any[] = [];
      if (this.selectedSymbol === 'GOOG') {
        json = googData;
      } else if (this.selectedSymbol === 'AMZN') {
        json = amznData;
      } else if (this.selectedSymbol === 'TSLA') {
        json = tslaData;
      } else {
        json = msftData;
        this.selectedSymbol = 'MSFT';
      }

      if (!json || json.length === 0) {
        console.warn(`No data found for symbol: ${this.selectedSymbol}`);
        this.chartData = [];
        this.renderChart();
        return;
      }

      const allData: ChartPoint[] = json.map((d: any) => ({
        date: new Date(d.date || d.Date),
        high: Number(d.high ?? d.High),
        low: Number(d.low ?? d.Low),
        open: Number(d.open ?? d.Open),
        close: Number(d.close ?? d.Close)
      }));

      this.chartData = this.filterChartData(allData, this.selectedRange);
      this.renderChart();
      this.updateStockInfoDisplay();
    } catch (error) {
      console.error('Error loading chart data:', error);
      this.chartData = [];
      this.renderChart();
    }
  }

  private filterChartData(allData: ChartPoint[], months: number): ChartPoint[] {
    if (allData.length) {
      this.stripStartDate = allData[0].date;
      this.stripEndDate = allData[allData.length - 1].date;
    } else {
      this.stripStartDate = this.stripEndDate = new Date();
    }
    const latestDate = new Date(Math.max(...allData.map(p => p.date.getTime())));
    const cutoffDate = new Date(latestDate);
    const intendedMonth = latestDate.getMonth() - months + 1;
    cutoffDate.setMonth(intendedMonth);
    if (cutoffDate.getMonth() !== intendedMonth) {
      cutoffDate.setDate(0);
    }
    return allData.filter(p => p.date >= cutoffDate).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  public renderChart(): void {
    if (this.chartObject) {
      this.chartObject.series = [{
        dataSource: this.chartData,
        xName: 'date',
        type: this.selectedSeriesType as 'Candle' | 'Line' | 'HiloOpenClose',
        name: this.selectedStockInfo.text,
        high: this.selectedSeriesType !== 'Line' ? 'high' : undefined,
        low: this.selectedSeriesType !== 'Line' ? 'low' : undefined,
        open: this.selectedSeriesType !== 'Line' ? 'open' : undefined,
        close: this.selectedSeriesType !== 'Line' ? 'close' : undefined,
        yName: this.selectedSeriesType === 'Line' ? 'close' : undefined,
        bearFillColor: this.selectedSeriesType === 'Candle' ? '#2ecd71' : undefined,
        bullFillColor: this.selectedSeriesType === 'Candle' ? '#e74c3d' : undefined
      }];
      this.chartObject.primaryXAxis.stripLines = [{
        start: this.stripStartDate,
        end: this.stripEndDate,
        color: '#E0E0E0'
      }];
      this.chartObject.refresh();
    }
  }

  public updateStockInfoDisplay(): void {
    this.selectedStockInfo = this.getDefaultStockInfo(this.selectedSymbol);
  }

  public onStockChange(): void {
    this.loadChartData();
  }

  public onRangeChange(months: number): void {
    this.selectedRange = months;
    this.loadChartData();
  }

  public async onAIAssistClick(): Promise<void> {
    this.isSpinnerVisible = true;
    try {
      const prompt = this.generatePrompt(this.chartData);
      const response = await this.getAzureChatAIRequest({ messages: [{ role: 'user', content: prompt }] });
      if (response) {
        const processed = this.convertAIResponseToChartData(response, this.chartData);
        if (processed.length > 0) {
          this.chartData = [...this.chartData, ...processed];
          this.renderChart();
        }
      } else {
        console.error('AI response is null');
      }
    } catch (err) {
      console.error('Error during AI processing:', err);
    } finally {
      setTimeout(() => (this.isSpinnerVisible = false), 1000);
    }
  }

  private generatePrompt(historicalData: ChartPoint[]): string {
    const lastDate = historicalData.length > 0 ? historicalData[historicalData.length - 1].date : new Date();
    const startDate = new Date(lastDate);
    startDate.setDate(lastDate.getDate() + 1);
    let prompt = `Generate 35 realistic financial data points suitable for candlestick, OHLC, and line charts in ':' format. Use the following format for each row: yyyy-MM-dd:High:Low:Open:Close\nStart from ${startDate.toISOString().split('T')[0]} and increment by 1 day for each row.\n`;
    historicalData.forEach(data => {
      prompt += `${data.date.toISOString().split('T')[0]}:${data.high}:${data.low}:${data.open}:${data.close}\n`;
    });
    prompt += `\n### STRICT OUTPUT REQUIREMENTS ###\n- Generate EXACTLY 35 rows of data.\n- Each row must be in the format: yyyy-MM-dd:High:Low:Open:Close.\n- The predictions must include a natural mix of both upward and downward trends.\n- NO missing or duplicate dates.\n- NO extra text, explanations, or labels—just raw data.\n- Ensure that each day's values are **realistic** and follow stock market behavior.`;
    return prompt;
  }

  private convertAIResponseToChartData(response: string, originalData: ChartPoint[]): ChartPoint[] {
    const rows = response.split('\n').filter(row => row.trim().length > 0);
    const processedData: ChartPoint[] = [];
    for (const row of rows) {
      const parts = row.split(':');
      if (parts.length < 5) continue;
      const dateStr = parts[0].trim();
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) continue;
      const high = parseFloat(parts[1].trim()) || 0;
      const low = parseFloat(parts[2].trim()) || 0;
      const open = parseFloat(parts[3].trim()) || 0;
      const close = parseFloat(parts[4].trim()) || 0;
      processedData.push({ date, high, low, open, close });
    }
    return processedData;
  }

  private async getAzureChatAIRequest(data: { messages: { role: string; content: string }[] }): Promise<string | null> {
    console.log('API call placeholder - implement with real endpoint and key', data);
    return null;
  }
}