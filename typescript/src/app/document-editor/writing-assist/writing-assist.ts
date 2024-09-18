import { DocumentEditorContainer, Toolbar } from '@syncfusion/ej2-documenteditor';
import { Dialog } from '@syncfusion/ej2-popups';
import { Toolbar as NavigationToolbar } from '@syncfusion/ej2-navigations';
import { ComboBox } from '@syncfusion/ej2-dropdowns';
import { ClickEventArgs, MenuItemModel } from '@syncfusion/ej2/navigations';
import { CustomContentMenuEventArgs, CustomToolbarItemModel } from '@syncfusion/ej2/documenteditor';
import { TitleBar } from './title-bar';
import {getAzureChatAIRequest} from '../../ai-models';
import { ChangeEventArgs } from '@syncfusion/ej2/dropdowns';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2/popups';

//azure part

interface Message {
    role: string;
    content: string;
}

interface AzureAIRequestOptions {
    messages: Message[];
    model: string;
}

//document editor
DocumentEditorContainer.Inject(Toolbar);
let toolItem: CustomToolbarItemModel = {
    prefixIcon: "e-icons e-file-new",
    text: "AI Write",
    id: "write"
};
let container: DocumentEditorContainer = new DocumentEditorContainer({ enableToolbar: true, height: '99%', serviceUrl: 'https://services.syncfusion.com/js/production/api/documenteditor/', toolbarItems: ['New', 'Open', 'Separator', toolItem, 'Separator', 'Undo', 'Redo', 'Separator', 'Image', 'Table', 'Hyperlink', 'Bookmark', 'TableOfContents', 'Separator', 'Header', 'Footer', 'PageSetup', 'PageNumber', 'Break', 'InsertFootnote', 'InsertEndnote', 'Separator', 'Find', 'Separator', 'Comments', 'TrackChanges', 'Separator', 'LocalClipboard', 'RestrictEditing', 'Separator', 'FormFields', 'UpdateFields', 'ContentControl'] });
container.appendTo('#DocumentEditor');
let titleBar: TitleBar = new TitleBar(document.getElementById('documenteditor_titlebar')!, container.documentEditor, true);
container.documentEditor.documentName = 'Getting Started';
titleBar.updateDocumentTitle();
let menuItems: MenuItemModel[] = [
    {
        text: 'AI Write',
        id: 'write',
        iconCss: 'e-icons e-file-new'
    }];

container.documentEditor.contextMenu.addCustomMenu(menuItems, false);

container.customContextMenuSelect = (args: CustomContentMenuEventArgs): void => {
    let item: string = args.id;
    let id: string = container.element.id;
    switch (item) {
        case id + '_editorwrite':
            dialog.show();
            break;
    }
};

container.toolbarClick = (args: ClickEventArgs): void => {
    switch (args.item.id) {
        case 'write':
            dialog.show();
            break;
    }
};

//dialog
let dialog = new Dialog({
    header: 'Generate Content',
    showCloseIcon: true,
    content: document.getElementById("e-de-editable-div") as HTMLElement | undefined,
    buttons: [
        {
            'click': () => {
                onInsertContent();
                clearContent();
            },
            buttonModel: {
                isPrimary: true,
                content: 'Insert',
                cssClass: 'e-dig-insert'
            },
        },
        {
            'click': () => {
                clearContent();
                dialog.hide();
            },
            buttonModel: {
                content: 'Cancel',
                cssClass: 'e-flat'
            }
        }
    ],
    visible: false,
    target: document.getElementById("DocumentEditor") as HTMLElement | undefined,
    width: '50%',
    height: 'auto',
    isModal: true,
    close: onclose,
    beforeOpen: onOpen,
});
dialog.appendTo('#dialog');
async function onOpen(): Promise<void> {    
    await onChangeToolbarVisibility(true);
    //onChangeBtnState(true);
}

function onclose(): void {
    clearContent();
}

//editable div

