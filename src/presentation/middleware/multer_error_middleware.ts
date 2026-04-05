


import multer from 'multer'
import { Request, Response, NextFunction } from 'express'
import { HTTP_STATUS } from '../../shared/constants'

export const handleMulterError =
  (uploadFn: (req: Request, res: Response, cb: (err?: unknown) => void) => void) =>
  (req: Request, res: Response, next: NextFunction): void => {
    uploadFn(req, res, (err) => {
      
      if (err instanceof multer.MulterError) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: err.message,
        })
      } 

      if (err instanceof Error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: err.message,
        })
      }

      next()
    })
  }

