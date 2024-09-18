import { TextArea, SmartTextArea } from '@syncfusion/ej2-inputs';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { getAzureTextAIRequest,getAzureChatAIRequest } from '../ai-models';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { NumericTextBox, TextBox, ChangedEventArgs } from '@syncfusion/ej2-inputs';
import { enableRipple } from '@syncfusion/ej2-base';

enableRipple(true);



/**
 * Smart TextArea sample
 */
const serverAIRequest = async (settings: any) => {
    let output = '';
    try {
        console.log(settings);
        const response = await getAzureChatAIRequest(settings) as string;
        console.log("Success:", response);
        output = response;
    } catch (error) {
        console.error("Error:", error);
    }
    return output;
};

let textareaObj: SmartTextArea = new SmartTextArea({
    placeholder: 'Enter your queries here',
    floatLabelType: 'Auto',
    rows:5,
    userRole: 'Employee communicating with internal team',
    UserPhrases: [
        "Please find the attached report.",
        "Let's schedule a meeting to discuss this further.",
        "Can you provide an update on this task?",
        "I appreciate your prompt response.",
        "Let's collaborate on this project to ensure timely delivery."
    ],
    aiSuggestionHandler: serverAIRequest,
    showSuggestionOnPopup: 'Enable'
});
textareaObj.appendTo('#smart-textarea');






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

let dropDownPresets: DropDownList = new DropDownList({
    dataSource: rolesData,
    width:'75%',
    placeholder: "Select a role",
    value: "Maintainer of an open-source project replying to GitHub issues",
    popupHeight: "200px",
    change: (e: any) => {
        let selectedRole: string = e.value;
        let selectedPreset: any = presets.find((preset: any) => preset.userRole === selectedRole);
        (textareaObj as any).userRole = selectedRole;
        (textareaObj as any).UserPhrases = selectedPreset.userPhrases;
    }
});
dropDownPresets.appendTo('#user-role');