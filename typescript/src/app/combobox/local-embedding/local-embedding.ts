/**
 * ComboBox Filtering Samples
 */
import { ComboBox, FilteringEventArgs } from "@syncfusion/ej2-dropdowns";
import { cosineSimilarity } from "../../cosine-similarity";
import { Query } from "@syncfusion/ej2-data";
import { embeddingModel } from "../../../sen_transformer/embedding_model";
import { enableRipple } from "@syncfusion/ej2-base";

enableRipple(false);

// let products: any = [
//  { ID : 1, Name : "iPhone 13", Category : "Electronics", Brand : "Apple", Description : "A15 Bionic chip" },
//  { ID : 2, Name : "Clothing", Category : "Electronics", Brand : "Samsung", Description : "Flagship phone" },
//  { ID : 3, Name : "PlayStation 5", Category : "Gaming", Brand : "Sony", Description : "Next-gen gaming" },
//  { ID : 4, Name : "MacBook Pro", Category : "Computers", Brand : "Apple", Description : "laptop with M1 chip" },
//  { ID : 5, Name : "Surface Pro 7", Category : "Computers", Brand : "Microsoft", Description : "2-in-1 laptop" },
//  { ID : 6, Name : "Nintendo Switch", Category : "Gaming", Brand : "Nintendo", Description : "Hybrid console" },
//  { ID : 7, Name : "Echo Dot", Category : "Smart Home", Brand : "Amazon", Description : "smart speaker" },
//  { ID : 8, Name : "Roomba i7", Category : "Home Appliances", Brand : "iRobot", Description : "robot vacuum" },
//  { ID : 9, Name : "OLED TV", Category : "Electronics", Brand : "LG", Description : "4K OLED TV" },
//  { ID : 10, Name : "AirPods Pro", Category : "Accessories", Brand : "Apple", Description : "wireless earbuds" },
//  { ID : 11, Name : "Galaxy Watch 4", Category : "Wearables", Brand : "Samsung", Description : "Smartwatch" },
//  { ID : 12, Name : "Kindle Paperwhite", Category : "Electronics", Brand : "Amazon", Description : "E-reader" },
//  { ID : 13, Name : "Dyson V11", Category : "Home Appliances", Brand : "Dyson", Description : "vacuum cleaner" },
//  { ID : 14, Name : "GoPro HERO9", Category : "Cameras", Brand : "GoPro", Description : "Action camera" },
//  { ID : 15, Name : "Fitbit Charge 5", Category : "Wearables", Brand : "Fitbit", Description : "Fitness tracker" },
//  { ID : 16, Name : "Nest Thermostat", Category : "Smart Home", Brand : "Google", Description : "Smart thermostat" },
//  { ID : 17, Name : "Sony WH-1000XM4", Category : "Accessories", Brand : "Sony", Description : "wireless headphones" },
//  { ID : 18, Name : "Instant Pot Duo", Category : "Home Appliances", Brand : "Instant Pot", Description : "pressure cooker" },
//  { ID : 19, Name : "Roku Streaming Stick+", Category : "Electronics", Brand : "Roku", Description : "4K HDR streaming device" },
//  { ID : 20, Name : "Bose SoundLink", Category : "Accessories", Brand : "Bose", Description : "Bluetooth speaker" }      
// ]
const products = [
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
];
let productEmbeddings: { [key: string]: number[] } = {};

getEmbeddingsData();

async function getEmbeddingsData() {
    for (let product of products) {
        let data: number[] = (await embeddingModel(
            product.id + " " + product.name
        )) as number[];
        productEmbeddings[product.id] = data;
    }
    console.log('datasource embedding completed')
}

// initialize ComboBox component
let comboBoxObj: ComboBox = new ComboBox({
    dataSource: products,
    fields: { text: "name", value: "id" },
    placeholder: "Type transport or school or dress",
    popupHeight: "250px",
    width: "320px",
    allowFiltering: true,
    noRecordsTemplate: '<div><div id="nodata"> No matched item</div>',
    filtering: async (e: FilteringEventArgs) => {
        if (e.text.length > 0) {
            let queryVector: any = await embeddingModel(e.text);
            const similarityThreshold: number = 0.83;
            const outputData = products.filter((product: any) => {
                const similarity = cosineSimilarity(
                    productEmbeddings[product.id],
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
        }
    },
});
comboBoxObj.appendTo("#combo-box-local");
