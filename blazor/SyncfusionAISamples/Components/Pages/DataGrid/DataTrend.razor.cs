using Newtonsoft.Json;
using Syncfusion.Blazor.Data;
using Syncfusion.Blazor.DropDowns;
using Syncfusion.Blazor.Grids;

namespace SyncfusionAISamples.Components.Pages.DataGrid
{
    public partial class DataTrend
    {
        SfGrid<MonthlyData> Grid { get; set; }
        private List<MonthlyData> OverallData { get; set; }
        private List<MonthlyData> GeneratedTrendData { get; set; }
        private List<MonthlyData> GeneratePredictiveData { get; set; }
        private bool trendColumnVisibility { get; set; }
        private bool spinnerVisibility { get; set; }
        public Query query = new Query();
        private string SelectedYear { get; set; }
        private string dropdownInitialValue { get; set; } = "Year2024";
        private string[] months2024 { get; set; } = { "July 2024", "August 2024", "September 2024", "October 2024", "November 2024", "December 2024" };
        private string predictiveDescription { get; set; }
        private List<Years> years { get; set; }
        private Dictionary<string, Boolean> trendCalculatedYear { get; set; } = new Dictionary<string, Boolean>();

        private void ValueSelectHandler(SelectEventArgs<Years> args)
        {
            if (args.ItemData != null)
            {
                SelectedYear = args.ItemData.Year;
                if (SelectedYear.Equals("2022") || SelectedYear.Equals("2023"))
                {
                    query = new Query().Where("Month", "contains", args.ItemData.Year);
                    CalculateTrendAnalysis();
                }
                else if (SelectedYear.Equals("2024"))
                {
                    query = new Query().Where("Month", "contains", args.ItemData.Year);
                    CalculatePredictiveData();
                    CalculateTrendAnalysis();
                }
                else
                {
                    query = new Query();
                }
            }
        }

        private async void CalculateTrendAnalysis()
        {
            if (trendCalculatedYear.Count > 0 && trendCalculatedYear.ContainsKey(SelectedYear))
            {
                return;
            }

            spinnerVisibility = true;
            var gridJsonData = GetSerializedGridReport(!string.IsNullOrEmpty(SelectedYear) ? OverallData.Where(e => e.Month.Contains(SelectedYear)).ToList() : OverallData);
            string prompt = GeneratePrompt(gridJsonData);
            trendCalculatedYear.TryAdd(SelectedYear, true);
            var result = await OpenAIService.GetCompletionAsync(prompt);
            if (result != null)
            {
                result = result.Replace("```json", "").Replace("```", "").Trim();
                GeneratedTrendData = DeserializeResult(result);
                spinnerVisibility = false;
                if (GeneratedTrendData.Count > 0)
                {
                    foreach (var data in GeneratedTrendData)
                    {
                        await Grid.SetCellValueAsync(data.Month, "TrendColumn", data.TrendColumn);
                    }
                }
            }
        }

        private void CustomizeCell(QueryCellInfoEventArgs<MonthlyData> args)
        {
            if (GeneratedTrendData != null && GeneratedTrendData.Count > 0 && args.Data.TrendColumn != null && args.Data.TrendColumn.Contains(args.Column.Field))
            {
                if (args.Data.TrendColumn.Contains("Low"))
                {
                    args.Cell.AddClass(new string[] { "low-values" });
                }
                else
                {
                    args.Cell.AddClass(new string[] { "high-values" });
                }
            }

            if (GeneratePredictiveData != null && GeneratePredictiveData.Count > 0 && months2024.Where(e => e.Contains(args.Data.Month)).Any())
            {
                args.Cell.AddClass(new string[] { "predicted-rows" });
            }
        }

