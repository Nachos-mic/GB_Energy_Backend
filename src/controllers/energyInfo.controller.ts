import Controller from "../interfaces/controller.interface";
import { Request, Response, Router } from 'express';
import EnergyInfoService from "../services/energyInfo.service";

class EnergyInfoController implements Controller {
    public main_path = '/api/v1/energyinfo';
    public router = Router();
    private energyInfoService: EnergyInfoService;

    constructor() {
        this.energyInfoService = new EnergyInfoService();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.get(`${this.main_path}/data`, this.getData);
        this.router.get(`${this.main_path}/charge-window/:time_window`, this.getBestChargeWindow);
    }

    private getData = async (request: Request, response: Response): Promise<void> => {
        try {
            const words = await this.energyInfoService.fetchThreeDaysGeneration();
            response.status(200).json(words);
        } catch (error: any) {
            console.error('Błąd podczas pobierania danych:', error);
            response.status(500).json({ error: error.message || 'Wystąpił błąd podczas pobierania danych' });
        }
    }

    private getBestChargeWindow = async (request: Request, response: Response): Promise<void> => {
        console.log('Time Window: ', request.params.time_window);
        try {
            if (!request.params.time_window) {
                response.status(400).json({ error: 'Wymagane jest podanie ilość godzin' });
                return;
            }
            const product = await this.energyInfoService.calculateBestTimeWindow(request.params.time_window as string);
            response.status(200).json(product);
        } catch (error: any) {
            console.error('Błąd podczas pobierania produktu:', error);
            response.status(500).json({ error: error.message || 'Wystąpił błąd podczas pobierania produktu' });
        }
    }
}

export default EnergyInfoController;