export let taskDetails: object[] = [
    {
        Id: "Task 1",
        Title: "Task - 29001",
        Status: "Open",
        Summary: "Analyze the new requirements gathered from the customer",
        Type: "Story",
        Priority: "Low",
        CardTags: "Analyze, Customer",
        Estimate: 3.5,
        Assignee: "Nancy Davloio",
        AssigneeKey: "Nancy Davloio",
        RankId: 1,
        Color: "#8b447a",
        ClassName: "e-story, e-low, e-nancy",
        Timeline: "2024-06-20 to 2024-06-25",
        AssigneeAvailability: true
    },
    {
        Id: "Task 2",
        Title: "Task - 29002",
        Status: "In Progress",
        Summary: "Improve application performance",
        Type: "Improvement",
        Priority: "Normal",
        CardTags: "Improvement",
        Estimate: 6,
        Assignee: "Andrew Fuller",
        AssigneeKey: "Andrew Fuller",
        RankId: 1,
        Color: "#7d7297",
        ClassName: "e-improvement, e-normal, e-andrew",
        Timeline: "2024-06-20 to 2024-06-26",
        AssigneeAvailability: true
    },
    {
        Id: "Task 3",
        Title: "Task - 29003",
        Status: "Open",
        Summary: "Arrange a web meeting with the customer to get new requirements",
        Type: "Others",
        Priority: "Critical",
        CardTags: "Meeting",
        Estimate: 5.5,
        Assignee: "Janet Leverling",
        AssigneeKey: "Janet Leverling",
        RankId: 2,
        Color: "#27AE60",
        ClassName: "e-others, e-critical, e-janet",
        Timeline: "2024-06-20 to 2024-06-25",
        AssigneeAvailability: false
    },
    {
        Id: "Task 4",
        Title: "Task - 29004",
        Status: "In Progress",
        Summary: "Fix the issues reported in the IE browser",
        Type: "Bug",
        Priority: "Release Breaker",
        CardTags: "IE",
        Estimate: 2.5,
        Assignee: "Janet Leverling",
        AssigneeKey: "Janet Leverling",
        RankId: 2,
        Color: "#cc0000",
        ClassName: "e-bug, e-release, e-janet",
        Timeline: "2024-06-21 to 2024-06-23",
        AssigneeAvailability: false
    },
    {
        Id: "Task 5",
        Title: "Task - 29005",
        Status: "Review",
        Summary: "Fix the issues reported by the customer",
        Type: "Bug",
        Priority: "Low",
        CardTags: "Customer",
        Estimate: 3.5,
        Assignee: "Steven Walker",
        AssigneeKey: "Steven Walker",
        RankId: 1,
        Color: "#cc0000",
        ClassName: "e-bug, e-low, e-steven",
        Timeline: "2024-06-22 to 2024-06-25",
        AssigneeAvailability: true
    },
    {
        Id: "Task 6",
        Title: "Task - 29007",
        Status: "Validate",
        Summary: "Validate new requirements",
        Type: "Improvement",
        Priority: "Low",
        CardTags: "Validation",
        Estimate: 1.5,
        Assignee: "Robert King",
        AssigneeKey: "Robert King",
        RankId: 1,
        Color: "#7d7297",
        ClassName: "e-improvement, e-low, e-robert",
        Timeline: "2024-06-23 to 2024-06-24",
        AssigneeAvailability: false
    },
    {
        Id: "Task 7",
        Title: "Task - 29009",
        Status: "Review",
        Summary: "Fix the issues reported in Safari browser",
        Type: "Bug",
        Priority: "Release Breaker",
        CardTags: "Fix, Safari",
        Estimate: 1.5,
        Assignee: "Nancy Davloio",
        AssigneeKey: "Nancy Davloio",
        RankId: 2,
        Color: "#cc0000",
        ClassName: "e-bug, e-release, e-nancy",
        Timeline: "2024-06-23 to 2024-06-24",
        AssigneeAvailability: true
    },
    {
        Id: "Task 8",
        Title: "Task - 29010",
        Status: "Close",
        Summary: "Test the application in the IE browser",
        Type: "Story",
        Priority: "Low",
        CardTags: "Review, IE",
        Estimate: 5.5,
        Assignee: "Margaret Hamilt",
        AssigneeKey: "Margaret Hamilt",
        RankId: 3,
        Color: "#8b447a",
        ClassName: "e-story, e-low, e-Margaret",
        Timeline: "2024-06-20 to 2024-06-25",
        AssigneeAvailability: false
    },
    {
        Id: "Task 9",
        Title: "Task - 29011",
        Status: "Validate",
        Summary: "Validate the issues reported by the customer",
        Type: "Story",
        Priority: "High",
        CardTags: "Validation, Fix",
        Estimate: 1,
        Assignee: "Steven Walker",
        AssigneeKey: "Steven Walker",
        RankId: 1,
        Color: "#8b447a",
        ClassName: "e-story, e-low, e-nancy",
        Timeline: "2024-06-23 to 2024-06-24",
        AssigneeAvailability: true
    },
    {
        Id: "Task 10",
        Title: "Task - 29015",
        Status: "Open",
        Summary: "Show the retrieved data from the server in grid control",
        Type: "Story",
        Priority: "High",
        CardTags: "Database, SQL",
        Estimate: 5.5,
        Assignee: "Margaret Hamilt",
        AssigneeKey: "Margaret Hamilt",
        RankId: 4,
        Color: "#8b447a",
        ClassName: "e-story, e-high, e-steven",
        Timeline: "2024-06-22 to 2024-06-27",
        AssigneeAvailability: false
    },
    {
        Id: "Task 11",
        Title: "Task - 29016",
        Status: "In Progress",
        Summary: "Fix cannot open user’s default database SQL error.",
        Type: "Critical Bug",
        Priority: "High",
        CardTags: "Fix, SQL",
        Estimate: 2.5,
        Assignee: "Margaret Hamilt",
        AssigneeKey: "Margaret Hamilt",
        RankId: 4,
        Color: "#cc0000",
        ClassName: "e-bug, e-release, e-nancy",
        Timeline: "2024-06-20 to 2024-06-23",
        AssigneeAvailability: false
    },
    {
        Id: "Task 12",
        Title: "Task - 29017",
        Status: "Review",
        Summary: "Fix the issues reported in data binding.",
        Type: "Story",
        Priority: "Normal",
        CardTags: "Validation, Fix",
        Estimate: 3.5,
        Assignee: "Margaret Hamilt",
        AssigneeKey: "Margaret Hamilt",
        RankId: 4,
        Color: "#8b447a",
        ClassName: "e-story, e-normal, e-steven",
        Timeline: "2024-06-22 to 2024-06-25",
        AssigneeAvailability: false
    },
    {
        Id: "Task 13",
        Title: "Task - 29018",
        Status: "Close",
        Summary: "Analyze stored procedures.",
        Type: "Others",
        Priority: "Critical",
        CardTags: "Database, SQL",
        Estimate: 2,
        Assignee: "Andrew Fuller",
        AssigneeKey: "Andrew Fuller",
        RankId: 3,
        Color: "#27AE60",
        ClassName: "e-others, e-critical, e-nancy",
        Timeline: "2024-06-20 to 2024-06-23",
        AssigneeAvailability: true
    },
    {
        Id: "Task 14",
        Title: "Task - 29019",
        Status: "Validate",
        Summary: "Validate editing issues.",
        Type: "Story",
        Priority: "Critical",
        CardTags: "Fix",
        Estimate: 1,
        Assignee: "Robert King",
        AssigneeKey: "Robert King",
        RankId: 2,
        Color: "#8b447a",
        ClassName: "e-story, e-low, e-steven",
        Timeline: "2024-06-21 to 2024-06-23",
        AssigneeAvailability: false
    },
    {
        Id: "Task 15",
        Title: "Task - 29020",
        Status: "Review",
        Summary: "Test editing functionality.",
        Type: "Story",
        Priority: "Normal",
        CardTags: "Testing",
        Estimate: 0.5,
        Assignee: "Janet Leverling",
        AssigneeKey: "Janet Leverling",
        RankId: 4,
        Color: "#8b447a",
        ClassName: "e-story, e-normal, e-andrew",
        Timeline: "2024-06-22 to 2024-06-23",
        AssigneeAvailability: false
    },
    {
        Id: "Task 16",
        Title: "Task - 29021",
        Status: "In Progress",
        Summary: "Implement login functionality.",
        Type: "Feature",
        Priority: "High",
        CardTags: "Authentication",
        Estimate: 4.5,
        Assignee: "Andrew Fuller",
        AssigneeKey: "Andrew Fuller",
        RankId: 1,
        Color: "#7d7297",
        ClassName: "e-feature, e-high, e-andrew",
        Timeline: "2024-06-20 to 2024-06-24",
        AssigneeAvailability: true
    },
    {
        Id: "Task 17",
        Title: "Task - 29022",
        Status: "Open",
        Summary: "Update user profile page.",
        Type: "Improvement",
        Priority: "Normal",
        CardTags: "UI",
        Estimate: 3,
        Assignee: "Janet Leverling",
        AssigneeKey: "Janet Leverling",
        RankId: 2,
        Color: "#7d7297",
        ClassName: "e-improvement, e-normal, e-janet",
        Timeline: "2024-06-20 to 2024-06-25",
        AssigneeAvailability: false
    },
    {
        Id: "Task 18",
        Title: "Task - 29023",
        Status: "Close",
        Summary: "Refactor codebase for better performance.",
        Type: "Improvement",
        Priority: "Critical",
        CardTags: "Refactor",
        Estimate: 6,
        Assignee: "Margaret Hamilt",
        AssigneeKey: "Margaret Hamilt",
        RankId: 2,
        Color: "#27AE60",
        ClassName: "e-improvement, e-critical, e-margaret",
        Timeline: "2024-06-20 to 2024-06-26",
        AssigneeAvailability: false
    },
    {
        Id: "Task 19",
        Title: "Task - 29024",
        Status: "Validate",
        Summary: "Test performance improvements.",
        Type: "Story",
        Priority: "High",
        CardTags: "Testing",
        Estimate: 1.5,
        Assignee: "Steven Walker",
        AssigneeKey: "Steven Walker",
        RankId: 3,
        Color: "#8b447a",
        ClassName: "e-story, e-high, e-steven",
        Timeline: "2024-06-20 to 2024-06-21",
        AssigneeAvailability: true
    },
    {
        Id: "Task 20",
        Title: "Task - 29025",
        Status: "In Progress",
        Summary: "Implement dark mode feature.",
        Type: "Feature",
        Priority: "Normal",
        CardTags: "UI",
        Estimate: 5,
        Assignee: "Robert King",
        AssigneeKey: "Robert King",
        RankId: 2,
        Color: "#7d7297",
        ClassName: "e-feature, e-normal, e-robert",
        Timeline: "2024-06-21 to 2024-06-26",
        AssigneeAvailability: false
    }
];

