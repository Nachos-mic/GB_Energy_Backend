export interface EnergyInfo {
    data: Array<{
        from: string;
        to: string;
        generationmix: Array<{
            fuel: string;
            perc: number;
        }>;
    }>;
}

export interface DailyData {
    date: string;
    averageEcoFuelUsage: {
        [fuel: string]: number;
    };
    totalEcoPercentage: number;
}
