import {
    Chart, CandleSeries, LineSeries, HiloOpenCloseSeries, DateTime, Crosshair, Tooltip, Legend,
    ILoadedEventArgs, ChartTheme
} from '@syncfusion/ej2-charts';
import { Button } from '@syncfusion/ej2-buttons';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { DropDownButton, ItemModel } from '@syncfusion/ej2-splitbuttons';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';

// Import JSON data directly
import msftData from '../data/msft-data.json';
import googData from '../data/goog-data.json';
import amznData from '../data/amzn-data.json';
import tslaData from '../data/tsla-data.json';


Chart.Inject(CandleSeries, LineSeries, HiloOpenCloseSeries, DateTime, Crosshair, Tooltip, Legend);

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

class StockForecasting {
    private chart: Chart;
    private selectedSymbol: string = 'MSFT';
    private selectedSeriesType: string = 'Candle';
    private selectedRange: number = 3;
    private chartData: ChartPoint[] = [];
    private stripStartDate: Date = new Date();
    private stripEndDate: Date = new Date();
    private selectedStockInfo: StockInfo | null = null;
    private chartWrapper: HTMLElement;

    constructor() {
        this.chart = null!;
        this.chartWrapper = document.getElementById('chartWrapper')!;
        this.selectedStockInfo = this.getDefaultStockInfo(this.selectedSymbol);
        this.initializeChart();
        this.initializeAIButton();
        this.initializeSeriesDropdown();
        this.initializeRangeButtons();
        this.loadChartData();
        this.updateStockInfoDisplay();
    }

    private initializeChart(): void {
        this.chart = new Chart({
            primaryXAxis: {
                valueType: 'DateTime',
                labelFormat: 'MMM yyyy',
                crosshairTooltip: { enable: true },
                majorGridLines: { width: 0 },
                stripLines: [{ start: this.stripStartDate, end: this.stripEndDate, color: '#E0E0E0', }]
            },
            primaryYAxis: {
                rangePadding: 'None',
                labelFormat: 'n0',
                lineStyle: { width: 0 },
                majorTickLines: { width: 0 }
            },
            legendSettings: { visible: false },
            tooltip: { enable: true, shared: true, header: '' },
            crosshair: { enable: true, lineType: 'Vertical' },
            series: [],
            chartArea: { border: { width: 0 } },
            width: '100%',
            theme: this.getTheme(),
            load: this.onChartLoad.bind(this)
        });
        this.chart.appendTo('#chart-container');
    }

    private getTheme(): ChartTheme {
        const mode = window.location.href.includes('dark') ? 'Dark' : 'Light';
        return `Material${mode}` as ChartTheme;
    }

    private onChartLoad(args: ILoadedEventArgs): void {
        args.chart.theme = this.getTheme();
    }

    private getDefaultStockInfo(symbol: string): StockInfo {
        switch (symbol) {
            case 'MSFT': return { symbol: 'MSFT', text: 'Microsoft Corp', close: 138.35, change: -2.0, percentChange: -0.22 };
            case 'GOOG': return { symbol: 'GOOG', text: 'Alphabet Inc', close: 152.83, change: -2.0, percentChange: -0.22 };
            case 'AMZN': return { symbol: 'AMZN', text: 'Amazon Inc', close: 222.27, change: -2.0, percentChange: -0.22 };
            case 'TSLA': return { symbol: 'TSLA', text: 'Tesla Inc', close: 201.73, change: -2.0, percentChange: -0.22 };
            default: return { symbol, text: '', close: 0.0, change: 0.0, percentChange: 0.0 };
        }
    }

