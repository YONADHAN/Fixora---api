import { inject, injectable } from 'tsyringe'
import { Request, Response } from 'express'
import { handleErrorResponse } from '../../../shared/utils/error_handler'
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../../shared/constants'
import { ISubServiceCategoryController } from '../../../domain/controllerInterfaces/features/service/sub-service-category-controller.interface'
import { createSubServiceCategoryZodValidationSchema } from '../../validations/sub_service_category/create_sub_service_category.schema'
import { CreateSubServiceCategoryRequestMapper } from '../../../application/mappers/sub_service_category/create_sub_service_category_mapper'
import { ICreateSubServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/sub_service_category/create_sub_service_usecase.interface'
import { CustomRequest } from '../../middleware/auth_middleware'
import { getAllSubServiceCategoriesZodValidationSchema } from '../../validations/sub_service_category/get_all_sub_service_category.schema'
import { GetAllSubServiceCategoriesRequestMapper } from '../../../application/mappers/sub_service_category/get_all_sub_service_category_mapper'
import { IGetAllSubServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/sub_service_category/get_all_sub_service_category_usecase.interface'
import { editSubServiceCategoryZodValidationSchema } from '../../validations/sub_service_category/edit_sub_service_category.schema'
import { EditSubServiceCategoryRequestMapper } from '../../../application/mappers/sub_service_category/edit_sub_service_category_mapper'
import { IEditSubServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/sub_service_category/edit_sub_service_category_usecase.interface'
import { GetSingleSubServiceCategoryZodValidationSchema } from '../../validations/sub_service_category/get_single_sub_service_category.schema'
import { GetSingleSubServiceCategoryRequestMapper } from '../../../application/mappers/sub_service_category/get_single_sub_service_category_mapper'
import { IGetSingleSubServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/sub_service_category/get_single_sub_service_category_usecase.interface'
import { ToggleBlockStatusOfSubServiceCategoryZodValidationSchema } from '../../validations/sub_service_category/toggle_block_status_of_sub_service_category.schema'
import { toggleBlockStatusOfSubServiceCategoryRequestMapper } from '../../../application/mappers/sub_service_category/toggle_block_status_of_sub_service_category_mapper'
import { IToggleBlockStatusOfSubServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/sub_service_category/toggle_block_status_of_sub_service_usecase.interface'
import { ToggleVerificationStatusOfSubServiceCategoryZodValidationSchema } from '../../validations/sub_service_category/toggle_verification_status_of_sub_service_category.schema'
import { ToggleVerificationStatusOfSubServiceCategoryRequestMapper } from '../../../application/mappers/sub_service_category/toggle_verification_status_of_sub_service_category_mapper'
import { IToggleVerificationStatusOfSubServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/sub_service_category/toggle_verification_status_of_sub_service_category_usecase.interface'
import { getVendorSubServiceCategoriesZodValidationSchema } from '../../validations/sub_service_category/get_vendor_sub_service_category.schema'
import { GetVendorSubServiceCategoriesRequestMapper } from '../../../application/mappers/sub_service_category/get_vendor_sub_service_category_mapper'
import { IGetVendorSubServiceCategoriesUseCase } from '../../../domain/useCaseInterfaces/sub_service_category/get_vendor_sub_service_categories_usecase.interface'
import { GetAllSubServiceCategoriesBasedOnServiceCategoryIdZodValidationSchema } from '../../validations/sub_service_category/get_sub_service_categories_based_on_service_category_id.schema'
import { GetAllSubServiceCategoriesBasedOnServiceCategoryIdRequestMapper } from '../../../application/mappers/sub_service_category/get_sub_service_catergories_based_on_service_category_mapper'
import { IGetAllSubServiceCategoriesBasedOnServiceCategoryIdUseCase } from '../../../domain/useCaseInterfaces/sub_service_category/get_all_sub_service_categories_based_on_service_category_id_usecase.interface'

@injectable()
export class SubServiceCategoryController
  implements ISubServiceCategoryController
{
  constructor(
    @inject('ICreateSubServiceCategoryUseCase')
    private _createSubServiceCategoryUseCase: ICreateSubServiceCategoryUseCase,
    @inject('IGetAllSubServiceCategoryUseCase')
    private _getAllSubServiceCategoriesUseCase: IGetAllSubServiceCategoryUseCase,
    @inject('IEditSubServiceCategoryUseCase')
    private _editSubServiceCategoryUseCase: IEditSubServiceCategoryUseCase,
    @inject('IGetSingleSubServiceCategoryUseCase')
    private _getSingleSubServiceCategoryUseCase: IGetSingleSubServiceCategoryUseCase,
    @inject('IToggleBlockStatusOfSubServiceCategoryUseCase')
    private _toggleBlockStatusOfSubServiceCategoryUseCase: IToggleBlockStatusOfSubServiceCategoryUseCase,
    @inject('IToggleVerificationStatusOfSubServiceCategoryUseCase')
    private _toggleVerificationStatusOfSubServiceCategoryUseCase: IToggleVerificationStatusOfSubServiceCategoryUseCase,
    @inject('IGetVendorSubServiceCategoriesUseCase')
    private _getVendorSubServiceCategoriesUseCase: IGetVendorSubServiceCategoriesUseCase,
    @inject('IGetAllSubServiceCategoriesBasedOnServiceCategoryIdUseCase')
    private _getAllSubServiceCategoriesBasedOnServiceCategoryIdUseCase: IGetAllSubServiceCategoriesBasedOnServiceCategoryIdUseCase
  ) {}

  async createSubServiceCategories(req: Request, res: Response): Promise<void> {
    try {
      const validated = createSubServiceCategoryZodValidationSchema.parse({
        body: req.body,
        file: req.file,
      })

      const createdById = (req as CustomRequest).user?.userId ?? ''
      const createdByRole = (req as CustomRequest).user?.role ?? ''
      const isActive = 'active'

      const dto = CreateSubServiceCategoryRequestMapper.toDTO({
        body: validated.body,
        file: validated.file,
        createdById,
        createdByRole,
        isActive,
      })

      const response = await this._createSubServiceCategoryUseCase.execute(dto)

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.CREATED_SUB_SERVICE_CATEGORY,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async getAllSubServiceCategories(req: Request, res: Response): Promise<void> {
    try {
      const validated = getAllSubServiceCategoriesZodValidationSchema.parse(
        req.query
      )
      const dto = GetAllSubServiceCategoriesRequestMapper.toDTO({
        page: validated.page,
        limit: validated.limit,
        search: validated.search || '',
      })
      const response =
        await this._getAllSubServiceCategoriesUseCase.execute(dto)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SUB_SERVICE_CATEGORIES_FOUND_SUCCESSFULLY,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async editSubServiceCategory(req: Request, res: Response): Promise<void> {
    try {
      console.log('Entered')
      console.log('body', req.body)
      if (req.file) {
        console.log('file got ')
      }
      const validated = editSubServiceCategoryZodValidationSchema.parse({
        body: req.body,
        file: req.file,
      })
      console.log('validated', validated)
      const dto = EditSubServiceCategoryRequestMapper.toDTO({
        body: validated.body,
        file: validated.file,
      })
      console.log('dto', dto)
      const response = await this._editSubServiceCategoryUseCase.execute(dto)
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.EDITED_SUB_SERVICE_CATEGORY,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async getSingleSubServiceCategory(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      console.log('entered')
      const validated = GetSingleSubServiceCategoryZodValidationSchema.parse({
        params: req.params,
      })
      console.log('params', req.params)
      const subServiceCategoryId =
        GetSingleSubServiceCategoryRequestMapper.toDTO(validated)
      console.log('validation done', validated)
      const response = await this._getSingleSubServiceCategoryUseCase.execute({
        subServiceCategoryId,
      })

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SUB_SERVICE_CATEGORY_FETCHED_SUCCESSFULLY,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async toggleBlockStatusOfSubServiceCategory(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const validated =
        ToggleBlockStatusOfSubServiceCategoryZodValidationSchema.parse({
          params: { ...req.params, ...req.query },
        })
      const payload =
        toggleBlockStatusOfSubServiceCategoryRequestMapper.toDTO(validated)
      const response =
        await this._toggleBlockStatusOfSubServiceCategoryUseCase.execute(
          payload
        )
      res.json({
        success: true,
        message:
          SUCCESS_MESSAGES.SUB_SERVICE_CATEGORY_STATUS_CHANGED_SUCCESSFULLY,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async toggleVerificationStatusOfSubServiceCategory(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      console.log(
        'toggle verification status of sub service category,',
        req.params
      )
      const validated =
        ToggleVerificationStatusOfSubServiceCategoryZodValidationSchema.parse({
          payload: { ...req.params, ...req.query },
        })
      const payload =
        ToggleVerificationStatusOfSubServiceCategoryRequestMapper.toDTO(
          validated
        )
      const response =
        await this._toggleVerificationStatusOfSubServiceCategoryUseCase.execute(
          payload
        )
      res.json({
        success: true,
        message:
          SUCCESS_MESSAGES.SUB_SERVICE_CATEGORY_VERIFICATION_STATUS_CHANGED_SUCCESSFULLY,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async getVendorSubServiceCategories(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      console.log('get vendor sub service category controller')
      const validated = getVendorSubServiceCategoriesZodValidationSchema.parse(
        req.query
      )
      const vendorId = (req as CustomRequest).user.userId
      const dto = GetVendorSubServiceCategoriesRequestMapper.toDTO({
        query: { ...validated, vendorId },
      })

      const response =
        await this._getVendorSubServiceCategoriesUseCase.execute(dto)
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SUB_SERVICE_CATEGORIES_FOUND_SUCCESSFULLY,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
  async getAllSubServiceCategoriesBasedOnServiceCategoryId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const validated =
        GetAllSubServiceCategoriesBasedOnServiceCategoryIdZodValidationSchema.parse(
          { query: req.query }
        )
      const dto =
        GetAllSubServiceCategoriesBasedOnServiceCategoryIdRequestMapper.toDTO(
          validated
        )
      const response =
        await this._getAllSubServiceCategoriesBasedOnServiceCategoryIdUseCase.execute(
          dto
        )

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SUB_SERVICE_CATEGORIES_FOUND_SUCCESSFULLY,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
}
