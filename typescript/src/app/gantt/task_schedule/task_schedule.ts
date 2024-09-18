import { Gantt, Toolbar, Edit, Selection,CriticalPath } from '@syncfusion/ej2-gantt';
import { HistoricalTaskData,HistoricalDataCollection2021,HistoricalDataCollection2022,HistoricalDataCollection2023,HistoricalDataCollection2024,HistoricalDataCollection2025 } from './ganttdata';
import { getAzureChatAIRequest } from '../../ai-models';
import { Button } from '@syncfusion/ej2/buttons';
Gantt.Inject(Toolbar, Edit, Selection);


let gantt: Gantt = new Gantt({
    dataSource: HistoricalTaskData,
    renderBaseline: true,
    toolbar: [{template: '<button id="toolbarButton" class="e-primary">Predective scheduling</button>', text:'Predective scheduling' }],
    taskFields: {
        id: 'Id',
        name: 'Name',
        startDate: 'StartDate',
        duration: 'Duration',
        progress: 'Progress',
        endDate: 'EndDate',
        baselineEndDate: 'BaselineEndDate',
        baselineStartDate: 'BaselineStartDate',
        parentID: 'ParentId',
    },
    editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
    },
    columns: [
        { field: 'Id', headerText: 'Task ID', visible: false },
        { field: 'Name', headerText: 'Event Name',width:'250px' },
        { field: 'Duration', headerText: 'Duration' },
        { field: 'StartDate', headerText: 'Start Date' },
        { field: 'EndDate', headerText: 'End Date' }, 
    ],
    allowFiltering: true,
    gridLines: "Both",
    highlightWeekends: true,
    timelineSettings: {
        showTooltip: true,
        topTier: {
            unit: 'Week',
            format: 'dd/MM/yyyy'
        },
        bottomTier: {
            unit: 'Day',
            count: 1
        }
    },
    toolbarClick: toolbarClick,
    readOnly: false,
    taskbarHeight: 20,
    rowHeight: 40,
    height: '550px',
    allowUnscheduledTasks: true,
});
gantt.appendTo('#GanttContainer');
let button: Button = new Button();
button.appendTo('#toolbarButton');
function GetHistoricalCoolection() {
    let collection = "";
    collection = collection + JSON.stringify(HistoricalDataCollection2021) + JSON.stringify(HistoricalDataCollection2022) + JSON.stringify(HistoricalDataCollection2023) + JSON.stringify(HistoricalDataCollection2024) + JSON.stringify(HistoricalDataCollection2025);
    return collection;
}

function toolbarClick(args: any) {
    if (args.item.text === 'Predective scheduling') {
      gantt.showSpinner();

      let input = `Analyze the historical data collection for project management in a Gantt Chart system. Based on the provided historical data, update the project schedule values for the given TaskDataCollection for the year 2026. 

      The output should be a JSON object with a key named 'TaskCollection', which contains the updated list of tasks. The response should not include any JSON tags, additional explanations, or extra content.
      
      Here are the details:
      - HistoricalDataCollections: ${GetHistoricalCoolection()}
      - TaskDataCollection: ${JSON.stringify(HistoricalTaskData)}
      
      Return the updated TaskCollection in JSON format, with no additional text or explanations.`;
      let aioutput = getAzureChatAIRequest({ messages: [{ role: 'user', content: input }] });
      aioutput.then((result: any) => {
        let cleanedJsonData = result.replace(/^```json\n|```\n?$/g, '');
        let collection: any = JSON.parse(cleanedJsonData).TaskCollection;
        let currentData: any = gantt.currentViewData;
        for(let i = 0; i < collection.length; i++) {
            collection[i].BaselineStartDate =  new Date(currentData[i].StartDate);
            collection[i].BaselineEndDate =  new Date(currentData[i].EndDate);
        }
        gantt.dataSource = collection;
        gantt.hideSpinner();
      });
    }
  }