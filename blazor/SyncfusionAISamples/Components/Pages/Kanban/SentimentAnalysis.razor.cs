using Syncfusion.Blazor.DropDowns;
using Syncfusion.Blazor.Inputs;
using Syncfusion.Blazor.Kanban;
using SyncfusionAISamples.Models;
using System.Text.Json;

namespace SyncfusionAISamples.Components.Pages.Kanban
{
    public partial class SentimentAnalysis
    {
        SfDropDownList<string, DropDownModel> CategoryRef;
        SfTextBox DescriptionRef;
        private string SelectedAPI = "Open AI";
        private bool ShowScore = false;
        private bool IsSpinner = false;
        private List<PizzaDataModel> Pizza = new PizzaDataModel().GetPizzaData();
        public string Content = "Analyze Customer Sentiments";

        private async Task GetScore()
        {
            this.IsSpinner = true;
            string result = "";
            string json = JsonSerializer.Serialize(Pizza, new JsonSerializerOptions { WriteIndented = true });
            var prompt = "Provide a SentimentScore out of 5 (whole numbers only) based on the Feedback. If the feedback is null, do not give a SentimentScore. Use the dataset provided below to make recommendations. NOTE: Return the data in JSON format with all fields included, and return only JSON data, no explanatory text." + json;
            result = await AIChatService.GetCompletionAsync(prompt);
            string data = result.Replace("```json", "").Replace("```", "").Replace("\r", "").Replace("\n", "").Replace("\t", "").Trim();
            this.Pizza = JsonSerializer.Deserialize<List<PizzaDataModel>>(data);
            this.IsSpinner = false;

            foreach (var item in Pizza)
            {
                if (item.SentimentScore > 0 && item.SentimentScore <= 2)
                {
                    item.Emoji = "😢";
                }
                else if (item.SentimentScore > 3 && item.SentimentScore <= 5)
                {
                    item.Emoji = "😀";
                }
                else if (item.SentimentScore == 3)
                {
                    item.Emoji = "😐";
                }
            }
            this.ShowScore = true;
            StateHasChanged();
        }

        private List<DropDownModel> CategoryData = new List<DropDownModel>()
    {
        new DropDownModel { Id = 0, Value = "Menu" },
        new DropDownModel { Id = 1, Value = "Order" },
        new DropDownModel { Id = 2, Value = "Ready to Serve" },
        new DropDownModel { Id = 3, Value = "Delivered"},
        new DropDownModel { Id = 3, Value = "Served"},
    };

        private class DropDownModel
        {
            public int Id { get; set; }
            public string Value { get; set; }
        }

        private List<ColumnModel> columnData = new List<ColumnModel>() {
        new ColumnModel(){ HeaderText= "Menu", KeyField= new List<string>() { "Menu" } },
        new ColumnModel(){ HeaderText= "Order", KeyField= new List<string>() { "Order" } },
        new ColumnModel(){ HeaderText= "Ready to Serve", KeyField= new List<string>() { "Ready to Serve"} },
        new ColumnModel(){ HeaderText= "Delivered", KeyField=new List<string>() {  "Delivered", "Served" } }
    };
        public void Begin(Syncfusion.Blazor.SplitButtons.ProgressEventArgs args)
        {
            Content = "Analyzing...";
        }
        public async Task End(Syncfusion.Blazor.SplitButtons.ProgressEventArgs args)
        {
            while (this.IsSpinner)
            {
                await Task.Delay(1000);
            }
            Content = "Check Customer Sentiments";
        }
    }
}
