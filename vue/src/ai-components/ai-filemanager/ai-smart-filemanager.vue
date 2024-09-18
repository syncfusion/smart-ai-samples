<template>
    <div class="control-section">
        <div class='control-wrapper'>
            <div class="filemanager_container">
                <ejs-filemaneger ref="filemanager" id='smartfilemanager' :ajaxSettings="ajaxSettings" height='520px'
                    :toolbarItems="toolbarItems" :contextMenuSettings="contextMenuSettings" searchSettings:
                    :searchSettings='{ allowSearchOnTyping: false }' :fileOpen='onFileOpen' :fileSelect='fileSelected'
                    :menuOpen='menuOpen' :menuClick='menuClick' :fileSelection='fileSelection' :beforeSend='onSend'
                    :toolbarClick='toolbarClick'>
                </ejs-filemaneger>
                <ejs-dialog ref="dialog" header="File Summary" content="<span>Loading...</span>" target='#smartfilemanager' :showCloseIcon='true'
                    :visible='isVisible' :isModal="true" height='70%' width='600px' :overlayClick='dialogOverlay'
                    :close='dialogOverlay'>
                </ejs-dialog>
                <!-- Tag container -->
                <div id="tags" class="tags" style="display: none;">
                    <div id="tagContainer">
                        <div class="title-container">
                            <strong>Existing File Tags:</strong>
                            <ejs-button id="closebtn" iconCss='e-icons e-close' cssClass='e-small'
                                @click="closeTagContainer"></ejs-button>
                        </div>
                        <br />
                        <p id="emptyTag" style="display: none;">No tags available</p>
                        <div id="fileTags" class="scrollable-container">
                            <ejs-chip ref="fileChips" id="fileChips" aria-label="inputChips"
                            :chips='[]' :enableDelete='true' :deleted='chipDeleted'></ejs-chip>
                        </div>
                        <br />
                        <strong style="margin-bottom: 10px;">AI suggested File Tags:</strong>
                        <p id="emptyAiTag">Click <strong>"Generate AI Tags"</strong> button to get
                            suggested tags from AI.</p>
                        <div id="aiTags" class="scrollable-container">
                            <ejs-chip ref="aiChips" id="aiChips" aria-label="inputChips"
                            :chips='[]' :enableDelete='true' :delete='aiChipDeleted'></ejs-chip>
                        </div>
                        <div class="button-container">
                            <ejs-button ref='savebtn' id="savebtn" cssClass='e-btn e-outline e-primary' :disabled='true'
                                @click="saveClick">Save AI Tags</ejs-button>
                            <ejs-button id="generatebtn" cssClass='e-btn e-outline e-primary'
                            @click=generateClick>Generate AI Tags</ejs-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Toolbar, NavigationPane, DetailsView, ContextMenu, FileManagerComponent } from '@syncfusion/ej2-vue-filemanager';
import { MenuClickEventArgs, MenuOpenEventArgs } from '@syncfusion/ej2-vue-filemanager';
import { ButtonComponent, ChipListComponent } from '@syncfusion/ej2-vue-buttons';
import { Ajax } from '@syncfusion/ej2-base';
import { DialogComponent } from '@syncfusion/ej2-vue-popups';
import { getAzureChatAIRequest } from '../common/ai-models';

const hostUrl = 'https://filemanageraiservice.azurewebsites.net/';

