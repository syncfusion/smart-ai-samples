# AI Syncfusion Samples Repository

This repository contains all AI-related Syncfusion samples organized in a separate repository. It includes various components and functionalities that leverage AI technologies to enhance Syncfusion components.

## Components and Dependencies

### Local Embeddings
The following samples use MSDN smart component's [local embeddings](https://www.nuget.org/packages/SmartComponents.LocalEmbeddings/0.1.0-preview10148) and do not require Azure OpenAI:
- **DataGrid (Semantic Filtering)**
- **ComboBox (Embeddings)**
- **FileManager (Tag Searching)**

### Stability AI
Image Editor AI samples rely on third party [Stability AI](https://stability.ai/) service.

### OpenAI Dependencies
All other component samples rely on OpenAI/Azure OpenAI services. Ensure you have the necessary API keys and configuration settings to run these samples.

## Configuration Instructions

### Configuring AI Service Credentials
To run AI samples, navigate to the `Program.cs` file and replace the following placeholders with your actual credentials:

```
string apiKey = "your-api-key";
string deploymentName = "your-deployment-name";
string endpoint = "your-azure-endpoint-url";
```

Your azure Endpoint would look something like this
`https://{resource_name}.openai.azure.com/`

## Configuring Image Editor AI
The Image Editor AI depends on a third-party AI service called Stability AI for AI Image processing. To use it, follow these steps:

- You may obtain your API key from [Stability AI](https://platform.stability.ai/account/keys).
- Navigate to `SmartImageEditor.razor` file under `Pages/ImageEditor` folder and replace the placeholder with actual API_KEY:

```cs
// Stability AI APIKEY
public string ApiKey = "your-api-key";

```

Once configured everything, hit `Run` and you're good to go!

## Project Documentation

This table provides an overview of all the AI Samples in this project, along with links to their respective README files for detailed documentation.

<table>
    <thead>
        <tr>
            <th>Section</th>
            <th>Component / Feature</th>
            <th>Description</th>
            <th>Documentation Link</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="2"><strong>Smart Paste Button</strong></td>
            <td>Smart Paste Functionality</td>
            <td>Automatically fills out forms using clipboard data, improving data entry efficiency.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/SmartPaste/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Custom Field Descriptions</td>
            <td>Uses the data-smartpaste-description attribute to improve Smart Paste accuracy by customizing field descriptions for better data population.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/SmartPaste/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>Smart TextArea</strong></td>
            <td>Sentence-Level Autocompletion</td>
            <td>Provides real-time sentence suggestions based on user input, enhancing typing efficiency with AI.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/SmartTextArea/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>ComboBox</strong></td>
            <td>Semantic Search</td>
            <td>Advanced search capabilities using context and meaning rather than exact keywords.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/ComboBox/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td rowspan="2"><strong>Data Grid</strong></td>
            <td>Semantic Filtering</td>
            <td>Filters data semantically.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/DataGrid/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Anomaly Detection</td>
            <td>Detects anomalies in datasets.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/DataGrid/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>Scheduler</strong></td>
            <td>Smart Scheduler</td>
            <td>Converts natural language text into scheduler events, adding them as structured appointments.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/Scheduler/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td rowspan="5"><strong>Gantt</strong></td>
            <td>Task Prioritize</td>
            <td>AI-based task prioritization tool.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/GanttChart/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Progress Predictor</td>
            <td>Predicts project progress and completion.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/GanttChart/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Resource Allocator</td>
            <td>Optimizes resource allocation.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/GanttChart/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Risk Assessor</td>
            <td>Assesses project risks using AI.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/GanttChart/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Predictive Scheduling</td>
            <td>AI-driven project scheduling.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/GanttChart/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>RichTextEditor</strong></td>
            <td>AI Integration</td>
            <td>Enhances text editing with features like content generation, summarization, rephrasing, translation, and grammar correction.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/RichTextEditor/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td rowspan="2"><strong>Kanban Board</strong></td>
            <td>AI Task Recommendation</td>
            <td>Recommends tasks based on AI analysis.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/Kanban/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Sentiment Analysis</td>
            <td>Analyzes customer feedback sentiments.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/Kanban/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>Image Editor</strong></td>
            <td>AI Image Editing</td>
            <td>Advanced image editing features including Magic Eraser, Background Changer, and Background Remover for enhanced creativity and precision.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/ImageEditor/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td rowspan="2"><strong>Diagram</strong></td>
            <td>TextToMindMap</td>
            <td>Creates dynamic mindmaps using AI-generated content.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/Diagram/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>TextToFlowChart</td>
            <td>Creates flowcharts based on AI-generated workflows.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/Diagram/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td rowspan="3"><strong>PDF Viewer</strong></td>
            <td>Document Summarization</td>
            <td>Summarizes documents using AI.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/PDFViewer/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Smart Redaction</td>
            <td>Redacts sensitive information intelligently.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/PDFViewer/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Smart Fill</td>
            <td>Automatically fills forms with AI.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/PDFViewer/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td rowspan="3"><strong>Document Editor</strong></td>
            <td>Document Summarization</td>
            <td>AI-driven summarization and Q&A for document content.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/DocumentEditor/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Smart Editor</td>
            <td>Enhances document editing with rewriting, grammar checking, and translation.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/DocumentEditor/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Writing Assist</td>
            <td>Generates new content based on user input and assists in expanding ideas.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/DocumentEditor/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>Maps</strong></td>
            <td>Weather Forecast</td>
            <td>Displays weather forecasts on a map.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/Maps/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td rowspan="2"><strong>File Manager</strong></td>
            <td>Smart File Manager</td>
            <td>AI-driven features like Smart Search, Content Summary, and Intelligent Organization.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/FileManager/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Tag Search</td>
            <td>AI Tagging and Tag Search capabilities for better file categorization and retrieval.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/FileManager/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>Pivot Table</strong></td>
            <td>AI Data Analysis</td>
            <td>AI integration for smart data aggregation, predictive modeling, adaptive filtering, and real-time interaction, enhancing data analysis and visualization.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/PivotTable/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>Query Builder</strong></td>
            <td>Natural Language Querying</td>
            <td>Allows users to build queries in plain language, with the system interpreting the intent and generating the appropriate query.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/QueryBuilder/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>TreeGrid</strong></td>
            <td>Hierarchical Data Structuring</td>
            <td>Uses AI to correct and organize hierarchical data in a Tree Grid, fixing parent-child relationships to ensure accurate data nesting.</td>
            <td><a href="SyncfusionAISamples/Components/Pages/TreeGrid/Readme.md">Read More</a></td>
        </tr>
    </tbody>
</table>
