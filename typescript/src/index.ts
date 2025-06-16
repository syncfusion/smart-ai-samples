import { TreeView, Sidebar } from '@syncfusion/ej2-navigations';
import {Toolbar} from '@syncfusion/ej2-navigations';
import { overFlow } from '@syncfusion/ej2/diagrams';
import { expanded } from '@syncfusion/ej2/treegrid';

// toolbar header
// Toolbar items
let toolbarItems: { [key: string]: Object }[] = [
  { template: `<button class="e-control e-btn e-icon-btn" id="toggle"><svg class="hamburger" viewBox="0 0 40 30">
                <rect y="0"></rect>
                <rect y="13"></rect>
                <rect y="26"></rect>
            </svg</button>`, tooltipText: "Menu" },
  { template: `<div class = "e-tool-name">Syncfusion AI Samples  </div>          
    ` , overFlow: 'Show' },
];

// Initialize the Toolbar control
let toolbar: Toolbar = new Toolbar({
  items: toolbarItems,
  height: '38px',
});
toolbar.appendTo('#toolbar-header');
// TreeView data
let treeData: { [key: string]: Object }[] = [
  { id: '/smartpaste/index.html', name: 'Smart Paste' },
  { id: '/smarttextarea/index.html', name: 'Smart TexArea' },
  { id: '/combobox/local-embedding/index.html', name: 'ComboBox', url: '' },
  {
    id: '/scheduler/smart_scheduler/index.html', name: 'Schedule', url: ''
  },
  { id: '/richtexteditor/index.html', name: 'Rich Text Editor' },
  { id: '/pivot-table/smart_pivot_table/index.html', name: 'Pivot Table', url: '' },
 
  { id: '/spreadsheet/smart-spreadsheet/index.html', name: 'SpreadSheet', url: '' },
  { id: '/treegrid/adaptive_data_structuring/index.html', name: 'Tree Grid', url: '' },
  { id: '/query-builder/nlq/index.html', name: 'Query Builder', url: '' },
  { id: '/maps/weather-prediction/index.html', name: 'Maps', url: '' },
  { id: '/image-editor/smart-editor', name: 'ImageEditor' },
  {
    id: '5', name: 'Diagram', url: '', subItems: [
      { id: '/diagram/text-to-flowchart/index.html', name: 'Text to Flowchart' },
      { id: '/diagram/text-to-mindmap/index.html', name: 'Text to Mind Map' },
      { id: '/diagram/text-to-umlSequenceDiagram/index.html', name: 'Text to UML Sequence' },
    ]
  },
  {
    id: '6', name: 'Document editor', url: '', subItems: [
      { id: '/document-editor/smart-editor/index.html', name: 'Smart Editor' },
      { id: '/document-editor/writing-assist/index.html', name: 'Smart Writer' },
    ]
  },
  {
    id: '10', name: 'Kanban', subItems: [
      { id: '/kanban/sentiment-analysis/index.html', name: 'Sentiment  Analysis' },
      { id: '/kanban/smart-recommendation/index.html', name: 'Smart Recommnedation' }

    ]
  },

  {
    id: '1', name: 'Grid', url: '', subItems: [
      { id: '/grid/semantic_search/index.html', name: 'Semantic Search', url: '/grid_semantic_search/index.html' },
      { id: '/grid/anomaly_detection/index.html', name: 'Anamoly Detection', url: '/grid_anomaly_detection/index.html' },
       { id: '/grid/predictive_data_entry/index.html', name: 'Predictive Data Entry', url: '/grid_predictive_data_entry/index.html' },

    ], expanded: true
  },
  {
    id: '8', name: 'Gantt', url: '', subItems: [
      { id: '/gantt/prioritize_task/index.html', name: 'Smart Task Prioritizer' },
      { id: '/gantt/progress/index.html', name: 'Smart Progress Predictor' },
      { id: '/gantt/resource_optimization/index.html', name: 'Smart Resource Allocation' }
    ]
  },
  {
    id:'99', name: ''
  }

];

// Initialize TreeView
let treeObj: TreeView = new TreeView({
  fields: { dataSource: treeData, id: 'id', text: 'name', child: 'subItems' },
  nodeSelected: function (args) {
    var selectedNode = args.nodeData;
    if (selectedNode.id && selectedNode.id.length > 5) {
      (document.getElementById('contentFrame')! as HTMLIFrameElement).src = '.' + selectedNode.id;
    }

  }
});
treeObj.appendTo('#tree');
var sidebarObj = new Sidebar({
  width: '250px',

  isOpen: true,


});
sidebarObj.appendTo('#sidebar');
document.getElementById('toggle')!.onclick = toggleSidebar;
function toggleSidebar() {
  sidebarObj.toggle();
}