using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Syncfusion.Blazor.DocumentEditor;
using System.Text.Json;

namespace SyncfusionAIWasmExamples.Pages.DocumentEditor
{
    public partial class WritingAssist
    {
        [Inject]
        private IJSRuntime JS { get; set; }
        public string PopupType = string.Empty;
        private string EditorText = string.Empty;
        internal string DocumentName { get; set; } = "Getting Started";
        SfDocumentEditorContainer container;
        DocumentEditorSettingsModel settings = new DocumentEditorSettingsModel() { ShowRuler = true };

        List<Object> Items = new List<Object> { "New", "Open", "Separator", new CustomToolbarItemModel() { Id = "content", PrefixIcon = "e-icons e-file-new", Text = "AI Write" }, "Separator", "Undo", "Redo", "Separator", "Image", "Table", "Hyperlink", "Bookmark", "TableOfContents", "Separator", "Header", "Footer", "PageSetup", "PageNumber", "Break", "InsertFootnote", "InsertEndnote", "Separator", "Find", "Separator", "Comments", "TrackChanges", "Separator", "LocalClipboard", "RestrictEditing", "Separator", "FormFields", "UpdateFields" };
        public async void OnCreated(object args)
        {
            SfDocumentEditor documentEditor = container.DocumentEditor;
            List<Syncfusion.Blazor.DocumentEditor.MenuItemModel> contentMenuItem = new List<Syncfusion.Blazor.DocumentEditor.MenuItemModel>
        {
           new Syncfusion.Blazor.DocumentEditor.MenuItemModel { Text="AI Write", Id= "gc", IconCss="e-icons e-file-new" },
        };
            documentEditor.ContextMenu.AddCustomMenu(contentMenuItem, true, false);
            await container.ResizeAsync();
        }

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (firstRender)
            {
                this.PopupType = "Generate";
            }
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
            if (args.Id.EndsWith("gc"))
            {
                this.EditorText = string.Empty;
                this.PopupType = "Generate";
            }
        }

        public async void OnToolbarClick(Syncfusion.Blazor.DocumentEditor.ClickEventArgs args)
        {
            switch (args.Item.Id)
            {
                case "content":
                    this.EditorText = string.Empty;
                    this.PopupType = "Generate";
                    StateHasChanged();
                    break;
            }
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
