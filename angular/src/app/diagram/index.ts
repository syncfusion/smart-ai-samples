import { SmartFlowchartComponent } from './smart-flowchart/smart-flowchart.component';
import { SmartMindmapComponent } from './smart-mindmap/smart-mindmap.component';

import { Routes } from '@angular/router';
export const diagramRoutes:Routes  = [{
    path: 'diagram/smart-flowchart',component: SmartFlowchartComponent
},
{
    path: 'diagram/smart-mindmap',component: SmartMindmapComponent
}
];