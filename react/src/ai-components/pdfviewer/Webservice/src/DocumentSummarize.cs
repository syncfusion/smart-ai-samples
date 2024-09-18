using Syncfusion.Pdf.Parsing;
using System.Collections.Generic;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Syncfusion.Drawing;
using System.Linq;

namespace EJ2APIServices_NET8
{
    public class DocumentSummarize
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
        public async Task LoadDocument(Stream stream, string mimeType)
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

                extractedText.Clear();

            }
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
        /// Get the summary of the document using first 10 pages content
        /// </summary>
        /// <returns></returns>
        public async Task<string> GetDocumentSummary()
        {
            return await sematicKernalAI.GetAnswerFromGPT("You are a helpful assistant. Your task is to analyze the provided text and generate short summary.");
        }

        /// <summary>
        /// Get the answer for the question using GPT-4o and local embeddings
        /// </summary>
        /// <param name="question"></param>
        /// <returns></returns>
        public async Task<string> GetAnswer(string question)
        {
            var answer = await sematicKernalAI.AnswerQuestion(question);
            var suggestions = await GetSuggestions();
            var result = answer + "\nsuggestions" + suggestions;
            return result;
        }

        internal async Task<string> GetSuggestions()
        {
            return await sematicKernalAI.GetAnswerFromGPT("You are a helpful assistant. Your task is to analyze the provided text and generate 3 short diverse questions and each question should not exceed 10 words");
        }

        public async Task<string> SummaryPDF(byte[] bytes)
        {
            MemoryStream documentStream = new MemoryStream(bytes);
            
            await LoadDocument(documentStream, "application/pdf");

            //get the summary of the PDF
            return await GetDocumentSummary();
        }

        public async Task<string> GetSuggestionsAndSummary(byte[] pdfBytes)
        {
            var summary = await SummaryPDF(pdfBytes);
            var suggestions = await GetSuggestions();
            var result = summary + "\nsuggestions" + suggestions;
            return result;
        }
    }
}
