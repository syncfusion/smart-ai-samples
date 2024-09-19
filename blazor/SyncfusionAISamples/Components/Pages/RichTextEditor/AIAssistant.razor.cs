using Markdig;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Syncfusion.Blazor.Buttons;
using Syncfusion.Blazor.DropDowns;
using Syncfusion.Blazor.Inputs;
using Syncfusion.Blazor.Notifications;
using Syncfusion.Blazor.RichTextEditor;
using Syncfusion.Blazor.SplitButtons;

namespace SyncfusionAISamples.Components.Pages.RichTextEditor
{
    public partial class AIAssistant
    {
        SfToast ToastObj;
        private string ToastTarget { get; set; } = "#scroll-restricted";
        SfRichTextEditor rteObj;
        SfRichTextEditor leftRteChildObj;
        SfRichTextEditor rightRteChildObj;
        private string Value { get; set; } = "<h5><span>Integrate AI with the Editor</span></h5><p>Integrate the AI assistant into the rich text editor by capturing the content from the editor, sending it to the AI service, and displaying the results or suggestions back in the editor.</p><h6>Summarize</h6><p>This function condenses the selected content into a brief summary, capturing the main points succinctly.</p><h6>Elaborate</h6><p>This function expands the selected content, adding additional details and context.</p><h6>Rephrase</h6><p>This function rewrites the selected content to convey the same meaning using different words or structures. It also enables rephrase options and disables language selection.</p><h6>Correct Grammar</h6><p>This function reviews and corrects the grammar of the selected content, ensuring it adheres to standard grammatical rules.</p><h6>Translate</h6><p>This function translates the selected content into the specified language, enabling language selection and disabling rephrase options.</p>";
        private bool dialogVisible { get; set; }
        private bool enabelAIAssitantButton { get; set; } = false;
        private bool enabelRegenerateContentButton { get; set; } = false;
        private bool enabelContentButton { get; set; } = true;
        private string promptQuery = string.Empty;
        private string subQuery = string.Empty;
        private string[] chipValue = ["Standard"];
        private string translatelanguage = "EN";
        private string dropVal { get; set; } = "Rephrase";
        private bool enableRephraseChips { get; set; } = true;
        private bool enableLanguageList { get; set; } = false;
        private bool noResultsFound { get; set; } = false;
        public bool isContentGenerating { get; set; } = true;
        private string AIResult { get; set; } = string.Empty;
        private bool isSentimentCheck { get; set; } = false;
        private MarkdownPipeline pipeline { get; set; } = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();
        private string sentiment = "";
        private string apiResultData = "";

        private void UpdateStatus(Syncfusion.Blazor.RichTextEditor.ChangeEventArgs args)
        {
            Value = args.Value;
            enabelAIAssitantButton = string.IsNullOrWhiteSpace(Value);
        }

        private void UpdateTextAreaStatus(InputEventArgs args)
        {
            Value = args.Value;
            enabelRegenerateContentButton = string.IsNullOrWhiteSpace(Value);
        }

        private async Task AIQuerySelectedMenu(MenuEventArgs args)
        {
            await DialogueOpen(args.Item.Text);
        }

        private async Task Rephrase()
        {
            await DialogueOpen("Rephrase");
        }

        private async Task DialogueOpen(string selectedQuery)
        {
            var selectionText = await rteObj.GetSelectedHtmlAsync();
            if (!string.IsNullOrEmpty(selectionText))
            {
                dialogVisible = true;
                dropVal = QueryList.FirstOrDefault(q => q.Text.Equals(selectedQuery, StringComparison.OrdinalIgnoreCase))?.ID;
                promptQuery = selectionText;
                await this.rteObj.SaveSelectionAsync();
                await this.leftRteChildObj.RefreshUIAsync();
                await UpdateAISuggestionsData(selectedQuery);
            }
            else
            {
                await this.ToastObj.ShowAsync(new ToastModel { ContentTemplate = @GetTemplate(true), ShowCloseButton = true, Timeout = 0 });
            }
        }

