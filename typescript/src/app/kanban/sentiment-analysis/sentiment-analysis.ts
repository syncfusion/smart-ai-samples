import { PizzaDataModel, pizzaData } from '../kanbanData';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { NumericTextBox, TextBox } from '@syncfusion/ej2-inputs';
import { Kanban, DialogEventArgs, dialogOpen } from '@syncfusion/ej2-kanban';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { ProgressButton } from '@syncfusion/ej2/splitbuttons';
import {  OpenAiModel } from '../custom-model';
import { Toast } from '@syncfusion/ej2/notifications';

let isAiChecked = false;
let dataSource: PizzaDataModel[] = pizzaData;
let sentiment = new ProgressButton({
    content: 'Check Customer Sentiments',
    enableProgress: false,
    begin: () => {
        sentiment.content = "Progressing...";
        sentiment.dataBind();
        const checkTasksGenerated = () => {
            if (isAiChecked) {
                sentiment.content = "Check Customer Sentiments";
                sentiment.dataBind();
                isAiChecked = false;
            } else {
                setTimeout(checkTasksGenerated, 100);
            }
        };
        checkTasksGenerated();
    }
});
sentiment.appendTo('#sentiment');
sentiment.element.onclick = () => {
    isAiChecked = false;
    getScore();
}

let toast: Toast = new Toast({
    position: { X: 'Right', Y: 'Top' },
    showCloseButton: true,
    target: '#Kanban'
});
toast.appendTo('#toast');

function getScore(): void {
    try {
        let pizzaJson = JSON.stringify(dataSource);
        let description = "Provide a SentimentScore out of 5 (whole numbers only) based on the Feedback. If the feedback is null, do not give a SentimentScore. Use the dataset provided below to make recommendations. NOTE: Return the data in JSON format with all fields included, and return only JSON data, no explanatory text. Don't change the dataset formart. Just update the sentiment scrore given dataset field (fieldName: SentimentScore)" + pizzaJson;
        getResponseFromOpenAI(description).then((response) => {
            try {
                const jsonArrayPattern = /\[\s*{[\s\S]*?}\s*\]/;
                let result = response.match(jsonArrayPattern);
                if (result && result[0]) {
                    let data = result[0].replace("```json", "").replace("```", "").replace("\r", "").replace("\n", "").replace("\t", "").trim();
                    dataSource = JSON.parse(data);
                    dataSource.forEach(item => {
                        if (item.SentimentScore !== undefined) {
                            if (item.SentimentScore > 0 && item.SentimentScore <= 2) {
                                item.Emoji = "😢";
                            } else if (item.SentimentScore > 3 && item.SentimentScore <= 5) {
                                item.Emoji = "😀";
                            } else if (item.SentimentScore === 3) {
                                item.Emoji = "😐";
                            }
                        }
                    });
                    kanbanObj.dataSource = dataSource;
                    kanbanObj.dataBind();
                    isAiChecked = true;
                } else {
                    isAiChecked = true;
                    toast.content = "An error occurred during the AI process, Please try again."
                    toast.show();
                }
            } catch {
                isAiChecked = true;
                toast.content = "An error occurred during the AI process, Please try again."
                toast.show();
            }
        });
    } catch {
        isAiChecked = true;
        toast.content = "An error occurred during the AI process, Please try again."
        toast.show();
    }
}

async function getResponseFromOpenAI(promptQuery: string): Promise<string> {
    const content = await OpenAiModel(promptQuery);
    return content ? content as string : '';
}

let kanbanObj: Kanban = new Kanban({
    dataSource: dataSource,
    keyField: 'Category',
    columns: [
        { headerText: 'Menu', keyField: 'Menu' },
        { headerText: 'Order', keyField: 'Order' },
        { headerText: 'Ready to Serve', keyField: 'Ready to Serve' },
        { headerText: 'Delivered', keyField: 'Delivered,Served' }
    ],
    cardSettings: {
        headerField: 'Id',
        template: '#cardTemplate'
    },
    dialogSettings: {
        template: '#dialogTemplate'
    },
    dialogClose: onDialogClose,
    dialogOpen: onDialogOpen

});
let categoryData: string[] = ['Menu', 'Order', 'Ready to Serve', 'Delivered', 'Served'];
kanbanObj.appendTo('#Kanban'); //Render initialized Kanban control
function onDialogOpen(args: DialogEventArgs): void {
    if (args.requestType !== 'Delete') {
        let curData: { [key: string]: Object } = args.data as { [key: string]: Object };
        let filledTextBox: TextBox = new TextBox({});
        filledTextBox.appendTo(args.element?.querySelector('#Id') as HTMLInputElement);
        let numericObj: NumericTextBox = new NumericTextBox({
            value: curData.Estimate as number, placeholder: 'Estimate'
        });
        numericObj.appendTo(args.element?.querySelector('#Estimate') as HTMLInputElement);

        let categoryDropObj: DropDownList = new DropDownList({
            value: curData.Category as string, popupHeight: '300px',
            dataSource: categoryData, fields: { text: 'Category', value: 'Category' }, placeholder: 'Category'
        });
        categoryDropObj.appendTo(args.element?.querySelector('#Category') as HTMLInputElement);

        let titleObj: TextBox = new TextBox({
            placeholder: 'Title',

        });
        titleObj.appendTo(args.element?.querySelector('#Title') as HTMLInputElement);

        let sizeObj: TextBox = new TextBox({
            placeholder: 'Size',
        });
        sizeObj.appendTo(args.element?.querySelector('#Size') as HTMLInputElement);

        let textareaObj: TextBox = new TextBox({
            placeholder: 'Description',
            multiline: true
        });
        textareaObj.appendTo(args.element?.querySelector('#Description') as HTMLInputElement);

        let datepicker: DatePicker = new DatePicker({
            value: curData.Date as Date,
            format: 'MM/dd/yyyy',
        });
        datepicker.appendTo(args.element?.querySelector('#datepicker') as HTMLInputElement);

        let feedback: TextBox = new TextBox({
            placeholder: 'Feedback',
            multiline: true
        });
        feedback.appendTo(args.element?.querySelector('#feedback') as HTMLInputElement);
    }
}
function onDialogClose(args: DialogEventArgs) {
    if (args.element?.querySelector('#datepicker') as any) {
        args.data.Date = (args.element?.querySelector('#datepicker') as any).ej2_instances[0].value.toLocaleString('es-PR').split(",")[0];
    }
}