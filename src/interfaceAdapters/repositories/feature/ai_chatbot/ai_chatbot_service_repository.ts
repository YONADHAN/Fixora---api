import { injectable, inject } from 'tsyringe'
import { IAiServiceRepository } from '../../../../domain/repositoryInterfaces/feature/ai/ai_service_repository.interface'
import { IServiceRepository } from '../../../../domain/repositoryInterfaces/feature/service/service_repository.interface'

@injectable()
export class AiServiceRepository implements IAiServiceRepository {
  constructor(
    @inject('IServiceRepository')
    private readonly serviceRepository: IServiceRepository,
  ) {}

  async getTopServices() {
    const services = await this.serviceRepository.getTopServicesForAI()

    return services.map((s) => ({
      name: s.name,
      category: s.categoryName,
      priceRange: s.priceRange,
    }))
  }

  async searchServices(query: string) {
    const services = await this.serviceRepository.searchForAI(query)

    return services.map((s) => ({
      name: s.name,
      description: s.shortDescription,
    }))
  }
}
