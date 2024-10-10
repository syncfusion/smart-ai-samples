using Microsoft.JSInterop;
using Syncfusion.Blazor.Gantt;
using SyncfusionAISamples.Models;
using System.Text.Json;

namespace SyncfusionAISamples.Components.Pages.GanttChart
{
    public partial class ProgressPrediction
    {
        public SfGantt<GanttDataModel.TaskInfoModel> Gantt = new();
        private List<GanttDataModel.TaskInfoModel> TaskCollection { get; set; } = new();
        private bool showMessage;
        private Dictionary<string, string> riskAnalyzeContent = new();
        private Dictionary<string, string> riskAnalyzePriority = new();
        private Dictionary<string, DateTime> milestoneDates = new();

        protected override void OnInitialized()
        {
            TaskCollection = GanttDataModel.TaskDataCollection;
        }
        private string GeneratePrompt()
        {
            return @"You analyze the multiple year HistoricalTaskDataCollections and current TaskDataCollection to predict project completion dates and milestones based on current progress and historical trends. Ignore the null or empty values, and collection values based parent child mapping. Avoid json tags with your response. No other explanation or content to be returned."
            + @" HistoricalTaskDataCollections :" + GetHistoricalCollection() + @" TaskDataCollection: " + JsonSerializer.Serialize(TaskCollection) +
                        @"Generate a JSON object named 'TaskDetails' containing below keys:
- Key 'MilestoneTaskDate' with a list of milestone dates 'MilestoneDate' with 'TaskName' - task name. A milestone date is defined as the end date of tasks with a duration of 0 and only give current based milestone .
- Key 'ProjectCompletionDate' indicating the latest end date among all tasks.
- Key 'Summary' providing a summary of the project completion date and milestones.
        Here is the output JSON schema:
        {
      'TaskDetails': {
        'MilestoneTaskDate': [],
        'ProjectCompletionDate' : '',
        'Summary' : ''
        }
    }

Ensure milestones are defined correctly based on tasks with a duration of 0, and the project completion date reflects the latest end date of all tasks.
.";
        }
        private async Task Reload()
        {
            await JsInterop.InvokeVoidAsync("window.location.reload");
        }
        private async Task OpenAIHandler()
        {
            await Gantt.ShowSpinnerAsync();
            showMessage = false;
            milestoneDates = new();
            string AIPrompt = GeneratePrompt();
            string result = await AIChatService.GetCompletionAsync(AIPrompt);

            try
            {
                var content = JsonDocument.Parse(result).RootElement.GetProperty("TaskDetails").ToString();
                using (JsonDocument document = JsonDocument.Parse(content))
                {
                    if (document.RootElement.TryGetProperty("MilestoneTaskDate", out JsonElement milestoneElement))
                    {
                        foreach (var milestone in milestoneElement.EnumerateArray())
                        {
                            var datas = JsonSerializer.Deserialize<Dictionary<string, string>>(milestone);
                            if (milestoneDates.Any() && milestoneDates.ContainsKey(datas["TaskName"]))
                            {
                                continue;
                            }
                            var record = GanttDataModel.TaskDataCollection.Where(s => s.Name == datas["TaskName"]).FirstOrDefault();
                            if (record is not null)
                            {
                                var parentRecord = GanttDataModel.TaskDataCollection.Where(s => s.Id == record.ParentId).FirstOrDefault();
                                if (parentRecord is not null)
                                {
                                    milestoneDates.Add(parentRecord.Name, Convert.ToDateTime(datas["MilestoneDate"]));
                                }
                            }
                        }
                    }
                }
                var collection = JsonSerializer.Deserialize<Dictionary<string, object>>(content);

                if (collection is null)
                {
                    await Gantt.HideSpinnerAsync();
                    return;
                }
                await Task.Delay(100);
                if (DateTime.TryParse(collection["ProjectCompletionDate"].ToString(), out DateTime projectDate))
                {
                    milestoneDates.Add("Project Completion date", projectDate);
                }
                StateHasChanged();
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
        private string GetHistoricalCollection()
        {
            string historicalDataCollection = string.Empty;

            for (int year = 2021; year < 2026; year++)
            {
                string currentDir = Directory.GetCurrentDirectory();
                // Combine the current directory with the relative path
                string fullPath = Path.Combine(currentDir, "Components/Models/ProgressHistoricalData.json");
                StreamReader streamReader = new StreamReader(fullPath);
                historicalDataCollection += $"HistoricalTaskDataCollection{year}: " + JsonDocument.Parse(streamReader.ReadToEnd()).RootElement.GetProperty($"TaskDataCollection{year}").ToString() + ", ";
            }
            return historicalDataCollection;
        }
    }
}
