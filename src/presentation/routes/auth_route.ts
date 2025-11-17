import { verifyAuth } from '../middleware/auth_middleware'
import { BaseRoute } from './base_route'
import { Request, Response } from 'express'
import { IAuthController } from 'domain/controllerInterfaces/users/auth-controller.interface'
export class AuthRoutes extends BaseRoute {
  constructor(private authController: IAuthController) {
    super()
  }

  protected initializeRoutes(): void {
    this.router.post('/send-otp', (req: Request, res: Response) => {
      this.authController.sendOtpEmail(req, res)
    })
    this.router.post('/verify-otp', (req: Request, res: Response) => {
      this.authController.verifyOtp(req, res)
    })
    this.router.post('/signup', (req: Request, res: Response) => {
      this.authController.register(req, res)
    })

    this.router.post('/signin', (req: Request, res: Response) => {
      this.authController.login(req, res)
    })

    this.router.post('/forgot-password', (req: Request, res: Response) => {
      this.authController.forgotPassword(req, res)
    })
    this.router.post('/reset-password', (req: Request, res: Response) => {
      this.authController.resetPassword(req, res)
    })
    this.router.post('/logout', (req: Request, res: Response) => {
      this.authController.logout(req, res)
    })

    this.router.post('/google-auth', (req: Request, res: Response) => {
      this.authController.authenticateWithGoogle(req, res)
    })

    this.router.post(
      '/change-password',
      verifyAuth,
      (req: Request, res: Response) => {
        this.authController.changeMyPassword(req, res)
      }
    )
  }
}
