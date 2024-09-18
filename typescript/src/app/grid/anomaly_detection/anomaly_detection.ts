
import { Grid, Toolbar, Page, QueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { Button } from '@syncfusion/ej2/buttons';
import { isNullOrUndefined } from '@syncfusion/ej2/base';
import { machineDataList, MachineData } from './gridData';
import { getAzureChatAIRequest } from '../../ai-models';

/**
 * Anomaly Detection
 */

Grid.Inject(Page, Toolbar);

let AIgeneratedData: MachineData[] = [];
let grid: Grid = new Grid({
    dataSource: machineDataList,
    toolbar: [{ template: `<button id='anomaly'>Detect Anomaly Data</button>` }],
    queryCellInfo: CustomizeCell,
    columns: [
        { field: 'MachineID', isPrimaryKey: true, headerText: 'Machine ID', textAlign: 'Right', width: 85 },
        { field: 'Temperature', headerText: 'Temperature (C)', textAlign: 'Right', width: 120 },
        { field: 'Pressure', headerText: 'Pressure (psi)', textAlign: 'Right', width: 100 },
        { field: 'Voltage', headerText: 'Voltage (V)', textAlign: 'Right', width: 100 },
        { field: 'MotorSpeed', headerText: 'Motor Speed (rpm)', textAlign: 'Right', width: 140 },
        { field: 'ProductionRate', headerText: 'Production Rate (units/hr)', textAlign: 'Right', width: 140 },
        { field: 'AnomalyDescription', visible: false, headerText: 'Anomaly Description', width: 290 },
    ],
    enableHover: false,
    enableStickyHeader: true,
    allowTextWrap: true,
    allowSelection: false,
    created: created,
    rowHeight: 75,
    height: 450,
});
grid.appendTo('#Grid');

function created() {
    let button = document.getElementById('anomaly') as HTMLButtonElement;
    button.onclick = DetectAnomalyData;
    new Button({ isPrimary: true }, '#anomaly');
}

function DetectAnomalyData() {
    grid.showSpinner();
    DetectAnamolyData();
}

function DetectAnamolyData() {
    const gridReportJson: string = JSON.stringify(grid.dataSource);
    const userInput: string = generatePrompt(gridReportJson);
    let aiOutput: any = getAzureChatAIRequest({ messages: [{ role: 'user', content: userInput }] });
    aiOutput.then((result: any) => {
        result = result.replace('```json', '').replace('```', '');
        AIgeneratedData = JSON.parse(result);
        grid.hideSpinner();
        if (AIgeneratedData.length) {
            grid.showColumns(['Anomaly Description']);
            for (let i: number = 0; i < AIgeneratedData.length; i++) {
                const item = AIgeneratedData[i];
                grid.setRowData(item.MachineID, item);
            }
        }
    });
}

function generatePrompt(data: string): string {
    return `Given the following datasource are bounded in the Grid table\n\n${data}.\n Return the anomaly data rows (ie. pick the ir-relevant datas mentioned in the corresponding table) present in the table mentioned above as like in the same format provided do not change the format. Example: Watch out the production rate count and the factors that is used to acheive the mentioned production rate(Temprature, Pressure, Motor Speed) If the production rate is not relevant to the concern factors mark it as anomaly Data. If it is anomaly data then due to which column data it is marked as anomaly that particular column name should be updated in the AnomalyFieldName. Also Update the AnomalyDescription stating that due to which reason it is marked as anomaly a short description. Example if the data is marked as anomaly due to the Temperature column, Since the mentioned temperature is too high than expected, it is marked as anomaly data.\n\nGenerate an output in JSON format only and Should not include any additional information or contents in response`;
}

function CustomizeCell(args: QueryCellInfoEventArgs) {
    if (AIgeneratedData != null && AIgeneratedData.length > 0) {
        let isAnamolyData: boolean = false;
        AIgeneratedData.map((e: any) => {
            if (!isNullOrUndefined(e.AnomalyFieldName) && e.MachineID === (args.data as MachineData).MachineID &&
                (e.AnomalyFieldName === args.column?.field || args.column?.field === 'AnomalyDescription')) {
                isAnamolyData = true;
            }
        });
        if (isAnamolyData) {
            args.cell?.classList.add('anomaly-cell');
            args.cell?.classList.remove('normal-cell');
        }
    }
    else if (args.column?.field === 'AnomalyDescription') {
        args.cell?.classList.add('normal-cell');
    }
}
