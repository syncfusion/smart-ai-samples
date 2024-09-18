import { PrioritizeTaskComponent } from './prioritize-task/prioritize-task.component';
import {  Routes } from '@angular/router';
import { ProgressComponent } from './progress/progress.component';
import { ResourceOptimizationComponent } from './resource-optimization/resource-optimization.component';
import { TaskScheduleComponent } from './task-schedule/task-schedule.component';
export const ganttRoutes:Routes  = [{
    path: 'gantt/prioritize-task',component: PrioritizeTaskComponent
},
{
    path: 'gantt/progress',component: ProgressComponent
},
{
    path: 'gantt/resource-optimization',component: ResourceOptimizationComponent
},
{
    path: 'gantt/task-schedule',component: TaskScheduleComponent
}];
 