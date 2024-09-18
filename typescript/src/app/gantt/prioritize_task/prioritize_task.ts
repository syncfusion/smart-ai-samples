import { Gantt, Toolbar, Edit, Selection } from '@syncfusion/ej2-gantt';
import { tasksCollection, resourceCollection } from './ganttdata';
import {getAzureChatAIRequest } from '../../ai-models';
import { Button } from '@syncfusion/ej2/buttons';
import { Toast } from '@syncfusion/ej2/notifications';
Gantt.Inject(Toolbar, Edit, Selection);
let gantt: Gantt = new Gantt({
    dataSource: tasksCollection,
    resources: resourceCollection,
    taskFields: {
        id: 'Id',
        name: 'Name',
        startDate: 'StartDate',
        endDate: 'EndDate',
        progress: 'Progress',
        parentID: 'ParentId',
        resourceInfo: 'resourceInfo',
        baselineStartDate: "BaselineStartDate",
        baselineEndDate: "BaselineEndDate",
    },
    resourceFields: {
        id: 'Id',
        name: 'Name',
        unit: 'MaxUnit',
    },
    editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
    },
    rowDataBound: (args) => {
        if (args.data.taskData.isCritical) {
            args.row.style.backgroundColor = '#ffecd4';
        }
    },
    queryTaskbarInfo: (args) => {
        if (args.data.taskData.isCritical) {
            args.taskbarElement.parentElement.parentElement.style.backgroundColor = '#ffecd4';
        }
    },
    columns: [
        { field: 'Id', headerText: "Task Id" , visible:false},
        { field: 'Name', headerText: 'Task Name', width: 250, clipMode: 'EllipsisWithTooltip' },
        { field: 'resourceInfo', headerText: 'Resources' },
        { field: 'StartDate', headerText: 'Start Date' },
        { field: 'EndDate', headerText: 'End Date' },
    ],
    toolbar: [{template: '<button id="toolbarButton" class="e-primary">Assign prioritize tasks</button>', text:'Assign prioritize tasks' }],
    toolbarClick: toolbarClick,
    labelSettings: {
        rightLabel: 'resourceInfo'
    },
    splitterSettings: {
        position: "23%"
    },
    readOnly: false,
    allowSelection: true,
    highlightWeekends: true,
    treeColumnIndex: 1,
    taskbarHeight: 20,
    rowHeight: 40,
    height: '550px',
});

gantt.appendTo('#Gantt');
let button: Button = new Button();
button.appendTo('#toolbarButton');
let toast: Toast = new Toast({
    title: 'Critical task containing',
    content: ``,
    position: { X: 'Right', Y: 'Top' },
    cssClass: 'e-toast-success',
});

toast.appendTo('#ToastElement');
function toolbarClick(args: any) {
    if (args.item.text === 'Assign prioritize tasks') {
      gantt.showSpinner();
        let input = `
      Analyze the following TaskCollection to identify critical tasks. 
      A task is considered critical if its EndDate is greater than its BaselineEndDate, comparing only the dates (not the time). 
      Both EndDate and BaselineEndDate must not be null.
      Here is the 'TaskCollection': ${JSON.stringify(tasksCollection)};
      For each task, add an additional property called isCritical. Set this property to true if the task is critical based on the criteria provided, otherwise set it to false. 
      Ensure that:
      1. Only the date part (not time) of EndDate and BaselineEndDate is compared.
      2. Tasks with both EndDate and BaselineEndDate being not null and where EndDate is greater than BaselineEndDate are marked as critical.
      Return the entire modified TaskCollection in JSON format. Ensure all tasks are included with their updated isCritical property. Do not include any other text or additional information.`
      let prompt = input;
      let aioutput = getAzureChatAIRequest({ messages: [{ role: 'user', content: prompt }] });
      aioutput.then((result: any) => {
        let cleanedJsonData = result.replace(/^```json\n|```\n?$/g, '');
        cleanedJsonData = cleanedJsonData.replace(/\n}\n/g, '');
        let criticalTask = JSON.parse(cleanedJsonData);
        let input1 = `Analyze the following JSON data:

        - 'TaskCollection': ${JSON.stringify(tasksCollection)}
        - 'ResourceCollection': ${JSON.stringify(resourceCollection)}
        - 'CriticalCollection': ${JSON.stringify(cleanedJsonData)}
        
        Perform the following steps:
        1. For each task in 'CriticalCollection' where 'isCritical' is 'true':
           - Identify unassigned resources by comparing 'ResourceCollection' with the 'resourceInfo' property in 'TaskCollection'.
           - Add each unassigned resource to the 'resourceInfo' property of the corresponding critical task without removing any existing resources.
           - Ensure that each critical task receives a unique unassigned resource, if available.
        
        Return the modified 'CriticalCollection' with the additional resources assigned.
        
        Additionally, create a new property called 'AddedResourceIds' that contains the IDs of tasks in 'CriticalCollection' where 'isCritical' is 'true' and additional resources were added.
        
        Provide the result in JSON format, including:
        - The modified 'CriticalCollection'.
        - The 'AddedResourceIds' property with the IDs of tasks where additional resources were added.
        
        Do not include any additional text or information.Also strictly return the JSON data in the format mentioned above.`
          let aioutput1 = getAzureChatAIRequest({ messages: [{ role: 'user', content: input1 }] });
          aioutput1.then((result: any) => {
              let cleanedJsonData1 = result.replace(/^```json\n|```\n?$/g, '');
              let criticalTask1 = JSON.parse(cleanedJsonData1);
              gantt.dataSource = criticalTask1.CriticalCollection
              let modifiedtaskID = criticalTask1.AddedResourceIds;
              let taskIdsString = modifiedtaskID.join(', ');
              toast.content = 'Task Id: ' + taskIdsString + ' new resources has been added';
              toast.dataBind();
              toast.show();
            //   let csfooterElement = document.getElementById('csfooter');
            //   if (csfooterElement) {
            //       csfooterElement.innerText = ' Critical task containing Task Id: ' + taskIdsString + ' new resources has been added';
            //   }
              gantt.hideSpinner();
          })
      });
    }
  }
