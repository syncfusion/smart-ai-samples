import { Component, ViewChild } from '@angular/core';
import { getAzureChatAIRequest } from '../../ai-models/ai-models';
import { TreeGridComponent, TreeGridModule, ToolbarService, ToolbarItems, EditService } from '@syncfusion/ej2-angular-treegrid';
import { ButtonComponent, ButtonModule } from '@syncfusion/ej2-angular-buttons';
@Component({
  selector: 'app-adaptive-data-structure',
  standalone: true,
  imports: [TreeGridModule, ButtonModule],
  providers: [ToolbarService, EditService],
  templateUrl: './adaptive-data-structure.component.html',
  styleUrl: './adaptive-data-structure.component.css'
})
export class AdaptiveDataStructureComponent {
  @ViewChild('treegrid', { static: false }) treegrid!: TreeGridComponent;
  public toolbarOptions!: ToolbarItems[] | Object;
  ngOnInit() {
    // Define the toolbar items
    this.toolbarOptions = [
      { text: 'Smart Data Restructure', id: 'smartdata', prefixIcon: 'e-restructure', isPrimary: 'true' }
    ];
  }
  public projectData = [
    { 'CategoryId': 1, 'CategoryName': 'Electronics', 'Status': 'Available', 'OrderDate': new Date('2021/07/12'), 'ParentId': null },
    { 'CategoryId': 2, 'CategoryName': 'Cell phone', 'Status': 'out of Stock', 'OrderDate': new Date('2021/06/17'), 'ParentId': 1 },
    { 'CategoryId': 3, 'CategoryName': 'Tablet', 'Status': 'Available', 'OrderDate': new Date('2021/07/12'), 'ParentId': 7 },
    { 'CategoryId': 4, 'CategoryName': 'Cloth', 'Status': 'Available', 'OrderDate': new Date('2021/10/05'), 'ParentId': null },
    { 'CategoryId': 5, 'CategoryName': 'Silk', 'Status': 'Out of Stock', 'OrderDate': new Date('2021/09/02'), 'ParentId': 7 },
    { 'CategoryId': 6, 'CategoryName': 'Chair', 'Status': 'Available', 'OrderDate': new Date('2021/03/03'), 'ParentId': 1 },
    { 'CategoryId': 7, 'CategoryName': 'Furniture', 'Status': 'Available', 'OrderDate': new Date('2021/03/05'), 'ParentId': null },
    { 'CategoryId': 8, 'CategoryName': 'Bed', 'Status': 'Available', 'OrderDate': new Date('2021/03/05'), 'ParentId': 7 },
    { 'CategoryId': 9, 'CategoryName': 'Fabrics', 'Status': 'Available', 'OrderDate': new Date('2021/10/05'), 'ParentId': 4 }
];
toolbarClick(args: any): void {
  if (args.item.id === 'smartdata') {
    this.restructureData();
  }
}
  restructureData() {
    this.treegrid.showSpinner();
    let input = `I want you to act as a TreeGrid Data Organizer.
            Your task is to organize a dataset based on a hierarchical structure using 'CategoryId' and 'ParentId'.
            Each item in the dataset has a 'CategoryName' representing categories, and some categories have a null 'ParentId', indicating they are top-level categories. 
            Your role will be to meticulously scan the entire dataset to identify related items based on their 'CategoryName' values and nest them under the appropriate top-level categories by updating their 'ParentId' to match the 'CategoryId' of the corresponding top-level category.
            For example, if a category like 'Furniture' exists, you should scan the dataset for items such as 'Chair' and 'Table' and update their 'ParentId' to the 'CategoryId' of 'Furniture'.
            The output should be the newly prepared TreeGridData with correctly assigned 'ParentId' values. Please ensure that all subcategories are correctly nested under their respective top-level categories .
            Return the newly prepared TreeGridData alone and don't share any other information with the response:` + JSON.stringify(this.treegrid.dataSource);
    let aioutput: any = getAzureChatAIRequest({ messages: [{ role: 'user', content: input }] });
    aioutput.then((result: any) => {
        let cleanedJsonData = result.replace(/^```json\n|```\n?$/g, '');
        console.log('result : ', cleanedJsonData);
        console.log('end result')
        this.treegrid.dataSource = JSON.parse(cleanedJsonData);
        this.treegrid.hideSpinner();
    });
}
}
