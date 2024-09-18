using Microsoft.JSInterop;
using Syncfusion.Blazor.DataForm;
using Syncfusion.Blazor.Navigations;
using Syncfusion.Blazor.Notifications;
using Syncfusion.Blazor.Popups;
using Syncfusion.Blazor.Schedule;
using Syncfusion.Blazor.SmartComponents;
using System.ComponentModel.DataAnnotations;

namespace SyncfusionAISamples.Components.Pages.Scheduler
{
    public partial class SchedulerSmartAi
    {
        private string copyBtnIcon = "e-icons e-timeline-work-week";
        private string copyBtnContent = "Smart Appointment";
        private bool isChecked = false;
        SfSmartPasteButton smartButton;
        SfDataForm DataFormInstance { get; set; }
        private DateTime CurrentDate = DateTime.Now.Date;
        private DateTime startTime = DateTime.Now.Date.AddHours(12);
        private DateTime endTime = DateTime.Now.Date.AddHours(13);
        private bool Visibility { get; set; } = false;
        private bool AreFieldsPopulated { get; set; } = true;
        public string[] CustomClass = { "e-appointment-border" };
        SfToast ToastObj;
        private string ToastPosition = "Right";
        private string ToastContent = "";
        private bool SpinnerVisibility { get; set; } = false;
        private string cardContent1 = "Title: Discussion on Ticket 429519" +
        "Hi John,\n\n" +
        "We have scheduled the meeting for tomorrow (24th Jan) at 12 PM IST at Mathura Towers and this meeting is scheduled to discuss the issue related to the ticket 429519 only. " +
        "For any other issues, please create a new ticket or update the respective tickets and our technical team will follow up with the details in those tickets.\n\n" +
        "Note: Screen sharing is to see the issue at your end and debug directly, if needed. We request you to contact your IT team and get prior approval/disable firewall settings to share the controls. This will help to minimize the resolution time.\n\n" +
        "Regards,\n\n" +
        "Sabitha";

        string cardContent2 = "Title: Meeting to discuss on Ticket 603027" +
        "Hi Liji,\n\n" +
        "We have scheduled the meeting for today at 3 PM IST in Chennai and this meeting is scheduled to discuss the issue related to the ticket 595353 and 603027 only. " +
        "For any other issues, please create a new ticket or update the respective tickets and our technical team will follow up with the details in those tickets.\n\n" +
        "Regards,\n\n" +
        "Ram";

        string cardContent3 = "Title: Exciting Updates and Demo Invitation from Syncfusion" +
        "You: Hi Alex, I hope you're doing well! I’m reaching out from Syncfusion Software Pvt Ltd. " +
        "We've recently made some exciting updates to our UI components and I'd love to share them with you.\n" +
        "Recipient: Hi Andrew, I'm doing well, thanks! What kind of updates have you made?\n" +
        "You: We've enhanced key components such as the Scheduler, Carousel, Tab, Toolbar, Accordion, and Appbar. " +
        "Additionally, we've improved accessibility to meet WCAG 2.2 standards and enhanced security with XSS prevention. " +
        "These updates aim to provide a more robust and secure experience for our users.\n" +
        "Recipient: That sounds fantastic! I’d be interested in seeing these updates in action.\n" +
        "You: Wonderful! I’d love to schedule a demo to showcase these new features. Are you available for a session on Wednesday, " +
        "August 7th at 11 AM, or Friday, August 9th at 2 PM? The demo will be held at our Morrisville office.\n" +
        "Recipient: Friday, August 9th at 2 PM works for me.\n" +
        "You: Perfect! I’ll send a calendar invite for Friday, August 9th at 2 PM at our Morrisville office.\n" +
        "Recipient: Great, see you then!\n" +
        "You: See you on Friday! Have a great day.";


        List<string> cardContents;
        List<AppointmentData> DataSource = new List<AppointmentData>();
        AppointmentData newAppointment = new AppointmentData();
        SfSchedule<AppointmentData> ScheduleObj;
        SfTab TabObj;
        private async Task CopyToClipboard(string text)
        {
            await JSRuntime.InvokeVoidAsync("navigator.clipboard.writeText", text);
            Visibility = true;
        }

        protected override void OnInitialized()
        {
            if (BugRptModel.StartTime == default)
            {
                BugRptModel.StartTime = DateTime.Now.Date.AddHours(12);
            }

            if (BugRptModel.EndTime == default)
            {
                BugRptModel.EndTime = DateTime.Now.Date.AddHours(13);
            }
            base.OnInitialized();
        }

        public void OnOpenHandler(BeforeOpenEventArgs args)
        {
            SpinnerVisibility = true;
        }

        public async Task OpenedHandler(Syncfusion.Blazor.Popups.OpenEventArgs args)
        {
            await JSRuntime.InvokeVoidAsync("clickButton", "smart-button");
            while (string.IsNullOrEmpty(BugRptModel.Subject))
            {
                await Task.Delay(1000);
            }
            AreFieldsPopulated = false;
            SpinnerVisibility = false;
            StateHasChanged();
        }

