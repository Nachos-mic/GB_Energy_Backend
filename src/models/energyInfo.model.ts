export interface EnergyInterval {
    from: string;
    to: string;
    generationmix: {
        fuel: string;
        perc: number;
    }[];
}

export interface EnergyInfo {
    data: EnergyInterval[];
}

export interface DailyData {
    date: string;
    averageFuelUsage: Record<string, number>;
    totalCleanEnergyPercentage: number;
}

export interface BestChargingWindow {
    start: string;
    end: string;
    percentage: number;
}
