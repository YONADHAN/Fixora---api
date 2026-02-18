import { inject, injectable } from 'tsyringe'
import { Request, Response } from 'express'
import 'reflect-metadata'
import {
  ERROR_MESSAGES,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  timeGranularityType,
  TRole,
} from '../../../shared/constants'
import { ICustomerController } from '../../../domain/controllerInterfaces/users/customer-controller.interface'
import { handleErrorResponse } from '../../../shared/utils/error_handler'
import { clearAuthCookies } from '../../../shared/utils/cookie_helper'
import { CustomRequest } from '../../middleware/auth_middleware'
import { IBlacklistTokenUseCase } from '../../../domain/useCaseInterfaces/auth/blacklist_token_usecase_interface'
import { IRevokeRefreshTokenUseCase } from '../../../domain/useCaseInterfaces/auth/revoke_refresh_token_usecase'
import { IGetProfileInfoUseCase } from '../../../domain/useCaseInterfaces/common/get_profile_info_usecase_interface'
import { IProfileInfoUpdateUseCase } from '../../../domain/useCaseInterfaces/common/profile_info_update_usecase_interface'
import { config } from '../../../shared/config'
import { IStorageService } from '../../../domain/serviceInterfaces/s3_storage_service_interface'
import { IProfileImageUploadFactory } from '../../../application/factories/commonFeatures/profile/profile_image_upload_factory.interface'
import { IGetAllServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/service_category/service_category_usecase.interface'
import { DashboardStatsInputDTO } from '../../../application/dtos/dashboard_dto'
import { IGetCustomerDashboardStatsUseCase } from '../../../domain/useCaseInterfaces/dashboard/customer/get_customer_dashboard_status_usecase.interface'
@injectable()
export class CustomerController implements ICustomerController {
  constructor(
    @inject('IBlacklistTokenUseCase')
    private _blacklistTokenUseCase: IBlacklistTokenUseCase,
    @inject('IRevokeRefreshTokenUseCase')
    private _revokeRefreshTokenUseCase: IRevokeRefreshTokenUseCase,
    @inject('IGetProfileInfoUseCase')
    private _getProfileInfoUseCase: IGetProfileInfoUseCase,
    @inject('IProfileInfoUpdateUseCase')
    private _profileInfoUpdateUseCase: IProfileInfoUpdateUseCase,
    @inject('IStorageService')
    private storageService: IStorageService,
    @inject('IProfileImageUploadFactory')
    private _profileImageUploadFactory: IProfileImageUploadFactory,
    @inject('IGetAllServiceCategoryUseCase')
    private _getAllServiceCategoryUseCase: IGetAllServiceCategoryUseCase,
    @inject('IGetCustomerDashboardStatsUseCase')
    private _getCustomerDashboardStatsUseCase: IGetCustomerDashboardStatsUseCase,
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

  async profileInfo(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user.userId
      const role = (req as CustomRequest).user.role
      const userData = await this._getProfileInfoUseCase.execute(role, userId)

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.PROFILE_FETCHED_SUCCESSFULLY,
        data: userData,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async profileUpdate(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body
      const userId = (req as CustomRequest).user.userId
      const role = (req as CustomRequest).user.role

      await this._profileInfoUpdateUseCase.execute(role, data, userId)
      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.PROFILE_UPDATED_SUCCESSFULLY,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async uploadProfileImage(req: Request, res: Response): Promise<void> {
    try {
      const customerId = (req as CustomRequest).user.userId
      const file = req.file as Express.Multer.File

      if (!file) {
        res.status(400).json({ message: 'No file uploaded' })
        return
      }

      const bucketName = config.storageConfig.bucket!
      const folder = 'profile-images'

      const uploadedProfileImageUrl = await this.storageService.uploadFile(
        bucketName,
        file,
        folder
      )

      await this._profileImageUploadFactory.execute(
        'customer',
        customerId,
        uploadedProfileImageUrl
      )

      res.status(200).json({
        success: true,
        message: 'Profile image updated successfully',
        imageUrl: uploadedProfileImageUrl,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async getServiceCategories(req: Request, res: Response) {
    try {
      const { page, limit, search } = req.query as {
        page: string
        limit: string
        search: string
      }

      const response = await this._getAllServiceCategoryUseCase.execute({
        page: Number(page),
        limit: Number(limit),
        search,
      })

      res.status(HTTP_STATUS.OK).json({ success: true, response })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }


  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const {from , to,interval} = req.query
      const userId = (req as CustomRequest).user.userId
      const input: DashboardStatsInputDTO = {
        dateRange: {
          from : from? new Date(from as string): new Date(new Date().setDate(new Date().getDate()-30)),
          to: to? new Date(to as string): new Date(),
        },
        interval: (interval as timeGranularityType) || 'daily',
        user: {
          role: 'vendor',
          userId: userId,
        },
      }
      const stats = await this._getCustomerDashboardStatsUseCase.execute(input)
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Dashboard stats retrived successfully',
        data: stats,
      })
    } catch (error) {
      handleErrorResponse(req, res,error)
    }
  }
}
