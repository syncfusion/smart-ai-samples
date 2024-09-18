using Microsoft.JSInterop;
using Syncfusion.Blazor.Gantt;
using Syncfusion.Blazor.Notifications;
using SyncfusionAISamples.Models;
using System.Text.Json;

namespace SyncfusionAISamples.Components.Pages.GanttChart
{
    public partial class PrioritizeTask
    {
        public SfGantt<GanttDataModel.TaskInfoModel> Gantt = new();
        SfToast ToastObj;
        private List<GanttDataModel.TaskInfoModel> TaskCollection { get; set; } = new();
        private bool showMessage;
        private string summary = string.Empty;
        private Dictionary<string, string> riskAnalyzeContent = new();
        private Dictionary<string, string> riskAnalyzePriority = new();
        private List<GanttDataModel.ResourceInfoModel> ResourceCollection { get; set; } = new();
        private static List<GanttDataModel.AssignmentModel> AssignmentCollection { get; set; } = new();
        List<int> taskIds = new();
        protected override void OnInitialized()
        {
            TaskCollection = GanttDataModel.GetBaselineCollection();
            ResourceCollection = GanttDataModel.GetResources;
            AssignmentCollection = GanttDataModel.ResourceAssignmentCollection();
        }
        private string GeneratePrompt(List<GanttDataModel.TaskInfoModel> TaskCollection)
        {
            return @"
    1. Analyze the 'TaskCollection' below to identify critical tasks. Focus on tasks where the 'EndDate' is later than the 'BaselineEndDate'. Only consider tasks where both dates are not null and compare only the dates, not the times. Return the collection of critical tasks in the 'TaskDetails' format. Provide no additional explanation or content.
    Here is the 'TaskCollection': " + JsonSerializer.Serialize(Gantt.GetCurrentViewRecords()) +
        ", ResourceCollection: " + JsonSerializer.Serialize(ResourceCollection) +
        ", ResourceAssignmentCollection: " + JsonSerializer.Serialize(AssignmentCollection) + "/n Note: The response must be a JSON string with no additional explanation.";
        }
        private async Task Reload()
        {
            await JsInterop.InvokeVoidAsync("window.location.reload");
        }
        private async Task OpenAIHandler()
        {
            await Gantt.ShowSpinnerAsync();
            await ToastObj.HideAsync();
            taskIds = new();
            showMessage = false;
            summary = string.Empty;
            riskAnalyzeContent = new();
            riskAnalyzePriority = new();
            Dictionary<string, IEnumerable<object>> ganttData = new Dictionary<string, IEnumerable<object>>();
            List<GanttDataModel.TaskInfoModel> generatedCollection = new();
            List<GanttDataModel.AssignmentModel> sortedCollection = new List<GanttDataModel.AssignmentModel>();
            string AIPrompt = GeneratePrompt(GanttDataModel.HistoricalTaskData);
            string result = await OpenAIService.GetCompletionAsync(AIPrompt, true, true);
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
                var contentAIPrompt = @"Using the previously identified critical tasks, update the 'AssignmentCollection' by assigning additional resources to unassigned tasks. If there are tasks in 'TaskCollection' without any assigned resources, allocate available resources (ensuring no task has the same resource assigned more than once). Update the values of below fields and return the 'AssignmentCollection' as a property in below format.
             {
              AssignmentCollection: [
                {
                   PrimaryId: value,
                   TaskId: value,
                   ResourceId: value,
                   Unit: value
                },
              ]
            }
              Do not provide any other format or values.";

                string contentResult = await OpenAIService.GetCompletionAsync(contentAIPrompt, true, true);
                var taskPrompt = @"Compare the existing collection " + JsonSerializer.Serialize(AssignmentCollection) + " with the updated assignment collection " + contentResult + ". Provide a JSON response containing 'TaskIds', which lists the IDs of tasks with modified resource assignments, and 'Summary', which contains a brief report summarizing the critical tasks identified and the changes made to resource assignments. Output should follow below JSON schema \n { 'TaskIds': [], 'Summary': ''}'";
                string taskResult = await OpenAIService.GetCompletionAsync(taskPrompt, true, true);

                string response = JsonDocument.Parse(contentResult).RootElement.GetProperty("AssignmentCollection").ToString();
                if (response is not null)
                {
                    var collection = JsonSerializer.Deserialize<List<GanttDataModel.AssignmentModel>>(response);
                    if (collection is not null)
                    {
                        sortedCollection = collection;
                    }
                }
                string taskIdCollection = JsonDocument.Parse(taskResult).RootElement.GetProperty("TaskIds").ToString();
                summary = JsonDocument.Parse(taskResult).RootElement.GetProperty("Summary").ToString();
                await Task.Delay(10);
                await this.ToastObj.ShowAsync();
                if (taskIdCollection is not null)
                {
                    taskIds = JsonSerializer.Deserialize<List<int>>(taskIdCollection);
                }
                if (sortedCollection is not null && sortedCollection.Count > 0)
                {
                    AssignmentCollection = sortedCollection.Cast<GanttDataModel.AssignmentModel>().ToList();
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
    }
}
