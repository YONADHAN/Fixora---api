"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("./presentation/di/resolver");
require("module-alias/register");
const server_1 = require("./presentation/http/server");
const http_1 = require("http");
const config_1 = require("./shared/config");
const chalk_1 = __importDefault(require("chalk"));
const mongoConnect_1 = require("./interfaceAdapters/database/mongoDb/mongoConnect");
async function startApp() {
    const expressServer = new server_1.ExpressServer();
    const mongoConnect = new mongoConnect_1.MongoConnect();
    try {
        console.log(chalk_1.default.greenBright('-------------------------------------------\n'));
        await mongoConnect.connectDB();
        const httpServer = (0, http_1.createServer)(expressServer.getApp());
        httpServer.listen(config_1.config.server.PORT, () => {
            console.log(chalk_1.default.yellowBright.bold(` Server running at ${chalk_1.default.blueBright(`http://localhost:${config_1.config.server.PORT}`)}`));
            console.log(chalk_1.default.greenBright('\n-------------------------------------------\n'));
        });
    }
    catch (error) {
        console.error(chalk_1.default.redBright.bold(' Failed to start server'), error);
    }
}
startApp();