        private async Task SelectedChipsChanged(SelectionChangedEventArgs args)
        {
            if (chipValue.Length == 0 && args != null && args.RemovedItems.Length > 0)
            {
                chipValue = [args.RemovedItems[0]];
            }
            await UpdateAISuggestionsData("Rephrase");
        }

        private async Task AITranslateDropdownList(ChangeEventArgs<string, Languages> args)
        {
            await UpdateAISuggestionsData("Translate");
        }

        private async Task AIQuerySelectedDropdownList(ChangeEventArgs<string, SubQuery> args)
        {
            if (!string.IsNullOrEmpty(dropVal))
            {
                chipValue = ["Standard"];
                translatelanguage = "EN";
                var selectedQuery = QueryList.FirstOrDefault(q => q.ID.Equals(dropVal, StringComparison.OrdinalIgnoreCase))?.Text;
                await UpdateAISuggestionsData(selectedQuery);
            }
        }

        private async Task UpdateAISuggestionsData(string selectedQuery)
        {
            enableRephraseChips = false;
            enableLanguageList = false;
            isSentimentCheck = false;
            switch (selectedQuery)
            {
                case "Summarize":
                    subQuery = "Briefly summarize the following text in a short and concise manner.";
                    break;
                case "Elaborate":
                    subQuery = "Elaborate/Expand on the following text, providing more detail and context.";
                    break;
                case "Rephrase":
                    enableRephraseChips = true;
                    enableLanguageList = false;
                    subQuery = $"Rephrase the following text in a {chipValue[0]} [tone/style], ensuring clarity and maintaining the original meaning.";
                    break;
                case "Correct Grammar":
                    subQuery = "Correct any grammatical errors in the following text, ensuring it is clear and well-structured.";
                    break;
                case "Translate":
                    enableLanguageList = true;
                    enableRephraseChips = false;
                    subQuery = $"Translate the following text into {translatelanguage}, preserving the original meaning and tone.";
                    break;
            }

            UpdateAISuggestionsData();
        }

        private async Task RegenerateContent()
        {
            UpdateAISuggestionsData();
        }

        private async Task ReplaceContent()
        {
            ExecuteCommandOption executeCommandOption = new ExecuteCommandOption();
            executeCommandOption.Undo = true;
            await this.rteObj.RestoreSelectionAsync();
            await this.rteObj.ExecuteCommandAsync(CommandName.InsertHTML, this.apiResultData, executeCommandOption);
            await CloseDialog();
        }

        private async Task CopyContent()
        {
            await JSRuntime.InvokeVoidAsync("copyToClipboard", Markdig.Markdown.ToPlainText(AIResult, pipeline));
        }

        private async Task CloseDialog()
        {
            dialogVisible = false;
            promptQuery = string.Empty;
            AIResult = string.Empty;
            chipValue = new[] { "Standard" };
            dropVal = "Query1";
            enableRephraseChips = true;
            enableLanguageList = false;
            sentiment = "";
            apiResultData = "";
        }

        private async Task UpdateAISuggestionsData()
        {
            try
            {
                if (!string.IsNullOrEmpty(promptQuery))
                {
                    enabelRegenerateContentButton = isContentGenerating = enabelContentButton = true;
                    string systemPrompt = subQuery.Contains("emoji followed by the sentiment in the format") ? "You are a helpful assistant. Please respond in string format." : "NOTE:Please retain the existing HTML structure and modify the content only. Ensure that the response adheres to the specified formatting.";
                    apiResultData = await AIChatService.GetCompletionAsync(promptQuery, false, false, (subQuery + systemPrompt));
                    isContentGenerating = false;
                    sentiment = isSentimentCheck ? apiResultData.Replace("\"", "").Replace("'", "") : "";
                    AIResult = isSentimentCheck ? promptQuery : apiResultData;
                    noResultsFound = string.IsNullOrEmpty(AIResult) || string.IsNullOrEmpty(promptQuery);
                    enabelRegenerateContentButton = enabelContentButton = noResultsFound;
                    await InvokeAsync(StateHasChanged);
                }
            }
            catch
            {
                await this.ToastObj.ShowAsync(new ToastModel { ContentTemplate = @GetTemplate(), ShowCloseButton = true, Timeout = 0 });
            }
        }
        private RenderFragment GetTemplate(bool hasTextSelection = false) => builder =>
        {
            builder.OpenElement(0, "div");
            builder.AddContent(1, hasTextSelection ? "Please select the content to perform the AI operation." : "An error occurred during the AI process, Please try again.");
            builder.CloseElement();
        };
        public class SubQuery
        {
            public string ID { get; set; }
            public string Text { get; set; }
        }

