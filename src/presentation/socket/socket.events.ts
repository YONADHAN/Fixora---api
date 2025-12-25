import { Socket } from 'socket.io'
import { SOCKET_EVENTS } from '../../shared/constants'

export const registerSocketEvents = (socket: Socket) => {
  //  Notification events
  socket.on(SOCKET_EVENTS.NOTIFICATION_READ, (notificationId: string) => {
    console.log(
      `User ${socket.data.user.userId} read notification ${notificationId}`
    )

    // Later:
    // dispatchEvent('NOTIFICATION_READ', { notificationId })
  })

  socket.on(SOCKET_EVENTS.NOTIFICATION_READ_ALL, () => {
    console.log(`User ${socket.data.user.userId} read all notifications`)
  })

  //  Chat events
  socket.on(SOCKET_EVENTS.CHAT_JOIN, (roomId: string) => {
    socket.join(`chat:${roomId}`)
  })

  socket.on(SOCKET_EVENTS.CHAT_LEAVE, (roomId: string) => {
    socket.leave(`chat:${roomId}`)
  })

  socket.on(SOCKET_EVENTS.CHAT_SEND, (payload) => {
    console.log('Chat message received:', payload)
  })

  //  Presence
  socket.on(SOCKET_EVENTS.PRESENCE_PING, () => {
    socket.emit('presence:pong')
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id)
  })
}
