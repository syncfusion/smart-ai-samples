﻿using Syncfusion.Blazor.DocumentEditor;
using System.Text.Json;
using Syncfusion.Blazor.Data;
using Syncfusion.Blazor.InteractiveChat;
using SyncfusionAIWasmExamples.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace SyncfusionAIWasmExamples.Pages.DocumentEditor
{
    public partial class Summarization
    {
        [Inject]
        IJSRuntime JS {  get; set; }
        private SfAIAssistView AIAssist;
        private bool isDocumentChanged = false;
        private DocumentSummarizer summarizer;

        protected override Task OnInitializedAsync()
        {
            summarizer = new DocumentSummarizer(embedder, openAIBackend);
            return base.OnInitializedAsync();
        }

        private async Task promptToolbarClick(AssistViewToolbarItemClickedEventArgs args)
        {

            if (args.Item.IconCss.EndsWith("close"))
            {
                await this.OnCloseButtonClick();
            }
            else if (args.Item.IconCss.EndsWith("copy"))
            {
                string Response = AIAssist.Prompts[args.DataIndex].Response;
                await JS.InvokeVoidAsync("copyToClipboard", Response);
            }
            else if (args.Item.IconCss.EndsWith("new"))
            {
                string Response = AIAssist.Prompts[args.DataIndex].Response;
                await this.OnInsert(Response);
            }
        }
        private async Task PromptRequest(AssistViewPromptRequestedEventArgs args)
        {
            string Response = await this.OnArrowButtonClick(args.Prompt);
            args.Response = Response;
        }

        private List<string> _promptSuggestions = new List<string>();

        SfDocumentEditorContainer container;
        DocumentEditorSettingsModel settings = new DocumentEditorSettingsModel() { ShowRuler = true };
        internal string DocumentName { get; set; } = "Getting Started";
        private bool VisibleProperty { get; set; } = false;
        private string CurrentWidth { get; set; } = "100%";
        private bool ShowProperties { get; set; } = true;
        private string Description = string.Empty;
        private string divHeight = "150%";
        private string AIAssistVisible = "none";
        private string PlaceholderText = string.Empty;
        private bool isAIAssistantChecked = false;
        private bool IsInitialLoad = true;
        public async void OnCreated(object args)
        {
            SfDocumentEditor documentEditor = container.DocumentEditor;
            string sfdt = "{\"sfdt\":\"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\"}";
            await documentEditor.OpenAsync(sfdt);
            divHeight = await JS.InvokeAsync<string>("getDivHeight", (object)"documentEditorDiv");
            await container.ResizeAsync();
            IsInitialLoad = false;
        }
        public async void OnDocumentChange()
        {
            isDocumentChanged = true;
            if (!IsInitialLoad)
            {
                await this.Dispose();
                if (!(await container.DocumentEditor.GetIsDocumentEmptyAsync()))
                    await this.AIAssist.ExecutePromptAsync("Summarize this document");
            }
            StateHasChanged();

        }
        public async void AssistOnCreated(object args)
        {
            if (this.isDocumentChanged)
            {
                await this.AIAssist.ExecutePromptAsync("Summarize this document");
            }
        }
        private async void Change(Syncfusion.Blazor.Buttons.ChangeEventArgs<bool> args)
        {
            if (args.Checked)
            {
                await this.ShowAIAssistantPane();
            }
            else
            {
                await this.OnCloseButtonClick();
            }
        }

        public async Task ShowAIAssistantPane()
        {
            this.isAIAssistantChecked = true;
            this.ShowProperties = false;
            this.CurrentWidth = "75%";
            await container.ResizeAsync();
            await OnSummarizeCLick();
        }

        private async Task OnSummarizeCLick(string? text = null)
        {
            this.AIAssistVisible = "block";
            this.PlaceholderText = "Ask a question about this document.";
            this.VisibleProperty = true;
            if (this.isDocumentChanged)
            {
                await this.AIAssist.ExecutePromptAsync("Summarize this document");
            }
            StateHasChanged();
            this.VisibleProperty = false;
            StateHasChanged();
        }

        private async Task<string> OnArrowButtonClick(string Prompt)
        {
            this.VisibleProperty = true;
            string result = "";
            if (Prompt == "Summarize this document")
            {
                await this.UploadDocument();
                result = await summarizer.GetDocumentSummary();
                string suggestions = await summarizer.GetSuggestions();
                _promptSuggestions = new List<string>(suggestions.Split('\n').Where(s => !string.IsNullOrWhiteSpace(s)));
            }
            else
            {
                string SystemPrompt = $"You are a helpful assistant. Use the provided context to answer the user question. Always respond in proper HTML format, but do not include <html>, <head>, or <body> tags. Context:";
                result = await summarizer.GetAnswer(SystemPrompt, Prompt);
            }
            this.VisibleProperty = false;
            return result;

        }
        private async Task OnCloseButtonClick()
        {
            this.AIAssistVisible = "none";
            this.CurrentWidth = "100%";
            this.isAIAssistantChecked = false;
            this.ShowProperties = true;
            await container.ResizeAsync();
            StateHasChanged();
        }

        private async Task Dispose()
        {
            _promptSuggestions?.Clear();
            AIAssist?.Prompts.Clear();
        }

        private async Task Summarize(string? text = null)
        {
            if (text != null)
            {
                string SystemPrompt = "You are a helpful assistant. Your task is to analyze the provided text and generate short summary. Always respond in proper HTML format, but do not include <html>, <head>, or <body> tags.";
                await summarizer.GetAnswerFromGPT(SystemPrompt, text);
            }
            else
            {
                await this.UploadDocument();
                await summarizer.GetDocumentSummary();
                string suggestions = await summarizer.GetSuggestions();
                _promptSuggestions = new List<string>(suggestions.Split('\n').Where(s => !string.IsNullOrWhiteSpace(s)));
            }
        }

        private async Task UploadDocument()
        {
            SfDocumentEditor editor = container.DocumentEditor;
            string base64Data = await editor.SaveAsBlobAsync(FormatType.Docx);
            byte[] data = Convert.FromBase64String(base64Data);
            base64Data = string.Empty;
            Stream stream = new MemoryStream(data);
            Syncfusion.DocIO.DLS.WordDocument document = new Syncfusion.DocIO.DLS.WordDocument(stream, Syncfusion.DocIO.FormatType.Docx);
            string text = document.GetText();
            this.isDocumentChanged = false;
            await summarizer.LoadDocument(text);
        }
        private async Task OnInsert(string value)
        {
            WordDocument document = WordDocument.LoadString(value, ImportFormatType.Html);
            string sfdtText = JsonSerializer.Serialize(document);
            await container.DocumentEditor.Editor.PasteAsync(sfdtText);
            await container.DocumentEditor.Editor.InsertTextAsync("\n");
        }
        public void OnExport(object args)
        {
            SfDocumentEditor documentEditor = container.DocumentEditor;
            documentEditor.SaveAsync(DocumentName, FormatType.Docx);
        }
        public void Print(object args)
        {
            SfDocumentEditor documentEditor = container.DocumentEditor;
            documentEditor.PrintAsync();
        }
    }
}
