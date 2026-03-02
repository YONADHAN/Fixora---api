import multer from 'multer'
import { Request, Response, NextFunction } from 'express'

/**
 * Generic wrapper for handling Multer upload errors
 */
export const handleMulterError =
  (uploadFn: (req: Request, res: Response, cb: (err?: any) => void) => void) =>
    (req: Request, res: Response, next: NextFunction): void => {
      uploadFn(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          // Multer-specific errors (e.g. file too large, too many files)
          return res.status(400).json({ success: false, message: err.message })
        } else if (err) {
          // Other unknown errors
          return res.status(400).json({ success: false, message: err.message })
        }
        next()
      })
    }
