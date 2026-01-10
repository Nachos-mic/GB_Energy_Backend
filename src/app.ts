import {config} from "./config";
import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import Controller from "./interfaces/controller.interface";
import cors from 'cors';
import morgan from 'morgan';

class App {
    public app: express.Application;
    public httpServer: http.Server;
    public io: Server;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.io = new Server(this.httpServer, {
            cors: {
                origin: `http://localhost:${config.port}`,
                methods: ['GET'],
            },
        });

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(morgan('dev'));
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    public listen() {
        this.httpServer.listen(config.port, () => {
            console.log(`Serwer używa portu: ${config.port}`);
        });
    }
}

export default App;