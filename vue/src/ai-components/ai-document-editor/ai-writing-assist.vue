<template>
    <div id="desc-container">
        <h2 style="text-align: center;">Smart Write</h2>
        <div class="description-container e-card">
            <div class='e-card-content '>
                <p>The Writing Assist feature in the Syncfusion Vue Document Editor helps users generate new
                    content based on their ideas or prompts. It integrates seamlessly into the editor, suggesting
                    relevant text that can be directly inserted into the document, facilitating a smooth writing
                    process. Know more <a
                        href="https://github.com/syncfusion/smart-ai-samples/blob/master/vue/src/ai-components/ai-document-editor/Readme.md">here</a>.
                </p>
            </div>
        </div>
    </div>
    <div ref="doc_titlebar" class="e-de-ctn-title"></div>
    <ejs-documenteditorcontainer ref="container" id="documentEditor" :enableToolbar='true' height='99%'
        serviceUrl='https://services.syncfusion.com/js/production/api/documenteditor/' :toolbarItems="docToolbarItems"
        :customContextMenuSelect='customContextMenuSelect' :toolbarClick='toolbarClick'>

    </ejs-documenteditorcontainer>
    <ejs-dialog ref="dialog" header='Generate Content' :showCloseIcon='true' :buttons="dialogButtons" :visible='false'
        width='50%' height='auto' :isModal='true' :close='onclose' target="#documentEditor" :beforeOpen='onOpen'>
        <div>
            <div ref="editableDiv" id="e-de-editable-div" contentEditable="true" style="height: 100px;"></div>
            <ejs-toolbar ref='toolbar' :items="toolbarItems" :created='onToolbarCreated'></ejs-toolbar>
        </div>
    </ejs-dialog>
</template>
<script lang="ts">
import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-vue-documenteditor';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-vue-popups';
import { ToolbarComponent } from '@syncfusion/ej2-vue-navigations';
import { ComboBox } from '@syncfusion/ej2-vue-dropdowns';
import { ClickEventArgs, MenuItemModel } from '@syncfusion/ej2-vue-navigations';
import { CustomContentMenuEventArgs, CustomToolbarItemModel } from '@syncfusion/ej2-vue-documenteditor';
import { ChangeEventArgs } from '@syncfusion/ej2-vue-dropdowns';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-vue-popups';
import { TitleBar } from './title-bar';
import { getAzureChatAIRequest } from '../common/ai-models';

//azure part

interface Message {
    role: string;
    content: string;
}

interface AzureAIRequestOptions {
    messages: Message[];
    model: string;
}

let toolItem: CustomToolbarItemModel = {
    prefixIcon: "e-icons e-file-new",
    text: "AI Write",
    id: "write"
}

