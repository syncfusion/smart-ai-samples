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


        Dictionary<string, object> bugNameAttr = new Dictionary<string, object>()
    {
        { "data-smartpaste-description", "Extract the core purpose of the bug data and use it as the value for Bug name field" }
    };
        Dictionary<string, object> reporterNameAttr = new Dictionary<string, object>()
    {
        { "data-smartpaste-description", "Name must follow the format: Initial Firstname Lastname" }
    };
        Dictionary<string, object> submittedDataAttr = new Dictionary<string, object>()
    {
        { "data-smartpaste-description", "Date must follow the format: Month Day. For ex: May 01" }
    };
        Dictionary<string, object> reproStepsAttr = new Dictionary<string, object>()
    {
        { "data-smartpaste-description", "Structure each steps in a Numbered format." },
        { "name", "repro-steps" }
    };
        Dictionary<string, object> bugPriorityAttr = new Dictionary<string, object>()
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
