import {
    GanttComponent, Toolbar, Edit, Selection, CriticalPath, ContextMenu, Filter, Sort,
    Reorder, DayMarkers, ColumnsDirective, ColumnDirective, Inject
} from '@syncfusion/ej2-react-gantt';
import {
    HistoricalTaskData, HistoricalDataCollection2021, HistoricalDataCollection2022,
    HistoricalDataCollection2023, HistoricalDataCollection2024, HistoricalDataCollection2025
} from './datasource';
import { getAzureChatAIRequest } from '../../../ai-models';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

function TaskSchedule() {
    let ganttInstance: GanttComponent;
    const taskFields = {
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
    const toolbarTemplate = () => {
        return <ButtonComponent id='toolbarButton' isPrimary={true}>Predictive scheduling</ButtonComponent>
    };

    const toolbarOptions = [{
        template: toolbarTemplate, text: 'Predictive scheduling'
    }];

    function GetHistoricalCollection() {
        let collection = "";
        collection = collection + JSON.stringify(HistoricalDataCollection2021) + JSON.stringify(HistoricalDataCollection2022) + JSON.stringify(HistoricalDataCollection2023) + JSON.stringify(HistoricalDataCollection2024) + JSON.stringify(HistoricalDataCollection2025);
        return collection;
    }

    function toolbarClick(args: any) {
        if (args.item.text === 'Predictive scheduling') {
            ganttInstance.showSpinner();
            let input = `Analyze the historical data collection for project management in a Gantt Chart system. Based on the provided historical data, update the project schedule values for the given TaskDataCollection for the year 2026. 
    
          The output should be a JSON object with a key named 'TaskCollection', which contains the updated list of tasks. The response should not include any JSON tags, additional explanations, or extra content.
          
          Here are the details:
          - HistoricalDataCollections: ${GetHistoricalCollection()}
          - TaskDataCollection: ${JSON.stringify(HistoricalTaskData)}
          
          Return the updated TaskCollection in JSON format, with no additional text or explanations.`;
            let aioutput = getAzureChatAIRequest({ messages: [{ role: 'user', content: input }] });
            aioutput.then((result: any) => {
                let cleanedJsonData = result.replace(/^```json\n|```\n?$/g, '');
                let collection: any = JSON.parse(cleanedJsonData).TaskCollection;
                let currentData: any = ganttInstance.currentViewData;
                for (let i = 0; i < collection.length; i++) {
                    collection[i].BaselineStartDate = new Date(currentData[i].StartDate);
                    collection[i].BaselineEndDate = new Date(currentData[i].EndDate);
                }
                ganttInstance.dataSource = collection;
                ganttInstance.hideSpinner();
            });
        }
    }

    return (
        <div className='control-pane'>
            <div className='control-section'>
                <div className="description-container e-card">
                    <div className='e-card-content '>
                        <p>This sample predicts and generates a task schedule by analyzing five years of historical TaskCollection data along with the current year's data. The AI model forecasts future tasks and creates a predictive task collection. Know more <a href="https://github.com/syncfusion/smart-ai-samples/blob/master/react/src/ai-components/gantt/Readme.md">here</a>.</p>
                    </div>
                </div>
                <div id='container'>
                    <GanttComponent
                        id="GanttContainer"
                        ref={(gantt: GanttComponent) => ganttInstance = gantt as GanttComponent}
                        dataSource={HistoricalTaskData}
                        renderBaseline={true}
                        toolbar={toolbarOptions}
                        taskFields={taskFields}
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
                        toolbarClick={toolbarClick}
                        readOnly={false}
                        taskbarHeight={20}
                        rowHeight={40}
                        height='550px'
                        allowUnscheduledTasks={true}
                    >
                        <ColumnsDirective>
                            <ColumnDirective field='Id' headerText='Task ID' visible={false} />
                            <ColumnDirective field='Name' headerText='Event Name' width='250px' />
                            <ColumnDirective field='Duration' headerText='Duration' />
                            <ColumnDirective field='StartDate' headerText='Start Date' />
                            <ColumnDirective field='EndDate' headerText='End Date' />
                        </ColumnsDirective>
                        <Inject services={[Edit, Toolbar, Selection, CriticalPath, ContextMenu, Filter, Sort, Reorder, DayMarkers]} />
                    </GanttComponent>
                </div>
            </div>
        </div>
    )
}

export default TaskSchedule