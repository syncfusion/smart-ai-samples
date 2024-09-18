import { Component } from '@angular/core';
import {  ComboBoxModule, FilteringEventArgs } from '@syncfusion/ej2-angular-dropdowns';
import { cosineSimilarity } from "../../utils/cosine-similarity";
import { Query } from "@syncfusion/ej2-data";
import {embeddingModel} from '../../ai-models/embedding-model';
@Component({
  selector: 'app-local-embedding',
  standalone: true,
  imports: [ComboBoxModule],
  templateUrl: './local-embedding.component.html',
  styleUrl: './local-embedding.component.css'
})

export class LocalEmbeddingComponent {

  ngOnInit(): void {
    //this.getEmbeddingsData();
  }
  onCreated(): void {
    this.getEmbeddingsData();
  }
  public fields: Object = { text: 'name', value: 'id' };
  public countries: any = [
    { id: "Category1", name: "Groceries" },
    { id: "Category2", name: "Utilities" },
    { id: "Category3", name: "Rent" },
    { id: "Category4", name: "Education" },
    { id: "Category5", name: "Car Payment" },
    { id: "Category6", name: "Car Insurance" },
    { id: "Category7", name: "Health Insurance" },
    { id: "Category8", name: "Life Insurance" },
    { id: "Category9", name: "Home Insurance" },
    { id: "Category10", name: "Gas" },
    { id: "Category11", name: "Public Transportation" },
    { id: "Category12", name: "Dining Out" },
    { id: "Category13", name: "Entertainment" },
    { id: "Category14", name: "Travel" },
    { id: "Category15", name: "Clothing" },
    { id: "Category16", name: "Electronics" },
    { id: "Category17", name: "Pet Care" },
    { id: "Category18", name: "Other" }      
   ]
   productEmbeddings: { [key: string]: number[] } = {};
   async  getEmbeddingsData() {
    for (let product of this.countries) {
        let data: number[] = (await embeddingModel(
            product.id + " " + product.name
        )) as number[];
        this.productEmbeddings[product.id] = data;
    }
    console.log('datasource embedding completed')
}
public async onFiltering(e: FilteringEventArgs): Promise<void> {
  if (e.text.length > 0) {
    let queryVector: any = await embeddingModel(e.text);
    const similarityThreshold: number = 0.83;
    const outputData = this.countries.filter((country: any) => {
      const similarity = cosineSimilarity(
        this.productEmbeddings[country.id],
        queryVector
      );
      return similarity > similarityThreshold;
    });
    if (outputData.length > 0) {
      let query = new Query();
      e.updateData(outputData, query);
    }
  }
}

}
