import axios from "axios";
import {EnergyInfo} from "../models/energyInfo.model";
import {ChargeWindowModel} from "../models/chargeWindow.model";

class EnergyInfoService {

    constructor() {
    }

    public convertToISO(date: Date): string {
        return date.toISOString().split('.')[0] + 'Z';
    }

    public async fetchThreeDaysGeneration() {
        try {
            //W ramach pobierania danych chcemy zwrócić dane dla dnia dzisiejszego, jutra i pojutrza, więc ustalamy startDate jako
            //datę dzisiejszą z godziną 00:00, a jako końcową datę dwa dni później o godzinie 24:00 (inaczej godziną 00:00 dnia następnego)

            const startDate = new Date();
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 3);

            const from = this.convertToISO(startDate); // Konwersja wymagana z względu na specyfikację zewnętrznego API.
            const to = this.convertToISO(endDate);

            const response = await axios.get<EnergyInfo>(
                `https://api.carbonintensity.org.uk/generation/${from}/${to}`
            );

            return response.data;
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
