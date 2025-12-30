import { Socket } from 'socket.io'
import { container } from 'tsyringe'
import { SOCKET_EVENTS } from '../../shared/constants'

import { IMarkNotificationReadUseCase } from '../../domain/useCaseInterfaces/notification/mark_notification_read_usecase.interface'
import { IMarkAllNotificationsReadUseCase } from '../../domain/useCaseInterfaces/notification/mark_all_notifications_read_usecase.interface'

export const registerSocketEvents = (socket: Socket) => {
  const markReadUseCase = container.resolve<IMarkNotificationReadUseCase>(
    'IMarkNotificationReadUseCase'
  )

  const markAllReadUseCase =
    container.resolve<IMarkAllNotificationsReadUseCase>(
      'IMarkAllNotificationsReadUseCase'
    )

  /* -------------------- NOTIFICATIONS -------------------- */

  socket.on(
    SOCKET_EVENTS.NOTIFICATION_READ,
    async (notificationId: string, ack?: (res: any) => void) => {
      try {
        await markReadUseCase.execute(notificationId, socket.data.user.userId)

        ack?.({ success: true })
      } catch (error) {
        ack?.({ success: false })
      }
    }
  )

  socket.on(
    SOCKET_EVENTS.NOTIFICATION_READ_ALL,
    async (ack?: (res: any) => void) => {
      try {
        await markAllReadUseCase.execute(socket.data.user.userId)

        ack?.({ success: true })
      } catch (error) {
        ack?.({ success: false })
      }
    }
  )

  /* -------------------- CHAT  -------------------- */

  socket.on(SOCKET_EVENTS.CHAT_JOIN, (roomId: string) => {
    socket.join(`chat:${roomId}`)
  })

  socket.on(SOCKET_EVENTS.CHAT_LEAVE, (roomId: string) => {
    socket.leave(`chat:${roomId}`)
  })

  socket.on(SOCKET_EVENTS.CHAT_SEND, (payload) => {
    console.log('Chat message received:', payload)
  })

  /* -------------------- PRESENCE -------------------- */

  socket.on(SOCKET_EVENTS.PRESENCE_PING, () => {
    socket.emit('presence:pong')
  })

  /*--------------------TYPING------------------*/

  socket.on(SOCKET_EVENTS.CHAT_TYPING_START, ({ chatId }) => {
    socket.to(`chat:${chatId}`).emit(SOCKET_EVENTS.CHAT_TYPING_START, {
      userId: socket.data.user.userId,
    })
  })

  socket.on(SOCKET_EVENTS.CHAT_TYPING_STOP, ({ chatId }) => {
    socket.to(`chat:${chatId}`).emit(SOCKET_EVENTS.CHAT_TYPING_STOP, {
      userId: socket.data.user.userId,
    })
  })
}
