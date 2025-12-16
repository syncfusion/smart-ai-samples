import { TreeViewComponent } from '@syncfusion/ej2-react-navigations';
import { enableRipple } from '@syncfusion/ej2-base';
import { useEffect } from 'react';
enableRipple(true);

function LeftPane() {
    useEffect(() => {
        let sampleHeader: HTMLElement = document.querySelector('.header-text') as HTMLElement;
        const currentHash = window.location.hash;
        const currentSample: HTMLAnchorElement = document.querySelector(`a[href="${currentHash}"]`) as HTMLAnchorElement;
        if (currentSample) {
            const sampleName = currentSample.innerText;
            sampleHeader.innerHTML = sampleName;
        }
    }, []);
    let treeviewInstance: TreeViewComponent;

    const data = [
        {
            "id": 1, "name": "Smart Paste", "headerText": "Smart Paste Button", 'navigateUrl': '#/smart-paste'
        },
        {
            "id": 2, "name": "Smart TextArea", 'navigateUrl': '#/smart-textarea'
        },
        {
            "id": 8, "name": "ComboBox", "headerText": "Semantic search", 'navigateUrl': '#/combobox-semantic-search'
        },
        {
            "id": 22, "name": "Scheduler", "headerText": "Smart Scheduler", 'navigateUrl': '#/smart-scheduler'
        },
        {
            "id": 37, "name": "Rich Text Editor", "headerText": "Smart Rich Text Editor", 'navigateUrl': '#/rich-text-editor'
        },
        {
            "id": 28, "name": "Pivot Table", "headerText": "Smart Pivot Table", 'navigateUrl': '#/smart-pivot-table'
        },
        {
            "id": 10, "name": "Tree Grid", "headerText": "Data Restructuring", 'navigateUrl': '#/adaptive-data-structuring'
        },
        {
            "id": 35, "name": "Image Editor", "headerText": "Smart Image Editor", 'navigateUrl': '#/image-editor'
        },
        {
            "id": 12, "name": "Query Builder", "headerText": "NL Querying", 'navigateUrl': '#/nl-querying'
        },
        {
            "id": 20, "name": "Maps", "headerText": "Weather Prediction", 'navigateUrl': '#/weather-prediction'
        },
        {
            "id": 24, "name": "File Manager", "headerText": "Smart FileManager", 'navigateUrl': '#/smart-filemanager'
        },
        {
            "id": 26, "name": "Spreadsheet", "headerText": "Smart Spreadsheet", 'navigateUrl': '#/smart-spreadsheet'
        },
        {
            "id": 33, "name": "Diagram", expanded: true,
            "child": [
                { "id": 34, "name": "Smart Flowchart", 'navigateUrl': '#/smart-flowchart' },
                { "id": 46, "name": "Smart Mind Map", 'navigateUrl': '#/smart-mindmap' },
                { "id": 47, "name": "Smart Uml Sequence", 'navigateUrl': '#/smart-umlSequenceDiagram' },
            ]
        },
        {
            "id": 30, "name": "Document Editor", expanded: true,
            "child": [
                { "id": 31, "name": "Smart Editor", 'navigateUrl': '#/smart-editor' },
                { "id": 32, "name": "Smart Writer", 'navigateUrl': '#/writing-assist' }
            ]
        },
        {
            "id": 42, "name": "PDF Viewer", expanded: true,
            "child": [
                { "id": 43, "name": "Smart Fill", 'navigateUrl': '#/smart-fill' },
                { "id": 44, "name": "Smart Redact", 'navigateUrl': '#/smart-redact' },
                { "id": 45, "name": "Summarizer", 'navigateUrl': '#/summarizer' }
            ]
        },
        {
            "id": 39, "name": "Kanban", expanded: true,
            "child": [
                { "id": 40, "name": "Smart Recommendation", 'navigateUrl': '#/smart-recommendation' },
                { "id": 41, "name": "Sentiment Analysis", 'navigateUrl': '#/sentiment-analysis' }
            ]
        },
        {
            "id": 3, "name": "Data Grid", expanded: true,
            "child": [
                {"id": 4, "name": "Assistive Grid", 'navigateUrl': '#/ai-assistive-grid'},
                { "id": 5, "name": "Semantic search", 'navigateUrl': '#/semantic-search' },
                { "id": 6, "name": "Predictive Data Entry", 'navigateUrl': '#/predictive-data' },
                { "id": 7, "name": "Anamoly Detection", 'navigateUrl': '#/anamoly-detection' },
                { "id": 8, "name": "Data Trend Analysis", 'navigateUrl': '#/data-trend' }
            ]
        },
        {
            "id": 14, "name": "Gantt", expanded: true,
            "child": [
                { "id": 15, "name": "Smart Task Prioritizer", 'navigateUrl': '#/prioritize-task' },
                { "id": 16, "name": "Smart Progress Predictor", 'navigateUrl': '#/progress' },
                { "id": 17, "name": "Smart Resource Allocation", 'navigateUrl': '#/resource-optimization' },
                { "id": 18, "name": "Smart Risk Assessor", 'navigateUrl': '#/risk-analysis' },
                { "id": 19, "name": "Smart Scheduling", 'navigateUrl': '#/task-schedule' }
            ]
        }
    ];
    const fields: Object = {
        dataSource: data, id: 'id', text: 'name',
        child: 'child', navigateUrl: 'navigateUrl'
    };

    function onClicked(args: any) {
        const sampleList: any = treeviewInstance.getTreeData(args.node.getAttribute('data-uid'))[0]
        const demoName: string = sampleList.headerText || sampleList.name
        if (!args.node.querySelector('.e-icon-wrapper')) {
            document.querySelector('.header-text')!.innerHTML = demoName;
        }
    }

    return (
        <div>
            <TreeViewComponent id='home-left-pane' ref={treeview => treeviewInstance = treeview as TreeViewComponent}
                fields={fields} fullRowSelect={true} nodeClicked={onClicked} />
        </div>
    );
}

export default LeftPane;