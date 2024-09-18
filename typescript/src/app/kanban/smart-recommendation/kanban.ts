import { Kanban } from '@syncfusion/ej2-kanban';
import { Button } from '@syncfusion/ej2-buttons';
import { Grid, Page, Selection, DialogEditEventArgs, Edit, Toolbar, IDialogUI } from '@syncfusion/ej2-grids';
import {  OpenAiModel } from '../custom-model';
import { getAzureChatAIRequest } from '../../ai-models'; 
import { Dialog } from '@syncfusion/ej2-popups';
import { NumericTextBox, TextBox } from '@syncfusion/ej2-inputs';
import { Toast } from '@syncfusion/ej2/notifications';
import { ProgressButton } from '@syncfusion/ej2/splitbuttons';
import { MultiSelect, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
Grid.Inject(Page, Selection, Edit, Toolbar);
MultiSelect.Inject(CheckBoxSelection);

let smartSuggestion: object[] = [];
let projectDetailsDialog: Dialog;
let projectDetailsDialogCreated: boolean = false;
let isGeneratedProjectTasks: boolean = false;
let taskCount: NumericTextBox;
let generateTasks: ProgressButton;
let projectDetails: TextBox;

let toast = new Toast({
    position: { X: 'Right', Y: 'Top' },
    showCloseButton: true,
    target: '#toast-kanban-observable'
});
toast.appendTo('#toast');

let taskCountHome = new NumericTextBox({
    min: 1,
    step: 1,
    width: '100%',
    floatLabelType: 'Always',
    value: 0
});
taskCountHome.appendTo('#tasks-value-home');
let projectDetailsHome = new TextBox({
    width: '100%',
    floatLabelType: 'Always',
    value: '',
    multiline: true
});
projectDetailsHome.appendTo('#project-details-home');
let generateTasksHome = new ProgressButton({
    content: 'Generate Tasks',
    enableProgress: false,
    begin: () => {
        generateButtonBegin();
    }
});
generateTasksHome.appendTo('#generate-tasks');
generateTasksHome.appendTo('#generate-tasks-home');
generateTasksHome.element.onclick = (): void => {
    generateTasksClick(taskCountHome.value, projectDetailsHome.value);
};

let openProjectDetailsDialog: Button = new Button({
    content: 'Add New Projects'
});
openProjectDetailsDialog.appendTo('#openProjectDetailsDialog');
openProjectDetailsDialog.element.onclick = (): void => {
    isGeneratedProjectTasks = false;
    projectDetailsDialog.show();
};

let goToBacklogBoardView: Button = new Button({
    content: 'View as Board'
});
goToBacklogBoardView.appendTo('#goToBacklogBoardView');
goToBacklogBoardView.element.onclick = (): void => {
    if (goToBacklogBoardView.content == "View as Board") {
        goToBacklogBoardView.content = "View as Backlog";
        backlogKanbanObj.dataSource = smartSuggestion;
        backlogKanbanObj.dataBind();
        backlogKanbanObj.refresh();
        (document.getElementById('grid-container') as HTMLElement).style.display = 'none';
        (document.getElementById('backlogsBoard') as HTMLElement).style.display = '';
    } else {
        goToBacklogBoardView.content = "View as Board";
        grid.dataSource = smartSuggestion;
        grid.dataBind();
        grid.refresh();
        (document.getElementById('grid-container') as HTMLElement).style.display = '';
        (document.getElementById('backlogsBoard') as HTMLElement).style.display = 'none';
    }
};

let grid: Grid = new Grid(
    {
        dataSource: smartSuggestion,
        allowPaging: true,
        toolbar: ['Add'],
        editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog', template: '#dialogtemplate' },
        columns: [
            { field: "Id", headerText: 'Task ID', defaultValue: '', isPrimaryKey: true, validationRules: { required: true } },
            { field: "Title", headerText: 'Title', defaultValue: '', validationRules: { required: true } },
            { field: "Description", headerText: 'Description', defaultValue: '', editType: 'defaultEdit' },
            { field: "StoryPoints", headerText: 'StoryPoints', defaultValue: 0, editType: 'defaultEdit', validationRules: { required: true, min: 0 } },
            { field: "Status", headerText: 'Status', defaultValue: '', isPrimaryKey: true, validationRules: { required: true } },
        ],
        actionComplete: actionComplete
    });
grid.appendTo('#grid-container');

function actionComplete(args: DialogEditEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
        let data: any = args.rowData;
        new NumericTextBox({
            min: 1,
            step: 1,
            placeholder: "StoryPoints",
            width: '100%',
            floatLabelType: 'Always',
            value: data.StoryPoints ? data.StoryPoints : 1
        }, args.form?.elements.namedItem('StoryPoints') as HTMLInputElement);
        new TextBox({
            placeholder: 'Task ID',
            width: '100%',
            floatLabelType: 'Always',
            value: data.Id ? data.Id : ''
        }, args.form?.elements.namedItem('Id') as HTMLInputElement);
        new TextBox({
            placeholder: 'Title',
            width: '100%',
            floatLabelType: 'Always',
            value: data.Title ? data.Title : ''
        }, args.form?.elements.namedItem('Title') as HTMLInputElement);

        new TextBox({
            placeholder: 'Description',
            width: '100%',
            floatLabelType: 'Always',
            multiline: true,
            value: data.Description ? data.Description : ''
        }, args.form?.elements.namedItem('Description') as HTMLInputElement);

        new TextBox({
            placeholder: 'Status',
            width: '100%',
            floatLabelType: 'Always',
            value: data.Status ? data.Status : 'Open'
        }, args.form?.elements.namedItem('Status') as HTMLInputElement);
    }
}

