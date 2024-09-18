import {
    FileManagerComponent, Inject, MenuClickEventArgs, MenuOpenEventArgs,
    NavigationPane, DetailsView, Toolbar
} from "@syncfusion/ej2-react-filemanager"
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import { Ajax } from "@syncfusion/ej2-base";
import { ButtonComponent, ChipListComponent } from "@syncfusion/ej2-react-buttons";
import { getAzureChatAIRequest } from "../../azure-openai";
import './smart-filemanager.css';
import { useState } from "react";


function SmartFileManager() {
    let dialog: DialogComponent;
    let fileChips: ChipListComponent;
    let aiChips: ChipListComponent;
    let fileManagerObj: FileManagerComponent;
    let isVisible: boolean = false;
    const [isDisabled, setDisabled] = useState(true);
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

    function dialogOverlay(): void {
        dialog.hide();
        dialog.visible = false;
        dialog.content = "<span>Loading...</span>";
    }

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

    function onFileOpen(args: any) {
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
            fileManagerObj.toolbarItems.filter((items: any) => items.name == 'Quick Summary')[0].visible = false;
        }
    }

    function fileSelected(args: any) {
        var file = args.fileDetails;
        if (['.txt', '.docx', '.pdf'].includes(file.type) && fileManagerObj.selectedItems.length == 1) {
            fileManagerObj.toolbarItems.filter((items: any) => items.name == 'Quick Summary')[0].visible = true;
        }
        else {
            fileManagerObj.toolbarItems.filter((items: any) => items.name == 'Quick Summary')[0].visible = false;
        }
    }

    function menuOpen(args: MenuOpenEventArgs) {
        if (args.items) {
            const manageTagsItem = 'Manage Tags';
            if (args.menuType === 'file' && fileManagerObj.selectedItems.length > 1) {
                if (!(fileManagerObj as any).contextmenuModule.disabledItems.includes(manageTagsItem)) {
                    (fileManagerObj as any).contextmenuModule.disabledItems.push(manageTagsItem);
                }
            } else {
                const index = (fileManagerObj as any).contextmenuModule.disabledItems.indexOf(manageTagsItem);
                if (index !== -1) {
                    (fileManagerObj as any).contextmenuModule.disabledItems.splice(index, 1);
                }
            }
            for (let i: number = 0; i < args.items.length; i++) {
                if (args.items[i].id === fileManagerObj.element.id + '_cm_managetags') {
                    args.items[i].iconCss = 'e-icons e-bookmark';
                }
            }
        }
    }

    function menuClick(args: MenuClickEventArgs) {
        if (args.item && args.item.text === 'Manage Tags') {
            manageTags(args);
        }
    }

    function manageTags(args: any) {
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

    function closeTagContainer() {
        (document as any).querySelector('.filemanager_container #tags').style.display = 'none';
        fileChips.chips = [];
        aiChips.chips = [];
        setDisabled(true);
    }
    function fileSelection() {
        closeTagContainer();
    }

    function onSend(args: any) {
        if (args.action == 'search') {
            const customData = JSON.parse(args.ajaxSettings.data);
            customData.isTagSearch = true;
            args.ajaxSettings.data = JSON.stringify(customData);
        }
    }

    function saveClick() {
        let fileObj = (document.getElementById('smartfilemanager') as any).ej2_instances[0];
        const data = fileObj.getSelectedFiles();
        data[0].tags = aiChips.chips;
        const ajax = new Ajax({
            url: 'https://filemanageraiservice.azurewebsites.net/api/FileManager/SaveTagsToFile',
            type: 'POST',
            data: JSON.stringify(data[0]),
            contentType: 'application/json',
            onSuccess: (response: any) => {
                fileChips.chips = JSON.parse(response);
                (document as any).querySelector('.filemanager_container #emptyTag').style.display = 'none';
                (document as any).querySelector('.filemanager_container #emptyAiTag').style.display = '';
                setDisabled(true);
                aiChips.chips = [];
            },
            onFailure: (error: any) => {
                console.log(error);
            }
        });
        ajax.send();
    }

    const generateTags = (): void => {
        let fileObj = (document.getElementById('smartfilemanager') as any).ej2_instances[0];
        const data = fileObj.getSelectedFiles();
        const prompt: string = "Generate tags for the following content.Provide the tags in ordered list format without any undefined or irrelevant values:\n\n";
        const fileContent: string = "File Named as " + data[0].name;
        let inputData: string = prompt + fileContent;
        let aiOutput: any = getAzureChatAIRequest({ messages: [{ role: 'user', content: inputData }] });
        aiOutput.then((result: any) => {
            setDisabled(false);
            const tagsArray: string[] = result
                .split(/\r\n|\n\n|\n/)
                .filter((tag: string) => tag.trim() !== '')
                .map((tag: string) => tag.substring(tag.indexOf(' ') + 1).trim());
            aiChips.chips = tagsArray;
            (document as any).querySelector('.filemanager_container #emptyAiTag').style.display = 'none';
        });
    };

    function chipDeleted(args: any) {
        if (fileChips.chips.length == 0) {
            setDisabled(true);
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

    function aiChipDeleted() {
        if (aiChips.chips.length == 0) {
            setDisabled(true);
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

    return (
        <>
            <div className="description-container e-card">
                <div className='e-card-content '>
                    <p>
                        The React File Manager is integrated with AI, offering Smart Search, Content Summary, and Intelligent Organization. Smart Search enables quick retrieval of files through advanced sematic search capabilities, while Content Summary provides brief overviews of file content. Intelligent Organization automatically categorizes files for easier management and navigation.
                        Know more <a target="_blank" href="https://github.com/syncfusion/smart-ai-samples/blob/master/react/src/ai-components/filemanager/Readme.md">here</a>.
                    </p>
                </div>
            </div>
            <div className="filemanager_container">
                <FileManagerComponent id='smartfilemanager'
                    ref={fileManager => fileManagerObj = fileManager as FileManagerComponent}
                    ajaxSettings={{
                        url: hostUrl + 'api/FileManager/FileOperations',
                        getImageUrl: hostUrl + 'api/FileManager/GetImage',
                        uploadUrl: hostUrl + 'api/FileManager/Upload',
                        downloadUrl: hostUrl + 'api/FileManager/Download'
                    }}
                    height='520px'
                    toolbarItems={toolbarItems}
                    contextMenuSettings={{
                        file: ["Manage Tags", "|", "Cut", "Copy", "|", "Delete", "Rename", "|", "Details"],
                        folder: ["Open", "|", "Cut", "Copy", "Paste", "|", "Delete", "Rename", "|", "Details"],
                        layout: ["SortBy", "View", "Refresh", "|", "Paste", "|", "NewFolder", "|", "Details", "|", "SelectAll"],
                        visible: true
                    }}
                    searchSettings={{ allowSearchOnTyping: false }}
                    fileOpen={onFileOpen}
                    fileSelect={fileSelected}
                    menuOpen={menuOpen}
                    menuClick={menuClick}
                    fileSelection={fileSelection}
                    beforeSend={onSend}
                    toolbarClick={toolbarClick}
                >
                    <DialogComponent id="customTbarDialog"
                        ref={dialogObj => dialog = dialogObj as DialogComponent}
                        header="File Summary"
                        content="<span>Loading...</span>"
                        target={document.getElementById('filemanager') as HTMLElement}
                        showCloseIcon={true}
                        visible={isVisible}
                        isModal={true}
                        height='70%'
                        width='600px'
                        overlayClick={dialogOverlay}
                        close={dialogOverlay}
                    ></DialogComponent>
                    <Inject services={[NavigationPane, DetailsView, Toolbar]} />
                </FileManagerComponent>
                {/* Tag Container */}
                <div id="tags" className="tags" style={{ display: "none" }}>
                    <div id="tagContainer">
                        <div className="title-container">
                            <strong>Existing File Tags:</strong>
                            <ButtonComponent id="closebtn"
                                iconCss='e-icons e-close' cssClass='e-small'
                                onClick={closeTagContainer}
                            ></ButtonComponent>
                        </div>
                        <br />
                        <p id="emptyTag" style={{ display: "none" }}>No tags available</p>
                        <div id="fileTags" className="scrollable-container">
                            <ChipListComponent id="fileChips" aria-label="inputChips"
                                ref={chipList => fileChips = chipList as ChipListComponent}
                                chips={[]} enableDelete={true} deleted={chipDeleted}
                            ></ChipListComponent>
                        </div>
                        <br />
                        <strong style={{ marginBottom: "10px" }}>AI suggested File Tags:</strong>
                        <p id="emptyAiTag">Click <strong>"Generate AI Tags"</strong> button to get
                            suggested tags from AI.</p>
                        <div id="aiTags" className="scrollable-container">
                            <ChipListComponent id="aiChips" aria-label="inputChips"
                                ref={chipList => aiChips = chipList as ChipListComponent}
                                chips={[]} enableDelete={true} deleted={aiChipDeleted}
                            ></ChipListComponent>
                        </div>
                        <div className="button-container">
                            <ButtonComponent id="savebtn"
                                cssClass='e-btn e-outline e-primary' disabled={isDisabled}
                                onClick={saveClick}
                            >Save AI Tags</ButtonComponent>
                            <ButtonComponent id="generatebtn"
                                cssClass='e-btn e-outline e-primary'
                                onClick={generateTags}
                            >Generate AI Tags</ButtonComponent>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SmartFileManager