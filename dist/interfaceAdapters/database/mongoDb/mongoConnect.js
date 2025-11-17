"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../../../shared/config");
const chalk_1 = __importDefault(require("chalk"));
class MongoConnect {
    constructor() {
        this._dbUrl = config_1.config.database.URI;
    }
    async connectDB() {
        try {
            await mongoose_1.default.connect(this._dbUrl);
            console.log(chalk_1.default.yellowBright.bold('|        ' +
                chalk_1.default.greenBright.bold('Connected to MongoDB') +
                '         |'));
            mongoose_1.default.connection.on('error', (error) => {
                console.error(chalk_1.default.redBright.bold(' MongoDB connection error:\n'), error);
            });
            mongoose_1.default.connection.on('disconnected', () => {
                console.log(chalk_1.default.magentaBright(' MongoDB disconnected'));
            });
        }
        catch (error) {
            console.error(chalk_1.default.bgRed.white.bold(' Failed to connect to MongoDB:'), error);
            throw new Error('Database connection failed');
        }
    }
    async disconnectDB() {
        try {
            await mongoose_1.default.connection.close();
            console.log(chalk_1.default.cyanBright.bold(' MongoDB Disconnected cleanly'));
        }
        catch (err) {
            console.error(chalk_1.default.redBright(' Error Disconnecting MongoDB:'), err);
        }
    }
}
exports.MongoConnect = MongoConnect;
