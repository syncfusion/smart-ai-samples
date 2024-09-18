<template>
    <div id="desc-container">
        <h2 style="text-align: center;">Smart Pivot Table</h2>
        <div class="description-container e-card">
            <div class='e-card-content '>
                <p>
                    The <b>Pivot</b>, enhanced with AI, offers features such as <i>Smart Data Aggregation</i>,
                    <i>Predictive Modeling</i>, and <i>Adaptive Filtering</i>. Click the <mark><b>AI Assist</b></mark>
                    option to explore these AI-powered capabilities.
                    Know more <a
                        href="https://github.com/syncfusion/smart-ai-samples/blob/master/vue/src/ai-components/ai-pivot-table/Readme.md">here</a>.
                </p>
            </div>
        </div>
    </div>
    <div id="container">
        <ejs-pivotview ref="pivotObj" id="pivotTable" :dataSourceSettings="dataSourceSettings" width="100%" height="500"
            :toolbarRender="toolbarRender" :toolbar="toolbarOptions" :showToolbar="true"
            :allowConditionalFormatting="true" :allowPdfExport="true" :allowCalculatedField="true" :showFieldList="true"
            :displayOption="{ view: 'Both' }" :chartSettings="chartSettings"></ejs-pivotview>
        <ejs-dialog ref="dialog" id="pivotDialog" :minHeight="'200px'" :showCloseIcon="true" :visible="false"
            header="AI Assist" :buttons="dialogButtons" target="#pivotTable">
            <div id="dialogContent"></div>
        </ejs-dialog>
    </div>
</template>

<script>
import {
    PivotViewComponent,
    FieldList,
    CalculatedField,
    Toolbar,
    ConditionalFormatting,
    NumberFormatting,
    PDFExport,
} from "@syncfusion/ej2-vue-pivotview";
import { enableRipple } from "@syncfusion/ej2-base";
import { DialogComponent, createSpinner, showSpinner, hideSpinner } from "@syncfusion/ej2-vue-popups";
import { DropDownList, MultiSelect, CheckBoxSelection } from "@syncfusion/ej2-vue-dropdowns";
import { ChipList } from "@syncfusion/ej2-vue-buttons";
import { TextBox } from "@syncfusion/ej2-vue-inputs";
import { pivotData } from "./data-source";
import { getAzureChatAIRequest } from '../common/ai-models';

enableRipple(true);
MultiSelect.Inject(CheckBoxSelection);

