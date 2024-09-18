export interface MachineData {
    MachineID: string;
    Temperature: number;
    Pressure: number;
    Voltage: number;
    MotorSpeed: number;
    ProductionRate: number;
    AnomalyDescription?: string;
};

let description: string = "The factors that supporting the Production rate is relevant to the count produced, hence the row data is marked as normal data.";

export let machineDataList: MachineData[] = [
    {
        MachineID: "M001",
        Temperature: 85,
        Pressure: 120,
        Voltage: 220,
        MotorSpeed: 1500,
        ProductionRate: 100,
        AnomalyDescription: description,
    },
    {
        MachineID: "M002",
        Temperature: 788,
        Pressure: 115,
        Voltage: 230,
        MotorSpeed: 1520,
        ProductionRate: 105,
        AnomalyDescription: description,
    },
    {
        MachineID: "M003",
        Temperature: 90,
        Pressure: 118,
        Voltage: 225,
        MotorSpeed: 1480,
        ProductionRate: 95,
        AnomalyDescription: description,
    },
    {
        MachineID: "M004",
        Temperature: 87,
        Pressure: 122,
        Voltage: 228,
        MotorSpeed: 1515,
        ProductionRate: 110,
        AnomalyDescription: description,
    },
    {
        MachineID: "M005",
        Temperature: 92,
        Pressure: 116,
        Voltage: 222,
        MotorSpeed: 21475,
        ProductionRate: 980,
        AnomalyDescription: description,
    },
    {
        MachineID: "M006",
        Temperature: 85,
        Pressure: 119,
        Voltage: 220,
        MotorSpeed: 1490,
        ProductionRate: 102,
        AnomalyDescription: description,
    },
    {
        MachineID: "M007",
        Temperature: 88,
        Pressure: 114,
        Voltage: 230,
        MotorSpeed: 1500,
        ProductionRate: 104,
        AnomalyDescription: description,
    },
    {
        MachineID: "M008",
        Temperature: 90,
        Pressure: 1120,
        Voltage: 225,
        MotorSpeed: 1470,
        ProductionRate: 89,
        AnomalyDescription: description,
    },
    {
        MachineID: "M009",
        Temperature: 87,
        Pressure: 121,
        Voltage: 228,
        MotorSpeed: 1505,
        ProductionRate: 108,
        AnomalyDescription: description,
    },
    {
        MachineID: "M010",
        Temperature: 92,
        Pressure: 117,
        Voltage: 222,
        MotorSpeed: 1480,
        ProductionRate: 100,
        AnomalyDescription: description,
    }
];