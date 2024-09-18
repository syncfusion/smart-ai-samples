using Microsoft.AspNetCore.Components.Web;
using Microsoft.JSInterop;
using Syncfusion.Blazor.Inputs;
using Syncfusion.Blazor.Navigations;
using Syncfusion.Blazor.Notifications;
using Syncfusion.Blazor.SfPdfViewer;
using Syncfusion.Drawing;
using Syncfusion.Pdf;
using Syncfusion.Pdf.Interactive;
using Syncfusion.Pdf.Parsing;
using Syncfusion.Pdf.Redaction;
using SyncfusionAISamples.Models;
using PdfAnnotation = Syncfusion.Blazor.SfPdfViewer.PdfAnnotation;

namespace SyncfusionAISamples.Components.Pages.PDFViewer
{
    public partial class SmartRedact
    {
        #region Properties
        private SfPdfViewer2? sfPdfViewer2;
        private SfToolbar? sfToolbar;
        private SfUploader? uploadFiles;
        private PDFViewerModel? smartRedaction;
        private SfTreeView<TreeItem>? sensitivePatternTreeView;
        private SfTreeView<TreeItem>? sensitiveInfoTreeView;
        private SfToast? toastMessage;
        private PdfViewerRectangleSettings rectangleSettings = new PdfViewerRectangleSettings();
        private int redactionCount = 0;
        private string documentPath = "wwwroot/Data/Confidential_Medical_Record.pdf";
        private MemoryStream documentStream = new MemoryStream();
        private bool IsZoomInHidden = false;
        private bool IsZoomOutHidden = false;
        private bool isPopupVisible = false;
        private bool isDocumentLoaded = false;
        private bool isSpinnerVisible = false;
        private bool isDataFetched = false;
        private bool isDataRendered = false;
        private bool canRefreshContainer = false;
        private bool isMobileDevice = false;
        private bool isScanDisabled = false;
        private bool isRedactButtonDisabled => (isSpinnerVisible || redactionCount <= 0) ? true : false;
        private static int annotationCount = 0;
        private string displayBlurContainer => isSpinnerVisible ? "block" : "none";
        private List<TreeItem> patterns = new List<TreeItem>();
        private List<TreeItem> sensitiveInfo = new List<TreeItem>();
        private List<TreeItem> childNodes = new List<TreeItem>();
        private Dictionary<int, List<TextBounds>> textboundsDetails = new Dictionary<int, List<TextBounds>>();
        private int textBoundsCount = 0;
        List<ContextMenuItem> contextMenuItems = new List<ContextMenuItem>() { ContextMenuItem.Delete };
        private string toastPosition = "Right";
        private ToastModel toastInformation = new ToastModel { Title = "Information!", Content = "No Results found!", CssClass = "e-toast-info", Icon = "e-info toast-icons" };
        private ToastModel toastAlert = new ToastModel { Title = "Alert!", Content = "Select at least one pattern!", CssClass = "e-toast-info", Icon = "e-info toast-icons" };
        private string[] checkedPatternTreeView = new string[] { };
        private string[] checkedInfoTreeView = new string[] { };
        private List<string> annotations = new List<string>();
        #endregion

        #region Methods

        #region Life Cycle Methods
        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            if (firstRender)
            {
                isMobileDevice = await JsRuntime.InvokeAsync<bool>("isMobileDevice", false);
            }
            await base.OnAfterRenderAsync(firstRender);

            if (canRefreshContainer && sfPdfViewer2 != null && sfToolbar != null)
            {
                await sfPdfViewer2.UpdateViewerContainerAsync();
                await sfToolbar.RefreshOverflowAsync();
                canRefreshContainer = false;
            }
            if (sensitivePatternTreeView != null)
            {
                if (checkedPatternTreeView == null)
                {
                    isScanDisabled = true;
                }
                else
                {
                    isScanDisabled = false;
                }
            }
        }

