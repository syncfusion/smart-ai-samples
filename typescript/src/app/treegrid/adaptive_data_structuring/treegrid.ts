import { TreeGrid, Toolbar, Edit } from '@syncfusion/ej2-treegrid';
import { projectData } from './treegriddata';
import { Button } from '@syncfusion/ej2/buttons';
import { getAzureChatAIRequest } from '../../ai-models';

TreeGrid.Inject(Toolbar, Edit);

let treegrid: TreeGrid = new TreeGrid({
  dataSource: projectData,
  idMapping: 'CategoryId',
  parentIdMapping: 'ParentId',
  treeColumnIndex: 1,
  width: '100%',
  toolbar: [{ template: `<button id='smartdata'>Smart Data Restructure</button>` }],
  created: created,
  columns: [
    { field: 'CategoryId', headerText: 'Category Id', isPrimaryKey: true, textAlign: 'Right', width:60 },
    { field: 'CategoryName', headerText: 'Category Name', width:100 },
    { field: 'Status', headerText: 'Status', width:70 },
    { field: 'OrderDate', headerText: 'Last Order Date', format: 'yMd', width:90 }
  ]
});
treegrid.appendTo('#TreeGrid');

function restructureData(args: any) {
    treegrid.showSpinner();
    let input = `I want you to act as a TreeGrid Data Organizer.
            Your task is to organize a dataset based on a hierarchical structure using 'CategoryId' and 'ParentId'.
            Each item in the dataset has a 'CategoryName' representing categories, and some categories have a null 'ParentId', indicating they are top-level categories. 
            Your role will be to meticulously scan the entire dataset to identify related items based on their 'CategoryName' values and nest them under the appropriate top-level categories by updating their 'ParentId' to match the 'CategoryId' of the corresponding top-level category.
            For example, if a category like 'Furniture' exists, you should scan the dataset for items such as 'Chair' and 'Table' and update their 'ParentId' to the 'CategoryId' of 'Furniture'.
            The output should be the newly prepared TreeGridData with correctly assigned 'ParentId' values. Please ensure that all subcategories are correctly nested under their respective top-level categories .
            Return the newly prepared TreeGridData alone and don't share any other information with the response:` + JSON.stringify(treegrid.dataSource);
    let aioutput: any = getAzureChatAIRequest({ messages: [{ role: 'user', content: input }] });
    aioutput.then((result: any) => {
      let cleanedJsonData = result.replace(/^```json\n|```\n?$/g, '');
      treegrid.dataSource = JSON.parse(cleanedJsonData);
      treegrid.hideSpinner();
    });
}

function created() {
  let button = document.getElementById('smartdata') as HTMLButtonElement;
  button.onclick = restructureData;
  new Button({ isPrimary: true }, '#smartdata');
}