    private loadChartData(): void {
        try {
            let json: any[] = [];

            if (this.selectedSymbol === "GOOG") json = googData;
            else if (this.selectedSymbol === "AMZN") json = amznData;
            else if (this.selectedSymbol === "TSLA") json = tslaData;
            else { json = msftData; this.selectedSymbol = "MSFT"; }

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
            console.error("Error loading chart data:", error);
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
        if (cutoffDate.getMonth() !== intendedMonth) cutoffDate.setDate(0);
        return allData.filter(p => p.date >= cutoffDate).sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    private renderChart(): void {
        this.chart!.series = [{
            dataSource: this.chartData,
            xName: 'date',
            type: this.selectedSeriesType as 'Candle' | 'Line' | 'HiloOpenClose',
            name: this.selectedStockInfo?.text,
            high: this.selectedSeriesType !== 'Line' ? 'high' : undefined,
            low: this.selectedSeriesType !== 'Line' ? 'low' : undefined,
            open: this.selectedSeriesType !== 'Line' ? 'open' : undefined,
            close: this.selectedSeriesType !== 'Line' ? 'close' : undefined,
            yName: this.selectedSeriesType === 'Line' ? 'close' : undefined,
            bearFillColor: this.selectedSeriesType === 'Candle' ? '#2ecd71' : undefined,
            bullFillColor: this.selectedSeriesType === 'Candle' ? '#e74c3d' : undefined
        }];
        this.chart!.primaryXAxis.stripLines = [{
            start: this.stripStartDate,
            end: this.stripEndDate,
            color: '#E0E0E0'
        }];
        this.chart!.refresh();
    }

    private updateStockInfoDisplay(): void {
        const stockText = document.getElementById('stock-text');
        const stockClose = document.getElementById('stock-close');
        const stockChange = document.getElementById('stock-change');

        if (stockText && stockClose && stockChange && this.selectedStockInfo) {
            stockText.textContent = this.selectedStockInfo.text || '';
            stockClose.textContent = this.selectedStockInfo.close.toString();
            stockChange.textContent = `${this.selectedStockInfo.change} ${this.selectedStockInfo.percentChange}%`;
            stockChange.style.color = this.selectedStockInfo.change >= 0 ? 'green' : 'red';
        }
    }

    private initializeAIButton(): void {
        const button = new Button({
            cssClass: 'chart-action-button',
            isPrimary: true,
            iconCss: 'e-icons e-chat'

        });
        button.appendTo('#aiAssistBtn');

        button.element.addEventListener('click', async () => {
            await this.simulateAiAssist();
        });
    }

    private async simulateAiAssist(): Promise<void> {
        const target = document.getElementById("chartWrapper");
        if (!target) return;

        // Create spinner if not already present
        if (!target.querySelector(".e-spinner-pane")) {
            createSpinner({ target });
        }
        showSpinner(target);

        try {
            const response = await fetch("https://your-backend-api/forecast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    symbol: this.selectedSymbol,
                    data: this.chartData,
                }),
            });

            if (!response.ok) {
                throw new Error(`Forecast API failed: ${response.status}`);
            }

            const forecastData: any[] = await response.json();
            const nextData: ChartPoint[] = forecastData.map((d: any) => ({
                date: new Date(d.date),
                open: Number(d.open),
                high: Number(d.high),
                low: Number(d.low),
                close: Number(d.close),
            }));

            // Append forecast points to chart data
            this.chartData.push(...nextData);

            // Update chart
            if (this.chart && this.chart.series.length > 0) {
                this.chart.series[0].dataSource = this.chartData;
                this.chart.refresh();
            }
        } catch (err) {
            console.error("AI Assist failed:", err);
        } finally {
            hideSpinner(target);
        }
    }

    private initializeSeriesDropdown(): void {
        const seriesOptions: string[] = ['Candle', 'Line', 'HiloOpenClose'];

        const dropDownObj: DropDownList = new DropDownList({
            dataSource: seriesOptions,
            value: this.selectedSeriesType,   // keep default as current selected
            placeholder: 'Select Chart Type',
            change: (args) => {
                this.selectedSeriesType = args.value as string;
                this.renderChart(); // refresh chart on series type change
            }
        });

        dropDownObj.appendTo('#series-dropdown');
    }

    private initializeRangeButtons(): void {
        const button3M = new Button({ content: '3 Month', cssClass: 'range-button' });
        button3M.appendTo('#btn-3m');
        button3M.element.addEventListener('click', () => {
            this.selectedRange = 3;
            this.loadChartData();
        });

        const button6M = new Button({ content: '6 Month', cssClass: 'range-button' });
        button6M.appendTo('#btn-6m');
        button6M.element.addEventListener('click', () => {
            this.selectedRange = 6;
            this.loadChartData();
        });

        const button12M = new Button({ content: '1 Year', cssClass: 'range-button' });
        button12M.appendTo('#btn-12m');
        button12M.element.addEventListener('click', () => {
            this.selectedRange = 12;
            this.loadChartData();
        });
    }



    public initializeStockDropdown(): void {
        const items: ItemModel[] = [
            { text: 'MSFT', id: 'MSFT', iconCss: 'e-logo-msft stock-icon' },
            { text: 'GOOG', id: 'GOOG', iconCss: 'e-logo-goog stock-icon' },
            { text: 'AMZN', id: 'AMZN', iconCss: 'e-logo-amzn stock-icon' },
            { text: 'TSLA', id: 'TSLA', iconCss: 'e-logo-tsla stock-icon' }
        ];

        const dropDownButton = new DropDownButton({
            items,
            content: `<span class="e-logo-msft stock-icon"></span> MSFT`,
            select: (args: { item: ItemModel }) => {
                this.selectedSymbol = args.item.id as string;
                this.selectedStockInfo = this.getDefaultStockInfo(this.selectedSymbol);
                this.loadChartData();
                this.updateStockInfoDisplay();
                dropDownButton.content = `<span class="${args.item.iconCss}"></span> ${args.item.text}`;
            },
            beforeItemRender: (args: { element: HTMLElement; item: ItemModel }) => {
                args.element.innerHTML = `<span class="${args.item.iconCss}"></span> ${args.item.text}`;
            }
        });

        dropDownButton.appendTo('#stock-dropdown');
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const app = new StockForecasting();
    app.initializeStockDropdown();
});