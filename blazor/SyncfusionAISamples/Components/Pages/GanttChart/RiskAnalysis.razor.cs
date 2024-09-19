using Microsoft.JSInterop;
using Syncfusion.Blazor.Gantt;
using SyncfusionAISamples.Models;
using System.Text.Json;

namespace SyncfusionAISamples.Components.Pages.GanttChart
{
    public partial class RiskAnalysis
    {
        public SfGantt<GanttDataModel.TaskInfoModel> Gantt = new();
        private List<GanttDataModel.TaskInfoModel> TaskCollection { get; set; } = new();
        private bool showMessage;
        private Dictionary<string, string> riskAnalyzeContent = new();
        private Dictionary<string, string> riskAnalyzePriority = new();

        protected override void OnInitialized()
        {
            TaskCollection = GanttDataModel.DataSourceCollection();
        }
        private string GeneratePrompt(List<GanttDataModel.TaskInfoModel> TaskCollection)
        {
            return @"

1, You analyze the project complete collection in below 'TaskCollection' to identify potential risks and suggest mitigation strategies.
2, The collection contains the predessor(Dependency) values with type of SS(start to start), SF(Start to finish), FS(finish to start), FF(finish to finish) and the default type is SS. Depdency values not necessory in each task.
3, Analyze the complete project task collection duration and if any task get risk whole project and dependent task gets risk.
        TaskCollection: " + JsonSerializer.Serialize(Gantt.GetCurrentViewRecords())

            + @"Ensure the output is in JSON object format name of 'TaskDetails' alone with `Priority` key - high or low risk and `Summary` key  - details of the risk and mitigation strategy and Summary details given format is (TaskId-summary details), don't give another values and avoid any unwanted content or unwanted JSON tags. No other explanation or content to be returned.

        Output format:
        '{
        'TaskDetails':[{
        'Priority':value,
        'Summary':value
        },]
        }'

        Don't give any other values. Note: Return only this JSON response with no other content.";
        }
        private async Task Reload()
        {
            await JsInterop.InvokeVoidAsync("window.location.reload");
        }
        private async Task OpenAIHandler()
        {
            await Gantt.ShowSpinnerAsync();
            showMessage = false;
            riskAnalyzeContent = new();
            riskAnalyzePriority = new();
            string AIPrompt = GeneratePrompt(GanttDataModel.HistoricalTaskData);
            string result = await AIChatService.GetCompletionAsync(AIPrompt);

            try
            {
                if (result.StartsWith("```json"))
                {
                    result = result.Replace("```json", "").Replace("```", "").Trim();
                }
                else if (result.StartsWith("```"))
                {
                    result = result.Replace("```", "").Replace("```", "").Trim();
                }
                var content = JsonDocument.Parse(result).RootElement.GetProperty("TaskDetails").ToString();
                var collection = JsonSerializer.Deserialize<List<Dictionary<string, string>>>(content);
                if (collection is null)
                {
                    await Gantt.HideSpinnerAsync();
                    return;
                }
                foreach (var data in collection)
                {
                    var id = data["Summary"].Split("-")[0];
                    riskAnalyzeContent.Add(id, data["Summary"].Split("-")[1]);
                    riskAnalyzePriority.Add(id, data["Priority"]);
                }
                await Gantt.RefreshAsync();
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
    }
}
