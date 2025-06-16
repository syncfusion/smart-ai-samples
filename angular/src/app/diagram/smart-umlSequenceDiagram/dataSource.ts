import { UmlSequenceDiagramModel, UmlSequenceMessageType, UmlSequenceFragmentType } from "@syncfusion/ej2-angular-diagrams";
import { ItemModel } from "@syncfusion/ej2/navigations";

// Define the sequence diagram model with participants, messages, and fragments
export const sequenceModel: UmlSequenceDiagramModel = {
    // Space between each participant in the diagram
    spaceBetweenParticipants: 250,
    // List of participants in the sequence diagram
    participants: [
        {
            id: "User",
            content: "User",
            // Indicates that User is an actor
            isActor: true
        },
        {
            id: "Transaction",
            content: "Transaction",
            // Activation periods for the Transaction participant
            activationBoxes: [
                { id: "act1", startMessageID: 'msg1', endMessageID: 'msg4' }
            ]
        },
        {
            id: "FraudDetectionSystem",
            content: "Fraud Detection System",
            // Activation periods for the Fraud Detection System participant
            activationBoxes: [
                { id: "act2", startMessageID: 'msg2', endMessageID: 'msg3' },
                { id: "act3", startMessageID: 'msg5', endMessageID: 'msg6' }
            ]
        }
    ],
    // List of messages exchanged between participants
    messages: [
        { id: 'msg1', content: "Initiate Transaction", fromParticipantID: "User", toParticipantID: "Transaction", type: UmlSequenceMessageType.Synchronous },
        { id: 'msg2', content: "Send Transaction Data", fromParticipantID: "Transaction", toParticipantID: "FraudDetectionSystem", type: UmlSequenceMessageType.Synchronous },
        { id: 'msg3', content: "Validate Transaction", fromParticipantID: "FraudDetectionSystem", toParticipantID: "Transaction", type: UmlSequenceMessageType.Reply },
        { id: 'msg4', content: "Transaction Approved", fromParticipantID: "Transaction", toParticipantID: "User", type: UmlSequenceMessageType.Asynchronous },
        { id: 'msg5', content: "Flag Transaction", fromParticipantID: "Transaction", toParticipantID: "FraudDetectionSystem", type: UmlSequenceMessageType.Synchronous },
        { id: 'msg6', content: "Fraud Detected", fromParticipantID: "FraudDetectionSystem", toParticipantID: "User", type: UmlSequenceMessageType.Reply },
        { id: 'msg7', content: "Cancel Transaction", fromParticipantID: "User", toParticipantID: "Transaction", type: UmlSequenceMessageType.Synchronous },
        { id: 'msg8', content: "Complete Transaction", fromParticipantID: "User", toParticipantID: "Transaction", type: UmlSequenceMessageType.Synchronous }
    ],
    // Conditional fragments within the sequence
    fragments: [
        {
            id: 1,
            // Represents alternative fragment
            type: UmlSequenceFragmentType.Alternative,
            conditions: [
                // Condition when fraud is detected
                {
                    // Content of condition
                    content: "Fraud Detected",
                    // Messages part of this condition
                    messageIds: ['msg5', 'msg6', 'msg7']
                },
                {
                    content: "No Fraud Detected",
                    messageIds: ['msg8']
                }
            ]
        }
    ]
};

export function toolbarItems() {
    let items: ItemModel[] = [
        { prefixIcon: 'e-icons e-circle-add', tooltipText: 'New Diagram' },
        { prefixIcon: 'e-icons e-folder-open', tooltipText: 'Open Diagram', },
        { prefixIcon: 'e-icons e-save', tooltipText: 'Save Diagram' },
        { prefixIcon: 'e-print e-icons', tooltipText: 'Print Diagram' },
        { type: 'Input', tooltipText: 'Export Diagram', template: '<button id="exportBtn" style="width:100%;"></button>' },
        { type: 'Separator' },
        { prefixIcon: 'e-pan e-icons', tooltipText: 'Pan Tool', cssClass: 'tb-item-start pan-item' },
        { prefixIcon: 'e-mouse-pointer e-icons', tooltipText: 'Select Tool', cssClass: 'tb-item-middle tb-item-selected' },
        { type: 'Separator' },
        {
            cssClass: 'tb-item-end tb-zoom-dropdown-btn', template: '<button id="btnZoomIncrement"></button>', align: 'Right'
        },
    ];
    return items;
}
export const zoomMenuItems: ItemModel[] = [
    { text: 'Zoom In' }, { text: 'Zoom Out' }, { text: 'Zoom to Fit' }, { text: 'Zoom to 50%' },
    { text: 'Zoom to 100%' }, { text: 'Zoom to 200%' },
];
export const exportItems: ItemModel[] = [
    { text: 'JPG' }, { text: 'PNG' }, { text: 'SVG' }
];