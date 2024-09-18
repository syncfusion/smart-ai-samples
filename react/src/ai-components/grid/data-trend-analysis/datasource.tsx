export interface MonthlyData {
    Month: string;
    Sales: number;
    MarketingSpend: number;
    NewCustomers: number;
    ReturningCustomers: number;
    TrendColumn?: string;
};

export let OverallData: MonthlyData[] = [
    { Month: "January 2022", Sales: 51000, MarketingSpend: 9000, NewCustomers: 180, ReturningCustomers: 150 },
    { Month: "February 2022", Sales: 46000, MarketingSpend: 9200, NewCustomers: 190, ReturningCustomers: 160 },
    { Month: "March 2022", Sales: 45000, MarketingSpend: 9400, NewCustomers: 200, ReturningCustomers: 155 },
    { Month: "April 2022", Sales: 48000, MarketingSpend: 9600, NewCustomers: 210, ReturningCustomers: 165 },
    { Month: "May 2022", Sales: 49000, MarketingSpend: 9800, NewCustomers: 220, ReturningCustomers: 170 },
    { Month: "June 2022", Sales: 52000, MarketingSpend: 9600, NewCustomers: 210, ReturningCustomers: 160 },
    { Month: "July 2022", Sales: 48000, MarketingSpend: 9700, NewCustomers: 215, ReturningCustomers: 170 },
    { Month: "August 2022", Sales: 50000, MarketingSpend: 9800, NewCustomers: 225, ReturningCustomers: 180 },
    { Month: "September 2022", Sales: 45000, MarketingSpend: 9700, NewCustomers: 220, ReturningCustomers: 175 },
    { Month: "October 2022", Sales: 46000, MarketingSpend: 10000, NewCustomers: 230, ReturningCustomers: 190 },
    { Month: "November 2022", Sales: 50000, MarketingSpend: 9900, NewCustomers: 225, ReturningCustomers: 185 },
    { Month: "December 2022", Sales: 47000, MarketingSpend: 10200, NewCustomers: 240, ReturningCustomers: 200 },
    { Month: "January 2023", Sales: 50000, MarketingSpend: 9200, NewCustomers: 190, ReturningCustomers: 160, },
    { Month: "February 2023", Sales: 48000, MarketingSpend: 9400, NewCustomers: 200, ReturningCustomers: 170 },
    { Month: "March 2023", Sales: 47000, MarketingSpend: 9600, NewCustomers: 210, ReturningCustomers: 165 },
    { Month: "April 2023", Sales: 49000, MarketingSpend: 9800, NewCustomers: 220, ReturningCustomers: 175 },
    { Month: "May 2023", Sales: 52000, MarketingSpend: 10000, NewCustomers: 230, ReturningCustomers: 180 },
    { Month: "June 2023", Sales: 53000, MarketingSpend: 9600, NewCustomers: 215, ReturningCustomers: 170 },
    { Month: "July 2023", Sales: 49000, MarketingSpend: 9800, NewCustomers: 225, ReturningCustomers: 175 },
    { Month: "August 2023", Sales: 51000, MarketingSpend: 10000, NewCustomers: 235, ReturningCustomers: 190 },
    { Month: "September 2023", Sales: 46000, MarketingSpend: 9900, NewCustomers: 230, ReturningCustomers: 185 },
    { Month: "October 2023", Sales: 50500, MarketingSpend: 10200, NewCustomers: 240, ReturningCustomers: 200 },
    { Month: "November 2023", Sales: 51000, MarketingSpend: 10100, NewCustomers: 235, ReturningCustomers: 195 },
    { Month: "December 2023", Sales: 48000, MarketingSpend: 10400, NewCustomers: 250, ReturningCustomers: 210 },
    { Month: "January 2024", Sales: 55000, MarketingSpend: 10000, NewCustomers: 200, ReturningCustomers: 180 },
    { Month: "February 2024", Sales: 52000, MarketingSpend: 10500, NewCustomers: 220, ReturningCustomers: 190 },
    { Month: "March 2024", Sales: 48000, MarketingSpend: 9500, NewCustomers: 210, ReturningCustomers: 170, },
    { Month: "April 2024", Sales: 53000, MarketingSpend: 11000, NewCustomers: 230, ReturningCustomers: 200 },
    { Month: "May 2024", Sales: 50000, MarketingSpend: 11500, NewCustomers: 240, ReturningCustomers: 210 },
    { Month: "June 2024", Sales: 54000, MarketingSpend: 10800, NewCustomers: 235, ReturningCustomers: 205 }
];