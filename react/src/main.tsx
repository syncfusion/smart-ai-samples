import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
// Smart Components
import SmartPaste from './ai-components/smartpaste/smart-paste.tsx'
import SmartTextArea from './ai-components/smarttextarea/smart-textarea.tsx'
// DataGrid
import SemanticSearch from './ai-components/grid/semantic-search/semantic-search.tsx'
import PredictiveDataEntry from './ai-components/grid/predictive-data/predictive-data.tsx'
import AnamolyDetection from './ai-components/grid/anomaly-detection/anomaly-detection.tsx'
import AssistiveGrid from './ai-components/grid/assistive-grid/assistive-grid.tsx'
import DataTrendAnalysis from './ai-components/grid/data-trend-analysis/data-trend-analysis.tsx'
// ComboBox
import ComboBoxSemanticSearch from './ai-components/combobox/semantic-search.tsx'
// Tree Grid
import AdaptiveDataStructuring from './ai-components/treegrid/adaptive-data-structuring.tsx'
// Query Builder
import NLQuerying from './ai-components/query-builder/nl-querying.tsx'
// Gantt
import PrioritizeTask from './ai-components/gantt/prioritize-task/prioritize-task.tsx'
import Progress from './ai-components/gantt/progress/progress.tsx'
import ResourceOptimization from './ai-components/gantt/resource-optimization/resource-optimization.tsx'
import RiskAnalysis from './ai-components/gantt/risk-analysis/risk-analysis.tsx'
import TaskSchedule from './ai-components/gantt/task-schedule/task-schedule.tsx'
// Maps
import WeatherPrediction from './ai-components/maps/weather-prediction.tsx'
// Scheduler
import SmartScheduler from './ai-components/scheduler/smart-scheduler.tsx'
// FileManager
import SmartFileManager from './ai-components/filemanager/smart-filemanager.tsx'
// SpreadSheet
import SmartSpreadSheet from './ai-components/spreadsheet/smart-spreadsheet.tsx'
// Pivot Table
import SmartPivotTable from './ai-components/pivot-table/smart-pivot-table.tsx'
// Document Editor
import SmartEditor from './ai-components/document-editor/smart-editor/smart-editor.tsx'
import WritingAssist from './ai-components/document-editor/writing-assist/writing-assist.tsx'
// Diagram
import SmartMindMap from './ai-components/diagram/smart-mindmap/smart-mindmap.tsx'
import SmartFlowchart from './ai-components/diagram/smart-flowchart/smart-flowchart.tsx'
import SmartUmlSequenceDiagram from './ai-components/diagram/smart-umlSequenceDiagram/smart-umlSequenceDiagram.tsx'
// ImageEditor
import ImageEditor from './ai-components/image-editor/image-editor.tsx'
// RichTextEditor
import SmartRichTextEditor from './ai-components/rich-text-editor/rich-text-editor.tsx'
// Kanban
import SmartRecommendation from './ai-components/kanban/smart-recommendation/smart-recommendation.tsx'
import SentimentAnalysis from './ai-components/kanban/sentiment-analysis/sentiment-analysis.tsx'
// PDF Viewer
import SmartFill from './ai-components/pdfviewer/smartfill/smartfill.tsx'
import SmartRedact from './ai-components/pdfviewer/smartredact/smartredact.tsx'
import Summarizer from './ai-components/pdfviewer/summarizer/summarizer.tsx'
import './index.css'

const routerEle = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Smart Components */}
      <Route path="smart-paste" element={<SmartPaste />} />
      <Route path="smart-textarea" element={<SmartTextArea />} />
      <Route path="/" element={<SmartPaste />} />
      {/* DataGrid */}
      <Route path="semantic-search" element={<SemanticSearch />} />
      <Route path="predictive-data" element={<PredictiveDataEntry />} />
      <Route path="anamoly-detection" element={<AnamolyDetection />} />
      <Route path="assistive-grid" element={<AssistiveGrid />} />
      <Route path="data-trend" element={<DataTrendAnalysis />} />
      {/* ComboBox */}
      <Route path="combobox-semantic-search" element={<ComboBoxSemanticSearch />} />
      {/* Tree Grid */}
      <Route path="adaptive-data-structuring" element={<AdaptiveDataStructuring />} />
      {/* Query BUilder */}
      <Route path="nl-querying" element={<NLQuerying />} />
      {/* Gantt */}
      <Route path="prioritize-task" element={<PrioritizeTask />} />
      <Route path="progress" element={<Progress />} />
      <Route path="resource-optimization" element={<ResourceOptimization />} />
      <Route path="risk-analysis" element={<RiskAnalysis />} />
      <Route path="task-schedule" element={<TaskSchedule />} />
      {/* Maps */}
      <Route path="weather-prediction" element={<WeatherPrediction />} />
      {/* Scheduler */}
      <Route path="smart-scheduler" element={<SmartScheduler />} />
      {/* FileManager */}
      <Route path="smart-filemanager" element={<SmartFileManager />} />
      {/* Spreadsheet */}
      <Route path="smart-spreadsheet" element={<SmartSpreadSheet />} />
      {/* Pivot Table */}
      <Route path="smart-pivot-table" element={<SmartPivotTable />} />
      {/* Document Editor */}
      <Route path="smart-editor" element={<SmartEditor />} />
      <Route path="writing-assist" element={<WritingAssist />} />
      {/* Diagram */}
      <Route path="smart-flowchart" element={<SmartFlowchart />} />
      <Route path="smart-mindmap" element={<SmartMindMap />} />
       <Route path="smart-umlSequenceDiagram" element={<SmartUmlSequenceDiagram />} />
      {/* Image Editor */}
      <Route path="image-editor" element={<ImageEditor />} />
      {/* RichTextEditor */}
      <Route path="rich-text-editor" element={<SmartRichTextEditor />} />
      {/* Kanban */}
      <Route path="smart-recommendation" element={<SmartRecommendation />} />
      <Route path="sentiment-analysis" element={<SentimentAnalysis />} />
      {/* PDF Viewer */}
      <Route path="smart-fill" element={<SmartFill />} />
      <Route path="smart-redact" element={<SmartRedact />} />
      <Route path="summarizer" element={<Summarizer />} />
    </Route>
  ));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={routerEle} />
  </StrictMode>
)