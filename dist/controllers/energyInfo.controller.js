"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const energyInfo_service_1 = __importDefault(require("../services/energyInfo.service"));
class EnergyInfoController {
    constructor() {
        this.main_path = '/api/v1/energyinfo';
        this.router = (0, express_1.Router)();
        this.getData = async (request, response) => {
            try {
                const data = await this.energyInfoService.getGenerationMixData();
                response.status(200).json(data);
            }
            catch (error) {
                console.error('Błąd podczas pobierania danych:', error);
                response.status(500).json({ error: error.message || 'Wystąpił błąd podczas pobierania danych' });
            }
        };
        this.getBestChargeWindow = async (request, response) => {
            console.log('Time Window: ', request.params.time_window);
            try {
                if (!request.params.time_window) {
                    response.status(400).json({ error: 'Wymagane jest podanie ilość godzin' });
                    return;
                }
                const product = await this.energyInfoService.calculateBestTimeWindow(request.params.time_window);
                response.status(200).json(product);
            }
            catch (error) {
                console.error('Błąd podczas pobierania produktu:', error);
                response.status(500).json({ error: error.message || 'Wystąpił błąd podczas pobierania produktu' });
            }
        };
        this.energyInfoService = new energyInfo_service_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.main_path}/generation-mix`, this.getData); //endpoint do pobierania danych z trzech dni
        this.router.get(`${this.main_path}/charge-window/:time_window`, this.getBestChargeWindow); //endpoint do pobierania danych o oknie ładowania
    }
}
exports.default = EnergyInfoController;
//# sourceMappingURL=energyInfo.controller.js.map