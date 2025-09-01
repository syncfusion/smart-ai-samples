# Syncfusion Blazor Chart - AI Samples

# Chart Component - Stock Forecasting

## Overview

This demo showcases how AI can be integrated with the **Blazor Chart Component** to create a dynamic **Stock Forecasting Chart**. The chart visualizes historical stock data and forecasts future trends using AI-generated predictions. It's a powerful tool for analyzing market behavior, identifying potential investment opportunities, and making data-driven decisions.

## Features

- **AI-Powered Forecasting**: Predicts future stock values using historical data and AI models.
- **Dynamic Visualization**: Displays both historical and forecasted data in a single chart for easy comparison.
- **Interactive Chart Updates**: Users can trigger AI forecasting via the "AI Assist" button, which dynamically updates the chart with new data.
- **Multi-Company Support**: Visualizes stock data from various companies, enabling comparative analysis.

## How It Works

This sample uses a specialized AI prompt to forecast future stock values based on historical trends. When the user clicks the AI Assist button, a request is sent to OpenAI, which returns predicted data points. These values are then dynamically added to the chart, allowing users to visualize potential future trends alongside existing data. This interactive experience helps users explore forecasting capabilities directly in the browser, with the option to experiment locally using their own API key via the Syncfusion Smart AI Samples.

# Chart Component - Data Preprocessing

## Overview

This demo showcases how AI can be integrated with the **Blazor Chart Component** to create a dynamic **Data Preprocessing Chart**. The chart visualizes cleaned and transformed data, ensuring accurate representation by handling missing values and inconsistencies. It's a powerful tool for preparing raw datasets for meaningful analysis and visualization.

## Features

- **AI-Powered Preprocessing**: Cleans and transforms raw data, including handling missing values.
- **Accurate Visualization**: Ensures charts are rendered with complete and reliable datasets.
- **Interactive Chart Updates**: Users can trigger preprocessing via the "AI Assist" button, which updates the chart with cleaned data.
- **Real-Time Data Correction**: Automatically fills in missing values to provide a seamless and complete chart view.

## How It Works

This sample uses a specialized AI prompt to preprocess a dataset containing missing values. When the user clicks the AI Assist button, a request is sent to OpenAI, which returns a cleaned version of the dataset. The updated data is then dynamically assigned to the chart, removing any gaps and ensuring a complete and accurate visualization. Users can explore this functionality directly in the browser with limited AI token usage, or experiment locally using their own API key via the Syncfusion Smart AI Samples.

# Chart Component - Smart Chart

## Overview

This demo showcases how AI can be integrated with the **Blazor Chart Component** to create a dynamic **Smart Chart**. The chart is generated directly from natural language prompts, allowing users to describe the data they want to visualize. It's a powerful tool for simplifying chart creation and enhancing user interaction through intuitive, AI-driven input.

## Features

- **Natural Language to Chart**: Converts user prompts into structured data for chart rendering.
- **Multi-Chart Support**: Supports various chart types including Line, Column, Spline, Area, Pie, and Donut.
- **Flexible Axis Types**: Handles Category, Numeric, DateTime, and Logarithmic axes.
- **Interactive Prompt Input**: Users enter prompts in the AI AssistView component to generate charts dynamically.

## How It Works

This sample uses a specialized AI prompt to interpret natural language input provided in the AI AssistView component. The AI processes the prompt and returns structured data, which is then visualized using the Syncfusion Blazor Chart Component. Users can explore different chart types and axis configurations by simply changing the input prompt. This functionality is available directly in the browser with limited AI token usage, and can also be explored locally using a personal API key via the Syncfusion Smart AI Samples on GitHub.
