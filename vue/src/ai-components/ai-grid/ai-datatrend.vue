<template>
    <div class="control-pane">
      <div class="control-section">
        <div class="e-card-header-title" style="font-weight: 600; text-align: center; padding: 10px;">AI Driven Data Trend Analysis in DataGrid</div>
        <div class="description-container e-card">
          <div class="e-card-content">
            <p>
              This sample demonstrates how the Syncfusion Vue DataGrid, powered by AI, can perform trend analysis on its
              data.
            </p>
          </div>
        </div>
        <div id="container">
          <div class="dddata">
            <ejs-dropdownlist ref="yearDdl" id="year_ddl" :dataSource="years" :fields="{ text: 'Year', value: 'ID' }"
              :value="'Year2023'" placeholder="Select a year" :width="150"
              @select="valueSelectHandler"></ejs-dropdownlist>
            <ejs-button id="get_trend_data" :isPrimary="true" @click="getTrendData">Get Trend Data</ejs-button>
          </div>
          <ejs-grid ref="gridInstance" id="Grid" :dataSource="overallData"
            :queryCellInfo="customizeCell" :editSettings="editSettings"
            :enableAltRow="true" :allowSorting="true" :enableHover="false" :allowSelection="false" :query="initialQuery">
            <e-columns>
              <e-column field="Month" isPrimaryKey="true" headerText="Time Stamp" width="100"></e-column>
              <e-column field="Sales" headerText="Sales" textAlign="Right" format="C2" width="80"></e-column>
              <e-column field="MarketingSpend" headerText="Marketing Spend" textAlign="Right" format="C2"
                width="80"></e-column>
              <e-column field="NewCustomers" headerText="New Customers" textAlign="Right" width="80"></e-column>
              <e-column field="ReturningCustomers" headerText="Returning Customers" textAlign="Right"
                width="100"></e-column>
            </e-columns>
          </ejs-grid>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { GridComponent, ColumnDirective, ColumnsDirective, Sort, Edit} from "@syncfusion/ej2-vue-grids";
  import { ButtonComponent } from "@syncfusion/ej2-vue-buttons";
  import { DropDownListComponent } from '@syncfusion/ej2-vue-dropdowns';
  import { OverallData } from './data-source';
  import { Query, DataManager } from '@syncfusion/ej2-data';
  import { getAzureChatAIRequest } from '../common/ai-models';
  
  export default {
    components: {
      'ejs-grid': GridComponent,
      'e-column': ColumnDirective,
      'e-columns': ColumnsDirective,
      'ejs-dropdownlist': DropDownListComponent,
      'ejs-button': ButtonComponent,
    },
    data() {
      return {
        overallData: OverallData,
        generatedTrendData: [],
        generatePredictiveData: [],
        months2024: ['July 2024', 'August 2024', 'September 2024', 'October 2024', 'November 2024', 'December 2024'],
        years: [
          { Year: '2022', ID: 'Year2022' },
          { Year: '2023', ID: 'Year2023' },
          { Year: '2024', ID: 'Year2024' },
        ],
        initialQuery: new Query().where('Month', 'contains', '2023'),
        editSettings: { allowAdding: true, newRowPosition: 'Bottom' },
      };
    },
    methods: {
      customizeCell(args) {
        if (this.generatedTrendData.length > 0 && args.data.TrendColumn != null && args.data.TrendColumn.indexOf(args.column.field) > -1) {
          if (args.data.TrendColumn.indexOf(args.column.field + '-Low') > -1) {
            args.cell.classList.add('low-values');
          } else {
            args.cell.classList.add('high-values');
          }
        }
        let predictedRows = false;
        this.months2024.forEach((e) => {
          if (e.indexOf(args.data.Month) > -1) {
            predictedRows = true;
          }
        });
        if (predictedRows) args.cell.classList.add('predicted-rows');
      },
      valueSelectHandler(args) {
        if (args.itemData != null) {
          this.$refs.gridInstance.ej2Instances.query = new Query().where('Month', 'contains', args.itemData.Year);
        }
      },
      getTrendData() {
        this.$refs.gridInstance.ej2Instances.showSpinner();
        if (this.$refs.yearDdl.ej2Instances.text === '2024') {
          this.calculatePredictiveData(this.$refs.yearDdl.ej2Instances.text);
        }
        this.calculateTrendAnalysis(this.$refs.yearDdl.ej2Instances.text);
      },
      async calculateTrendAnalysis(year) {
        let query = year ? new Query().where('Month', 'contains', year) : new Query();
        const gridJsonData = JSON.stringify(new DataManager(this.$refs.gridInstance.ej2Instances.dataSource).executeLocal(query));
        const prompt = this.generatePrompt(gridJsonData);
        try {
          let aiOutput = await getAzureChatAIRequest({ messages: [{ role: 'user', content: prompt }] });
          aiOutput = aiOutput.replace('```json', '').replace('```', '');
          this.generatedTrendData = JSON.parse(aiOutput);
          this.$refs.gridInstance.ej2Instances.hideSpinner();
          if (this.generatedTrendData.length) {
            for (let i = 0; i < this.generatedTrendData.length; i++) {
              const item = this.generatedTrendData[i];
              this.$refs.gridInstance.ej2Instances.setRowData(item.Month, item);
            }
          }
        } catch (error) {
          console.error('Error in calculateTrendAnalysis:', error);
          this.$refs.gridInstance.ej2Instances.hideSpinner();
        }
      },
      async calculatePredictiveData() {
        if (this.generatePredictiveData.length > 0) {
          return;
        }
        const gridReportJson = JSON.stringify(this.$refs.gridInstance.ej2Instances.dataSource);
        const prompt = this.generatePredictivePrompt(gridReportJson);
        try {
          let aiOutput = await getAzureChatAIRequest({ messages: [{ role: 'user', content: prompt }] });
          aiOutput = aiOutput.replace('```json', '').replace('```', '');
          this.generatePredictiveData = JSON.parse(aiOutput);
          if (this.generatePredictiveData.length > 0) {
            let rowIndex = 30;
            for (let i = 0; i < this.generatePredictiveData.length; i++) {
              let newRecord = {
                Month: this.generatePredictiveData[i].Month,
                Sales: this.generatePredictiveData[i].Sales,
                MarketingSpend: this.generatePredictiveData[i].MarketingSpend,
                NewCustomers: this.generatePredictiveData[i].NewCustomers,
                ReturningCustomers: this.generatePredictiveData[i].ReturningCustomers,
              };
              this.$refs.gridInstance.ej2Instances.addRecord(newRecord, rowIndex);
              rowIndex += 1;
            }
          }
        } catch (error) {
          console.error('Error in calculatePredictiveData:', error);
        }
      },
      generatePrompt(data) {
        return `Given the following data source bounded in the Grid table\n\n${data}.\n I want you to act as a Trend Analyzer for the given data. Observe the data and perform a trend analysis for the columns Sales and MarketingSpend. For each row, update the result in the 'TrendColumn' field with the trend analyzed as High or Low based on the analysis result. Example: MarketingSpend-High.  Note: Include only the first 2 highest values and the 2 lowest values.\n\nGenerate the output in JSON format only and do not include any additional information or contents in the response.`;
      },
      generatePredictivePrompt(data) {
        return `Given the following datasource are bounded in the Grid table\n\n${data}.\n I want you to Predict the future data by analyzing the historical report of the previous years. Predict the future sales for the next 6 months based on the given data. For Example: I have binded the Monthly reports for the past two years and first 6 months of this year by analyzing this historical data, i want you to predict my future monthly data for the upcoming 6 months for the year 2024. The generated data should be returned in the same format as i have binded in this prompt, do not add any additional content. \n\nGenerate an output in JSON format only and Should not include any additional information or contents in response`;
      },
    },
    provide: {
        grid: [Sort, Edit]
    }
  };
  </script>
  
  <style scoped>
  #get_trend_data {
      margin-left: 8px;
  }
  
  .low-values {
      background-color: #B8595A;
  }
  
  .e-grid .e-rowcell.low-values:not(.e-editedbatchcell):not(.e-updatedtd) {
      color: #FFFFFF;
  }
  
  .fluent-dark .low-values,
  .fluent2-dark .low-values,
  .tailwind-dark .low-values,
  .material-dark .low-values,
  .material3-dark .low-values,
  .fabric-dark .low-values,
  .bootstrap-dark .low-values,
  .bootstrap4-dark .low-values,
  .bootstrap5-dark .low-values,
  .highcontrast .low-values {
      background-color: #55241E;
  }
  
  
  .fluent-dark .e-grid .e-rowcell.low-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .fluent2-dark .e-grid .e-rowcell.low-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .tailwind-dark .e-grid .e-rowcell.low-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .material-dark .e-grid .e-rowcell.low-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .material3-dark .e-grid .e-rowcell.low-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .fabric-dark .e-grid .e-rowcell.low-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .bootstrap-dark .e-grid .e-rowcell.low-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .bootstrap4-dark .e-grid .e-rowcell.low-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .bootstrap5-dark .e-grid .e-rowcell.low-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .highcontrast .e-grid .e-rowcell.low-values:not(.e-editedbatchcell):not(.e-updatedtd) {
      color: #FF9CA0;
  }        
  
  .high-values {
      background-color: #AAF38C;
  }
  
  .fluent-dark .high-values,
  .fluent2-dark .high-values,
  .tailwind-dark .high-values,
  .material-dark .high-values,
  .material3-dark .high-values,
  .fabric-dark .high-values,
  .bootstrap-dark .high-values,
  .bootstrap4-dark .high-values,
  .bootstrap5-dark .high-values,
  .highcontrast .high-values {
      background-color: #315C35;
  }
  
  .fluent-dark .e-grid .e-rowcell.high-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .fluent2-dark .e-grid .e-rowcell.high-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .tailwind-dark .e-grid .e-rowcell.high-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .material-dark .e-grid .e-rowcell.high-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .material3-dark .e-grid .e-rowcell.high-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .fabric-dark .e-grid .e-rowcell.high-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .bootstrap-dark .e-grid .e-rowcell.high-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .bootstrap4-dark .e-grid .e-rowcell.high-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .bootstrap5-dark .e-grid .e-rowcell.high-values:not(.e-editedbatchcell):not(.e-updatedtd),
  .highcontrast .e-grid .e-rowcell.high-values:not(.e-editedbatchcell):not(.e-updatedtd) {
      color: #38FF9C;
  }
  
  .e-row.e-altrow {
      background-color: #FAFAFA;
  }
  
  .fluent-dark .e-row.e-altrow,
  .fluent2-dark .e-row.e-altrow,
  .tailwind-dark .e-row.e-altrow,
  .material-dark .e-row.e-altrow,
  .material3-dark .e-row.e-altrow,
  .fabric-dark .e-row.e-altrow,
  .bootstrap-dark .e-row.e-altrow,
  .bootstrap4-dark .e-row.e-altrow,
  .bootstrap5-dark .e-row.e-altrow,
  .highcontrast .e-row.e-altrow {
      background-color: #353839;
  }
  
  .predicted-rows {
      background-color: #ADD8E6;
  }
  
  .e-row.e-altrow .predicted-rows {
      background-color: #D3EBF5;
  }
  
  .fluent-dark .predicted-rows,
  .fluent2-dark .predicted-rows,
  .tailwind-dark .predicted-rows,
  .material-dark .predicted-rows,
  .material3-dark .predicted-rows,
  .fabric-dark .predicted-rows,
  .bootstrap-dark .predicted-rows,
  .bootstrap4-dark .predicted-rows,
  .bootstrap5-dark .predicted-rows,
  .highcontrast .predicted-rows {
      background-color: #003366;
  }
  
  .fluent-dark .e-row.e-altrow .predicted-rows,
  .fluent2-dark .e-row.e-altrow .predicted-rows,
  .tailwind-dark .e-row.e-altrow .predicted-rows,
  .material-dark .e-row.e-altrow .predicted-rows,
  .material3-dark .e-row.e-altrow .predicted-rows,
  .fabric-dark .e-row.e-altrow .predicted-rows,
  .bootstrap-dark .e-row.e-altrow .predicted-rows,
  .bootstrap4-dark .e-row.e-altrow .predicted-rows,
  .bootstrap5-dark .e-row.e-altrow .predicted-rows,
  .highcontrast .e-row.e-altrow .predicted-rows {
      background-color: #001F3F;
  }
  
  .dddata {
      padding-bottom: 10px;
  }
  </style>