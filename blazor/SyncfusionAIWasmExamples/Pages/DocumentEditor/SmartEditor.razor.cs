﻿using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Syncfusion.Blazor.DocumentEditor;
using System.Text.Json;

namespace SyncfusionAIWasmExamples.Pages.DocumentEditor
{
    public partial class SmartEditor
    {
        [Inject]
        private IJSRuntime JS { get; set; }
        public string PopupType = string.Empty;
        private string EditorText = string.Empty;
        internal string DocumentName { get; set; } = "Getting Started";
        SfDocumentEditorContainer container;
        DocumentEditorSettingsModel settings = new DocumentEditorSettingsModel() { ShowRuler = true };
        public async void OnCreated(object args)
        {
            SfDocumentEditor documentEditor = container.DocumentEditor;
            List<MenuItemModel> contentMenuItem = new List<MenuItemModel>
        {
           new MenuItemModel { Text="Rewrite", Id= "cr", IconCss="e-icons e-edit" },
            new MenuItemModel { Text="Translate", Id= "translate", IconCss="e-icons e-transform-right" },
           new MenuItemModel { Text="Grammar", Id= "grammer", IconCss="e-icons e-redaction" }
        };
            documentEditor.ContextMenu.AddCustomMenu(contentMenuItem, true, false);
            string sfdt = "{\"sfdt\":\"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\"}";
            await documentEditor.OpenAsync(sfdt);
            await container.ResizeAsync();
        }

        private async Task OnInsert(string value)
        {
            if (value == "Clear")
            {
                this.PopupType = string.Empty;
            }
            else if (value == "MoveToNextPara")
            {
                await container.DocumentEditor.Selection.MoveToParagraphEndAsync();
                await container.DocumentEditor.Selection.MoveToNextLineAsync();
                await container.DocumentEditor.Selection.SelectParagraphAsync();
                string text = await container.DocumentEditor.Selection.GetTextAsync();
                if (text != null)
                {
                    this.EditorText = text;
                }
            }
            else if (value == "MoveToPreviousPara")
            {
                await container.DocumentEditor.Selection.MoveToParagraphStartAsync();
                await container.DocumentEditor.Selection.MoveToPreviousLineAsync();
                await container.DocumentEditor.Selection.SelectParagraphAsync();
                string text = await container.DocumentEditor.Selection.GetTextAsync();
                if (text != null)
                {
                    this.EditorText = text;
                }
            }
            else
            {
                WordDocument document = WordDocument.LoadString(value, ImportFormatType.Html);
                string sfdtText = JsonSerializer.Serialize(document);
                await container.DocumentEditor.Editor.PasteAsync(sfdtText);
                await container.DocumentEditor.Editor.InsertTextAsync("\n");
                this.PopupType = string.Empty;
            }
        }

        public async Task OnContentMenuSelect(CustomContentMenuEventArgs args)
        {
            if (args.Id.EndsWith("cr"))
            {
                this.EditorText = await container.DocumentEditor.Selection.GetTextAsync();
                this.PopupType = "Rewrite";
            }
            else if (args.Id.EndsWith("translate"))
            {
                this.EditorText = await container.DocumentEditor.Selection.GetTextAsync();
                this.PopupType = "Translate";
            }
            else if (args.Id.EndsWith("grammer"))
            {
                this.EditorText = await container.DocumentEditor.Selection.GetTextAsync();
                this.PopupType = "Grammar";
                StateHasChanged();
            }
        }

        public async Task OnShowMenu(BeforeOpenCloseCustomContentMenuEventArgs args)
        {
            string text = await container.DocumentEditor.Selection.GetTextAsync();
            string[] idsToShow = Array.Empty<string>();
            string[] idsToHide = Array.Empty<string>();
            if (string.IsNullOrEmpty(text))
            {
                idsToHide = new[] { "cr", "translate", "grammer" };
            }
            else
            {
                idsToShow = new[] { "cr", "translate", "grammer" };
            }
            await JS.InvokeVoidAsync("showElements", (object)idsToShow);
            await JS.InvokeVoidAsync("hideElements", (object)idsToHide);
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
