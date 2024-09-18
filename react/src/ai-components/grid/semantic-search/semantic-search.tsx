import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Toolbar, Page } from '@syncfusion/ej2-react-grids';
import { MedicalRecords, MedicalRecord } from './datasource';
import './semantic-search.css';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { Query, Predicate } from '@syncfusion/ej2-data';
import { cosineSimilarity } from "../../../cosine-similarity";
import { embeddingModel } from "../../../sen_transformer/embedding_model";

function SemanticSearch() {
    const getEmbeddingsData = async () => {
        for (let record of MedicalRecords) {
            let data: number[] = (await embeddingModel(
                record.DoctorDetails + ' ' + record.PatientID + ' ' + record.Symptoms + ' ' + record.Diagnosis
            )) as number[];
            productEmbeddings[record.RecordID] = data;
        }
    };

    let gridInstance!: GridComponent;
    let productEmbeddings: { [key: string]: number[] } = {};
    const toolbarTemplate = () => {
        return <div id='toolbar-template'>
            <TextBoxComponent id='smart_search_input' placeholder={'Search here'} width={200} />
            <ButtonComponent id='smart_search_button' isPrimary={true} onClick={smartSearch}>Smart Search</ButtonComponent>
        </div>
    };
    const toolbarOptions = [
        { template: toolbarTemplate }
    ];

    function smartSearch() {
        if (gridInstance) {
            let searchEle: HTMLInputElement = gridInstance.element.querySelector('#smart_search_input')!;
            if (searchEle) {
                let searchValue: string = searchEle.value.trim();
                if (searchValue) {
                    gridInstance.showSpinner();
                    ExecutePrompt(searchValue);
                } else {
                    gridInstance.query = new Query();
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
        gridInstance.hideSpinner();
        if (outputData.length > 0) {
            gridInstance.query = new Query().where(generatePredicate(outputData));
        } else {
            gridInstance.query = new Query().take(0);
        }
    }

    function generatePredicate(filteredData: MedicalRecord[]) {
        let predicates: Predicate[] = [];
        for (let i: number = 0; i < filteredData.length; i++) {
            predicates.push(new Predicate('Symptoms', 'contains', filteredData[i].Symptoms));
        }
        return Predicate.or(predicates);
    }

    return (
        <div className='control-pane'>
            <div className='control-section'>
                <div className="description-container e-card">
                    <div className='e-card-content'>
                        <p>This example shows how the DataGrid presents medical report data. Using Semantic Search, you can find relevant information without needing to use the exact terms. For instance, searching for "stomach" will still bring up reports about "Abdominal pain." The grid updates search results dynamically using local embeddings. Know more <a href="https://github.com/syncfusion/smart-ai-samples/blob/master/react/src/ai-components/grid/Readme.md">here</a>.</p>
                    </div>
                </div>
                <div id='container'>
                    <GridComponent id='SemanticGrid' ref={grid => gridInstance = grid as GridComponent} toolbar={toolbarOptions} dataSource={MedicalRecords} enableAltRow={true} allowTextWrap={true}
                        created={getEmbeddingsData} >
                        <ColumnsDirective>
                            <ColumnDirective field='RecordID' headerText='Record ID' width='90' textAlign='Right' />
                            <ColumnDirective field='PatientID' headerText='Patient ID' width='90' textAlign='Right' />
                            <ColumnDirective field='Symptoms' headerText='Symptoms' width='140' />
                            <ColumnDirective field='Diagnosis' headerText='Diagnosis' width='100' />
                            <ColumnDirective field='DoctorDetails' headerText='Doctor Information' width='140' />
                        </ColumnsDirective>
                        <Inject services={[Page, Toolbar]} />
                    </GridComponent>
                </div>
            </div>
        </div>
    )
}

export default SemanticSearch;