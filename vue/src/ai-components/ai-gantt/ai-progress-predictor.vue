<template>
  <div class="control-pane">
    <div class="control-section">
      <div class="e-card-header-title" style="font-weight: 600; text-align: center;">Smart Progress Prediction</div>
      <div class="description-container e-card">
        <div class="e-card-content">
          <p>This sample uses AI to predict milestone dates and the overall project completion date. The predictions are based on the current year's TaskCollection data, along with an analysis of historical data from the past five years. Know more <a href="https://github.com/syncfusion/smart-ai-samples/blob/master/vue/src/ai-components/ai-gantt/Readme.md">here</a>.</p>
        </div>
      </div>
      <div id="container">
        <ejs-gantt
          ref="ganttInstance"
          :dataSource="taskDataCollection"
          :taskFields="taskFields"
          :editSettings="editSettings"
          :toolbar="toolbarOptions"
          :toolbarClick="toolbarClick"
          :splitterSettings="splitterSettings"
          :allowSelection="true"
          :treeColumnIndex="1"
          height="550px"
          :projectStartDate="new Date('4/1/2026')"
          :projectEndDate="new Date('6/2/2026')"
        >
          <e-columns>
            <e-column field="TaskID" visible="false"></e-column>
            <e-column field="TaskName" headerText="Event Name" width="250"></e-column>
            <e-column field="Duration"></e-column>
            <e-column field="StartDate" headerText="Start Date"></e-column>
            <e-column field="EndDate" headerText="End Date"></e-column>
          </e-columns>
        </ejs-gantt>
      </div>
    </div>
  </div>
</template>

<script>
import { GanttComponent, Toolbar, Edit, Selection, Sort, Reorder, ContextMenu, DayMarkers, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-vue-gantt';
import { ButtonComponent } from '@syncfusion/ej2-vue-buttons';
import * as data from './progress.json';
import { getAzureChatAIRequest } from '../common/ai-models';
import { TaskDataCollection } from './data-source';
import { createApp } from 'vue';

export default {
  name: 'Progress',
  data() {
    return {
      taskDataCollection: TaskDataCollection,
      taskFields: {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        parentID: "ParentTaskID"
      },
      editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
      },
      splitterSettings: {
        position: "28%"
      },
      toolbarOptions: [{
        template: function () {
          return { template: createApp().component('ganttToolbarTemplate', {
            template: '<ejs-button id="toolbarButton" :isPrimary="true">Predict milestone</ejs-button>',
            components: { 'ejs-button': ButtonComponent },
            data() { return {} }
          })}
        },
        text: 'Predict milestone'
      }]
    };
  },
  methods: {
    toolbarClick(args) {
      if (args.item.text === 'Predict milestone') {
        this.$refs.ganttInstance.showSpinner();
        let input =
          "You analyze the multiple year HistoricalTaskDataCollections and current TaskDataCollection to predict project completion dates and milestones based on current progress and historical trends. Ignore the null or empty values, and collection values based parent child mapping. Avoid json tags with your response. No other explanation or content to be returned." +
          " HistoricalTaskDataCollections :" + this.getHistoricalCollection() +
          " TaskDataCollection: " + JSON.stringify(this.taskDataCollection) +
          " Generate a JSON object named 'TaskDetails' containing:" +
          "- Key 'MilestoneTaskDate' with a list of milestone dates 'MilestoneDate' with 'TaskName' - task name. A milestone date is defined as the end date of tasks with a duration of 0 and only give current based milestone." +
          "- Key 'ProjectCompletionDate' indicating the latest end date among all tasks." +
          "- Key 'Summary' providing a summary of the project completion date and milestones.Ensure milestones are defined correctly based on tasks with a duration of 0, and the project completion date reflects the latest end date of all tasks "
        let aioutput = getAzureChatAIRequest({ messages: [{ role: 'user', content: input }] });
        aioutput.then((result) => {
          let cleanedJsonData = result.replace(/^```json\n|```\n?$/g, '').replace('```json', '').replace('```', '');
          let dataset = JSON.parse(cleanedJsonData);
          const eventMarkers = dataset.MilestoneTaskDate
            .map((milestone) => ({
              day: new Date(milestone["MilestoneDate"]),
              label: milestone["TaskName"]
            }));
          let projectDetailes = {
            day: new Date(dataset.ProjectCompletionDate),
            label: "Project completion date"
          }
          eventMarkers.push(projectDetailes)
          this.$refs.ganttInstance.ej2Instances.eventMarkers = eventMarkers;
          this.$refs.ganttInstance.hideSpinner();
        });
      }
    },
    getHistoricalCollection() {
      let historicalDataCollection = '';
      const word = data;
      for (let year = 2021; year < 2026; year++) {
        historicalDataCollection += "HistoricalTaskDataCollection" + year + ":" + JSON.stringify(word["TaskDataCollection" + year]);
      }
      return historicalDataCollection;
    }
  },
  components: {
    'ejs-gantt': GanttComponent,
    'e-columns': ColumnsDirective,
    'e-column': ColumnDirective,
    'ejs-button': ButtonComponent
  },
  provide: {
    gantt: [Edit, Toolbar, Selection, DayMarkers, Sort, Reorder, ContextMenu]
  }
};
</script>

<style scoped>
.control-section {
  margin: 20px;
}
.description-container {
  margin-bottom: 10px;
  margin-top: 10px;
}
#container {
  width: 100%;
}
</style>