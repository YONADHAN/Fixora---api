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
    private _vendorRepository: IVendorRepository,
  ) {}
  async execute({
    userId,
    role,
    page = 1,
    limit = 10,
    sortBy,
    order,
    search,
  }: {
    userId: string
    role: 'customer' | 'vendor'
    page?: number
    limit?: number
    sortBy?: 'amount' | 'createdAt' | 'type'
    order?: 'asc' | 'desc'
    search?: string
  }): Promise<{
    wallet: {
      walletId: string
      balance: number
      currency: string
    } | null
    data: any[]
    totalPages: number
    currentPage: number
    totalCount: number
  }> {
    const user =
      role === 'customer'
        ? await this._customerRepository.findOne({ userId })
        : await this._vendorRepository.findOne({ userId })

    if (!user?._id) {
      return {
        wallet: null,
        data: [],
        totalPages: 0,
        currentPage: page,
        totalCount: 0,
      }
    }

    const wallet = await this._walletRepository.findOne({
      userRef: user._id,
    })

    if (!wallet) {
      return {
        wallet: null,
        data: [],
        totalPages: 0,
        currentPage: page,
        totalCount: 0,
      }
    }

    const { data, totalCount } =
      await this._walletTransactionRepository.findWithPagination(
        { walletRef: wallet._id },
        {
          page,
          limit,
          sortBy,
          order,
          search,
        },
      )

    return {
      wallet: {
        walletId: wallet.walletId,
        balance: wallet.balance ?? 0,
        currency: wallet.currency,
      },
      data,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    }
  }
}
