"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModel = void 0;
const mongoose_1 = require("mongoose");
const chat_schema_1 = require("../schemas/chat_schema");
exports.ChatModel = (0, mongoose_1.model)('Chat', chat_schema_1.ChatSchema);
