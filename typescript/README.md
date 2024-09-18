# JavaScript AI QuickStart

This project is a skeleton application used to create [Essential JS 2](https://www.syncfusion.com/products/essential-js2) web application with AI features.

>This application uses the latest version of the [webpack-cli](https://webpack.js.org/api/cli/#commands). It requires node `v18.17.0`.

## Getting Started

To get started you need to clone the `smart-ai-samples` repository and navigate to `smart-ai-samples/typescript` location.

```
git clone https://github.com/syncfusion/smart-ai-samples.git

cd smart-ai-samples/typescript
```

## Installing

We can get all the Essential JS 2 components in a single npm package [`ej2`](https://www.npmjs.com/package/@syncfusion/ej2).

We already configure the required packages in the `package.json` file.

You can run the below command to install all dependent packages related to this seed project.

```
npm install
```

## Sample Configuration


### License Registration

Before using Syncfusion components, you need to register your license. Follow these steps:

1. Create a text file named [`syncfusion-license.txt`](./syncfusion-license.txt) in the root folder of your project.
2. Add your Syncfusion license key to this file.

3. Run the following command to register your Syncfusion license:

```
npx syncfusion-license activate

```
Refer to the [documentation](https://ej2.syncfusion.com/documentation/licensing/license-key-registration#register-the-license-key-with-the-license-file) for further information on license registration.

### Local Embeddings

The following samples use a [local embedding pre-trained model](https://huggingface.co/Supabase/gte-small) from Hugging Face and do not require Azure OpenAI. The transformers.js library from Hugging Face is utilized to run the model in a client-side application without the need for a server. To learn more about transformers, refer [here](https://huggingface.co/docs/transformers.js/installation).

* DataGrid (Semantic Filtering)
* ComboBox (Embeddings)

###  Configuring AI Service Credentials

This project utilizes AI services to enhance component functionality. The Azure OpenAI service has been configured for this demo, but the Gemini model with the Vercel SDK can also be used.

To set up the AI services, navigate to `./src/app/ai-models.ts` and replace the placeholders with your actual credentials:

```
// for Azure Open AI service
const azure = createAzure({
    resourceName: 'YOUR_RESOURCE_NAME',
    apiKey: 'YOUR_API_KEY',
});
const aiModel = azure('YOUR_MODEL_NAME');
// for gemini model
const google = createGoogleGenerativeAI({
    baseURL: "https://generativelanguage.googleapis.com/v1beta",
    apiKey: "API_KEY"
});
const aiModel = google('YOUR_MODEL_NAME');
```

Your Azure endpoint should resemble: `https://{resource_name}.openai.azure.com/`

For more information on Azure OpenAI configuration, consult the [Vercel AI SDK documentation](https://sdk.vercel.ai/providers/ai-sdk-providers/azure).

#### Configuring Image Editor AI

The Image Editor AI depends on a third-party AI service called Stability AI for AI Image processing. To use it, follow these steps:

- You may obtain your API key from [Stability AI](https://platform.stability.ai/account/keys).
- Navigate to `./src/app/stability-ai-model.ts` and replace the placeholder with actual API_KEY:

```
const apiKey= `Bearer YOUR_API_KEY`;
```

```cs
// Stability AI APIKEY
public string ApiKey = "your-api-key";

```
## Development server

To run the application, you can use the following npm script:

```
npm run start
```

This will start the application and serve it in your default browser.

## Resources

You can also refer the below resources to know more details about Essential JS 2 components.

* [Pure JS Demos](http://ej2.syncfusion.com/demos/)
* [Pure JS Documentation](http://ej2.syncfusion.com/documentation/)

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
            <td><strong>Smart Paste Button</strong></td>
            <td>Smart Paste Functionality</td>
            <td>Automatically fills out forms using clipboard data, improving data entry efficiency.</td>
            <td><a href="src/app/smartpaste/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>Smart TextArea</strong></td>
            <td>Sentence-Level Autocompletion</td>
            <td>Provides real-time sentence suggestions based on user input, enhancing typing efficiency with AI.</td>
            <td><a href="src/app/smarttextarea/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>ComboBox</strong></td>
            <td>Semantic Search</td>
            <td>Advanced search capabilities using context and meaning rather than exact keywords.</td>
            <td><a href="src/app/combobox/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td rowspan="3"><strong>Data Grid</strong></td>
            <td>Semantic Filtering</td>
            <td>Filters data semantically.</td>
            <td><a href="src/app/grid/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Predictive Data Entry</td>
            <td>Detects anomalies in datasets.</td>
            <td><a href="src/app/grid/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Anomaly Detection</td>
            <td>Detects anomalies in datasets.</td>
            <td><a href="src/app/grid/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>Scheduler</strong></td>
            <td>Smart Paste Integration</td>
            <td>Converts natural language text into scheduler events, adding them as structured appointments.</td>
            <td><a href="src/app/scheduler/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td rowspan="5"><strong>Gantt</strong></td>
            <td>Task Prioritize</td>
            <td>AI-based task prioritization tool.</td>
            <td><a href="src/app/gantt/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Progress Predictor</td>
            <td>Predicts project progress and completion.</td>
            <td><a href="src/app/gantt/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Resource Allocator</td>
            <td>Optimizes resource allocation.</td>
            <td><a href="src/app/gantt/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Risk Assessor</td>
            <td>Assesses project risks using AI.</td>
            <td><a href="src/app/gantt/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Predictive Scheduling</td>
            <td>AI-driven project scheduling.</td>
            <td><a href="src/app/gantt/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>RichTextEditor</strong></td>
            <td>AI Integration</td>
            <td>Enhances text editing with features like content generation, summarization, rephrasing, translation, and grammar correction.</td>
            <td><a href="src/app/richtexteditor/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td rowspan="2"><strong>Kanban Board</strong></td>
            <td>AI Task Recommendation</td>
            <td>Recommends tasks based on AI analysis.</td>
            <td><a href="src/app/kanban/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Sentiment Analysis</td>
            <td>Analyzes customer feedback sentiments.</td>
            <td><a href="src/app/kanban/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>Image Editor</strong></td>
            <td>AI Image Editing</td>
            <td>Advanced image editing features including Magic Eraser, Background Changer, and Background Remover for enhanced creativity and precision.</td>
            <td><a href="src/app/image-editor/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td rowspan="2"><strong>Diagram</strong></td>
            <td>TextToMindMap</td>
            <td>Creates dynamic mindmaps using AI-generated content.</td>
            <td><a href="src/app/diagram/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>TextToFlowChart</td>
            <td>Creates flowcharts based on AI-generated workflows.</td>
            <td><a href="src/app/diagram/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td rowspan="3"><strong>PDF Viewer</strong></td>
            <td>Document Summarization</td>
            <td>Summarizes documents using AI.</td>
            <td><a href="src/app/pdfviewer/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Smart Redaction</td>
            <td>Redacts sensitive information intelligently.</td>
            <td><a href="src/app/pdfviewer/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Smart Fill</td>
            <td>Automatically fills forms with AI.</td>
            <td><a href="src/app/pdfviewer/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td rowspan="3"><strong>Document Editor</strong></td>
            <td>Document Summarization</td>
            <td>AI-driven summarization and Q&A for document content.</td>
            <td><a href="src/app/document-editor/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Smart Editor</td>
            <td>Enhances document editing with rewriting, grammar checking, and translation.</td>
            <td><a href="src/app/document-editor/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td>Writing Assist</td>
            <td>Generates new content based on user input and assists in expanding ideas.</td>
            <td><a href="src/app/document-editor/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>Maps</strong></td>
            <td>Weather Forecast</td>
            <td>Displays weather forecasts on a map.</td>
            <td><a href="src/app/maps/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td rowspan="2"><strong>File Manager</strong></td>
            <td>Smart File Manager</td>
            <td>AI-driven features like Smart Search, Content Summary, and Intelligent Organization.</td>
            <td><a href="src/app/filemanager/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>Pivot Table</strong></td>
            <td>AI Data Analysis</td>
            <td>AI integration for smart data aggregation, predictive modeling, adaptive filtering, and real-time interaction, enhancing data analysis and visualization.</td>
            <td><a href="src/app/pivot-table/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>Query Builder</strong></td>
            <td>Natural Language Querying</td>
            <td>Allows users to build queries in plain language, with the system interpreting the intent and generating the appropriate query.</td>
            <td><a href="src/app/query-builder/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>TreeGrid</strong></td>
            <td>Hierarchical Data Structuring</td>
            <td>Uses AI to correct and organize hierarchical data in a Tree Grid, fixing parent-child relationships to ensure accurate data nesting.</td>
            <td><a href="src/app/treegrid/Readme.md">Read More</a></td>
        </tr>
    </tbody>
</table>