export default {
    components: {
        'ejs-documenteditorcontainer': DocumentEditorContainerComponent,
        'ejs-dialog': DialogComponent,
        'ejs-toolbar': ToolbarComponent
    },
    data() {
        return {
            seviceurl: 'https://services.syncfusion.com/js/production/api/documenteditor/',
            docToolbarItems: ['New', 'Open', 'Separator', toolItem, 'Separator', 'Undo', 'Redo', 'Separator', 'Image', 'Table', 'Hyperlink', 'Bookmark', 'TableOfContents', 'Separator', 'Header', 'Footer', 'PageSetup', 'PageNumber', 'Break', 'InsertFootnote', 'InsertEndnote', 'Separator', 'Find', 'Separator', 'Comments', 'TrackChanges', 'Separator', 'LocalClipboard', 'RestrictEditing', 'Separator', 'FormFields', 'UpdateFields', 'ContentControl'] as CustomToolbarItemModel[],
            toneValue: 'Professional',
            formatValue: 'Paragraph',
            lengthValue: 'Medium',
            outList: [],
            toneList: ['Professional', 'Friendly', 'Instructional', 'Marketing', 'Academic', 'Legal', 'Technical', 'Narrative', 'Direct'],
            formatValueList: ['Paragraph', 'Blog post', 'Technical Documentation', 'Report', 'Research Papers', 'Tutorial', 'Meeting Notes'],
            lengthList: ['Short', 'Medium', 'Long'],
            dialogButtons: [
                {
                    'click': () => {
                        this.onInsertContent();
                        this.clearContent();
                    },
                    buttonModel: {
                        isPrimary: true,
                        content: 'Insert',
                        cssClass: 'e-dig-insert'
                    },
                },
                {
                    'click': this.dialogButtonClick,
                    buttonModel: {
                        content: 'Cancel',
                        cssClass: 'e-flat'
                    }
                }
            ] as ButtonPropsModel[],
        }


    },
    methods: {
        onclose: function (): void {
            this.clearContent();
        },
        onOpen: async function (): Promise<void> {
            await this.onChangeToolbarVisibility(true);
        },
        setPlaceholder: function (): void {
            const editableDiv = this.$refs.editableDiv;
            if (editableDiv?.innerHTML.trim() === "") {
                editableDiv!.innerHTML = "Please provide the topic or idea for content generation...";
                editableDiv!.classList.add("placeholder"); // Add a class for styling
            }
        },
        removePlaceholder: function (): void {
            const editableDiv = this.$refs.editableDiv;
            if (editableDiv!.innerHTML === "Please provide the topic or idea for content generation...") {
                editableDiv!.innerHTML = "";
                editableDiv!.classList.remove("placeholder");
            }
        },
        onInsertContent: function (): void {
            let container = this.$refs.container.ej2Instances;
            let dialog = this.$refs.dialog.ej2Instances;
            const editableDiv = document.getElementById("e-de-editable-div");
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
                        this.clearContent();
                        dialog.hide();
                    }
                }
            };
            let sfdt: any = {
                content: response,
                type: '.Html',
            };
            http.send(JSON.stringify(sfdt));
        },
        clearContent: function (): void {
            const editableDiv = this.$refs.editableDiv;
            editableDiv!.innerHTML = '';
            this.setPlaceholder();
            //onChangeBtnState(true);
            this.onChangeToolbarVisibility(true);
        },
        onChangeToolbarVisibility: async function (showPryItem: boolean) {
            const toolbar = this.$refs.toolbar.ej2Instances;
            let isPrimary: boolean = true;
            if (!showPryItem) {
                isPrimary = false;
            }
            for (let i = 0; i < 5; i++) {
                toolbar.items[i].visible = isPrimary;
                toolbar.items[i + 5].visible = !isPrimary;
            }
        },
        updateIndex: function () {
            const editableDiv = this.$refs.editableDiv;
            let element: HTMLInputElement = document.getElementById('numeric')! as HTMLInputElement;
            let text: string = editableDiv!.innerHTML;
            if (this.outList.length > 0 && this.outList.indexOf(text) !== -1) {
                element.value = (this.outList.indexOf(text) + 1).toString();
            } else {
                element.value = '0';
            }
        },
        onToolbarCreated: async function () {
            // this.$refs.dialog.show();
            this.updateIndex();
        },
        dialogButtonClick: function () {
            this.clearContent();
            this.$refs.dialog?.hide();
        },
        onSettingsClick: function () {
            this.onChangeToolbarVisibility(false);
        },
        onCloseSecondaryToolbar: function () {
            this.onChangeToolbarVisibility(true);
        },
        onGenerate: async function (options: AzureAIRequestOptions): Promise<void> {
            const editableDiv = this.$refs.editableDiv;
            this.outList = [];
            for (let i = 0; i < 3; i++) {
                const response = await getAzureChatAIRequest(options);
                if (response && this.outList.indexOf(response) === -1) {
                    this.outList.push(response);
                } else {
                    i--;
                }
            }
            if (this.outList.length > 0) {
                editableDiv!.innerHTML = this.outList[0];
            }
        },
        onGenerateClick: async function () {
            const editableDiv = this.$refs.editableDiv;
            const toolbar = this.$refs.toolbar;
            createSpinner({
                target: document.getElementById('dialog') as HTMLElement,
            });
            showSpinner(document.getElementById('dialog') as HTMLElement);
            let text: string = editableDiv!.innerText;
            if (toolbar.items[3].text === 'Generate') {
                const options: AzureAIRequestOptions = {
                    messages: [
                        { role: "system", content: `You are a helpful assistant. Your task is to generate content based on the provided text. Please adjust the text to reflect a tone of '${this.toneValue}', formatted in '${this.formatValue}' style, and maintain a length of '${this.lengthValue}'. Always respond in proper text format not a md format. Always respond in proper HTML format, excluding <html>, <head>, and <body> tags.` },
                        { role: "user", content: text }
                    ],
                    model: "gpt-4",
                };
                await this.onGenerate(options);
                toolbar.items[3].text = 'Rewrite';
            } else {
                const options: AzureAIRequestOptions = {
                    messages: [
                        { role: "system", content: `You are a helpful assistant. Your task is to generate content based on the provided text. Please adjust the text to reflect a tone of '${this.toneValue}', formatted in '${this.formatValue}' style, and maintain a length of '${this.lengthValue}'. Always respond in proper text format not a md format. Always respond in proper HTML format, excluding <html>, <head>, and <body> tags.` },
                        { role: "user", content: text }
                    ],
                    model: "gpt-4",
                };
                await this.onGenerate(options);
            }
            //await onChangeBtnState(false);
            hideSpinner(document.getElementById('dialog') as HTMLElement);
        },
        moveToNext: function () {
            const editableDiv = this.$refs.editableDiv;
            let text: string = editableDiv!.innerHTML;
            let index: number = this.outList.indexOf(text);
            if (index + 1 < this.outList.length) {
                editableDiv!.innerHTML = this.outList[index + 1];
                this.updateIndex();
            }
        },
        moveToPrevious: function () {
            const editableDiv = this.$refs.editableDiv;
            let text: string = editableDiv!.innerHTML;
            let index: number = this.outList.indexOf(text);
            if (index - 1 >= 0) {
                editableDiv!.innerHTML = this.outList[index - 1];
                this.updateIndex();
            }
        },
        onToneChange: function (args: ChangeEventArgs): void {
            this.toneValue = args.value as string;
        },
        onFormatChange: function (args: ChangeEventArgs): void {
            this.formatValue = args.value as string;
        },
        onLengthChange: function (args: ChangeEventArgs): void {
            this.lengthValue = args.value as string;
        },
        customContextMenuSelect: function (args: CustomContentMenuEventArgs): void {
            let container = this.$refs.container;
            let dialog = this.$refs.dialog;
            let item: string = args.id;
            let id: string = container.element.id;
            switch (item) {
                case id + '_editorwrite':
                    dialog.show();
                    break;
            }
        },
        toolbarClick: function (args: ClickEventArgs): void {
            let dialog = this.$refs.dialog;
            switch (args.item.id) {
                case 'write':
                    dialog.show();
                    break;
            }
        }
    },
    created() {
        this.toolbarItems = [
            { prefixIcon: 'e-icons e-chevron-left', click: this.moveToPrevious },
            {
                type: 'Input', align: 'Left', cssClass: 'page-count', template: "<div><input type='text' id='numeric' style='width: 20px;padding-left: 10px;'> <span id=total-page> of 3 </span> </input></div>"
            },
            { prefixIcon: 'e-icons e-chevron-right', click: this.moveToNext },
            { text: 'Generate', align: 'Right', click: this.onGenerateClick},
            { prefixIcon: 'e-icons e-settings', align: 'Right', click: this.onSettingsClick },

            { prefixIcon: 'e-icons e-close', align: 'Left', click: this.onCloseSecondaryToolbar},
            {
                type: 'Input', align: 'Left', template: new ComboBox({ width: '125px', change: this.onToneChange, value: this.toneValue, dataSource: this.toneList, popupWidth: '125px', showClearButton: false, readonly: false })
            },
            {
                type: 'Input', align: 'Left', template: new ComboBox({ width: '100px', change: this.onFormatChange, value: this.formatValue, dataSource: this.formatValueList, popupWidth: '200px', showClearButton: false, readonly: false })
            },
            {
                type: 'Input', align: 'Left', template: new ComboBox({ width: '100px', change: this.onLengthChange, value: this.lengthValue, dataSource: this.lengthList, popupWidth: '100px', showClearButton: false, readonly: false })
            },
            { text: 'Rewrite', click: this.onGenerateClick },
        ];
    },
    mounted() {
        let container = this.$refs.container;

        let titleBar: TitleBar = new TitleBar(this.$refs.doc_titlebar, container.documentEditor, true);
        if (container.documentEditor) {
            container.documentEditor.documentName = 'Getting Started';
            titleBar.updateDocumentTitle();
        }
        let menuItems: MenuItemModel[] = [
            {
                text: 'AI Write',
                id: 'write',
                iconCss: 'e-icons e-file-new'
            }];

        container.documentEditor?.contextMenu.addCustomMenu(menuItems, false);


        const editableDiv = this.$refs.editableDiv;
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

        const toolbar = this.$refs.toolbar;
        editableDiv?.addEventListener('input', function () {
            // if (dialog.buttons[0] && dialog.buttons[0].buttonModel) {
            //     dialog.buttons[0].buttonModel.disabled = false;
            // }
            toolbar.items[3].disabled = false;
        });

        async function onChangeBtnState(isShow: boolean) {
            const toolbar = this.$refs.toolbar;
            toolbar.items[0].disabled = isShow;
            toolbar.items[2].disabled = isShow;
            toolbar.refresh();
            this.updateIndex();
            let element: HTMLElement = document.getElementById('total-page')!;
            if (!isShow) {
                element.innerHTML = ' of ' + this.outList.length;
            } else {
                element.innerHTML = ' of 0';
            }
        }
    },
    provide: {
        DocumentEditorContainer: [Toolbar]
    }
}
</script>

