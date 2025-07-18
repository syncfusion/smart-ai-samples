using Newtonsoft.Json;
using System.Collections.ObjectModel;

namespace SyncfusionAIWasmExamples.Pages.Maps
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
    
        protected override async Task OnInitializedAsync()
        {
            DateTime dateTime = DateTime.Now;
            SecondButtonContent = dateTime.AddDays(2).DayOfWeek.ToString();
            ThirdButtonContent = dateTime.AddDays(3).DayOfWeek.ToString();
            FourthButtonContent = dateTime.AddDays(4).DayOfWeek.ToString();
            FifthButtonContent = dateTime.AddDays(5).DayOfWeek.ToString();
        }
    
        private async Task Loaded()
        {
            if (MarkerCollection.Count == 0)
            {
                Day = "Today";
                string result = await ChatGptService.GetCompletionAsync("Generate today's temperature in Celsius for 15 important cities in USA as a JSON object, with fields such as 'cityName', 'temperature', 'latitude', 'longitude' and 'weatherCondition'. The weather conditions must be sunny day, rainy day, cloudy day, snowy day and foggy day based on the temperature of the state. Strictly provide flat JSON list without nested objects.");
                if (!string.IsNullOrEmpty(result))
                {
                    MarkerCollection = JsonConvert.DeserializeObject<ObservableCollection<Markers>>(result);
                }
                SpinnerVisibility = false;
            }
        }
    
        private async Task GetTomorrowWeather()
        {
            SpinnerVisibility = true;
            DateTime dateTime = (DateTime.Now.Date).AddDays(1);
            string date = dateTime.Day.ToString() + "/" + dateTime.Month.ToString() + "/" + dateTime.Year.ToString();
            string result = await ChatGptService.GetCompletionAsync("Generate " + date + "'s temperature in Celsius for 15 important cities in USA as a JSON object, with fields such as 'cityName', 'temperature', 'latitude', 'longitude' and 'weatherCondition'. The weather conditions must be sunny day, rainy day, cloudy day, snowy day and foggy day based on the temperature of the state. Strictly provide flat JSON list without nested objects.");
            if (!string.IsNullOrEmpty(result))
            {
                Day = "Tomorrow";
                MarkerCollection = JsonConvert.DeserializeObject<ObservableCollection<Markers>>(result);
            }
            SpinnerVisibility = false;
        }
    
        private async Task GetSecondDayWeather()
        {
            SpinnerVisibility = true;
            DateTime dateTime = (DateTime.Now.Date).AddDays(2);
            string date = dateTime.Day.ToString() + "/" + dateTime.Month.ToString() + "/" + dateTime.Year.ToString();
            string result = await ChatGptService.GetCompletionAsync("Generate " + date + "'s temperature in Celsius for 15 important cities in USA as a JSON object, with fields such as 'cityName', 'temperature', 'latitude', 'longitude' and 'weatherCondition'. The weather conditions must be sunny day, rainy day, cloudy day, snowy day and foggy day based on the temperature of the state. Strictly provide flat JSON list without nested objects.");
            if (!string.IsNullOrEmpty(result))
            {
                Day = dateTime.DayOfWeek.ToString();
                MarkerCollection = JsonConvert.DeserializeObject<ObservableCollection<Markers>>(result);
            }
            SpinnerVisibility = false;
        }
    
        private async Task GetThirdDayWeather()
        {
            SpinnerVisibility = true;
            DateTime dateTime = (DateTime.Now.Date).AddDays(3);
            string date = dateTime.Day.ToString() + "/" + dateTime.Month.ToString() + "/" + dateTime.Year.ToString();
            string result = await ChatGptService.GetCompletionAsync("Generate " + date + "'s temperature in Celsius for 15 important cities in USA as a JSON object, with fields such as 'cityName', 'temperature', 'latitude', 'longitude' and 'weatherCondition'. The weather conditions must be sunny day, rainy day, cloudy day, snowy day and foggy day based on the temperature of the state. Strictly provide flat JSON list without nested objects.");
            if (!string.IsNullOrEmpty(result))
            {
                Day = dateTime.DayOfWeek.ToString();
                MarkerCollection = JsonConvert.DeserializeObject<ObservableCollection<Markers>>(result);
            }
            SpinnerVisibility = false;
        }
    
        private async Task GetFourthDayWeather()
        {
            SpinnerVisibility = true;
            DateTime dateTime = (DateTime.Now.Date).AddDays(4);
            string date = dateTime.Day.ToString() + "/" + dateTime.Month.ToString() + "/" + dateTime.Year.ToString();
            string result = await ChatGptService.GetCompletionAsync("Generate " + date + "'s temperature in Celsius for 15 important cities in USA as a JSON object, with fields such as 'cityName', 'temperature', 'latitude', 'longitude' and 'weatherCondition'. The weather conditions must be sunny day, rainy day, cloudy day, snowy day and foggy day based on the temperature of the state. Strictly provide flat JSON list without nested objects.");
            if (!string.IsNullOrEmpty(result))
            {
                Day = dateTime.DayOfWeek.ToString();
                MarkerCollection = JsonConvert.DeserializeObject<ObservableCollection<Markers>>(result);
            }
            SpinnerVisibility = false;
        }
    
        private async Task GetFifthDayWeather()
        {
            SpinnerVisibility = true;
            DateTime dateTime = (DateTime.Now.Date).AddDays(5);
            string date = dateTime.Day.ToString() + "/" + dateTime.Month.ToString() + "/" + dateTime.Year.ToString();
            string result = await ChatGptService.GetCompletionAsync("Generate " + date + "'s temperature in Celsius for 15 important cities in USA as a JSON object, with fields such as 'cityName', 'temperature', 'latitude', 'longitude' and 'weatherCondition'. The weather conditions must be sunny day, rainy day, cloudy day, snowy day and foggy day based on the temperature of the state. Strictly provide flat JSON list without nested objects.");
            if (!string.IsNullOrEmpty(result))
            {
                Day = dateTime.DayOfWeek.ToString();
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
