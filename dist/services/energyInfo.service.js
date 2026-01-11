"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const misc_utils_1 = require("../utils/misc.utils");
class EnergyInfoService {
    constructor() {
    }
    convertToISO(date) {
        return date.toISOString().split('.')[0] + 'Z';
    }
    async fetchThreeDaysGeneration() {
        //W ramach pobierania danych chcemy zwrócić dane dla dnia dzisiejszego, jutra i pojutrza, więc ustalamy startDate jako
        //datę dzisiejszą z godziną 00:00, a jako końcową datę dwa dni później o godzinie 24:00 (inaczej godziną 00:00 dnia następnego)
        const startDate = new Date();
        startDate.setUTCHours(0, 1, 0, 0);
        const endDate = new Date(startDate);
        endDate.setUTCDate(startDate.getUTCDate() + 3);
        const from = this.convertToISO(startDate); // Konwersja wymagana z względu na specyfikację zewnętrznego API.
        const to = this.convertToISO(endDate);
        const response = await axios_1.default.get(`https://api.carbonintensity.org.uk/generation/${from}/${to}`);
        return response.data;
    }
    async getGenerationMixData() {
        const response = await this.fetchThreeDaysGeneration();
        //Grupowanie danych po datach
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
        return Object.entries(grouped)
            .map(([date, fuels]) => {
            let cleanTotal = 0;
            const averageFuelUsage = Object.entries(fuels).reduce((avgAcc, [fuel, { sum, count }]) => {
                const average = Number((sum / count).toFixed(0));
                avgAcc[fuel] = average;
                if (misc_utils_1.cleanFuels.includes(fuel))
                    cleanTotal += average;
                return avgAcc;
            }, {});
            return {
                date,
                averageFuelUsage,
                totalCleanEnergyPercentage: Number(cleanTotal.toFixed(0)),
            };
        })
            .sort((a, b) => a.date.localeCompare(b.date));
    }
    async calculateBestTimeWindow(time_window) {
        const hours = Number(time_window);
        if (!Number.isInteger(hours) || hours < 1 || hours > 6) {
            throw new Error("Okno czasowe musi być ustalone pomiędzy 1 a 6");
        }
        const windowSize = hours * 2; //Interwały są 30-minutowe
        const forecast = await this.fetchThreeDaysGeneration();
        //Jako że fetchthreeDaysGeneration zwraca dane z trzech dni, to obcinamy zakres do jutro/pojutrze
        const today = new Date();
        const nextday = new Date(today);
        nextday.setDate(today.getDate() + 1);
        nextday.setHours(0, 0, 0, 0);
        const intervals = forecast.data.filter((interval) => {
            const intervalDate = new Date(interval.from);
            return intervalDate.getTime() >= nextday.getTime();
        });
        if (intervals.length < windowSize) {
            throw new Error("Za mało danych dla okna");
        }
        const cleanPercents = intervals.map((interval) => {
            let sum = 0;
            for (const mix of interval.generationmix) {
                if (misc_utils_1.cleanFuels.includes(mix.fuel))
                    sum += mix.perc;
            }
            return sum;
        });
        // Użycie sliding window do wyliczenia najlepszego okna czasowego
        let currentSum = 0;
        for (let i = 0; i < windowSize; i++)
            currentSum += cleanPercents[i];
        let bestSum = currentSum;
        let bestStartIndex = 0;
        for (let i = windowSize; i < cleanPercents.length; i++) {
            currentSum = currentSum - cleanPercents[i - windowSize] + cleanPercents[i];
            if (currentSum > bestSum) {
                bestSum = currentSum;
                bestStartIndex = i - windowSize + 1;
            }
        }
        const avg = bestSum / windowSize;
        return {
            start: intervals[bestStartIndex].from,
            end: intervals[bestStartIndex + windowSize - 1].to,
            percentage: Number(avg.toFixed(0)),
        };
    }
}
exports.default = EnergyInfoService;
//# sourceMappingURL=energyInfo.service.js.map