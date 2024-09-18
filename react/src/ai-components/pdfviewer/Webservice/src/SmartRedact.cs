using Syncfusion.Drawing;
using Syncfusion.Pdf.Parsing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EJ2APIServices_NET8
{
    public class SmartRedact
    {
        private SematicKernalAI? sematicKernalAI;
        public void InitializeOpenAI(string key)
        {
            sematicKernalAI = new SematicKernalAI(key);
        }
        /// <summary>
        /// Load the document and extract text page by page and save it in List
        /// </summary>
        /// <param name="stream"></param>
        /// <param name="mimeType"></param>
        /// <returns></returns>
        public async Task<List<String>> GetLoadDocumentText(Stream stream, string mimeType)
        {
            List<string> extractedText = new List<string>();

            if (mimeType == "application/pdf")
            {
                using (PdfLoadedDocument loadedDocument = new PdfLoadedDocument(stream))
                {
                    // Loading page collections
                    PdfLoadedPageCollection loadedPages = loadedDocument.Pages;
                    // Extract annotations to a memory stream and convert to string
                    using (MemoryStream annotationStream = new MemoryStream())
                    {
                        loadedDocument.ExportAnnotations(annotationStream, AnnotationDataFormat.Json);
                        string annotations = ConvertToString(annotationStream);
                        if (!String.IsNullOrEmpty(annotations))
                        {
                            extractedText.Add("Annotations: " + annotations);
                        }
                    }
                    // Extract form fields to a memory stream and convert to string
                    using (MemoryStream formStream = new MemoryStream())
                    {
                        if (loadedDocument.Form != null)
                        {
                            loadedDocument.Form.ExportData(formStream, DataFormat.Json, "form");
                            string formFields = ConvertToString(formStream);
                            if (!String.IsNullOrEmpty(formFields))
                            {
                                extractedText.Add("Form fields: " + formFields);
                            }
                        }
                    }
                    // Extract text from existing PDF document pages
                    for (int i = 0; i < loadedPages.Count; i++)
                    {
                        string text = $"... Page {i + 1} ...\n";
                        text += loadedPages[i].ExtractText();
                        extractedText.Add(text);
                    }
                }
                if (sematicKernalAI != null)
                {
                    await sematicKernalAI.Initialize(extractedText.ToArray());
                }
            }
            return extractedText;
        }
        private string ConvertToString(MemoryStream memoryStream)
        {
            // Reset the position of the MemoryStream to the beginning
            memoryStream.Position = 0;
            using (StreamReader reader = new StreamReader(memoryStream, Encoding.UTF8))
            {
                return reader.ReadToEnd();
            }
        }
        /// <summary>
        /// Get the Sensitive Data with the selected patterns from the PDF using OpenAI 
        /// </summary> 
        /// <param name="text"></param>
        /// <param name="selectedItems"></param>
        /// <returns></returns>
        internal async Task<List<string>> GetSensitiveDataFromPDF(string text, List<string> selectedItems)
        {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.AppendLine("I have a block of text containing various pieces of information. Please help me identify and extract any Personally Identifiable Information (PII) present in the text. The PII categories I am interested in are:");
            foreach (var item in selectedItems)
            {
                stringBuilder.AppendLine(item);
            }
            stringBuilder.AppendLine("Please provide the extracted information as a plain list, separated by commas, without any prefix or numbering or extra content.");
            string prompt = stringBuilder.ToString();
            if (sematicKernalAI != null)
            {
                var answer = await sematicKernalAI.GetAnswerFromGPT(prompt);
                if (!string.IsNullOrEmpty(answer))
                {
                    var output = answer.Trim();
                    // Use a HashSet to remove duplicates
                    var namesSet = new HashSet<string>(output
                        ?.Split(new[] { '\n', ',' }, StringSplitOptions.RemoveEmptyEntries)
                        .Select(name => name.Trim())
                        .Where(name => !string.IsNullOrEmpty(name)) ?? Enumerable.Empty<string>());
                    return namesSet.ToList();
                }
            }
            return new List<string>();
        }

        /// <summary>
        /// Get the Text Bounds of the text to be searched
        /// </summary>
        /// <param name="stream"></param>
        /// <param name="sensitiveInformations"></param>
        /// <returns></returns>
        public Dictionary<int, List<TextBounds>> FindTextBounds(Stream stream, List<string> sensitiveInformations)
        {
            Dictionary<int, List<TextBounds>> accumulatedBounds = new Dictionary<int, List<TextBounds>>();
            using (PdfLoadedDocument loadedDocument = new PdfLoadedDocument(stream))
            {
                foreach (var info in sensitiveInformations)
                {
                    if (!string.IsNullOrEmpty(info))
                    {
                        Dictionary<int, List<RectangleF>> bounds;
                        // Find the text bounds
                        loadedDocument.FindText(info, out bounds);
                        // Merge bounds into accumulatedBounds
                        foreach (var pair in bounds)
                        {
                            if (!accumulatedBounds.ContainsKey(pair.Key))
                            {
                                accumulatedBounds[pair.Key] = new List<TextBounds>();
                            }
                            // Add the bounds with the corresponding sensitive information
                            accumulatedBounds[pair.Key].AddRange(pair.Value.Select(rect => new TextBounds
                            {
                                SensitiveInformation = info,
                                Bounds = rect
                            }));
                        }
                    }
                }
                foreach (KeyValuePair<int, List<TextBounds>> pair in accumulatedBounds)
                {
                    // Create a dictionary to store the maximum width bounds for each (X, Y) value pair
                    Dictionary<(float X, float Y), TextBounds> maxWidthBounds = new Dictionary<(float X, float Y), TextBounds>();

                    for (int i = 0; i < pair.Value.Count; i++)
                    {
                        // Convert Point to Pixels for Programmatically Add Support
                        var textBound = pair.Value[i];
                        var rect = textBound.Bounds;
                        rect.X = ConvertPointToPixel(rect.X) - 2;
                        rect.Y = ConvertPointToPixel(rect.Y) - 2;
                        rect.Height = ConvertPointToPixel(rect.Height) + 2;
                        rect.Width = ConvertPointToPixel(rect.Width) + 2;

                        var key = (rect.X, rect.Y);

                        if (maxWidthBounds.TryGetValue(key, out var existingTextBound))
                        {
                            // If the existing rectangle has a smaller width, replace it
                            if (rect.Width > existingTextBound.Bounds.Width)
                            {
                                maxWidthBounds[key] = new TextBounds
                                {
                                    SensitiveInformation = textBound.SensitiveInformation,
                                    Bounds = rect
                                };
                            }
                        }
                        else
                        {
                            maxWidthBounds[key] = new TextBounds
                            {
                                SensitiveInformation = textBound.SensitiveInformation,
                                Bounds = rect
                            };
                        }
                    }
                    pair.Value.Clear();
                    pair.Value.AddRange(maxWidthBounds.Values);
                }
            }
            return accumulatedBounds;
        }
        private float ConvertPointToPixel(float number)
        {
            return (number * 96f / 72f);
        }
    }
    public class TextBounds
    {
        public string SensitiveInformation { get; set; } = string.Empty;
        public RectangleF Bounds { get; set; }
    }
}
