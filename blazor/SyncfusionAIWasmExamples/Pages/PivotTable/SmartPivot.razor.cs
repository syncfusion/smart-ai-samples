﻿using Microsoft.AspNetCore.Components;
using Newtonsoft.Json;
using Syncfusion.Blazor.Navigations;
using Syncfusion.Blazor.Notifications;
using Syncfusion.Blazor.PivotView;
using Syncfusion.Blazor.Popups;
using Syncfusion.Blazor.Spinner;
using SyncfusionAIWasmExamples.Models;
using System;

namespace SyncfusionAIWasmExamples.Pages.PivotTable
{
    public partial class SmartPivot
    {
        public string[] ChoiceSelected = { "Predictive Analytics & Modeling" };
        private List<string> predictivePoints = new List<string>()
    {
        "FY 2025", "FY 2026", "FY 2027", "FY 2028", "FY 2029"
    };
        private void SelectedChipsChanged(string[] args)
        {
            if (args.Length > 0)
            {
                ChoiceSelected = args;
            }

        }

        public string TextValue { get; set; } = "2025";
        public class Data
        {
            public string Name { get; set; }
            public string ID { get; set; }
        }
        List<Data> InlineYears = new List<Data>
    {
        new Data() { Name = "2025", ID = "1" },
        new Data() { Name = "2026", ID = "2" },
        new Data() { Name = "2027", ID = "3" },
        new Data() { Name = "2028", ID = "4" },
        new Data() { Name = "2029", ID = "5" },
    };

        public string filterText = "Bikes";

        public string[] SelectedGroup { get; set; } = new string[] { "Year", "Product_Categories", "Sold" };
        public class PivotFields
        {
            public string Name { get; set; }
            public string Code { get; set; }
        }
        List<PivotFields> Country = new List<PivotFields>
    {
        new PivotFields() { Name = "Country", Code = "Country" },
        new PivotFields() { Name = "Product_Categories", Code = "Product_Categories" },
        new PivotFields() { Name = "Products", Code = "Products" },
        new PivotFields() { Name = "Year", Code = "Year" },
        new PivotFields() { Name = "Sold", Code = "Sold" },
        new PivotFields() { Name = "Amount", Code = "Amount" }
    };

        public string AggregationValue = "Sum";
        public class AggregateData
        {
            public string Name { get; set; }
            public string ID { get; set; }
        }
        List<AggregateData> AggregationTypes = new List<AggregateData>
    {
        new AggregateData() { Name = "Sum", ID = "Sum" },
        new AggregateData() { Name = "Count", ID = "Count" },
        new AggregateData() { Name = "Product", ID = "Product" },
        new AggregateData() { Name = "Average", ID = "Average" },
        new AggregateData() { Name = "Min", ID = "Min" },
    };

        SfToast ToastObj;
        private string ToastPosition = "Right";
        private string ToastContent = "Server is busy right now, Please try again";
        private SfSpinner spinnerObj;
        private string Description = string.Empty;
        private SfDialog Dialog { get; set; }
        private bool Visibility { get; set; } = false;
        private SfPivotView<PivotProductDetails> pivotRef;
        public List<PivotProductDetails> data { get; set; }
        public List<PivotProductDetails> cloneDataSource { get; set; }
        PivotViewDataSourceSettings<PivotProductDetails> CloneDataSourceSettings { get; set; }

        public class PivotReport
        {
            public List<PivotProductDetails> DataSource { get; set; }
            public List<PivotViewColumn> Columns { get; set; }
            public List<PivotViewRow> Rows { get; set; }
            public List<PivotViewValue> Values { get; set; }
            public List<MemberFilter> MemberFilters { get; set; }
            public List<LabelFilter> LabelFilters { get; set; }
        }

        public class MemberFilter
        {
            public string Name { get; set; }
            public string[] Items { get; set; }
            public Syncfusion.Blazor.PivotView.FilterType Type { get; set; }
        }

        public class LabelFilter
        {
            public string Name { get; set; }
            public string Value1 { get; set; }
            public string Value2 { get; set; }
            public Operators Condition { get; set; }
            public Syncfusion.Blazor.PivotView.FilterType Type { get; set; }
        }

        public List<Syncfusion.Blazor.PivotView.ToolbarItems> toolbar = new List<Syncfusion.Blazor.PivotView.ToolbarItems> {
        Syncfusion.Blazor.PivotView.ToolbarItems.Grid,
        Syncfusion.Blazor.PivotView.ToolbarItems.Export,
        Syncfusion.Blazor.PivotView.ToolbarItems.SubTotal,
        Syncfusion.Blazor.PivotView.ToolbarItems.GrandTotal,
        Syncfusion.Blazor.PivotView.ToolbarItems.ConditionalFormatting,
        Syncfusion.Blazor.PivotView.ToolbarItems.FieldList
    };