        public void ClosedHandler(CloseEventArgs args)
        {
            BugRptModel.Subject = "";
            BugRptModel.Location = "";
            BugRptModel.Description = "";
            BugRptModel.EndTime = DateTime.Now.Date.AddHours(13);
            BugRptModel.StartTime = DateTime.Now.Date.AddHours(12);
            DataFormInstance?.Refresh();
            AreFieldsPopulated = true;
        }

        public void CloseEditorDialog()
        {
            Visibility = false;
        }

        public async Task SaveToScheduler()
        {
            Visibility = false;
            newAppointment = new AppointmentData
            {
                Id = DataSource.Count + 1,
                Subject = BugRptModel.Subject,
                StartTime = BugRptModel.StartTime,
                EndTime = BugRptModel.EndTime,
                Location = BugRptModel.Location,
                Description = BugRptModel.Description,
            };
            var dataSourceCopy = new List<AppointmentData>(DataSource);
            dataSourceCopy.Add(newAppointment);
            DataSource = dataSourceCopy;
            await SwitchToSchedule(newAppointment);
        }

        private async Task SwitchToSchedule(AppointmentData newAppointment)
        {
            await TabObj.EnableTabAsync(1, true);
            await TabObj.SelectAsync(1);
            await GenerateToastContent(newAppointment);
        }

        public void OnTabChange(SelectEventArgs args)
        {
            if (newAppointment.StartTime == DateTime.MinValue)
            {
                newAppointment.StartTime = DateTime.Now;
            }
            ScheduleObj.SelectedDate = newAppointment.StartTime;
            var Date = newAppointment.StartTime.TimeOfDay.ToString();
            var MinutesHours = Date.Substring(0, 5);
            ScheduleObj.ScrollToAsync(MinutesHours, newAppointment.StartTime);
        }

        public async Task GenerateToastContent(AppointmentData newAppointment)
        {
            ToastContent = $"{newAppointment.Subject} has been scheduled at {newAppointment.StartTime}";
            StateHasChanged();
            await ToastObj.ShowAsync();
        }

        public void OnEventRendered(EventRenderedArgs<AppointmentData> args)
        {
            if (newAppointment.Id == args.Data.Id)
            {
                args.CssClasses = new List<string>(CustomClass);
            }

        }

        Dictionary<string, object> subjectAttr = new Dictionary<string, object>()
     {
         { "data-smartpaste-description", "Extract the core content from the input and use it as the subject." }
     };


        Dictionary<string, object> descriptionAttr = new Dictionary<string, object>()
     {
         { "data-smartpaste-description", "Provide a concise summary of the entire input as the description." }
     };

        Dictionary<string, object> startTimeAttr = new Dictionary<string, object>()
     {
         { "data-smartpaste-description", $"The current date is {DateTime.Now.Date}. Extract the start time from the input and format the output date as MM/dd/yyyy HH:mm." }
     };


        Dictionary<string, object> endTimeAttr = new Dictionary<string, object>()
    {
        { "data-smartpaste-description", "Extract the End Time from the input. If no End Time is provided, add 1 hour to the Start Time. Ensure the date format is MM/dd/yyyy HH:mm." }
    };

        Dictionary<string, object> locationAttr = new Dictionary<string, object>()
    {
        { "data-smartpaste-description", "Identify and add any provided location from the input. If no location is mentioned, leave it blank." }
    };

        Dictionary<string, object> allDayAttr = new Dictionary<string, object>()
    {
        { "data-smartpaste-description", "Determine if the input describes an all-day event. Set the IsAllDay property to true if it is, otherwise set it to false." }
    };
        private BugReportModel BugRptModel = new BugReportModel();

        public class BugReportModel
        {
            [Display(Name = "Subject")]
            public string Subject { get; set; }

            [Display(Name = "Location")]
            public string Location { get; set; }

            [Display(Name = "StartTime")]
            public DateTime StartTime { get; set; }

            [Display(Name = "EndTime")]
            public DateTime EndTime { get; set; }

            [Display(Name = "Description")]
            public string Description { get; set; }

            [Display(Name = "Recurrence")]
            public string Recurrence { get; set; }

            [Display(Name = "IsAllDay")]
            public bool IsAllDay { get; set; }

        }

        public class AppointmentData
        {
            public int Id { get; set; }
            public string Subject { get; set; }
            public string Location { get; set; }
            public DateTime StartTime { get; set; }
            public DateTime EndTime { get; set; }
            public string Description { get; set; }
            public string EventType { get; set; }
            public string RecurrenceRule { get; set; }
            public Nullable<int> RecurrenceID { get; set; }
            public string RecurrenceException { get; set; }
        }
    }
}