        private async void CalculatePredictiveData()
        {
            if (GeneratePredictiveData != null && GeneratePredictiveData.Count > 0)
            {
                return;
            }
            predictiveDescription = "Predicting the future data based on the provided historical data...";
            spinnerVisibility = true;
            var gridReportJson = GetSerializedGridReport(OverallData);
            string prompt = GeneratePredictivePrompt(gridReportJson);
            var result = await OpenAIService.GetCompletionAsync(prompt);
            if (result != null)
            {
                result = result.Replace("```json", "").Replace("```", "").Trim();
                GeneratePredictiveData = DeserializeResult(result);
                predictiveDescription = string.Empty;
                spinnerVisibility = false;
                if (GeneratePredictiveData.Count > 0)
                {
                    int rowIndex = 30;
                    foreach (var data in GeneratePredictiveData)
                    {
                        MonthlyData newRecord = new MonthlyData()
                        {
                            Month = data.Month,
                            Sales = data.Sales,
                            MarketingSpend = data.MarketingSpend,
                            NewCustomers = data.NewCustomers,
                            ReturningCustomers = data.ReturningCustomers
                        };
                        await Grid.AddRecordAsync(newRecord, rowIndex);
                        rowIndex += 1;
                    }
                }
            }
        }

        private void GridRendered(object args)
        {
            SelectedYear = "2024";
            CalculateTrendAnalysis();
            CalculatePredictiveData();
        }

        private static string GeneratePrompt(string data)
        {
            return $"Given the following data source bounded in the Grid table\n\n{data}.\n I want you to act as a Trend Analyzer for the given data. Observe the data and perform a trend analysis for the columns Sales and MarketingSpend. For each column, update the corresponding column field name in the TrendColumn with the trend analyzed as High or Low based on the analysis result. Example: MarketingSpend-High.  Note: Include only the first 2 highest values and the 2 lowest values.\n\nGenerate the output in JSON format only and do not include any additional information or contents in the response.";
        }

        private static string GeneratePredictivePrompt(string data)
        {
            return $"Given the following datasource are bounded in the Grid table\n\n{data}.\n I want you to Predict the future data by analyzing the historical report of the previous years. Predict the future sales for the next 6 months based on the given data. For Example: I have binded the Monthly reports for the past two years and first 6 months of this year by analyzing this historical data, i want you to predict my future monthly data for the upcoming 6 months for the year 2024. The generated data should be returned in the same format as i have binded in this prompt, do not add any additional content. \n\nGenerate an output in JSON format only and Should not include any additional information or contents in response";
        }

        private string GetSerializedGridReport(List<MonthlyData> report)
        {
            return JsonConvert.SerializeObject(report);
        }

        private List<MonthlyData> DeserializeResult(string result)
        {
            return JsonConvert.DeserializeObject<List<MonthlyData>>(result);
        }

