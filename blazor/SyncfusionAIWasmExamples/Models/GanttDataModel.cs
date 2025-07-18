﻿

namespace SyncfusionAIWasmExamples.Models
{
    public class GanttDataModel
    {
        public class ResourceInfoModel
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public double MaxUnit { get; set; }
        }
        public class TaskInfoModel
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string TaskType { get; set; }
            public DateTime StartDate { get; set; }
            public DateTime? EndDate { get; set; }
            public string Duration { get; set; }
            public int Progress { get; set; }
            public string Predecessor { get; set; }
            public int? ParentId { get; set; }
            public double? Work { get; set; }
            public DateTime? BaselineStartDate { get; set; }
            public DateTime? BaselineEndDate { get; set; }
            public string Status { get; set; } = string.Empty;
        }
        public class AssignmentModel
        {
            public int PrimaryId { get; set; }
            public int TaskId { get; set; }
            public int ResourceId { get; set; }
            public double Unit { get; set; }
        }
        public class MessageContent
        {
            public string role { get; set; } = string.Empty;
            public string content { get; set; } = string.Empty;
        }
        public static List<ResourceInfoModel> GetResources = new List<ResourceInfoModel>()
        {
            new ResourceInfoModel() { Id= 1, Name= "Martin Tamer" ,MaxUnit=100},
            new ResourceInfoModel() { Id= 2, Name= "Rose Fuller", MaxUnit= 100 },
            new ResourceInfoModel() { Id= 3, Name= "Margaret Buchanan" },
            new ResourceInfoModel() { Id= 4, Name= "Fuller King", MaxUnit = 100},
            new ResourceInfoModel() { Id= 5, Name= "Davolio Fuller", MaxUnit = 100 }
        };

        public static List<TaskInfoModel> GetTaskCollection()
        {
            return new List<TaskInfoModel>()
            {
                new TaskInfoModel() { Id = 1, Name = "Project initiation", StartDate = new DateTime(2021, 03, 28), EndDate = new DateTime(2021, 07, 28), TaskType ="FixedUnit", Work=128, Duration="4" },
                new TaskInfoModel() { Id = 2, Name = "Identify site location", StartDate = new DateTime(2021, 03, 29), Progress = 100, ParentId = 1, Duration="2", TaskType ="FixedUnit", Work=16 },
                new TaskInfoModel() { Id = 3, Name = "Perform soil test", StartDate = new DateTime(2021, 03, 29), ParentId = 1, Work=10, Duration="4", TaskType="FixedUnit" },
                new TaskInfoModel() { Id = 4, Name = "Soil test approval", StartDate = new DateTime(2021, 03, 29), Duration = "15", Progress = 100, ParentId = 1, Work=16, TaskType="FixedDuration" },
                new TaskInfoModel() { Id = 5, Name = "Project estimation", StartDate = new DateTime(2021, 03, 29), EndDate = new DateTime(2021, 04, 2), TaskType="FixedUnit", Duration="4" },
                new TaskInfoModel() { Id = 6, Name = "Develop floor plan for estimation", StartDate = new DateTime(2021, 03, 29), Duration = "3", Progress = 100, ParentId = 5, Work=30, TaskType="FixedUnit" },
                new TaskInfoModel() { Id = 7, Name = "List materials", StartDate = new DateTime(2021, 04, 01), Duration = "3", Progress = 30, ParentId = 5, TaskType="FixedUnit", Work=48 },
                new TaskInfoModel() { Id = 8, Name = "Estimation approval", StartDate = new DateTime(2021, 04, 01), Duration = "2", ParentId = 5, Work=60, TaskType="FixedUnit" },
                new TaskInfoModel() { Id = 9, Name = "Sign contract", StartDate = new DateTime(2021, 03, 31), EndDate = new DateTime(2021, 04, 01), Duration="3", TaskType="FixedUnit", Work=24 },
            };
        }
        public static List<TaskInfoModel> DataSourceCollection()
        {
            List<TaskInfoModel> Tasks = new List<TaskInfoModel>() {
                new TaskInfoModel() { Id = 1, Name = "Product concept", StartDate = new DateTime(2021, 04, 02), EndDate = new DateTime(2021, 04, 08), Duration = "5 days" },
                new TaskInfoModel() { Id = 2, Name = "Defining the product usage", StartDate = new DateTime(2021, 04, 02), EndDate = new DateTime(2021, 04, 08), Duration = "3", Progress = 30, ParentId = 1 },
                new TaskInfoModel() { Id = 3, Name = "Defining the target audience", StartDate = new DateTime(2021, 04, 02), EndDate = new DateTime(2021, 04, 04), Duration = "3", Progress = 40, ParentId = 1 },
                new TaskInfoModel() { Id = 4, Name = "Prepare product sketch and notes", StartDate = new DateTime(2021, 04, 05), EndDate = new DateTime(2021, 04, 08), Duration = "2", Progress = 30, ParentId = 1, Predecessor = "2" },
                new TaskInfoModel() { Id = 5, Name = "Concept approval", StartDate = new DateTime(2021, 04, 08), EndDate = new DateTime(2021, 04, 08), Duration = "0", Predecessor = "3,4" },
                new TaskInfoModel() { Id = 6, Name = "Market research", StartDate = new DateTime(2021, 04, 09), EndDate = new DateTime(2021, 04, 18), Predecessor = "2", Duration = "4", Progress = 30 },
                new TaskInfoModel() { Id = 7, Name = "Demand analysis", StartDate = new DateTime(2021, 04, 09), EndDate = new DateTime(2021, 04, 12), Duration = "4", Progress = 40, ParentId = 6 },
                new TaskInfoModel() { Id = 8, Name = "Customer strength", StartDate = new DateTime(2021, 04, 09), EndDate = new DateTime(2021, 04, 12), Duration = "4", Progress = 30, ParentId = 7, Predecessor = "5" },
                new TaskInfoModel() { Id = 9, Name = "Market opportunity analysis", StartDate = new DateTime(2021, 04, 09), EndDate = new DateTime(2021, 04, 12), Duration = "4", ParentId = 7, Predecessor = "5" },
                new TaskInfoModel() { Id = 10, Name = "Competitor analysis", StartDate = new DateTime(2021, 04, 15), EndDate = new DateTime(2021, 04, 18), Duration = "4", Progress = 30, ParentId = 6, Predecessor = "7,8" },
            };
            return Tasks;
        }
        public static List<TaskInfoModel> GetBaselineCollection()
        {
            List<TaskInfoModel> Tasks = new List<TaskInfoModel>() {
                new TaskInfoModel() { Id = 1, Name = "Project initiation", StartDate = new DateTime(2021, 04, 02), EndDate = new DateTime(2021, 04, 06) },
                new TaskInfoModel() { Id = 2, Name = "Identify site location", StartDate = new DateTime(2021, 04, 02), EndDate = new DateTime(2021, 04, 02), Duration = "1", BaselineStartDate = new DateTime(2021, 04, 02), BaselineEndDate = new DateTime(2021, 04, 02), Progress = 30, ParentId = 1 },
                new TaskInfoModel() { Id = 3, Name = "Perform soil test", StartDate = new DateTime(2021, 04, 02), Duration = "5", Progress = 40, BaselineStartDate = new DateTime(2021, 04, 02), BaselineEndDate = new DateTime(2021, 04, 10), ParentId = 1 },
                new TaskInfoModel() { Id = 4, Name = "Soil test approval", StartDate = new DateTime(2021, 04, 08), Duration = "2", EndDate = new DateTime(2021, 04, 09), BaselineStartDate = new DateTime(2021, 04, 08), BaselineEndDate = new DateTime(2021, 04, 12), Progress = 30, ParentId = 1 },
                new TaskInfoModel() { Id = 5, Name = "Project initiation", StartDate = new DateTime(2021, 04, 02), EndDate = new DateTime(2021, 04, 08) },
                new TaskInfoModel() { Id = 6, Name = "Identify site location", StartDate = new DateTime(2021, 04, 02), Duration = "6", Progress = 30, ParentId = 5, BaselineStartDate = new DateTime(2021, 04, 02), BaselineEndDate = new DateTime(2021, 04, 09) },
                new TaskInfoModel() { Id = 7, Name = "Perform soil test", StartDate = new DateTime(2021, 04, 02), Duration = "4", Progress = 40, ParentId = 5, BaselineStartDate = new DateTime(2021, 04, 02), BaselineEndDate = new DateTime(2021, 04, 07) },
                new TaskInfoModel() { Id = 8, Name = "Soil test approval", Status="Critical", StartDate = new DateTime(2021, 04, 02), Duration = "5", Progress = 30, ParentId = 5, BaselineStartDate = new DateTime(2021, 04, 02), BaselineEndDate = new DateTime(2021, 04, 04) },
            };
            return Tasks;
        }

        public static List<TaskInfoModel> HistoricalTaskData => new()
        {
            new TaskInfoModel { Id = 1, Name = "Requirement Analysis", StartDate = new DateTime(2026, 1, 10), EndDate = new DateTime(2026, 1, 15), Duration = "5", Progress = 100, ParentId = null },
            new TaskInfoModel { Id = 2, Name = "UI/UX Design", StartDate = new DateTime(2026, 1, 15), EndDate = new DateTime(2026, 1, 17), Duration = "2", Progress = 0, ParentId = null },
            new TaskInfoModel { Id = 3, Name = "Backend Development", StartDate = new DateTime(2026, 1, 20), EndDate = new DateTime(2026, 1, 23), Duration = "3", Progress = 50, ParentId = null },
            new TaskInfoModel { Id = 4, Name = "Database Schema Design", StartDate = new DateTime(2026, 1, 18), EndDate = new DateTime(2026, 1, 24), Duration = "6", Progress = 0, ParentId = null },
            new TaskInfoModel { Id = 5, Name = "Frontend Development", StartDate = new DateTime(2026, 1, 22), EndDate = new DateTime(2026, 1, 27), Duration = "5", Progress = 80, ParentId = null },
            new TaskInfoModel { Id = 6, Name = "Testing Phase", StartDate = new DateTime(2026, 1, 25), EndDate = new DateTime(2026, 1, 30), Duration = "6", Progress = 20, ParentId = null },
            new TaskInfoModel { Id = 7, Name = "Deployment Preparation", StartDate = new DateTime(2026, 1, 28), EndDate = new DateTime(2026, 2, 5), Duration = "9", Progress = 10, ParentId = null },
            new TaskInfoModel { Id = 8, Name = "User Documentation", StartDate = new DateTime(2026, 2, 1), EndDate = new DateTime(2026, 2, 10), Duration = "10", Progress = 30, ParentId = null },
            new TaskInfoModel { Id = 9, Name = "Security Audit", StartDate = new DateTime(2026, 2, 5), EndDate = new DateTime(2026, 2, 15), Duration = "11", Progress = 40, ParentId = null },

        };

        public static List<AssignmentModel> GetAssignmentCollection()
        {
            List<AssignmentModel> assignments = new List<AssignmentModel>()
            {
                new AssignmentModel(){ PrimaryId=1, TaskId = 2, ResourceId=1, Unit=100},
                new AssignmentModel(){ PrimaryId=2, TaskId = 3, ResourceId=1, Unit=50},
                new AssignmentModel(){ PrimaryId=3, TaskId = 4, ResourceId=3, Unit=40},
                new AssignmentModel(){ PrimaryId=4, TaskId = 6, ResourceId=3, Unit = 100},
            };
            return assignments;
        }

        public static List<AssignmentModel> ResourceAssignmentCollection()
        {
            List<AssignmentModel> assignments = new List<AssignmentModel>()
            {
                new AssignmentModel(){ PrimaryId=1, TaskId = 2, ResourceId=1},
                new AssignmentModel(){ PrimaryId=2, TaskId = 3, ResourceId=1},
                new AssignmentModel(){ PrimaryId=3, TaskId = 3, ResourceId=3},
                new AssignmentModel(){ PrimaryId=4, TaskId = 4, ResourceId=3},
                new AssignmentModel(){ PrimaryId=5, TaskId = 4, ResourceId=5},
            };
            return assignments;
        }

        public static List<TaskInfoModel> TaskDataCollection => new()
        {
            new TaskInfoModel() { Id = 1, Name = "Product concept", StartDate = new DateTime(2026, 04, 02), EndDate = new DateTime(2026, 04, 08), Duration = "5 days" },
            new TaskInfoModel() { Id = 2, Name = "Defining the product usage", StartDate = new DateTime(2026, 04, 02), EndDate = new DateTime(2026, 04, 08), Duration = "3", Progress = 30, ParentId = 1 },
            new TaskInfoModel() { Id = 3, Name = "Defining the target audience", StartDate = new DateTime(2026, 04, 02), EndDate = new DateTime(2026, 04, 04), Duration = "3", Progress = 40, ParentId = 1 },
            new TaskInfoModel() { Id = 4, Name = "Prepare product sketch and notes", StartDate = new DateTime(2026, 04, 05), EndDate = new DateTime(2026, 04, 08), Duration = "2", Progress = 30, ParentId = 1, Predecessor = "2" },
            new TaskInfoModel() { Id = 5, Name = "Concept approval", StartDate = new DateTime(2026, 04, 08), EndDate = new DateTime(2026, 04, 08), Duration = "0", Predecessor = "3,4", ParentId=1 },
            new TaskInfoModel() { Id = 6, Name = "Market research", StartDate = new DateTime(2026, 04, 09), EndDate = new DateTime(2026, 04, 18), Predecessor = "2", Duration = "4", Progress = 30 },
            new TaskInfoModel() { Id = 7, Name = "Demand analysis", StartDate = new DateTime(2026, 04, 09), EndDate = new DateTime(2026, 04, 12), Duration = "4", Progress = 40, ParentId = 6 },
            new TaskInfoModel() { Id = 8, Name = "Customer strength", StartDate = new DateTime(2026, 04, 09), EndDate = new DateTime(2026, 04, 12), Duration = "4", Progress = 30, ParentId = 7, Predecessor = "5" },
            new TaskInfoModel() { Id = 9, Name = "Market opportunity analysis", StartDate = new DateTime(2026, 04, 09), EndDate = new DateTime(2026, 04, 12), Duration = "4", ParentId = 7, Predecessor = "5" },
            new TaskInfoModel() { Id = 10, Name = "Competitor analysis", StartDate = new DateTime(2026, 04, 15), EndDate = new DateTime(2026, 04, 18), Duration = "4", Progress = 30, ParentId = 6, Predecessor = "7,8" }
        };
    }
}