export default {
    name: "App",
    components: {
        'ejs-pivotview': PivotViewComponent,
        'ejs-dialog': DialogComponent,
    },
    data() {
        return {
            chip: null,
            dropdownData: ["2025", "2026", "2027", "2028", "2029"],
            description: "",
            dataSourceSettings: {
                enableSorting: true,
                columns: [{ name: "Year" }, { name: "Quarter" }],
                values: [
                    { name: "Sold", caption: "Units Sold" },
                    { name: "Amount", caption: "Sold Amount" },
                ],
                dataSource: pivotData,
                rows: [{ name: "Country", expandAll: true }, { name: "Products" }],
                formatSettings: [{ name: "Amount", format: "C0" }],
                filterSettings: [
                    {
                        name: "Products",
                        type: "Include",
                        items: ["Bikes", "Road Bikes", "Helmets", "Bottles and Cages"],
                    },
                ],
            },
            toolbarOptions: ["Grid", "Chart", "SubTotal", "GrandTotal", "ConditionalFormatting", "FieldList"],
            chartSettings: {
                value: "Amount",
                enableExport: true,
                chartSeries: { type: "Column", animation: { enable: false } },
                enableMultipleAxis: false,
            },
            dialogButtons: [
                {
                    click: this.onSubmit,
                    buttonModel: { content: "Submit", isPrimary: true },
                },
            ],
        };
    },
    methods: {
        toolbarRender(args) {
            args.customToolbar.splice(5, 0, { type: "Separator" });
            args.customToolbar.splice(6, 0, {
                text: "AI Assist",
                tooltipText: "AI Assist",
                click: this.toolbarClicked,
            });
        },
        toolbarClicked() {
            this.$refs.dialog.show();
        },
        onSubmit() {
            this.$refs.dialog.hide();
            createSpinner({
                target: document.querySelector('.e-grid .e-content')
            });
            showSpinner(document.querySelector('.e-grid .e-content'));
            if (this.chip.selectedChips === 0) {
                let year = (document.getElementById('yearInput')).value;
                this.description = `Provide future data points up to the year ${year} along with the existing data from the provided data source.`;
            } else if (this.chip.selectedChips === 1) {
                let selectedFields = (document.getElementById('fieldsInput')).getAttribute("data-initial-value");
                let aggregationValue = (document.getElementById('aggregateInput')).value;
                this.description = `Suggest the best way to aggregate and view provided fields(${selectedFields}) using the provided data source. Use only these fields (${selectedFields}) to frame the rows, columns, and values, ensuring all the provided fields are included in the report and the same field should not be bind twice in different property of reports. **Ensure that the "type" property of the values fields holds the aggregation type as ${aggregationValue}. And the rows and values fields should not be empty in the report`;
            } else if (this.chip.selectedChips === 2) {
                let filterText = document.querySelector('#filterInput') ? (document.querySelector('#filterInput')).value : '';
                this.description = `Filter the Products field based on ${filterText} and return the filtersettings with corresponding items from the Products field `;
            }
            let input = this.frameContent();
            let aiOutput = getAzureChatAIRequest({ messages: [{ role: 'user', content: input }] });
            aiOutput.then((result) => {
                let cleanedJsonData = result.replace(/^```json\n|```\n?$/g, '');
                this.$refs.pivotObj.ej2Instances.dataSourceSettings = JSON.parse(cleanedJsonData);
                hideSpinner(document.querySelector('.e-grid .e-content'));
            });
        },
        createDialogContent(container) {
            let categoryTitle1 = document.createElement('p');
            categoryTitle1.className = 'category-title';
            categoryTitle1.innerText = 'Pick a Suggested Query:';
            container.appendChild(categoryTitle1);
            let chipContainer = document.createElement('div');
            chipContainer.className = 'chip-container';
            this.chip = new ChipList({
                chips: [
                    { text: 'Predictive Analytics & Modeling' },
                    { text: 'Intelligent Report Aggregation' },
                    { text: 'Adaptive Filter Suggestions' }
                ],
                selection: 'Single',
                selectedChips: [0],
                click: this.onChipSelectionChange
            });
            this.chip.appendTo(chipContainer);
            container.appendChild(chipContainer);

            // Prompt section
            let categoryTitle2 = document.createElement('p');
            categoryTitle2.className = 'category-title';
            categoryTitle2.innerText = 'Prompt:';
            container.appendChild(categoryTitle2);

            let inlineDiv = document.createElement('div');
            inlineDiv.className = 'inline';
            inlineDiv.id = 'inlineContent';
            container.appendChild(inlineDiv);

            // Initial Content Based on Default Selection
            this.updateContentBasedOnSelection(this.chip.selectedChips);
        },
        updateContentBasedOnSelection(selectedChipIndex) {
            let inlineDiv = document.getElementById("inlineContent");
            if (inlineDiv) {
                inlineDiv.innerHTML = "";

                if (selectedChipIndex === 0) {
                    let yearInput = document.createElement("input");
                    yearInput.id = "yearInput";
                    let textSpan = document.createElement("span");
                    textSpan.id = "contentText";
                    textSpan.className = "dropdown-size";
                    textSpan.innerHTML = "Provide future data points up to the year ";
                    textSpan.appendChild(yearInput);
                    textSpan.innerHTML += " along with the existing data.";
                    inlineDiv.appendChild(textSpan);
                    let yearDropdown = new DropDownList({
                        placeholder: "Select a Year",
                        width: "90px",
                        popupHeight: "200px",
                        popupWidth: "140px",
                        index: 0,
                        dataSource: this.dropdownData,
                    });
                    yearDropdown.appendTo('#yearInput');
                } else if (selectedChipIndex === 1) {
                    let textSpan = document.createElement('span');
                    textSpan.id = 'contentText';
                    textSpan.innerHTML = 'Suggest the best way to aggregate and view provided fields ';
                    let fieldsInput = document.createElement('input');
                    fieldsInput.id = 'fieldsInput';
                    textSpan.appendChild(fieldsInput);
                    textSpan.innerHTML += ' in ';
                    let aggregateInput = document.createElement('input');
                    aggregateInput.id = 'aggregateInput';
                    textSpan.appendChild(aggregateInput);
                    textSpan.innerHTML += ' aggregate type.';
                    inlineDiv.appendChild(textSpan);
                    let fieldsMultiSelect = new MultiSelect({
                        placeholder: 'Select Fields',
                        width: '150px',
                        popupWidth: '180px',
                        allowFiltering: true,
                        dataSource: ['Country', 'Products', 'Product_Categories', 'Quarter', 'Year', 'Sold', 'Amount', 'In_Stock'], // Sample data
                        mode: 'CheckBox',
                        value: ['Year', 'Product_Categories', 'Sold']
                    });
                    fieldsMultiSelect.appendTo('#fieldsInput');
                    let aggregateDropdown = new DropDownList({
                        placeholder: 'Select aggregation type',
                        width: '100px',
                        popupHeight: '200px',
                        popupWidth: '140px',
                        index: 0,
                        dataSource: ['Sum', 'Count', 'Product', 'Average', 'Min']
                    });
                    aggregateDropdown.appendTo('#aggregateInput');
                } else if (selectedChipIndex === 2) {
                    let textSpan = document.createElement('span');
                    textSpan.id = 'contentText';
                    textSpan.className = 'dropdown-size';
                    textSpan.innerHTML = 'Filter the Products field based on ';
                    let filterInput = document.createElement('input');
                    filterInput.id = 'filterInput';
                    textSpan.appendChild(filterInput);
                    inlineDiv.appendChild(textSpan);
                    let filterTextBox = new TextBox({
                        placeholder: 'Enter filter category',
                        cssClass: 'product-class',
                        value: 'Bikes',
                        width: '100%'
                    });
                    filterTextBox.appendTo('#filterInput');
                }
            }
        },
        onChipSelectionChange() {
            this.updateContentBasedOnSelection(this.chip.selectedChips);
        },
        frameContent: function () {
            let filter = "Include, Exclude";
            let labelType = "Label, Number";
            let operators = `'Equals', 'DoesNotEquals',
          'BeginWith',
          'DoesNotBeginWith',
          'EndsWith',
          'DoesNotEndsWith',
          'Contains',
          'DoesNotContains',
          'GreaterThan',
          'GreaterThanOrEqualTo',
          'LessThan',
          'LessThanOrEqualTo',
          'Before',
          'BeforeOrEqualTo',
          'After',
          'AfterOrEqualTo',
          'Between',
          'NotBetween'`;
            let summary = `'Sum',
          'Product'
          'Count',
          'DistinctCount',
          'Median',
          'Min',
          'Max',
          'Avg',
          'Index',
          'PercentageOfGrandTotal',
          'PercentageOfColumnTotal',
          'PercentageOfRowTotal',
          'PercentageOfParentRowTotal',
          'PercentageOfParentColumnTotal',
          'PercentageOfParentTotal',
          'RunningTotals',
          'PopulationStDev',
          'SampleStDev',
          'PopulationVar',
          'SampleVar',
          'DifferenceFrom',
          'PercentageOfDifferenceFrom'`;
            let filterQuery = `The filterSettings property holds the filter settings. In this we have two types, member filtering and label filtering. The MemberFiltering has a Type property that is an values corresponding to ${filter} +
          and the MemberFiltering includes the items property that is an array of objects which contains the members of the fields to be included or excluded with the name property. +
          and the LabelFiltering has a Type property that is an values corresponding to ${labelType} +
          and the LabelFiltering property has a Condition property that is an values corresponding to ${operators}. +
          and the LabelFiltering property has a Value1 and Value2 property that depends based on the condition property. +
          Filters should not be applied to fields bound in Values and the same field should not be added to both label filters and member filters.+
          This filterSettings property is an array of objects that contains the filter settings with name and items property for the fields in the pivot table.For example: [{ name: 'Country', type: 'Include', items: ['USA', 'UK' ] }].+`;
            let filterItem = document.querySelector('#filterInput') ? (document.querySelector('#filterInput')).value : '';
            let pivotQuery = `The values property has a type property, which is an enum with values corresponding to ${summary}.`;
            let stringInput = `Given the following dataSource and the datasourcesettings(rows, columns and values) are bounded in the pivot table ${JSON.stringify(pivotData)} , ${JSON.stringify(this.dataSourceSettings)} respectively. 
        Return the newly prepared dataSourceSettings based on following user query: ${this.description} and the data source shouldn't change if the query contains a future data points and the reframed data source should contains all the fields(key) with its corresponding values(please refer the first object of the provided data source for the keys), And the items in the filters should be just an array of values, not objects. And the value of the items should be ${filterItem}.
        Generate an output in JSON format only and Should not include any additional information or content in response.
        Note: ${pivotQuery},
        ${filterQuery}`;
            return stringInput;
        }
    },
    mounted() {
        this.createDialogContent(document.getElementById("dialogContent"));
    },
    provide: {
        pivotview: [FieldList, CalculatedField, Toolbar, ConditionalFormatting, NumberFormatting, PDFExport],
        multiselect: [CheckBoxSelection]
    }
};
</script>

<style scoped>
#container {
    padding: 10px;
}
#desc-container {
    padding: 20px;
}
.category-title {
    font-weight: bold;
    margin-bottom: 10px;
}

.chip-container {
    margin-bottom: 20px;
}

.inline {
    display: flex;
    align-items: center;
}

.dropdown-size {
    margin-right: 10px;
}
</style>