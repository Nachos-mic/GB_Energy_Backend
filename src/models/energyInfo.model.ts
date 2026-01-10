export interface GenerationMixItem {
    fuel: string;
    perc: number;
}

export interface EnergyInterval {
    from: string;
    to: string;
    generationmix: GenerationMixItem[];
}

export interface EnergyInfo {
    data: EnergyInterval[];
}

export interface DailyData {
    date: string;
    averageFuelUsage: Record<string, number>;
    totalCleanEnergyPercentage: number;
}
