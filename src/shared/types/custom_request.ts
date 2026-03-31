import { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ParsedQs } from 'qs'
import { CustomRequest } from '../../presentation/middleware/auth_middleware'

export type CustomRequestHandler = RequestHandler<
  ParamsDictionary,
  unknown,
  unknown,
  ParsedQs,
  { user?: CustomRequest['user'] }
>
