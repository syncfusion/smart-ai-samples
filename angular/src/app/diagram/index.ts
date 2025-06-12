import { SmartFlowchartComponent } from './smart-flowchart/smart-flowchart.component';
import { SmartMindmapComponent } from './smart-mindmap/smart-mindmap.component';

import { Routes } from '@angular/router';
import { SmartUmlSequenceDiagramComponent } from './smart-umlSequenceDiagram/smart-umlSequenceDiagram.component';
export const diagramRoutes:Routes  = [{
    path: 'diagram/smart-flowchart',component: SmartFlowchartComponent
},
{
    path: 'diagram/smart-mindmap',component: SmartMindmapComponent
},
{
    path: 'diagram/smart-umlSequenceDiagram',component: SmartUmlSequenceDiagramComponent
}
];