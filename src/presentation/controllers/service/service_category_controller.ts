import { inject, injectable } from 'tsyringe'
import { Request, Response } from 'express'
import { handleErrorResponse } from '../../../shared/utils/error_handler'
import { IServiceCategoryController } from '../../../domain/controllerInterfaces/features/service/service-category-controller.interface'
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../../shared/constants'
import { IGetAllServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/service/service_category_usecase.interface'

import { ICreateServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/service/create_service_category_usecase.interface'
import { IEditServiceCategoryUseCase } from '../../../domain/useCaseInterfaces/service/edit_service_category_usecase.interface'

@injectable()
export class ServiceCategoryController implements IServiceCategoryController {
  constructor(
    @inject('IGetAllServiceCategoryUseCase')
    private _getAllServiceCategoryUseCase: IGetAllServiceCategoryUseCase,
    @inject('ICreateServiceCategoryUseCase')
    private _createServiceCategoryUseCase: ICreateServiceCategoryUseCase,
    @inject('IEditServiceCategoryUseCase')
    private _editServiceCategoryUseCase: IEditServiceCategoryUseCase,
    @inject('IBlockServiceCategoryUseCase')
    private _blockServiceCategoryUseCase: IBlockServiceCategoryUseCase
  ) {}
  async getAllServiceCategories(req: Request, res: Response): Promise<void> {
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
  async createServiceCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, bannerImage } = req.body

      await this._createServiceCategoryUseCase.execute({
        name,
        description,
        bannerImage,
      })

      res.status(HTTP_STATUS.OK).json({
        message: SUCCESS_MESSAGES.SERVICE_CATGORIES_CREATED_SUCCESSFULLY,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async editServiceCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId, name, description } = req.body
      const bannerImage = req.file

      await this._editServiceCategoryUseCase.execute(
        categoryId,
        name,
        description,
        bannerImage
      )

      res.status(200).json({
        success: true,
        message: SUCCESS_MESSAGES.SERVICE_CATEGORIES_EDITED_SUCCESSFULLY,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async blockServiceCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId, status } = req.body
      await this._blockServiceCategory.execute(categoryId, status)
      res
        .status(HTTP_STATUS.OK)
        .json({ message: SUCCESS_MESSAGES.SERVICE_BLOCKED_SUCCESSFULLY })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
}