        protected override void OnInitialized()
        {
            base.OnInitialized();

            patterns.Add(
                new TreeItem
                {
                    NodeId = "",
                    NodeText = "Select All",
                    Expanded = true,
                    Child = new List<TreeItem>(){
                    new TreeItem { NodeId = "personNames", NodeText = "Person Names", IsChecked = true },
                    new TreeItem { NodeId = "organizationNames", NodeText = "Organization Names", IsChecked = true },
                    new TreeItem { NodeId = "emailAddresses", NodeText = "Email addresses", IsChecked = true },
                    new TreeItem { NodeId = "phoneNumbers", NodeText = "Phone Numbers", IsChecked = true },
                    new TreeItem { NodeId = "addresses", NodeText = "Addresses", IsChecked = true },
                    new TreeItem { NodeId = "dates", NodeText = "Dates", IsChecked = true },
                    new TreeItem { NodeId = "accountNumbers", NodeText = "Account Numbers", IsChecked = true },
                    new TreeItem { NodeId = "creditCardNumbers", NodeText = "Credit Card Numbers", IsChecked = true },
                                }
                }
            );

        }
        #endregion

        #region Parent Element Click Event
        private async void ParentElementOnClick(MouseEventArgs args)
        {
            try
            {
                if (isMobileDevice)
                {
                    var result = await JsRuntime.InvokeAsync<bool>("checkClickedDiv");
                    if (result)
                    {
                        isPopupVisible = false;
                        StateHasChanged();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
            }
        }
        #endregion

        #region File Upload Methods
        private async Task FileUploadSelected(UploadingEventArgs args)
        {
            if (args.FileData.Type == "pdf" && sfPdfViewer2 != null && uploadFiles != null)
            {
                string base64string = args.FileData.RawFile?.ToString();
                //Loads the PDF docuent from the given base64 string in the SfPdfViewer.
                await sfPdfViewer2.LoadAsync(base64string, null);
                await uploadFiles.ClearAllAsync();
            }
        }

        private async Task CreatedHandler()
        {
            await JsRuntime.InvokeVoidAsync("created");
        }
        #endregion

        #region Toolbar Methods
        #region Zoom Methods
        private async void ZoomIn()
        {
            if (sfPdfViewer2 != null)
            {
                //Zoom in  the PDF document being loaded in the PDFViewer2.
                await sfPdfViewer2.ZoomInAsync();
            }
        }

        private async void ZoomOut()
        {
            if (sfPdfViewer2 != null)
            {
                //Zoom out the PDF document being loaded in the PDFViewer2.
                await sfPdfViewer2.ZoomOutAsync();
            }
        }
        #endregion

        private async Task DrawRectAngle()
        {
            if (sfPdfViewer2 != null)
            {
                //Set the rectangle settings for author name for identifying the redaction rectangle
                rectangleSettings = new PdfViewerRectangleSettings()
                {
                    Author = "RedactedRect"
                };
                //Set the annotation mode for the redaction rectangle
                await sfPdfViewer2.SetAnnotationModeAsync(AnnotationType.Rectangle);
            }
        }

        private async void Download()
        {
            if (sfPdfViewer2 != null)
            {
                //Downloads the PDF document being loaded in the PDFViewer2.
                await sfPdfViewer2.DownloadAsync();
            }
        }

        private void ShowHidePopup()
        {
            isPopupVisible = !isPopupVisible;
            canRefreshContainer = true;
        }
        #endregion

        #region TreeView Methods

        #region Pattern TreeView Method
        private async Task OnPatternTreeViewNodeSelected(NodeSelectEventArgs args)
        {
            if (args.NodeData != null && sensitivePatternTreeView != null)
            {
                List<TreeItem> treeItems = sensitivePatternTreeView.GetTreeData(args.NodeData.Id);
                foreach (TreeItem item in treeItems)
                {
                    if (item.NodeId == args.NodeData.Id)
                    {
                        if (bool.Parse(args.NodeData.IsChecked))
                        {
                            await sensitivePatternTreeView.UncheckAllAsync(new string[] { item.NodeId });
                        }
                        else
                        {
                            await sensitivePatternTreeView.CheckAllAsync(new string[] { item.NodeId });
                        }
                    }
                }
            }
        }
        #endregion

        #region Information TreeView Methods
        private async Task OnInformationTreeViewNodeSelected(NodeSelectEventArgs args)
        {
            if (sfPdfViewer2 != null)
            {
                //Navigate to the page when the node is selected
                if (args.NodeData.ParentID == "Select All")
                {
                    int pageNumber = int.Parse(args.NodeData.Id) + 1;
                    await sfPdfViewer2.GoToPageAsync(pageNumber);
                }
                else if (!string.IsNullOrEmpty(args.NodeData.ParentID))
                {
                    int pageNumber = int.Parse(args.NodeData.ParentID) + 1;
                    await sfPdfViewer2.GoToPageAsync(pageNumber);
                }
            }
        }

        private async Task OnInformationTreeViewNodeChecked(NodeCheckEventArgs args)
        {
            if (sfPdfViewer2 != null)
            {
                //Set to initial state
                rectangleSettings = new PdfViewerRectangleSettings();
                //Add or remove annotation for all nodes
                if (args.NodeData.Id == "Select All")
                {
                    this.isSpinnerVisible = true;
                    redactionCount = checkedInfoTreeView != null ? checkedInfoTreeView.Count() : annotations != null ? annotations.Count : 0;
                    if (args.Action == "check")
                    {
                        //Programatically add the Annotations with the bounds
                        await AddRectangleAnnotationsAsync();
                    }
                    else if (args.Action == "uncheck")
                    {
                        //Programatically remove the Annotations with the ids
                        await RemoveAllRectangleAnnotationsAsync();
                    }

                    this.isSpinnerVisible = false;
                    StateHasChanged();
                }
                //Add or remove annotation for specific page
                else if (args.NodeData.Text.Contains("Page"))
                {
                    this.isSpinnerVisible = true;
                    List<string> pdfAnnotationsIds = new List<string>();
                    redactionCount = checkedInfoTreeView != null ? checkedInfoTreeView.Count() : annotations != null ? annotations.Count : 0;
                    //Get the details of the all child nodes
                    foreach (TreeItem item in childNodes)
                    {
                        if (int.Parse(args.NodeData.Id) == item.pageNumber)
                        {
                            //Go to the page
                            await sfPdfViewer2.GoToPageAsync(item.pageNumber + 1);
                            pdfAnnotationsIds.Add(item.NodeId);
                            if (args.Action == "check")
                            {
                                redactionCount++;
                            }
                            else if (args.Action == "uncheck")
                            {
                                redactionCount--;
                            }
                        }
                    }
                    redactionCount = redactionCount >= 0 ? redactionCount : annotations != null ? annotations.Count : 0;
                    if (args.Action == "check")
                    {
                        //Programatically add the Annotations with the bounds
                        await AddRectanglesBasedOnIdAsync(pdfAnnotationsIds);
                    }
                    else if (args.Action == "uncheck")
                    {
                        //Programatically remove the Annotations with the ids
                        await sfPdfViewer2.DeleteAnnotationsAsync(pdfAnnotationsIds);
                    }

                    this.isSpinnerVisible = false;
                    StateHasChanged();
                }
                //Add or remove annotation for single node
                else
                {
                    if (sensitiveInfoTreeView != null)
                    {
                        //Get the details of the nodes
                        List<TreeItem> treeItems = sensitiveInfoTreeView.GetTreeData(args.NodeData.Id);

                        redactionCount = checkedInfoTreeView != null ? checkedInfoTreeView.Count() : annotations != null ? annotations.Count : 0;
                        foreach (TreeItem item in treeItems)
                        {
                            //Go to the page
                            await sfPdfViewer2.GoToPageAsync(item.pageNumber + 1);
                            if (args.Action == "check")
                            {
                                //Programatically add the Annotation with the bounds
                                await AddRectangleAnnotationAsync(item);
                                ++redactionCount;
                            }
                            else if (args.Action == "uncheck")
                            {
                                //Programatically remove the Annotation with the Annotation ID
                                await sfPdfViewer2.DeleteAnnotationAsync(item.NodeId);
                                --redactionCount;
                            }
                        }
                        redactionCount = redactionCount >= 0 ? redactionCount : annotations != null ? annotations.Count : 0;
                        StateHasChanged();
                    }
                }
            }
        }
        #endregion
        #endregion

        #region Annotation Methods
        private async Task RemoveAllRectangleAnnotationsAsync()
        {
            List<string> pdfAnnotationIds = new List<string>();
            foreach (TreeItem item in childNodes)
            {
                pdfAnnotationIds.Add(item.NodeId);
                redactionCount--;
            }
            redactionCount = annotations != null ? annotations.Count : 0;
            if (sfPdfViewer2 != null)
            {
                //Remove the redaction rectangle annotations
                await sfPdfViewer2.DeleteAnnotationsAsync(pdfAnnotationIds);
            }
        }

        private async Task AddRectangleAnnotationsAsync()
        {
            if (childNodes != null && childNodes.Count > 0)
            {
                List<PdfAnnotation> pdfAnnotations = new List<PdfAnnotation>();
                foreach (TreeItem item in childNodes)
                {
                    PdfAnnotation pdfAnnotation = new PdfAnnotation();
                    pdfAnnotation.PageNumber = item.pageNumber;
                    pdfAnnotation.Type = AnnotationType.Rectangle;
                    pdfAnnotation.Bound = new Bound()
                    {
                        X = item.Bounds.X,
                        Y = item.Bounds.Y,
                        Width = item.Bounds.Width,
                        Height = item.Bounds.Height
                    };
                    pdfAnnotation.Id = item.NodeId;
                    pdfAnnotations.Add(pdfAnnotation);
                    redactionCount++;
                }
                if (sfPdfViewer2 != null)
                {
                    //Add the redaction rectangle annotations
                    await sfPdfViewer2.AddAnnotationsAsync(pdfAnnotations);
                }
            }
        }

        private async Task AddRectanglesBasedOnIdAsync(List<string> pdfAnnotationIds)
        {
            if (childNodes != null && childNodes.Count > 0)
            {
                List<PdfAnnotation> pdfAnnotations = new List<PdfAnnotation>();
                foreach (string id in pdfAnnotationIds)
                {
                    foreach (TreeItem item in childNodes)
                    {
                        if (item.NodeId == id)
                        {
                            PdfAnnotation pdfAnnotation = new PdfAnnotation();
                            pdfAnnotation.PageNumber = item.pageNumber;
                            pdfAnnotation.Type = AnnotationType.Rectangle;
                            pdfAnnotation.Bound = new Bound()
                            {
                                X = item.Bounds.X,
                                Y = item.Bounds.Y,
                                Width = item.Bounds.Width,
                                Height = item.Bounds.Height
                            };
                            pdfAnnotation.Id = item.NodeId;
                            pdfAnnotations.Add(pdfAnnotation);
                        }
                    }
                }
                if (sfPdfViewer2 != null)
                {
                    //Add the redaction rectangle annotations
                    await sfPdfViewer2.AddAnnotationsAsync(pdfAnnotations);
                }
            }
        }

        private async Task AddRectangleAnnotationAsync(TreeItem treeItem)
        {
            if (sfPdfViewer2 != null)
            {
                //Add the rectangle annotation
                await sfPdfViewer2.AddAnnotationAsync(new Syncfusion.Blazor.SfPdfViewer.PdfAnnotation()
                {
                    PageNumber = treeItem.pageNumber,
                    Type = AnnotationType.Rectangle,
                    Bound = new Bound()
                    {
                        X = treeItem.Bounds.X,
                        Y = treeItem.Bounds.Y,
                        Width = treeItem.Bounds.Width,
                        Height = treeItem.Bounds.Height
                    },
                    Id = treeItem.NodeId

                });
            }

        }
        #endregion

        #region Scan and Redact Methods
        private async Task ScanClick()
        {
            if (checkedPatternTreeView != null)
            {
                this.isSpinnerVisible = true;
                List<string> selectedItems = checkedPatternTreeView.ToList();
                //Extract the text from the PDF
                List<string> extractedTextList = await LoadDocument();
                string extractedText = String.Join(" ", extractedTextList);

                //Find the text bounds with the selected patterns
                textboundsDetails = await FindText(extractedText, selectedItems);

                //Count the number of bounds fetched
                this.textBoundsCount = textboundsDetails.Sum(pair => pair.Value.Count);
                if (this.textBoundsCount > 0)
                {
                    this.isDataFetched = true;
                }
                else if (toastMessage != null)
                {
                    //Show no results found message
                    await this.toastMessage.ShowAsync(toastInformation);
                }
                if (isDataFetched && !isDataRendered)
                {
                    foreach (var detail in textboundsDetails)
                    {
                        foreach (var textBounds in detail.Value)
                        {
                            childNodes.Add(new TreeItem
                            {
                                NodeId = "RedactedRect" + annotationCount++,
                                NodeText = textBounds.SensitiveInformation,
                                pageNumber = detail.Key,
                                Bounds = textBounds.Bounds,
                                IsChecked = true
                            });
                        }
                    }
                    // Group childNodes by pageNumber
                    var groupedByPage = childNodes.GroupBy(node => node.pageNumber)
                                                  .Select(group => new TreeItem
                                                  {
                                                      NodeId = group.Key.ToString(),
                                                      NodeText = "Page " + (group.Key + 1),
                                                      pageNumber = group.Key,
                                                      Expanded = true,
                                                      Child = group.ToList(),
                                                      IsChecked = true
                                                  })
                                                  .ToList();
                    sensitiveInfo.Add(new TreeItem
                    {
                        NodeId = "Select All",
                        NodeText = $"Select All ({this.textBoundsCount})",
                        Expanded = true,
                        Child = groupedByPage
                    });
                    isDataRendered = true;
                }
                await this.AddRectangleAnnotationsAsync();
                this.isSpinnerVisible = false;
            }
            else if (toastMessage != null)
            {
                //Show alert message
                await this.toastMessage.ShowAsync(toastAlert);
            }
        }

        private async Task ApplyRedaction()
        {
            if (sfPdfViewer2 != null)
            {
                if (isPopupVisible)
                {
                    this.isSpinnerVisible = true;
                }
                int currentPageNumber = sfPdfViewer2.CurrentPageNumber;
                byte[] bytes = await sfPdfViewer2.GetDocumentAsync();
                PdfLoadedDocument loadedDocument = new PdfLoadedDocument(bytes);
                foreach (PdfLoadedPage page in loadedDocument.Pages)
                {
                    List<PdfLoadedAnnotation> removeAnnotations = new List<PdfLoadedAnnotation>();
                    foreach (PdfLoadedAnnotation annotation in page.Annotations)
                    {
                        if (annotation is PdfLoadedRectangleAnnotation)
                        {
                            //Check the annot for Redaction
                            if (annotation.Name.Contains("RedactedRect") || annotation.Author.Contains("RedactedRect"))
                            {
                                removeAnnotations.Add(annotation);
                                PdfRedaction redaction = new PdfRedaction(annotation.Bounds, Color.Black);
                                page.AddRedaction(redaction);
                                annotation.Flatten = true;
                            }

                        }
                    }
                    //Remove from the Annotation list
                    foreach (PdfLoadedAnnotation annotation in removeAnnotations)
                    {
                        page.Annotations.Remove(annotation);
                    }
                }
                loadedDocument.Redact();
                //Reload the document to view the redaction
                using (MemoryStream stream = new MemoryStream())
                {
                    loadedDocument.Save(stream);
                    stream.Position = 0;
                    loadedDocument.Close(true);
                    Byte[] byteArray = stream.ToArray();
                    var base64String = "data:application/pdf;base64," + Convert.ToBase64String(byteArray);
                    this.isSpinnerVisible = false;
                    await sfPdfViewer2.LoadAsync(base64String);
                }
                //Move to current page
                await sfPdfViewer2.GoToPageAsync(currentPageNumber);
                isDocumentLoaded = true;
            }
        }

        private async Task<List<string>> LoadDocument()
        {
            List<string> extractedTextList = new List<string>();
            if (sfPdfViewer2 != null && smartRedaction != null)
            {
                //Load the document to the AI and get the extracted text
                byte[] bytes = await sfPdfViewer2.GetDocumentAsync();
                documentStream = new MemoryStream(bytes);
                extractedTextList = await smartRedaction.LoadDocument(documentStream, "application/pdf");
            }
            return extractedTextList;
        }

        private async Task<Dictionary<int, List<TextBounds>>> FindText(string extractedText, List<string> selectedItems)
        {
            Dictionary<int, List<TextBounds>> boundsData = new Dictionary<int, List<TextBounds>>();
            if (smartRedaction != null && sfPdfViewer2 != null)
            {
                //Get SensitiveData from the PDF using OpenAI
                List<string> sensitiveData = await smartRedaction.GetSensitiveDataFromPDF(extractedText, selectedItems);
                byte[] bytes = await sfPdfViewer2.GetDocumentAsync();
                documentStream = new MemoryStream(bytes);
                //Remove the Prefixs
                List<string> sensitiveInformations = RemovePrefix(sensitiveData, selectedItems);
                boundsData = smartRedaction.FindTextBounds(documentStream, sensitiveInformations);
            }
            return boundsData;

        }

        private List<string> RemovePrefix(List<string> sensitiveInfo, List<string> selectedItems)
        {
            for (int i = 0; i < sensitiveInfo.Count; i++)
            {
                foreach (var item in selectedItems)
                {
                    // Remove the selected items title prefix from the extracted sensitive information
                    string prefix = item + ": ";
                    if (sensitiveInfo[i].ToLower().Contains(prefix, StringComparison.Ordinal))
                    {
                        sensitiveInfo[i] = sensitiveInfo[i].Substring((sensitiveInfo[i].IndexOf(':') + 1));
                    }
                }
            }
            return sensitiveInfo;
        }

        private async Task CancelClick()
        {
            this.isSpinnerVisible = true;
            //set to initial state
            isDataFetched = false;
            isDataRendered = false;
            sensitiveInfo.Clear();
            checkedPatternTreeView = new string[] { };
            if (sfPdfViewer2 != null && checkedInfoTreeView != null && checkedInfoTreeView.Length > 0)
            {
                List<string> deleteAnnotationsId = new List<string>();
                for (int redactionIndex = 0; redactionIndex < checkedInfoTreeView.Length; redactionIndex++)
                {
                    if (checkedInfoTreeView[redactionIndex].Contains("RedactedRect", StringComparison.OrdinalIgnoreCase))
                    {
                        deleteAnnotationsId.Add(checkedInfoTreeView[redactionIndex]);
                        redactionCount--;
                    }
                }
                await sfPdfViewer2.DeleteAnnotationsAsync(deleteAnnotationsId);
            }
            checkedInfoTreeView = new string[] { };
            childNodes.Clear();
            this.isSpinnerVisible = false;
        }
        #endregion

        #region Annotation Events
        private void OnAddAnnotation(AnnotationAddEventArgs args)
        {
            if (args.AnnotationProperties.Author == "RedactedRect")
            {
                redactionCount++;
                annotations.Add(args.AnnotationId);
            }
        }

        private void OnRemoveAnnotation(AnnotationRemoveEventArgs args)
        {
            if (!args.AnnotationId.Contains("RedactedRect"))
            {
                redactionCount--;
                if (annotations != null && annotations.Contains(args.AnnotationId))
                {
                    annotations.Remove(args.AnnotationId);
                }
            }
            if (sensitiveInfoTreeView != null)
            {
                foreach (TreeItem item in childNodes)
                {
                    if (item.NodeId == args.AnnotationId)
                    {
                        sensitiveInfoTreeView.UncheckAllAsync(new string[] { item.NodeId });
                    }
                }
            }
        }
        private void OnZoomChanged(ZoomChangeEventArgs args)
        {
            if (args.CurrentZoomValue >= 400)
            {
                IsZoomInHidden = true;
                IsZoomOutHidden = false;
            }
            else if (args.CurrentZoomValue <= 10)
            {
                IsZoomOutHidden = true;
                IsZoomInHidden = false;
            }
            else
            {
                IsZoomOutHidden = false;
                IsZoomInHidden = false;
            }
        }
        #endregion

        #region Document Load and Unload Events Methods
        private void DocumentUnLoaded(UnloadEventArgs args)
        {
            //set to initial state
            redactionCount = 0;
            isPopupVisible = false;
            isDocumentLoaded = false;
            isDataFetched = false;
            isDataRendered = false;
            sensitiveInfo.Clear();
            childNodes.Clear();
            if (checkedPatternTreeView != null)
            {
                checkedPatternTreeView = new string[] { };
                this.sensitiveInfoTreeView?.Dispose();
            }
            checkedInfoTreeView = new string[] { };
            if (smartRedaction is IDisposable disposableSummarizer)
            {
                disposableSummarizer.Dispose();
            }
            if (documentStream != null)
            {
                documentStream.Dispose();
            }
        }

        private void DocumentLoaded(LoadEventArgs args)
        {
            isDocumentLoaded = true;
            smartRedaction = new PDFViewerModel(embedder, openAIService);
        }
        #endregion

        #region Dispose Method
        public void Dispose()
        {
            //Disposing the resources
            isPopupVisible = false;
            redactionCount = 0;
            isDocumentLoaded = false;
            rectangleSettings = new PdfViewerRectangleSettings();
            uploadFiles?.Dispose();
            if (smartRedaction is IDisposable disposableSummarizer)
            {
                disposableSummarizer.Dispose();
            }
            documentStream?.Dispose();
            textboundsDetails?.Clear();
            patterns?.Clear();
            sensitiveInfo?.Clear();
            childNodes?.Clear();
            sfPdfViewer2?.Dispose();
            toastMessage?.Dispose();
            contextMenuItems?.Clear();
        }
        #endregion
        #endregion
    }
}
