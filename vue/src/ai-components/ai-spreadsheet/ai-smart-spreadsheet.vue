<template>
    <div id="desc-container">
        <h2 style="text-align: center;">Smart SpreadSheet</h2>
        <div class="description-container e-card">

            <div class='e-card-content '>
                <p>The Spreadsheet, enhanced with AI, offers feature like automatically analyze & summarize content,
                    generate forumula and validate forumulas.Know more <a
                        href="https://github.com/syncfusion/smart-ai-samples/blob/master/vue/src/ai-components/ai-spreadsheet/Readme.md">here</a>.
                </p>
            </div>
        </div>
    </div>
    <div id="root-container">
        <ejs-spreadsheet ref="spreadsheet" height="708px" :created="onCreated">
            <e-sheets>
                <e-sheet :name="'Gross Pay'" :ranges="ranges" :rows="rows" :columns="columns">
                    
                </e-sheet>
            </e-sheets>
        </ejs-spreadsheet>
        <ejs-sidebar id="side-bar" ref="sidebar" :width="'500px'" :target="'.maincontent'" :position="'Right'"
            :closeOnDocumentClick="false" :showBackdrop="false">
            <ejs-aiassistview id="defaultAIAssistView" ref="aiAssistView"
                promptPlaceholder="Type your prompt for assistance..." :prompts="prompts"
                :promptRequest="promptHandler">
                <div>
                    <ejs-button id="close" class="e-btn close-btn"
                    :style="{ float: 'right', fontSize: '24px', border: 'none', background: 'none' }"
                    @click="() => this.$refs.sidebar.hide()">×</ejs-button>
                </div>
                
            </ejs-aiassistview>

        </ejs-sidebar>
        
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SpreadsheetComponent, SheetsDirective, SheetDirective, RangesDirective, RangeDirective, RowsDirective, RowDirective, CellsDirective, CellDirective, ColumnsDirective, ColumnDirective, getCell } from '@syncfusion/ej2-vue-spreadsheet';
import { SidebarComponent } from '@syncfusion/ej2-vue-navigations';
import { ButtonComponent } from '@syncfusion/ej2-vue-buttons';
import { AIAssistViewComponent } from '@syncfusion/ej2-vue-interactive-chat';
import { getAzureChatAIRequest } from '../common/ai-models';
import { grossPay } from './data-source';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

