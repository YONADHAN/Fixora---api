"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const winston_1 = require("winston");
const logDir = path_1.default.join(__dirname, '../../../logs');
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
const logger = (0, winston_1.createLogger)({
    level: 'error',
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
    transports: [
        new winston_1.transports.File({ filename: path_1.default.join(logDir, 'error.log') }),
    ],
});
exports.default = logger;
