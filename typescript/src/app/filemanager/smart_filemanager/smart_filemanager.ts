import { FileManager, Toolbar, NavigationPane, DetailsView, ContextMenu } from '@syncfusion/ej2-filemanager';
import { getAzureChatAIRequest } from '../../ai-models';
import { MenuClickEventArgs, MenuOpenEventArgs } from '@syncfusion/ej2/filemanager';
import { Button, ChipList } from '@syncfusion/ej2/buttons';
import { Ajax } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { Skeleton } from '@syncfusion/ej2-notifications';

// Initialize the Skeleton control
let skeleton = new Skeleton({ shape: 'Rectangle', width: '100%', height: '100%' });
skeleton.appendTo('#skeleton');

FileManager.Inject(Toolbar, NavigationPane, DetailsView, ContextMenu);
let dialog: Dialog;
let isVisible: boolean = false;
let hostUrl: string = 'https://filemanageraiservice.azurewebsites.net/';
let toolbarItems: any = [
    { name: 'NewFolder' },
    { name: 'Cut' },
    { name: 'Copy' },
    { name: 'Paste' },
    { name: 'Delete' },
    { name: 'Rename' },
    { name: 'SortBy' },
    { name: 'Refresh' },
    { name: 'Selection' },
    { name: 'View' },
    { name: 'Details' },
    { text: 'Quick Summary', name: 'Quick Summary', prefixIcon: 'e-icons e-print-layout', tooltipText: 'Get a quick summary of the selected file using AI', visible: false },
];

dialog = new Dialog({
    header: "File Summary",
    content: "<span>Loading...</span>",
    target: document.getElementById('filemanager') as HTMLElement,
    showCloseIcon: true,
    visible: isVisible,
    isModal: true,
    height: '70%',
    width: '600px',
    overlayClick: dialogOverlay,
    close: dialogOverlay,
});

function dialogOverlay(): void {
    dialog.hide();
    dialog.visible = false;
    dialog.content = "<span>Loading...</span>";
}
dialog.appendTo('#customTbarDialog');

let fileObject: FileManager = new FileManager({
    ajaxSettings: {
        url: hostUrl + 'api/FileManager/FileOperations',
        getImageUrl: hostUrl + 'api/FileManager/GetImage',
        uploadUrl: hostUrl + 'api/FileManager/Upload',
        downloadUrl: hostUrl + 'api/FileManager/Download'
    },
    height: '520px',
    toolbarItems: toolbarItems,
    created: () => {
        // Hide the Skeleton control once the FileManager is fully loaded
        document.getElementById('skeleton-container')!.style.display = 'none';
    },
    contextMenuSettings: { file: ["Manage Tags", "|", "Cut", "Copy", "|", "Delete", "Rename", "|", "Details"], folder: ["Open", "|", "Cut", "Copy", "Paste", "|", "Delete", "Rename", "|", "Details"], layout: ["SortBy", "View", "Refresh", "|", "Paste", "|", "NewFolder", "|", "Details", "|", "SelectAll"], visible: true },
    searchSettings: { allowSearchOnTyping: false },
    fileOpen: onFileOpen,
    fileSelect: fileSelected,
    menuOpen: menuOpen,
    menuClick: menuClick,
    fileSelection: fileSelection,
    beforeSend: onSend,
    toolbarClick: toolbarClick,
});
fileObject.appendTo('#smartfilemanager');

function toolbarClick(this: any, args: any) {
    if (args.item.text == 'Quick Summary') {
        if (args.fileDetails[0].permission == null) {
            Summarize(args.fileDetails[0]);
        }
        else if (args.fileDetails[0].permission != null && !args.fileDetails[0].permission.read) {
            dialog.visible = true;
            dialog.content = "<span>" + args.fileDetails[0].name + " is not accessible. You do not have permission to read this file." + "</span>";
        }
    }
}

