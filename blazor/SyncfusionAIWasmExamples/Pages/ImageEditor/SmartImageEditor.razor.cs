using Microsoft.JSInterop;
using Syncfusion.Blazor.ImageEditor;
using Syncfusion.Blazor.Inputs;
using Syncfusion.Blazor.Navigations;

namespace SyncfusionAIWasmExamples.Pages.ImageEditor
{
    public partial class SmartImageEditor
    {
        // Stability AI APIKEY
        public string ApiKey = "your-api-key";

        public string SearchPromptValue = "Background of the image";
        public string MagicEraserOpt = "magic-eraser e-hide";
        public string BgChangerOpt = "bg-changer e-hide";
        public string CirclePaletteValue = "#ffffff";
        public string BgTextValue = "";
        public string Target = ".maincontent";
        public SidebarPosition Position { get; set; } = SidebarPosition.Left;
        public bool SidebarToggle;
        public bool VisibleProperty { get; set; } = false;
        public string WrapperClass = "e-style-none";
        SfImageEditor ImageEditor;
        SfTreeView<TreeData> TreeViewObj;
        public Dictionary<string, object> maskAttribute;

        public void OnMenuClick()
        {
            SidebarToggle = !SidebarToggle;
        }

        public async void Changed()
        {
            await ImageEditor.RefreshAsync();
        }

        public async void OnSelect(NodeClickEventArgs args)
        {
            if (args.NodeData.Text == "Magic Eraser")
            {
                BgChangerOpt = "bg-changer e-hide";
                MagicEraserOpt = "magic-eraser e-show";
                maskAttribute = (new Dictionary<string, object> { { "data-value", "mask-drawing" } });
                await ImageEditor.EnableFreehandDrawAsync();
                TreeViewObj.SelectedNodes = new string[] { };
                await TreeViewObj.ClearStateAsync();

            }
            else if (args.NodeData.Text == "Change Background")
            {
                MagicEraserOpt = "magic-eraser e-hide";
                BgChangerOpt = "bg-changer e-show";
                TreeViewObj.SelectedNodes = new string[] { };
                await TreeViewObj.ClearStateAsync();
                VisibleProperty = true;
                WrapperClass = "e-style-opacity";
                string base64 = await ImageEditor.GetImageDataUrlAsync(false);
                RemoveBg(base64);
            }
            else if (args.NodeData.Text == "Remove Background")
            {
                VisibleProperty = true;
                WrapperClass = "e-style-opacity";
                string base64 = await ImageEditor.GetImageDataUrlAsync(false);
                RemoveBg(base64);
            }
            StateHasChanged();
        }

        private List<TreeData> LocalData = new List<TreeData>();
        protected override void OnInitialized()
        {
            base.OnInitialized();
            LocalData.Add(new TreeData
            {
                Id = "1",
                Name = "Magic Eraser",
                ImageUrl = "images/object-remover.gif"
            });
            LocalData.Add(new TreeData
            {
                Id = "2",
                Name = "Change Background",
                ImageUrl = "images/change-bg.png"
            });
            LocalData.Add(new TreeData
            {
                Id = "3",
                Name = "Remove Background",
                ImageUrl = "images/remove-bg.png"
            });

        }

        class TreeData
        {
            public string Id { get; set; }
            public string Pid { get; set; }
            public string Name { get; set; }
            public bool HasChild { get; set; }
            public bool Expanded { get; set; }
            public bool Selected { get; set; }
            public string ImageUrl { get; set; }
        }

        private async void CirclePaletteChange(ColorPickerEventArgs args)
        {
            CirclePaletteValue = args.CurrentValue.Hex;
            await ImageEditor.OpenAsync("", false, CirclePaletteValue);
        }

        public Dictionary<string, string[]> CirclePaletteColors = new Dictionary<string, string[]>() {
        { "Custom", new string[] {"#f44336", "#e91e63", "#9c27b0", "#673ab7", "#2196f3", "#03a9f4", "#00bcd4",
                "#009688", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107" } }
    };

        public async void Created()
        {
            await ImageEditor.OpenAsync("images/man-standing-nature.png");
        }

        public async void FileOpened()
        {
            await ImageEditor.RefreshAsync();
        }

        public async void RemoveBtnClick()
        {
            maskAttribute = (new Dictionary<string, object> { { "data-value", "" } });
            MagicEraserOpt = "magic-eraser e-hide";
            WrapperClass = "e-style-none";
            VisibleProperty = false;
            await TreeViewObj.ClearStateAsync();
            await ImageEditor.DiscardAsync();
            StateHasChanged();
        }

        public async void BgRemoveBtnClick()
        {
            BgChangerOpt = "bg-changer e-hide";
            CirclePaletteValue = "#ffffff";
            BgTextValue = "";
            WrapperClass = "e-style-none";
            VisibleProperty = false;
            await TreeViewObj.ClearStateAsync();
            StateHasChanged();
        }

        public async void EraseBtnClick()
        {
            VisibleProperty = true;
            WrapperClass = "e-style-opacity";
            string maskUrl = await ImageEditor.GetImageDataUrlAsync(false);
            maskAttribute = (new Dictionary<string, object> { { "data-value", "" } });
            string base64 = await ImageEditor.GetImageDataUrlAsync(false);
            var base64Image = await JS.InvokeAsync<string>(
                "getStabilityAiModel",
                base64,
                null,
                null,
                maskUrl,
                ApiKey
            );

            await ImageEditor.OpenAsync(base64Image, false);
            WrapperClass = "e-style-none";
            VisibleProperty = false;
            MagicEraserOpt = "magic-eraser e-hide";
            await TreeViewObj.ClearStateAsync();
            StateHasChanged();
        }

        public async void ApplyBtnClick()
        {
            VisibleProperty = true;
            WrapperClass = "e-style-opacity";
            if (BgTextValue != "")
            {
                string base64 = await ImageEditor.GetImageDataUrlAsync(false);
                var base64Image = await JS.InvokeAsync<string>(
                       "getStabilityAiModel",
                       base64,
                       BgTextValue,
                       SearchPromptValue,
                       null,
                       ApiKey
                   );

                await ImageEditor.OpenAsync(base64Image, false);
                BgRemoveBtnClick();
            }
            else
            {
                BgRemoveBtnClick();
            }
        }

        private async void RemoveBg(string base64)
        {
            var base64Image = await JS.InvokeAsync<string>(
                    "getStabilityAiModel",
                    base64,
                    null,
                    null,
                    null,
                    ApiKey
                );
            await ImageEditor.OpenAsync(base64Image, false);
            WrapperClass = "e-style-none";
            VisibleProperty = false;

        }
    }
}
