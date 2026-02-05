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
    private _getWalletUseCase: IGetWalletUseCase,
  ) {}

  async getMyWallet(req: Request, res: Response): Promise<void> {
    const { userId, role } = (req as CustomRequest).user

    const {
      page = '1',
      limit = '10',
      sortBy,
      order,
      search,
    } = req.query as Record<string, string>

    const data = await this._getWalletUseCase.execute({
      userId,
      role: role as 'customer' | 'vendor',
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy as any,
      order: order as any,
      search,
    })

    res.status(200).json({
      success: true,
      ...data,
    })
  }
}
