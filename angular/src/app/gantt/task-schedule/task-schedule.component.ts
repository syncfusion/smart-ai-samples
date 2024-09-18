import { HistoricalTaskData,HistoricalDataCollection2021,HistoricalDataCollection2022,HistoricalDataCollection2023,HistoricalDataCollection2024,HistoricalDataCollection2025 } from './ganttdata';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { getAzureTextAIRequest,getAzureChatAIRequest } from '../../ai-models/ai-models'; 
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations'
import { ToolbarService } from '@syncfusion/ej2-angular-gantt'
import { GanttAllModule } from '@syncfusion/ej2-angular-gantt';

@Component({
  selector: 'app-task-schedule',
  standalone: true,
  imports: [GanttAllModule,ToolbarModule],
  providers: [ToolbarService],
  templateUrl: './task-schedule.component.html',
  styleUrl: './task-schedule.component.css'
})
export class TaskScheduleComponent {
  @ViewChild('ganttDefault', { static: false }) gantt!: ElementRef;
  public data?: object[];
  public taskSettings?: object;
  public editSetting?:object;
  public splitterSettings?:object;
  public timelineSettings?:object;
  public toolbar?:object[];
  public gridLines:string= "Both";
  public projectStartDate= new Date('4/1/2026');
  public projectEndDate= new Date('6/2/2026');
  ngOnInit(): void {
    this.data = HistoricalTaskData;
    this.taskSettings = {
      id: 'Id',
      name: 'Name',
      startDate: 'StartDate',
      duration: 'Duration',
      progress: 'Progress',
      endDate: 'EndDate',
      baselineEndDate: 'BaselineEndDate',
      baselineStartDate: 'BaselineStartDate',
      parentID: 'ParentId',
  };
    this.editSetting = {
      allowAdding: true,
      allowEditing: true,
      allowDeleting: true,
      allowTaskbarEditing: true,
      showDeleteConfirmDialog: true
  };
    this.splitterSettings = {
      position: "28%"
  };
  this.timelineSettings= {
    showTooltip: true,
    topTier: {
        unit: 'Week',
        format: 'dd/MM/yyyy'
    },
    bottomTier: {
        unit: 'Day',
        count: 1
    }
}
    this.toolbar =[{template: '<button id="toolbarButton" class="e-btn e-primary">Predective scheduling</button>', text:'Predective scheduling' }];
  }
  public GetHistoricalCoolection() {
    let collection = "";
    collection = collection + JSON.stringify(HistoricalDataCollection2021) + JSON.stringify(HistoricalDataCollection2022) + JSON.stringify(HistoricalDataCollection2023) + JSON.stringify(HistoricalDataCollection2024) + JSON.stringify(HistoricalDataCollection2025);
    return collection;
}
  public toolbarClick(args: any) {
    if (args.item.text === 'Predective scheduling') {
      (this.gantt as any).showSpinner();

      let input = `Analyze the historical data collection for project management in a Gantt Chart system. Based on the provided historical data, update the project schedule values for the given TaskDataCollection for the year 2026. 

      The output should be a JSON object with a key named 'TaskCollection', which contains the updated list of tasks. The response should not include any JSON tags, additional explanations, or extra content.
      
      Here are the details:
      - HistoricalDataCollections: ${this.GetHistoricalCoolection()}
      - TaskDataCollection: ${JSON.stringify(HistoricalTaskData)}
      
      Return the updated TaskCollection in JSON format, with no additional text or explanations.`;
      let aioutput = getAzureChatAIRequest({ messages: [{ role: 'user', content: input }] });
      aioutput.then((result: any) => {
        let cleanedJsonData = result.replace(/^```json\n|```\n?$/g, '');
        let collection: any = JSON.parse(cleanedJsonData).TaskCollection;
        let currentData: any = (this.gantt as any).currentViewData;
        for(let i = 0; i < collection.length; i++) {
            collection[i].BaselineStartDate =  new Date(currentData[i].StartDate);
            collection[i].BaselineEndDate =  new Date(currentData[i].EndDate);
        }
        (this.gantt as any).dataSource = collection;
        (this.gantt as any).hideSpinner();
      });
    }
  }
}
