"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyInjection = void 0;
const useCase_registry_1 = require("./useCase_registry");
const repository_register_1 = require("./repository_register");
const middleware_register_1 = require("./middleware_register");
class DependencyInjection {
    static registerAll() {
        useCase_registry_1.UseCaseRegistry.registerUseCases();
        repository_register_1.RepositoryRegistry.registerRepositories();
        middleware_register_1.MiddlewareRegistry.registerMiddlewares();
    }
}
exports.DependencyInjection = DependencyInjection;
