using Microsoft.JSInterop;
using Syncfusion.Blazor.Gantt;
using SyncfusionAIWasmExamples.Models;
using System.Text.Json;

namespace SyncfusionAIWasmExamples.Pages.GanttChart
{
    public partial class TaskSchedule
    {
        public SfGantt<GanttDataModel.TaskInfoModel> Gantt = new();
        private bool renderBaseline { get; set; }
        private List<GanttDataModel.TaskInfoModel> TaskCollection { get; set; } = new();
        private string AIPrompt = string.Empty;
        private bool showMessage;

        protected override void OnInitialized()
        {
            TaskCollection = GanttDataModel.HistoricalTaskData;
        }
        private string GeneratePrompt(List<GanttDataModel.TaskInfoModel> TaskCollection)
        {
            return @"You analyze the historical data collection of multiple years used for the Gantt Chart project management. Based on the existing historcal data set collection you need to modified the project schedule values the below TaskDataCollection for the project management for the year of 2026. Avoid json tags with your response. No other explanation or content to be returned."
            + @" HistoricalDataCollections :" + GetHistoricalCoolection() + @" TaskDataCollection: " + JsonSerializer.Serialize(TaskCollection) +
            "Return the result collection in json format named as 'TaskCollection' key - its contains the list of tasks collection";

        }
        private async Task Reload()
        {
            await JsInterop.InvokeVoidAsync("window.location.reload");
        }
        private async Task OpenAIHandler()
        {
            await Gantt.ShowSpinnerAsync();
            showMessage = false;
            renderBaseline = false;
            List<MessageModel> Messages = new()
        {
            new MessageModel { role = "system", content = "You are a helpful assistant."}
        };
            Dictionary<string, IEnumerable<object>> ganttData = new Dictionary<string, IEnumerable<object>>();
            List<GanttDataModel.TaskInfoModel> generatedCollection = new();
            var currentView = Gantt.GetCurrentViewRecords();
            var AIPrompt = GeneratePrompt(currentView);
            string result = await OpenAIService.GetCompletionAsync(AIPrompt, true, true);

            var contentAIPrompt = "Ensure the result 'TaskIds' key - its contain modified record task ids(list of int) in json object format. Note: Return response must be in json string and with no other explanation.";

            string contentResult = await OpenAIService.GetCompletionAsync(contentAIPrompt, true, true);

            try
            {
                if (contentResult.StartsWith("```json"))
                {
                    contentResult = contentResult.Replace("```json", "").Replace("```", "").Trim();
                }
                else if (contentResult.StartsWith("```"))
                {
                    contentResult = contentResult.Replace("```", "").Replace("```", "").Trim();
                }
                string response = JsonDocument.Parse(result).RootElement.GetProperty("TaskCollection").ToString();
                if (response is not null)
                {
                    var collection = JsonSerializer.Deserialize<List<GanttDataModel.TaskInfoModel>>(response);
                    if (collection is not null)
                    {
                        generatedCollection = collection;
                    }
                }
                string taskIdResponse = JsonDocument.Parse(contentResult).RootElement.GetProperty("TaskIds").ToString();
                if (taskIdResponse is not null)
                {
                    var collection = JsonSerializer.Deserialize<List<int>>(taskIdResponse);
                    if (collection is not null)
                    {
                        foreach (var id in collection)
                        {
                            var record = generatedCollection.Where(s => s.Id == id).FirstOrDefault();
                            var existingRecord = currentView.Where(s => s.Id == id).FirstOrDefault();
                            if (record is not null && existingRecord is not null)
                            {
                                record.BaselineStartDate = existingRecord.StartDate;
                                record.BaselineEndDate = existingRecord.EndDate;
                            }
                        }
                    }
                }
                if (generatedCollection is not null && generatedCollection.Count > 0)
                {
                    renderBaseline = true;
                    TaskCollection = generatedCollection.Cast<GanttDataModel.TaskInfoModel>().ToList();
                }
            }
            catch (Exception e)
            {
                showMessage = true;
                await Gantt.HideSpinnerAsync();
                return;
            }
            await Gantt.HideSpinnerAsync();
            await Task.CompletedTask;
        }
        private string GetHistoricalCoolection()
        {
            string historicalDataCollection = string.Empty;
            for (int year = 2021; year < 2026; year++)
            {
                StreamReader streamReader = new StreamReader($"Components/Models/HistoricalData{year}.json");
                historicalDataCollection += $"HistoricalDataCollection{year}: " + JsonDocument.Parse(streamReader.ReadToEnd()).RootElement.GetProperty($"HistoricalDataCollection{year}").ToString() + ", ";
            }
            return historicalDataCollection;
        }
    }
}
