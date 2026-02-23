"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareRegistry = void 0;
const tsyringe_1 = require("tsyringe");
const block_middleware_1 = require("../middleware/block_middleware");
class MiddlewareRegistry {
    static registerMiddlewares() {
        tsyringe_1.container.registerSingleton(block_middleware_1.BlockMyUserMiddleware);
    }
}
exports.MiddlewareRegistry = MiddlewareRegistry;
