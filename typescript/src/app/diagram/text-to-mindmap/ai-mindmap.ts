import { Diagram } from "@syncfusion/ej2/diagrams";
import { getAzureChatAIRequest} from '../../ai-models';
import {pushWorkingData} from './utility-methods';
import {toolbarObj} from './app';
import { hideSpinner, showSpinner } from "@syncfusion/ej2/popups";
export async function convertTextToMindMap(inputText: string,diagram: Diagram) {
    showLoading();
    const options = {
      messages: [
        {
          role: 'system',
          content: 'You are an assistant tasked with generating mermaid mindmap diagram data source based on user queries with space indentation'
        },
        {
          role: 'user',
          content: `Generate only the Mermaid mindmap code for the subject titled "${inputText}".
            Use the format provided in the example below, but adjust the steps, shapes, and indentation according to the new title:
            
            **Example Title:** Organizational Research
            
            **Example Steps and Mermaid Code:**
  
                mindmap
                root(Mobile Banking Registration)
                    User(User)
                    PersonalInfo(Personal Information)
                        Name(Name)
                        DOB(Date of Birth)
                        Address(Address)
                    ContactInfo))Contact Information((
                        Email(Email)
                        Phone(Phone Number)
                    Account[Account]
                        AccountType[Account Type]
                            Savings[Savings]
                            Checking[Checking]
                        AccountDetails(Account Details)
                            AccountNumber(Account Number)
                            SortCode(Sort Code)
                    Security{{Security}}
                        Authentication(Authentication)
                            Password(Password)
                            Biometrics(Biometrics)
                            Fingerprint(Fingerprint)
                            FaceID(Face ID)
                        Verification)Verification(
                            OTP)OTP(
                            SecurityQuestions)Security Questions(
                    Terms(Terms & Conditions)
                        AcceptTerms(Accept Terms)
                        PrivacyPolicy(Privacy Policy)
  
            
            
            Note: Please ensure the generated code matches the title "${inputText}" and follows the format given above. Provide only the Mermaid mindmap code, without any additional explanations, comments, or text.
            `
  
  
        }
      ],
    }
  
    try {
      let jsonResponse: string | null = await getAzureChatAIRequest(options);
      jsonResponse = (jsonResponse as string).replace('```mermaid', '').replace('```', '');
      diagram.loadDiagramFromMermaid(jsonResponse as string);
      diagram.clearHistory();
      pushWorkingData(diagram);
      toolbarObj.items[0].disabled = true;
      hideLoading();
  
    } catch (error) {
      console.error('Error:', error);
      convertTextToMindMap(inputText,diagram);
  
    }
  };

// Function to show loading indicator
function showLoading() {
  showSpinner(document.getElementById('loadingContainer') as HTMLDivElement);
}

// Function to hide loading indicator
function hideLoading() {
  hideSpinner(document.getElementById('loadingContainer') as HTMLDivElement);
}