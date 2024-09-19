using Microsoft.JSInterop;
using Syncfusion.Blazor.InteractiveChat;
using Syncfusion.Blazor.SfPdfViewer;
using SyncfusionAISamples.Models;
using System.Text.RegularExpressions;

namespace SyncfusionAISamples.Components.Pages.PDFViewer
{
    public partial class Summarizer
    {
        private static SfPdfViewer2 sfPdfViewer2;
        private SfAIAssistView aIAssistView;
        private bool isPopupVisible = false;
        private bool isMobileDevice = false;
        private bool isDocumentLoaded = false;
        private bool isSummarized = false;
        private bool isDocumentLoadedInAI = false;
        private bool refreshContainer = false;
        private PDFViewerModel summarizer;
        private MemoryStream documentStream = new MemoryStream();
        private string _promptPlaceholder = "Type your prompt for assistance...";

        protected override Task OnInitializedAsync()
        {
            summarizer = new PDFViewerModel(embedder, AIChatService);
            return base.OnInitializedAsync();
        }

        private List<string> _promptSuggestions = new List<string>();

        private void PromptToolbarItemClicked(AssistViewToolbarItemClickedEventArgs args)
        {
            // handle your actions
        }

        private async Task ResponseToolbarItemClicked(AssistViewToolbarItemClickedEventArgs args)
        {
            if (args.Item.IconCss == "e-icons e-aiassist-copy")
            {
                string pattern = @"<a[^>]*>(\d+)</a>";
                string textToCopy = Regex.Replace(_prompts[args.DataIndex].Response, pattern, "$1");
                await JsRuntime.InvokeVoidAsync("navigator.clipboard.writeText", textToCopy);
            }
        }

        private List<AssistViewPrompt> _prompts = new List<AssistViewPrompt>();

        private void ToggleAssistView()
        {
            isPopupVisible = !isPopupVisible;
            refreshContainer = true;
        }

        //Will be called when the prompt is entered 
        private async Task OnPromptRequested(AssistViewPromptRequestedEventArgs args)
        {
            await Task.Delay(2000);
            string suggestions = string.Empty;
            //get the response from the AI for the prompt
            if (args.Prompt == "Summarize this document.")
            {
                args.Response = await SummaryPDF();
                suggestions = await summarizer.GetSuggestions();
            }
            else
            {
                var response = await summarizer.GetAnswer(args.Prompt);
                // Split by "suggestions"
                string[] responseArray = response.Split(new[] { "suggestions" }, StringSplitOptions.None);
                if (responseArray.Length > 1)
                {
                    args.Response = responseArray[0];
                    suggestions = responseArray[1];
                }
            }
            _promptSuggestions = new List<string>(suggestions.Split('\n').Where(s => !string.IsNullOrWhiteSpace(s)).Select(s => System.Text.RegularExpressions.Regex.Replace(s, @"^\d+\.\s*", "")));
            string pattern = @"\[(?:Page )?(\d+(?:,\s*\d+)*)\]";
            // Replace the pattern with an HTML anchor tag
            args.Response = Regex.Replace(args.Response, pattern, m =>
            {
                // Split the matched value by commas and optional spaces
                var pages = m.Groups[1].Value.Split(new[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries);
                var links = string.Join(", ", pages.Select(page => $"<a href=\"pdfviewer/summarizer/#\" onclick=\"goToPage({page})\">{page}</a>"));
                return $"[{links}]";
            });
        }

        [JSInvokable]
        public async Task GoToPage(int pageNumber)
        {
            if (pageNumber > 0)
            {
                await sfPdfViewer2.GoToPageAsync(pageNumber);
                if (isMobileDevice)
                {
                    isPopupVisible = false;
                    StateHasChanged();
                }
            }
        }

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (firstRender)
            {
                isMobileDevice = await JsRuntime.InvokeAsync<bool>("isMobileDevice", false);
                var dotNetObjectRef = DotNetObjectReference.Create(this);
                await JsRuntime.InvokeVoidAsync("initializeJSInterop", dotNetObjectRef);
            }
            await base.OnAfterRenderAsync(firstRender);
            if (refreshContainer)
            {
                await Task.Delay(300);
                await sfPdfViewer2.UpdateViewerContainerAsync();
                if (isPopupVisible && !isSummarized)
                {
                    isSummarized = true;
                    //Initial prompt for AI
                    await aIAssistView.ExecutePromptAsync("Summarize this document.");
                    StateHasChanged();
                }
                refreshContainer = false;
            }
        }

        private async void ToolbarItemClicked(AssistViewToolbarItemClickedEventArgs args)
        {
            if (args.Item.IconCss == "e-icons e-close")
            {
                // Close the popup and refresh the container
                isPopupVisible = false;
                refreshContainer = true;
            }
            else if (args.Item.IconCss == "e-icons e-refresh")
            {
                if (_prompts.Count > 0)
                {
                    AssistViewPrompt lastPrompt = _prompts.Last();
                    // Remove the last prompt from the list
                    _prompts.RemoveAt(_prompts.Count - 1);
                    // Request the last prompt from the list
                    await aIAssistView.ExecutePromptAsync(lastPrompt.Prompt);
                }
            }
        }

        public void DocumentLoaded(LoadEventArgs args)
        {
            isDocumentLoaded = true;

        }
        public void DocumentUnLoaded(UnloadEventArgs args)
        {
            //reset to initial state
            isDocumentLoaded = false;
            isSummarized = false;
            isDocumentLoadedInAI = false;
            isPopupVisible = false;
            _prompts?.Clear();
            _promptSuggestions?.Clear();
        }

        public void Dispose()
        {
            isDocumentLoaded = false;
            isSummarized = false;
            isDocumentLoadedInAI = false;
            isPopupVisible = false;
            _prompts?.Clear();
            _promptSuggestions?.Clear();
            if (summarizer is IDisposable disposableSummarizer)
            {
                disposableSummarizer.Dispose();
            }
            documentStream?.Dispose();
        }

        #region AI Query Methods
        private async Task<string> SummaryPDF()
        {
            string systemPrompt = "You are a helpful assistant. Your task is to analyze the provided text and generate short summary.";
            if (!isDocumentLoadedInAI)
            {
                byte[] bytes = await sfPdfViewer2.GetDocumentAsync();
                documentStream = new MemoryStream(bytes);
                await summarizer.LoadDocument(documentStream, "application/pdf");
                isDocumentLoadedInAI = true;
            }
            //get the summary of the PDF
            return await summarizer.FetchResponseFromAIService(systemPrompt);
        }
        #endregion
    }
}
