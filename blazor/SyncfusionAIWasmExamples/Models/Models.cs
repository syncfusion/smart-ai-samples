namespace SyncfusionAIWasmExamples.Models
{

    public class ExpenseCategory
    {
        public string ID { get; set; }
        public string Name { get; set; }
    }
    public class MenuItem
    {
        public string Text { get; set; }
        public string Href { get; set; }
        public List<MenuItem> SubMenu { get; set; } = new List<MenuItem>();
    }
    public class ChartDataModel
    {
        public DateTime Date { get; set; }
        public float Value { get; set; }
    }
}
