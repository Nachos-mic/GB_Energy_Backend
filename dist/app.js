"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
class App {
    constructor(controllers) {
        this.app = (0, express_1.default)();
        this.httpServer = http_1.default.createServer(this.app);
        this.io = new socket_io_1.Server(this.httpServer, {
            cors: {
                origin: `http://localhost:${config_1.config.port}`,
                methods: ['GET'],
            },
        });
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }
    initializeMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
        this.app.use((0, morgan_1.default)('dev'));
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
    listen() {
        this.httpServer.listen(config_1.config.port, () => {
            console.log(`Serwer używa portu: ${config_1.config.port}`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map