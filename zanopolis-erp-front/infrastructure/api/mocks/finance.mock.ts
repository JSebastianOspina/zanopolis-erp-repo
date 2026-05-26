export interface DailyFinanceSummary {
  date: string;
  income: number;
  expenses: number;
  profit: number;
  salesCount: number;
  purchasesTotal: number;
}

export interface MonthlyFinanceSummary {
  year: number;
  month: number;
  income: number;
  expenses: number;
  profit: number;
  dailyBreakdown: Array<{ date: string; income: number; expenses: number }>;
}

export const dailyFinanceMock: DailyFinanceSummary = {
  date: new Date().toISOString().split("T")[0],
  income: 138000,
  expenses: 45000,
  profit: 93000,
  salesCount: 2,
  purchasesTotal: 45000,
};

export const monthlyFinanceMock: MonthlyFinanceSummary = {
  year: 2026,
  month: 5,
  income: 1250000,
  expenses: 480000,
  profit: 770000,
  dailyBreakdown: [
    { date: "2026-05-12", income: 85000, expenses: 12000 },
    { date: "2026-05-13", income: 92000, expenses: 35000 },
    { date: "2026-05-14", income: 110000, expenses: 28000 },
    { date: "2026-05-15", income: 78000, expenses: 96000 },
    { date: "2026-05-16", income: 145000, expenses: 22000 },
    { date: "2026-05-17", income: 132000, expenses: 170000 },
    { date: "2026-05-18", income: 138000, expenses: 45000 },
  ],
};