export default defineComponent({
    name: 'App',
    components: {
        'ejs-spreadsheet': SpreadsheetComponent,
        'e-sheets': SheetsDirective,
        'e-sheet': SheetDirective,
        'e-ranges': RangesDirective,
        'e-range': RangeDirective,
        'e-rows': RowsDirective,
        'e-row': RowDirective,
        'e-cells': CellsDirective,
        'e-cell': CellDirective,
        'e-columns': ColumnsDirective,
        'e-column': ColumnDirective,
        'ejs-sidebar': SidebarComponent,
        'ejs-button': ButtonComponent,
        'ejs-aiassistview': AIAssistViewComponent
    },
    data() {
        return {
            prompts: [
                { prompt: '', response: '' }
            ],
            ranges: [{
                dataSource: grossPay,
                startCell: 'A3'
            }],
            rows: [
                {
                    cells: [{
                        value: 'Gross Pay Calculation',
                        style: {
                            fontSize: '20pt', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#B3FFB3',
                            verticalAlign: 'middle'
                        }
                    }]
                },
                {
                    index: 3, cells: [{
                        index: 9, formula: '=B4+6',
                        style: { border: '1px solid #A6A6A6', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold' }
                    }]
                },
                {
                    index: 4, cells: [{
                        index: 9, formula: '=B5+6',
                        style: { border: '1px solid #A6A6A6', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold' }
                    }]
                },
                {
                    index: 5, cells: [{
                        index: 9, formula: '=B6+6',
                        style: { border: '1px solid #A6A6A6', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold' }
                    }]
                },
                {
                    index: 6, cells: [{
                        index: 9, formula: '=B7+6',
                        style: { border: '1px solid #A6A6A6', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold' }
                    }]
                },
                {
                    index: 7, cells: [{
                        index: 9, formula: '=B8+6',
                        style: { border: '1px solid #A6A6A6', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold' }
                    }]
                },
                {
                    index: 8, cells: [{
                        index: 9, formula: '=B9+6',
                        style: { border: '1px solid #A6A6A6', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold' }
                    }]
                },
                {
                    index: 9, cells: [{
                        index: 9, formula: '=B10+6',
                        style: { border: '1px solid #A6A6A6', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold' }
                    }]
                },
                {
                    index: 10, cells: [{
                        index: 9, formula: '=B11+6',
                        style: { border: '1px solid #A6A6A6', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold' }
                    }]
                },
                {
                    index: 11, cells: [{
                        index: 9, formula: '=B12+6',
                        style: { border: '1px solid #A6A6A6', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold' }
                    }]
                },
                {
                    index: 12, cells: [{
                        index: 9, formula: '=B13+6',
                        style: { border: '1px solid #A6A6A6', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold' }
                    }]
                },
                {
                    index: 13,
                    cells: [{
                        index: 7, value: 'Total Gross',
                        style: { border: '1px solid #A6A6A6', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold' }
                    },
                    {
                        index: 8, formula: '=Sum(I4:I13)', format: '$#,##0.00',
                        style: { border: '1px solid #A6A6A6', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold' }
                    }, {
                        index: 9, formula: '=Sum(J4:J13)',
                        style: { border: '1px solid #A6A6A6', textAlign: 'center', verticalAlign: 'middle', fontWeight: 'bold' }
                    }]
                }
            ],
            columns: [
                { width: 88 }, { width: 120 }, { width: 106 }, { width: 98 }, { width: 110 },
                { width: 110 }, { width: 110 }, { width: 98 }, { width: 130 }
            ]
        };
    },
    methods: {
        onCreated(): void {
            const spreadsheet = this.$refs.spreadsheet.ej2Instances;
            spreadsheet.merge('A1:I2');
            spreadsheet.setBorder({ border: '1px solid #A6A6A6' }, 'A1:I13');
            spreadsheet.cellFormat({ textAlign: 'center', verticalAlign: 'middle' }, 'A3:I13');
            spreadsheet.cellFormat({ backgroundColor: '#B3FFB3', fontWeight: 'bold' }, 'A3:I3');
            spreadsheet.numberFormat('$#,##0.00', 'H4:I13');
            spreadsheet.wrap('H3:I3');
            spreadsheet.addRibbonTabs([{
                header: { text: 'AI Assist', iconCss:"e-icons e-assistview-icon" }, content: [
                    {
                        text: 'Full Sheet Analysis', tooltipText: 'Full Sheet Analysis',
                        click: (): void => {
                            this.fullSheetAnalysis();
                        }
                    },
                    {
                        text: 'Validate', tooltipText: 'Validate formulae',
                        click: (): void => {
                            this.formulaValidate();
                        }
                    },
                    {
                        text: 'Generate Formula', tooltipText: 'Generate Formula',
                        click: (): void => {
                            this.generateFormula();
                        }
                    }
                ]
            }]);

            spreadsheet.addDataValidation({ type: 'Time', operator: 'LessThan', value1: '9:00:00 AM', ignoreBlank: false }, 'E4:E13');
            spreadsheet.addDataValidation({ type: 'Time', operator: 'LessThan', value1: '6:00:00 PM', ignoreBlank: false }, 'F4:F13');
            spreadsheet.addDataValidation({ type: 'WholeNumber', operator: 'LessThan', value1: '10', ignoreBlank: false }, 'G4:G13');
            spreadsheet.addDataValidation({ type: 'WholeNumber', operator: 'LessThan', value1: '250', ignoreBlank: false }, 'H4:H13');
            spreadsheet.addDataValidation({ type: 'WholeNumber', operator: 'LessThan', value1: '300', ignoreBlank: false }, 'I4:I13');
        },

        fullSheetAnalysis(): void {
            const spreadsheet = this.$refs.spreadsheet.ej2Instances;
            spreadsheet.saveAsJson().then((data) => {
                const processedString = this.processDataSource(data);
                let query = 'Analyze the full data in this data. ' + processedString;
                let aiOutput = getAzureChatAIRequest({ messages: [{ role: 'user', content: query }] });
                aiOutput.then((result) => {
                    result = this.markdownToPlainText(result);
                    this.renderAssistView(result);
                    this.$refs.sidebar.show();
                });
            });
        },

        formulaValidate(): void {
            const spreadsheet = this.$refs.spreadsheet.ej2Instances;
            const selectedCell = spreadsheet.sheets[spreadsheet.activeSheetIndex].selectedRange;
            let isFormulaAvailable = false;
            if (!isNullOrUndefined(selectedCell)) {
                spreadsheet.getData(selectedCell).then((data) => {
                    const currentCells = Array.from(data.keys());
                    let query: string = 'Validate the below formulae and provide me the problem in it. Strictly provide the data for each validated response in a flat JSON with fields `cell` to hold the spreadsheet cell value and `response` to hold the problem and solution.';
                    for (let a = 0; a < currentCells.length; a++) {
                        const cellFormula: string = data.get(currentCells[a]).formula;
                        if (!isNullOrUndefined(cellFormula)) {
                            isFormulaAvailable = true;
                            query += 'Spreadsheet cell - ' + currentCells[a] + ' - Formula - ' + cellFormula + ' - ' + this.processString(cellFormula);
                        }
                    }
                    if (isFormulaAvailable) {
                        let aiOutput = getAzureChatAIRequest({ messages: [{ role: 'user', content: query }] });
                        aiOutput.then((result) => {
                            let cleanedResponseText = result.split('```json')[1].trim();
                            cleanedResponseText = cleanedResponseText.split("```")[0].trim();
                            const responseJson = JSON.parse(cleanedResponseText);
                            for (let a = 0; a < responseJson.length; a++) {
                                spreadsheet.updateCell({ notes: (responseJson[a]).response }, (responseJson[a]).cell);
                            }
                        });
                    }
                });
            }
        },

        generateFormula(): void {
            this.renderAssistViewForFormula(this.prompts);
            this.$refs.sidebar.show();
        },

        renderAssistViewForFormula(response: any): void {
            const aiInstance = this.$refs.aiAssistView.ej2Instances;
            if (!isNullOrUndefined(aiInstance)) {
                aiInstance.promptRequest = this.promptHandler;
                aiInstance.prompts = this.prompts;
            }
        },

        promptHandler: function (args) {
            let prompt = args.prompt;
            const aiInstance = this.$refs.aiAssistView.ej2Instances;
            const spreadsheet = this.$refs.spreadsheet.ej2Instances;
            spreadsheet.saveAsJson().then((data) => {
                const processedString = this.processDataSource(data);
                let query = prompt + '. Strictly provide the excel formula for the Excel sheet data which is provided as JSON below. /n' + processedString;
                let aiOutput = getAzureChatAIRequest({ messages: [{ role: 'user', content: query }] });
                aiOutput.then((result) => {
                    if (result) {
                        let cleanedResponseText = result.split('```excel')[1].trim();
                        cleanedResponseText = cleanedResponseText.split('```')[0].trim();
                        this.prompts.push({ prompt: prompt, response: cleanedResponseText });
                        aiInstance.prompts = this.prompts;
                    }
                });
            });
        },

        removeKeys: function (array, keysToRemove, cellsKeys) {
            array.forEach(obj => {
                keysToRemove.forEach((key) => {
                    if (key === 'cells') {
                        if (obj && obj.cells && obj.cells.length > 0) {
                            this.removeKeys(obj.cells, cellsKeys);
                        }
                    } else {
                        if (obj && obj[key]) {
                            delete obj[key];
                        }
                    }
                });
            });
            return array;
        },

        processDataSource: function (data) {
            const spreadsheet = this.$refs.spreadsheet.ej2Instances;
            const dataSource = this.removeKeys(data.jsonObject.Workbook.sheets[spreadsheet.activeSheetIndex].rows, ['height', 'cells'], ['style', 'wrap', 'validation', 'colSpan', 'rowSpan']);
            const processedString = JSON.stringify(dataSource);
            return processedString.replaceAll('{}', null);
        },

        renderAssistView: function (response) {
            const aiInstance = this.$refs.aiAssistView.ej2Instances;
            if (!isNullOrUndefined(aiInstance)) {
                aiInstance.prompts = [{ prompt: '', response: response }];
            }
        },

        processString: function (forumlaString) {
            const spreadsheet = this.$refs.spreadsheet.ej2Instances;
            let processedString = '';
            const regex = /\(([^)]+)\)/g;
            let matches = [];
            let match;
            while ((match = regex.exec(forumlaString)) !== null) {
                let text = match[1];
                matches = text.split(/[:+\-*=/]/).map(s => s.trim()).filter(s => s !== '');
            }
            if (isNullOrUndefined(matches) || matches.length <= 0) {
                matches = forumlaString.split(/[:+\-*=/]/).map(s => s.trim()).filter(s => s !== '');
            }
            if (matches.length > 0) {
                for (let i = 0; i < matches.length; i++) {
                    let { rowIndex, columnIndex } = this.cellAddressToIndexes(matches[i]);
                    if (rowIndex != null && columnIndex != null) {
                        processedString += 'Value of the cell ' + matches[i] + ' is ' + getCell(rowIndex, columnIndex, spreadsheet.sheets[spreadsheet.activeSheetIndex]).value + '/n';
                    }
                }
            }
            return processedString;
        },

        cellAddressToIndexes: function (cellAddress) {
            const match = cellAddress.match(/^([A-Z]+)(\d+)$/);
            if (!match) {
                let rowIndex = null;
                let columnIndex = null;
                return { rowIndex, columnIndex };
            }
            const columnLetters = match[1];
            const rowNumber = parseInt(match[2], 10);
            let columnIndex = 0;
            for (let i = 0; i < columnLetters.length; i++) {
                columnIndex = columnIndex * 26 + (columnLetters.charCodeAt(i) - 'A'.charCodeAt(0));
            }
            const rowIndex = rowNumber - 1;
            return { rowIndex, columnIndex };
        },

        markdownToPlainText(markdown: string): string {
            markdown = markdown.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
            markdown = markdown.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
            markdown = markdown.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
            markdown = markdown.replace(/^### (.+)$/gm, '<h3>$1</h3>');
            markdown = markdown.replace(/^## (.+)$/gm, '<h2>$1</h2>');
            markdown = markdown.replace(/^# (.+)$/gm, '<h1>$1</h1>');
            markdown = markdown.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            markdown = markdown.replace(/\*(.+?)\*/g, '<em>$1</em>');
            markdown = markdown.replace(/^\* (.+)$/gm, '<ul><li>$1</li></ul>');
            markdown = markdown.replace(/^\d+\. (.+)$/gm, '<ol><li>$1</li></ol>');
            markdown = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
            markdown = markdown.replace(/\n/g, '<br>');
            markdown = '<p>' + markdown + '</p>';
            return markdown;
        }
    }
});
</script>
<style>
#side-bar {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    z-index: 1000;
    background-color: white;
    box-shadow: -2px 0 5px rgba(0,0,0,0.1);
}
.e-assistview-icon {
    margin-top: 2px;
}
#root-container {
    width: 100%;
    position: relative;
    width: 100%;
    height: 708px;
}

.title-header #close:before {
    content: "\e109";
}

.title-header {
    font-size: 18px;
    padding-bottom: 15px;
}

.sub-title {
    font-size: 16px;
}

.e-sidebar .title-header #close {
    cursor: pointer;
    line-height: 25px;
    font-size: 14px;
    float: right;
}

#desc-container {
    padding: 10px;
}

/*Sample level font icons for sidebar */
@font-face {
    font-family: 'e-icons';
    src: url(data:application/x-font-ttf;charset=utf-8;base64,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) format('truetype');
    font-weight: normal;
    font-style: normal;
}
</style>