export const kanbanStyles = `
@import url('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');

.tailwind-dark .e-kanban .e-kanban-header .e-header-cells .e-item-count,
.tailwind .e-kanban .e-kanban-header .e-header-cells .e-item-count,
.bootstrap5-dark .e-kanban .e-kanban-header .e-header-cells .e-item-count,
.bootstrap5 .e-kanban .e-kanban-header .e-header-cells .e-item-count {
margin-top: 3px;
}

.e-kanban .header-template-wrap {
display: inline-flex;
font-size: 15px;
font-weight: 500;
}

.e-kanban .header-template-wrap .header-icon {
font-family: 'Kanban priority icons';
margin-top: 3px;
width: 10%;
}

.e-kanban .header-template-wrap .header-text {
margin-left: 15px;
}

.e-kanban.e-rtl .header-template-wrap .header-text {
margin-right: 15px;
}

.e-kanban.e-rtl .e-card-avatar {
left: 12px;
right: auto;
}

.e-kanban .e-card-avatar {
width: 30px;
height: 30px;
text-align: center;
background: gainsboro;
color: #6b6b6b;
border-radius: 50%;
position: absolute;
right: 12px;
bottom: 10px;
font-size: 12px;
font-weight: 400;
padding: 7px 3px;
}

.bootstrap5 .e-kanban .e-card-avatar,
.bootstrap5-dark .e-kanban .e-card-avatar,
.tailwind .e-kanban .e-card-avatar,
.tailwind-dark .e-kanban .e-card-avatar {
padding: 8px 3px;
}

.e-kanban .Open::before {
content: '\e700';
color: #0251cc;
font-size: 16px;
}

.e-kanban .In.Progress::before {
content: '\e703';
color: #ea9713;
font-size: 16px;
}

.e-kanban .e-image img {
background: #ececec;
border: 1px solid #c8c8c8;
border-radius: 50%;
}

.e-kanban .Review::before {
content: '\e701';
color: #8e4399;
font-size: 16px;
}

.e-kanban .Close::before {
content: '\e702';
color: #63ba3c;
font-size: 16px;
}

.e-kanban .e-card .e-card-tag {
background: #ececec;
color: #6b6b6b;
margin-right: 5px;
line-height: 1.1;
font-size: 13px;
border-radius: 3px;
padding: 4px;
}

.e-kanban .e-card-footer {
display: flex;
padding: 0px 12px 12px;
line-height: 1;
height: 35px;
}

.bootstrap5 .e-kanban .e-card-footer,
.bootstrap5-dark .e-kanban .e-card-footer {
height: 51px;
}

.tailwind .e-kanban .e-card-footer,
.tailwind-dark .e-kanban .e-card-footer {
height: 41px;
}

.bootstrap5.e-bigger .e-kanban .e-card-footer,
.bootstrap5-dark.e-bigger .e-kanban .e-card-footer,
.tailwind.e-bigger .e-kanban .e-card-footer,
.tailwind-dark.e-bigger .e-kanban .e-card-footer {
height: 37px;
}

.e-kanban .e-kanban-content .e-content-row .e-content-cells .e-card-wrapper .e-card.Low.e-selection:hover,
.card-template.Low {
border-left: 3px solid #ffd600
}

.e-kanban .e-kanban-content .e-content-row .e-content-cells .e-card-wrapper .e-card.High.e-selection:hover,
.card-template.High {
border-left: 3px solid #990099
}

.e-kanban .e-kanban-content .e-content-row .e-content-cells .e-card-wrapper .e-card.Normal.e-selection:hover,
.card-template.Normal {
border-left: 3px solid #66cc33
}

.e-kanban .e-kanban-content .e-content-row .e-content-cells .e-card-wrapper .e-card.Critical.e-selection:hover,
.card-template.Critical {
border-left: 3px solid #cc0000
}

.e-kanban.e-rtl .card-template {
border-left: none
}

@font-face {
font-family: 'Kanban priority icons';
src: url(data:application/x-font-ttf;charset=utf-8;base64,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) format('truetype');
font-weight: normal;
font-style: normal;
}

[class^="sf-icon-"],
[class*=" sf-icon-"] {
font-family: 'Kanban priority icons' !important;
speak: none;
font-size: 55px;
font-style: normal;
font-weight: normal;
font-variant: normal;
text-transform: none;
line-height: 1;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
}

.fluent .e-kanban .e-kanban-content .e-content-row .e-content-cells .e-card-wrapper .e-card .e-card-tag,
.fluent .e-kanban .e-kanban-content .e-content-row .e-content-cells .e-card-container .e-card .e-card-tag,
.fluent-dark .e-kanban .e-kanban-content .e-content-row .e-content-cells .e-card-wrapper .e-card .e-card-tag,
.fluent-dark .e-kanban .e-kanban-content .e-content-row .e-content-cells .e-card-container .e-card .e-card-tag {
padding: 0px 4px;
font-size: 12px;
}

.fluent .e-kanban .e-card-avatar {
padding: 7px 4px;
}

.container {
display: flex;
flex-direction: column;
height: 100vh;
padding: 20px;
width: 80%;
}

.row {
background-color: #fff;
border: 1px solid #ccc;
border-radius: 10px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
margin: 20px;
padding: 20px;
}

.row-small {
flex: 0 1 auto;
display: flex;
justify-content: start;
align-items: start;
padding: 5px !important;
margin-bottom: 5px !important;
}

.row-large {
flex: 1;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
margin-bottom: 0;
}

.form-table {
width: 100%;
border-collapse: collapse;
}

.form-table th,
.form-table td {
padding: 10px;
text-align: left;
}

.form-table th {
font-weight: bold;
text-align: center;
}

.custom-dialog .e-dialog .e-dlg-header {
text-align: center;
}

.form-input {
width: 100%;
padding: 8px;
box-sizing: border-box;
border: 1px solid #ccc;
border-radius: 4px;
}

#Description {
height: 100px;
}

.custom-row-kanban-1 {
padding-left: 12px !important;
padding-right: 12px !important;
padding-top: 0px !important;
padding-bottom: 0px !important;
height: 100%;
}

.custom-row-kanban-1,
.custom-row-kanban-2 {
display: flex;
flex-wrap: wrap;
}

.cuscol-0,
.cuscol-1,
.cuscol-2,
.cuscol-01 {
padding: 0.5rem;
}

.no-results-found {
text-align: center;
margin-top: 2rem;
}

.no-results-found img {
display: block;
margin: 0 auto;
}

.cuscol-2 {
padding: 20px;
}

.h-100 {
height: 100%;
}

.w-100 {
width: 100%;
}

.cuscol-1 {
display: flex;
flex-direction: column !important;
}

.cuscol-2 {
display: flex;
flex-direction: column !important;
}

textarea {
resize: none !important;
}

textarea.e-input,
.e-input-group textarea.e-input,
.e-input-group.e-control-wrapper textarea.e-input {
height: 100px;
}

.e-left {
flex: 3;
}

.e-right {
flex: 7;
}

#projectDetailsDialog .custom-dialog .e-dialog .e-dlg-header {
text-align: center;
}

.text-center {
text-align: center !important;
}

.my-3 {
margin-top: 1rem !important;
margin-bottom: 1rem !important;
}

.col-12 {
flex: 0 0 auto;
width: 100%;
}
`;