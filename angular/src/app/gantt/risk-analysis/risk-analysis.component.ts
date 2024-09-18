import { Component, ElementRef, ViewChild } from '@angular/core';
import { tasksCollection } from './ganttdata';
import { getAzureChatAIRequest } from '../../ai-models/ai-models';
import { ToolbarModule } from '@syncfusion/ej2-angular-navigations'
import { ToolbarService } from '@syncfusion/ej2-angular-gantt'
import { GanttAllModule } from '@syncfusion/ej2-angular-gantt';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-risk-analysis',
  standalone: true,
  imports: [GanttAllModule, ToolbarModule, CommonModule],
  providers: [ToolbarService],
  templateUrl: './risk-analysis.component.html',
  styleUrl: './risk-analysis.component.css'
})
export class RiskAnalysisComponent {
  @ViewChild('ganttDefault', { static: false }) gantt!: ElementRef;
  public bool=true;
  public data?: object[];
  public taskSettings?: object;
  public editSetting?: object;
  public splitterSettings?: object;
  public toolbar?: object[];
  public baselineColor: string = 'red';
  public projectStartDate = new Date('03/25/2019');
  public projectEndDate =  new Date('05/30/2019');
  public gridLines: string = "Both";
  public summary: any = '';
  public timelineSettings?: object;
  public labelSettings?: object;
  ngOnit() {
    this.data = tasksCollection;
    this.taskSettings = {
      id: 'TaskID',
      name: 'TaskName',
      startDate: 'StartDate',
      duration: 'Duration',
      progress: 'Progress',
      dependency: 'Predecessor',
      baselineStartDate: "BaselineStartDate",
      baselineEndDate: "BaselineEndDate",
      child: 'subtasks',
      indicators: 'Indicators'
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
    this.labelSettings = {
      rightLabel: this.getSummary.bind(this),
      taskLabel: '${Progress}%'
    };
    this.toolbar = [{template: '<button id="toolbarButton" class="e-btn e-primary">Predict milestone</button>', text:'Predict milestone' }];
    this.timelineSettings = {
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

  }

  public getSummary(value: any): any {
         if (this.summary !== '') {
           let isupdated = false;
           for (let i = 0; i < this.summary.length; i++) {
             if (parseInt(this.summary[i]['TaskID']) === value.taskId) {
               isupdated = true;
               return this.summary[i]['Summary'];
             }
           }
           if (!isupdated) {
             return '';
           }
         }
         else {
           return '';
         }
       };
  public queryTaskbarInfo(args: any) {
    debugger
    if (this.summary !== '') {
      for (let i = 0; i < this.summary.length; i++) {
        if (parseInt(this.summary[i]['TaskID']) === args.data.ganttProperties.taskId && this.summary[i]['Priority'] === 'high') {
          args.taskbarBgColor = 'rgb(255, 0, 0)';
          args.progressBarBgColor = 'rgb(255, 0, 0)';
        }
      }
    }
  }




  public toolbarClick(args: any) {
    if (args.item.text === 'Analyze Risk') {
     console.log( (this.gantt as any).ganttProperties);
      (this.gantt as any).showSpinner();

      let input = `1, You analyze the project complete collection in below 'TaskCollection' to identify potential risks and suggest mitigation strategies. 
2, The collection contains the predessor(Dependency) values with type of SS(start to start), SF(Start to finish), FS(finish to start), FF(finish to finish) and the default type is SS. Dependency values not necessory in each task. 
3, Analyze the complete project task collection duration and if any task get risk whole project and dependent task gets risk.
        Task Collection Data:` + JSON.stringify(tasksCollection) + `Ensure the output is in JSON object format name of 'TaskDetails' alone with + 'Priority' key-high or low risk and 'Summary' key-details of the risk and mitigation strategy and Summary details given format is (TaskID-summary details), don't give another values and avoid any unwanted content or unwanted JSON tags. No other explanation or content to be returned.

        Output format:
        "{
        "TaskDetails":[{
        "Priority":value,
        "TaskID": value,
        "Summary":value
        }]
        }"

        Don't give anyother format values.`;
      let aioutput = getAzureChatAIRequest({ messages: [{ role: 'user', content: input }] });
      aioutput.then((result: any) => {
        let cleanedJsonData = result.replace(/^```json\n|```\n?$/g, '');
        this.summary = JSON.parse(cleanedJsonData).TaskDetails;
        (this.gantt as any).hideSpinner();
        (this.gantt as any).refresh();
        // setTimeout(() => {
        //     button.refresh()
            
        // }, 500);
      });
    }
  }
}
