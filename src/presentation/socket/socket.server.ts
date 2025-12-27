import { Server } from 'socket.io'
import http from 'http'
import chalk from 'chalk'

import { socketAuthMiddleware } from './socket.auth'
import { registerRooms } from './socket.room'
import { registerSocketEvents } from './socket.events'

let io: Server

export const initSocketServer = (httpServer: http.Server) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_FRONTEND_URL,
      credentials: true,
    },
  })

  io.use(socketAuthMiddleware)

  io.on('connection', (socket) => {
    registerRooms(socket)
    registerSocketEvents(socket)

    console.log(
      chalk.cyanBright('🔌 Socket connected:'),
      chalk.white(socket.id)
    )
  })

  console.log(
    chalk.greenBright.bold('⚡ Socket.IO server initialized and ready')
  )

  return io
}

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized')
  return io
}
