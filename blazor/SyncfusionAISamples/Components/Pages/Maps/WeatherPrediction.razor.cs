using Newtonsoft.Json;
using System.Collections.ObjectModel;

namespace SyncfusionAISamples.Components.Pages.Maps
{
    public partial class WeatherPrediction
    {
        public bool SpinnerVisibility { get; set; } = true;    
        public string SecondButtonContent { get; set; }
        public string ThirdButtonContent { get; set; }
        public string FourthButtonContent { get; set; }
        public string FifthButtonContent { get; set; }
        public string Day { get; set; }
        ObservableCollection<Markers> MarkerCollection = new ObservableCollection<Markers>();

        public string[] ButtonContents { get; set; } = new string[5];

        protected override async Task OnInitializedAsync()
        {
            DateTime dateTime = DateTime.Now;
            for (int i = 1; i <= 5; i++)
            {
                ButtonContents[i - 1] = i == 1 ? "Tomorrow" : dateTime.AddDays(i).DayOfWeek.ToString();
            }
        }

        private string GetButtonContent(int dayOffset)
        {
            return ButtonContents[dayOffset - 1];
        }

        private async Task GetWeatherForDay(int dayOffset)
        {
            SpinnerVisibility = true;
            DateTime dateTime = DateTime.Now.Date.AddDays(dayOffset);
            string date = $"{dateTime.Day}/{dateTime.Month}/{dateTime.Year}";
            string result = await AIChatService.GetCompletionAsync($"Generate {date}'s temperature in Celsius for 15 important cities in USA as a JSON object, with fields such as 'cityName', 'temperature', 'latitude', 'longitude' and 'weatherCondition'. The weather conditions must be sunny day, rainy day, cloudy day, snowy day and foggy day based on the temperature of the state. Strictly provide flat JSON list without nested objects. Do not provide introductory words or blockquotes in the beginning of the response.");

            if (!string.IsNullOrEmpty(result))
            {
                Day = dayOffset == 1 ? "Tomorrow" : dateTime.DayOfWeek.ToString();
                MarkerCollection = JsonConvert.DeserializeObject<ObservableCollection<Markers>>(result);
            }

            SpinnerVisibility = false;
        }

        public class Markers
        {
            public double Latitude { get; set; }
            public double Longitude { get; set; }
    
            [JsonProperty("cityName")]
            public string Name { get; set; }
            public double Temperature { get; set; }
    
            [JsonProperty("weatherCondition")]
            public string WeatherCondition { get; set; }
        }
    }
}
