import 'reflect-metadata'
import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import { IGetWalletUseCase } from '../../../domain/useCaseInterfaces/wallet/get_my_wallet_usecase_interface'
import { CustomRequest } from '../../middleware/auth_middleware'
import { IWalletController } from '../../../domain/controllerInterfaces/features/wallet/wallet-controller.interface'

@injectable()
export class WalletController implements IWalletController {
  constructor(
    @inject('IGetWalletUseCase')
    private _getWalletUseCase: IGetWalletUseCase
  ) { }

  async getMyWallet(req: Request, res: Response): Promise<void> {
    const userId = (req as CustomRequest).user.userId
    const role = (req as CustomRequest).user.role as 'customer' | 'vendor'
    const { sortBy, order } = req.query as {
      sortBy?: 'amount' | 'createdAt' | 'type'
      order?: 'asc' | 'desc'
    }

    const data = await this._getWalletUseCase.execute({
      userId,
      role,
      sortBy,
      order,
    })

    res.status(200).json({
      success: true,
      data,
    })
  }
}
