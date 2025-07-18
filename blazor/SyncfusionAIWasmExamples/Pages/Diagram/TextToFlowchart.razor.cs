﻿using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;
using Syncfusion.Blazor.Diagram;
using Syncfusion.Blazor.Diagram.SymbolPalette;
using Syncfusion.Blazor.Inputs;
using Syncfusion.Blazor.Spinner;
using SyncfusionAIWasmExamples.Models;

namespace TextToFlowchartDiagram
{
    public partial class TextToFlowchart
    {
#pragma warning disable CS8618
        private int connectorCount = 0;
        DiagramSelectionSettings selectionSettings = new DiagramSelectionSettings();
        public DiagramSize SymbolPreview;
        public SymbolMargin SymbolMargin = new SymbolMargin { Left = 15, Right = 15, Top = 15, Bottom = 15 };
        public SfDiagramComponent Diagram;
        public SfSymbolPaletteComponent PaletteInstance;
        public bool IsDiagramLoading = false;
        public bool InitialRendering = true;
        public SfSpinner SpinnerRef;
        public FlowchartDiagramOpenAI DiagramOpenAIRef;
        public FlowchartDiagramToolbar ToolbarRef;
        int HorizontalSpacing = 30;
        int VerticalSpacing = 30;
        public bool IsPasteObject = false;
        public string ExtensionType = ".json";
        public bool IsGeneratingFromAI = false;
        public DiagramInteractions DiagramTool;
        DiagramObjectCollection<UserHandle> handles = new DiagramObjectCollection<UserHandle>();
        //Defines Diagram's nodes collection
        private DiagramObjectCollection<Node> nodes = new DiagramObjectCollection<Node>();
        //Defines Diagram's connectors collection
        private DiagramObjectCollection<Connector> connectors = new DiagramObjectCollection<Connector>();
        //Define palettes collection
        private DiagramObjectCollection<Palette> palettes = new DiagramObjectCollection<Palette>();
        // Defines palette's flow-shape collection
        private DiagramObjectCollection<NodeBase> flowShapeSymbols = new DiagramObjectCollection<NodeBase>();
        // Defines interval values for GridLines
        public double[] GridLineIntervals { get; set; } = new double[] { };
        // Defines palette's connector collection
        private DiagramObjectCollection<NodeBase> connectorSymbols = new DiagramObjectCollection<NodeBase>();
        //Reference to uploder
        SfUploader uploadFiles;
        bool CanUpdateStyle = false;

        [Inject]
        protected IJSRuntime jsRuntime { get; set; }
#pragma warning restore CS8618

        private void Created()
        {
            InitialRendering = false;
        }
        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            await base.OnAfterRenderAsync(firstRender);
            if (firstRender)
            {
                if (DiagramOpenAIRef != null)
                    DiagramOpenAIRef.Parent = this;
                if (ToolbarRef != null)
                    ToolbarRef.Parent = this;
            }
            PaletteInstance.Targets = new DiagramObjectCollection<SfDiagramComponent>
        {
            Diagram
        };
        }
        List<string> undoStack = new List<string>();
        List<string> redoStack = new List<string>();

