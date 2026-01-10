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