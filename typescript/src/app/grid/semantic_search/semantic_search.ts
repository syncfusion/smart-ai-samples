
import { Grid, Toolbar, Page } from '@syncfusion/ej2-grids';
import { MedicalRecords, MedicalRecord } from './gridData';
import { TextBox } from '@syncfusion/ej2/inputs';
import { Button } from '@syncfusion/ej2/buttons';
import { Query, Predicate } from '@syncfusion/ej2-data';
import { cosineSimilarity } from "../../cosine-similarity";
import { embeddingModel } from "../../../sen_transformer/embedding_model";

/**
 * Semantic Filtering
 */

Grid.Inject(Page, Toolbar);

let productEmbeddings: { [key: string]: number[] } = {};

getEmbeddingsData();

async function getEmbeddingsData() {
    for (let record of MedicalRecords) {
        let data: number[] = (await embeddingModel(
            record.DoctorDetails + ' ' + record.PatientID + ' ' + record.Symptoms + ' ' + record.Diagnosis
        )) as number[];
        productEmbeddings[record.RecordID] = data;
    }
}

let grid: Grid = new Grid({
    dataSource: MedicalRecords,
    toolbar: [{
        template: `<div id='toolbar-template'>
            <input id='smart_search_input' />
            <button id='smart_search_button'>Smart Search</button>
        </div>` }],
    columns: [
        { field: 'RecordID', headerText: 'Record ID', textAlign: 'Right', width: 90 },
        { field: 'PatientID', headerText: 'Patient ID', textAlign: 'Right', width: 90 },
        { field: 'Symptoms', headerText: 'Symptoms', width: 140 },
        { field: 'Diagnosis', headerText: 'Diagnosis', width: 100 },
        { field: 'DoctorDetails', headerText: 'Doctor Information', width: 140 }
    ],
    enableAltRow: true,
    allowTextWrap: true,
    created: created,
});

grid.appendTo('#Grid');

function created() {
    let textbox: TextBox = new TextBox({
        placeholder: 'Search here',
        width: 200,
    });
    textbox.appendTo('#smart_search_input');

    let button = document.getElementById('smart_search_button') as HTMLButtonElement;
    button.onclick = smartSearch;
    new Button({ isPrimary: true }, '#smart_search_button');
}

function smartSearch() {
    if (grid) {
        let searchEle: HTMLInputElement = grid.element.querySelector('#semantic-grid input.e-textbox')!;
        if (searchEle) {
            let searchValue: string = searchEle.value.trim();
            if (searchValue) {
                grid.showSpinner();
                ExecutePrompt(searchValue);
            } else {
                grid.query = new Query();
            }

        }
    }
}

async function ExecutePrompt(searchValue: string) {
    let queryVector: any = await embeddingModel(searchValue);
    const similarityThreshold: number = 0.8;
    const outputData = MedicalRecords.filter((record: any) => {
        const similarity = cosineSimilarity(
            productEmbeddings[record.RecordID],
            queryVector
        );
        if (similarity > similarityThreshold) {
            return record;
        }
    });
    grid.hideSpinner();
    if (outputData.length > 0) {
        grid.query = new Query().where(generatePredicate(outputData));
    } else {
        grid.query = new Query().take(0);
    }
}

function generatePredicate(filteredData: MedicalRecord[]) {
    let predicates: Predicate[] = [];
    for (let i: number = 0; i < filteredData.length; i++) {
        predicates.push(new Predicate('Symptoms', 'contains', filteredData[i].Symptoms));
    }
    return Predicate.or(predicates);
}
