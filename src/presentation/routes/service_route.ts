import { BaseRoute } from './base_route'
import { upload } from '../../interfaceAdapters/config/multer.config'
import { handleMulterError } from '../middleware/multer_error_middleware'
import { authorizeRole, verifyAuth } from '../middleware/auth_middleware'
import { serviceController } from '../di/resolver'
import { blockMyUserMiddleware } from '../di/resolver'
import { CustomRequestHandler } from '../../shared/types/custom_request'

export class ServiceRoutes extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {
    // --------------------------
    // POST /service/create
    // --------------------------
    this.router.post(
      '/',
      verifyAuth,
      authorizeRole(['vendor']),
      blockMyUserMiddleware.checkMyUserBlockStatus as CustomRequestHandler,
      handleMulterError(upload.array('images', 1)),
      (req, res) => serviceController.createService(req, res)
    )

    // --------------------------
    // GET /service/all
    // --------------------------
    this.router.get('/', (req, res) =>
      serviceController.getAllServices(req, res)
    )

    // // --------------------------
    // // GET /service/:id
    // // --------------------------
    // this.router.get('/:serviceId', (req, res) =>
    //   serviceController.getServiceById(req, res)
    // )

    // // --------------------------
    // // PATCH /service/:id/edit
    // // --------------------------
    // this.router.patch(
    //   '/:serviceId/edit',
    //   verifyAuth,
    //   authorizeRole(['vendor']),
    //   blockMyUserMiddleware.checkMyUserBlockStatus as CustomRequestHandler,
    //   handleMulterError(upload.array('images', 10)),
    //   (req, res) => serviceController.editService(req, res)
    // )

    // // --------------------------
    // // PATCH /service/:id/toggleblock
    // // --------------------------
    // this.router.patch(
    //   '/:serviceId/toggleblock',
    //   verifyAuth,
    //   authorizeRole(['vendor', 'admin']),
    //   blockMyUserMiddleware.checkMyUserBlockStatus as CustomRequestHandler,
    //   (req, res) => serviceController.toggleServiceBlock(req, res) //here on the controller use factory and strategyy
    // )
  }
}