const editableDiv = document.getElementById("e-de-editable-div");
function setPlaceholder() {
    if (editableDiv?.innerHTML.trim() === "") {
        editableDiv!.innerHTML = "Please provide the topic or idea for content generation...";
        editableDiv!.classList.add("placeholder"); // Add a class for styling
    }
}
function removePlaceholder() {
    if (editableDiv!.innerHTML === "Please provide the topic or idea for content generation...") {
        editableDiv!.innerHTML = "";
        editableDiv!.classList.remove("placeholder");
    }
}
setPlaceholder();
editableDiv?.addEventListener("focus", removePlaceholder);
editableDiv?.addEventListener("blur", setPlaceholder);

editableDiv?.addEventListener('input', function () {
    // if (dialog.buttons[0] && dialog.buttons[0].buttonModel) {
    //     dialog.buttons[0].buttonModel.disabled = false;
    // }
    toolbar.items[3].disabled = false;
});

//toolbar

let toneValue: string = 'Professional';
let formatValue: string = 'Paragraph';
let lengthValue: string = 'Medium';
let outList: string[] = [];

let toneList: string[] = ['Professional', 'Friendly', 'Instructional', 'Marketing', 'Academic', 'Legal', 'Technical', 'Narrative', 'Direct'];
let formatValueList: string[] = ['Paragraph', 'Blog post', 'Technical Documentation', 'Report', 'Research Papers', 'Tutorial', 'Meeting Notes'];
let lengthList: string[] = ['Short', 'Medium', 'Long'];

let toolbar: NavigationToolbar = new NavigationToolbar({
    items: [
        { prefixIcon: 'e-icons e-chevron-left', click: moveToPrevious },
        {
            type: 'Input', align: 'Left', cssClass: 'page-count', template: "<div><input type='text' id='numeric' style='width: 20px;padding-left: 10px;'> <span id=total-page> of 3 </span> </input></div>"
        },
        { prefixIcon: 'e-icons e-chevron-right', click: moveToNext },
        { text: 'Generate', align: 'Right', click: onGenerateClick, disabled: true },
        { prefixIcon: 'e-icons e-settings', click: onSettingsClick },

        { prefixIcon: 'e-icons e-close', click: onCloseSecndaryToolbar },
        {
            type: 'Input', align: 'Left', template: new ComboBox({ width: '125px', change: onToneChange, value: toneValue, dataSource: toneList, popupWidth: '125px', showClearButton: false, readonly: false })
        },
        {
            type: 'Input', align: 'Left', template: new ComboBox({ width: '200px', change: onFormatChange, value: formatValue, dataSource: formatValueList, popupWidth: '200px', showClearButton: false, readonly: false })
        },
        {
            type: 'Input', align: 'Left', template: new ComboBox({ width: '100px', change: onLengthChange, value: lengthValue, dataSource: lengthList, popupWidth: '100px', showClearButton: false, readonly: false })
        },
        { text: 'Rewrite', click: onGenerateClick },
    ],
    created: onToolbarCreated,
});
toolbar.appendTo('#e-d-toolbar');
async function onToolbarCreated() {
    dialog.show();
    updateIndex();
}
function onSettingsClick() {
    onChangeToolbarVisibility(false);
}

function onCloseSecndaryToolbar() {
    onChangeToolbarVisibility(true);
}

async function onChangeToolbarVisibility(showPryItem: boolean) {
    let isPrimary: boolean = true;
    if (!showPryItem) {
        isPrimary = false;
    }
    for (let i = 0; i < 5; i++) {
        toolbar.items[i].visible = isPrimary;
        toolbar.items[i + 5].visible = !isPrimary;
    }
}

async function onChangeBtnState(isShow: boolean) {
    toolbar.items[0].disabled = isShow;
    toolbar.items[2].disabled = isShow;
    toolbar.refresh();
    updateIndex();
    let element: HTMLElement = document.getElementById('total-page')!;
    if (!isShow) {
        element.innerHTML = ' of ' + outList.length;
    } else {
        element.innerHTML = ' of 0';
    }
}

