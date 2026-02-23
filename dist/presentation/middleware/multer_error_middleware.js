"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMulterError = void 0;
const multer_1 = __importDefault(require("multer"));
/**
 * Generic wrapper for handling Multer upload errors
 */
const handleMulterError = (uploadFn) => (req, res, next) => {
    uploadFn(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            // Multer-specific errors (e.g. file too large, too many files)
            return res.status(400).json({ success: false, message: err.message });
        }
        else if (err) {
            // Other unknown errors
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
};
exports.handleMulterError = handleMulterError;
