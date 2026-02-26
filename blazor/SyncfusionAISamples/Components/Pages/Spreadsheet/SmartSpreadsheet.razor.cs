using Syncfusion.Blazor.Spreadsheet;
using Syncfusion.Blazor.InteractiveChat;
using Syncfusion.Blazor.Navigations;
using Markdig;
using System.Text.RegularExpressions;
using Syncfusion.XlsIO;
using System.Reflection;

namespace SyncfusionAISamples.Components.Pages.Spreadsheet
{
    public partial class SmartSpreadsheet
    {
        #region Constants
        private const string SidebarTargetSelector = ".maincontent";
        #endregion

        #region Private Fields
        private SfSpreadsheet? _spreadsheetInstance;
        private Syncfusion.Blazor.Navigations.SfSidebar? _sidebarRef;
        private SfAIAssistView? _assistView;
        private bool _isAssistVisible;
        private bool _isLoading;
        private string _jsonOutput = string.Empty;
        private string _usedRange = string.Empty;
        
        private readonly List<string> _promptSuggestions = new()
        {
            "Highlight top 5 highest sales in Amount",
            "Replace Credit Card with Gift Card and highlight",
            "Bold the header row and apply a light background",
        };

        /// <summary>
        /// Gets or sets the Excel file data used as the spreadsheet data source.
        /// </summary>
        private byte[] DataSourceBytes { get; set; } = null!;
        #endregion

        #region Lifecycle Methods
        /// <summary>
        /// Component initialization logic (loads initial spreadsheet data).
        /// </summary>
        protected override void OnInitialized()
        {
            LoadInitialSpreadsheetData();
        }
        #endregion

        #region Data Loading Methods
        /// <summary>
        /// Loads the initial Excel data from file.
        /// </summary>
        private void LoadInitialSpreadsheetData()
        {
            const string filePath = "wwwroot/Data/spreadsheet/smartspreadsheet.xlsx";
            if (File.Exists(filePath))
            {
                DataSourceBytes = File.ReadAllBytes(filePath);
            }
        }
        #endregion

        #region AI AssistView Event Handlers
        /// <summary>
        /// Handles prompt requests from the AI AssistView and processes the response.
        /// </summary>
        /// <param name="args">Event arguments containing the prompt text.</param>
        private async Task OnPromptRequestedAsync(AssistViewPromptRequestedEventArgs args)
        {
            await ShowLoadingStateAsync();

            string response = string.Empty;
            var aiRawValue = await OpenAIService.GetCompletionAsync(args.Prompt + _jsonOutput, false);

            if (!string.IsNullOrEmpty(aiRawValue) && _spreadsheetInstance is not null)
            {
                string htmlResponse = string.Empty;
                var cellUpdateMatches = Regex.Matches(aiRawValue, "\"(?<cell>[A-Za-z]+[0-9]+)\"\\s*:\\s*\\{[^}]*\\}", 
                    RegexOptions.IgnoreCase | RegexOptions.Singleline);

                if (cellUpdateMatches.Count > 0)
                {
                    htmlResponse = await ProcessCellUpdatesAsync(cellUpdateMatches);
                }

                string rendered = Markdown.ToHtml(aiRawValue);
                if (!string.IsNullOrEmpty(htmlResponse))
                {
                    rendered += htmlResponse;
                }
                response = rendered;
            }

            await UpdateAssistViewResponseAsync(args, response);
        }

        /// <summary>
        /// Handles toolbar item clicks in the AssistView.
        /// </summary>
        /// <param name="args">Event arguments containing the clicked item details.</param>
        private Task OnToolbarItemClickedAsync(AssistViewToolbarItemClickedEventArgs args)
        {
            if ((args.Item?.IconCss ?? string.Empty).Contains("e-close", StringComparison.OrdinalIgnoreCase))
            {
                _isAssistVisible = false;
            }
            return Task.CompletedTask;
        }
        #endregion

        #region AI Button Click Event Handlers
        /// <summary>
        /// Analyzes the full sheet data and displays an AI-generated summary.
        /// </summary>
        private async Task OnFullSheetAnalysisAsync()
        {
            ExtractUsedRange();

            if (_spreadsheetInstance is null)
            {
                return;
            }

            var cellData = _spreadsheetInstance.GetData(_usedRange);
            _jsonOutput = SerializeCellData(cellData);

            string prompt = $"Analyze the full data in this data. {_jsonOutput}";

            await PrepareAssistViewAsync();

            string result = await OpenAIService.GetCompletionAsync(prompt, false);
            if (!string.IsNullOrEmpty(result))
            {
                string response = Markdown.ToHtml(result);
                await DisplayResponseAsync(response);
            }
        }
        #endregion

