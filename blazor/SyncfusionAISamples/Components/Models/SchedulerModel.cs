
namespace SyncfusionAISamples.Models
{
    public class DataSource
    {
        public List<AppointmentData> GetEventData()
        {
            List<AppointmentData> data = new List<AppointmentData>
            {
            new AppointmentData { Id = 1, Subject = "Event 1", StartTime = new DateTime(2024, 7, 1, 4, 0, 0), EndTime = new DateTime(2024, 7, 1, 5, 0, 0) },
            new AppointmentData { Id = 2, Subject = "Event 2", StartTime = new DateTime(2024, 7, 1, 5, 0, 0), EndTime = new DateTime(2024, 7, 1, 6, 0, 0) },
            new AppointmentData { Id = 3, Subject = "Event  3", StartTime = new DateTime(2024, 7, 1, 6, 0, 0), EndTime = new DateTime(2024, 7, 1, 7, 0, 0) },
            new AppointmentData { Id = 4, Subject = "Event  4", StartTime = new DateTime(2024, 7, 1, 7, 0, 0), EndTime = new DateTime(2024, 7, 1, 8, 0, 0) },
            new AppointmentData { Id = 5, Subject = "Event  5", StartTime = new DateTime(2024, 7, 1, 8, 0, 0), EndTime = new DateTime(2024, 7, 1, 9, 0, 0) },
            new AppointmentData { Id = 6, Subject = "Event  6", StartTime = new DateTime(2024, 7, 1, 9, 0, 0), EndTime = new DateTime(2024, 7, 1, 10, 0, 0) },
            new AppointmentData { Id = 7, Subject = "Event  7", StartTime = new DateTime(2024, 7, 1, 10, 0, 0), EndTime = new DateTime(2024, 7, 1, 11, 0, 0) },
            new AppointmentData { Id = 8, Subject = "Event  8", StartTime = new DateTime(2024, 7, 1, 11, 0, 0), EndTime = new DateTime(2024, 7, 1, 12, 0, 0) },
            new AppointmentData { Id = 9, Subject = "Event  9", StartTime = new DateTime(2024, 7, 1, 4, 30, 0), EndTime = new DateTime(2024, 7, 1, 5, 30, 0) },
            new AppointmentData { Id = 10, Subject = "Event  10", StartTime = new DateTime(2024, 7, 1, 5, 30, 0), EndTime = new DateTime(2024, 7, 1, 6, 30, 0) },
            new AppointmentData { Id = 11, Subject = "Event  11", StartTime = new DateTime(2024, 7, 1, 15, 0, 0), EndTime = new DateTime(2024, 7, 1, 16, 0, 0) },
            new AppointmentData { Id = 12, Subject = "Event  12", StartTime = new DateTime(2024, 7, 1, 16, 0, 0), EndTime = new DateTime(2024, 7, 1, 17, 0, 0) },
            new AppointmentData { Id = 13, Subject = "Event  13", StartTime = new DateTime(2024, 7, 1, 17, 0, 0), EndTime = new DateTime(2024, 7, 1, 18, 0, 0) },
            new AppointmentData { Id = 14, Subject = "Event  14", StartTime = new DateTime(2024, 7, 1, 18, 0, 0), EndTime = new DateTime(2024, 7, 1, 19, 0, 0) },
            new AppointmentData { Id = 15, Subject = "Event  15", StartTime = new DateTime(2024, 7, 1, 19, 0, 0), EndTime = new DateTime(2024, 7, 1, 20, 0, 0) },
            new AppointmentData { Id = 16, Subject = "Event  16", StartTime = new DateTime(2024, 7, 1, 20, 0, 0), EndTime = new DateTime(2024, 7, 1, 21, 0, 0) },
            new AppointmentData { Id = 17, Subject = "Event  17", StartTime = new DateTime(2024, 7, 1, 21, 0, 0), EndTime = new DateTime(2024, 7, 1, 22, 0, 0) },
            new AppointmentData { Id = 18, Subject = "Event  18", StartTime = new DateTime(2024, 7, 1, 22, 0, 0), EndTime = new DateTime(2024, 7, 1, 23, 0, 0) },
            new AppointmentData { Id = 19, Subject = "Event  19", StartTime = new DateTime(2024, 7, 1, 15, 30, 0), EndTime = new DateTime(2024, 7, 1, 16, 30, 0) },
            new AppointmentData { Id = 20, Subject = "Event 20", StartTime = new DateTime(2024, 7, 1, 16, 30, 0), EndTime = new DateTime(2024, 7, 1, 17, 30, 0) },
            new AppointmentData { Id = 21, Subject = "Event 21", StartTime = new DateTime(2024, 7, 1, 17, 30, 0), EndTime = new DateTime(2024, 7, 1, 18, 30, 0) },
            new AppointmentData { Id = 22, Subject = "Event 22", StartTime = new DateTime(2024, 7, 1, 18, 30, 0), EndTime = new DateTime(2024, 7, 1, 19, 30, 0) },
            new AppointmentData { Id = 23, Subject = "Event 23", StartTime = new DateTime(2024, 7, 1, 19, 30, 0), EndTime = new DateTime(2024, 7, 1, 20, 30, 0) },
            new AppointmentData { Id = 24, Subject = "Event 24", StartTime = new DateTime(2024, 7, 1, 20, 30, 0), EndTime = new DateTime(2024, 7, 1, 21, 30, 0) },
            new AppointmentData { Id = 25, Subject = "Event 25", StartTime = new DateTime(2024, 7, 1, 21, 30, 0), EndTime = new DateTime(2024, 7, 1, 22, 30, 0) },
            new AppointmentData { Id = 26, Subject = "Event 26", StartTime = new DateTime(2024, 7, 1, 22, 30, 0), EndTime = new DateTime(2024, 7, 1, 23, 30, 0) },
            new AppointmentData { Id = 27, Subject = "Event 27", StartTime = new DateTime(2024, 7, 1, 15, 15, 0), EndTime = new DateTime(2024, 7, 1, 16, 15, 0) },
            new AppointmentData { Id = 28, Subject = "Event 28", StartTime = new DateTime(2024, 7, 1, 16, 15, 0), EndTime = new DateTime(2024, 7, 1, 17, 15, 0) },
            new AppointmentData { Id = 29, Subject = "Event 29", StartTime = new DateTime(2024, 7, 1, 17, 15, 0), EndTime = new DateTime(2024, 7, 1, 18, 15, 0) },
            new AppointmentData { Id = 30, Subject = "Event  30", StartTime = new DateTime(2024, 7, 1, 18, 15, 0), EndTime = new DateTime(2024, 7, 1, 19, 15, 0) },
            new AppointmentData { Id = 31, Subject = "Event  31", StartTime = new DateTime(2024, 7, 1, 0, 0, 0), EndTime = new DateTime(2024, 7, 1, 0, 30, 0) },
            new AppointmentData { Id = 32, Subject = "Event  32", StartTime = new DateTime(2024, 7, 1, 0, 30, 0), EndTime = new DateTime(2024, 7, 1, 1, 0, 0) },
            new AppointmentData { Id = 33, Subject = "Event  33", StartTime = new DateTime(2024, 7, 1, 1, 0, 0), EndTime = new DateTime(2024, 7, 1, 1, 30, 0) },
            new AppointmentData { Id = 34, Subject = "Event  34", StartTime = new DateTime(2024, 7, 1, 1, 30, 0), EndTime = new DateTime(2024, 7, 1, 2, 0, 0) },
            new AppointmentData { Id = 35, Subject = "Event  35", StartTime = new DateTime(2024, 7, 1, 2, 0, 0), EndTime = new DateTime(2024, 7, 1, 2, 30, 0) },
            new AppointmentData { Id = 36, Subject = "Event  36", StartTime = new DateTime(2024, 7, 1, 2, 30, 0), EndTime = new DateTime(2024, 7, 1, 3, 0, 0) },
            new AppointmentData { Id = 37, Subject = "Event  37", StartTime = new DateTime(2024, 7, 1, 3, 0, 0), EndTime = new DateTime(2024, 7, 1, 3, 30, 0) },
           new AppointmentData { Id = 75, Subject = "Event  1", StartTime = new DateTime(2024, 7, 2, 4, 0, 0), EndTime = new DateTime(2024, 7, 2, 5, 0, 0) },
new AppointmentData { Id = 76, Subject = "Event 2", StartTime = new DateTime(2024, 7, 2, 5, 0, 0), EndTime = new DateTime(2024, 7, 2, 6, 0, 0) },
new AppointmentData { Id = 77, Subject = "Event  3", StartTime = new DateTime(2024, 7, 2, 6, 0, 0), EndTime = new DateTime(2024, 7, 2, 7, 0, 0) },
new AppointmentData { Id = 78, Subject = "Event  4", StartTime = new DateTime(2024, 7, 2, 7, 0, 0), EndTime = new DateTime(2024, 7, 2, 8, 0, 0) },
new AppointmentData { Id = 79, Subject = "Event  5", StartTime = new DateTime(2024, 7, 2, 8, 0, 0), EndTime = new DateTime(2024, 7, 2, 9, 0, 0) },
new AppointmentData { Id = 80, Subject = "Event  6", StartTime = new DateTime(2024, 7, 2, 9, 0, 0), EndTime = new DateTime(2024, 7, 2, 10, 0, 0) },
new AppointmentData { Id = 81, Subject = "Event  7", StartTime = new DateTime(2024, 7, 2, 10, 0, 0), EndTime = new DateTime(2024, 7, 2, 11, 0, 0) },
new AppointmentData { Id = 82, Subject = "Event  8", StartTime = new DateTime(2024, 7, 2, 11, 0, 0), EndTime = new DateTime(2024, 7, 2, 12, 0, 0) },
new AppointmentData { Id = 83, Subject = "Event  9", StartTime = new DateTime(2024, 7, 2, 4, 30, 0), EndTime = new DateTime(2024, 7, 2, 5, 30, 0) },
new AppointmentData { Id = 84, Subject = "Event  10", StartTime = new DateTime(2024, 7, 2, 5, 30, 0), EndTime = new DateTime(2024, 7, 2, 6, 30, 0) },
new AppointmentData { Id = 85, Subject = "Event  11", StartTime = new DateTime(2024, 7, 2, 15, 0, 0), EndTime = new DateTime(2024, 7, 2, 16, 0, 0) },
new AppointmentData { Id = 86, Subject = "Event  12", StartTime = new DateTime(2024, 7, 2, 16, 0, 0), EndTime = new DateTime(2024, 7, 2, 17, 0, 0) },
new AppointmentData { Id = 87, Subject = "Event  13", StartTime = new DateTime(2024, 7, 2, 17, 0, 0), EndTime = new DateTime(2024, 7, 2, 18, 0, 0) },
new AppointmentData { Id = 88, Subject = "Event  14", StartTime = new DateTime(2024, 7, 2, 18, 0, 0), EndTime = new DateTime(2024, 7, 2, 19, 0, 0) },
new AppointmentData { Id = 89, Subject = "Event  15", StartTime = new DateTime(2024, 7, 2, 19, 0, 0), EndTime = new DateTime(2024, 7, 2, 20, 0, 0) },
new AppointmentData { Id = 90, Subject = "Event  16", StartTime = new DateTime(2024, 7, 2, 20, 0, 0), EndTime = new DateTime(2024, 7, 2, 21, 0, 0) },
new AppointmentData { Id = 91, Subject = "Event  17", StartTime = new DateTime(2024, 7, 2, 21, 0, 0), EndTime = new DateTime(2024, 7, 2, 22, 0, 0) },
new AppointmentData { Id = 92, Subject = "Event  18", StartTime = new DateTime(2024, 7, 2, 22, 0, 0), EndTime = new DateTime(2024, 7, 2, 23, 0, 0) },
new AppointmentData { Id = 93, Subject = "Event  19", StartTime = new DateTime(2024, 7, 2, 15, 30, 0), EndTime = new DateTime(2024, 7, 2, 16, 30, 0) },
new AppointmentData { Id = 94, Subject = "Event 20", StartTime = new DateTime(2024, 7, 2, 16, 30, 0), EndTime = new DateTime(2024, 7, 2, 17, 30, 0) },
new AppointmentData { Id = 95, Subject = "Event 21", StartTime = new DateTime(2024, 7, 2, 17, 30, 0), EndTime = new DateTime(2024, 7, 2, 18, 30, 0) },
new AppointmentData { Id = 96, Subject = "Event 22", StartTime = new DateTime(2024, 7, 2, 18, 30, 0), EndTime = new DateTime(2024, 7, 2, 19, 30, 0) },
new AppointmentData { Id = 97, Subject = "Event 23", StartTime = new DateTime(2024, 7, 2, 19, 30, 0), EndTime = new DateTime(2024, 7, 2, 20, 30, 0) },
new AppointmentData { Id = 98, Subject = "Event 24", StartTime = new DateTime(2024, 7, 2, 20, 30, 0), EndTime = new DateTime(2024, 7, 2, 21, 30, 0) },
new AppointmentData { Id = 99, Subject = "Event 25", StartTime = new DateTime(2024, 7, 2, 21, 30, 0), EndTime = new DateTime(2024, 7, 2, 22, 30, 0) },
new AppointmentData { Id = 100, Subject = "Event 26", StartTime = new DateTime(2024, 7, 2, 22, 30, 0), EndTime = new DateTime(2024, 7, 2, 23, 30, 0) },
new AppointmentData { Id = 101, Subject = "Event 27", StartTime = new DateTime(2024, 7, 2, 15, 15, 0), EndTime = new DateTime(2024, 7, 2, 16, 15, 0) },
new AppointmentData { Id = 102, Subject = "Event 28", StartTime = new DateTime(2024, 7, 2, 16, 15, 0), EndTime = new DateTime(2024, 7, 2, 17, 15, 0) },
new AppointmentData { Id = 103, Subject = "Event 29", StartTime = new DateTime(2024, 7, 2, 17, 15, 0), EndTime = new DateTime(2024, 7, 2, 18, 15, 0) },
new AppointmentData { Id = 104, Subject = "Event  30", StartTime = new DateTime(2024, 7, 2, 18, 15, 0), EndTime = new DateTime(2024, 7, 2, 19, 15, 0) },
new AppointmentData { Id = 105, Subject = "Event  31", StartTime = new DateTime(2024, 7, 2, 0, 0, 0), EndTime = new DateTime(2024, 7, 2, 0, 30, 0) },
new AppointmentData { Id = 106, Subject = "Event  32", StartTime = new DateTime(2024, 7, 2, 0, 30, 0), EndTime = new DateTime(2024, 7, 2, 1, 0, 0) },
new AppointmentData { Id = 107, Subject = "Event  33", StartTime = new DateTime(2024, 7, 2, 1, 0, 0), EndTime = new DateTime(2024, 7, 2, 1, 30, 0) },
new AppointmentData { Id = 108, Subject = "Event  34", StartTime = new DateTime(2024, 7, 2, 1, 30, 0), EndTime = new DateTime(2024, 7, 2, 2, 0, 0) },
new AppointmentData { Id = 109, Subject = "Event  35", StartTime = new DateTime(2024, 7, 2, 2, 0, 0), EndTime = new DateTime(2024, 7, 2, 2, 30, 0) },
new AppointmentData { Id = 110, Subject = "Event  36", StartTime = new DateTime(2024, 7, 2, 2, 30, 0), EndTime = new DateTime(2024, 7, 2, 3, 0, 0) },
new AppointmentData { Id = 111, Subject = "Event  37", StartTime = new DateTime(2024, 7, 2, 3, 0, 0), EndTime = new DateTime(2024, 7, 2, 3, 30, 0) }
            };
            return data;
        }


