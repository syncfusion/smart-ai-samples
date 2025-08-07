import { GanttComponent, Toolbar, Edit, Selection, ContextMenu, Filter, Sort, Reorder, DayMarkers, CriticalPath, ColumnsDirective, ColumnDirective, Inject } from '@syncfusion/ej2-react-gantt';
import { tasksCollection } from './datasource';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { getAzureChatAIRequest } from '../../../ai-models';

function RiskAnalysis() {
    let ganttInstance: GanttComponent;
    const taskFields = {
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
    const toolbarTemplate = () => {
        return <ButtonComponent id='toolbarButton' isPrimary={true}>Analyze Risk</ButtonComponent>
    }

    const toolbarOptions = [{
        template: toolbarTemplate, text: 'Analyze Risk'
    }]

    let summary: any = '';
    (window as any).getSummary = (value: any) => {
        if (summary !== '') {
            let isupdated = false;
            for (let i = 0; i < summary.length; i++) {
                if (parseInt(summary[i]['TaskID']) === value.taskId) {
                    isupdated = true;
                    return summary[i]['Summary'];
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

    function toolbarClick(args: any) {
        if (args.item.text === 'Analyze Risk') {
            ganttInstance.showSpinner();
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
                summary = JSON.parse(cleanedJsonData).TaskDetails;
                ganttInstance.hideSpinner();
                ganttInstance.refresh();
            });
        }
    }

    const rightLabelTemplate = (data: any) => {
        return (
            <div style={{ marginTop: '-7px' }}>
                {data.ganttProperties && (
                    <div id="rightLabel">
                        {(window as any).getSummary(data.ganttProperties)}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className='control-pane'>
            <div className='control-section'>
                <div className="description-container e-card">
                    <div className='e-card-content '>
                        <p>Using AI, this sample identifies at-risk tasks by analyzing their duration and dependencies, and highlights them with distinctive colors on their taskbars. Know more <a href="https://github.com/syncfusion/smart-ai-samples/blob/master/react/src/ai-components/gantt/Readme.md">here</a>.</p>
                    </div>
                </div>
                <div id='container'>
                    <GanttComponent
                        id="GanttContainer"
                        ref={(gantt: GanttComponent) => ganttInstance = gantt as GanttComponent}
                        dataSource={tasksCollection}
                        allowSorting={true}
                        allowReordering={true}
                        enableContextMenu={true}
                        toolbar={toolbarOptions}
                        taskFields={taskFields}
                        baselineColor='red'
                        editSettings={{
                            allowAdding: true,
                            allowEditing: true,
                            allowDeleting: true,
                            allowTaskbarEditing: true,
                            showDeleteConfirmDialog: true
                        }}
                        allowFiltering={true}
                        gridLines="Both"
                        highlightWeekends={true}
                        queryTaskbarInfo={(args) => {
                            if (summary !== '') {
                                for (let i = 0; i < summary.length; i++) {
                                    if (parseInt(summary[i]['TaskID']) === args.data.ganttProperties.taskId && summary[i]['Priority'] === 'high') {
                                        args.taskbarBgColor = 'rgb(255, 0, 0)';
                                        args.progressBarBgColor = 'rgb(255, 0, 0)';
                                    }
                                }
                            }
                        }}
                        timelineSettings={{
                            showTooltip: true,
                            topTier: {
                                unit: 'Week',
                                format: 'dd/MM/yyyy'
                            },
                            bottomTier: {
                                unit: 'Day',
                                count: 1
                            }
                        }}
                        labelSettings={{
                            rightLabel: rightLabelTemplate,
                            taskLabel: '${Progress}%'
                        }}
                        toolbarClick={toolbarClick}
                        readOnly={false}
                        taskbarHeight={20}
                        rowHeight={40}
                        height='550px'
                        treeColumnIndex={1}
                        allowUnscheduledTasks={true}
                        projectStartDate={new Date('03/25/2019')}
                        projectEndDate={new Date('05/30/2019')}
                    >
                        <ColumnsDirective>
                            <ColumnDirective field='TaskID' headerText='Task ID' visible={false} />
                            <ColumnDirective field='TaskName' headerText='Event Name' allowReordering={false} width='250px' />
                            <ColumnDirective field='Duration' headerText='Duration' allowEditing={false} />
                            <ColumnDirective field='StartDate' headerText='Start Date' allowSorting={false} />
                            <ColumnDirective field='EndDate' headerText='End Date' allowSorting={false} />
                        </ColumnsDirective>
                        <Inject services={[Edit, Toolbar, Selection, CriticalPath, ContextMenu, Filter, Sort, Reorder, DayMarkers]} />
                    </GanttComponent>
                </div>
            </div>
        </div>
    )
}

export default RiskAnalysis