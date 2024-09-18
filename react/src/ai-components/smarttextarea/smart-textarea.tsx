import { SmartTextAreaComponent } from '@syncfusion/ej2-react-inputs'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { getAzureChatAIRequest } from '../../ai-models';
import './smart-textarea.css';

function SmartTextarea() {
    let textareaObj: SmartTextAreaComponent;
    const phrasesData: string[] = [
        "Please find the attached report.",
        "Let's schedule a meeting to discuss this further.",
        "Can you provide an update on this task?",
        "I appreciate your prompt response.",
        "Let's collaborate on this project to ensure timely delivery."
    ];
    const rolesData: string[] = [
        "Maintainer of an open-source project replying to GitHub issues",
        "Employee communicating with internal team",
        "Customer support representative responding to customer queries",
        "Sales representative responding to client inquiries"
    ];

    let presets: any = [
        {
            userRole: "Maintainer of an open-source project replying to GitHub issues",
            userPhrases: [
                "Thank you for contacting us.",
                "To investigate, we'll need a repro as a public Git repo.",
                "Could you please post a screenshot of NEED_INFO?",
                "This sounds like a usage question. This issue tracker is intended for bugs and feature proposals. Unfortunately, we don't have the capacity to answer general usage questions and would recommend StackOverflow for a faster response.",
                "We don't accept ZIP files as repros."
            ]
        },
        {
            userRole: "Customer support representative responding to customer queries",
            userPhrases: [
                "Thank you for reaching out to us.",
                "Can you please provide your order number?",
                "We apologize for the inconvenience.",
                "Our team is looking into this issue and will get back to you shortly.",
                "For urgent matters, please call our support line."
            ]
        },
        {
            userRole: "Employee communicating with internal team",
            userPhrases: [
                "Please find the attached report.",
                "Let's schedule a meeting to discuss this further.",
                "Can you provide an update on this task?",
                "I appreciate your prompt response.",
                "Let's collaborate on this project to ensure timely delivery."
            ]
        },
        {
            userRole: "Sales representative responding to client inquiries",
            userPhrases: [
                "Thank you for your interest in our product.",
                "Can I schedule a demo for you?",
                "Please find the pricing details attached.",
                "Our team is excited to work with you.",
                "Let me know if you have any further questions."
            ]
        }
    ];
    const serverAIRequest = async (settings: any) => {
        let output = '';
        try {
            const response = await getAzureChatAIRequest(settings) as string;
            output = response;
        } catch (error) {
            console.error("Error:", error);
        }
        return output;
    };

    function onChange(args: any) {
        let selectedRole: string = args.value;
        let selectedPreset: any = presets.find((preset: any) => preset.userRole === selectedRole);
        textareaObj.userRole = selectedRole;
        textareaObj.UserPhrases = selectedPreset.userPhrases;
    }

    return (
        <div className='control-pane'>
            <div className='control-section'>
                <div className="description-container e-card">
                    <div className='e-card-content '>
                    <p>The <b>SmartTextArea</b> is an AI-powered version of Syncfusion's TextArea that adds smart autocompletion. It helps by suggesting complete sentences based on user input, making typing faster and easier.</p>
                    <p>Select a user role <i>Maintainer of an open-source project replying to GitHub issues</i> and start typing <i>Create an issue</i>. It will automatically complete the text based on the selected user role.. Know more <a href="https://github.com/syncfusion/smart-ai-samples/blob/master/react/src/ai-components/smarttextarea/Readme.md">here</a>.</p>
                    </div>
                </div>
                <div className="content-wrapper smart-text">
                    <div className="example-label">Select a role</div>
                    <DropDownListComponent type="text" id='user-role'
                        dataSource={rolesData}
                        width='90%'
                        placeholder="Select a role"
                        value="Maintainer of an open-source project replying to GitHub issues"
                        popupHeight="200px"
                        change={onChange}
                    />
                    <br />
                    <div className='smart-component'>
                        <SmartTextAreaComponent
                            id='smart-textarea'
                            ref={(textarea) => { textareaObj = textarea as SmartTextAreaComponent; }}
                            placeholder={'Enter your queries here'}
                            floatLabelType={'Auto'}
                            rows={5}
                            userRole={'Employee communicating with internal team'}
                            UserPhrases={phrasesData}
                            aiSuggestionHandler={serverAIRequest}
                        ></SmartTextAreaComponent>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SmartTextarea;