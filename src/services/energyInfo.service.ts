import axios from "axios";
import {DailyData, EnergyInfo, EnergyInterval} from "../models/energyInfo.model";

class EnergyInfoService {

    constructor() {
    }

    public convertToISO(date: Date): string {
        return date.toISOString().split('.')[0] + 'Z';
    }

    private calculateDailyStats(response: EnergyInfo): DailyData[] {
        const cleanFuels = ["solar", "wind", "hydro", "biomass", "nuclear"];

        const grouped = response.data.reduce<Record<string, Record<string, { sum: number; count: number }>>>(
            (acc, interval: EnergyInterval) => {
                const date = interval.from.slice(0, 10);

                if (!acc[date]) acc[date] = {};

                interval.generationmix.forEach((mix) => {
                    if (!acc[date][mix.fuel]) acc[date][mix.fuel] = { sum: 0, count: 0 };
                    acc[date][mix.fuel].sum += mix.perc;
                    acc[date][mix.fuel].count += 1;
                });

                return acc;
            },
            {}
        );

        const result: DailyData[] = Object.entries(grouped)
            .map(([date, fuels]) => {
                let cleanTotal = 0;

                const averageFuelUsage: Record<string, number> = Object.entries(fuels).reduce(
                    (avgAcc, [fuel, { sum, count }]) => {
                        const avg = Number((sum / count).toFixed(2));
                        avgAcc[fuel] = avg;

                        if (cleanFuels.includes(fuel)) cleanTotal += avg;

                        return avgAcc;
                    },
                    {} as Record<string, number>
                );

                return {
                    date,
                    averageFuelUsage,
                    totalCleanEnergyPercentage: Number(cleanTotal.toFixed(2)),
                };
            })
            .sort((a, b) => a.date.localeCompare(b.date));

        return result;
    }

    public async fetchThreeDaysGeneration() {
        try {
            //W ramach pobierania danych chcemy zwrócić dane dla dnia dzisiejszego, jutra i pojutrza, więc ustalamy startDate jako
            //datę dzisiejszą z godziną 00:00, a jako końcową datę dwa dni później o godzinie 24:00 (inaczej godziną 00:00 dnia następnego)

            const startDate = new Date();
            startDate.setUTCHours(0, 1, 0, 0); // <-- UTC, nie lokalnie

            const endDate = new Date(startDate);
            endDate.setUTCDate(startDate.getUTCDate() + 3); // dziś+jutro+pojutrze (do 00:00 dnia +3)

            const from = this.convertToISO(startDate); // Konwersja wymagana z względu na specyfikację zewnętrznego API.
            const to = this.convertToISO(endDate);

            const response = await axios.get<EnergyInfo>(
                `https://api.carbonintensity.org.uk/generation/${from}/${to}`
            );

        return this.calculateDailyStats(response.data);

        } catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }

    public async calculateBestTimeWindow(time_window: string) {
        try {


            return 0;
        } catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }
}

export default EnergyInfoService;
