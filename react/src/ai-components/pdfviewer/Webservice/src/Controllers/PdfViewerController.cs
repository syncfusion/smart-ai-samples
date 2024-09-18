using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Caching.Memory;
using System.IO;
using System.Net;
#if BLAZOR
using Syncfusion.Blazor.PdfViewer;
#else
using Syncfusion.EJ2.PdfViewer;
#endif
using Newtonsoft.Json;
using System.Drawing;
using Microsoft.AspNetCore.Cors;
using Syncfusion.Pdf.Parsing;
using Syncfusion.Pdf.Security;
using Syncfusion.Pdf;
using System.Security.Cryptography.X509Certificates;
using WFormatType = Syncfusion.DocIO.FormatType;
using Syncfusion.DocIORenderer;
using Syncfusion.Presentation;
using Syncfusion.PresentationRenderer;
using System.Reflection.Metadata;
using System.Threading;
using Syncfusion.Pdf.Graphics;
using Syncfusion.XlsIO;
using Syncfusion.XlsIORenderer;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Syncfusion.Pdf.Interactive;
using Syncfusion.Pdf.Redaction;
using System.Collections;
using EJ2APIServices_NET8;

#if REDIS
using Microsoft.Extensions.Caching.Distributed;
#endif

namespace EJ2APIServices.Controllers
{
    [Route("api/[controller]")]
    public class PdfViewerController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private IMemoryCache _cache;
        private DocumentSummarize _documentSummarize;
        private SmartRedact _smartRedact;
        private SmartFill _smartFill;
#if REDIS
        private IDistributedCache _distributedCache;
#endif

#if REDIS
        public PdfViewerController(IMemoryCache memoryCache, IDistributedCache distributedCache, IHostingEnvironment hostingEnvironment)
#else
        public PdfViewerController(IMemoryCache memoryCache, IHostingEnvironment hostingEnvironment)
#endif
        {
            _cache = memoryCache;
            _hostingEnvironment = hostingEnvironment;
#if REDIS
            _distributedCache = distributedCache;
#endif
        }

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("Redaction")]
        public IActionResult Redaction([FromBody] Dictionary<string,string> jsonObject)
        {
            string RedactionText = "Redacted";
            var finalbase64 = string.Empty;
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            string documentBase = pdfviewer.GetDocumentAsBase64(jsonObject);
            string base64String = documentBase.Split(new string[] { "data:application/pdf;base64," }, StringSplitOptions.None)[1];
            if (base64String != null || base64String != string.Empty)
            {
                byte[] byteArray = Convert.FromBase64String(base64String);
                Console.WriteLine("redaction");
                PdfLoadedDocument loadedDocument = new PdfLoadedDocument(byteArray);
                foreach (PdfLoadedPage loadedPage in loadedDocument.Pages)
                {
                    List<PdfLoadedAnnotation> removeItems = new List<PdfLoadedAnnotation>();
                    foreach (PdfLoadedAnnotation annotation in loadedPage.Annotations)
                    {
                        if (annotation is PdfLoadedRectangleAnnotation)
                        {
                            if (annotation.Author == "Redaction")
                            {
                                // Add the annotation to the removeItems list
                                removeItems.Add(annotation);
                                // Create a new redaction with the annotation bounds and color
                                PdfRedaction redaction = new PdfRedaction(annotation.Bounds, annotation.Color);
                                // Add the redaction to the page
                                loadedPage.AddRedaction(redaction);
                                annotation.Flatten = true;
                            }
                            if (annotation.Author == "Text")
                            {
                                // Add the annotation to the removeItems list
                                removeItems.Add(annotation);
                                // Create a new redaction with the annotation bounds and color
                                PdfRedaction redaction = new PdfRedaction(annotation.Bounds);
                                //Set the font family and font size
                                PdfStandardFont font = new PdfStandardFont(PdfFontFamily.Courier, 8);
                                //Create the appearance like repeated text in the redaction area 
                                CreateRedactionAppearance(redaction.Appearance.Graphics, PdfTextAlignment.Left, true, new SizeF(annotation.Bounds.Width, annotation.Bounds.Height), RedactionText, font, PdfBrushes.Red);
                                // Add the redaction to the page
                                loadedPage.AddRedaction(redaction);
                                annotation.Flatten = true;
                            }
                            //Apply the pattern for the Redaction
                            if (annotation.Author == "Pattern")
                            {
                                // Add the annotation to the removeItems list
                                removeItems.Add(annotation);
                                // Create a new redaction with the annotation bounds and color
                                PdfRedaction redaction = new PdfRedaction(annotation.Bounds);
                                Syncfusion.Drawing.RectangleF rect = new Syncfusion.Drawing.RectangleF(0, 0, 8, 8);
                                PdfTilingBrush tillingBrush = new PdfTilingBrush(rect);
                                tillingBrush.Graphics.DrawRectangle(PdfBrushes.Gray, new Syncfusion.Drawing.RectangleF(0, 0, 2, 2));
                                tillingBrush.Graphics.DrawRectangle(PdfBrushes.White, new Syncfusion.Drawing.RectangleF(2, 0, 2, 2));
                                tillingBrush.Graphics.DrawRectangle(PdfBrushes.LightGray, new Syncfusion.Drawing.RectangleF(4, 0, 2, 2));
                                tillingBrush.Graphics.DrawRectangle(PdfBrushes.DarkGray, new Syncfusion.Drawing.RectangleF(6, 0, 2, 2));
                                tillingBrush.Graphics.DrawRectangle(PdfBrushes.White, new Syncfusion.Drawing.RectangleF(0, 2, 2, 2));
                                tillingBrush.Graphics.DrawRectangle(PdfBrushes.LightGray, new Syncfusion.Drawing.RectangleF(2, 2, 2, 2));
                                tillingBrush.Graphics.DrawRectangle(PdfBrushes.Black, new Syncfusion.Drawing.RectangleF(4, 2, 2, 2));
                                tillingBrush.Graphics.DrawRectangle(PdfBrushes.LightGray, new Syncfusion.Drawing.RectangleF(6, 2, 2, 2));
                                tillingBrush.Graphics.DrawRectangle(PdfBrushes.LightGray, new Syncfusion.Drawing.RectangleF(0, 4, 2, 2));
                                tillingBrush.Graphics.DrawRectangle(PdfBrushes.DarkGray, new Syncfusion.Drawing.RectangleF(2, 4, 2, 2));
                                tillingBrush.Graphics.DrawRectangle(PdfBrushes.LightGray, new Syncfusion.Drawing.RectangleF(4, 4, 2, 2));
                                tillingBrush.Graphics.DrawRectangle(PdfBrushes.White, new Syncfusion.Drawing.RectangleF(6, 4, 2, 2));
                                tillingBrush.Graphics.DrawRectangle(PdfBrushes.Black, new Syncfusion.Drawing.RectangleF(0, 6, 2, 2));
                                tillingBrush.Graphics.DrawRectangle(PdfBrushes.LightGray, new Syncfusion.Drawing.RectangleF(2, 6, 2, 2));
                                tillingBrush.Graphics.DrawRectangle(PdfBrushes.Black, new Syncfusion.Drawing.RectangleF(4, 6, 2, 2));
                                tillingBrush.Graphics.DrawRectangle(PdfBrushes.DarkGray, new Syncfusion.Drawing.RectangleF(6, 6, 2, 2));
                                rect = new Syncfusion.Drawing.RectangleF(0, 0, 16, 14);
                                PdfTilingBrush tillingBrushNew = new PdfTilingBrush(rect);
                                tillingBrushNew.Graphics.DrawRectangle(tillingBrush, rect);
                                //Set the pattern for the redaction area
                                redaction.Appearance.Graphics.DrawRectangle(tillingBrushNew, new Syncfusion.Drawing.RectangleF(0, 0, annotation.Bounds.Width, annotation.Bounds.Height));
                                // Add the redaction to the page
                                loadedPage.AddRedaction(redaction);
                                annotation.Flatten = true;
                            }
                        }
                        else if (annotation is PdfLoadedRubberStampAnnotation)
                        {
                            Stream[] images = PdfLoadedRubberStampAnnotationExtension.GetImages(annotation as PdfLoadedRubberStampAnnotation);
                            // Create a new redaction with the annotation bounds and color
                            PdfRedaction redaction = new PdfRedaction(annotation.Bounds);
                            images[0].Position = 0;
                            PdfImage image = new PdfBitmap(images[0]);
                            //Apply the image to redaction area
                            redaction.Appearance.Graphics.DrawImage(image, new Syncfusion.Drawing.RectangleF(0, 0, annotation.Bounds.Width, annotation.Bounds.Height));
                            // Add the redaction to the page
                            loadedPage.AddRedaction(redaction);
                            annotation.Flatten = true;
                        }
                    }
                    foreach (PdfLoadedAnnotation annotation1 in removeItems)
                    {
                        loadedPage.Annotations.Remove(annotation1);
                    }
                }
                loadedDocument.Redact();
                MemoryStream stream = new MemoryStream();
                loadedDocument.Save(stream);
                stream.Position = 0;
                loadedDocument.Close(true);
                byteArray = stream.ToArray();
                finalbase64 = "data:application/pdf;base64," + Convert.ToBase64String(byteArray);
                stream.Dispose();
            }
                return Content(finalbase64);
        }

        //The Method used for apply the text in the full area of redaction rectangle
        private static void CreateRedactionAppearance(PdfGraphics graphics, PdfTextAlignment alignment, bool repeat, SizeF size, string overlayText, PdfFont font, PdfBrush textcolor)
        {
            float col = 0, row;
            if (font == null) font = new PdfStandardFont(PdfFontFamily.Helvetica, 10);
            int textAlignment = Convert.ToInt32(alignment);
            float y = 0, x = 0, diff = 0;
            Syncfusion.Drawing.RectangleF rect;
            Syncfusion.Drawing.SizeF textsize = font.MeasureString(overlayText);

            if (repeat)
            {
                col = size.Width / textsize.Width;
                row = (float)Math.Floor(size.Height / font.Size);
                diff = Math.Abs(size.Width - (float)(Math.Floor(col) * textsize.Width));
                if (textAlignment == 1)
                    x = diff / 2;
                if (textAlignment == 2)
                    x = diff;
                for (int i = 1; i < col; i++)
                {
                    for (int j = 0; j < row; j++)
                    {
                        rect = new Syncfusion.Drawing.RectangleF(x, y, 0, 0);
                        graphics.DrawString(overlayText, font, textcolor, rect);
                        y = y + font.Size;
                    }
                    x = x + textsize.Width;
                    y = 0;
                }
            }
            else
            {
                diff = Math.Abs(size.Width - textsize.Width);
                if (textAlignment == 1)
                {
                    x = diff / 2;
                }
                if (textAlignment == 2)
                {
                    x = diff;
                }
                rect = new Syncfusion.Drawing.RectangleF(x, 0, 0, 0);
                graphics.DrawString(overlayText, font, textcolor, rect);
            }
        }





        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("Load")]
        public IActionResult Load([FromBody] Dictionary<string, string> jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            MemoryStream stream = new MemoryStream();
            object jsonResult = new object();
            if (jsonObject != null && jsonObject.ContainsKey("document"))
            {
                if (bool.Parse(jsonObject["isFileName"]))
                {
                      string documentPath = GetDocumentPath(jsonObject["document"]);
                    if (!string.IsNullOrEmpty(documentPath))
                    {
                        byte[] bytes = System.IO.File.ReadAllBytes(documentPath);
                        stream = new MemoryStream(bytes);
                    }
                    else
                    {
                        string fileName = jsonObject["document"].Split(new string[] { "://" }, StringSplitOptions.None)[0];
                        if (fileName == "http" || fileName == "https")
                        {
                            WebClient WebClient = new WebClient();
                            byte[] pdfDoc = WebClient.DownloadData(jsonObject["document"]);
                            stream = new MemoryStream(pdfDoc);
                        }
                        else
                        {
                            return this.Content(jsonObject["document"] + " is not found");
                        }
                    }
                }
                else
                {
                    byte[] bytes = Convert.FromBase64String(jsonObject["document"]);
                    stream = new MemoryStream(bytes);
                }
            }
            jsonResult = pdfviewer.Load(stream, jsonObject);
            return Content(JsonConvert.SerializeObject(jsonResult));
        }

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("LoadFile")]
        //Post action for loading the Office products
        public IActionResult LoadFile([FromBody] Dictionary<string, string> jsonObject)
        {
            if (jsonObject.ContainsKey("data"))
            {

                string base64 = jsonObject["data"];
                //string fileName = args.FileData[0].Name; 
                string type = jsonObject["type"];
                string data = base64.Split(',')[1];
                byte[] bytes = Convert.FromBase64String(data);
                var outputStream = new MemoryStream();
                Syncfusion.Pdf.PdfDocument pdfDocument = new Syncfusion.Pdf.PdfDocument();
                using (Stream stream = new MemoryStream(bytes))
                {
                    switch (type)
                    {
                        case "docx":
                        case "dot":
                        case "doc":
                        case "dotx":
                        case "docm":
                        case "dotm":
                        case "rtf":
                            Syncfusion.DocIO.DLS.WordDocument doc = new Syncfusion.DocIO.DLS.WordDocument(stream, GetWFormatType(type));
                            //Initialization of DocIORenderer for Word to PDF conversion
                            DocIORenderer render = new DocIORenderer();
                            //Converts Word document into PDF document
                            pdfDocument = render.ConvertToPDF(doc);
                            doc.Close();
                            break;
                        case "pptx":
                        case "pptm":
                        case "potx":
                        case "potm":
                            //Loads or open an PowerPoint Presentation
                            IPresentation pptxDoc = Presentation.Open(stream);
                            pdfDocument = PresentationToPdfConverter.Convert(pptxDoc);
                            pptxDoc.Close();
                            break;
                        case "xlsx":
                        case "xls":
                            ExcelEngine excelEngine = new ExcelEngine();
                            //Loads or open an existing workbook through Open method of IWorkbooks
                            IWorkbook workbook = excelEngine.Excel.Workbooks.Open(stream);
                            //Initialize XlsIO renderer.
                            XlsIORenderer renderer = new XlsIORenderer();
                            //Convert Excel document into PDF document
                            pdfDocument = renderer.ConvertToPDF(workbook);
                            workbook.Close();
                            break;
                        case "jpeg":
                        case "jpg":
                        case "png":
                        case "bmp":
                            //Add a page sections to the document 
                            PdfSection section = pdfDocument.Sections.Add();
                            // Create the PdfBitmap from the stream 
                            PdfBitmap image = new PdfBitmap(stream);
                            //Setting same page size as image
                            section.PageSettings.Width = image.PhysicalDimension.Width;
                            section.PageSettings.Height = image.PhysicalDimension.Height;
                            PdfPage page = section.Pages.Add();
                            //Drawing image to the PDF page 
                            page.Graphics.DrawImage(image, new Syncfusion.Drawing.PointF(0, 0), new Syncfusion.Drawing.SizeF(page.GetClientSize().Width, page.GetClientSize().Height));
                            break;
                        case "pdf":
                            string pdfBase64String = Convert.ToBase64String(bytes);
                            return Content("data:application/pdf;base64," + pdfBase64String);
                            break;
                    }

                }
                pdfDocument.Save(outputStream);
                outputStream.Position = 0;
                byte[] byteArray = outputStream.ToArray();
                pdfDocument.Close();
                outputStream.Close();

                string base64String = Convert.ToBase64String(byteArray);
                return Content("data:application/pdf;base64," + base64String);


            }
            return Content("data:application/pdf;base64," + "");
        }
        public static WFormatType GetWFormatType(string format)
        {
            if (string.IsNullOrEmpty(format))
                throw new NotSupportedException("This is not a valid Word documnet.");
            switch (format.ToLower())
            {
                case "dotx":
                    return WFormatType.Dotx;
                case "docx":
                    return WFormatType.Docx;
                case "docm":
                    return WFormatType.Docm;
                case "dotm":
                    return WFormatType.Dotm;
                case "dot":
                    return WFormatType.Dot;
                case "doc":
                    return WFormatType.Doc;
                case "rtf":
                    return WFormatType.Rtf;
                default:
                    throw new NotSupportedException("This is not a valid Word documnet.");
            }
        }

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("Bookmarks")]
        public IActionResult Bookmarks([FromBody] Dictionary<string, string> jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            object jsonResult = pdfviewer.GetBookmarks(jsonObject);
            return Content(JsonConvert.SerializeObject(jsonResult));
        }

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("RenderPdfPages")]
        public IActionResult RenderPdfPages([FromBody] Dictionary<string, string> jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            object jsonResult = pdfviewer.GetPage(jsonObject);
            return Content(JsonConvert.SerializeObject(jsonResult));
        }

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("RenderAnnotationComments")]
        public IActionResult RenderAnnotationComments([FromBody] Dictionary<string, string> jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            object jsonResult = pdfviewer.GetAnnotationComments(jsonObject);
            return Content(JsonConvert.SerializeObject(jsonResult));
        }

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("Unload")]
        public IActionResult Unload([FromBody] Dictionary<string, string> jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            pdfviewer.ClearCache(jsonObject);
            return this.Content("Document cache is cleared");
        }
		
        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("RenderThumbnailImages")]
        public IActionResult RenderThumbnailImages([FromBody] Dictionary<string, string> jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            object result = pdfviewer.GetThumbnailImages(jsonObject);
            return Content(JsonConvert.SerializeObject(result));
        }

        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("Download")]
        public IActionResult Download([FromBody] Dictionary<string, string> jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            string documentBase = pdfviewer.GetDocumentAsBase64(jsonObject);
            return Content(documentBase);
        }

        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("FlattenDownload")]
        //Post action for downloading the PDF documents
        public IActionResult FlattenDownload([FromBody] Dictionary<string, string> jsonObject)
        {
            //Initialize the PDF Viewer object with memory cache object
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            string documentBase = pdfviewer.GetDocumentAsBase64(jsonObject);

            string base64String = documentBase.Split(new string[] { "data:application/pdf;base64," }, StringSplitOptions.None)[1];
            byte[] byteArray = Convert.FromBase64String(base64String);
            PdfLoadedDocument loadedDocument = new PdfLoadedDocument(byteArray);
            if (loadedDocument.Form != null)
            {
                loadedDocument.FlattenAnnotations();
                loadedDocument.Form.Flatten = true;
            }
            //Save the PDF document.
            MemoryStream stream = new MemoryStream();
            //Save the PDF document
            loadedDocument.Save(stream);
            stream.Position = 0;
            //Close the document
            loadedDocument.Close(true);
            string updatedDocumentBase = Convert.ToBase64String(stream.ToArray());
            documentBase = "data:application/pdf;base64," + updatedDocumentBase;
            return Content(documentBase);
        }

        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("AddSignature")]
        public IActionResult AddSignature([FromBody] Dictionary<string, string> jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            string documentBase = pdfviewer.GetDocumentAsBase64(jsonObject);
            byte[] documentBytes = Convert.FromBase64String(documentBase.Split(",")[1]);
            PdfLoadedDocument loadedDocument = new PdfLoadedDocument(documentBytes);
            //Get the first page of the document.
            PdfPageBase loadedPage = loadedDocument.Pages[0];
            //Create new X509Certificate2 with the root certificate.
            X509Certificate2 certificate = new X509Certificate2(GetDocumentPath("localhost.pfx"), "Syncfusion@123");
            PdfCertificate pdfCertificate = new PdfCertificate(certificate);
            //Creates a digital signature.
            PdfSignature signature = new PdfSignature(loadedDocument, loadedPage, pdfCertificate, "Signature");
            signature.Certificated = true;
            MemoryStream str = new MemoryStream();
            //Saves the document.
            loadedDocument.Save(str);
            byte[] docBytes = str.ToArray();
            string docBase64 = "data:application/pdf;base64," + Convert.ToBase64String(docBytes);
            return Content(docBase64);
        }

        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("ValidateSignature")]
        public IActionResult ValidateSignature([FromBody] Dictionary<string, string> jsonObject)
        {
            var hasDigitalSignature = false;
            var errorVisible = false;
            var successVisible = false;
            var warningVisible = false;
            var downloadVisibility = true;
            var message = string.Empty;
            if (jsonObject.ContainsKey("documentData")){
                byte[] documentBytes = Convert.FromBase64String(jsonObject["documentData"].Split(",")[1]);
                PdfLoadedDocument loadedDocument = new PdfLoadedDocument(documentBytes);
              
                PdfLoadedForm form = loadedDocument.Form;
                if (form != null)
                {
                    foreach (PdfLoadedField field in form.Fields)
                    {
                        if (field is PdfLoadedSignatureField)
                        {
                            //Gets the first signature field of the PDF document.
                            PdfLoadedSignatureField signatureField = field as PdfLoadedSignatureField;
                            if (signatureField.IsSigned)
                            {
                                hasDigitalSignature = true;
                                //X509Certificate2Collection to check the signers identity using root certificates.
                                X509Certificate2Collection collection = new X509Certificate2Collection();
                                //Create new X509Certificate2 with the root certificate.
                                X509Certificate2 certificate = new X509Certificate2(GetDocumentPath("localhost.pfx"), "Syncfusion@123");
                                //Add the certificate to the collection.
                                collection.Add(certificate);
                                //Validate all signatures in loaded PDF document and get the list of validation result.
                                PdfSignatureValidationResult result = signatureField.ValidateSignature(collection);
                                //Checks whether the document is modified or not.
                                if (result.IsDocumentModified)
                                {
                                    errorVisible = true;
                                    successVisible = false;
                                    warningVisible = false;
                                    downloadVisibility = false;
                                    message = "The document has been digitally signed, but it has been modified since it was signed and at least one signature is invalid .";
                                }
                                else
                                {
                                    //Checks whether the signature is valid or not.
                                    if (result.IsSignatureValid)
                                    {
                                        if (result.SignatureStatus.ToString() == "Unknown")
                                        {
                                            errorVisible = false;
                                            successVisible = false;
                                            warningVisible = true;
                                            message = "The document has been digitally signed and at least one signature has problem";
                                        }
                                        else
                                        {
                                            errorVisible = false;
                                            successVisible = true;
                                            warningVisible = false;
                                            downloadVisibility = false;
                                            message = "The document has been digitally signed and all the signatures are valid.";
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return Content(JsonConvert.SerializeObject(new { hasDigitalSignature=hasDigitalSignature, errorVisible= errorVisible, successVisible = successVisible, warningVisible= warningVisible, downloadVisibility= downloadVisibility,message=message }));

        }

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("PrintImages")]
        public IActionResult PrintImages([FromBody] Dictionary<string, string> jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            object pageImage = pdfviewer.GetPrintImage(jsonObject);
            return Content(JsonConvert.SerializeObject(pageImage));
        }

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("ExportAnnotations")]
        public IActionResult ExportAnnotations([FromBody] Dictionary<string, string> jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            string result = pdfviewer.ExportAnnotation(jsonObject);
            return Content(result);

        }

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("ImportAnnotations")]
        public IActionResult ImportAnnotations([FromBody] Dictionary<string, string> jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            string jsonResult = string.Empty;
            object JsonResult;
            if (jsonObject != null && jsonObject.ContainsKey("fileName"))
            {
                string documentPath = GetDocumentPath(jsonObject["fileName"]);
                if (!string.IsNullOrEmpty(documentPath))
                {
                    jsonResult = System.IO.File.ReadAllText(documentPath);
                    string[] searchStrings = { "textMarkupAnnotation", "measureShapeAnnotation", "freeTextAnnotation", "stampAnnotations", "signatureInkAnnotation", "stickyNotesAnnotation", "signatureAnnotation", "AnnotationType" };
                    bool isnewJsonFile = !searchStrings.Any(jsonResult.Contains);
                    if (isnewJsonFile)
                    {
                        byte[] bytes = System.IO.File.ReadAllBytes(documentPath);
                        jsonObject["importedData"] = Convert.ToBase64String(bytes);
                        JsonResult = pdfviewer.ImportAnnotation(jsonObject);
                        jsonResult = JsonConvert.SerializeObject(JsonResult);
                    }
                }
                else
                {
                    return this.Content(jsonObject["document"] + " is not found");
                }
            }
            else
            {
                string extension = Path.GetExtension(jsonObject["importedData"]);
                if (extension != ".xfdf")
                {
                    JsonResult = pdfviewer.ImportAnnotation(jsonObject);
                    return Content(JsonConvert.SerializeObject(JsonResult));
                }
                else
                {
                    string documentPath = GetDocumentPath(jsonObject["importedData"]);
                    if (!string.IsNullOrEmpty(documentPath))
                    {
                        byte[] bytes = System.IO.File.ReadAllBytes(documentPath);
                        jsonObject["importedData"] = Convert.ToBase64String(bytes);
                        JsonResult = pdfviewer.ImportAnnotation(jsonObject);
                        return Content(JsonConvert.SerializeObject(JsonResult));
                    }
                    else
                    {
                        return this.Content(jsonObject["document"] + " is not found");
                    }
                }
            }

            return Content(jsonResult);
        }

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("RenderPdfTexts")]
        public IActionResult RenderPdfTexts([FromBody] Dictionary<string, string> jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            object result = pdfviewer.GetDocumentText(jsonObject);
            return Content(JsonConvert.SerializeObject(result));
        }

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("ExportFormFields")]
        public IActionResult ExportFormFields([FromBody] Dictionary<string, string> jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            string jsonResult = pdfviewer.ExportFormFields(jsonObject);
            return Content(jsonResult);
        }

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("ImportFormFields")]
        public IActionResult ImportFormFields([FromBody] Dictionary<string, string> jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            object jsonResult = pdfviewer.ImportFormFields(jsonObject);
            return Content(JsonConvert.SerializeObject(jsonResult));
        }

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("ValidatePassword")]
        public IActionResult ValidatePassword([FromBody] Dictionary<string, string> jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            MemoryStream stream = new MemoryStream();
            object jsonResult = new object();
            if (jsonObject != null && jsonObject.ContainsKey("document"))
            {
                if (bool.Parse(jsonObject["isFileName"]))
                {
                    string documentPath = GetDocumentPath(jsonObject["document"]);
                    if (!string.IsNullOrEmpty(documentPath))
                    {
                        byte[] bytes = System.IO.File.ReadAllBytes(documentPath);
                        stream = new MemoryStream(bytes);
                    }
                    else
                    {
                        return this.Content(jsonObject["document"] + " is not found");
                    }
                }
                else
                {
                    byte[] bytes = Convert.FromBase64String(jsonObject["document"]);
                    stream = new MemoryStream(bytes);
                }
            }
            string password = null;
            if (jsonObject.ContainsKey("password"))
            {
                password = jsonObject["password"];
            }
            var result = pdfviewer.Load(stream, password);

            return Content(JsonConvert.SerializeObject(result));
        }


        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("SummarizePDF")]
        //Post action for loading the Office products
        public IActionResult SummarizePDF([FromBody] Dictionary<string, string> jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            if (_cache.TryGetValue("DocumentSummarize", out _documentSummarize))
            {
                _cache.Remove("DocumentSummarize");
            }
            var documentResult = string.Empty;
            string documentBase = pdfviewer.GetDocumentAsBase64(jsonObject);
            _documentSummarize = new DocumentSummarize();
            InitializeAI(null, _documentSummarize, null);
            string base64String = documentBase.Split(new string[] { "data:application/pdf;base64," }, StringSplitOptions.None)[1];
            if (base64String != null || base64String != string.Empty)
            {
                byte[] byteArray = Convert.FromBase64String(base64String);
                documentResult = _documentSummarize.GetSuggestionsAndSummary(byteArray).Result;
            }
            _cache.Set("DocumentSummarize", _documentSummarize);
            return Content(JsonConvert.SerializeObject(documentResult));

        }

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("GetAnswer")]
        //Post action for loading the Office products
        public IActionResult GetAnswer([FromBody] QuestionRequest question)
        {
            var answer = string.Empty;
            if (_cache.TryGetValue("DocumentSummarize", out _documentSummarize))
            {
                string questionToAI = question.Question;
                answer = _documentSummarize.GetAnswer(questionToAI).Result;
            }
            _cache.Set("DocumentSummarize", _documentSummarize);
            return Content(JsonConvert.SerializeObject(answer));
        }

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("FindTextinDocument")]
        public IActionResult FindTextinDocument([FromBody] RedactDocumentRequest request)
        {
            var jsonObject = request.jsonObject;
            var selectedItems = request.selectedItems;
            Dictionary<int, List<TextBounds>> boundsData = new Dictionary<int, List<TextBounds>>();
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
            List<string> extractedTextList = new List<string>();
            Dictionary<int, List<TextBounds>> textboundsDetails = new Dictionary<int, List<TextBounds>>();
            string documentBase = pdfviewer.GetDocumentAsBase64(jsonObject);
            _smartRedact = new SmartRedact();
            InitializeAI(null, null, _smartRedact);
            string base64String = documentBase.Split(new string[] { "data:application/pdf;base64," }, StringSplitOptions.None)[1];
            if (base64String != null || base64String != string.Empty)
            {
                byte[] byteArray = Convert.FromBase64String(base64String);
                MemoryStream documentStream = new MemoryStream(byteArray);
                extractedTextList = _smartRedact.GetLoadDocumentText(documentStream, "application/pdf").Result;
                string extractedText = String.Join(" ", extractedTextList);
                List<string> sensitiveData = _smartRedact.GetSensitiveDataFromPDF(extractedText, selectedItems).Result;
                List<string> sensitiveInformations = RemovePrefix(sensitiveData, selectedItems);
                boundsData = _smartRedact.FindTextBounds(documentStream, sensitiveInformations);
            }
            return Content(JsonConvert.SerializeObject(boundsData));
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

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("AIRedaction")]
        public IActionResult AIRedaction([FromBody] Dictionary<string, string> jsonObject)
        {
            string RedactionText = "Redacted";
            var finalbase64 = string.Empty;
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            string documentBase = jsonObject["hashId"];
            string base64String = documentBase.Split(new string[] { "data:application/pdf;base64," }, StringSplitOptions.None)[1];
            if (base64String != null || base64String != string.Empty)
            {
                byte[] byteArray = Convert.FromBase64String(base64String);
                PdfLoadedDocument loadedDocument = new PdfLoadedDocument(byteArray);
                foreach (PdfLoadedPage loadedPage in loadedDocument.Pages)
                {
                    List<PdfLoadedAnnotation> removeItems = new List<PdfLoadedAnnotation>();
                    foreach (PdfLoadedAnnotation annotation in loadedPage.Annotations)
                    {
                        if (annotation is PdfLoadedRectangleAnnotation)
                        {
                            if (annotation.Author == "Redaction")
                            {
                                removeItems.Add(annotation);
                                PdfRedaction redaction = new PdfRedaction(annotation.Bounds, Syncfusion.Drawing.Color.Black);
                                loadedPage.AddRedaction(redaction);
                                annotation.Flatten = true;
                            }
                        }
                    }
                    foreach (PdfLoadedAnnotation annotation1 in removeItems)
                    {
                        loadedPage.Annotations.Remove(annotation1);
                    }
                }
                loadedDocument.Redact();
                MemoryStream stream = new MemoryStream();
                loadedDocument.Save(stream);
                stream.Position = 0;
                loadedDocument.Close(true);
                byteArray = stream.ToArray();
                finalbase64 = "data:application/pdf;base64," + Convert.ToBase64String(byteArray);
                stream.Dispose();
            }
            return Content(finalbase64);
        }

        private string HintValuesforFieldsAsString(Dictionary<string, string> jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            string documentBase = pdfviewer.GetDocumentAsBase64(jsonObject);
            string base64String = documentBase.Split(new string[] { "data:application/pdf;base64," }, StringSplitOptions.None)[1];
            byte[] byteArray = Convert.FromBase64String(base64String);
            MemoryStream documentStream = new MemoryStream();
            documentStream = new MemoryStream(byteArray);
            PdfLoadedDocument doc = new PdfLoadedDocument(documentStream);
            //Gets the loaded form.
            PdfLoadedForm form = doc.Form;
            PdfLoadedFormFieldCollection formFields = form.Fields;

            string hintData = string.Empty;

            foreach (var field in formFields)
            {

                if (field is PdfLoadedListBoxField listBox)
                {
                    // Append ListBox name and items to the hintData string
                    hintData += "\n" + listBox.Name + " : Collection of Items are :";
                    PdfLoadedListItemCollection options = listBox.Values;
                    foreach (PdfLoadedListItem option in options)
                    {
                        hintData += option.Text + ", ";
                    }
                }
                else if (field is PdfLoadedComboBoxField comboBox)
                {
                    // Append comboBox name and items to the hintData string
                    hintData += "\n" + comboBox.Name + " : Collection of Items are :";
                    PdfLoadedListItemCollection options = comboBox.Values;
                    foreach (PdfLoadedListItem option in options)
                    {
                        hintData += option.Text + ", ";
                    }
                }
                else if (field is PdfLoadedRadioButtonListField radio)
                {
                    // Append radioButton name and items to the hintData string
                    hintData += "\n" + radio.Name + " : Collection of Items are :";
                    PdfLoadedRadioButtonItemCollection options = radio.Items;
                    foreach (PdfLoadedRadioButtonItem option in options)
                    {
                        hintData += option.Value + ", ";
                    }
                }
                else if (field is PdfLoadedCheckBoxField checkbox)
                {
                    try
                    {
                        string value = checkbox.GetValue("ExportValue");
                        // Append CheckBox Button name and value to the hintData string
                        hintData += "\n" + checkbox.Name + " : and the corresponding value is :" + value;
                    }
                    catch (Exception ex)
                    {
                        //throw ex;
                    }
                }
                // Check if the form field name contains 'Date', 'dob', or 'date'
                else if (field is PdfLoadedTextBoxField dob)
                {
                    if (dob.Name.Contains("Date") || dob.Name.Contains("dob") || dob.Name.Contains("date"))
                    {
                        // Append instructions for date format to the hintData string
                        hintData += "\n" + dob.Name + " : Write Date in MM/dd/YYYY format";
                    }
                }

            }
            // Return the hintData string if not null, otherwise return an empty string
            if (!string.IsNullOrEmpty(hintData))
            {
                return hintData;
            }
            else
            {
                return "";
            }
            return "";
        }

        [AcceptVerbs("Post")]
        [HttpPost]
        [EnableCors("AllowAllOrigins")]
        [Route("SmartFillClicked")]
        public IActionResult SmartFillClicked([FromBody] SmartFillParameters jsonObject)
        {
#if REDIS
            PdfRenderer pdfviewer = new PdfRenderer(_cache,_distributedCache);
#else
            PdfRenderer pdfviewer = new PdfRenderer(_cache);
#endif
            string inputFileContentAsString = jsonObject.exportFormFieldValue;
            // Generates a string with custom data for each form field in a PDF viewer
            string CustomValues = HintValuesforFieldsAsString(jsonObject.jsonObject);

            string mergePrompt = $"Merge the input data into the XFDF file content. Hint text: {CustomValues}. " +
                                 $"Ensure the input data matches suitable field names. " +
                                 $"Here are the details: " +
                                 $"input data: {jsonObject.textareaContent}, " +
                                 $"XFDF information: {inputFileContentAsString}. " +
                                 $"Provide the resultant XFDF content directly, without any additional text, code blocks, or formatting markers like ```xml or ```." +
                                 $"Some conditions need to be followed: " +
                                 $"1. Input data is not directly provided as the field name; you need to think and merge appropriately. " +
                                 $"2. When comparing input data and field names, ignore case sensitivity. " +
                                 $"3. First, determine the best match for the field name. If there isn’t an exact match, use the input data to find a close match. " +
                                 $"4. If the input data has the value of a checkbox field, change the value of the checkbox field to ON and other fields should be OFF.";

            // Reuest to AI
            _smartFill = new SmartFill();
            InitializeAI(_smartFill, null, null);
            string resultantXfdfFile = _smartFill.GetSmartFillContent(mergePrompt).Result;
            return Content(resultantXfdfFile);
        }

        private void InitializeAI(SmartFill? smartFill, DocumentSummarize? documentSummarize, SmartRedact? smartRedact)
        {
            string apiKey = "YOUR-AI-KEY";
            smartFill?.InitializeOpenAI(apiKey);
            documentSummarize?.InitializeOpenAI(apiKey);
            smartRedact?.InitializeOpenAI(apiKey);
        }

        // GET api/values
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        private string GetDocumentPath(string document)
        {
            string documentPath = string.Empty;
            if (!System.IO.File.Exists(document))
            {
                var path = _hostingEnvironment.ContentRootPath;
                var pathToFile = path + Path.DirectorySeparatorChar.ToString() + "App_Data" + Path.DirectorySeparatorChar.ToString()
  + document;
                if (System.IO.File.Exists(pathToFile))
                    documentPath = pathToFile;
            }
            else
            {
                documentPath = document;
            }
            return documentPath;
        } 
        
    }
    public class SmartFillParameters
    {
        public Dictionary<string, string> jsonObject { get; set; }
        public string textareaContent { get; set; }
        public string exportFormFieldValue { get; set; }
    }
    public class RedactDocumentRequest
    {
        public Dictionary<string, string> jsonObject { get; set; }
        public List<string> selectedItems { get; set; }
    }
    public class QuestionRequest
    {
        public string Question { get; set; }
    }
}