export default {
    components: {
        'ejs-dialog': DialogComponent,
        'ejs-filemaneger': FileManagerComponent,
        'ejs-button': ButtonComponent,
        'ejs-chip': ChipListComponent
    },
    data() {
        return {
            isVisible: false,
            toolbarItems: [
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
            ] as any,
            ajaxSettings: {
                url: hostUrl + 'api/FileManager/FileOperations',
                getImageUrl: hostUrl + 'api/FileManager/GetImage',
                uploadUrl: hostUrl + 'api/FileManager/Upload',
                downloadUrl: hostUrl + 'api/FileManager/Download'
            },
            contextMenuSettings: { file: ["Manage Tags", "|", "Cut", "Copy", "|", "Delete", "Rename", "|", "Details"], folder: ["Open", "|", "Cut", "Copy", "Paste", "|", "Delete", "Rename", "|", "Details"], layout: ["SortBy", "View", "Refresh", "|", "Paste", "|", "NewFolder", "|", "Details", "|", "SelectAll"], visible: true },
        }
    },
    methods: {
        dialogOverlay: function (): void {
            this.$refs.dialog.hide();
            this.isVisible = false;
            this.$refs.dialog.ej2Instances.content = "<span>Loading...</span>";
        },
        toolbarClick: function (args: any) {
            const dialog = this.$refs.dialog.ej2Instances;
            if (args.item.text == 'Quick Summary') {
                if (args.fileDetails[0].permission == null) {
                    this.Summarize(args.fileDetails[0]);
                }
                else if (args.fileDetails[0].permission != null && !args.fileDetails[0].permission.read) {
                    dialog.visible = true;
                    dialog.content = "<span>" + args.fileDetails[0].name + " is not accessible. You do not have permission to read this file." + "</span>";
                }
            }
        },
        onFileOpen: function (args: any) {
            const dialog = this.$refs.dialog.ej2Instances;
            var file = args.fileDetails;
            if (file != null && file.isFile && ['.txt', '.docx', '.pdf'].indexOf(file.type) !== -1) {
                if (file.permission == null) {
                    this.Summarize(file);
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
        },
        fileSelected: function (args: any) {
            var file = args.fileDetails;
            const filemanager = this.$refs.filemanager.ej2Instances;
            if (['.txt', '.docx', '.pdf'].indexOf(file.type) !== -1 && filemanager.selectedItems.length == 1) {
                this.toolbarItems.filter((items: any) => items.name == 'Quick Summary')[0].visible = true;
            }
            else {
                this.toolbarItems.filter((items: any) => items.name == 'Quick Summary')[0].visible = false;
            }
        },
        menuOpen: function (args: MenuOpenEventArgs) {
            if (args.items) {
                const manageTagsItem = 'Manage Tags';
                const filemanager = this.$refs.filemanager.ej2Instances;
                if (args.menuType === 'file' && filemanager.selectedItems.length > 1) {
                    if (!filemanager.contextmenuModule.disabledItems.includes(manageTagsItem)) {
                        filemanager.contextmenuModule.disabledItems.push(manageTagsItem);
                    }
                } else {
                    const index = filemanager.contextmenuModule.disabledItems.indexOf(manageTagsItem);
                    if (index !== -1) {
                        filemanager.contextmenuModule.disabledItems.splice(index, 1);
                    }
                }
                for (let i: number = 0; i < args.items.length; i++) {
                    if (args.items[i].id === filemanager.element.id + '_cm_managetags') {
                        args.items[i].iconCss = 'e-icons e-bookmark';
                    }
                }
            }
        },
        menuClick: function (args: MenuClickEventArgs) {
            if (args.item && args.item.text === 'Manage Tags') {
                this.manageTags(args);
            }
        },
        manageTags: function (args: any) {
            const fileChips = this.$refs.fileChips.ej2Instances;
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
        },
        closeTagContainer: function (this: any) {
            const fileChips = this.$refs.fileChips.ej2Instances;
            const aiChips = this.$refs.aiChips.ej2Instances;
            const savebtn = this.$refs.savebtn.ej2Instances;
            (document as any).querySelector('.filemanager_container #tags').style.display = 'none';
            fileChips.chips = [];
            aiChips.chips = [];
            savebtn.disabled = true;
        },
        fileSelection: function (args: any) {
            this.closeTagContainer();
        },
        onSend: function (args: any) {
            if (args.action == 'search') {
                const customData = JSON.parse(args.ajaxSettings.data);
                customData.isTagSearch = true;
                args.ajaxSettings.data = JSON.stringify(customData);
            }
        },

        chipDeleted: function (args: any) {
            const fileChips = this.$refs.fileChips.ej2Instances;
            const savebtn = this.$refs.savebtn.ej2Instances;
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
        },

        aiChipDeleted: function (args: any) {
            const aiChips = this.$refs.aiChips.ej2Instances;
            const savebtn = this.$refs.savebtn.ej2Instances;
            if (aiChips.chips.length == 0) {
                savebtn.disabled = true;
                (document as any).querySelector('.filemanager_container #emptyAiTag').style.display = '';
            }
        },
        Summarize: function (file: any) {
            const dialog = this.$refs.dialog.ej2Instances;
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
        },
        saveClick: function () {
            const fileChips = this.$refs.fileChips.ej2Instances;
            const savebtn = this.$refs.savebtn.ej2Instances;
            const aiChips = this.$refs.aiChips.ej2Instances;
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
        },
        generateClick: function () {
            const aiChips = this.$refs.aiChips.ej2Instances;
            const savebtn = this.$refs.savebtn.ej2Instances;
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
        }
    },
    provide: {
        filemanager: [Toolbar, NavigationPane, DetailsView, ContextMenu]
    }
}
</script>