<style>

#e-de-editable-div {
    border: 1px solid #e0e0e0;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    overflow-y: auto;
}

#e-d-toolbar {
    margin: 0px 20px 10px 20px;
}

.e-de-ctn-title, #documentEditor, #DocumentEditor {
    width: 98% !important;
    margin-left: 1%;
    margin-right: 1%;
}

.ej2-new {
    height: 590px;
}

#documenteditor_titlebar {
    border-bottom: 1px solid #2B3481;
    height: 6%;
    line-height: 26px;
    font-size: 12px;
    font-family: inherit;
}

#documenteditor_title_contentEditor {
    height: 26px;
    max-width: 85%;
    width: auto;
    overflow: hidden;
    display: inline-block;
    padding-left: 4px;
    padding-right: 4px;
    margin: 5px;
}

.single-line {
    cursor: text !important;
    outline: none;
}

.single-line:hover {
    border-color: #e4e4e4 !important;
}

[contenteditable="true"].single-line {
    white-space: nowrap;
    border-color: #e4e4e4 !important;
}

/** Document editor sample level font icons*/

@font-face {
    font-family: 'Sample brower icons';
    src: url(data:application/x-font-ttf;charset=utf-8;base64,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bwBuAHQAIABnAGUAbgBlAHIAYQB0AGUAZAAgAHUAcwBpAG4AZwAgAFMAeQBuAGMAZgB1AHMAaQBvAG4AIABNAGUAdAByAG8AIABTAHQAdQBkAGkAbwB3AHcAdwAuAHMAeQBuAGMAZgB1AHMAaQBvAG4ALgBjAG8AbQAAAAACAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEMBAgEDAQQBBQEGAQcBCAEJAQoBCwEMAQ0BDgEPARABEQESARMBFAEVARYBFwEYARkBGgEbARwBHQEeAR8BIAEhASIBIwEkASUBJgEnASgBKQEqASsBLAEtAS4BLwEwATEBMgEzATQBNQE2ATcBOAE5AToBOwE8AT0BPgE/AUABQQFCAUMBRAALU3Ryb2tlU3R5bGUIQm9va21hcmsHUGljdHVyZQRGaW5kDU91dHNpZGVCb3JkZXIHSnVzdGlmeQVDbG9zZQ5EZWNyZWFzZUluZGVudBVQaXhlbEFsaWduQ2VudGVyVGFibGUPQmFja2dyb3VuZENvbG9yC0FsaWduQm90dG9tCVBhZ2VTZXR1cA5IaWdobGlnaHRDb2xvcgtTdXBlcnNjcmlwdAVUYWJsZQRVbmRvC0luc2VydEJlbG93CVRvcEJvcmRlcgpQYWdlTnVtYmVyEEFsaWduQ2VudGVyVGFibGUOSW5jcmVhc2VJbmRlbnQEQm9sZAlBbGlnbkxlZnQGRm9vdGVyC0luc2VydFJpZ2h0CVVuZGVybGluZQpJbnNlcnRMZWZ0BExvY2sGSGVhZGVyDVN0cmlrZXRocm91Z2gIQ2xlYXJBbGwLUmlnaHRCb3JkZXIKQWxpZ25SaWdodARPcGVuClN0cm9rZVNpemUFUHJpbnQLRGVsZXRlVGFibGUJRm9udENvbG9yDUluc2lkZUJvcmRlcnMKRGVsZXRlUm93cwhEb3dubG9hZAtMaW5lU3BhY2luZxRJbnNpZGVWZXJ0aWNhbEJvcmRlcghBbGlnblRPcARSZWRvDEJvdHRvbUJvcmRlcgNOZXcFUGFzdGUHQnVsbGV0cwRDZWxsDURlbGV0ZUNvbHVtbnMKQWxsQm9yZGVycwlTdWJzY3JpcHQQU2hvd0hpZGVQcm9wZXJ0eQ5UYWJsZU9mQ29udGVudAZJdGFsaWMWSW5zaWRlSG9yaXpvbmRhbGJvcmRlcgtMZWZ0Qm9yZGVycwlOdW1iZXJpbmcETGluawtBbGlnbkNlbnRlcgtJbnNlcnRBYm92ZQZCcmVha3MITmV4dFBhZ2USU2VsZWN0ZnJvbUNvbXB1dGVyCVBhZ2VCcmVhawAAAAA=) format('truetype');
    font-weight: normal;
    font-style: normal;
}

[class^="e-de-icon-"],
[class*=" e-de-icon-"] {
    font-family: 'Sample brower icons' !important;
}

.e-de-icon-Print:before {
    content: "\e723";
}

.e-de-icon-Download:before {
    content: "\e728";
}

html,
body {
    height: 98%;
    margin: 0;
    padding: 0;
}

</style>