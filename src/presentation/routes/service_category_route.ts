import { BaseRoute } from './base_route'

export class ServiceCategoryRoutes extends BaseRoute {
  constructor() {
    super()
  }

  protected initializeRoutes(): void {
    // Routes for category CRUD
    this.router
      .route('/category')
      .get((req, res) => {
        // TODO: Get all categories
      })
      .post((req, res) => {
        // TODO: Create new category
      })
      .patch((req, res) => {
        // TODO: Edit category
      })

    // Separate route for blocking/unblocking category
    this.router.patch('/category/block', (req, res) => {
      // TODO: Block or unblock category
    })
  }
}
