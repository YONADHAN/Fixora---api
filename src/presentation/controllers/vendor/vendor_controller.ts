import { inject, injectable } from 'tsyringe'
import { Request, Response } from 'express'
// import { ICloudinaryService } from '../../../domain/serviceInterfaces/cloudinary_service_interface'
import {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from '../../../shared/constants'
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
import { config } from '../../../shared/config'

@injectable()
export class VendorController implements IVendorController {
  constructor(
    // @inject('ICloudinaryService')
    // private _cloudinaryService: ICloudinaryService,
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
    private _uploadVendorDocsUsecase: IUploadVendorDocsUseCase
  ) {}

  async uploadVerificationDocument(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as CustomRequest).user.userId
      const files = req.files as Express.Multer.File[]

      if (!files || files.length === 0) {
        res.status(400).json({ message: 'No files uploaded' })
        return
      }

      //  Use your main AWS S3 bucket and vendor folder
      const bucketName = config.storageConfig.bucket! // e.g., fixora-storage-yonadhan
      const folder = 'vendor-verification-docs' // this becomes an S3 folder

      const uploadPromises = files.map((file) =>
        this.storageService.uploadFile(bucketName, file, folder)
      )

      const urls = await Promise.all(uploadPromises)

      //  Save uploaded document details in MongoDB
      await this._uploadVendorDocsUsecase.execute(userId, files, urls)

      res.status(200).json({
        success: true,
        message: 'Documents uploaded and saved successfully',
        urls,
      })
    } catch (error: any) {
      console.error(' Upload failed:', error)
      res
        .status(500)
        .json({ message: error.message || 'Failed to upload files' })
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

  async vendorVerificationDocStatusCheck(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userId = (req as CustomRequest).user.userId
      const response = await this._vendorVerificationDocStatusCheck.execute(
        userId
      )

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.OPERATION_SUCCESS,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
}
