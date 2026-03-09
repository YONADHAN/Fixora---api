import multer from 'multer'
import { Request, Response, NextFunction } from 'express'


export const handleMulterError =
  (uploadFn: (req: Request, res: Response, cb: (err?: Error) => void) => void) =>
    (req: Request, res: Response, next: NextFunction): void => {
      uploadFn(req, res, (err) => {
        if (err instanceof multer.MulterError) {
         
          return res.status(400).json({ success: false, message: err.message })
        } else if (err) {
         
          return res.status(400).json({ success: false, message: err.message })
        }
        next()
      })
    }
