# Data Preprocessing Chart

## Sample Description

This demo highlights the **Data Preprocessing** feature using Syncfusion React Charts.  
It demonstrates how raw datasets containing missing or inconsistent values can be automatically cleaned and visualized.  
With a single click on the **AI Assist** button, missing values are filled, anomalies are corrected, and the updated dataset is instantly reflected in the chart.  

This approach allows you to gain accurate insights from incomplete datasets and enhances the clarity of e-commerce website traffic analytics.

![Data Preprocessing Chart GIF](../gif-images/chart/data-preprocessing.gif)

## Action Description

- Click **AI Assist** to process the chart data automatically.  
- Missing or null values are detected and replaced with calculated values.  
- Points that were previously null are highlighted in red for visibility.  
- The chart updates dynamically to reflect the processed data.  

This feature enables users to quickly clean and visualize datasets without manual intervention, making analytics more efficient and reliable.

## Usage

Import and use the component in your project:

```tsx
import DataPreprocessingChart from './data-preprocessing-chart';

function App() {
  return <DataPreprocessingChart />;
}
