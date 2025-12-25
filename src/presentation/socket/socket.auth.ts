import { Socket } from 'socket.io'
import { JWTService } from '../../interfaceAdapters/services/jwt_service'
import { CustomError } from '../../domain/utils/custom.error'

const tokenService = new JWTService()

interface SocketJWTPayload {
  userId: string
  email: string
  role: string
}

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void
) => {
  try {
    const token = socket.handshake.auth?.token

    if (!token) {
      return next(new CustomError('Socket authentication failed', 401))
    }

    // Verify access token using existing service
    const payload = tokenService.verifyAccessToken(token) as SocketJWTPayload

    if (!payload?.userId) {
      return next(new CustomError('Invalid socket token', 401))
    }

    // Attach user to socket context
    socket.data.user = {
      userId: payload.userId,
      role: payload.role,
      email: payload.email,
    }

    next()
  } catch (error) {
    next(new CustomError('Invalid socket token', 401))
  }
}
