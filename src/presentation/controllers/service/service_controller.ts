import { inject, injectable } from 'tsyringe'
import { Request, Response } from 'express'
import { handleErrorResponse } from '../../../shared/utils/error_handler'
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../../shared/constants'
import { CustomRequest } from '../../middleware/auth_middleware'
import { IServiceController } from '../../../domain/controllerInterfaces/features/service/service-controller.interface'
import { createServiceZodValidationSchema } from '../../validations/service/create_service.schema'
import { CreateServiceRequestMapper } from '../../../application/mappers/service/create_service_mapper'
import { ICreateServiceUseCase } from '../../../domain/useCaseInterfaces/service/create_service_category_usecase.interface'

@injectable()
export class ServiceController implements IServiceController {
  constructor(
    @inject('ICreateServiceUseCase')
    private _createServiceUseCase: ICreateServiceUseCase
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
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
}
