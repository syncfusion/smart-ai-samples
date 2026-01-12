import { AIAssistivePivot } from './frontend/ai-assistive-pivot';

function AssistivePivot() {

    return (
        <div className='control-pane'>
            <div className='control-section'>
                <div className="description-container e-card">
                    <div className='e-card-content '>
                        <p>
                            This demo showcases the <strong>Syncfusion React Pivot Table</strong> enhanced with our <strong>Syncfusion React AI AssistView</strong>, allowing you to perform complex data operations using natural language. Streamline your workflow by asking the component to sort, filter, drill down, add calculated fields, or apply conditional formatting—bypassing traditional UI interactions for faster analysis.
                        </p>
                    </div>
                </div>
                <div id='container'>
                    <AIAssistivePivot/>
                </div>
            </div>
        </div>
    )
}

export default AssistivePivot;