        #region Helper Methods - Cell Processing
        /// <summary>
        /// Processes cell updates from AI response matches.
        /// </summary>
        /// <param name="cellUpdateMatches">Regex matches containing cell update information.</param>
        /// <returns>HTML response string with update notes.</returns>
        private async Task<string> ProcessCellUpdatesAsync(MatchCollection cellUpdateMatches)
        {
            var htmlResponse = string.Empty;

            foreach (Match cellMatch in cellUpdateMatches)
            {
                var cellAddress = cellMatch.Groups["cell"].Value;
                var cellPayload = cellMatch.Value;

                string? newCellValue = ExtractCellValue(cellPayload);

                if (!string.IsNullOrEmpty(newCellValue))
                {
                   string sheetName =  _spreadsheetInstance!.GetActiveWorksheet().Name;
                    await _spreadsheetInstance!.UpdateCellAsync($"{sheetName}!{cellAddress}", newCellValue);
                    htmlResponse += $"<div class=\"ai-note\">Updated {cellAddress}.</div>";
                }

                var styleFormat = ExtractAndBuildCellStyle(cellPayload);
                if (styleFormat != null)
                {
                    await _spreadsheetInstance!.CellFormatAsync(styleFormat, cellAddress);
                    htmlResponse += $"<div class=\"ai-note\">Applied style to {cellAddress}.</div>";
                }
            }

            return htmlResponse;
        }

        /// <summary>
        /// Extracts cell value from cell payload.
        /// </summary>
        /// <param name="cellPayload">The cell payload string.</param>
        /// <returns>The extracted cell value or null.</returns>
        private string? ExtractCellValue(string cellPayload)
        {
            var formulaMatch = Regex.Match(cellPayload, "\"formula\"\\s*:\\s*\"(?<formula>[^\"]*)\"", RegexOptions.IgnoreCase);
            if (formulaMatch.Success)
            {
                return formulaMatch.Groups["formula"].Value;
            }

            var valueMatch = Regex.Match(cellPayload, "\"value\"\\s*:\\s*(?<val>null|\"[^\"]*\")", RegexOptions.IgnoreCase);
            if (valueMatch.Success)
            {
                var raw = valueMatch.Groups["val"].Value?.Trim();
                if (!string.Equals(raw, "null", StringComparison.OrdinalIgnoreCase) && !string.IsNullOrEmpty(raw))
                {
                    if (raw.StartsWith("\"") && raw.EndsWith("\"") && raw.Length >= 2)
                    {
                        return raw.Substring(1, raw.Length - 2);
                    }
                    return raw;
                }
            }

            return null;
        }

        /// <summary>
        /// Extracts and builds cell style from cell payload.
        /// </summary>
        /// <param name="cellPayload">The cell payload string.</param>
        /// <returns>CellFormat object or null.</returns>
        private CellFormat? ExtractAndBuildCellStyle(string cellPayload)
        {
            var styleObjectMatch = Regex.Match(cellPayload ?? string.Empty, 
                "\"style\"\\s*:\\s*\\{(?<props>[\\s\\S]*?)\\}", RegexOptions.IgnoreCase);
            
            if (styleObjectMatch.Success)
            {
                var styleProps = styleObjectMatch.Groups["props"].Value;
                return BuildCellFormatFromAi(styleProps);
            }

            return null;
        }
        #endregion

        #region Helper Methods - Style Building
        /// <summary>
        /// Builds a CellFormat object from AI-generated style properties.
        /// </summary>
        /// <param name="styleProperties">The style properties string.</param>
        /// <returns>CellFormat object or null if no styles detected.</returns>
        private CellFormat? BuildCellFormatFromAi(string styleProperties)
        {
            if (string.IsNullOrWhiteSpace(styleProperties))
            {
                return null;
            }

            var format = new CellFormat();
            var hasAnyStyle = false;

            hasAnyStyle |= ApplyBackgroundColor(format, styleProperties);
            hasAnyStyle |= ApplyFontColor(format, styleProperties);
            hasAnyStyle |= ApplyFontSize(format, styleProperties);
            hasAnyStyle |= ApplyFontFamily(format, styleProperties);
            hasAnyStyle |= ApplyFontStyles(format, styleProperties);
            hasAnyStyle |= ApplyTextAlignment(format, styleProperties);
            hasAnyStyle |= ApplyVerticalAlignment(format, styleProperties);

            return hasAnyStyle ? format : null;
        }

