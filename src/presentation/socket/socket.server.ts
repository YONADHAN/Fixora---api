import { Server } from 'socket.io'
import http from 'http'
import chalk from 'chalk'

import { socketAuthMiddleware } from './socket.auth'
import { registerRooms } from './socket.room'
import { registerSocketEvents } from './socket.events'
import { SOCKET_EVENTS, SocketUser } from '../../shared/constants'

let io: Server

const onlineUsers = new Map<string, number>()

export const initSocketServer = (httpServer: http.Server) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_FRONTEND_URL,
      credentials: true,
    },
  })

  io.use(socketAuthMiddleware)

  io.on('connection', (socket) => {
    const getUser = () => socket.data.user as SocketUser | undefined

    const user = getUser()

    if (user?.userId) {
      socket.join(`user:${user.userId}`)

      const count = onlineUsers.get(user.userId) || 0
      onlineUsers.set(user.userId, count + 1)

      if (count === 0) {
        io.emit(SOCKET_EVENTS.USER_ONLINE, {
          userId: user.userId,
        })
      }

      onlineUsers.forEach((_, id) => {
        if (id !== user.userId) {
          socket.emit(SOCKET_EVENTS.USER_ONLINE, {
            userId: id,
          })
        }
      })
    }

    registerRooms(socket)
    registerSocketEvents(socket)

    console.log(
      chalk.cyanBright('🔌 Socket connected:'),
      chalk.white(socket.id),
      chalk.gray(`(user: ${getUser()?.userId})`),
    )

    socket.on('disconnect', () => {
      const user = getUser()
      if (!user?.userId) return

      const count = onlineUsers.get(user.userId) || 1
      const newCount = count - 1

      if (newCount <= 0) {
        onlineUsers.delete(user.userId)

        io.emit(SOCKET_EVENTS.USER_OFFLINE, {
          userId: user.userId,
        })
      } else {
        onlineUsers.set(user.userId, newCount)
      }

      console.log(
        chalk.redBright('🔌 Socket disconnected:'),
        chalk.white(socket.id),
        chalk.gray(`(user: ${user.userId})`),
      )
    })
  })

  console.log(
    chalk.greenBright.bold('⚡ Socket.IO server initialized and ready'),
  )

  return io
}

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized')
  return io
}
