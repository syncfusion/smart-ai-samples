using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;

namespace SyncfusionAISamples.Components.Pages.SmartPaste
{
    public partial class SmartPasteWithAnnotations
    {
        private BugReportModel BugRptModel = new BugReportModel();

        private string copyIcon = "e-icons e-copy";
        private string checkIcon = "e-icons e-check";
        private int copyBtnIconIndex = -1;
        private string defaultPriority = "medium";
        private string[] priorityLists = { "Low", "Medium", "High" };
        private bool visible = false;

        private List<string> BugReports => CommonData.BugReports;


        readonly Dictionary<string, object> bugNameAttr = new Dictionary<string, object>()
        {
            { "data-smartpaste-description", "Value should represent the name of the bug in short." }
        };
        readonly Dictionary<string, object> bugDescAttr = new Dictionary<string, object>()
        {
            { "data-smartpaste-description", "Value should describe a little about the bug." }
        };
        readonly Dictionary<string, object> reporterNameAttr = new Dictionary<string, object>()
        {
            { "data-smartpaste-description", "Name must follow the format: Initial Firstname Lastname" }
        };
        readonly Dictionary<string, object> submittedDataAttr = new Dictionary<string, object>()
        {
            { "data-smartpaste-description", "Date must follow the format: Month Day. For ex: May 01" }
        };
        readonly Dictionary<string, object> reproStepsAttr = new Dictionary<string, object>()
        {
            { "data-smartpaste-description", "Identify the steps to reproduce the bug and structure each in a numbered format." },
            { "name", "reproduce-steps" }
        };
        readonly Dictionary<string, object> bugPriorityAttr = new Dictionary<string, object>()
        {
            { "data-smartpaste-description", "Only allowed values are Low, Medium and High" }
        };

        private async Task CopyToClipboard(int index)
        {
            await JSRuntime.InvokeVoidAsync("navigator.clipboard.writeText", BugReports[index]);
            copyBtnIconIndex = index;
        }
        private void HandleFormReset()
        {
            BugRptModel = new BugReportModel();
        }
        private void HandleSmartPasteClick(MouseEventArgs args)
        {
            visible = true;
        }
        private void HandlePriorityChange(ChangeEventArgs args)
        {
            string value = args.Value.ToString();
            BugRptModel.BugPriority = value;
            visible = false;
        }
    }
}
