import { AnomalyDetectionComponent } from './anomaly-detection/anomaly-detection.component';
import { DataTrendAnalysisComponent } from './data-trend-analysis/data-trend-analysis.component';
import { SemanticSearchComponent } from './semantic-search/semantic-search.component';
import { PredictiveDataentryComponent } from './predictive-dataentry/predictive-dataentry.component';
import { AssistiveGridComponent } from './assistive-grid/frontend/assistive-grid.component';
import {     Routes } from '@angular/router';
export const gridRoutes:Routes  = [
{
    path: 'grid/assistive-grid',component: AssistiveGridComponent
},
{
    path: 'grid/anamoly-detection',component: AnomalyDetectionComponent
},
{ path: 'grid/semantic-search',component: DataTrendAnalysisComponent},{
    path: 'grid/predictive-data-entry',component: PredictiveDataentryComponent
},{
    path: 'grid/data-trend-analysis',component: DataTrendAnalysisComponent
}];

