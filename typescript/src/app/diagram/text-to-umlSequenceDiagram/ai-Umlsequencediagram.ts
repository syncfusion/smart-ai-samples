import { Diagram } from "@syncfusion/ej2/diagrams";
import { getAzureChatAIRequest } from '../../ai-models';
import { hideSpinner, showSpinner } from "@syncfusion/ej2/popups";

export async function convertTextToUmlSequenceDiagram(inputText: string, diagram: Diagram) {
    showLoading();
    const options = {
        messages: [
            {
                role: 'system',
                content: 'You are an assistant responsible for generating Mermaid syntax for UML sequence diagrams in response to user queries.'
            },
            {
                role: 'user',
                content: `
                    Generate only the Mermaid UML sequence diagrams code for the process titled "${inputText}".
                    based on the guidelines below. The output should strictly adhere to these rules and must not include any markdown code fences, blank space or the string 'mermaid' at the beginning
                    1.	Start with sequenceDiagram.
                    2.	Declare all participants with actor or participant; user types must be actor.
                    3.	Use specific arrows only: ->>, -), --), and for self-messages also ->>.
                    4.	Mark activations (activate) and deactivations (deactivate) for all interactions.
                    5.	Include at least one alt, opt, or loop block.
                    6.	Add at least one create and destroy message.
                    7.	Include at least 10 interaction steps, building a complex flow.
                    8.	Follow proper indentation and do not add extra comments or markdown syntax.

                    Basic simple examples for your context, but you try to create a complex diagram with all the given elements:

                    Example 1: All Types of Messages
                    sequenceDiagram
                    actor Client
                    participant Server
                    Client ->> Server: Sync Request
                    Server -) Client: Async Notification
                    Client -->> Server: Reply Message
                    Client ->> Client: Self Check
                    Server ->> Client: Delete Record

                    Example 2: With Activations
                    sequenceDiagram
                    participant User
                    participant Service
                    User ->> Service: Start Process
                    activate Service
                    Service -->> User: Process Acknowledged
                    deactivate Service

                    Example 3: With Fragments
                    sequenceDiagram
                    participant User
                    participant System
                    alt Successful Login
                        User ->> System: Enter Credentials
                        activate System
                        System -->> User: Login Successful
                        deactivate System
                    else Failed Login
                        loop Retry up to 3 times
                            User ->> System: Re-enter Credentials
                        end
                    end

                    Example 4: With Create/Destroy Messages
                    sequenceDiagram
                    actor Admin
                    create participant Worker as DataProcessor
                    Admin -) Worker: Initialize Service
                    activate Worker
                    Worker ->> Admin: Service Ready
                    deactivate Worker
                    destroy Worker

                    Return only the structured Mermaid sequence diagram syntax.
              
                    Note: Please ensure the generated code matches the title "${inputText}" and follows the guidelines & format given above.
                    Provide only the Mermaid UML sequence diagram code, without any additional explanations, comments, or text.
                    `
            }
        ],
    }

    try {
        let jsonResponse = await getAzureChatAIRequest(options);
        jsonResponse = (jsonResponse as string).replace('```mermaid', '').replace('```', '');
        diagram.model = {fragments:[],messages:[],participants:[]};
        diagram.loadDiagramFromMermaid(jsonResponse as string);
        hideLoading();

    } catch (error) {
        console.error('Error:', error);
        convertTextToUmlSequenceDiagram(inputText, diagram);
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