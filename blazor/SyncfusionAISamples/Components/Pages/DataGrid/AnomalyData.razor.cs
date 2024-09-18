using Newtonsoft.Json;
using Syncfusion.Blazor.Grids;

namespace SyncfusionAISamples.Components.Pages.DataGrid
{
    public partial class AnomalyData
    {
        SfGrid<MachineData> Grid { get; set; }
        private List<MachineData> machineDataList = new List<MachineData>();
        private List<MachineData> AIgeneratedData = new List<MachineData>();
        private bool anomalyColumnVisibility { get; set; }
        private bool spinnerVisibility { get; set; }

        public void CustomizeCell(QueryCellInfoEventArgs<MachineData> args)
        {
            if (AIgeneratedData != null && AIgeneratedData.Count > 0)
            {
                if (AIgeneratedData.Where(e => (!string.IsNullOrEmpty(e.AnomalyFieldName)) && (e.AnomalyFieldName.Equals(args.Column.Field, StringComparison.Ordinal) && e.MachineID.Equals(args.Data.MachineID))).Any())
                {
                    args.Cell.AddClass(new string[] { "anomaly-cell" });
                }
                else if (args.Column.Field.Equals("AnomalyDescription", StringComparison.Ordinal))
                {
                    string defaultDescription = machineDataList[0].AnomalyDescription;
                    string anomalyDescription = args.Data.AnomalyDescription;
                    if (defaultDescription.Equals(anomalyDescription, StringComparison.Ordinal))
                    {
                        args.Cell.AddClass(new string[] { "normal-cell" });
                    }
                    else
                    {
                        args.Cell.AddClass(new string[] { "anomaly-cell" });
                    }
                }
            }
        }

        public async Task ToolbarClickHandler(Syncfusion.Blazor.Navigations.ClickEventArgs args)
        {
            if (args.Item.Id == "Anomaly")
            {
                DetectAnomalyData();
            }
        }

        private async void DetectAnomalyData()
        {
            spinnerVisibility = true;
            GridReport gridReport = new GridReport()
            {
                DataSource = machineDataList,
            };
            var gridReportJson = GetSerializedGridReport(gridReport);
            string userInput = ValidateAndGeneratePrompt(gridReportJson);
            var result = await OpenAIService.GetCompletionAsync(userInput);
            if (result != null)
            {
                GridReport deserializeResult = new GridReport();
                try
                {
                    result = result.Replace("```json", "").Replace("```", "").Trim();
                    deserializeResult = DeserializeResult(result);
                    AIgeneratedData = deserializeResult.DataSource;
                    spinnerVisibility = false;
                    anomalyColumnVisibility = true;
                    if (AIgeneratedData != null && AIgeneratedData.Count > 0)
                    {
                        foreach (var data in AIgeneratedData)
                        {
                            await Grid.SetCellValueAsync(data.MachineID, "AnomalyDescription", data.AnomalyDescription);
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }

        private static string ValidateAndGeneratePrompt(string data)
        {
            return $"Given the following datasource are bounded in the Grid table\n\n{data}.\n Return the anomaly data rows (ie. pick the ir-relevant datas mentioned in the corresponding table) present in the table mentioned above as like in the same format provided do not change the format. Example: Watch out the production rate count and the factors that is used to acheive the mentioned production rate(Temprature, Pressure, Motor Speed) If the production rate is not relevant to the concern factors mark it as anomaly Data. If it is anomaly data then due to which column data it is marked as anomaly that particular column name should be updated in the AnomalyFieldName. Also Update the AnomalyDescription stating that due to which reason it is marked as anomaly a short description. Example if the data is marked as anomaly due to the Temperature column, Since the mentioned temperature is too high than expected, it is marked as anomaly data.\n\nGenerate an output in JSON format only and Should not include any additional information or contents in response";
        }

        private string GetSerializedGridReport(GridReport report)
        {
            return JsonConvert.SerializeObject(report);
        }

        private GridReport DeserializeResult(string result)
        {
            return JsonConvert.DeserializeObject<GridReport>(result);
        }

        protected override void OnInitialized()
        {
            string description = "The factors that supporting the Production rate is relevant to the count produced, hence the row data is marked as normal data.";
            machineDataList = new List<MachineData>
        {
            new MachineData
            {
                MachineID = "M001",
                Temperature = 85,
                Pressure = 120,
                Voltage = 220,
                MotorSpeed = 1500,
                ProductionRate = 100,
                AnomalyDescription = description,
            },
            new MachineData
            {
                MachineID = "M002",
                Temperature = 788,
                Pressure = 115,
                Voltage = 230,
                MotorSpeed = 1520,
                ProductionRate = 105,
                AnomalyDescription = description,
            },
            new MachineData
            {
                MachineID = "M003",
                Temperature = 90,
                Pressure = 118,
                Voltage = 225,
                MotorSpeed = 1480,
                ProductionRate = 95,
                AnomalyDescription = description,
            },
            new MachineData
            {
                MachineID = "M004",
                Temperature = 87,
                Pressure = 122,
                Voltage = 228,
                MotorSpeed = 1515,
                ProductionRate = 110,
                AnomalyDescription = description,
            },
            new MachineData
            {
                MachineID = "M005",
                Temperature = 92,
                Pressure = 116,
                Voltage = 222,
                MotorSpeed = 21475,
                ProductionRate = 980,
                AnomalyDescription = description,
            },
            new MachineData
            {
                MachineID = "M006",
                Temperature = 85,
                Pressure = 119,
                Voltage = 220,
                MotorSpeed = 1490,
                ProductionRate = 102,
                AnomalyDescription = description,
            },
            new MachineData
            {
                MachineID = "M007",
                Temperature = 88,
                Pressure = 114,
                Voltage = 230,
                MotorSpeed = 1500,
                ProductionRate = 104,
                AnomalyDescription = description,
            },
            new MachineData
            {
                MachineID = "M008",
                Temperature = 90,
                Pressure = 1120,
                Voltage = 225,
                MotorSpeed = 1470,
                ProductionRate = 89,
                AnomalyDescription = description,
            },
            new MachineData
            {
                MachineID = "M009",
                Temperature = 87,
                Pressure = 121,
                Voltage = 228,
                MotorSpeed = 1505,
                ProductionRate = 108,
                AnomalyDescription = description,
            },
            new MachineData
            {
                MachineID = "M010",
                Temperature = 92,
                Pressure = 117,
                Voltage = 222,
                MotorSpeed = 1480,
                ProductionRate = 100,
                AnomalyDescription = description,
            },
        };
        }

        public class MachineData
        {
            public string MachineID { get; set; }
            public int Temperature { get; set; }
            public int Pressure { get; set; }
            public int Voltage { get; set; }
            public int MotorSpeed { get; set; }
            public int ProductionRate { get; set; }
            public string AnomalyDescription { get; set; }
            public string AnomalyFieldName { get; set; }
        }

        public class GridReport
        {
            public List<MachineData> DataSource { get; set; }
        }
    }
}
