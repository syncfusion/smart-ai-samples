using SmartComponents.LocalEmbeddings;
using Syncfusion.Blazor.Data;
using Syncfusion.Blazor.Grids;

namespace SyncfusionAIWasmExamples.Pages.DataGrid
{
    public partial class GridSemanticFiltering
    {
        public static SfGrid<MedicalRecord> gridObj;
        public List<MedicalRecord> MedicalRecords { get; set; }
        public static double similarityValue = 0.5;
        private string SearchTerm { get; set; }
        public Query _query = new Query();
        public static Dictionary<int, EmbeddingF32> ProductEmbeddings { get; set; } = new Dictionary<int, EmbeddingF32>();

        protected override void OnInitialized()
        {
            MedicalRecords = new List<MedicalRecord>
        {
            new MedicalRecord { RecordID = 1, PatientID = 615001, Symptoms = "Fever, cough, and shortness of breath.", Diagnosis = "Pneumonia", DoctorDetails = "Dr. John Smith - Specialized in Pulmonology" },
            new MedicalRecord { RecordID = 2, PatientID = 615002, Symptoms = "Severe headache, nausea, and sensitivity to light.", Diagnosis = "Migraine", DoctorDetails = "Dr. Alice Brown - Specialized in Neurology" },
            new MedicalRecord { RecordID = 3, PatientID = 615003, Symptoms = "Fatigue, weight gain, and hair loss.", Diagnosis = "Hypothyroidism", DoctorDetails = "Dr. Robert Johnson - Specialized in Endocrinology" },
            new MedicalRecord { RecordID = 4, PatientID = 15004, Symptoms = "Chest pain, shortness of breath, and sweating.", Diagnosis = "Heart Attack", DoctorDetails = "Dr. Michael Williams - Specialized in Cardiology" },
            new MedicalRecord { RecordID = 5, PatientID = 615005, Symptoms = "Joint pain, stiffness, and swelling.", Diagnosis = "Arthritis", DoctorDetails = "Dr. Mary Jones - Specialized in Rheumatology" },
            new MedicalRecord { RecordID = 6, PatientID = 615006, Symptoms = "Abdominal pain, bloating, and irregular bowel movements.", Diagnosis = "Irritable Bowel Syndrome (IBS)", DoctorDetails = "Dr. Patricia Garcia - Specialized in Gastroenterology" },
            new MedicalRecord { RecordID = 7, PatientID = 615007, Symptoms = "Frequent urination, excessive thirst, and unexplained weight loss.", Diagnosis = "Diabetes", DoctorDetails = "Dr. Robert Johnson - Specialized in Endocrinology" },
            new MedicalRecord { RecordID = 8, PatientID = 615008, Symptoms = "Persistent sadness, loss of interest, and fatigue.", Diagnosis = "Depression", DoctorDetails = "Dr. Linda Martinez - Specialized in Psychiatry" },
            new MedicalRecord { RecordID = 9, PatientID = 615009, Symptoms = "Shortness of breath, wheezing, and chronic cough.", Diagnosis = "Asthma", DoctorDetails = "Dr. John Smith - Specialized in Pulmonology" },
            new MedicalRecord { RecordID = 10, PatientID = 615010, Symptoms = "High blood pressure, headaches, and blurred vision.", Diagnosis = "Hypertension", DoctorDetails = "Dr. Michael Williams - Specialized in Cardiology" }
        };
            foreach (var data in MedicalRecords)
            {
                ProductEmbeddings.TryAdd(data.RecordID, embedder.Embed($"{data.DoctorDetails} {data.PatientID} {data.Symptoms} {data.Diagnosis}"));
            }
        }

        private async Task SearchClicked()
        {
            var filteredColumn = await gridObj.GetColumnByFieldAsync("Symptoms");
            if (!string.IsNullOrEmpty(SearchTerm))
            {
                var queryVector = embedder.Embed(SearchTerm);
                var filteredRecords = MedicalRecords.Where(p => LocalEmbedder.Similarity(ProductEmbeddings[p.RecordID], queryVector) > similarityValue).ToList();

                var filteredQuery = await RenderQueryForFilteredData(filteredRecords, filteredColumn);
                _query = filteredQuery;
            }
            else
            {
                _query = new Query();
            }
        }

        public async Task<Query> RenderQueryForFilteredData(IEnumerable<object> filteredData, GridColumn column)
        {
            Query query;
            List<WhereFilter> inputFilters = new List<WhereFilter>();
            foreach (var data in filteredData)
            {
                var filterValue = data.GetType().GetProperty(column.Field).GetValue(data);
                inputFilters.Add(new WhereFilter() { Field = column.Field, Operator = "contains", value = filterValue, IgnoreCase = true, Condition = "or" });

            }
            return query = new Query().Where(WhereFilter.Or(inputFilters));
        }

        public class MedicalRecord
        {
            public int RecordID { get; set; }
            public int PatientID { get; set; }
            public string DoctorDetails { get; set; }
            public string Symptoms { get; set; }
            public string Diagnosis { get; set; }
        }
    }
}
