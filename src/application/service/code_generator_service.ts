import { inject, injectable } from 'tsyringe'
import { ICounterRepository } from '../../domain/repositoryInterfaces/feature/counter/counter_repository.interface'
import { ICodeGeneratorService } from '../../domain/serviceInterfaces/counter_service_interface'

@injectable()
export class CodeGeneratorService implements ICodeGeneratorService {
  constructor(
    @inject('ICounterRepository')
    private readonly counterRepo: ICounterRepository
  ) {}

  private format(prefix: string, count: number): string {
    return `${prefix}-${new Date().getFullYear()}-${String(count).padStart(6, '0')}`
  }

  async generateBookingCode(): Promise<string> {
    const count = await this.counterRepo.increment('booking')
    return this.format('BOOK', count)
  }

  async generateWalletTransactionCode(): Promise<string> {
    const count = await this.counterRepo.increment('wallet-transaction')
    return this.format('WALL', count)
  }

  async generateWalletCode(): Promise<string> {
    const count = await this.counterRepo.increment('wallet')
    return this.format('WALLET', count)
  }
}