function onFileOpen(this: any, args: any) {
    var file = args.fileDetails;
    if (file != null && file.isFile && ['.txt', '.docx', '.pdf'].includes(file.type)) {
        if (file.permission == null) {
            Summarize(file);
        }
        else {
            dialog.visible = true;
            dialog.content = "<span>" + args.fileDetails.name + " is not accessible. You do not have permission to read this file." + "</span>";
        }
    }
    else {
        dialog.visible = false;
        this.toolbarItems.filter((items: any) => items.name == 'Quick Summary')[0].visible = false;
    }
}

function fileSelected(this: any, args: any) {
    var file = args.fileDetails;
    if (['.txt', '.docx', '.pdf'].includes(file.type) && this.selectedItems.length == 1) {
        this.toolbarItems.filter((items: any) => items.name == 'Quick Summary')[0].visible = true;
    }
    else {
        this.toolbarItems.filter((items: any) => items.name == 'Quick Summary')[0].visible = false;
    }
}

function menuOpen(this: any, args: MenuOpenEventArgs) {
    if (args.items) {
        const manageTagsItem = 'Manage Tags';
        if (args.menuType === 'file' && this.selectedItems.length > 1) {
            if (!this.contextmenuModule.disabledItems.includes(manageTagsItem)) {
                this.contextmenuModule.disabledItems.push(manageTagsItem);
            }
        } else {
            const index = this.contextmenuModule.disabledItems.indexOf(manageTagsItem);
            if (index !== -1) {
                this.contextmenuModule.disabledItems.splice(index, 1);
            }
        }
        for (let i: number = 0; i < args.items.length; i++) {
            if (args.items[i].id === this.element.id + '_cm_managetags') {
                args.items[i].iconCss = 'e-icons e-bookmark';
            }
        }
    }
}

function menuClick(this: any, args: MenuClickEventArgs) {
    if (args.item && args.item.text === 'Manage Tags') {
        manageTags(args);
    }
}

function manageTags(this: any, args: any) {
    (document as any).querySelector('.filemanager_container #tags').style.display = '';
    (document as any).querySelector('.filemanager_container #emptyAiTag').style.display = '';
    const ajax = new Ajax({
        url: 'https://filemanageraiservice.azurewebsites.net/api/FileManager/GetTagsFromFile',
        type: 'POST',
        data: JSON.stringify(args.fileDetails[0]),
        contentType: 'application/json',
        onSuccess: (response: any) => {
            fileChips.chips = JSON.parse(response);
            if (fileChips.chips.length == 0) {
                (document as any).querySelector('.filemanager_container #emptyTag').style.display = '';
            }
            else {
                (document as any).querySelector('.filemanager_container #emptyTag').style.display = 'none';
            }
        },
        onFailure: (error: any) => {
            console.log(error);
        }
    });
    ajax.send();
}

function closeTagContainer(this: any) {
    (document as any).querySelector('.filemanager_container #tags').style.display = 'none';
    fileChips.chips = [];
    aiChips.chips = [];
    savebtn.disabled = true;
}
function fileSelection(this: any, args: any) {
    closeTagContainer();
}

function onSend(this: any, args: any) {
    if (args.action == 'search') {
        const customData = JSON.parse(args.ajaxSettings.data);
        customData.isTagSearch = true;
        args.ajaxSettings.data = JSON.stringify(customData);
    }
}

let closebtn: Button = new Button({ iconCss: 'e-icons e-close', cssClass: 'e-small' });
closebtn.appendTo('#closebtn');

closebtn.element.onclick = (): void => {
    closeTagContainer();
};

let savebtn: Button = new Button({ cssClass: 'e-btn e-outline e-primary', disabled: true });
savebtn.appendTo('#savebtn');

