import { Request, Response } from 'express'
import { BaseRoute } from './base_route'
import { addressController } from '../di/resolver'

export class AddressRoutes extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {
    this.router
      // Get all active addresses
      .get('/me', (req: Request, res: Response) => {
        addressController.getAddress(req, res)
      })

      // Add new address
      .post('/', (req: Request, res: Response) => {
        addressController.addAddress(req, res)
      })

      .get('/:addressId', (req: Request, res: Response) => {
        addressController.getSingleAddress(req, res)
      })

      // Edit address
      .patch('/:addressId', (req: Request, res: Response) => {
        addressController.editAddress(req, res)
      })

      // Set default address
      .patch('/:addressId/default', (req: Request, res: Response) => {
        addressController.setDefaultAddress(req, res)
      })

      // Soft delete address
      .delete('/:addressId', (req: Request, res: Response) => {
        addressController.deleteAddress(req, res)
      })
  }
}
