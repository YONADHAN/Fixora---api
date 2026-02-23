import { RequestHandler } from 'express'
import { CustomRequest } from '../../presentation/middleware/auth_middleware'

export type CustomRequestHandler = RequestHandler<
  any,
  any,
  any,
  any,
  Record<string, any> & { user?: CustomRequest['user'] }
>
