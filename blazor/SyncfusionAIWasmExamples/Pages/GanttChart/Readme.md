# Syncfusion Blazor GanttChart - AI Samples

# Task Prioritize - AI-Powered Task Management

## Overview

This sample demonstrates how AI can prioritize tasks within a collection, evaluating baseline dates and scheduled taskbar dates to identify critical tasks essential for meeting project deadlines. It then reallocates resources to these critical tasks to ensure efficient resource management and timely project completion.

## Features

- **Critical Task Identification**: AI evaluates task schedules to identify critical tasks.
- **Resource Reallocation**: AI reallocates resources to critical tasks for efficient management.
- **Reallocation Summary**: Provides a summary of resource reallocation and critical task details.

## How It Works

The AI identifies critical tasks based on the project schedule. Following this, the AI generates another prompt to reassign resources and provides a summary of the reallocation and critical task details.

# Progress Predictor - AI-Driven Milestone Forecasting

## Overview

This sample showcases AI-driven analysis to predict milestone task completion and project end dates within a Gantt Chart. Predictions are displayed as event markers, providing visual cues for upcoming milestones and the overall project timeline.

## Features

- **Milestone Prediction**: AI predicts milestone task completion and project end dates.
- **Event Markers**: Predictions are displayed as markers on the Gantt Chart.
- **Historical Data Analysis**: Uses current year and historical data from the past five years.

## How It Works

The functionality retrieves predicted milestone dates and project completion dates based on current and historical TaskCollection data. Predictions are displayed on the Gantt Chart as event markers, helping users visualize project timelines and adjust as needed.

# Resource Allocator - Efficient Resource Management

## Overview

This sample demonstrates efficient resource management by reallocating resources to prevent overallocation. The Gantt Chart visually updates to reflect reallocated tasks, improving tracking and management of resource usage.

## Features

- **Task Reallocation**: Reallocates tasks to prevent resource overallocation.
- **Visual Updates**: Changes taskbar colors in the Gantt Chart to reflect reallocated tasks.
- **Balanced Utilization**: Ensures no single resource is overburdened.

## How It Works

The sample reallocates tasks to address resource overallocation by interacting with the TaskCollection, ResourceCollection, and AssignmentCollection. It generates a new assignment collection to resolve overallocated tasks and updates taskbar colors to indicate changes, providing clear visual feedback on resource adjustments.

# Risk Assessor - Task Risk Identification

## Overview

This sample demonstrates identifying tasks at risk based on their duration and dependencies within the Blazor Gantt Chart. Critical tasks are highlighted by dynamically changing their taskbar colors, making potential risks in the project timeline easily visible.

## Features

- **Risk Identification**: Analyzes task duration and dependencies to identify risks.
- **Dynamic Highlighting**: Applies distinctive colors to taskbars for at-risk tasks.

## How It Works

The action identifies at-risk tasks by analyzing their duration and dependencies, then highlights these tasks with distinctive colors on their taskbars. This visual representation helps users quickly identify potential risks in their project timeline.

# Predictive Scheduling - AI-Driven Task Forecasting

## Overview

This sample demonstrates the predictive scheduling feature in the Syncfusion Blazor Gantt Chart. AI is used to forecast and schedule tasks based on historical data. The Gantt Chart displays taskbars with baselines for both predicted and actual task timelines.

## Features

- **Historical Data Analysis**: Uses five years of historical data alongside current year's tasks.
- **Predictive Task Collection**: Generates a task schedule based on AI forecasts.
- **Baseline Visualization**: Displays predicted and actual task timelines on the Gantt Chart.

## How It Works

The AI model analyzes five years of historical TaskCollection data along with current tasks to generate a predictive task schedule. The Gantt Chart visualizes this schedule with baselines indicating predicted start and end dates, allowing users to compare projected schedules with actual progress.
