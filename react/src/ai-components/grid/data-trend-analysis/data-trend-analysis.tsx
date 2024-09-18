import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Page, Edit, Sort, QueryCellInfoEventArgs } from '@syncfusion/ej2-react-grids';
import { OverallData, MonthlyData } from './datasource';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { SelectEventArgs, DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { getAzureChatAIRequest } from '../../../ai-models';
import './data-trend-analysis.css';

function DataTrendAnalysis() {
    let gridInstance!: GridComponent;
    let yearDdl!: DropDownListComponent;
    let GeneratedTrendData: MonthlyData[];
    let GeneratePredictiveData: MonthlyData[];
    let months2024: string[] = ['July 2024', 'August 2024', 'September 2024', 'October 2024', 'November 2024', 'December 2024'];
    let years: { Year: string; ID: string }[] = [
        { Year: '2022', ID: 'Year2022' },
        { Year: '2023', ID: 'Year2023' },
        { Year: '2024', ID: 'Year2024' },
    ];

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
            gridInstance.query = new Query().where('Month', 'contains', (args.itemData as { Year: string }).Year);
        }
    }

    function getTrendData() {
        gridInstance.showSpinner();
        if (yearDdl.text === '2024') {
            CalculatePredictiveData();
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
        const gridJsonData: string = JSON.stringify(new DataManager(gridInstance.dataSource as MonthlyData[]).executeLocal(query));
        const prompt: string = GeneratePrompt(gridJsonData);
        let aiOutput: any = getAzureChatAIRequest({ messages: [{ role: 'user', content: prompt }] });
        aiOutput.then((result: any) => {
            result = result.replace('```json', '').replace('```', '');
            GeneratedTrendData = JSON.parse(result);
            gridInstance.hideSpinner();
            if (GeneratedTrendData.length) {
                for (let i: number = 0; i < GeneratedTrendData.length; i++) {
                    const item = GeneratedTrendData[i];
                    gridInstance.setRowData(item.Month, item);
                }
            }
        });
    }

    async function CalculatePredictiveData() {
        if (GeneratePredictiveData != null && GeneratePredictiveData.length > 0) {
            return;
        }
        const gridReportJson: string = JSON.stringify(gridInstance.dataSource);
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
                    gridInstance.addRecord(newRecord, rowIndex);
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

    return (
        <div className='control-pane'>
            <div className='control-section'>
                <div className="description-container e-card">
                    <div className='e-card-header-title' style={{ fontWeight: 600 }}>AI Driven Data Trend Analysis in DataGrid</div>
                    <div className='e-card-content '>
                        <p>
                        In this sample demonstrates how the syncfusion React DataGrid, powered by AI, can perform trend analysis on its data.
                        </p>
                    </div>
                </div>
                <div id='container'>
                    <div className='dddata'>
                        <DropDownListComponent type="text"
                        ref={yearDropDown => yearDdl = yearDropDown as DropDownListComponent}
                            id='year_ddl'
                            dataSource={years}
                            value='Year2023'
                            fields={{ text: 'Year', value: 'ID' }}
                            select={ValueSelectHandler}
                            placeholder='Select a year'
                            width={150} />
                        <ButtonComponent id='get_trend_data' isPrimary={true} onClick={getTrendData}>Get Trend Data</ButtonComponent>
                    </div>
                    <GridComponent
                        id='Grid'
                        ref={grid => gridInstance = grid as GridComponent}
                        dataSource={OverallData}
                        editSettings={{ allowAdding: true, newRowPosition: 'Bottom' }}
                        queryCellInfo={CustomizeCell}
                        enableAltRow={true}
                        allowSorting={true}
                        enableHover={false}
                        allowSelection={false}
                        query={new Query().where('Month', 'contains', '2023')}
                    >
                        <ColumnsDirective>
                            <ColumnDirective field='Month' isPrimaryKey={true} headerText='Time Stamp' width={100} />
                            <ColumnDirective field='Sales' headerText='Sales' textAlign='Right' format='C2' width={80} />
                            <ColumnDirective field='MarketingSpend' headerText='Marketing Spend' textAlign='Right' format='C2' width={80} />
                            <ColumnDirective field='NewCustomers' headerText='New Customers' textAlign='Right' width={80} />
                            <ColumnDirective field='ReturningCustomers' headerText='Returning Customers' textAlign='Right' width={100} />
                        </ColumnsDirective>
                        <Inject services={[Page, Edit, Sort]} />
                    </GridComponent>
                </div>
            </div>
        </div>
    )
}

export default DataTrendAnalysis;