        protected override void OnInitialized()
        {
            OverallData = new List<MonthlyData>
        {
            new MonthlyData { Month = "January 2022", Sales = 51000, MarketingSpend = 9000, NewCustomers = 180, ReturningCustomers = 155 },
            new MonthlyData { Month = "February 2022", Sales = 46000, MarketingSpend = 9200, NewCustomers = 190, ReturningCustomers = 160 },
            new MonthlyData { Month = "March 2022", Sales = 45000, MarketingSpend = 9400, NewCustomers = 200, ReturningCustomers = 155 },
            new MonthlyData { Month = "April 2022", Sales = 48000, MarketingSpend = 9600, NewCustomers = 210, ReturningCustomers = 165 },
            new MonthlyData { Month = "May 2022", Sales = 49000, MarketingSpend = 9800, NewCustomers = 220, ReturningCustomers = 170 },
            new MonthlyData { Month = "June 2022", Sales = 52000, MarketingSpend = 9600, NewCustomers = 210, ReturningCustomers = 160 },
            new MonthlyData { Month = "July 2022", Sales = 48000, MarketingSpend = 9700, NewCustomers = 215, ReturningCustomers = 170 },
            new MonthlyData { Month = "August 2022", Sales = 50000, MarketingSpend = 9800, NewCustomers = 225, ReturningCustomers = 180 },
            new MonthlyData { Month = "September 2022", Sales = 45000, MarketingSpend = 9700, NewCustomers = 220, ReturningCustomers = 175 },
            new MonthlyData { Month = "October 2022", Sales = 46000, MarketingSpend = 10000, NewCustomers = 230, ReturningCustomers = 190 },
            new MonthlyData { Month = "November 2022", Sales = 50000, MarketingSpend = 9900, NewCustomers = 225, ReturningCustomers = 185 },
            new MonthlyData { Month = "December 2022", Sales = 47000, MarketingSpend = 10200, NewCustomers = 240, ReturningCustomers = 200 },

            new MonthlyData { Month = "January 2023", Sales = 50000, MarketingSpend = 9200, NewCustomers = 190, ReturningCustomers = 160 },
            new MonthlyData { Month = "February 2023", Sales = 48000, MarketingSpend = 9400, NewCustomers = 200, ReturningCustomers = 170 },
            new MonthlyData { Month = "March 2023", Sales = 47000, MarketingSpend = 9600, NewCustomers = 210, ReturningCustomers = 165 },
            new MonthlyData { Month = "April 2023", Sales = 49000, MarketingSpend = 9800, NewCustomers = 220, ReturningCustomers = 175 },
            new MonthlyData { Month = "May 2023", Sales = 52000, MarketingSpend = 10000, NewCustomers = 230, ReturningCustomers = 180 },
            new MonthlyData { Month = "June 2023", Sales = 53000, MarketingSpend = 9600, NewCustomers = 215, ReturningCustomers = 170 },
            new MonthlyData { Month = "July 2023", Sales = 49000, MarketingSpend = 9800, NewCustomers = 225, ReturningCustomers = 175 },
            new MonthlyData { Month = "August 2023", Sales = 51000, MarketingSpend = 10000, NewCustomers = 235, ReturningCustomers = 190 },
            new MonthlyData { Month = "September 2023", Sales = 46000, MarketingSpend = 9900, NewCustomers = 230, ReturningCustomers = 185 },
            new MonthlyData { Month = "October 2023", Sales = 50500, MarketingSpend = 10200, NewCustomers = 240, ReturningCustomers = 200 },
            new MonthlyData { Month = "November 2023", Sales = 51000, MarketingSpend = 10100, NewCustomers = 235, ReturningCustomers = 195 },
            new MonthlyData { Month = "December 2023", Sales = 48000, MarketingSpend = 10400, NewCustomers = 250, ReturningCustomers = 210 },

            new MonthlyData { Month = "January 2024", Sales = 55000, MarketingSpend = 10000, NewCustomers = 200, ReturningCustomers = 180 },
            new MonthlyData { Month = "February 2024", Sales = 52000, MarketingSpend = 10500, NewCustomers = 220, ReturningCustomers = 190 },
            new MonthlyData { Month = "March 2024", Sales = 48000, MarketingSpend = 9500, NewCustomers = 210, ReturningCustomers = 170 },
            new MonthlyData { Month = "April 2024", Sales = 53000, MarketingSpend = 11000, NewCustomers = 230, ReturningCustomers = 200 },
            new MonthlyData { Month = "May 2024", Sales = 50000, MarketingSpend = 11500, NewCustomers = 240, ReturningCustomers = 210 },
            new MonthlyData { Month = "June 2024", Sales = 54000, MarketingSpend = 10800, NewCustomers = 235, ReturningCustomers = 205}
        };
            query = new Query().Where("Month", "contains", "2024");

            years = new List<Years>()
        {
            new Years(){ Year = "2022", ID="Year2022" },
            new Years(){ Year = "2023", ID="Year2023" },
            new Years(){ Year = "2024", ID="Year2024" },
        };
        }

        public class Years
        {
            public string ID { get; set; }
            public string Year { get; set; }
        }

        public class MonthlyData
        {
            public string Month { get; set; }
            public int Sales { get; set; }
            public int MarketingSpend { get; set; }
            public int NewCustomers { get; set; }
            public int ReturningCustomers { get; set; }
            public string TrendColumn { get; set; }
        }
    }
}
