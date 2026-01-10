import App from "./app"
import EnergyInfoController from "./controllers/energyInfo.controller";

const energyInfoController = new EnergyInfoController();

const app = new App(
    [
        energyInfoController
    ]
);


app.listen();