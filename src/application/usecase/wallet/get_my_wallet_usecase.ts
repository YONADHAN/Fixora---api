import { inject, injectable } from 'tsyringe'
import { IGetWalletUseCase } from '../../../domain/useCaseInterfaces/wallet/get_my_wallet_usecase_interface'
import { IWalletRepository } from '../../../domain/repositoryInterfaces/feature/payment/wallet_repository.interface'
import { IWalletTransactionRepository } from '../../../domain/repositoryInterfaces/feature/payment/wallet_transaction.interface'
import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'

@injectable()
export class GetWalletUseCase implements IGetWalletUseCase {
  constructor(
    @inject('IWalletRepository')
    private _walletRepository: IWalletRepository,

    @inject('IWalletTransactionRepository')
    private _walletTransactionRepository: IWalletTransactionRepository,

    @inject('ICustomerRepository')
    private _customerRepository: ICustomerRepository,

    @inject('IVendorRepository')
    private _vendorRepository: IVendorRepository
  ) {}

  async execute({
    userId,
    role,
  }: {
    userId: string
    role: 'customer' | 'vendor'
  }) {
    const user =
      role === 'customer'
        ? await this._customerRepository.findOne({ userId })
        : await this._vendorRepository.findOne({ userId })

    if (!user || !user._id) {
      return {
        wallet: null,
        transactions: [],
      }
    }

    const wallet = await this._walletRepository.findOne({
      userRef: user._id,
    })

    if (!wallet) {
      return {
        wallet: null,
        transactions: [],
      }
    }

    const transactions =
      await this._walletTransactionRepository.findAllDocsWithoutPagination({
        walletRef: wallet._id,
      })

    return {
      wallet: {
        walletId: wallet.walletId,
        balance: wallet.balance ?? 0,
        currency: wallet.currency,
      },
      transactions,
    }
  }
}