        protected override void OnInitialized()
        {
            this.cloneDataSource = PivotProductDetails.GetProductData().ToList();
            this.data = new List<PivotProductDetails>(cloneDataSource);
        }

        public void ToolbarRender(ToolbarArgs args)
        {
            args.CustomToolbar.Add(new ItemModel
            {
                Align = ItemAlign.Left,
                Type = ItemType.Separator
            });
            args.CustomToolbar.Add(new ItemModel
            {
                Text = "AI Assistant",
                TooltipText = "AI Assistant",
                PrefixIcon= "e-icons e-ai-chat e-btn-icon e-icon-left",
                Click = EventCallback.Factory.Create<ClickEventArgs>(this, OpenDialog),
            });
        }

        public async void OpenDialog(ClickEventArgs args)
        {
            await Dialog.ShowAsync();
        }

        private async Task OnBtnClick()
        {
            await Dialog.HideAsync();
            if (ChoiceSelected[0] == "Predictive Analytics & Modeling")
            {
                Description = $"Provide future data points up to the year {TextValue} along with the existing data from the provided data source";
            }
            else if (ChoiceSelected[0] == "Adaptive Filter Suggestions")
            {
                Description = $"Filter the Products field based on {filterText} and return the filtersettings with corresponding items from the Products field and return data source as null.";
            }
            else if (ChoiceSelected[0] == "Intelligent Report Aggregation")
            {
                string selectedFields = string.Empty;
                if (SelectedGroup?.Length > 0)
                {
                    selectedFields = string.Join(",", SelectedGroup.Select(item => item));
                }
                Description = $"Suggest the best way to aggregate and view provided fields({selectedFields}). Use only these fields ({selectedFields}) to frame the rows, columns, and values, ensuring all the provided fields are included in the report. **Ensure that the Type property in the Values section reflects the correct aggregation type as an enum (specifically {AggregationValue}), and this is not returned as a numeric value and return data source as null.";
            }
            if (!string.IsNullOrEmpty(Description))
            {
                await spinnerObj.ShowAsync();
                bool isFilterQuery = Description.IndexOf("filter", StringComparison.OrdinalIgnoreCase) > -1;
                Dictionary<string, object> filters = UpdateFilters();
                PivotReport pivot = new PivotReport()
                {
                    DataSource = data,
                    Columns = pivotRef.DataSourceSettings.Columns,
                    Rows = pivotRef.DataSourceSettings.Rows,
                    Values = pivotRef.DataSourceSettings.Values,
                    MemberFilters = filters["memberFilters"] as List<MemberFilter>,
                    LabelFilters = filters["labelFilters"] as List<LabelFilter>
                };
                var pivotReportJson = GetSerializedPivotReport(pivot);
                string prompt = ValidateAndGeneratePrompt(pivotReportJson, Description, isFilterQuery);
                var result = string.Empty;
                result = await ChatGptService.GetCompletionAsync(prompt);
                if (result != null)
                {
                    try
                    {
#pragma warning disable BL0005
                        PivotReport deserializeResult = new PivotReport();
                        result = result.Replace("```json", "").Replace("```", "").Trim();
                        deserializeResult = DeserializeResult(result);
                        this.data = deserializeResult.DataSource ?? data;
                        pivotRef.DataSourceSettings.Rows = deserializeResult.Rows;
                        pivotRef.DataSourceSettings.Columns = deserializeResult.Columns;
                        pivotRef.DataSourceSettings.Values = deserializeResult.Values;
                        List<PivotViewFilterSetting> filterSettings = UpdateFilterSettings(deserializeResult.MemberFilters, deserializeResult.LabelFilters);
                        pivotRef.DataSourceSettings.FilterSettings = filterSettings.Count > 0 ? filterSettings : pivotRef.DataSourceSettings.FilterSettings;
#pragma warning restore BL0005
                    }
                    catch (Exception ex)
                    {
                        await this.ToastObj.ShowAsync();
                    }
                }
                await spinnerObj.HideAsync();
            }
            else
            {
                this.data = cloneDataSource;
            }
        }

