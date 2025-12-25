import { Server } from 'socket.io'
import http from 'http'
import { socketAuthMiddleware } from './socket.auth'
import { registerRooms } from './socket.room'
import { registerSocketEvents } from './socket.events'

let io: Server

export const initSocketServer = (httpServer: http.Server) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  })

  io.use(socketAuthMiddleware)

  io.on('connection', (socket) => {
    registerRooms(socket)
    registerSocketEvents(socket)

    console.log('Socket connected:', socket.id)
  })

  return io
}

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized')
  return io
}
