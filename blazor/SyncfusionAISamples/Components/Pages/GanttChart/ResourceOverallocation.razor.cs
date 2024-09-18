using Microsoft.JSInterop;
using Syncfusion.Blazor.Gantt;
using SyncfusionAISamples.Models;
using System.Text.Json;

namespace SyncfusionAISamples.Components.Pages.GanttChart
{
    public partial class ResourceOverallocation
    {
        public SfGantt<GanttDataModel.TaskInfoModel> Gantt;
        private List<GanttDataModel.TaskInfoModel> TaskCollection { get; set; }
        private List<GanttDataModel.ResourceInfoModel> ResourceCollection { get; set; }
        private static List<GanttDataModel.AssignmentModel> AssignmentCollection { get; set; }
        private string AIPrompt = string.Empty;
        private bool showMessage;
        List<int> TaskIds = new();
        protected override void OnInitialized()
        {
            TaskCollection = GanttDataModel.GetTaskCollection().Take(6).ToList();
            ResourceCollection = GanttDataModel.GetResources;
            AssignmentCollection = GanttDataModel.GetAssignmentCollection();
        }
        private string GeneratePrompt(List<GanttDataModel.TaskInfoModel> TaskCollection, List<GanttDataModel.ResourceInfoModel> ResourceCollection, List<GanttDataModel.AssignmentModel> AssignmentCollection)
        {
            return @"Here's a revised prompt to ensure the AI provides the results in JSON format:

    Function as an AI assistant responsible for optimizing resource assignments in a project management system. Your goal is to prevent overlapping task assignments for each resource, ensuring no resource is double-booked.

    1. **Check Task Assignments:** Review the start and end dates of tasks assigned to each resource to identify overlaps.

    2. **Resolve Conflicts:** Reassign conflicting tasks to other available resources without scheduling conflicts, ensuring each task is assigned to a resource.

    3. **Provide Updated Assignments:** Return the updated assignments.

    Please return a JSON object with the following:

    - **AssignmentCollection:** Updated resource assignments.
    - **TaskIds:** List of task IDs where resource assignments have changed.

    The response must be in JSON format only, with no additional explanations or content. 

    Here is the dataset:
    - Task Collection Data: " + JsonSerializer.Serialize(TaskCollection) + @"
    - Resource Collection Data: " + JsonSerializer.Serialize(ResourceCollection) + @"
    - Assignment Collection Data: " + JsonSerializer.Serialize(AssignmentCollection) + @"

    Note: Ensure the response is a JSON string and does not include any extra information.";
        }
        private async Task Reload()
        {
            await JsInterop.InvokeVoidAsync("window.location.reload");
        }
        private async Task OpenAIHandler()
        {
            await Gantt.ShowSpinnerAsync();
            TaskIds = new();
            showMessage = false;
            List<GanttDataModel.AssignmentModel> sortedCollection = new List<GanttDataModel.AssignmentModel>();
            var AIPrompt = GeneratePrompt(TaskCollection, ResourceCollection, AssignmentCollection);
            string result = await OpenAIService.GetCompletionAsync(AIPrompt);
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
                string response = JsonDocument.Parse(result).RootElement.GetProperty("AssignmentCollection").ToString();
                string taskIdCollection = JsonDocument.Parse(result).RootElement.GetProperty("TaskIds").ToString();
                if (response is not null)
                {
                    var collection = JsonSerializer.Deserialize<List<GanttDataModel.AssignmentModel>>(response);
                    if (collection is not null)
                    {
                        sortedCollection = collection;
                    }
                }
                if (taskIdCollection is not null)
                {
                    var collection = JsonSerializer.Deserialize<List<int>>(taskIdCollection);
                    if (collection is not null)
                    {
                        TaskIds = collection;
                    }
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
