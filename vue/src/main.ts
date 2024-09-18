import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router';
import './style.css'
import App from "./App.vue";
import SmartPaste from './ai-components/ai-smart-paste/ai-default.vue';
import SmartTextArea from './ai-components/ai-smart-textarea/ai-default.vue'
import ComboBox from './ai-components/ai-combo-box/semantic-searching.vue';
import Schedule from './ai-components/ai-schedule/ai-smart-window.vue';
import RTE from './ai-components/ai-rich-text-editor/ai-default.vue';
import Pivot from './ai-components/ai-pivot-table/ai-smart-pivot.vue'
import Spreadsheet from './ai-components/ai-spreadsheet/ai-smart-spreadsheet.vue'
import Treegrid from './ai-components/ai-treegrid/ai-adaptive-datastructring.vue'
import Query from './ai-components/ai-querybuilder/ai-natural-language-query.vue';
import Maps from './ai-components/ai-maps/ai-weather-prediction.vue'
import ImageEditor from './ai-components/ai-image-editor/ai-smart-image-editor.vue'
import DiagramFlowChart from './ai-components/ai-diagram/ai-text-to-flowchart.vue';
import DiagramMindmap from './ai-components/ai-diagram/ai-mindmap.vue';
import DocumentSmart from './ai-components/ai-document-editor/ai-smart-editor.vue';
import DocumentAssist from './ai-components/ai-document-editor/ai-writing-assist.vue';
import SmartKanban from './ai-components/ai-kanban/ai-smart-kanban.vue'
import GridSemantic from './ai-components/ai-grid/semantic-filtering.vue'
import GridAnomaly from './ai-components/ai-grid/ai-anomaly-detection.vue'
import GridPredictive from './ai-components/ai-grid/ai-predictive-entry.vue'
import GanttTask from './ai-components/ai-gantt/ai-task-prioritizer.vue';
import GanttProgress from './ai-components/ai-gantt/ai-progress-predictor.vue';
import GanttResource from './ai-components/ai-gantt/ai-resource-manager.vue';

const routes = [
    {
        path: '/',
        component: SmartPaste
    },
    {
        path: '/ComboBox',
        name: 'ComboBox',
        component: ComboBox
    },
    {
        path: '/DiagramFlowChart',
        name: 'DiagramFlowChart',
        component: DiagramFlowChart
    },
    {
        path: '/DiagramMindmap',
        name: 'DiagramMindmap',
        component: DiagramMindmap
    },
    {
        path: '/DocumentSmart',
        name: 'DocumentSmart',
        component: DocumentSmart
    },
    {
        path: '/DocumentAssist',
        name: 'DocumentAssist',
        component: DocumentAssist
    },
    {
        path: '/GanttProgress',
        name: 'GanttProgress',
        component: GanttProgress
    },
    {
        path: '/GanttResource',
        name: 'GanttResource',
        component: GanttResource
    },
    {
        path: '/GanttTask',
        name: 'GanttTask',
        component: GanttTask
    },
    {
        path: '/GridAnomaly',
        name: 'GridAnomaly',
        component: GridAnomaly
    },
    {
        path: '/GridPredictive',
        name: 'GridPredictive',
        component: GridPredictive
    },
    {
        path: '/GridSemantic',
        name: 'GridSemantic',
        component: GridSemantic
    },
    {
        path: '/ImageEditor',
        name: 'ImageEditor',
        component: ImageEditor
    },
    {
        path: '/Kanban',
        name: 'Kanban',
        component: SmartKanban
    },
    {
        path: '/Maps',
        name: 'Maps',
        component: Maps
    },
    {
        path: '/Pivot',
        name: 'Pivot',
        component: Pivot
    },
    {
        path: '/Query',
        name: 'Query',
        component: Query
    },
    {
        path: '/RTE',
        name: 'RTE',
        component: RTE
    },
    {
        path: '/Schedule',
        name: 'Schedule',
        component: Schedule
    },
    {
        path: '/SmartPaste',
        name: 'SmartPaste',
        component: SmartPaste
    },
    {
        path: '/SmartTextArea',
        name: 'SmartTextArea',
        component: SmartTextArea
    },
    {
        path: '/Spreadsheet',
        name: 'Spreadsheet',
        component: Spreadsheet
    },
    {
        path: '/Treegrid',
        name: 'Treegrid',
        component: Treegrid
    },
    
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
createApp(App).use(router).mount("#app");