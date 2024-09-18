# Syncfusion Angular AI Samples

This project is a comprehensive application showcasing [Essential JS 2](https://www.syncfusion.com/angular-components) Angular components integrated with AI features.

> This application utilizes the latest packages and requires Node.js version `v18.20.0` or higher.

## Getting Started

To get started, clone the `smart-ai-samples` repository and navigate to the `smart-ai-samples/angular` directory:

```
git clone https://github.com/syncfusion/smart-ai-samples.git
cd smart-ai-samples/angular
```

## Installation

All required packages are pre-configured in the `package.json` file. Install the dependencies by running:

```
npm install
```

## License Registration

Before using Syncfusion components, register your license key in the `main.ts` file of your Angular project:

```
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Replace your generated license key here');
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

```

For more details on license registration, refer to the [official documentation](https://ej2.syncfusion.com/angular/documentation/licensing/license-key-registration#register-syncfusion-license-key-in-the-project).

## Local Embeddings

The following samples use a [local embedding pre-trained model](https://huggingface.co/Supabase/gte-small) from Hugging Face and do not require Azure OpenAI. The transformers.js library from Hugging Face is utilized to run the model in a client-side application without the need for a server. To learn more about transformers, refer [here](https://huggingface.co/docs/transformers.js/installation).

* DataGrid (Semantic Filtering)
* ComboBox (Embeddings)

## Configuring AI Services

This project utilizes AI services to enhance component functionality. The Azure OpenAI service has been configured for this demo, but the Gemini model with the Vercel SDK can also be used.

To set up the AI services, navigate to `./src/app/ai-models/ai-models.ts` and replace the placeholders with your actual credentials:

```
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

### Image Editor AI Configuration

The Image Editor AI feature uses Stability AI for AI image processing. To set it up:

1. Obtain an API key from [Stability AI](https://platform.stability.ai/account/keys).
2. In `./src/app/ai-models/stability-model.ts`, replace the placeholder with your actual API key:

```
const apiKey = `Bearer YOUR_API_KEY`;
```

## Development Server

To run the application, use the following npm script:

```
npm run start
```

This command will start the application and open it in your default web browser.

## Additional Resources

For more information about Essential JS 2 Angular components, refer to these resources:

* [Angular Demos](https://ej2.syncfusion.com/angular/demos)
* [Angular Documentation](https://ej2.syncfusion.com/angular/documentation/introduction/)

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
            <td><a href="src/app/smart-paste/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>Smart TextArea</strong></td>
            <td>Sentence-Level Autocompletion</td>
            <td>Provides real-time sentence suggestions based on user input, enhancing typing efficiency with AI.</td>
            <td><a href="src/app/smart-text-area/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>ComboBox</strong></td>
            <td>Semantic Search</td>
            <td>Advanced search capabilities using context and meaning rather than exact keywords.</td>
            <td><a href="src/app/combo-box/Readme.md">Read More</a></td>
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
            <td><a href="src/app/rich-text-editor/Readme.md">Read More</a></td>
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
            <td><strong>Document Editor</strong></td>
            <td>Smart Editor</td>
            <td>Enhances document editing with rewriting, grammar checking, and translation.</td>
            <td><a href="src/ai-components/document-editor/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td><strong>Maps</strong></td>
            <td>Weather Forecast</td>
            <td>Displays weather forecasts on a map.</td>
            <td><a href="src/app/maps/Readme.md">Read More</a></td>
        </tr>
        <tr>
            <td ><strong>File Manager</strong></td>
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