        private void OnHistoryChange(HistoryChangedEventArgs arg)
        {
            if (arg.ActionTrigger == HistoryChangedAction.CustomAction)
            {
                if (redoStack.Count > 0)
                {
                    redoStack.Clear();
                }

                if (arg.EntryType != HistoryEntryType.PropertyChanged)
                {
                    string entryLog = arg.EntryType.ToString();
                    undoStack.Add(entryLog);
                }
            }
            else if (arg.ActionTrigger == HistoryChangedAction.Redo && redoStack.Count > 0)
            {
                undoStack.Add(redoStack[^1]);
                redoStack.RemoveAt(redoStack.Count - 1);
            }
            else if (arg.ActionTrigger == HistoryChangedAction.Undo && undoStack.Count > 0)
            {
                redoStack.Add(undoStack[^1]);
                undoStack.RemoveAt(undoStack.Count - 1);
            }
        }
        private void DragDropEvent(DropEventArgs args)
        {
            CanUpdateStyle = true;
            if (args.Element is Node node && node.Tooltip != null)
            {
                node.Tooltip = null;
                node.Constraints &= ~NodeConstraints.Tooltip;
            }
            else if (args.Element is Connector connector && connector.Tooltip != null)
            {
                connector.Tooltip = null;
                connector.Constraints &= ~ConnectorConstraints.Tooltip;
            }
        }
        private void ContextMenuItemClickHandler(DiagramMenuClickEventArgs args)
        {
            if (args.Item.Text == "Paste")
            {
                IsPasteObject = true;
            }
        }
        protected override void OnInitialized()
        {

            GridLineIntervals = new double[] {
            1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75
    };
            InitDiagramModel();
            InitPaletteModel();

        }
        // Create Nodes and Connectors for the diagram.
        private void InitDiagramModel()
        {
            CreateNode("node1", 40, 120, NodeFlowShapes.Terminator, "Start", "#8E44CC");
            CreateNode("node2", 50, 150, NodeFlowShapes.Process, "Open the browser and go to Amazon site", "#1759B7");
            CreateNode("node3", 80, 150, NodeFlowShapes.Decision, "Already a customer?", "#2F95D8");
            CreateNode("node4", 50, 150, NodeFlowShapes.Process, "Create an account", "#70AF16");
            CreateNode("node5", 50, 150, NodeFlowShapes.Process, "Enter login information", "#70AF16");
            CreateNode("node6", 50, 150, NodeFlowShapes.Process, "Search for the book in the search bar", "#1759B7");
            CreateNode("node7", 50, 150, NodeFlowShapes.Process, "Select the preferred book", "#1759B7");
            CreateNode("node8", 80, 150, NodeFlowShapes.Decision, "Is the book new\n or used?", "#2F95D8");
            CreateNode("node9", 50, 150, NodeFlowShapes.Process, "Select the new book", "#70AF16");
            CreateNode("node10", 50, 150, NodeFlowShapes.Process, "Select the used book", "#70AF16");
            CreateNode("node11", 50, 155, NodeFlowShapes.Process, "Add to Cart & Proceed to Checkout", "#1759B7");
            CreateNode("node12", 50, 155, NodeFlowShapes.Process, "Enter shipping and payment details", "#1759B7");
            CreateNode("node13", 100, 180, NodeFlowShapes.Decision, "Is the information correct?", "#2F95D8");
            CreateNode("node14", 50, 150, NodeFlowShapes.Process, "Review and place the order", "#1759B7");
            CreateNode("node15", 40, 120, NodeFlowShapes.Terminator, "End", "#8E44CC");
            CreateConnector("node1", "node2");
            CreateConnector("node2", "node3");
            CreateConnector("node3", "node4", "No");
            CreateConnector("node3", "node5", "Yes");
            CreateConnector("node4", "node6");
            CreateConnector("node5", "node6");
            CreateConnector("node6", "node7");
            CreateConnector("node7", "node8");
            CreateConnector("node8", "node9", "Yes");
            CreateConnector("node8", "node10", "No");
            CreateConnector("node9", "node11");
            CreateConnector("node10", "node11");
            CreateConnector("node11", "node12");
            CreateConnector("node13", "node12", "False");
            CreateConnector("node12", "node13");
            CreateConnector("node13", "node14", "True");
            CreateConnector("node14", "node15");
        }
        // Create Nodes and Connectors for the Palette.
        private void InitPaletteModel()
        {
            palettes = new DiagramObjectCollection<Palette>();
            SymbolPreview = new DiagramSize
            {
                Width = 100,
                Height = 100
            };
            flowShapeSymbols = new DiagramObjectCollection<NodeBase>();
            CreatePaletteNode(NodeFlowShapes.Terminator, "Terminator");
            CreatePaletteNode(NodeFlowShapes.Process, "Process");
            CreatePaletteNode(NodeFlowShapes.Decision, "Decision");
            CreatePaletteNode(NodeFlowShapes.Document, "Document");
            CreatePaletteNode(NodeFlowShapes.PreDefinedProcess, "Pre-Defined Process");
            CreatePaletteNode(NodeFlowShapes.PaperTap, "Punched Tape");
            CreatePaletteNode(NodeFlowShapes.DirectData, "Direct Data");
            CreatePaletteNode(NodeFlowShapes.SequentialData, "Sequential Data");
            CreatePaletteNode(NodeFlowShapes.Sort, "Sort");
            CreatePaletteNode(NodeFlowShapes.MultiDocument, "Multi-Document");
            CreatePaletteNode(NodeFlowShapes.Collate, "Collate");
            CreatePaletteNode(NodeFlowShapes.SummingJunction, "Summing Junction");
            CreatePaletteNode(NodeFlowShapes.Or, "OR");
            CreatePaletteNode(NodeFlowShapes.InternalStorage, "Internal Storage");
            CreatePaletteNode(NodeFlowShapes.Extract, "Extract");
            CreatePaletteNode(NodeFlowShapes.SequentialAccessStorage, "Sequential Access Storage");
            CreatePaletteNode(NodeFlowShapes.Annotation, "Annotation");
            CreatePaletteNode(NodeFlowShapes.Data, "Data");
            CreatePaletteNode(NodeFlowShapes.Card, "Card");
            CreatePaletteNode(NodeFlowShapes.Delay, "Delay");

            connectorSymbols = new DiagramObjectCollection<NodeBase>();
            CreatePaletteConnector("Orthogonal With Arrow", ConnectorSegmentType.Orthogonal, DecoratorShape.Arrow);
            CreatePaletteConnector("Orthogonal", ConnectorSegmentType.Orthogonal, DecoratorShape.None);
            CreatePaletteConnector("Straight With Arrow", ConnectorSegmentType.Straight, DecoratorShape.Arrow);
            CreatePaletteConnector("Straight", ConnectorSegmentType.Straight, DecoratorShape.None);
            CreatePaletteConnector("Bezier", ConnectorSegmentType.Bezier, DecoratorShape.None);

            palettes = new DiagramObjectCollection<Palette>()
        {
            new Palette() {Symbols = flowShapeSymbols, Title = "Flow Shapes", ID = "Flow Shapes", IconCss = "e-ddb-icons e-flow"},
            new Palette() {Symbols = connectorSymbols, Title = "Connectors", IsExpanded = true, IconCss = "e-ddb-icons e-connector"},
        };
        }
        private void OnNodeCreating(IDiagramObject obj)
        {
            Node node = (Node)obj;
            if (!InitialRendering && !IsPasteObject && !IsDiagramLoading)
            {
                if (IsGeneratingFromAI)
                {
                    node.Height = 60;
                    node.Width = 145;
                }
                else if (CanUpdateStyle)
                {
                    node.Style.Fill = "#357BD2"; CanUpdateStyle = false;
                }
                node.Style.StrokeColor = "White";
            }
            if (IsPasteObject) IsPasteObject = false;
        }
        private void OnConnectorCreating(IDiagramObject obj)
        {
            if (obj != null)
            {
                Connector connector = (Connector)obj;

                if (IsGeneratingFromAI)
                {
                    connector.Type = ConnectorSegmentType.Orthogonal;
                }
                else if (!IsDiagramLoading && !IsPasteObject)
                {
                    connector.Style.Fill = "black";
                    connector.Style.StrokeColor = "black";
                    connector.Style.Opacity = 1;
                    connector.TargetDecorator.Style.Fill = "black";
                    connector.TargetDecorator.Style.StrokeColor = "black";
                }
                if (IsPasteObject) IsPasteObject = false;
            }
        }
        // Method is used to create a node for the palette.
        private void CreatePaletteNode(NodeFlowShapes flowShape, string id)
        {
            string NodeID = id;
            bool isSpace = id.Contains(" ");
            if (isSpace)
            {
                NodeID = id.Replace(" ", "");
            }
            Node diagramNode = new Node()
            {
                ID = NodeID,
                Shape = new FlowShape() { Type = Syncfusion.Blazor.Diagram.NodeShapes.Flow, Shape = flowShape },
                Style = new ShapeStyle() { StrokeColor = "#757575", StrokeWidth = 1 },
            };
            if (isSpace)
            {
                diagramNode.Tooltip = new DiagramTooltip()
                {
                    Content = id,
                };
                diagramNode.Constraints = NodeConstraints.Default | NodeConstraints.Tooltip;
            }
            if (id == "Terminator" || id == "Process")
            {
                diagramNode.Width = 80;
                diagramNode.Height = 40;
            }
            else if (id == "Decision" || id == "Document" || id == "PreDefined Process" ||
              id == "Punched Tape" || id == "Direct Data" || id == "MultiDocument" || id == "Data")
            {
                diagramNode.Width = 50;
                diagramNode.Height = 40;
            }
            else
            {
                diagramNode.Width = 50;
                diagramNode.Height = 50;
            }
            double oldWidth = Convert.ToDouble(diagramNode.Width);
            double oldHeight = Convert.ToDouble(diagramNode.Height);
            double ratio = 100 / oldWidth;
            diagramNode.Width = 100;
            diagramNode.Height *= ratio;
            flowShapeSymbols.Add(diagramNode);
        }
        // Method is used to create a Connector for the diagram.
        private void CreateConnector(string sourceId, string targetId, string label = "", bool isDashLine = false, string sport = "", string tport = "")
        {
            Connector diagramConnector = new Connector()
            {
                ID = string.Format("connector{0}", ++connectorCount),
                SourceID = sourceId,
                TargetID = targetId,
            };
            if (isDashLine)
            {
                diagramConnector.Style = new ShapeStyle() { StrokeDashArray = "2,2" };
            }
            if (label != default(string))
            {
                var annotation = new PathAnnotation()
                {
                    Content = label,
                    Style = new TextStyle() { Fill = "white" }
                };
                if ((sourceId == "node5" && targetId == "node6") || label == "Yes" || label == "No")
                {
                    annotation.Height = 10;
                    annotation.Width = 15;
                }
                diagramConnector.Annotations = new DiagramObjectCollection<PathAnnotation>() { annotation };
            }
            diagramConnector.Type = ConnectorSegmentType.Orthogonal;

            connectors.Add(diagramConnector);
        }
        // Method is used to create a node for the diagram.
        private void CreateNode(string id, double height, double width, NodeFlowShapes shape, string label, string fillColor)
        {
            Node diagramNode = new Node()
            {
                ID = id,
                Width = width,
                Height = height,
                Style = new ShapeStyle { Fill = fillColor, StrokeColor = "White" },

                Shape = new FlowShape() { Type = Syncfusion.Blazor.Diagram.NodeShapes.Flow, Shape = shape },
                Annotations = new DiagramObjectCollection<ShapeAnnotation>
        {
            new ShapeAnnotation
            {
                Content = label, Width = width - 20,
                Style = new TextStyle()
                {
                    Color="White", Fill = "transparent"
                }
            }
        }
            };
            nodes.Add(diagramNode);
        }
        // Method is used to create a Connector for the palette.
        private void CreatePaletteConnector(string id, ConnectorSegmentType type, DecoratorShape decoratorShape)
        {
            string connectorID = id;
            bool isSpace = id.Contains(" ");
            if (isSpace)
            {
                connectorID = id.Replace(" ", "");
            }
            Connector diagramConnector = new Connector()
            {
                ID = connectorID,
                Type = type,
                SourcePoint = new DiagramPoint() { X = 0, Y = 0 },
                TargetPoint = new DiagramPoint() { X = 60, Y = 60 },
                Style = new ShapeStyle() { StrokeWidth = 1, StrokeColor = "#757575" },
                TargetDecorator = new DecoratorSettings()
                {
                    Shape = decoratorShape,
                    Style = new ShapeStyle() { StrokeWidth = 1, StrokeColor = "#757575", Fill = "#757575" }
                }
            };
            if (isSpace)
            {
                diagramConnector.Tooltip = new DiagramTooltip()
                {
                    Content = id,
                };
                diagramConnector.Constraints = ConnectorConstraints.Default | ConnectorConstraints.Tooltip;
            }
            connectorSymbols.Add(diagramConnector);
        }

