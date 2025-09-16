import React, { useState, useEffect, useRef } from 'react';
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  CandleSeries,
  LineSeries,
  HiloOpenCloseSeries,
  DateTime,
  Crosshair,
  Tooltip,
  Legend
} from '@syncfusion/ej2-react-charts';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import './stock-forecasting.css';

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

const StockForecasting: React.FC = () => {
  const chartRef = useRef<ChartComponent>(null);

  const getDefaultStockInfo = (symbol: string): StockInfo => {
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
  };

  const [selectedSymbol, setSelectedSymbol] = useState<string>('MSFT');
  const [selectedSeriesType, setSelectedSeriesType] = useState<string>('Candle');
  const [selectedRange, setSelectedRange] = useState<number>(3);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [stripStartDate, setStripStartDate] = useState<Date>(new Date());
  const [stripEndDate, setStripEndDate] = useState<Date>(new Date());
  const [selectedStockInfo, setSelectedStockInfo] = useState<StockInfo>(getDefaultStockInfo('MSFT'));
  const [isSpinnerVisible, setIsSpinnerVisible] = useState<boolean>(false);

  const stocks = [
    { symbol: 'MSFT', text: 'Microsoft Corp', icon: '../image/microsoft.png' },
    { symbol: 'GOOG', text: 'Alphabet Inc', icon: '../image/google.png' },
    { symbol: 'AMZN', text: 'Amazon Inc', icon: '../image/amazon.png' },
    { symbol: 'TSLA', text: 'Tesla Inc', icon: '../image/tesla.png' },
  ];

  const seriesOptions = ['Candle', 'Line', 'HiloOpenClose'];

  const loadChartData = () => {
    try {
      let json: any[] = [];
      if (selectedSymbol === 'GOOG') {
        json = googData;
      } else if (selectedSymbol === 'AMZN') {
        json = amznData;
      } else if (selectedSymbol === 'TSLA') {
        json = tslaData;
      } else {
        json = msftData;
        setSelectedSymbol('MSFT');
      }

      if (!json || json.length === 0) {
        console.warn(`No data found for symbol: ${selectedSymbol}`);
        setChartData([]);
        renderChart();
        return;
      }

      const allData: ChartPoint[] = json.map((d: any) => ({
        date: new Date(d.date || d.Date),
        high: Number(d.high ?? d.High),
        low: Number(d.low ?? d.Low),
        open: Number(d.open ?? d.Open),
        close: Number(d.close ?? d.Close),
      }));

      const filteredData = filterChartData(allData, selectedRange);
      setChartData(filteredData);
      renderChart();
      setSelectedStockInfo(getDefaultStockInfo(selectedSymbol));
    } catch (error) {
      console.error('Error loading chart data:', error);
      setChartData([]);
      renderChart();
    }
  };

  const filterChartData = (allData: ChartPoint[], months: number): ChartPoint[] => {
    if (allData.length) {
      setStripStartDate(allData[0].date);
      setStripEndDate(allData[allData.length - 1].date);
    } else {
      setStripStartDate(new Date());
      setStripEndDate(new Date());
    }
    const latestDate = new Date(Math.max(...allData.map(p => p.date.getTime())));
    const cutoffDate = new Date(latestDate);
    const intendedMonth = latestDate.getMonth() - months + 1;
    cutoffDate.setMonth(intendedMonth);
    if (cutoffDate.getMonth() !== intendedMonth) {
      cutoffDate.setDate(0);
    }
    return allData.filter(p => p.date >= cutoffDate).sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const renderChart = () => {
    if (chartRef.current) {
      chartRef.current.series = [{
        dataSource: chartData,
        xName: 'date',
        type: selectedSeriesType as 'Candle' | 'Line' | 'HiloOpenClose',
        name: selectedStockInfo.text,
        high: selectedSeriesType !== 'Line' ? 'high' : undefined,
        low: selectedSeriesType !== 'Line' ? 'low' : undefined,
        open: selectedSeriesType !== 'Line' ? 'open' : undefined,
        close: selectedSeriesType !== 'Line' ? 'close' : undefined,
        yName: selectedSeriesType === 'Line' ? 'close' : undefined,
        bearFillColor: selectedSeriesType === 'Candle' ? '#2ecd71' : undefined,
        bullFillColor: selectedSeriesType === 'Candle' ? '#e74c3d' : undefined,
      }];
      chartRef.current.primaryXAxis.stripLines = [{
        start: stripStartDate,
        end: stripEndDate,
        color: '#E0E0E0',
      }];
      chartRef.current.refresh();
    }
  };

  const simulateAiAssist = async () => {
    setIsSpinnerVisible(true);
    const target = document.getElementById('chartWrapper');
    if (!target) return;

    if (!target.querySelector('.e-spinner-pane')) {
      createSpinner({ target });
    }
    showSpinner(target);

    try {
      const response = await fetch('https://your-backend-api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedSymbol,
          data: chartData,
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

      setChartData([...chartData, ...nextData]);
      renderChart();
    } catch (err) {
      console.error('AI Assist failed:', err);
    } finally {
      hideSpinner(target);
      setIsSpinnerVisible(false);
    }
  };

  useEffect(() => {
    loadChartData();
  }, [selectedSymbol, selectedRange, selectedSeriesType]);

  return (
    <div className="control-section">
      <div className="sidebar">
        <div className="stock-selection">
          <select
            id="stock-dropdown"
            className="e-dropdown"
            value={selectedSymbol}
            onChange={(e) => setSelectedSymbol(e.target.value)}
          >
            {stocks.map((stock) => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.text}
              </option>
            ))}
          </select>
          <p className="para" id="stock-text">{selectedStockInfo.text}</p>
        </div>
        <div className="stock-info" id="stock-info">
          <div>
            <span id="stock-close" className="price">{selectedStockInfo.close.toFixed(2)} USD</span>
            <br />
            <p id="stock-change" style={{ color: selectedStockInfo.change >= 0 ? 'green' : 'red' }}>
              {selectedStockInfo.change.toFixed(2)} {selectedStockInfo.percentChange.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
      <div className="main-content">
        <div className="control-bar">
          <div className="range-buttons">
            <div className="e-btn-group">
              <button className="e-btn range-button" onClick={() => setSelectedRange(3)}>3 Month</button>
              <button className="e-btn range-button" onClick={() => setSelectedRange(6)}>6 Month</button>
              <button className="e-btn range-button" onClick={() => setSelectedRange(12)}>1 Year</button>
            </div>
          </div>
          <div className="chart-controls">
            <div>
              <select
                id="series-dropdown"
                className="e-dropdown"
                value={selectedSeriesType}
                onChange={(e) => setSelectedSeriesType(e.target.value)}
              >
                {seriesOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <div id="spinner" className="chart-spinner-overlay" style={{ display: isSpinnerVisible ? 'block' : 'none' }}>
                <div className="e-spinner e-spin e-icon-loading"></div>
              </div>
              <ButtonComponent
                cssClass="chart-action-button"
                isPrimary={true}
                iconCss="e-icons e-ai-chat"
                onClick={simulateAiAssist}
              >
                <span className="e-icons e-ai-chat"></span>
              </ButtonComponent>
            </div>
          </div>
        </div>
        <div id="chart-container" className="chart-container">
          <ChartComponent
            id="chartWrapper"
            ref={chartRef}
            primaryXAxis={{
              valueType: 'DateTime',
              labelFormat: 'MMM yyyy',
              crosshairTooltip: { enable: true },
              majorGridLines: { width: 0 },
              stripLines: [{ start: stripStartDate, end: stripEndDate, color: '#E0E0E0' }],
            }}
            primaryYAxis={{
              rangePadding: 'None',
              labelFormat: 'n0',
              lineStyle: { width: 0 },
              majorTickLines: { width: 0 },
            }}
            legendSettings={{ visible: false }}
            tooltip={{ enable: true, shared: true, header: '' }}
            crosshair={{ enable: true, lineType: 'Vertical' }}
            chartArea={{ border: { width: 0 } }}
            width="100%"
          >
            <Inject services={[CandleSeries, LineSeries, HiloOpenCloseSeries, DateTime, Crosshair, Tooltip, Legend]} />
            <SeriesCollectionDirective>
              <SeriesDirective
                dataSource={chartData}
                xName="date"
                type={selectedSeriesType as 'Candle' | 'Line' | 'HiloOpenClose'}
                name={selectedStockInfo.text}
                high={selectedSeriesType !== 'Line' ? 'high' : undefined}
                low={selectedSeriesType !== 'Line' ? 'low' : undefined}
                open={selectedSeriesType !== 'Line' ? 'open' : undefined}
                close={selectedSeriesType !== 'Line' ? 'close' : undefined}
                yName={selectedSeriesType === 'Line' ? 'close' : undefined}
                bearFillColor={selectedSeriesType === 'Candle' ? '#2ecd71' : undefined}
                bullFillColor={selectedSeriesType === 'Candle' ? '#e74c3d' : undefined}
              />
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>
      </div>
    </div>
  );
};

export default StockForecasting;
