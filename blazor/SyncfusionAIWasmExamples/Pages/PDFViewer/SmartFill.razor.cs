using Microsoft.JSInterop;
using Syncfusion.Blazor.Layouts;

namespace SyncfusionAIWasmExamples.Pages.PDFViewer
{
    public partial class SmartFill
    {
        #region Properties
        private SplitterPane splitterPane;
        private bool[] isPopupVisible = new bool[3];
        private bool isMobileDevice = false;
        private bool refreshContainer = false;
        private string viewerHeight = "inherit";
        private string chevronIcon = "e-icons e-chevron-up";
        private string maxValue = "50%";
        private string minValue = "25%";
        private string size = "25%";
        private string[] copyIcons = { "e-icons e-copy", "e-icons e-copy", "e-icons e-copy" };
        public class UserData
        {
            public int ID { get; set; }
            public string Value { get; set; } = string.Empty;
        }
        private List<UserData> userDetails = new List<UserData>()
    {
        new UserData(){ ID = 0, Value = "Hi, this is Alice. You can contact me at alice456@gmail.com. I am female, born on July 15, 1998. I want to unsubscribe from a newspaper and learn courses, specifically a Cloud Computing course. I am from Texas." },
        new UserData(){ ID = 1, Value = "Hello, I'm John Paul born on March 12, 2001. I am not looking to subscribe to any newspapers or enroll in courses. I'm male and you can reach me at johnpaul2209@gmail.com. I'm from Alaska and I'm interested in a Web Development course." },
        new UserData(){ ID = 2, Value = "Hello, my name is Peter Parker, born on Sept 22, 2002. I'm interested in subscribing to a newspaper and learning through courses. I'm male, and you can contact me at peterparker03@gmail.com. I'm from New York, and I'm interested in a Digital Marketing course."}
    };
        #endregion
        private async Task CopyToClipboard(int id, string textToCopy)
        {
            copyIcons[id] = "e-icons e-check";
            // write the content to clipboard
            await JsRuntime.InvokeVoidAsync("navigator.clipboard.writeText", textToCopy);
            await Task.Delay(5000);
            copyIcons[id] = "e-icons e-copy";
        }
        private void OnResizeStop(ResizingEventArgs args)
        {
            // refresh the pdf Viewer
            refreshContainer = true;
        }
        private void ChangeIcon()
        {
            if (splitterPane != null)
            {
                if (double.Parse(splitterPane.Size.TrimEnd('%')) <= 30)
                {
                    // change the size to max value
                    size = "50%";
                    // refresh the pdf Viewer and change the icon
                    refreshContainer = true;
                    chevronIcon = "e-icons e-chevron-down";
                }
                else if (double.Parse(splitterPane.Size.TrimEnd('%')) >= 45)
                {
                    // change the size to min value
                    size = "25%";
                    refreshContainer = true;
                    chevronIcon = "e-icons e-chevron-up";
                }
            }
        }
        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (firstRender)
            {
                isMobileDevice = await JsRuntime.InvokeAsync<bool>("isMobileDevice", false);
                if (isMobileDevice)
                {
                    StateHasChanged();
                }
            }
            if (splitterPane != null)
            {
                if (double.Parse(splitterPane.Size.TrimEnd('%')) >= 45)
                {
                    chevronIcon = "e-icons e-chevron-down";
                }
                else if (double.Parse(splitterPane.Size.TrimEnd('%')) <= 30)
                {
                    chevronIcon = "e-icons e-chevron-up";
                }
            }
            if (refreshContainer)
            {
                //get the pdf pane height and set it as pdfViewer height
                var height = await JsRuntime.InvokeAsync<double>("getPdfPaneHeight");
                viewerHeight = height.ToString() + "px";
                StateHasChanged();
                //set to initial state
                refreshContainer = false;
                viewerHeight = "inherit";
            }
            await base.OnAfterRenderAsync(firstRender);
        }
        public void Dispose()
        {
            if (splitterPane is IDisposable disposable)
            {
                disposable.Dispose();
            }
            userDetails?.Clear();
            copyIcons = new string[0];
        }
    }
}
