import { UseCaseRegistry } from './useCase_registry'
import { RepositoryRegistry } from './repository_register'
import { MiddlewareRegistry } from './middleware_register'
import { ShedulerRegistry } from './scheduler_registry'
export class DependencyInjection {
  static registerAll(): void {
    UseCaseRegistry.registerUseCases()
    RepositoryRegistry.registerRepositories()
    MiddlewareRegistry.registerMiddlewares()
    ShedulerRegistry.registerSheduler()
  }
}