        public async Task ShowHideSymbolPalette()
        {
            await jsRuntime.InvokeAsync<object>("openPalette");

        }
        public async Task OnUploadFileSelected(UploadingEventArgs args)
        {
            if (args.FileData.Type == "json")
            {
                IsDiagramLoading = true;
                string json = await FileUtil.LoadFile(jsRuntime, args.FileData);
                json = json.Replace(System.Environment.NewLine, string.Empty);
                await Diagram.LoadDiagramAsync(json.ToString());
                await uploadFiles.ClearAllAsync();
                IsDiagramLoading = false;
            }
        }
        private void ScrollChanged(ScrollChangedEventArgs args)
        {
            if (ToolbarRef != null)
            {
                ToolbarRef.ZoomItemDropdownContent = FormattableString.Invariant($"{Math.Round(Diagram.ScrollSettings.CurrentZoom * 100)}") + "%";
                ToolbarRef.RefreshToolbar();
            }
        }
        public void StateChanged()
        {
            StateHasChanged();
        }
    public void Dispose()
        {
            if (nodes != null)
            {
                nodes.Clear();
            }
            if (connectors != null)
            {
                connectors.Clear();
            }
#pragma warning disable BL0005
            if (palettes != null)
            {
                for (int i = 0; i < palettes.Count; i++)
                {
                    palettes[i].ID = null;
                    palettes[i].Title = null;
                    palettes[i].IconCss = null;
                    if (palettes[i].Symbols != null)
                    {
                        for (int j = 0; j < palettes[i].Symbols.Count; j++)
                        {
                            palettes[i].Symbols[j] = null;
                        }
                        palettes[i].Symbols.Clear();
                        palettes[i].Symbols = null;
                    }
                }
                palettes.Clear();
            }
#pragma warning restore BL0005
            if (flowShapeSymbols != null)
            {
                flowShapeSymbols.Clear();
            }
            if (GridLineIntervals != null)
            {
                Array.Clear(GridLineIntervals, 0, GridLineIntervals.Length);
            }
            if (connectorSymbols != null)
            {
                connectorSymbols.Clear();
            }
        }
    }
}