async function onGenerateClick() {
    createSpinner({
        target: document.getElementById('dialog') as HTMLElement,
    });
    showSpinner(document.getElementById('dialog') as HTMLElement);
    let text: string = editableDiv!.innerText;
    if (toolbar.items[3].text === 'Generate') {
        const options: AzureAIRequestOptions = {
            messages: [
                { role: "system", content: `You are a helpful assistant. Your task is to generate content based on the provided text. Please adjust the text to reflect a tone of '${toneValue}', formatted in '${formatValue}' style, and maintain a length of '${lengthValue}'. Always respond in proper text format not a md format. Always respond in proper HTML format, excluding <html>, <head>, and <body> tags.` },
                { role: "user", content: text }
            ],
            model: "gpt-4",
        };
        await onGenerate(options);
        toolbar.items[3].text = 'Rewrite';
    } else {
        const options: AzureAIRequestOptions = {
            messages: [
                { role: "system", content: `You are a helpful assistant. Your task is to generate content based on the provided text. Please adjust the text to reflect a tone of '${toneValue}', formatted in '${formatValue}' style, and maintain a length of '${lengthValue}'. Always respond in proper text format not a md format. Always respond in proper HTML format, excluding <html>, <head>, and <body> tags.` },
                { role: "user", content: text }
            ],
            model: "gpt-4",
        };
        await onGenerate(options);
    }
    //await onChangeBtnState(false);
    hideSpinner(document.getElementById('dialog') as HTMLElement);
}

async function onGenerate(options: AzureAIRequestOptions): Promise<void> {
    outList = [];
    for (let i = 0; i < 3; i++) {
        const response = await getAzureChatAIRequest(options);
        if (response && outList.indexOf(response) === -1) {
            outList.push(response);
        } else {
            i--;
        }
    }
    if (outList.length > 0) {
        editableDiv!.innerHTML = outList[0];
    }
}

function moveToNext() {
    let text: string = editableDiv!.innerHTML;
    let index: number = outList.indexOf(text);
    if (index + 1 < outList.length) {
        editableDiv!.innerHTML = outList[index + 1];
        updateIndex();
    }
}

function moveToPrevious() {
    let text: string = editableDiv!.innerHTML;
    let index: number = outList.indexOf(text);
    if (index - 1 >= 0) {
        editableDiv!.innerHTML = outList[index - 1];
        updateIndex();
    }
}

function updateIndex() {
    let element: HTMLInputElement = document.getElementById('numeric')! as HTMLInputElement;
    let text: string = editableDiv!.innerHTML;
    if (outList.length > 0 && outList.indexOf(text) !== -1) {
        element.value = (outList.indexOf(text) + 1).toString();
    } else {
        element.value = '0';
    }
}

function onToneChange(args: ChangeEventArgs): void {
    toneValue = args.value as string;
}
function onFormatChange(args: ChangeEventArgs): void {
    formatValue = args.value as string;
}
function onLengthChange(args: ChangeEventArgs): void {
    lengthValue = args.value as string;
}

//convertion

function onInsertContent(): void {
    let response: string = editableDiv!.innerHTML;
    let http = new XMLHttpRequest();
    let url: string = container.serviceUrl + 'SystemClipboard';
    http.open('POST', url, true);
    http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    http.onreadystatechange = () => {
      if (http.readyState === 4) {
        if (http.status === 200 || http.status === 304) {
          container.documentEditor.editor.paste(http.responseText);
          container.documentEditor.editor.onEnter();
          dialog.hide();
        }
      }
    };
    let sfdt: any = {
        content: response,
        type: '.Html',
    };
    http.send(JSON.stringify(sfdt));
  }

  //clear

  function clearContent(): void {
    editableDiv!.innerHTML = '';
    setPlaceholder();
    //onChangeBtnState(true);
    onChangeToolbarVisibility(true);
  }