savebtn.element.onclick = (): void => {
    let fileObj = (document.getElementById('smartfilemanager') as any).ej2_instances[0];
    const data = fileObj.getSelectedFiles();
    data[0].tags = aiChips.chips;
    const tags = aiChips.chips;
    const ajax = new Ajax({
        url: 'https://filemanageraiservice.azurewebsites.net/api/FileManager/SaveTagsToFile',
        type: 'POST',
        data: JSON.stringify(data[0]),
        contentType: 'application/json',
        onSuccess: (response: any) => {
            fileChips.chips = JSON.parse(response);
            (document as any).querySelector('.filemanager_container #emptyTag').style.display = 'none';
            (document as any).querySelector('.filemanager_container #emptyAiTag').style.display = '';
            savebtn.disabled = true;
            aiChips.chips = [];
        },
        onFailure: (error: any) => {
            console.log(error);
        }
    });
    ajax.send();
}

let generatebtn: Button = new Button({ cssClass: 'e-btn e-outline e-primary' });
generatebtn.appendTo('#generatebtn');

generatebtn.element.onclick = (): void => {
    let fileObj = (document.getElementById('smartfilemanager') as any).ej2_instances[0];
    const data = fileObj.getSelectedFiles();
    const prompt: string = "Generate tags for the following content.Provide the tags in ordered list format without any undefined or irrelevant values:\n\n";
    const fileContent: string = "File Named as " + data[0].name;
    let inputData: string = prompt + fileContent;
    let aiOutput: any = getAzureChatAIRequest({ messages: [{ role: 'user', content: inputData }] });
    aiOutput.then((result: any) => {
        savebtn.disabled = false;
        const tagsArray: string[] = result
            .split(/\r\n|\n\n|\n/)
            .filter((tag: string) => tag.trim() !== '')
            .map((tag: string) => tag.substring(tag.indexOf(' ') + 1).trim());
        aiChips.chips = tagsArray;
        (document as any).querySelector('.filemanager_container #emptyAiTag').style.display = 'none';
    });
};

let fileChips: ChipList = new ChipList({ chips: [], enableDelete: true, deleted: chipDeleted });
fileChips.appendTo('#fileChips');

function chipDeleted(this: any, args: any) {
    if (fileChips.chips.length == 0) {
        savebtn.disabled = true;
        (document as any).querySelector('.filemanager_container #emptyTag').style.display = '';
    }
    const fileObj = (document.getElementById('smartfilemanager') as any).ej2_instances[0];
    const data = fileObj.getSelectedFiles();
    data[0].tags = [args.text];
    const ajax = new Ajax({
        url: 'https://filemanageraiservice.azurewebsites.net/api/FileManager/RemoveTagsFromFile',
        type: 'POST',
        data: JSON.stringify(data[0]),
        contentType: 'application/json',
        onSuccess: (response: any) => {
            fileChips.chips = JSON.parse(response);
        },
        onFailure: (error: any) => {
            console.log(error);
        }
    });
    ajax.send();
}

let aiChips: ChipList = new ChipList({ chips: [], enableDelete: true, deleted: aiChipDeleted });
aiChips.appendTo('#aiChips');

function aiChipDeleted(this: any, args: any) {
    if (aiChips.chips.length == 0) {
        savebtn.disabled = true;
        (document as any).querySelector('.filemanager_container #emptyAiTag').style.display = '';
    }
}

function Summarize(file: any) {
    dialog.visible = true;
    const ajax = new Ajax({
        url: 'https://filemanageraiservice.azurewebsites.net/api/FileManager/ExtractTextFromFile',
        type: 'POST',
        data: JSON.stringify(file),
        contentType: 'application/json',
        onSuccess: (response: any) => {
            let fileContent: string = response;
            const prompt: string = "You are a helpful assistant. Your task is to analyze the provided text and generate short summary. Provide the summary with highlighted topic in ordered list html format without additional contents:\n\n";
            let inputData: string = prompt + fileContent;
            let aiOutput: any = getAzureChatAIRequest({ messages: [{ role: 'user', content: inputData }] });
            aiOutput.then((result: any) => {
                dialog.content = "<span>" + result + "</span>";
            });
        },
        onFailure: (error: any) => {
            dialog.content = "<span>Something went wrong, Please try again!</span>";
            console.error('Error:', error);
        }
    });
    ajax.send();
}