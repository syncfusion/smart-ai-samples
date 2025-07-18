using Syncfusion.Blazor.QueryBuilder;

namespace SyncfusionAIWasmExamples.Pages.QueryBuilder
{
    public partial class NaturalLanguageQuery
    {
        public bool VisibleProperty = false;
        public class User
        {
            public int id { get; set; }
            public string name { get; set; }
            public string email { get; set; }
            public string address { get; set; }
            public string city { get; set; }
            public string state { get; set; }
            public int credits { get; set; }
        }
        private static readonly string[] Names = { "John", "Jane", "Bob", "Alice", "Tom", "Sally", "Jim", "Mary", "Peter", "Nancy" };
        private static readonly string[] Cities = { "Los Angeles", "San Diego", "New York", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "Dallas", "San Jose" };
        private static readonly string[] States = { "California", "New York", "Illinois", "Texas", "Arizona", "Pennsylvania" };
        private static readonly string[] Streets = { "Elm St", "Oak St", "Maple Ave", "Pine St", "Cedar St", "Birch St" };
        private static readonly string[] Emails = { "example.com", "test.com", "demo.com" };

        public static List<User> GenerateRandomUsers(int count)
        {
            var random = new Random();
            var users = new List<User>();

            for (int i = 0; i < count; i++)
            {
                var id = i + 1;
                var name = Names[random.Next(Names.Length)];
                var email = $"{name.ToLower()}{id}@{Emails[random.Next(Emails.Length)]}";
                var address = $"{random.Next(10000)} {Streets[random.Next(Streets.Length)]}";
                var city = Cities[random.Next(Cities.Length)];
                var state = States[random.Next(States.Length)];
                var credits = random.Next(2001);

                users.Add(new User
                {
                    id = id,
                    name = name,
                    email = email,
                    address = address,
                    city = city,
                    state = state,
                    credits = credits
                });
            }

            return users;
        }

        List<User> Users = GenerateRandomUsers(7);

        private string TextAreaValue { get; set; } = "Find all users who lives in California and have over 500 credits";
        SfQueryBuilder<User> QueryBuilderObj;
        private IEnumerable<User> GridData { get; set; }
        private IEnumerable<User> DataSource { get; set; }
        protected override void OnInitialized()
        {
            DataSource = Users;
        }
        private void GridCreated()
        {
            GridData = DataSource;
        }

        private async void GenBtnClick()
        {
            VisibleProperty = true;
            string prompt = "Create an SQL query to achieve the following task: " + TextAreaValue + " from a single table. Focus on constructing a valid SQL query that directly addresses the specified task, ensuring it adheres to standard SQL syntax for querying a single table. NOTE: Return only the SQL query without any additional explanation or commentary. The response should contain the query itself, formatted correctly and ready for execution.";

            string result = await OpenAIService.GetCompletionAsync(prompt, false);

            string value = result.Split("WHERE ")[1].Split(";\n")[0];
            value = value.Replace("\n", " ");
            value = value.Replace(";", "");
            QueryBuilderObj.SetRulesFromSql(value);
            GridData = QueryBuilderObj.GetFilteredRecords().ToList().AsEnumerable<User>();
            StateHasChanged();
            VisibleProperty = false;
        }
    }
}
