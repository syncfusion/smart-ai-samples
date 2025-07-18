# Syncfusion Blazor DataGrid - Semantic Filtering

## Overview

This sample demonstrates how the **Syncfusion DataGrid**, integrated with AI, supports **Semantic Search** to enhance the user experience.

### Semantic Search

In this example, the DataGrid displays diagnostic information from medical reports. With **Semantic Search**, users don’t need to enter the exact word to find relevant information. For instance, if the DataGrid lists "Abdominal pain," users can still find relevant reports by searching for terms like "stomach." The grid dynamically displays related search results using localembeddings, improving search accuracy and relevance.

## Features

- **Contextual Search**: Search queries are understood by context, not just exact keywords.
- **AI-Powered**: Uses localembeddings to find relevant data, even with different terminology.

## How It Works

By leveraging **Semantic Search**, the DataGrid uses localembeddings to interpret search queries, providing results based on meaning rather than exact keyword matches. 

# Syncfusion Blazor DataGrid - Anomaly Detection

## Overview

This sample demonstrates how the **Syncfusion DataGrid**, enhanced with AI, can detect anomalies within its data, offering valuable insights.

### Anomaly Detection

In this example, the DataGrid displays various metrics such as Machine ID, Voltage, Pressure, Temperature, Motor Speed, and Production Rate. AI analyzes the data to identify unusual points and explains why they are considered anomalies. When the "Detect Anomaly" button is pressed, the grid updates to show the anomaly details, providing insights into data irregularities.

## Features

- **AI-Driven Insights**: Detects anomalies by analyzing data points through AI.
- **Dynamic Anomaly Detection**: Updates in real-time when the "Detect Anomaly" button is pressed.

## How It Works

The DataGrid uses AI to analyze incoming data for anomalies based on various parameters. Upon clicking "Detect Anomaly," the grid highlights these irregularities, offering detailed insights and explanations for why certain data points are flagged as anomalies.
