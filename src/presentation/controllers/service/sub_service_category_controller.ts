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
    private _toggleVerificationStatusOfSubServiceCategoryUseCase: IToggleVerificationStatusOfSubServiceCategoryUseCase
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
      const validated = editSubServiceCategoryZodValidationSchema.parse({
        body: req.body,
        file: req.file,
      })
      const dto = EditSubServiceCategoryRequestMapper.toDTO({
        body: validated.body,
        file: validated.file,
      })
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
      const validated = GetSingleSubServiceCategoryZodValidationSchema.parse({
        params: req.params,
      })
      const subServiceCategoryId =
        GetSingleSubServiceCategoryRequestMapper.toDTO(validated)
      const response = await this._getSingleSubServiceCategoryUseCase.execute({
        subServiceCategoryId,
      })
      res.json(HTTP_STATUS.OK).json({
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
          params: req.params,
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
      const validated =
        ToggleVerificationStatusOfSubServiceCategoryZodValidationSchema.parse({
          params: req.params,
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
}