        private List<PivotViewFilterSetting> UpdateFilterSettings(List<MemberFilter> members, List<LabelFilter> labels)
        {
            List<PivotViewFilterSetting> filterSettings = new List<PivotViewFilterSetting>();
            if (members?.Count > 0)
            {
                foreach (MemberFilter item in members)
                {
                    if (!string.IsNullOrEmpty(item.Name))
                    {
                        filterSettings.Add(new PivotViewFilterSetting()
                        {
                            Name = item.Name,
                            Items = item.Items,
                            Type = (item.Type == Syncfusion.Blazor.PivotView.FilterType.Include || item.Type == Syncfusion.Blazor.PivotView.FilterType.Exclude) ? item.Type : Syncfusion.Blazor.PivotView.FilterType.Include
                        });
                    }
                }
            }
            if (labels?.Count > 0)
            {
                foreach (LabelFilter item in labels)
                {
                    if (!string.IsNullOrEmpty(item.Name))
                    {
                        filterSettings.Add(new PivotViewFilterSetting()
                        {
                            Name = item.Name,
                            Value1 = item.Value1,
                            Value2 = item.Value2,
                            Condition = item.Condition,
                            Type = item.Type == Syncfusion.Blazor.PivotView.FilterType.Label ? item.Type : Syncfusion.Blazor.PivotView.FilterType.Label
                        });
                    }
                }
            }
            return filterSettings;
        }

        private Dictionary<string, object> UpdateFilters()
        {
            List<MemberFilter> memberFilters = new List<MemberFilter>();
            List<LabelFilter> labelFilters = new List<LabelFilter>();
            List<PivotViewFilterSetting> filterSettings = pivotRef.DataSourceSettings.FilterSettings;
            if (filterSettings?.Count > 0)
            {
                foreach (PivotViewFilterSetting item in filterSettings)
                {
                    if (item.Type == Syncfusion.Blazor.PivotView.FilterType.Include || item.Type == Syncfusion.Blazor.PivotView.FilterType.Exclude)
                    {
                        memberFilters.Add(new MemberFilter()
                        {
                            Name = item.Name,
                            Type = item.Type,
                            Items = item.Items
                        });
                    }
                    else if (item.Type == Syncfusion.Blazor.PivotView.FilterType.Label)
                    {
                        labelFilters.Add(new LabelFilter()
                        {
                            Name = item.Name,
                            Value1 = item.Value1,
                            Value2 = item.Value2,
                            Condition = item.Condition,
                            Type = item.Type
                        });
                    }
                }
            }
            if (memberFilters?.Count <= 0)
            {
                memberFilters.Add(new MemberFilter()
                {
                    Name = null,
                    Type = Syncfusion.Blazor.PivotView.FilterType.Include,
                    Items = Array.Empty<string>()
                });
            }
            if (labelFilters?.Count <= 0)
            {
                labelFilters.Add(new LabelFilter()
                {
                    Name = null,
                    Value1 = null,
                    Value2 = null,
                    Condition = Operators.Equals,
                    Type = Syncfusion.Blazor.PivotView.FilterType.Label
                });
            }
            Dictionary<string, object> dictionary = new Dictionary<string, object>()
        {
            {"memberFilters", memberFilters},
            {"labelFilters", labelFilters}
        };
            return dictionary;
        }

        private string GetSerializedPivotReport(PivotReport report)
        {
            return JsonConvert.SerializeObject(report);
        }

        private PivotReport DeserializeResult(string result)
        {
            return JsonConvert.DeserializeObject<PivotReport>(result);
        }

        private static string ValidateAndGeneratePrompt(string report, string userInput, bool isFilterQuery)
        {
            var filterTypes = Enum.GetValues(typeof(Syncfusion.Blazor.PivotView.FilterType)).Cast<Syncfusion.Blazor.PivotView.FilterType>();
            var filter = string.Join(", ", filterTypes.Select(ft => ft.ToString()));

            var summaryTypes = Enum.GetValues(typeof(SummaryTypes)).Cast<SummaryTypes>();
            var summary = string.Join(", ", summaryTypes.Select(st => st.ToString()));

            var operatorTypes = Enum.GetValues(typeof(Operators)).Cast<Operators>();
            var operators = string.Join(", ", operatorTypes.Select(op => op.ToString()));

            string filterQuery = $"The MemberFilters property has a Type property that is an enum with values corresponding to {filter}" +
            $"and the LabelFilters property has a Condition property that is an enum with values corresponding to {operators}." +
            $"Filters should not be applied to fields bound in Values and the same field should not be added to both label filters and member filters.";

            string pivotQuery = $"The Values property has a Type property, which is an enum with values corresponding to {summary}.";

            return $"Given the following datasource and settings(such as rows, columns, values and filters) are bounded in the pivot table\n\n{report}." +
            $"\n\n Return the newly prepared datasource and settings based on following user query: {userInput + (isFilterQuery ? " important: Ensure that the datasource remains unchanged and only update the filter settings." : string.Empty)}" +
            $"\n\nGenerate an output in JSON format only and Should not include any additional information or content in response" +
            $"\n\n Note: {pivotQuery}" +
            $"\n\n{filterQuery}";
        }
    }
}
