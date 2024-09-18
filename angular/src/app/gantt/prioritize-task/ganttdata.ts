export let tasksCollection = [
    {
        Id: 1,
        Name: "Project initiation",
        StartDate: new Date('04/02/2021'),
        EndDate: new Date('04/06/2021'),
        BaselineStartDate: new Date('04/02/2021'),
        BaselineEndDate: new Date('04/06/2021'),
    },
    {
        Id: 2,
        Name: "Identify site location",
        StartDate: new Date('04/02/2021'),
        EndDate: new Date('04/06/2021'),
        Progress: 30,
        ParentId: 1,
        BaselineStartDate: new Date('04/02/2021'),
        BaselineEndDate: new Date('04/10/2021'),
        resourceInfo: [{ Id: 1, Name: "Martin Tamer" ,MaxUnit:100}]
    },
    {
        Id: 3,
        Name: "Perform soil test",
        StartDate: new Date('04/08/2021'),
        EndDate: new Date('04/18/2021'),
        Progress: 40,
        ParentId: 1,
        BaselineStartDate: new Date('04/02/2021'),
        BaselineEndDate: new Date('04/10/2021'),
        resourceInfo: [{ Id: 1, Name: "Martin Tamer" ,MaxUnit:100}]
    },
    {
        Id: 4,
        Name: "Soil test approval",
        StartDate: new Date('04/08/2021'),
        EndDate: new Date('04/19/2021'),
        Progress: 30,
        ParentId: 1,
        BaselineStartDate: new Date('04/08/2021'),
        BaselineEndDate: new Date('04/15/2021'),
        resourceInfo: [{ Id: 3, Name: "Margaret Buchanan", MaxUnit: 100 }]
    },
    {
        Id: 5,
        Name: "Project initiation",
        StartDate: new Date('04/02/2021'),
        EndDate: new Date('04/08/2021'),
    },
    {
        Id: 6,
        Name: "Identify site location",
        StartDate: new Date('04/16/2021'),
        EndDate: new Date('04/22/2021'),
        Progress: 30,
        ParentId: 5,
        BaselineStartDate: new Date('04/02/2021'),
        BaselineEndDate: new Date('04/14/2021'),
        resourceInfo: [{ Id: 3, Name: "Margaret Buchanan", MaxUnit: 100 }]
    },
    {
        Id: 7,
        Name: "Perform soil test",
        StartDate: new Date('04/02/2021'),
        EndDate: new Date('04/03/2021'),
        Progress: 40,
        ParentId: 5,
        BaselineStartDate: new Date('04/02/2021'),
        BaselineEndDate: new Date('04/07/2021'),
        resourceInfo: [{ Id: 4, Name: "Fuller King", MaxUnit: 100}]
    },
    {
        Id: 8,
        Name: "Soil test approval",
        StartDate: new Date('04/02/2021'),
        EndDate: new Date('04/02/2021'),
        Progress: 30,
        ParentId: 5,
        BaselineStartDate: new Date('04/02/2021'),
        BaselineEndDate: new Date('04/06/2021'),
        resourceInfo: [{ Id: 5, Name: "Davolio Fuller", MaxUnit: 100 }]
    }
];
export let resourceCollection = [
    { Id: 1, Name: "Martin Tamer" ,MaxUnit:100},
    { Id: 2, Name: "Rose Fuller", MaxUnit: 100 },
    { Id: 3, Name: "Margaret Buchanan", MaxUnit: 100 },
    { Id: 4, Name: "Fuller King", MaxUnit: 100},
    { Id: 5, Name: "Davolio Fuller", MaxUnit: 100 },
    { Id: 6, Name: "Laura Callahan", MaxUnit: 100 },
    { Id: 7, Name: "Andrew Fuller", MaxUnit: 100 },
    { Id: 8, Name: "Nancy Davolio", MaxUnit: 100 },
    { Id: 9, Name: "Janet Leverling", MaxUnit: 100 }
];