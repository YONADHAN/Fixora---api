import { inject, injectable } from 'tsyringe'
import 'reflect-metadata'
import { handleErrorResponse } from '../../../shared/utils/error_handler'
import { Request, Response } from 'express'
import { IAddressController } from '../../../domain/controllerInterfaces/features/address/address-controller.interface'

import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../../shared/constants'
import {
  GetAddressBasicSchema,
  GetAddressRequestSchema,
} from '../../validations/address/get_addresses_schema'
import { GetAddressRequestMapper } from '../../../application/mappers/address/get_addresses_mapper'
import {
  AddAddressBasicSchema,
  AddAddressRequestSchema,
} from '../../validations/address/add_address_schema'
import { AddAddressMapper } from '../../../application/mappers/address/add_address_mapper'
import {
  EditAddressBasicSchema,
  EditAddressRequestSchema,
} from '../../validations/address/edit_address_schema'
import { EditAddressMapper } from '../../../application/mappers/address/edit_address_mapper'
import {
  SetDefaultAddressBasicSchema,
  SetDefaultAddressRequestSchema,
} from '../../validations/address/set_default_address_schema'
import {
  DeleteAddressBasicSchema,
  DeleteAddressRequestSchema,
} from '../../validations/address/delete_address_schema'
import { IGetAddressUseCase } from '../../../domain/useCaseInterfaces/address/get_address_usecase_interface'
import { IAddAddressUseCase } from '../../../domain/useCaseInterfaces/address/add_address_usecase_interface'
import { IEditAddressUseCase } from '../../../domain/useCaseInterfaces/address/edit_address_usecase_interface'
import { ISetDefaultAddressUseCase } from '../../../domain/useCaseInterfaces/address/set_default_address_usecase_interface'
import { IDeleteAddressUseCase } from '../../../domain/useCaseInterfaces/address/delete_address_usecase_interface'
import { GetSingleAddressSchema } from '../../validations/address/get_single_address_schema'
import { IGetSingleAddressUseCase } from '../../../domain/useCaseInterfaces/address/get_single_address_usecase_interface'

@injectable()
export class AddressController implements IAddressController {
  constructor(
    @inject('IGetAddressUseCase')
    private readonly _getAddressUseCase: IGetAddressUseCase,
    @inject('IAddAddressUseCase')
    private readonly _addAddressUseCase: IAddAddressUseCase,
    @inject('IEditAddressUseCase')
    private readonly _editAddressUseCase: IEditAddressUseCase,
    @inject('ISetDefaultAddressUseCase')
    private readonly _setDefaultAddressUseCase: ISetDefaultAddressUseCase,
    @inject('IDeleteAddressUseCase')
    private readonly _deleteAddressUseCase: IDeleteAddressUseCase,
    @inject('IGetSingleAddressUseCase')
    private readonly _getSingleAddressUseCase: IGetSingleAddressUseCase
  ) {}

  async getAddress(req: Request, res: Response): Promise<void> {
    try {
      const basic = GetAddressBasicSchema.parse(req.query)

      const dto = GetAddressRequestMapper.toDTO(basic)

      const validatedDTO = GetAddressRequestSchema.parse(dto)

      const data = await this._getAddressUseCase.execute(validatedDTO)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.ADDRESS_FOUND_SUCCESSFULLY,
        data,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async addAddress(req: Request, res: Response): Promise<void> {
    try {
      const basicData = AddAddressBasicSchema.parse(req.body)

      const dto = AddAddressMapper.toDTO(basicData)

      const validatedDTO = AddAddressRequestSchema.parse(dto)

      await this._addAddressUseCase.execute(validatedDTO)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.ADDRESS_ADDED_SUCCESSFULLY,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async editAddress(req: Request, res: Response): Promise<void> {
    try {
      const basicData = EditAddressBasicSchema.parse(req.body)
      const dto = EditAddressMapper.toDTO(basicData)
      const validatedDTO = EditAddressRequestSchema.parse(dto)
      await this._editAddressUseCase.execute(validatedDTO)
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.EDIT_ADDRESS_SUCCESSFULLY,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async setDefaultAddress(req: Request, res: Response): Promise<void> {
    try {
      const basic = SetDefaultAddressBasicSchema.parse(req.body)

      const validatedDTO = SetDefaultAddressRequestSchema.parse(basic)

      await this._setDefaultAddressUseCase.execute({
        addressId: validatedDTO.addressId,
      })

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.ADDRESS_SET_AS_DEFAULT_ADDRESS_SUCCESSFULLY,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }

  async deleteAddress(req: Request, res: Response): Promise<void> {
    try {
      const basic = DeleteAddressBasicSchema.parse(req.params)

      const validatedDTO = DeleteAddressRequestSchema.parse(basic)

      await this._deleteAddressUseCase.execute({
        addressId: validatedDTO.addressId,
      })

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.DELETED_SELECTED_ADDRESS_SUCCESSFULLY,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
  async getSingleAddress(req: Request, res: Response): Promise<void> {
    try {
      const validatedDTO = GetSingleAddressSchema.parse(req.params)
      const data = this._getSingleAddressUseCase.execute(validatedDTO)
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: SUCCESS_MESSAGES.ADDRESS_FOUND_SUCCESSFULLY,
        data,
      })
    } catch (error) {
      handleErrorResponse(req, res, error)
    }
  }
}
