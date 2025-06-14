import { Diagram } from "@syncfusion/ej2/diagrams";
import { getAzureChatAIRequest } from '../../ai-models';
import { hideSpinner, showSpinner } from "@syncfusion/ej2/popups";

export async function convertTextToFlowchart(inputText: string, diagram: Diagram) {
    showLoading();
    const options = {
        messages: [
            {
                role: 'system',
                content: 'You are an assistant tasked with generating mermaid flow chart diagram data sources based on user queries'
            },
            {
                role: 'user',
                content: `
              Generate only the Mermaid flowchart code for the process titled "${inputText}".
              Use the format provided in the example below, but adjust the steps, conditions, and styles according to the new title:
              
              **Example Title:** Bus Ticket Booking
              
              **Example Steps and Mermaid Code:**
              
                  graph TD
                  A([Start]) --> B[Choose Destination]
                  B --> C{Already Registered?}
                  C -->|No| D[Sign Up]
                  D --> E[Enter Details]
                  E --> F[Search Buses]
                  C --> |Yes| F
                  F --> G{Buses Available?}
                  G -->|Yes| H[Select Bus]
                  H --> I[Enter Passenger Details]
                  I --> J[Make Payment]
                  J --> K[Booking Confirmed]
                  G -->|No| L[Set Reminder]
                  K --> M([End])
                  L --> M
                  style A fill:#90EE90,stroke:#333,stroke-width:2px;
                  style B fill:#4682B4,stroke:#333,stroke-width:2px;
                  style C fill:#32CD32,stroke:#333,stroke-width:2px;
                  style D fill:#FFD700,stroke:#333,stroke-width:2px;
                  style E fill:#4682B4,stroke:#333,stroke-width:2px;
                  style F fill:#4682B4,stroke:#333,stroke-width:2px;
                  style G fill:#32CD32,stroke:#333,stroke-width:2px;
                  style H fill:#4682B4,stroke:#333,stroke-width:2px;
                  style I fill:#4682B4,stroke:#333,stroke-width:2px;
                  style J fill:#4682B4,stroke:#333,stroke-width:2px;
                  style K fill:#FF6347,stroke:#333,stroke-width:2px;
                  style L fill:#FFD700,stroke:#333,stroke-width:2px;
                  style M fill:#FF6347,stroke:#333,stroke-width:2px;
              
              
              Note: Please ensure the generated code matches the title "${inputText}" and follows the format given above. Provide only the Mermaid flowchart code, without any additional explanations, comments, or text.
              `


            }
        ],
    }

    try {
        let jsonResponse = await getAzureChatAIRequest(options);
        jsonResponse = (jsonResponse as string).replace('```mermaid', '').replace('```', '');
        diagram.loadDiagramFromMermaid(jsonResponse as string);
        hideLoading();

    } catch (error) {
        console.error('Error:', error);
        convertTextToFlowchart(inputText, diagram);
    }
    hideLoading();
};

// Function to show loading indicator
function showLoading() {
    showSpinner(document.getElementById('loadingContainer') as HTMLDivElement);
}

// Function to hide loading indicator
function hideLoading() {
    hideSpinner(document.getElementById('loadingContainer') as HTMLDivElement);
}