let backlogKanbanObj: Kanban = new Kanban({
    keyField: 'Status',
    dataSource: smartSuggestion,
    columns: [
        { headerText: 'To Do', keyField: 'Open' },
        { headerText: 'In Progress', keyField: 'InProgress' },
        { headerText: 'Review', keyField: 'Review' },
        { headerText: 'Done', keyField: 'Close' }
    ],
    cardSettings: {
        headerField: 'Title',
        contentField: 'Description',
        grabberField: 'Color',
        template: '#cardTemplate-backlog-board'
    }
});
backlogKanbanObj.appendTo('#backlogsBoard');

let dialogCtn: HTMLElement = document.getElementById('projectDetails') as HTMLElement;
let dialogFooter: HTMLElement = document.getElementById('projectdialogFooter') as HTMLElement;
projectDetailsDialog = new Dialog({
    header: 'AI Smart Task Suggestion',
    content: dialogCtn,
    showCloseIcon: true,
    
    width: '30%',
    minHeight: '60%',
    zIndex: 1000,
    isModal: true,
    cssClass: 'custom-dialog',
    footerTemplate: dialogFooter,
    target: document.getElementById('container') as HTMLElement,
    close: (): void => {
        closeprojectDetailsDialog();
    }
});
projectDetailsDialog.appendTo('#projectDetailsDialog');
projectDetailsDialog.hide();
projectDetailsDialog.open = (): void => {
    if (!projectDetailsDialogCreated) {
        projectDetailsDialogCreated = true;
        taskCount = new NumericTextBox({
            min: 1,
            step: 1,
            width: '100%',
            floatLabelType: 'Always',
            value: 0
        });
        taskCount.appendTo('#tasks-value');
        projectDetails = new TextBox({
            width: '100%',
            floatLabelType: 'Always',
            value: '',
            multiline: true
        });
        projectDetails.appendTo('#project-details');
        generateTasks = new ProgressButton({
            content: 'Generate Tasks',
            enableProgress: false,
            begin: () => {
                generateButtonBegin();
            }
        });
        generateTasks.appendTo('#generate-tasks');
        generateTasks.element.onclick = (): void => {
            generateTasksClick(taskCount.value, projectDetails.value);
        };
    }
};

function generateTasksClick(taskCount: number, projectDetails: string): void {
    isGeneratedProjectTasks = false;
    GenerateProjectTasks(taskCount, projectDetails);
}

function generateButtonBegin(): void {
    generateTasks.content = "Progressing...";
    generateTasks.dataBind();
    const checkTasksGenerated = () => {
        if (isGeneratedProjectTasks) {
            (document.getElementById('homecontainer') as HTMLElement).style.display = 'none';
            (document.getElementById('toast-kanban-observable') as HTMLElement).style.display = '';
            goToBacklogBoardView.content = "View as Backlog";
            backlogKanbanObj.dataSource = smartSuggestion;
            backlogKanbanObj.dataBind();
            backlogKanbanObj.refresh();
            (document.getElementById('grid-container') as HTMLElement).style.display = 'none';
            (document.getElementById('backlogsBoard') as HTMLElement).style.display = '';
            generateTasks.content = "Generate Tasks";
            generateTasks.dataBind();
            closeprojectDetailsDialog();
        } else {
            setTimeout(checkTasksGenerated, 100);
        }
    };
    checkTasksGenerated();
}

function closeprojectDetailsDialog(): void {
    projectDetailsDialog.hide();
    taskCount.value = 0;
    projectDetails.value = '';
}

function GenerateProjectTasks(taskCount: number, projectDetails: string): void {
    try {
        if (taskCount && projectDetails) {
            var description = `Generate ${taskCount} task recommendations for ${projectDetails}. Each task should include the following fields: Id (like example: ID should be in project name simple 4char word - 1), Title, Status, Description, Assignee, StoryPoints, Color and Due Date, formatted according to the dataset. Assign each task to the Assignee: empty string, set the Status to 'Open', and use black for the Color. Use the dataset provided below to create your recommendations. IMPORTANT: Return the data strictly in JSON format with all the required fields. Only the JSON data is needed, no additional text.Return only the JSON array format without any explanations.`;
            let result: any = getAzureChatAIRequest({messages:
                [
                    { role: "system", content: "You are a helpful assistant." },
                    { 
                        role: "user", 
                        content: `${description}`
                    }
                ]});
            result.then((result: any) => {
                try {
                    const jsonArrayPattern = /\[.*?\]/s;
                    result = result.match(jsonArrayPattern);
                    if (result && result[0]) {
                        let data = result[0].replace("```json", "").replace("```", "").replace("\r", "").replace("\n", "").replace("\t", "").trim();
                        let modifiedData = JSON.parse(data);
                        smartSuggestion = modifiedData !== null ? smartSuggestion.concat(modifiedData) : smartSuggestion;
                        backlogKanbanObj.dataSource = smartSuggestion;
                        backlogKanbanObj.dataBind();
                        backlogKanbanObj.refresh();
                        isGeneratedProjectTasks = true;
                    } else {
                        toast.content = "An error occurred during the AI process, Please try again."
                        toast.show();
                    }

                } catch {
                    toast.content = "An error occurred during the AI process, Please try again."
                    toast.show();
                }

            });
        }
    } catch {
        toast.content = "An error occurred during the AI process, Please try again."
        toast.show();
    }
}

async function getResponseFromOpenAI(promptQuery: string): Promise<string> {
    const content = await OpenAiModel(promptQuery);
    return content ? content as string : '';
}