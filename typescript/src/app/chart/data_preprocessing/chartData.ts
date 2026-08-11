export interface ChartData {
    Time: Date;
    Visitors: number | null;
    Color?: string;
}

export const originalList: ChartData[] = [
    { Time: new Date(2024, 6, 1, 0, 0, 0), Visitors: 150 },
    { Time: new Date(2024, 6, 1, 1, 0, 0), Visitors: 160 },
    { Time: new Date(2024, 6, 1, 2, 0, 0), Visitors: 155 },
    { Time: new Date(2024, 6, 1, 3, 0, 0), Visitors: null },
    { Time: new Date(2024, 6, 1, 4, 0, 0), Visitors: 170 },
    { Time: new Date(2024, 6, 1, 5, 0, 0), Visitors: 175 },
    { Time: new Date(2024, 6, 1, 6, 0, 0), Visitors: 145 },
    { Time: new Date(2024, 6, 1, 7, 0, 0), Visitors: 180 },
    { Time: new Date(2024, 6, 1, 8, 0, 0), Visitors: null },
    { Time: new Date(2024, 6, 1, 9, 0, 0), Visitors: 185 },
    { Time: new Date(2024, 6, 1, 10, 0, 0), Visitors: 200 },
    { Time: new Date(2024, 6, 1, 11, 0, 0), Visitors: null },
    { Time: new Date(2024, 6, 1, 12, 0, 0), Visitors: 220 },
    { Time: new Date(2024, 6, 1, 13, 0, 0), Visitors: 230 },
    { Time: new Date(2024, 6, 1, 14, 0, 0), Visitors: null },
    { Time: new Date(2024, 6, 1, 15, 0, 0), Visitors: 250 },
    { Time: new Date(2024, 6, 1, 16, 0, 0), Visitors: 260 },
    { Time: new Date(2024, 6, 1, 17, 0, 0), Visitors: 270 },
    { Time: new Date(2024, 6, 1, 18, 0, 0), Visitors: null },
    { Time: new Date(2024, 6, 1, 19, 0, 0), Visitors: 280 },
    { Time: new Date(2024, 6, 1, 20, 0, 0), Visitors: 250 },
    { Time: new Date(2024, 6, 1, 21, 0, 0), Visitors: 290 },
    { Time: new Date(2024, 6, 1, 22, 0, 0), Visitors: 300 },
    { Time: new Date(2024, 6, 1, 23, 0, 0), Visitors: null }
];
