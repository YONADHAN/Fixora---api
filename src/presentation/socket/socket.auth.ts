// import { Socket } from 'socket.io'
// import cookie from 'cookie'
// import { JWTService } from '../../interfaceAdapters/services/jwt_service'
// import { CustomError } from '../../domain/utils/custom.error'

// const tokenService = new JWTService()

// export const socketAuthMiddleware = (
//   socket: Socket,
//   next: (err?: Error) => void
// ) => {
//   try {
//     const cookieHeader = socket.handshake.headers.cookie
//     console.log(
//       '🔐 Socket cookies received:',
//       Boolean(socket.handshake.headers.cookie)
//     )
//     console.log('cookies :', socket.handshake.headers.cookie)

//     if (!cookieHeader) {
//       return next(new CustomError('No cookies provided', 401))
//     }

//     const cookies = cookie.parse(cookieHeader)

//     const accessToken =
//       cookies.customer_access_token ||
//       cookies.vendor_access_token ||
//       cookies.admin_access_token

//     if (!accessToken) {
//       return next(new CustomError('Socket authentication failed', 401))
//     }

//     const payload = tokenService.verifyAccessToken(accessToken) as {
//       userId: string
//       role: string
//       email: string
//     }

//     socket.data.user = {
//       userId: payload.userId,
//       role: payload.role,
//       email: payload.email,
//     }

//     next()
//   } catch (error) {
//     next(new CustomError('Invalid socket token', 401))
//   }
// }
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
  next: (err?: Error) => void
) => {
  const transport = socket.conn.transport.name
  const isRecovered = socket.recovered === true

  console.log('\n🔐 SOCKET AUTH MIDDLEWARE')
  console.log('• socket.id   :', socket.id)
  console.log('• transport   :', transport)
  console.log('• recovered   :', isRecovered)

  try {
    const cookieHeader = socket.handshake.headers.cookie
    console.log('• cookies present:', Boolean(cookieHeader))

    /**
     * 🚨 IMPORTANT:
     * First polling handshake MAY NOT send cookies.
     * Do NOT fail immediately.
     */
    if (!cookieHeader) {
      console.log('⚠️  No cookies yet (initial handshake)')
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

    /**
     * ✅ ACCESS TOKEN PATH
     */
    if (accessToken) {
      const decoded = tokenService.verifyAccessToken(accessToken)

      if (!decoded || typeof decoded === 'string') {
        console.log('❌ Invalid access token')
        return next(new CustomError('Invalid socket token', 401))
      }

      const payload = decoded as AccessTokenPayload

      console.log('✅ Authenticated socket user:', payload.userId)

      socket.data.user = payload
      socket.join(`user:${payload.userId}`)

      return next()
    }

    /**
     * 🔁 REFRESH TOKEN PRESENT
     * Allow connection but mark unauthenticated.
     * Client will refresh and reconnect.
     */
    if (refreshToken) {
      console.log('⚠️  Refresh token present, waiting for re-auth')
      socket.data.user = null
      return next()
    }

    /**
     * ❌ NO TOKENS AT ALL
     */
    console.log('❌ No tokens found')
    return next(new CustomError('Socket authentication failed', 401))
  } catch (error) {
    console.log('❌ Socket auth middleware error:', error)
    return next(new CustomError('Invalid socket token', 401))
  }
}

// import { Socket } from 'socket.io'
// import cookie from 'cookie'
// import { JWTService } from '../../interfaceAdapters/services/jwt_service'
// import { CustomError } from '../../domain/utils/custom.error'

// const tokenService = new JWTService()

// interface AccessTokenPayload {
//   userId: string
//   role: string
//   email: string
// }

// export const socketAuthMiddleware = (
//   socket: Socket,
//   next: (err?: Error) => void
// ) => {
//   console.log('socket auth middleware is called')
//   try {
//     const cookieHeader = socket.handshake.headers.cookie
//     console.log('1. coookie header : ', cookieHeader)
//     // if (!cookieHeader) return next()
//     if (!cookieHeader) {
//       return next(new CustomError('Socket auth cookie missing', 401))
//     }
//     console.log('cookie header exists, continuing auth')

//     const cookies = cookie.parse(cookieHeader)
//     console.log('cookies', cookies)
//     const accessToken =
//       cookies.customer_access_token ||
//       cookies.vendor_access_token ||
//       cookies.admin_access_token

//     const refreshToken =
//       cookies.customer_refresh_token ||
//       cookies.vendor_refresh_token ||
//       cookies.admin_refresh_token
//     console.log('access token', accessToken)
//     console.log('refresh token', refreshToken)
//     // 🔹 ACCESS TOKEN PATH
//     if (accessToken) {
//       console.log('2. yes access toekn received on socekt auth midddlware')
//       const decoded = tokenService.verifyAccessToken(accessToken)
//       console.log('3. Decoded access token', accessToken)
//       if (!decoded || typeof decoded === 'string' || !('userId' in decoded)) {
//         console.log(
//           '4. The token error emited from the codition on socket auth middleware invalid socket token'
//         )
//         return next(new CustomError('Invalid socket token', 401))
//       }

//       const payload = decoded as AccessTokenPayload
//       console.log('5. received the decoded access token as payload : ', payload)
//       socket.data.user = payload
//       socket.join(`user:${payload.userId}`)
//       console.log('6. socket.data.user is ', socket.data.user)
//       return next()
//     }

//     // 🔹 REFRESH TOKEN PATH (allow provisional connect)
//     if (refreshToken) {
//       console.log('7. refresh token is getting checked yes')
//       socket.data.user = null
//       return next()
//     }
//     console.log('8. Now socket.data.user is :', socket.data.user)
//     return next(new CustomError('Invalid socket token', 401))
//   } catch {
//     next(new CustomError('Invalid socket token', 401))
//   }
// }
