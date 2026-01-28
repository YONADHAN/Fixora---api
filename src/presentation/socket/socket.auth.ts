import { Socket } from 'socket.io'
import * as cookie from 'cookie'

import { JWTService } from '../../interfaceAdapters/services/jwt_service'
import { CustomError } from '../../domain/utils/custom.error'

const tokenService = new JWTService()

interface AccessTokenPayload {
  userId: string
  role: string
  email: string
}

export const socketAuthMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  const transport = socket.conn.transport.name
  const isRecovered = socket.recovered === true

  console.log('\n SOCKET AUTH MIDDLEWARE')
  console.log('• socket.id   :', socket.id)
  console.log('• transport   :', transport)
  console.log('• recovered   :', isRecovered)

  try {
    const cookieHeader = socket.handshake.headers.cookie
    console.log('• cookies present:', Boolean(cookieHeader))

    if (!cookieHeader) {
      console.log('  No cookies yet (initial handshake)')
      return next()
    }

    const cookies = cookie.parse(cookieHeader)

    const accessToken =
      cookies.customer_access_token ||
      cookies.vendor_access_token ||
      cookies.admin_access_token

    const refreshToken =
      cookies.customer_refresh_token ||
      cookies.vendor_refresh_token ||
      cookies.admin_refresh_token

    console.log('• access token present :', Boolean(accessToken))
    console.log('• refresh token present:', Boolean(refreshToken))

    if (accessToken) {
      const decoded = tokenService.verifyAccessToken(accessToken)

      if (!decoded || typeof decoded === 'string') {
        console.log(' Invalid access token')

        if (refreshToken) {
          console.log(
            ' Access token invalid, but Refresh token present. Allowing as guest.',
          )
          socket.data.user = null
          return next()
        }

        return next(new CustomError('Invalid socket token', 401))
      }

      const payload = decoded as AccessTokenPayload

      console.log(' Authenticated socket user:', payload.userId)

      socket.data.user = payload
      socket.join(`user:${payload.userId}`)

      return next()
    }

    if (refreshToken) {
      console.log('  Refresh token present, waiting for re-auth')
      socket.data.user = null
      return next()
    }

    console.log('  No tokens found, connecting as guest')
    socket.data.user = null
    return next()
  } catch (error) {
    console.log(' Socket auth middleware error:', error)

    return next(new CustomError('Invalid socket token', 401))
  }
}
