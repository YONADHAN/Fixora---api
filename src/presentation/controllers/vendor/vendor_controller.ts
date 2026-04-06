import { inject, injectable } from 'tsyringe'
import { Request, Response } from 'express'

import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES, timeGranularityType } from '../../../shared/constants'
import { DashboardStatsInputDTO } from '../../../application/dtos/dashboard_dto'
import { handleErrorResponse } from '../../../shared/utils/error_handler'
import { CustomRequest } from '../../middleware/auth_middleware'
import { clearAuthCookies } from '../../../shared/utils/cookie_helper'
import { IBlacklistTokenUseCase } from '../../../domain/useCaseInterfaces/auth/blacklist_token_usecase_interface'
import { IRevokeRefreshTokenUseCase } from '../../../domain/useCaseInterfaces/auth/revoke_refresh_token_usecase'
import { IVendorController } from '../../../domain/controllerInterfaces/users/vendor-controller.interface'
import { IGetProfileInfoUseCase } from '../../../domain/useCaseInterfaces/common/get_profile_info_usecase_interface'
import { IProfileInfoUpdateUseCase } from '../../../domain/useCaseInterfaces/common/profile_info_update_usecase_interface'
import { IStorageService } from '../../../domain/serviceInterfaces/s3_storage_service_interface'
import { IVendorStatusCheckUseCase } from '../../../domain/useCaseInterfaces/vendor/vendor_status_check_usecase.interface'
import { IUploadVendorDocsUseCase } from '../../../domain/useCaseInterfaces/vendor/upload_vendor_docs_usecase.interface'
import { IGetVendorDashboardStatsUseCase } from '../../../domain/useCaseInterfaces/dashboard/vendor/get_vendor_dashboard_status_usecase.interface'
import { IProfileImageUploadFactory } from '../../../application/factories/commonFeatures/profile/profile_image_upload_factory.interface'
import { config } from '../../../shared/config'

@injectable()
export class VendorController implements IVendorController {
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
    @inject('IVendorStatusCheckUseCase')
    private _vendorVerificationDocStatusCheck: IVendorStatusCheckUseCase,
    @inject('IUploadVendorDocsUseCase')
    private _uploadVendorDocsUsecase: IUploadVendorDocsUseCase,
    @inject('IProfileImageUploadFactory')
    private _profileImageUploadFactory: IProfileImageUploadFactory,
    @inject('IGetVendorDashboardStatsUseCase')
    private getVendorDashboardStatsUseCase: IGetVendorDashboardStatsUseCase
  ) { }

  async uploadVerificationDocument(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user.userId
      const files = req.files as Express.Multer.File[]

      if (!files || files.length === 0) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGES.NO_FILES_UPLOADED })
        return
      }

      const bucketName = config.storageConfig.bucket!
      const folder = 'vendor-verification-docs'

      const uploadPromises = files.map((file) =>
        this.storageService.uploadFile(bucketName, file, folder)
      )

      const urls = await Promise.all(uploadPromises)

      await this._uploadVendorDocsUsecase.execute(userId, files, urls)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.DOCUMENTS_UPLOADED_AND_SAVED_SUCCESSFULLY,
        urls,
      })
    } catch (error: unknown) {
      console.error(' Upload failed:', error)
      if (error instanceof Error) {

        res
          .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
          .json({ message: error.message || ERROR_MESSAGES.FAILED_TO_UPLOAD_FILES })
      }

    }
  }

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
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.LOGGED_OUT_SUCCESSFULLY,
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
      const vendorId = (req as CustomRequest).user.userId
      const file = req.file as Express.Multer.File

      if (!file) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGES.NO_FILE_UPLOADED })
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
        'vendor',
        vendorId,
        uploadedProfileImageUrl
      )

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.PROFILE_IMAGE_UPDATED_SUCCESSFULLY,
        imageUrl: uploadedProfileImageUrl,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async vendorVerificationDocStatusCheck(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userId = (req as CustomRequest).user.userId
      const response =
        await this._vendorVerificationDocStatusCheck.execute(userId)

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const { from, to, interval } = req.query
      const userId = (req as CustomRequest).user.userId

      const input: DashboardStatsInputDTO = {
        dateRange: {
          from: from
            ? new Date(from as string)
            : new Date(new Date().setDate(new Date().getDate() - 30)),
          to: to ? new Date(to as string) : new Date(),
        },
        interval: (interval as timeGranularityType) || 'daily',
        user: {
          role: 'vendor',
          userId: userId,
        },
      }

      const stats = await this.getVendorDashboardStatsUseCase.execute(input)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.DASHBOARD_STATS_RETRIVED_SUCCESSFULLY,
        data: stats,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
}
