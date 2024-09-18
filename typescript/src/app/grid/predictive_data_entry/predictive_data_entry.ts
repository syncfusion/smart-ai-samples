
import { Grid, Toolbar, Page, QueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { Button } from '@syncfusion/ej2/buttons';
import { predictiveData, predictive } from './gridData';
import { getAzureChatAIRequest } from '../../ai-models';


/**
 * Predictive Data Entry
 */

Grid.Inject(Page, Toolbar);

let grid: Grid = new Grid({
    dataSource: predictiveData,
    toolbar: [{ template: `<button id='calculate_Grade'>Calculate Grade</button>` }],
    queryCellInfo: CustomizeCell,
    allowSelection: false,
    columns: [
        { field: 'StudentID', isPrimaryKey: true, headerText: 'Student ID', textAlign: 'Right', width: 100 },
        { field: 'StudentName', headerText: 'Student Name', width: 100 },
        { field: 'FirstYearGPA', textAlign: 'Center', headerText: 'First Year GPA', width: 100 },
        { field: 'SecondYearGPA', headerText: 'Second Year GPA', headerTextAlign: 'Center', textAlign: 'Center', width: 100 },
        { field: 'ThirdYearGPA', headerText: 'Third Year GPA', headerTextAlign: 'Center', textAlign: 'Center', width: 100 },
        { field: 'FinalYearGPA', headerText: 'Final Year GPA', visible: false, headerTextAlign: 'Center', textAlign: 'Center', width: 100 },
        { field: 'TotalGPA', headerText: 'Total GPA', visible: false, headerTextAlign: 'Center', textAlign: 'Center', width: 100 },
        { field: 'TotalGrade', headerText: 'Total Grade', visible: false, headerTextAlign: 'Center', textAlign: 'Center', width: 100 },
    ],
    enableHover: false,
    created: created
});
grid.appendTo('#Grid');

function created() {
    let button = document.getElementById('calculate_Grade') as HTMLButtonElement;
    button.onclick = CalculateGrade;
    new Button({ isPrimary: true }, '#calculate_Grade');
}

function CalculateGrade() {
    grid.showSpinner();
    ExecutePrompt();
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function ExecutePrompt() {
    const prompt: string = 'Final year GPA column should updated based on GPA of FirstYearGPA, SecondYearGPA and ThirdYearGPA columns. Total GPA should update based on average of all years GPA. Total Grade update based on total GPA. Updated the grade based on following details, 0 - 2.5 = F, 2.6 - 2.9 = C, 3.0 - 3.4 = B, 3.5 - 3.9 = B+, 4.0 - 4.4 = A, 4.5 - 5 = A+. average value decimal should not exceed 1 digit.';
    const gridReportJson: string = JSON.stringify(grid.dataSource);
    const userInput: string = generatePrompt(gridReportJson, prompt);
    let aiOutput: any = getAzureChatAIRequest({ messages: [{ role: 'user', content: userInput }] });
    aiOutput.then((result: any) => {
        result = result.replace('```json', '').replace('```', '');
        const generatedData: predictive[] = JSON.parse(result);
        grid.hideSpinner();
        if (generatedData.length) {
            grid.showColumns(['Final Year GPA', 'Total GPA', 'Total Grade']);
            updateRows(generatedData);
        }
    });
}

async function updateRows(generatedData: predictive[]) {
    await delay(300);
    for (let i: number = 0; i < generatedData.length; i++) {
        const item = generatedData[i];
        grid.setRowData(item.StudentID, item);
        await delay(300);
    }
}

function CustomizeCell(args: QueryCellInfoEventArgs) {
    if (args.column!.field === 'FinalYearGPA' || args.column!.field === 'TotalGPA') {
        if ((args.data as predictive).FinalYearGPA! > 0) {
            args.cell!.classList.add('e-PredictiveColumn');
        }
        else if ((args.data as predictive).TotalGPA! > 0) {
            args.cell!.classList.add('e-PredictiveColumn');
        }
    }
    if (args.column!.field === 'TotalGrade') {
        if ((args.data as predictive).TotalGPA! <= 2.5) {
            args.cell!.classList.add('e-inactivecolor');
        }
        else if ((args.data as predictive).TotalGPA! >= 4.5) {
            args.cell!.classList.add('e-activecolor');
        }
        else if ((args.data as predictive).TotalGPA! > 0) {
            args.cell!.classList.add('e-averageColumn');
        }
    }
}

function generatePrompt(data: string, userInput: string): string {
    return `Given the following datasource are bounded in the Grid table\n\n${data}.\n Return the newly prepared datasource based on following user query:  ${userInput}\n\nGenerate an output in JSON format only and Should not include any additional information or contents in response`;
}
