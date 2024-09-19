using Microsoft.AspNetCore.Components;
using Syncfusion.Blazor.Grids;
using Syncfusion.Blazor.Kanban;
using Syncfusion.Blazor.Notifications;
using SyncfusionAISamples.Models;
using System.Text.Json;

namespace SyncfusionAISamples.Components.Pages.Kanban
{
    public partial class AITaskRecommendation
    {
        SfToast ToastObj;
        public string[] SelectedAssignees { get; set; } = new string[] { };
        private string ToastTarget { get; set; } = "#toast-kanban-observable";
        SfKanban<SmartSuggestionDataModel> kanbanObj;
        public string ContentGenerateTask = "Generate Tasks";
        public string BacklogButtonViewContent = "View as Backlog";
        private string TextBoxValue = string.Empty;
        private string TasksValue = string.Empty;
        private bool enableProjectDetailsDialog = false;
        private bool isGeneratedProjectTasks = false;
        private bool enableTaskEditing = false;
        private bool isHomapage = true;
        private bool showSprintBoard = false;
        private bool showBacklogs = false;
        private bool showBacklogBoard = true;
        private List<SmartSuggestionDataModel> smartSuggestion = new List<SmartSuggestionDataModel>();
        private DialogSettings DialogParams = new DialogSettings { MinHeight = "400px", Width = "450px" };
        private string waringText = "Click \"Generate Tasks\" to preview";
        private void GoToBacklogBoardView()
        {
            if (BacklogButtonViewContent == "View as Board")
            {
                BacklogButtonViewContent = "View as Backlog";
                showBacklogBoard = true;
            }
            else
            {
                showBacklogBoard = false;
                BacklogButtonViewContent = "View as Board";
            }
            showSprintBoard = false;
        }

        private RenderFragment GetTemplate() => builder =>
        {
            builder.OpenElement(0, "div");
            builder.AddContent(1, "An error occurred during the AI process, Please try again.");
            builder.CloseElement();
        };

        public void BeginGenerateTasks(Syncfusion.Blazor.SplitButtons.ProgressEventArgs args)
        {
            ContentGenerateTask = "Generating...";
        }

        public async Task EndGenerateTasks(Syncfusion.Blazor.SplitButtons.ProgressEventArgs args)
        {
            while (!isGeneratedProjectTasks)
            {
                await Task.Delay(1000);
            }
            this.isHomapage = false;
            ContentGenerateTask = "Generate Tasks";
            this.CloseDialog();
            showBacklogs = true;
        }

        private async Task GenerateProjectTasks()
        {
            try
            {
                if (!string.IsNullOrEmpty(TextBoxValue) && !string.IsNullOrEmpty(TasksValue))
                {
                    string result = "";
                    var description = $"Generate {TasksValue} task recommendations for {TextBoxValue}. Each task should include the following fields: Id (like example: ID should be in project name simple 4char word - 1), Title, Status, Description, Assignee, StoryPoints, Color and Due Date, formatted according to the dataset. Assign each task to the Assignee: empty string, set the Status to 'Open', and use black for the Color. Use the dataset provided below to create your recommendations. IMPORTANT: Return the data strictly in JSON format with all the required fields. Only the JSON data is needed, no additional text.Return only the JSON array format without any explanations.";
                    result = await AIChatService.GetCompletionAsync(description);
                    string data = result.Replace("```json", "").Replace("```", "").Replace("\r", "").Replace("\n", "").Replace("\t", "").Trim();
                    List<SmartSuggestionDataModel> modifiedData;
                    modifiedData = JsonSerializer.Deserialize<List<SmartSuggestionDataModel>>(data);
                    smartSuggestion = modifiedData != null ? smartSuggestion.Concat(modifiedData).ToList() : smartSuggestion;
                    this.isGeneratedProjectTasks = true;
                }
                else
                {
                    waringText = string.IsNullOrEmpty(TextBoxValue) && string.IsNullOrEmpty(TasksValue) ? "Enter the required task creation details" : !string.IsNullOrEmpty(TasksValue) ? "Enter the Project Details" : "Enter the number of tasks";
                }
            }
            catch
            {
                await this.ToastObj.ShowAsync(new ToastModel { ContentTemplate = @GetTemplate(), ShowCloseButton = true, Timeout = 0 });
            }
        }

        private void OpenProjectDetailsDialog()
        {
            this.enableProjectDetailsDialog = true;
        }

        private async Task GenerateTasks()
        {
            this.isGeneratedProjectTasks = false;
            await this.GenerateProjectTasks();
        }

        private void SaveTask()
        {
            this.enableProjectDetailsDialog = false;
            this.TasksValue = string.Empty;
            this.TextBoxValue = string.Empty;
            this.isGeneratedProjectTasks = false;
            StateHasChanged();
        }

        private void CloseDialog()
        {
            this.enableProjectDetailsDialog = false;
            this.TasksValue = string.Empty;
            this.TextBoxValue = string.Empty;
            this.isGeneratedProjectTasks = false;
            StateHasChanged();
        }

        public void TaskEditingHandler(Syncfusion.Blazor.Grids.ActionEventArgs<SmartSuggestionDataModel> args)
        {
            if (args.RequestType.ToString() == "Add")
            {
                enableTaskEditing = true;
            }
            else
            {
                enableTaskEditing = false;
            }
        }

        public void RowCreatedHandler(RowCreatedEventArgs<SmartSuggestionDataModel> args)
        {
            args.Data.Status = "Open";
            args.Data.Color = "#000000";
        }
    }
}
