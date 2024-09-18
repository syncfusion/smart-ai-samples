import { Gantt, Toolbar, Edit, Selection, DayMarkers } from '@syncfusion/ej2-gantt';
import { TaskDataCollection } from './ganttdata';
import { getAzureTextAIRequest,getAzureChatAIRequest } from '../../ai-models'; 
import * as data from './progress.json';
import { Button } from '@syncfusion/ej2/buttons';
Gantt.Inject(Toolbar, Edit, Selection, DayMarkers);

let gantt: Gantt = new Gantt({
    dataSource: TaskDataCollection,
    enableContextMenu: true,
    allowSorting: true,
    allowReordering: true,
    taskFields: {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        parentID: "ParentTaskID"
    },
    editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
    },
    columns: [
        { field: 'TaskID', visible: false },
        { field: 'TaskName', headerText: 'Event Name', width: 250 },
        { field: 'Duration' },
        { field: 'StartDate', headerText: 'Start Date' },
        { field: 'EndDate', headerText: 'End Date' },
    ],
    toolbar: [{template: '<button id="toolbarButton" class="e-primary">Predict milestone</button>', text:'Predict milestone' }],
    toolbarClick: toolbarClick,
    splitterSettings: {
        position: "28%"
    },
    allowSelection: true,
    treeColumnIndex: 1,
    height: '550px',
    projectStartDate: new Date('4/1/2026'),
    projectEndDate: new Date('6/2/2026')
});

gantt.appendTo('#Gantt');
let button: Button = new Button();
button.appendTo('#toolbarButton');
function toolbarClick(args: any) {
    if (args.item.text === 'Predict milestone') {
        gantt.showSpinner();
        let input =
            "You analyze the multiple year HistoricalTaskDataCollections and current TaskDataCollection to predict project completion dates and milestones based on current progress and historical trends. Ignore the null or empty values, and collection values based parent child mapping. Avoid json tags with your response. No other explanation or content to be returned." +
            " HistoricalTaskDataCollections :" + getHistoricalCollection() +
            " TaskDataCollection: " + JSON.stringify(TaskDataCollection) +
            " Generate a JSON object named 'TaskDetails' containing:" +
            "- Key 'MilestoneTaskDate' with a list of milestone dates 'MilestoneDate' with 'TaskName' - task name. A milestone date is defined as the end date of tasks with a duration of 0 and only give current based milestone." +
            "- Key 'ProjectCompletionDate' indicating the latest end date among all tasks." +
            "- Key 'Summary' providing a summary of the project completion date and milestones.Ensure milestones are defined correctly based on tasks with a duration of 0, and the project completion date reflects the latest end date of all tasks "
        let aioutput = getAzureChatAIRequest({ messages: [{ role: 'user', content: input }] });
        aioutput.then((result: any) => {
            let cleanedJsonData = result.replace(/^```json\n|```\n?$/g, '');
            let dataset = JSON.parse(cleanedJsonData);
            let details = dataset.TaskDetails || dataset;
            const eventMarkers = details.MilestoneTaskDate
                .map((milestone: any) => ({
                    day: new Date(milestone["MilestoneDate"]),
                    label: milestone["TaskName"]
                }));
            let projectDetailes = {
                day: new Date(details.ProjectCompletionDate),
                label: "Project completion date"
            };
            eventMarkers.push(projectDetailes);
            console.log(eventMarkers);
            gantt.eventMarkers = eventMarkers;

            gantt.hideSpinner();
        });
    }
    function getHistoricalCollection(): string {
        let historicalDataCollection: string = '';
        const word = (<any>data);
        for (let year = 2021; year < 2026; year++) {
            historicalDataCollection += "HistoricalTaskDataCollection" + year + ":" + JSON.stringify(word["TaskDataCollection" + year]);
        }

        return historicalDataCollection;
    }
}