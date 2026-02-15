import { NgModule } from '@angular/core';
import { SmartTextArea } from './smart-text-area/smart-text-area.component';
import { SmartPasteComponent } from './smart-paste/smart-paste.component';
import {  gridRoutes } from './grid';
import { schedulerRoutes } from './scheduler'
import { ganttRoutes } from './gantt';
import {  comboboxRoutes } from './combo-box';
import {  diagramRoutes } from './diagram';
import { RouterModule, Routes } from '@angular/router';
import { mapsRoutes } from './maps';
import {SmartFileManager} from './filemanager/smart-filemanager/file-manager.component'
import {pivotRoutes} from './pivot-table';
import {  queryRoutes} from './query-builder';
import { sheetRoutes } from './spreadsheet';
import {imageEditorRoutes} from './image-editor';
import { documentRoutes } from './document-editor';
import { SmartRichTextEditor } from './rich-text-editor/smart-rich-text-editor.component';
import { AdaptiveDataStructureComponent } from './treegrid/adaptive-data-structure/adaptive-data-structure.component';
import { StockForecastComponent } from './chart/stockForecasting/stockForecast.component';
export const routes: Routes = [
    {
        path: '',component: SmartTextArea
       
    },    
{
    path: 'smart-textarea',component: SmartTextArea
   
},{
    path: 'smart-paste',component: SmartPasteComponent
   
},
{
    path:'file-manager',component:SmartFileManager
},
{
    path: 'rich-text-editor',component: SmartRichTextEditor
   
},
...gridRoutes,
...comboboxRoutes,
...diagramRoutes, 
...schedulerRoutes,
...ganttRoutes,
...mapsRoutes,
...pivotRoutes,
{
    path: 'smart-treegrid', component: AdaptiveDataStructureComponent
},
{
    path: 'stockForecasting', component: StockForecastComponent
},
...sheetRoutes,...queryRoutes,...imageEditorRoutes,...documentRoutes,
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }