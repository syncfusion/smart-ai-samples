using Newtonsoft.Json;
using Syncfusion.Blazor.Grids;

namespace SyncfusionAISamples.Components.Pages.DataGrid
{
    public partial class PredictiveDataEntry
    {
        public SfGrid<Predictivedata> gridObj;
        private string CustomerPrompt { get; set; }
        private bool VisibleProperty { get; set; }
        private bool Visible { get; set; }
        private static bool isDataSourceChanged { get; set; }
        public static List<Predictivedata> GridSource = new List<Predictivedata>();
        public static List<Predictivedata> generatedData = new List<Predictivedata>();

        protected override void OnInitialized()
        {
            GridSource = isDataSourceChanged ? generatedData : Predictivedata.GetAllRecords();
        }

        public void CustomizeCell(QueryCellInfoEventArgs<Predictivedata> args)
        {

            if (args.Column.Field == "FinalYearGPA" || args.Column.Field == "TotalGPA")
            {
                if (args.Data.FinalYearGPA > 0)
                {
                    args.Cell.AddClass(new string[] { "e-PredictiveColumn" });
                }
                else if (args.Data.TotalGPA > 0)
                {
                    args.Cell.AddClass(new string[] { "e-PredictiveColumn" });
                }
            }
            if (args.Column.Field == "TotalGrade")
            {
                if (args.Data.TotalGPA <= 2.5)
                {
                    args.Cell.AddClass(new string[] { "e-inactivecolor" });
                }
                else if (args.Data.TotalGPA >= 4.5)
                {
                    args.Cell.AddClass(new string[] { "e-activecolor" });
                }
                else if (args.Data.TotalGPA > 0)
                {
                    args.Cell.AddClass(new string[] { "e-PredictiveColumn" });
                }
            }
        }

        public async Task ToolbarClickHandler(Syncfusion.Blazor.Navigations.ClickEventArgs args)
        {
            this.Visible = true;
            CustomerPrompt = "Update the following columns: FinalYearGPA based on FirstYearGPA, SecondYearGPA, and ThirdYearGPA; TotalGPA as the average of all years' GPA; TotalGrade based on TotalGPA with the following scale: 0-2.5 = F, 2.6-2.9 = C, 3.0-3.4 = B, 3.5-3.9 = B+, 4.0-4.4 = A, 4.5-5 = A+. Ensure the average value decimal does not exceed 1 digit.";
            ExecutePrompt();
        }

        public void CustomizeHeaderCell(HeaderCellInfoEventArgs args)
        {
            args.Cell.AddClass(new string[] { "e-studentcolumn" });
        }

        private async void ExecutePrompt()
        {
            string prompt = CustomerPrompt;
            if (!string.IsNullOrEmpty(prompt))
            {
                GridReport gridReport = new GridReport()
                {
                    DataSource = GridSource,
                };
                var gridReportJson = GetSerializedGridReport(gridReport);
                string userInput = ValidateAndGeneratePrompt(gridReportJson, prompt);
                if (userInput != null)
                {
                    var result = await OpenAIService.GetCompletionAsync(userInput);
                    this.Visible = false;
                    this.VisibleProperty = true;
                    await Task.Delay(1000);
                    if (result != null)
                    {
                        GridReport deserializeResult = new GridReport();
                        try
                        {
                            result = result.Replace("```json", "").Replace("```", "").Trim();
                            deserializeResult = DeserializeResult(result);
                            generatedData = deserializeResult.DataSource;
                            for (var i = 0; i < generatedData.Count; i++)
                            {
                                var data = generatedData[i];
                                await gridObj.SetCellValueAsync(data.StudentID, "TotalGrade", data.TotalGrade);
                                await gridObj.SetCellValueAsync(data.StudentID, "FinalYearGPA", data.FinalYearGPA);
                                await gridObj.SetCellValueAsync(data.StudentID, "TotalGPA", data.TotalGPA);
                                await Task.Delay(300);
                            }
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }
                    }
                }
            }
        }

        private static string ValidateAndGeneratePrompt(string data, string userInput)
        {
            if (string.IsNullOrEmpty(userInput))
            {
                return null;
            }
            string prompt = $"Given the datasource in the Grid table: {data}, Return the newly prepared datasource based on following user query: {userInput}\n\n Return the updated datasource in JSON format only. Do not include any additional text or information.";
            return prompt;
        }

        private string GetSerializedGridReport(GridReport report)
        {
            return JsonConvert.SerializeObject(report);
        }

        private GridReport DeserializeResult(string result)
        {
            return JsonConvert.DeserializeObject<GridReport>(result);
        }

        public class GridReport
        {
            public List<Predictivedata> DataSource { get; set; }
        }

        public class Predictivedata
        {

            public Predictivedata() { }
            public Predictivedata(int StudentID, string StudentName, double FirstYearGPA, double SecondYearGPA, double ThirdYearGPA)
            {
                this.StudentID = StudentID;
                this.StudentName = StudentName;
                this.FirstYearGPA = FirstYearGPA;
                this.SecondYearGPA = SecondYearGPA;
                this.ThirdYearGPA = ThirdYearGPA;
            }

            public int StudentID { get; set; }
            public string StudentName { get; set; }
            public double FirstYearGPA { get; set; }
            public double SecondYearGPA { get; set; }
            public double ThirdYearGPA { get; set; }
            public double? FinalYearGPA { get; set; }
            public double? TotalGPA { get; set; }
            public string TotalGrade { get; set; }
            public static List<Predictivedata> GetAllRecords()
            {
                List<Predictivedata> category = new List<Predictivedata>();
                category.Add(new Predictivedata(512001, "John Smith", 4.7, 4.1, 5.0));
                category.Add(new Predictivedata(512002, "Emily Davis", 3.3, 3.5, 3.7));
                category.Add(new Predictivedata(512003, "Micheal Lee", 3.9, 3.8, 3.9));
                category.Add(new Predictivedata(512004, "Sarah Brown", 2.0, 2.7, 2.5));
                category.Add(new Predictivedata(512005, "James Wilson", 3.0, 3.5, 3.2));
                category.Add(new Predictivedata(512006, "Sarah Jane", 3.7, 3.0, 4.3));
                category.Add(new Predictivedata(512007, "Emily Rose", 5.0, 4.9, 4.8));
                category.Add(new Predictivedata(512008, "John Michael", 4.0, 4.1, 4.2));
                category.Add(new Predictivedata(512009, "David James", 1.5, 2.2, 2.3));
                category.Add(new Predictivedata(512010, "Mary Ann", 2.7, 2.1, 3.0));

                return category;
            }

        }
    }
}
