"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class EnergyInfoService {
    constructor() {
    }
    convertToISO(date) {
        return date.toISOString().split('.')[0] + 'Z';
    }
    calculateDailyStats(response) {
        const cleanFuels = ["solar", "wind", "hydro", "biomass", "nuclear"];
        const grouped = response.data.reduce((acc, interval) => {
            const date = interval.from.slice(0, 10);
            if (!acc[date])
                acc[date] = {};
            interval.generationmix.forEach((mix) => {
                if (!acc[date][mix.fuel])
                    acc[date][mix.fuel] = { sum: 0, count: 0 };
                acc[date][mix.fuel].sum += mix.perc;
                acc[date][mix.fuel].count += 1;
            });
            return acc;
        }, {});
        const result = Object.entries(grouped)
            .map(([date, fuels]) => {
            let cleanTotal = 0;
            const averageFuelUsage = Object.entries(fuels).reduce((avgAcc, [fuel, { sum, count }]) => {
                const avg = Number((sum / count).toFixed(2));
                avgAcc[fuel] = avg;
                if (cleanFuels.includes(fuel))
                    cleanTotal += avg;
                return avgAcc;
            }, {});
            return {
                date,
                averageFuelUsage,
                totalCleanEnergyPercentage: Number(cleanTotal.toFixed(2)),
            };
        })
            .sort((a, b) => a.date.localeCompare(b.date));
        return result;
    }
    async fetchThreeDaysGeneration() {
        try {
            //W ramach pobierania danych chcemy zwrócić dane dla dnia dzisiejszego, jutra i pojutrza, więc ustalamy startDate jako
            //datę dzisiejszą z godziną 00:00, a jako końcową datę dwa dni później o godzinie 24:00 (inaczej godziną 00:00 dnia następnego)
            const startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 3);
            const from = this.convertToISO(startDate); // Konwersja wymagana z względu na specyfikację zewnętrznego API.
            const to = this.convertToISO(endDate);
            const response = await axios_1.default.get(`https://api.carbonintensity.org.uk/generation/${from}/${to}`);
            return this.calculateDailyStats(response.data);
        }
        catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }
    async calculateBestTimeWindow(time_window) {
        try {
            return 0;
        }
        catch (error) {
            console.error('Error fetching:', error);
            throw error;
        }
    }
}
exports.default = EnergyInfoService;
//# sourceMappingURL=energyInfo.service.js.map