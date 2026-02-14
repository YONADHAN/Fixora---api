import { Request, Response } from 'express'
import { BaseRoute } from './base_route'
import { addressController } from '../di/resolver'

export class AddressRoutes extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {
    this.router

      .get('/me', (req: Request, res: Response) => {
        addressController.getAddress(req, res)
      })


      .post('/', (req: Request, res: Response) => {
        addressController.addAddress(req, res)
      })

      .get('/:addressId', (req: Request, res: Response) => {
        addressController.getSingleAddress(req, res)
      })


      .patch('/:addressId', (req: Request, res: Response) => {
        addressController.editAddress(req, res)
      })


      .patch('/:addressId/default', (req: Request, res: Response) => {
        addressController.setDefaultAddress(req, res)
      })


      .delete('/:addressId', (req: Request, res: Response) => {
        addressController.deleteAddress(req, res)
      })
  }
}
