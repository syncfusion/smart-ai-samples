<template>
  <div class='control-pane'>
    <div class='control-section'>
      <h2  style="font-weight: 600; text-align: center; margin-top: 40px;">Semantic Search
      </h2>
      <div class="description-container e-card" style="margin: 20px; width: 97%;">
        <div class='e-card-content' >
          <p>The <b>Combo Box</b> allows users to type or select from a dropdown with autocomplete. The Smart ComboBox
            improves this by suggesting options based on semantic relevance, making it easier to find related values
            even if the exact match isn't remembered.</p>
          <p>Type <b>transport</b>, <b>school</b> or <b>dress</b> into the combobox to see how smart search works with
            semantic matching.</p>
        </div>
      </div>
      <div id='container' style="margin: 50px; text-align: center; align-content: center; flex-wrap: wrap">
        <p style="font-weight: 600">Select a Product</p>
        <ejs-combobox id='combo-box' :dataSource="products" :fields="{ text: 'name', value: 'id' }"
          placeholder="Type transport or school or dress" popupHeight="250px" width="320px" :allowFiltering="true"
          noRecordsTemplate='<div><div id="nodata"> No matched item</div>' @filtering="filteringData">
        </ejs-combobox>
      </div>
    </div>
  </div>
</template>

<script>
import { ComboBoxComponent } from '@syncfusion/ej2-vue-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { cosineSimilarity } from "../common/cosine-similarity";
import { embeddingModel } from "../common/embedding-model";

export default {
  name: 'ComboBoxSemanticSearch',
  components: {
    'ejs-combobox': ComboBoxComponent
  },
  data() {
    return {
      products: [
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
      ],
      productEmbeddings: {}
    }
  },
  mounted() {
    this.getEmbeddingsData();
  },
  methods: {
    async getEmbeddingsData() {
      try {
        for (let product of this.products) {
          let data = await embeddingModel(
            product.id + " " + product.name
          );
          this.productEmbeddings[product.id] = data;
        }
      } catch (error) {
        console.error("Error in getEmbeddingsData:", error);
      }
    },
    async filteringData(e) {
      if (e.text.length > 0) {
        try {
          let queryVector = await embeddingModel(e.text);
          const similarityThreshold = 0.83;
          const outputData = this.products.filter((product) => {
            const similarity = cosineSimilarity(
              this.productEmbeddings[product.id],
              queryVector
            );
            if (similarity > similarityThreshold) {
              return product;
            }
          });
          if (outputData.length > 0) {
            let query = new Query();
            e.updateData(outputData, query);
          }
        } catch (error) {
          console.error("Error in filteringData:", error);
        }
      }
    }
  }
}
</script>