        public class Languages
        {
            public string ID { get; set; }
            public string Text { get; set; }
        }

        public List<SubQuery> QueryList = new List<SubQuery>
    {
        new SubQuery { ID = "Rephrase", Text = "Rephrase" },
        new SubQuery { ID = "Grammar", Text = "Correct Grammar" },
        new SubQuery { ID = "Summarize", Text = "Summarize" },
        new SubQuery { ID = "Elaborate", Text = "Elaborate" },
        new SubQuery { ID = "Translate", Text = "Translate" }
    };

        public List<Languages> LanguageList = new List<Languages>
    {
        new Languages { ID = "EN", Text = "English" },
        new Languages { ID = "ZH", Text = "Chinese (Simplified)" },
        new Languages { ID = "ZHT", Text = "Chinese (Traditional)" },
        new Languages { ID = "ES", Text = "Spanish" },
        new Languages { ID = "HI", Text = "Hindi" },
        new Languages { ID = "AR", Text = "Arabic" },
        new Languages { ID = "BN", Text = "Bengali" },
        new Languages { ID = "PT", Text = "Portuguese" },
        new Languages { ID = "RU", Text = "Russian" },
        new Languages { ID = "JA", Text = "Japanese" },
        new Languages { ID = "DE", Text = "German" },
        new Languages { ID = "KO", Text = "Korean" },
        new Languages { ID = "FR", Text = "French" },
        new Languages { ID = "IT", Text = "Italian" },
        new Languages { ID = "TR", Text = "Turkish" }
    };

        private List<ToolbarItemModel> Tools = new List<ToolbarItemModel>()
    {
        new ToolbarItemModel() { Name = "AIAssistant", TooltipText = "AI Assistant" },
        new ToolbarItemModel() { Name = "Rephrase", TooltipText = "Rephrase" },
        new ToolbarItemModel() { Command = ToolbarCommand.Bold },
        new ToolbarItemModel() { Command = ToolbarCommand.Italic },
        new ToolbarItemModel() { Command = ToolbarCommand.Underline },
        new ToolbarItemModel() { Command = ToolbarCommand.Separator },
        new ToolbarItemModel() { Command = ToolbarCommand.FontName },
        new ToolbarItemModel() { Command = ToolbarCommand.FontSize },
        new ToolbarItemModel() { Command = ToolbarCommand.FontColor },
        new ToolbarItemModel() { Command = ToolbarCommand.Separator },
        new ToolbarItemModel() { Command = ToolbarCommand.BackgroundColor },
        new ToolbarItemModel() { Command = ToolbarCommand.Formats },
        new ToolbarItemModel() { Command = ToolbarCommand.Alignments },
        new ToolbarItemModel() { Command = ToolbarCommand.Separator },
        new ToolbarItemModel() { Command = ToolbarCommand.NumberFormatList },
        new ToolbarItemModel() { Command = ToolbarCommand.BulletFormatList },
        new ToolbarItemModel() { Command = ToolbarCommand.CreateLink },
        new ToolbarItemModel() { Command = ToolbarCommand.Image },
        new ToolbarItemModel() { Command = ToolbarCommand.Separator },
        new ToolbarItemModel() { Command = ToolbarCommand.CreateTable },
        new ToolbarItemModel() { Command = ToolbarCommand.SourceCode },
        new ToolbarItemModel() { Command = ToolbarCommand.Undo },
        new ToolbarItemModel() { Command = ToolbarCommand.Redo },
    };
    }
}
