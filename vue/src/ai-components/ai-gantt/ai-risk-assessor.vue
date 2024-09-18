<template>
    <div class="control-pane">
        <!-- ... (previous template code remains the same) ... -->
        <div id="container">
            <ejs-gantt ref="ganttRef" id="GanttContainer" :dataSource="tasksCollect" :allowSorting="true"
                :allowReordering="true" :enableContextMenu="true" :toolbar="toolbarOptions" :taskFields="taskFields"
                baselineColor="red" :editSettings="editSettings" :allowFiltering="true" gridLines="Both"
                :highlightWeekends="true" :queryTaskbarInfo="queryTaskbarInfo" :timelineSettings="timelineSettings"
                :labelSettings="labelSettings" @toolbarClick="toolbarClick" :readOnly="false" :taskbarHeight="20"
                :rowHeight="40" height="550px" :treeColumnIndex="1" :allowUnscheduledTasks="true"
                :projectStartDate="new Date('03/25/2019')" :projectEndDate="new Date('05/30/2019')">
                <!-- ... (columns remain the same) ... -->
            </ejs-gantt>
        </div>
    </div>
</template>

<script>
import {
    GanttComponent as EjsGantt,
    ColumnsDirective, ColumnDirective,
    Toolbar, Edit, Selection, ContextMenu, Filter, Sort, Reorder, DayMarkers, CriticalPath
} from '@syncfusion/ej2-vue-gantt';
import { tasksCollect } from './data-source';
import { ButtonComponent as EjsButton } from '@syncfusion/ej2-vue-buttons';
import { getAzureChatAIRequest } from '../common/ai-models';

export default {
    name: 'RiskAnalysis',
    components: {
        'ejs-gantt': EjsGantt,
        'e-columns': ColumnsDirective,
        'e-column': ColumnDirective,
        'ejs-button': EjsButton
    },
    data() {
        return {
            tasksCollect,
            taskFields: {
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
            },
            toolbarOptions: [{
                template: this.toolbarTemplate,
                text: 'Analyze Risk'
            }],
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            labelSettings: {
                rightLabel: 'rightLabelTemplate',
                taskLabel: '${Progress}%'
            },
            summary: ''
        };
    },
    methods: {
        getSummary(value) {
            if (this.summary !== '') {
                for (let i = 0; i < this.summary.length; i++) {
                    if (parseInt(this.summary[i]['TaskID']) === value.taskId) {
                        return this.summary[i]['Summary'];
                    }
                }
            }
            return '';
        },
        async toolbarClick(args) {
            if (args.item.text === 'Analyze Risk') {
                this.$refs.ganttRef.ej2Instances.showSpinner();
                const input = `1, You analyze the project complete collection in below 'TaskCollection' to identify potential risks and suggest mitigation strategies. 
  2, The collection contains the predessor(Dependency) values with type of SS(start to start), SF(Start to finish), FS(finish to start), FF(finish to finish) and the default type is SS. Dependency values not necessory in each task. 
  3, Analyze the complete project task collection duration and if any task get risk whole project and dependent task gets risk.
          Task Collection Data:` + JSON.stringify(tasksCollect) + `Ensure the output is in JSON object format name of 'TaskDetails' alone with + 'Priority' key-high or low risk and 'Summary' key-details of the risk and mitigation strategy and Summary details given format is (TaskID-summary details), don't give another values and avoid any unwanted content or unwanted JSON tags. No other explanation or content to be returned.
  
          Output format:
          "{
          "TaskDetails":[{
          "Priority":value,
          "TaskID": value,
          "Summary":value
          }]
          }"
  
          Don't give anyother format values.`;

                try {
                    const result = await getAzureChatAIRequest({ messages: [{ role: 'user', content: input }] });
                    let cleanedJsonData = result.replace(/^```json\n|```\n?$/g, '');
                    this.summary = JSON.parse(cleanedJsonData).TaskDetails;
                    this.$refs.ganttRef.ej2Instances.hideSpinner();
                    this.$refs.ganttRef.ej2Instances.refresh();
                } catch (error) {
                    console.error("Error in AI request:", error);
                    this.$refs.ganttRef.ej2Instances.hideSpinner();
                }
            }
        },
        rightLabelTemplate(props) {
            return {
                template: Vue.extend({
                    template: `
              <div style="margin-top: -7px">
                <div v-if="props.ganttProperties" id="rightLabel">
                  {{ getSummary(props.ganttProperties) }}
                </div>
              </div>
            `,
                    methods: {
                        getSummary: this.getSummary
                    }
                })
            };
        },
        queryTaskbarInfo(args) {
            if (this.summary !== '') {
                for (let i = 0; i < this.summary.length; i++) {
                    if (parseInt(this.summary[i]['TaskID']) === args.data.ganttProperties.taskId && this.summary[i]['Priority'] === 'high') {
                        args.taskbarBgColor = 'rgb(255, 0, 0)';
                        args.progressBarBgColor = 'rgb(255, 0, 0)';
                    }
                }
            }
        }
    },
    provide: {
        gantt: [Edit, Toolbar, Selection, CriticalPath, ContextMenu, Filter, Sort, Reorder, DayMarkers]
    }
}
</script>