        /// <summary>
        /// Applies background color to the cell format.
        /// </summary>
        private bool ApplyBackgroundColor(CellFormat format, string styleProperties)
        {
            var backgroundMatch = Regex.Match(styleProperties, "\"backgroundColor\"\\s*:\\s*\"(?<c>[^\"]+)\"", RegexOptions.IgnoreCase);
            if (!backgroundMatch.Success)
            {
                backgroundMatch = Regex.Match(styleProperties, "background(?:\\s*color)?\\s*(?:to|:)?\\s*(?<c>#?[A-Za-z0-9]+)", RegexOptions.IgnoreCase);
            }
            
            if (backgroundMatch.Success)
            {
                format.BackgroundColor = ConvertToHexColor(backgroundMatch.Groups["c"].Value);
                return true;
            }
            return false;
        }

        /// <summary>
        /// Applies font color to the cell format.
        /// </summary>
        private bool ApplyFontColor(CellFormat format, string styleProperties)
        {
            var fontColorMatch = Regex.Match(styleProperties, "\"color\"\\s*:\\s*\"(?<c>[^\"]+)\"", RegexOptions.IgnoreCase);
            if (!fontColorMatch.Success)
            {
                fontColorMatch = Regex.Match(styleProperties, "font\\s*color\\s*(?:to|:)?\\s*(?<c>#?[A-Za-z0-9]+)", RegexOptions.IgnoreCase);
            }
            
            if (fontColorMatch.Success)
            {
                format.Color = ConvertToHexColor(fontColorMatch.Groups["c"].Value);
                return true;
            }
            return false;
        }

        /// <summary>
        /// Applies font size to the cell format.
        /// </summary>
        private bool ApplyFontSize(CellFormat format, string styleProperties)
        {
            var fontSizeMatch = Regex.Match(styleProperties, "\"fontSize\"\\s*:\\s*\"?(?<s>\\d+)(?<u>pt|px)?\"?", RegexOptions.IgnoreCase);
            if (!fontSizeMatch.Success)
            {
                fontSizeMatch = Regex.Match(styleProperties, "font\\s*size\\s*(?:to|is)?\\s*:?\\s*(?<s>\\d+)(?<u>pt|px)?", RegexOptions.IgnoreCase);
            }
            
            if (fontSizeMatch.Success)
            {
                var size = fontSizeMatch.Groups["s"].Value;
                var unit = fontSizeMatch.Groups["u"].Success ? fontSizeMatch.Groups["u"].Value : "pt";
                format.FontSize = size + unit;
                return true;
            }
            return false;
        }

