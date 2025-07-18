using SyncfusionAIWasmExamples.Models;

namespace SyncfusionAIWasmExamples.Layout
{
    public partial class NavMenu
    {
        public List<MenuItem> sampleList = new List<MenuItem>
    {
        new MenuItem
        {
            Text = "Rich Text Editor",
            Href = "/"
        },
        new MenuItem
        {
            Text = "Pivot Table",
            Href = "pivot/smart-pivot"
        },
        new MenuItem
        {
            Text = "Tree Grid",
            Href = "tree-grid/adaptive-datastructuring"
        },
        new MenuItem
        {
            Text = "Query Builder",
            Href = "querybuilder/nlq"
        },
        new MenuItem
        {
            Text = "Maps",
            Href = "maps/weather-prediction"
        },
        new MenuItem
        {
            Text = "Diagram",
            SubMenu = new List<MenuItem>
            {
                new MenuItem { Text = "Smart MindMap", Href = "diagram/mindmap" },
                new MenuItem { Text = "Smart FlowChart", Href = "diagram/flowchart" }
            }
        },
        new MenuItem
        {
            Text = "PDF Viewer",
            SubMenu = new List<MenuItem>
            {
                new MenuItem { Text = "Smart Fill", Href = "pdfviewer/smart-fill" },
                new MenuItem { Text = "Smart Redact", Href = "pdfviewer/smart-redact" },
                new MenuItem { Text = "Smart Summarizer", Href = "pdfviewer/summarizer" },
            }
        },
        new MenuItem
        {
            Text = "Document Editor",
            SubMenu = new List<MenuItem>
            {
                new MenuItem { Text = "Smart Summarizer", Href = "document-editor/smart-summarizer" },
                new MenuItem { Text = "Smart Editor", Href = "document-editor/smart-editor" },
                new MenuItem { Text = "Smart Writer", Href = "document-editor/smart-writer" },
            }
        },
        new MenuItem
        {
            Text = "Kanban",
            SubMenu = new List<MenuItem>
            {
                new MenuItem { Text = "Smart Recommendation", Href = "kanban/smart-recommendation" },
                new MenuItem { Text = "Sentiment Analysis", Href = "kanban/sentiment-analysis" }
            }
        },
        new MenuItem
        {
            Text = "Grid",
            SubMenu = new List<MenuItem>
            {
                //new MenuItem { Text = "Semantic Filtering", Href = "grid/semantic-filtering" },
                new MenuItem { Text = "Anomaly Detection", Href = "grid/anomaly-detection" }
            }
        },
        new MenuItem
        {
            Text = "Gantt Chart",
            SubMenu = new List<MenuItem>
            {
                new MenuItem { Text = "Smart Task Prioritizer", Href = "gantt-chart/task-prioritizer" },
                new MenuItem { Text = "Smart Progress Predictor", Href = "gantt-chart/progress-predictor" },
                new MenuItem { Text = "Smart Resource Allocation", Href = "gantt-chart/resource-manager" },
                new MenuItem { Text = "Smart Risk Assessor", Href = "gantt-chart/risk-assessor" },
                new MenuItem { Text = "Smart Scheduling", Href = "gantt-chart/predictive-schedule" }
            }
        },
        new MenuItem
        {
            Text = "Image Editor",
            Href = "image-editor/smart-imageeditor"
        }
    };
    }
}
