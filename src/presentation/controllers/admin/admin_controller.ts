import { inject, injectable } from 'tsyringe'
import { Request, Response } from 'express'
import {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  statusTypes,
} from '../../../shared/constants'
import { handleErrorResponse } from '../../../shared/utils/error_handler'
import { IBlacklistTokenUseCase } from '../../../domain/useCaseInterfaces/auth/blacklist_token_usecase_interface'
import { IRevokeRefreshTokenUseCase } from '../../../domain/useCaseInterfaces/auth/revoke_refresh_token_usecase'
import { CustomRequest } from '../../middleware/auth_middleware'
import { clearAuthCookies } from '../../../shared/utils/cookie_helper'
import { IAdminController } from '../../../domain/controllerInterfaces/users/admin-controller.interface'
import { IGetAllUsersUseCase } from '../../../domain/useCaseInterfaces/common/get_all_users_usecase_interface'
import { IChangeMyUserBlockStatusUseCase } from '../../../domain/useCaseInterfaces/admin/change_my_users_block_status_usecase_interface'
import { IGetAllVendorRequestsUseCase } from '../../../domain/useCaseInterfaces/admin/get_all_vendor_requests_usecase_interface'
import { IChangeVendorVerificationStatusUseCase } from '../../../domain/useCaseInterfaces/admin/change_vendor_verification_status_usecase_interface'

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject('IBlacklistTokenUseCase')
    private _blacklistTokenUseCase: IBlacklistTokenUseCase,
    @inject('IRevokeRefreshTokenUseCase')
    private _revokeRefreshTokenUseCase: IRevokeRefreshTokenUseCase,
    @inject('IGetAllUsersUseCase')
    private _getAllUsersUsecase: IGetAllUsersUseCase,
    @inject('IChangeMyUserBlockStatusUseCase')
    private _changeMyUserBlockStatusUseCase: IChangeMyUserBlockStatusUseCase,
    @inject('IGetAllVendorRequestsUseCase')
    private _getAllVendorRequests: IGetAllVendorRequestsUseCase,
    @inject('IChangeVendorVerificationStatusUseCase')
    private _changeVendorVerificationStatusUseCase: IChangeVendorVerificationStatusUseCase
  ) { }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      await this._blacklistTokenUseCase.execute(
        (req as CustomRequest).user.access_token
      )

      await this._revokeRefreshTokenUseCase.execute(
        (req as CustomRequest).user.refresh_token
      )

      const user = (req as CustomRequest).user
      const accessTokenName = `${user.role}_access_token`
      const refreshTokenName = `${user.role}_refresh_token`
      clearAuthCookies(res, accessTokenName, refreshTokenName)
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async getAllCustomers(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search = '', role = 'customer' } = req.body

      const response = await this._getAllUsersUsecase.execute({
        role,
        page,
        limit,
        search,
      })

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.USERS_FOUND,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async getAllVendors(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search = '', role = 'vendor' } = req.body

      const response = await this._getAllUsersUsecase.execute({
        role,
        page,
        limit,
        search,
      })

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.USERS_FOUND,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async getAllVendorRequests(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 10
      const search = (req.query.search as string) || ''

      const response = await this._getAllVendorRequests.execute({
        page,
        limit,
        search,
      })

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Vendor requests retrieved successfully',
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async changeMyUserBlockStatus(req: Request, res: Response): Promise<any> {
    try {
      const { role, userId, status } = req.body
      if (!role || !userId || !status) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'role, userId, and status are required',
        })
      }

      const validStatuses: statusTypes[] = ['active', 'blocked']
      if (!validStatuses.includes(status)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: `Invalid status value. Allowed: ${validStatuses.join(', ')}`,
        })
      }

      const response = await this._changeMyUserBlockStatusUseCase.execute({
        role,
        userId,
        status,
      })

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.BLOCK_STATUS_OF_USER_CHANGED_SUCCESSFULLY,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async changeMyVendorVerificationStatus(
    req: Request,
    res: Response
  ): Promise<void> {
    try {

      const adminId = (req as CustomRequest).user.userId
      const { userId, verificationStatus, description } = req.body

      if (!['rejected', 'accepted'].includes(verificationStatus)) {
        res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS })
        return
      }

      const response =
        await this._changeVendorVerificationStatusUseCase.execute({
          userId,
          verificationStatus,
          adminId,
          description,
        })

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.VERIFICATION_STATUS_CHANGED,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
}
