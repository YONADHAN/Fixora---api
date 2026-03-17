import { HTTP_STATUS } from "../../shared/constants"

export class CustomError extends Error {
  statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'CustomError'
    this.statusCode = statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR

    Object.setPrototypeOf(this, CustomError.prototype)
  }
}
