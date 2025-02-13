using SmartComponents.LocalEmbeddings;
using Syncfusion.Blazor.DropDowns;

namespace SyncfusionAISamples.Components.Pages.ComboBox
{
    public partial class ComboBoxEmbeddings
    {
        public double similarityValue = 0.65;
        private string SearchTerm = "";
        public string ComboBoxValue = "";

        SfComboBox<string, ExpenseCategory> comboboxObj;
        private List<ExpenseCategory> expenseCategories;
        private List<ExpenseCategory> cbxDataSource;
        public Dictionary<string, EmbeddingF32> ProductEmbeddings { get; set; } = new Dictionary<string, EmbeddingF32>();

        public static List<ExpenseCategory> GetAllRecords()
        {
            return new List<ExpenseCategory>()
        {
            new ExpenseCategory() { ID = "Category1", Name = "Groceries" },
            new ExpenseCategory() { ID = "Category2", Name = "Utilities" },
            new ExpenseCategory() { ID = "Category3", Name = "Rent" },
            new ExpenseCategory() { ID = "Category4", Name = "Education" },
            new ExpenseCategory() { ID = "Category5", Name = "Car Payment" },
            new ExpenseCategory() { ID = "Category6", Name = "Car Insurance" },
            new ExpenseCategory() { ID = "Category7", Name = "Health Insurance" },
            new ExpenseCategory() { ID = "Category8", Name = "Life Insurance" },
            new ExpenseCategory() { ID = "Category9", Name = "Home Insurance" },
            new ExpenseCategory() { ID = "Category10", Name = "Gas" },
            new ExpenseCategory() { ID = "Category11", Name = "Public Transportation" },
            new ExpenseCategory() { ID = "Category12", Name = "Dining Out" },
            new ExpenseCategory() { ID = "Category13", Name = "Entertainment" },
            new ExpenseCategory() { ID = "Category14", Name = "Travel" },
            new ExpenseCategory() { ID = "Category15", Name = "Clothing" },
            new ExpenseCategory() { ID = "Category16", Name = "Electronics" },
            new ExpenseCategory() { ID = "Category17", Name = "Pet Care" },
            new ExpenseCategory() { ID = "Category18", Name = "Other" }
        };
        }

        protected override void OnInitialized()
        {
            expenseCategories = GetAllRecords();
            cbxDataSource = expenseCategories;
            foreach (var expense in expenseCategories)
            {
                ProductEmbeddings.Add(expense.ID, embedder.Embed(expense.Name));
            }
        }


        private void OnSearchTermChanged(FilteringEventArgs args)
        {
            args.PreventDefaultAction = true;
            SearchTerm = args.Text;
            if (String.IsNullOrEmpty(SearchTerm))
            {
                comboboxObj.FilterAsync(cbxDataSource);
                return;
            }
            var queryVector = embedder.Embed(SearchTerm);
            List<ExpenseCategory> filteredRecords = expenseCategories
                .Where(expense => LocalEmbedder.Similarity(ProductEmbeddings[expense.ID], queryVector) > similarityValue)
                .ToList();
            comboboxObj.FilterAsync(filteredRecords);
        }

        public class ExpenseCategory
        {
            public string ID { get; set; }
            public string Name { get; set; }
        }
    }
}
