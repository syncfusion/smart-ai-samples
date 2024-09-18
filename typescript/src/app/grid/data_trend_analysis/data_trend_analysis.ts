
import { Grid, Edit, Page, Sort, QueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { OverallData, MonthlyData } from './gridData';
import { getAzureChatAIRequest } from '../../ai-models';
import { isNullOrUndefined } from '@syncfusion/ej2/base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { SelectEventArgs } from '@syncfusion/ej2/dropdowns';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Button } from '@syncfusion/ej2/buttons';

/**
 * Data Trend Analysis
 */

Grid.Inject(Page, Edit, Sort);

let GeneratedTrendData: MonthlyData[];
let GeneratePredictiveData: MonthlyData[];
let months2024: string[] = ['July 2024', 'August 2024', 'September 2024', 'October 2024', 'November 2024', 'December 2024'];
let years: { Year: string; ID: string }[] = [
    { Year: '2022', ID: 'Year2022' },
    { Year: '2023', ID: 'Year2023' },
    { Year: '2024', ID: 'Year2024' },
];

let yearDdl: DropDownList = new DropDownList({
    dataSource: years,
    value: 'Year2023',
    fields: { text: 'Year', value: 'ID' },
    select: ValueSelectHandler,
    placeholder: 'Select a year',
    width: 150,
});
yearDdl.appendTo('#year_ddl');

let button = document.getElementById('get_trend_data') as HTMLButtonElement;
button.onclick = getTrendData;
new Button({ isPrimary: true }, '#get_trend_data');

let grid: Grid = new Grid({
    dataSource: OverallData,
    editSettings: { allowAdding: true, newRowPosition: 'Bottom' },
    queryCellInfo: CustomizeCell,
    columns: [
        { field: 'Month', isPrimaryKey: true, headerText: 'Time Stamp', width: 100 },
        { field: 'Sales', headerText: 'Sales', textAlign: 'Right', format: 'C2', width: 80 },
        { field: 'MarketingSpend', headerText: 'Marketing Spend', textAlign: 'Right', format: 'C2', width: 80 },
        { field: 'NewCustomers', headerText: 'New Customers', textAlign: 'Right', width: 80 },
        { field: 'ReturningCustomers', headerText: 'Returning Customers', textAlign: 'Right', width: 100 },
    ],
    enableAltRow: true,
    allowSorting: true,
    enableHover: false,
    allowSelection: false,
    query: new Query().where('Month', 'contains', '2023'),
});

grid.appendTo('#Grid');

function CustomizeCell(args: QueryCellInfoEventArgs) {
    if (GeneratedTrendData != null && GeneratedTrendData.length > 0 && (args.data as MonthlyData).TrendColumn != null && (args.data as MonthlyData).TrendColumn?.indexOf(args.column?.field!)! > -1) {
        if ((args.data as MonthlyData).TrendColumn?.indexOf(args.column?.field! + '-Low')! > -1) {
            args.cell!.classList.add('low-values');
        }
        else {
            args.cell!.classList.add('high-values');
        }
    }
    let predictedRows: boolean = false;
    months2024.map((e: any) => {
        if (e.indexOf((args.data as MonthlyData).Month) > -1) {
            predictedRows = true;
        }
    })
    if (predictedRows) args.cell!.classList.add('predicted-rows');
}

function ValueSelectHandler(args: SelectEventArgs) {
    if (args.itemData != null) {
        grid.query = new Query().where('Month', 'contains', (args.itemData as { Year: string }).Year);
    }
}

function getTrendData() {
    grid.showSpinner();
    if (yearDdl.text === '2024') {
        CalculatePredictiveData(yearDdl.text as string);
    }
    CalculateTrendAnalysis(yearDdl.text as string);
}

async function CalculateTrendAnalysis(year: string) {
    let query: Query;
    if (!isNullOrUndefined(year)) {
        query = new Query().where('Month', 'contains', year);
    } else {
        query = new Query();
    }
    const gridJsonData: string = JSON.stringify(new DataManager(grid.dataSource as MonthlyData[]).executeLocal(query));
    const prompt: string = GeneratePrompt(gridJsonData);
    let aiOutput: any = getAzureChatAIRequest({ messages: [{ role: 'user', content: prompt }] });
    aiOutput.then((result: any) => {
        result = result.replace('```json', '').replace('```', '');
        GeneratedTrendData = JSON.parse(result);
        grid.hideSpinner();
        if (GeneratedTrendData.length) {
            for (let i: number = 0; i < GeneratedTrendData.length; i++) {
                const item = GeneratedTrendData[i];
                grid.setRowData(item.Month, item);
            }
        }
    });
}

async function CalculatePredictiveData(year: string) {
    if (GeneratePredictiveData != null && GeneratePredictiveData.length > 0) {
        return;
    }
    const gridReportJson: string = JSON.stringify(grid.dataSource);
    const prompt: string = GeneratePredictivePrompt(gridReportJson);
    let aiOutput: any = getAzureChatAIRequest({ messages: [{ role: 'user', content: prompt }] });
    aiOutput.then((result: any) => {
        result = result.replace('```json', '').replace('```', '');
        GeneratePredictiveData = JSON.parse(result);
        if (GeneratePredictiveData.length > 0) {
            let rowIndex: number = 30;
            for (let i: number = 0; i < GeneratePredictiveData.length; i++) {
                let newRecord: MonthlyData = {
                    Month: GeneratePredictiveData[i].Month,
                    Sales: GeneratePredictiveData[i].Sales,
                    MarketingSpend: GeneratePredictiveData[i].MarketingSpend,
                    NewCustomers: GeneratePredictiveData[i].NewCustomers,
                    ReturningCustomers: GeneratePredictiveData[i].ReturningCustomers,
                };
                grid.addRecord(newRecord, rowIndex);
                rowIndex += 1;
            }
        }
    });
}

function GeneratePrompt(data: string): string {
    return `Given the following data source bounded in the Grid table\n\n${data}.\n I want you to act as a Trend Analyzer for the given data. Observe the data and perform a trend analysis for the columns Sales and MarketingSpend. For each row, update the result in the 'TrendColumn' field with the trend analyzed as High or Low based on the analysis result. Example: MarketingSpend-High.  Note: Include only the first 2 highest values and the 2 lowest values.\n\nGenerate the output in JSON format only and do not include any additional information or contents in the response.`;
}
function GeneratePredictivePrompt(data: string): string {
    return `Given the following datasource are bounded in the Grid table\n\n${data}.\n I want you to Predict the future data by analyzing the historical report of the previous years. Predict the future sales for the next 6 months based on the given data. For Example: I have binded the Monthly reports for the past two years and first 6 months of this year by analyzing this historical data, i want you to predict my future monthly data for the upcoming 6 months for the year 2024. The generated data should be returned in the same format as i have binded in this prompt, do not add any additional content. \n\nGenerate an output in JSON format only and Should not include any additional information or contents in response`;
}