        public List<AppointmentData> GetAppointmentData()
        {
            List<AppointmentData> appData = new List<AppointmentData>();
            appData.Add(new AppointmentData
            {
                Id = 1,
                Subject = "Scrum call",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 7, 9, 30, 0),
                EndTime = new DateTime(2024, 1, 7, 10, 30, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 2,
                Subject = "Design Review",
                Location = "Design Lab",
                StartTime = new DateTime(2024, 1, 7, 10, 30, 0),
                EndTime = new DateTime(2024, 1, 7, 11, 30, 0)
            });
            appData.Add(new AppointmentData
            {
                Id = 3,
                Subject = "Code Review",
                Location = "Meeting Room 3",
                StartTime = new DateTime(2024, 1, 7, 11, 30, 0),
                EndTime = new DateTime(2024, 1, 7, 13, 0, 0),
            });
            appData.Add(new AppointmentData
            {
                Id = 4,
                Subject = "Lunch Break",
                Location = "Cafeteria",
                StartTime = new DateTime(2024, 1, 7, 13, 0, 0),
                EndTime = new DateTime(2024, 1, 7, 14, 0, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 5,
                Subject = "Project Meeting",
                Location = "Client's Office",
                StartTime = new DateTime(2024, 1, 7, 14, 30, 0),
                EndTime = new DateTime(2024, 1, 7, 15, 30, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 6,
                Subject = "Client Call",
                Location = "Conference Hall",
                StartTime = new DateTime(2024, 1, 7, 15, 30, 0),
                EndTime = new DateTime(2024, 1, 7, 16, 0, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 7,
                Subject = "Team Meeting",
                Location = "Meeting Room 1",
                StartTime = new DateTime(2024, 1, 7, 16, 0, 0),
                EndTime = new DateTime(2024, 1, 7, 16, 30, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 8,
                Subject = "Documentation",
                Location = "Desk",
                StartTime = new DateTime(2024, 1, 7, 16, 30, 0),
                EndTime = new DateTime(2024, 1, 7, 17, 0, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 9,
                Subject = "Email Follow-up",
                Location = "Desk",
                StartTime = new DateTime(2024, 1, 7, 17, 0, 0),
                EndTime = new DateTime(2024, 1, 7, 17, 30, 0),

            });
            appData.Add(new AppointmentData
            {
                Id = 10,
                Subject = "Wrap-up Meeting",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 7, 17, 30, 0),
                EndTime = new DateTime(2024, 1, 7, 18, 0, 0),
                IsBlock = true

            });
            appData.Add(new AppointmentData
            {
                Id = 11,
                Subject = "Scrum call",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 8, 9, 30, 0),
                EndTime = new DateTime(2024, 1, 8, 10, 30, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 12,
                Subject = "Requirement Gathering",
                Location = "Client's Office",
                StartTime = new DateTime(2024, 1, 8, 10, 30, 0),
                EndTime = new DateTime(2024, 1, 8, 12, 0, 0)
            });
            appData.Add(new AppointmentData
            {
                Id = 13,
                Subject = "Code Review",
                Location = "Meeting Room 2",
                StartTime = new DateTime(2024, 1, 8, 12, 0, 0),
                EndTime = new DateTime(2024, 1, 8, 13, 0, 0),
            });
            appData.Add(new AppointmentData
            {
                Id = 14,
                Subject = "Lunch Break",
                Location = "Cafeteria",
                StartTime = new DateTime(2024, 1, 8, 13, 0, 0),
                EndTime = new DateTime(2024, 1, 8, 14, 0, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 15,
                Subject = "Project Planning",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 8, 14, 0, 0),
                EndTime = new DateTime(2024, 1, 8, 15, 0, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 16,
                Subject = "Team Meeting",
                Location = "Meeting Room 1",
                StartTime = new DateTime(2024, 1, 8, 15, 0, 0),
                EndTime = new DateTime(2024, 1, 8, 16, 0, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 17,
                Subject = "Client Call",
                Location = "Conference Hall",
                StartTime = new DateTime(2024, 1, 8, 16, 0, 0),
                EndTime = new DateTime(2024, 1, 8, 16, 30, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 18,
                Subject = "Documentation",
                Location = "Desk",
                StartTime = new DateTime(2024, 1, 8, 16, 30, 0),
                EndTime = new DateTime(2024, 1, 8, 17, 0, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 19,
                Subject = "Email Follow-up",
                Location = "Desk",
                StartTime = new DateTime(2024, 1, 8, 17, 0, 0),
                EndTime = new DateTime(2024, 1, 8, 17, 30, 0),
            });
            appData.Add(new AppointmentData
            {
                Id = 20,
                Subject = "Wrap-up Meeting",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 8, 17, 30, 0),
                EndTime = new DateTime(2024, 1, 8, 18, 0, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 21,
                Subject = "Scrum call",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 9, 9, 30, 0),
                EndTime = new DateTime(2024, 1, 9, 10, 30, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 22,
                Subject = "Team Standup",
                Location = "Meeting Room 1",
                StartTime = new DateTime(2024, 1, 9, 10, 30, 0),
                EndTime = new DateTime(2024, 1, 9, 11, 0, 0)
            });
            appData.Add(new AppointmentData
            {
                Id = 23,
                Subject = "Client Demo",
                Location = "Client's Office",
                StartTime = new DateTime(2024, 1, 9, 11, 0, 0),
                EndTime = new DateTime(2024, 1, 9, 12, 0, 0),
            });
            appData.Add(new AppointmentData
            {
                Id = 24,
                Subject = "Lunch Break",
                Location = "Cafeteria",
                StartTime = new DateTime(2024, 1, 9, 13, 0, 0),
                EndTime = new DateTime(2024, 1, 9, 14, 0, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 25,
                Subject = "Sprint Planning",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 9, 14, 0, 0),
                EndTime = new DateTime(2024, 1, 9, 14, 30, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 26,
                Subject = "Team Sync-up",
                Location = "Meeting Room 2",
                StartTime = new DateTime(2024, 1, 9, 14, 30, 0),
                EndTime = new DateTime(2024, 1, 9, 15, 0, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 27,
                Subject = "Design Discussion",
                Location = "Design Lab",
                StartTime = new DateTime(2024, 1, 9, 15, 0, 0),
                EndTime = new DateTime(2024, 1, 9, 16, 0, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 28,
                Subject = "Code Merge",
                Location = "Development Room",
                StartTime = new DateTime(2024, 1, 9, 16, 0, 0),
                EndTime = new DateTime(2024, 1, 9, 16, 30, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 29,
                Subject = "Code Testing",
                Location = "QA Lab",
                StartTime = new DateTime(2024, 1, 9, 16, 30, 0),
                EndTime = new DateTime(2024, 1, 9, 17, 30, 0),
            });
            appData.Add(new AppointmentData
            {
                Id = 30,
                Subject = "Wrap-up Meeting",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 9, 17, 30, 0),
                EndTime = new DateTime(2024, 1, 9, 18, 0, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 31,
                Subject = "Scrum call",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 10, 9, 30, 0),
                EndTime = new DateTime(2024, 1, 10, 10, 30, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 32,
                Subject = "Requirement Analysis",
                Location = "Client's Office",
                StartTime = new DateTime(2024, 1, 10, 10, 30, 0),
                EndTime = new DateTime(2024, 1, 10, 12, 0, 0)
            });
            appData.Add(new AppointmentData
            {
                Id = 33,
                Subject = "Team Brainstorming",
                Location = "Meeting Room 3",
                StartTime = new DateTime(2024, 1, 10, 12, 0, 0),
                EndTime = new DateTime(2024, 1, 10, 13, 0, 0),
            });
            appData.Add(new AppointmentData
            {
                Id = 34,
                Subject = "Lunch Break",
                Location = "Cafeteria",
                StartTime = new DateTime(2024, 1, 10, 13, 0, 0),
                EndTime = new DateTime(2024, 1, 10, 14, 0, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 35,
                Subject = "Project Sync",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 10, 14, 0, 0),
                EndTime = new DateTime(2024, 1, 10, 14, 30, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 36,
                Subject = "Code Debugging",
                Location = "Development Room",
                StartTime = new DateTime(2024, 1, 10, 14, 30, 0),
                EndTime = new DateTime(2024, 1, 10, 16, 0, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 37,
                Subject = "Client Feedback",
                Location = "Conference Hall",
                StartTime = new DateTime(2024, 1, 10, 16, 0, 0),
                EndTime = new DateTime(2024, 1, 10, 16, 30, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 38,
                Subject = "Documentation Update",
                Location = "Desk",
                StartTime = new DateTime(2024, 1, 10, 16, 30, 0),
                EndTime = new DateTime(2024, 1, 10, 17, 0, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 39,
                Subject = "Email Follow-up",
                Location = "Desk",
                StartTime = new DateTime(2024, 1, 10, 17, 0, 0),
                EndTime = new DateTime(2024, 1, 10, 17, 30, 0),
            });
            appData.Add(new AppointmentData
            {
                Id = 40,
                Subject = "Wrap-up Meeting",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 10, 17, 30, 0),
                EndTime = new DateTime(2024, 1, 10, 18, 0, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 41,
                Subject = "Scrum call",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 11, 9, 30, 0),
                EndTime = new DateTime(2024, 1, 11, 10, 30, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 42,
                Subject = "Product Demo",
                Location = "Client's Office",
                StartTime = new DateTime(2024, 1, 11, 10, 30, 0),
                EndTime = new DateTime(2024, 1, 11, 11, 30, 0)
            });
            appData.Add(new AppointmentData
            {
                Id = 43,
                Subject = "Design Review",
                Location = "Design Lab",
                StartTime = new DateTime(2024, 1, 11, 11, 30, 0),
                EndTime = new DateTime(2024, 1, 11, 12, 30, 0),
            });
            appData.Add(new AppointmentData
            {
                Id = 44,
                Subject = "Lunch Break",
                Location = "Cafeteria",
                StartTime = new DateTime(2024, 1, 11, 13, 0, 0),
                EndTime = new DateTime(2024, 1, 11, 14, 0, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 45,
                Subject = "Sprint Retrospective",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 11, 14, 30, 0),
                EndTime = new DateTime(2024, 1, 11, 14, 30, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 46,
                Subject = "Team Sync-up",
                Location = "Meeting Room 1",
                StartTime = new DateTime(2024, 1, 11, 14, 30, 0),
                EndTime = new DateTime(2024, 1, 11, 15, 0, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 47,
                Subject = "Code Merge",
                Location = "Development Room",
                StartTime = new DateTime(2024, 1, 11, 15, 0, 0),
                EndTime = new DateTime(2024, 1, 11, 16, 0, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 48,
                Subject = "Bug Fixing",
                Location = "Development Room",
                StartTime = new DateTime(2024, 1, 11, 16, 0, 0),
                EndTime = new DateTime(2024, 1, 11, 17, 0, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 49,
                Subject = "Email Follow-up",
                Location = "Desk",
                StartTime = new DateTime(2024, 1, 11, 17, 0, 0),
                EndTime = new DateTime(2024, 1, 11, 17, 30, 0),
            });
            appData.Add(new AppointmentData
            {
                Id = 50,
                Subject = "Wrap-up Meeting",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 11, 17, 30, 0),
                EndTime = new DateTime(2024, 1, 11, 18, 0, 0),
                IsBlock = true
            });

            appData.Add(new AppointmentData
            {
                Id = 51,
                Subject = "Scrum call",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 12, 9, 30, 0),
                EndTime = new DateTime(2024, 1, 12, 10, 30, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 52,
                Subject = "Team Retrospective",
                Location = "Meeting Room 1",
                StartTime = new DateTime(2024, 1, 12, 10, 30, 0),
                EndTime = new DateTime(2024, 1, 12, 11, 30, 0)
            });
            appData.Add(new AppointmentData
            {
                Id = 53,
                Subject = "Project Presentation",
                Location = "Client's Office",
                StartTime = new DateTime(2024, 1, 12, 11, 30, 0),
                EndTime = new DateTime(2024, 1, 12, 12, 30, 0),
            });
            appData.Add(new AppointmentData
            {
                Id = 54,
                Subject = "Lunch Break",
                Location = "Cafeteria",
                StartTime = new DateTime(2024, 1, 12, 13, 0, 0),
                EndTime = new DateTime(2024, 1, 12, 14, 0, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 55,
                Subject = "Client Call",
                Location = "Conference Hall",
                StartTime = new DateTime(2024, 1, 12, 14, 0, 0),
                EndTime = new DateTime(2024, 1, 12, 14, 30, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 56,
                Subject = "Bug Triage",
                Location = "Development Room",
                StartTime = new DateTime(2024, 1, 12, 14, 30, 0),
                EndTime = new DateTime(2024, 1, 12, 15, 30, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 57,
                Subject = "Feature Discussion",
                Location = "Meeting Room 2",
                StartTime = new DateTime(2024, 1, 12, 15, 30, 0),
                EndTime = new DateTime(2024, 1, 12, 16, 30, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 58,
                Subject = "Documentation",
                Location = "Desk",
                StartTime = new DateTime(2024, 1, 12, 16, 30, 0),
                EndTime = new DateTime(2024, 1, 12, 17, 0, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 59,
                Subject = "Email Follow-up",
                Location = "Desk",
                StartTime = new DateTime(2024, 1, 12, 17, 0, 0),
                EndTime = new DateTime(2024, 1, 12, 17, 30, 0),
            });
            appData.Add(new AppointmentData
            {
                Id = 60,
                Subject = "Wrap-up Meeting",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 12, 17, 30, 0),
                EndTime = new DateTime(2024, 1, 12, 18, 0, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 61,
                Subject = "Scrum call",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 13, 9, 30, 0),
                EndTime = new DateTime(2024, 1, 13, 10, 30, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 62,
                Subject = "Requirement Gathering",
                Location = "Client's Office",
                StartTime = new DateTime(2024, 1, 13, 10, 30, 0),
                EndTime = new DateTime(2024, 1, 13, 11, 30, 0)
            });
            appData.Add(new AppointmentData
            {
                Id = 63,
                Subject = "Design Workshop",
                Location = "Design Lab",
                StartTime = new DateTime(2024, 1, 13, 11, 30, 0),
                EndTime = new DateTime(2024, 1, 13, 12, 30, 0),
            });
            appData.Add(new AppointmentData
            {
                Id = 64,
                Subject = "Lunch Break",
                Location = "Cafeteria",
                StartTime = new DateTime(2024, 1, 13, 13, 0, 0),
                EndTime = new DateTime(2024, 1, 13, 14, 0, 0),
                IsBlock = true
            });
            appData.Add(new AppointmentData
            {
                Id = 65,
                Subject = "Sprint Planning",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 13, 14, 0, 0),
                EndTime = new DateTime(2024, 1, 13, 15, 0, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 66,
                Subject = "Development Session",
                Location = "Development Room",
                StartTime = new DateTime(2024, 1, 13, 15, 0, 0),
                EndTime = new DateTime(2024, 1, 13, 16, 0, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 67,
                Subject = "Code Review",
                Location = "Meeting Room 3",
                StartTime = new DateTime(2024, 1, 13, 16, 0, 0),
                EndTime = new DateTime(2024, 1, 13, 17, 0, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 68,
                Subject = "Documentation Update",
                Location = "Desk",
                StartTime = new DateTime(2024, 1, 13, 17, 0, 0),
                EndTime = new DateTime(2024, 1, 13, 17, 30, 0),
                IsAllDay = false
            });
            appData.Add(new AppointmentData
            {
                Id = 69,
                Subject = "Email Follow-up",
                Location = "Desk",
                StartTime = new DateTime(2024, 1, 13, 17, 30, 0),
                EndTime = new DateTime(2024, 1, 13, 18, 0, 0),
            });
            appData.Add(new AppointmentData
            {
                Id = 70,
                Subject = "Wrap-up Meeting",
                Location = "Conference Room",
                StartTime = new DateTime(2024, 1, 13, 18, 0, 0),
                EndTime = new DateTime(2024, 1, 13, 18, 30, 0),
                IsBlock = true
            });


            return appData;
        }

    }
    public class AppointmentData
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public string Location { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Description { get; set; }
        public bool IsAllDay { get; set; }
        public string RecurrenceRule { get; set; }
        public string RecurrenceException { get; set; }
        public Nullable<int> RecurrenceID { get; set; }
        public bool IsBlock { get; set; }
        public int EmployeeId { get; set; }
        public string Shift { get; set; }
    }

    public class EventDetails
    {
        public string Subject { get; set; }
        public string Location { get; set; }
    }

    public class NlpData
    {
        public string Subject { get; set; }
        public DateTime Time { get; set; }
        public DateTime EndTime { get; set; }
        public TimeSpan Duration { get; set; }
        public string Location { get; set; }
        public string RecurrenceRule { get; set; }
    }
    public class ResourceData
    {
        public int Id { get; set; }
        public string EmployeeName { get; set; }
        public int EmployeeGroupId { get; set; }
    }
}
