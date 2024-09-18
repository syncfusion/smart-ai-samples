export interface predictive {
    StudentID: number;
    StudentName: string;
    FirstYearGPA: number;
    SecondYearGPA: number;
    ThirdYearGPA: number;
    FinalYearGPA?: number;
    TotalGPA?: number;
    TotalGrade?: string;
};

export let predictiveData: predictive[] = [
    { StudentID: 512001, StudentName: "John Smith", FirstYearGPA: 4.7, SecondYearGPA: 4.1, ThirdYearGPA: 5.0 },
    { StudentID: 512002, StudentName: "Emily Davis", FirstYearGPA: 3.3, SecondYearGPA: 3.5, ThirdYearGPA: 3.7 },
    { StudentID: 512003, StudentName: "Micheal Lee", FirstYearGPA: 3.9, SecondYearGPA: 3.8, ThirdYearGPA: 3.9 },
    { StudentID: 512004, StudentName: "Sarah Brown", FirstYearGPA: 2.0, SecondYearGPA: 2.7, ThirdYearGPA: 2.5 },
    { StudentID: 512005, StudentName: "James Wilson", FirstYearGPA: 3.0, SecondYearGPA: 3.5, ThirdYearGPA: 3.2 },
    { StudentID: 512006, StudentName: "Sarah Jane", FirstYearGPA: 3.7, SecondYearGPA: 3.0, ThirdYearGPA: 4.3 },
    { StudentID: 512007, StudentName: "Emily Rose", FirstYearGPA: 5.0, SecondYearGPA: 4.9, ThirdYearGPA: 4.8 },
    { StudentID: 512008, StudentName: "John Michael", FirstYearGPA: 4.0, SecondYearGPA: 4.1, ThirdYearGPA: 4.2 },
    { StudentID: 512009, StudentName: "David James", FirstYearGPA: 1.5, SecondYearGPA: 2.2, ThirdYearGPA: 2.3 },
    { StudentID: 512010, StudentName: "Mary Ann", FirstYearGPA: 2.7, SecondYearGPA: 2.1, ThirdYearGPA: 3.0 },
];