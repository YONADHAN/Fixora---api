import { inject, injectable } from 'tsyringe'
import { Request, Response } from 'express'
import { handleErrorResponse } from '../../../shared/utils/error_handler'
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../../shared/constants'
import { CustomRequest } from '../../middleware/auth_middleware'
import { IServiceController } from '../../../domain/controllerInterfaces/features/service/service-controller.interface'
import { createServiceZodValidationSchema } from '../../validations/service/create_service.schema'
import { CreateServiceRequestMapper } from '../../../application/mappers/service/create_service_mapper'
import { ICreateServiceUseCase } from '../../../domain/useCaseInterfaces/service/create_service_category_usecase.interface'
import { getAllServicesZodValidationSchema } from '../../validations/service/get_all_services.schema'
import { GetAllServicesRequestMapper } from '../../../application/mappers/service/get_all_service_mapper'
import { IGetAllServicesUseCase } from '../../../domain/useCaseInterfaces/service/get_all_services_usecase.interface'
import { GetServiceByIdZodValidationSchema } from '../../validations/service/get_service_by_id.schema'
import { GetServiceByIdRequestMapper } from '../../../application/mappers/service/get_service_by_id_mapper'
import { IGetServiceByIdUseCase } from '../../../domain/useCaseInterfaces/service/get_service_by_id_usecase.interface'
import { editServiceZodValidationSchema } from '../../validations/service/edit_service.schema'
import { EditServiceRequestMapper } from '../../../application/mappers/service/edit_service_mapper'
import { IEditServiceUseCase } from '../../../domain/useCaseInterfaces/service/edit_service_usecase.interface'
import { toggleServiceBlockZodValidationSchema } from '../../validations/service/toggle_service_block_status'
import { IToggleBlockServiceUseCase } from '../../../domain/useCaseInterfaces/service/toggle_block_service_usecase.interface'

@injectable()
export class ServiceController implements IServiceController {
  constructor(
    @inject('ICreateServiceUseCase')
    private _createServiceUseCase: ICreateServiceUseCase,
    @inject('IGetAllServicesUseCase')
    private _getAllServicesUseCase: IGetAllServicesUseCase,
    @inject('IGetServiceByIdUseCase')
    private _getServiceByIdUseCase: IGetServiceByIdUseCase,
    @inject('IEditServiceUseCase')
    private _editServiceUseCase: IEditServiceUseCase,
    @inject('IToggleBlockServiceUseCase')
    private _toggleBlockServiceUseCase: IToggleBlockServiceUseCase
  ) {}
  async createService(req: Request, res: Response): Promise<void> {
    try {
      const validated = createServiceZodValidationSchema.parse({
        body: req.body,
        files: req.files,
      })

      const vendorId = (req as CustomRequest).user?.userId ?? ''

      const rawData = {
        ...validated.body,
        vendorId,
      }

      const dto = CreateServiceRequestMapper.toDTO({
        rawData,
        files: req.files as Express.Multer.File[],
      })

      await this._createServiceUseCase.execute(dto)

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: SUCCESS_MESSAGES.SERVICE_CREATED_SUCCESSFULLY,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async getAllServices(req: Request, res: Response): Promise<void> {
    try {
      const vendorId = (req as CustomRequest).user?.userId
      let validated = getAllServicesZodValidationSchema.parse({
        query: { ...req.query, vendorId },
      })

      const dto = GetAllServicesRequestMapper.toDTO(validated)
      const response = await this._getAllServicesUseCase.execute(dto)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SERVICE_FOUND_SUCCESSFULLY,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async getServiceById(req: Request, res: Response): Promise<void> {
    try {
      const validated = GetServiceByIdZodValidationSchema.parse({
        params: req.params,
      })
      const dto = GetServiceByIdRequestMapper.toDTO(validated)
      const response = await this._getServiceByIdUseCase.execute(dto)
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.SERVICE_FOUND_SUCCESSFULLY,
        data: response,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async editService(req: Request, res: Response): Promise<void> {
    try {
      // console.log('files', req.files)
      // console.log('body', req.body)
      const validated = editServiceZodValidationSchema.parse({
        params: req.params,
        body: req.body,
        files: req.files,
      })

      const { serviceId } = validated.params
      // console.log('serviceId', serviceId)
      //console.log('raw data', validated.body)
      // if (validated.files) {
      //   console.log()
      // }
      const dto = EditServiceRequestMapper.toDTO({
        rawData: validated.body,
        files: validated.files,
      })
      //  console.log('Edited data', dto)
      const updated = await this._editServiceUseCase.execute(serviceId, dto)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Service updated successfully',
        data: updated,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async toggleServiceBlock(req: Request, res: Response): Promise<void> {
    try {
      const validated = toggleServiceBlockZodValidationSchema.parse({
        params: req.params,
      })
      const result = await this._toggleBlockServiceUseCase.execute(
        validated.params
      )
      res.status(200).json({
        success: true,
        message: `Service ${result.isActiveStatusByVendor ? 'unblocked' : 'blocked'} successfully`,
        data: result,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
}
