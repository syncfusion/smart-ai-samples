import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { SidebarAllModule,TreeViewAllModule,NodeSelectEventArgs} from '@syncfusion/ej2-angular-navigations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,SidebarAllModule,TreeViewAllModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
 constructor(private router: Router) {}
  public treeData: { [key: string]: Object }[] =    [
    { id: '1', name: 'Smart Paste',route: '/smart-paste'},
    { id: '2', name: 'Smart TexArea', route: '/smart-textarea' },
    {  id: '16', name: 'SpreadSheet', url:'', route:'spreadsheet' },
    { id: '20', name: 'ImageEditor', route: 'image-editor' },
    {  id: '4', name: 'Schedule', url:'', route: '/scheduler/smart-scheduler'},
    {  id: '14', name: 'Rich Text Editor', url:'', route: 'rich-text-editor'},
    {  id: '12', name: 'Maps', url:'',route:'/maps/weather-prediction'},
    {  id: '22', name: 'FileManager',route:'file-manager' },
    {  id: '9', name: 'Pivot Table', url:'', route:'pivot-table'},
    {  id: '13', name: 'Tree Grid', url:'', route:'smart-treegrid'},
    {  id: '7', name: 'Query Builder', route:'query-builder'},
    { id: '3', name: 'Grid', url:'',subItems: [
        { id: '34', name: 'Semantic Search', route: '/grid/semantic-search/' },
        { id: '31', name: 'Anamoly Detection', route: 'grid/anamoly-detection' },
        { id: '33', name: 'Data Trend Analysis', route: '/grid/data-trend-analysis' },
    
      ],expanded: true },
   
      {  id: '6', name: 'Document editor', url:'',subItems: [
        {id:'/document-editor/smart-editor/',name:'Smart Editor',route: '/document-editor/smart-editor'},
       
      ]},
      {  id: '5', name: 'Diagram', url:'',subItems: [
        {id: '17', route:'/diagram/smart-flowchart', name:'Text to Flowchart'},
        {id: '18', route:'/diagram/smart-mindmap', name:'Text to Mindmap'},
      ]},
      
      
      {  id: '11', name: 'ComboBox', url:'',subItems: [ { id: '111', name: 'Semantic Searching', route:'combobox/local-embedding'}],},
     
      
      {  id: '8', name: 'Gantt', url:'',subItems: [
        {id:'81',name:'Smart Task Prioritizer',route: 'gantt/prioritize-task/'},
        {id:'82',name:'Smart Progress Predictor',route: '/gantt/progress/'},
        {id:'83',name:'Smart Resource Allocation',route: '/gantt/resource-optimization/'},
        {id:'85',name:'Smart Scheduling',route: '/gantt/task-schedule/'},
      ]},
     
      { id: '10', name: 'Kanban',subItems: [
        {id:'/kanban/sentiment-analysis/',name:'Smart Recommendation'},
        {id:'/kanban/smart-recommendation/',name:'Smart Analysis'}
     
      ]},
      
    
];
public fields:Object = { dataSource: this.treeData, id: 'id', text: 'name', child: 'subItems' };
public onNodeSelected(args: NodeSelectEventArgs): void {
  debugger;
  let selectedNode = this.treeData.find(node => node['id'] === args.nodeData['id']);
  if(!selectedNode ){
    let parentData: any = this.treeData.find(node => node['id'] === args.nodeData['parentID']);
    selectedNode = parentData['subItems'].find((node: any) => node['id'] === args.nodeData['id']);
  }
  if (selectedNode && selectedNode['route']) {
    this.router.navigate([selectedNode['route']]);
  }
}
}
