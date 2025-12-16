import { AssistiveGrid } from "./frontend/assistive-grid";

function AIAssistiveGrid() {

    return (
        <div className='control-pane'>
            <div className='control-section'>
                <div className="description-container e-card">
                    <div className='e-card-content '>
                        <p>
                            This demo showcases the <b>Syncfusion React DataGrid component</b>, enhanced with conversational capabilities through the integrated Syncfusion React AI AssistView component. 
                    Grid data operations, such as sorting, filtering, and grouping, can be performed using natural language input, offering a streamlined alternative to traditional UI interactions. Know more <a href="https://github.com/syncfusion/smart-ai-samples/blob/master/react/src/ai-components/grid/Readme.md">here</a>.
                        </p>
                    </div>
                </div>
                <div id='container'>
                    <AssistiveGrid/>
                </div>
            </div>
        </div>
    )
}

export default AIAssistiveGrid;