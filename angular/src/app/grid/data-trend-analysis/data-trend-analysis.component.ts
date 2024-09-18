import { Component, ViewChild } from '@angular/core';
import { GridComponent, GridModule, QueryCellInfoEventArgs } from '@syncfusion/ej2-angular-grids';
import { OverallData, MonthlyData } from './data'; // Assuming OverallData is imported from a data file
import { Query } from '@syncfusion/ej2-data';
import { getAzureChatAIRequest } from '../../ai-models/ai-models';
import { DropDownListComponent, DropDownListModule } from '@syncfusion/ej2-angular-dropdowns'
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
@Component({
  selector: 'app-data-trend-analysis',
  standalone: true,
  imports: [GridModule, DropDownListModule],
  templateUrl: './data-trend-analysis.component.html',
  styleUrls: ['./data-trend-analysis.component.css']
})
export class DataTrendAnalysisComponent {
  @ViewChild('grid', { static: true }) grid!: GridComponent;
  @ViewChild('yearDdl', { static: true }) yearDdl!: DropDownListComponent;
  public data: any[] = OverallData;
  public editSettings: Object = { allowAdding: true, newRowPosition: 'Bottom' };
  public query: Query = new Query().where('Month', 'contains', '2023');

  public GeneratedTrendData!: MonthlyData[];
  public GeneratePredictiveData!: MonthlyData[];
  public months2024: string[] = ['July 2024', 'August 2024', 'September 2024', 'October 2024', 'November 2024', 'December 2024'];
  public years: { Year: string; ID: string }[] = [
    { Year: '2022', ID: 'Year2022' },
    { Year: '2023', ID: 'Year2023' },
    { Year: '2024', ID: 'Year2024' },
  ];


  customizeCell(args: QueryCellInfoEventArgs): void {
    if (this.GeneratedTrendData != null && this.GeneratedTrendData.length > 0 && (args.data as MonthlyData).TrendColumn != null && (args.data as MonthlyData).TrendColumn?.indexOf(args.column?.field!)! > -1) {
      if ((args.data as MonthlyData).TrendColumn?.indexOf(args.column?.field! + '-Low')! > -1) {
        args.cell!.classList.add('low-values');
      }
      else {
        args.cell!.classList.add('high-values');
      }
    }
    let predictedRows: boolean = false;
    this.months2024.map((e: any) => {
      if (e.indexOf((args.data as MonthlyData).Month) > -1) {
        predictedRows = true;
      }
    })
    if (predictedRows) args.cell!.classList.add('predicted-rows');
  }
  ValueSelectHandler(args: any): void {
    if (args.itemData != null) {
      this.grid.query = new Query().where('Month', 'contains', (args.itemData as { Year: string }).Year);
  }
  }

  public getTrendData() {
    this.grid.showSpinner();
    if (this.yearDdl.text === '2024') {
      this.CalculatePredictiveData(this.yearDdl.text as string);
    }
    this.CalculateTrendAnalysis(this.yearDdl.text as string);
  }

  async CalculateTrendAnalysis(year: string) {
    let query: Query;
    if (!isNullOrUndefined(year)) {
      query = new Query().where('Month', 'contains', year);
    } else {
      query = new Query();
    }
    const gridJsonData: string = JSON.stringify(new DataManager(this.grid.dataSource as MonthlyData[]).executeLocal(query));
    const prompt: string = this.GeneratePrompt(gridJsonData);
    let aiOutput: any = getAzureChatAIRequest({ messages: [{ role: 'user', content: prompt }] });
    aiOutput.then((result: any) => {
      result = result.replace('```json', '').replace('```', '');
      this.GeneratedTrendData = JSON.parse(result);
      this.grid.hideSpinner();
      if (this.GeneratedTrendData.length) {
        for (let i: number = 0; i < this.GeneratedTrendData.length; i++) {
          const item = this.GeneratedTrendData[i];
          this.grid.setRowData(item.Month, item);
        }
      }
    });
  }

  async CalculatePredictiveData(year: string) {
    if (this.GeneratePredictiveData != null && this.GeneratePredictiveData.length > 0) {
      return;
    }
    const gridReportJson: string = JSON.stringify(this.grid.dataSource);
    const prompt: string = this.GeneratePredictivePrompt(gridReportJson);
    let aiOutput: any = getAzureChatAIRequest({ messages: [{ role: 'user', content: prompt }] });
    aiOutput.then((result: any) => {
      result = result.replace('```json', '').replace('```', '');
      this.GeneratePredictiveData = JSON.parse(result);
      if (this.GeneratePredictiveData.length > 0) {
        let rowIndex: number = 30;
        for (let i: number = 0; i < this.GeneratePredictiveData.length; i++) {
          let newRecord: MonthlyData = {
            Month: this.GeneratePredictiveData[i].Month,
            Sales: this.GeneratePredictiveData[i].Sales,
            MarketingSpend: this.GeneratePredictiveData[i].MarketingSpend,
            NewCustomers: this.GeneratePredictiveData[i].NewCustomers,
            ReturningCustomers: this.GeneratePredictiveData[i].ReturningCustomers,
          };
          this.grid.addRecord(newRecord, rowIndex);
          rowIndex += 1;
        }
      }
    });
  }

  GeneratePrompt(data: string): string {
    return `Given the following data source bounded in the Grid table\n\n${data}.\n I want you to act as a Trend Analyzer for the given data. Observe the data and perform a trend analysis for the columns Sales and MarketingSpend. For each row, update the result in the 'TrendColumn' field with the trend analyzed as High or Low based on the analysis result. Example: MarketingSpend-High.  Note: Include only the first 2 highest values and the 2 lowest values.\n\nGenerate the output in JSON format only and do not include any additional information or contents in the response.`;
  }
  GeneratePredictivePrompt(data: string): string {
    return `Given the following datasource are bounded in the Grid table\n\n${data}.\n I want you to Predict the future data by analyzing the historical report of the previous years. Predict the future sales for the next 6 months based on the given data. For Example: I have binded the Monthly reports for the past two years and first 6 months of this year by analyzing this historical data, i want you to predict my future monthly data for the upcoming 6 months for the year 2024. The generated data should be returned in the same format as i have binded in this prompt, do not add any additional content. \n\nGenerate an output in JSON format only and Should not include any additional information or contents in response`;
  }
}