        /// <summary>
        /// Applies font family to the cell format.
        /// </summary>
        private bool ApplyFontFamily(CellFormat format, string styleProperties)
        {
            var fontFamilyMatch = Regex.Match(styleProperties, "\"fontFamily\"\\s*:\\s*\"(?<f>[^\"]+)\"", RegexOptions.IgnoreCase);
            if (!fontFamilyMatch.Success)
            {
                fontFamilyMatch = Regex.Match(styleProperties, "font\\s*family\\s*(?:to|:)?\\s*(?<f>[A-Za-z]+)", RegexOptions.IgnoreCase);
            }
            
            if (fontFamilyMatch.Success)
            {
                var family = fontFamilyMatch.Groups["f"].Value;
                if (Enum.TryParse<FontFamily>(family, true, out var parsedFamily))
                {
                    format.FontFamily = parsedFamily;
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// Applies font styles (bold, italic, underline) to the cell format.
        /// </summary>
        private bool ApplyFontStyles(CellFormat format, string styleProperties)
        {
            var hasStyle = false;

            if (Regex.IsMatch(styleProperties, "\"bold\"\\s*:\\s*true|\\bbold\\b", RegexOptions.IgnoreCase))
            {
                format.FontWeight = FontWeight.Bold;
                hasStyle = true;
            }
            
            if (Regex.IsMatch(styleProperties, "\"italic\"\\s*:\\s*true|\\bitalic\\b", RegexOptions.IgnoreCase))
            {
                format.FontStyle = FontStyle.Italic;
                hasStyle = true;
            }
            
            if (Regex.IsMatch(styleProperties, "\"underline\"\\s*:\\s*true|\\bunderline\\b", RegexOptions.IgnoreCase))
            {
                format.TextDecoration = TextDecoration.Underline;
                hasStyle = true;
            }

            return hasStyle;
        }

        /// <summary>
        /// Applies text alignment to the cell format.
        /// </summary>
        private bool ApplyTextAlignment(CellFormat format, string styleProperties)
        {
            var textAlignMatch = Regex.Match(styleProperties, "text\\s*align\\s*(?:to|:)?\\s*(?<a>center|left|right)", RegexOptions.IgnoreCase);
            if (textAlignMatch.Success && Enum.TryParse<TextAlign>(textAlignMatch.Groups["a"].Value, true, out var parsedAlign))
            {
                format.TextAlign = parsedAlign;
                return true;
            }
            return false;
        }

        /// <summary>
        /// Applies vertical alignment to the cell format.
        /// </summary>
        private bool ApplyVerticalAlignment(CellFormat format, string styleProperties)
        {
            var verticalAlignMatch = Regex.Match(styleProperties, "vertical\\s*align\\s*(?:to|:)?\\s*(?<v>middle|top|bottom)", RegexOptions.IgnoreCase);
            if (verticalAlignMatch.Success)
            {
                var v = verticalAlignMatch.Groups["v"].Value;
                if (v.Equals("middle", StringComparison.OrdinalIgnoreCase))
                {
                    v = "Middle";
                }
                
                if (Enum.TryParse<VerticalAlign>(v, true, out var parsedVAlign))
                {
                    format.VerticalAlign = parsedVAlign;
                    return true;
                }
            }
            return false;
        }

        /// <summary>
        /// Converts color names to hex color codes.
        /// </summary>
        /// <param name="value">The color name or hex value.</param>
        /// <returns>Hex color code.</returns>
        private string ConvertToHexColor(string? value)
        {
            var normalizedValue = (value ?? string.Empty).Trim().Trim('"').Trim();
            if (string.IsNullOrEmpty(normalizedValue))
            {
                return normalizedValue;
            }
            
            if (normalizedValue.StartsWith("#"))
            {
                return normalizedValue;
            }

            var colorMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                {"red", "#FF0000"},
                {"blue", "#2196F3"},
                {"yellow", "#FFEB3B"},
                {"white", "#FFFFFF"},
                {"black", "#000000"},
                {"green", "#4CAF50"},
                {"gray", "#4B5366"},
                {"grey", "#4B5366"}
            };

            return colorMap.TryGetValue(normalizedValue, out var hex) ? hex : normalizedValue;
        }
        #endregion

        #region Helper Methods - UI State
        /// <summary>
        /// Shows the loading state in the AssistView.
        /// </summary>
        private async Task ShowLoadingStateAsync()
        {
            await InvokeAsync(() =>
            {
                _isLoading = true;
                StateHasChanged();
            });
        }

        /// <summary>
        /// Prepares the AssistView for displaying results.
        /// </summary>
        private async Task PrepareAssistViewAsync()
        {
            if (_isAssistVisible)
            {
                _isAssistVisible = false;
                await Task.Delay(150);
            }
            
            _isAssistVisible = true;
            _isLoading = true;
            await InvokeAsync(StateHasChanged);
        }

        /// <summary>
        /// Displays the AI response in the AssistView.
        /// </summary>
        /// <param name="response">The response HTML to display.</param>
        private async Task DisplayResponseAsync(string response)
        {
            _isLoading = false;
            if (_assistView is not null)
            {
                await _assistView.UpdateResponseAsync(response);
            }
            await InvokeAsync(StateHasChanged);
        }

        /// <summary>
        /// Updates the AssistView with the AI response.
        /// </summary>
        /// <param name="args">Event arguments to update.</param>
        /// <param name="response">The response to display.</param>
        private async Task UpdateAssistViewResponseAsync(AssistViewPromptRequestedEventArgs args, string response)
        {
            await InvokeAsync(async () =>
            {
                _isLoading = false;
                args.Response = response;
                if (_assistView is not null)
                {
                    await _assistView.UpdateResponseAsync(response);
                }
                StateHasChanged();
            });
        }
        #endregion

        #region Helper Methods - Data Processing
        /// <summary>
        /// Extracts the used range from the active worksheet.
        /// </summary>
        private void ExtractUsedRange()
        {
            var workBookProperty = typeof(SfSpreadsheet).GetProperty("WorkBook", BindingFlags.NonPublic | BindingFlags.Instance);
            int sheetIndex = _spreadsheetInstance!.GetActiveWorksheet().Index;
            
            if (workBookProperty?.GetValue(_spreadsheetInstance) is IWorkbook workbook)
            {
                var worksheet = workbook.Worksheets[sheetIndex];
                _usedRange = worksheet.UsedRange.AddressLocal;
            }
        }

        /// <summary>
        /// Serializes cell data to JSON format.
        /// </summary>
        /// <param name="cellData">The cell data to serialize.</param>
        /// <returns>JSON string representation of the cell data.</returns>
        private string SerializeCellData(object cellData)
        {
            return System.Text.Json.JsonSerializer.Serialize(cellData, new System.Text.Json.JsonSerializerOptions { WriteIndented = true })
                .Replace("```json", string.Empty)
                .Replace("```", string.Empty)
                .Trim();
        }
        #endregion
    }
}
