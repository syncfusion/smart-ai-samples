import { Gantt, Toolbar, Edit, Selection,CriticalPath } from '@syncfusion/ej2-gantt';
import { tasksCollection } from './ganttdata';
import { Button } from '@syncfusion/ej2-buttons';
import { getAzureTextAIRequest,getAzureChatAIRequest } from '../../ai-models';
Gantt.Inject(Toolbar, Edit, Selection,CriticalPath);

let summary: any = '';

(<{ getSummary?: Function }>window).getSummary = (value: any) => {
    
    if(summary !== '') {
        let isupdated = false;
        for(let i=0;i<summary.length;i++) {
            if(parseInt(summary[i]['TaskID']) === value.taskId) {
                isupdated = true;
                return summary[i]['Summary'];
            }
        }
        if(!isupdated) {
            return '';
        }
    }
    else {
        return '';
    }
};

let gantt: Gantt = new Gantt({
    dataSource: tasksCollection,
    allowSorting: true, 
    allowReordering: true,
    enableContextMenu: true,
    toolbar: [
     {template: '<button id="toolbarButton" class="e-primary">Analyze Risk</button>', text:'Analyze Risk' }
    ],
    taskFields: {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency:'Predecessor',
        baselineStartDate: "BaselineStartDate",
        baselineEndDate: "BaselineEndDate",
        child: 'subtasks',
        indicators: 'Indicators'
    },
    baselineColor: 'red',
    editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
    },
    columns: [
        { field: 'TaskID', headerText: 'Task ID', visible: false },
        { field: 'TaskName', headerText: 'Event Name', allowReordering: false, width:'250px'  },
        { field: 'Duration', headerText: 'Duration', allowEditing: false },
        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
        { field: 'EndDate', headerText: 'End Date', allowSorting: false },
    ],
    allowFiltering: true,
    gridLines: "Both",
    highlightWeekends: true,
    dataBound:function() {
        let button: Button = new Button();
        button.appendTo('#toolbarButton');
    },
    queryTaskbarInfo(args) {
        if(summary !== '') {
            for(let i=0;i<summary.length;i++) {
                if(parseInt(summary[i]['TaskID']) === args.data.ganttProperties.taskId && summary[i]['Priority'] === 'high') {
                    args.taskbarBgColor = 'rgb(255, 0, 0)';
                    args.progressBarBgColor = 'rgb(255, 0, 0)';
                }
            }
        }
    },
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
    labelSettings: {
        rightLabel: '#rightLabel',
        taskLabel: '${Progress}%'
    },
    toolbarClick: toolbarClick,
    readOnly: false,
    taskbarHeight: 20,
    rowHeight: 40,
    height: '550px',
    treeColumnIndex: 1,
    allowUnscheduledTasks: true,
    projectStartDate: new Date('03/25/2019'),
    projectEndDate: new Date('05/30/2019'),
});
gantt.appendTo('#GanttContainer');
function toolbarClick(args: any) {
    if (args.item.text === 'Analyze Risk') {
      gantt.showSpinner();

      let input = `1, You analyze the project complete collection in below 'TaskCollection' to identify potential risks and suggest mitigation strategies. 
2, The collection contains the predessor(Dependency) values with type of SS(start to start), SF(Start to finish), FS(finish to start), FF(finish to finish) and the default type is SS. Dependency values not necessory in each task. 
3, Analyze the complete project task collection duration and if any task get risk whole project and dependent task gets risk.
        Task Collection Data:` + JSON.stringify(tasksCollection) + `Ensure the output is in JSON object format name of 'TaskDetails' alone with + 'Priority' key-high or low risk and 'Summary' key-details of the risk and mitigation strategy and Summary details given format is (TaskID-summary details), don't give another values and avoid any unwanted content or unwanted JSON tags. No other explanation or content to be returned.

        Output format:
        "{
        "TaskDetails":[{
        "Priority":value,
        "TaskID": value,
        "Summary":value
        }]
        }"

        Don't give anyother format values.`;
      let aioutput = getAzureChatAIRequest({ messages: [{ role: 'user', content: input }] });
      aioutput.then((result: any) => {
        let cleanedJsonData = result.replace(/^```json\n|```\n?$/g, '');
        summary = JSON.parse(cleanedJsonData).TaskDetails;
        gantt.hideSpinner();
        gantt.refresh();
        // setTimeout(() => {
        //     button.refresh()
            
        // }, 500);
      });
    }
  }