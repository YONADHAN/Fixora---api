import { Socket } from 'socket.io'
import { container } from 'tsyringe'
import { SOCKET_EVENTS, SocketUser } from '../../shared/constants'

import { IMarkNotificationReadUseCase } from '../../domain/useCaseInterfaces/notification/mark_notification_read_usecase.interface'
import { IMarkAllNotificationsReadUseCase } from '../../domain/useCaseInterfaces/notification/mark_all_notifications_read_usecase.interface'

import { ISendMessageUseCase } from '../../domain/useCaseInterfaces/chat/send_message_usecase.interface'

import {
  ChatSendPayload,
  SocketAckResponse,
} from '../../shared/types/socket/chat.socket.type'
import { IMarkChatReadUseCase } from '../../domain/useCaseInterfaces/chat/mark_chat_read_usecase.interface'

export const registerSocketEvents = (socket: Socket) => {
  const markReadUseCase = container.resolve<IMarkNotificationReadUseCase>(
    'IMarkNotificationReadUseCase'
  )
  const sendMessageUseCase = container.resolve<ISendMessageUseCase>(
    'ISendMessageUseCase'
  )

  const markChatReadUseCase = container.resolve<IMarkChatReadUseCase>(
    'IMarkChatReadUseCase'
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

  socket.on(
    SOCKET_EVENTS.CHAT_SEND,
    async (
      payload: ChatSendPayload,
      ack?: (res: SocketAckResponse) => void
    ) => {
      try {
        const user = socket.data.user as SocketUser

        //  Role guard (fixes TS + security)
        if (user.role !== 'customer' && user.role !== 'vendor') {
          ack?.({
            success: false,
            message: 'Admins are not allowed to send chat messages',
          })
          return
        }

        const { message, chat } = await sendMessageUseCase.execute({
          chatId: payload.chatId,
          senderId: user.userId,
          senderRole: user.role,
          content: payload.content,
          messageType: payload.messageType,
          replyTo: payload.replyTo,
          booking: payload.booking,
        })

        socket
          .to(`chat:${payload.chatId}`)
          .emit(SOCKET_EVENTS.CHAT_NEW, message)

        socket.emit(SOCKET_EVENTS.CHAT_NEW, message)

        /* --------------------  REAL-TIME LIST UPDATE -------------------- */
        const receiverId =
          user.role === 'customer' ? chat.vendor?.userId : chat.customer?.userId

        socket.to(`user:${receiverId}`).emit(SOCKET_EVENTS.CHAT_LIST_UPDATE, {
          ...chat, // Send full chat details including customer/vendor populated data
          chatId: chat.chatId,
          lastMessage: chat.lastMessage,
          unreadCount: chat.unreadCount,
        })

        ack?.({
          success: true,
          data: message,
        })
      } catch (error) {
        ack?.({
          success: false,
          message:
            error instanceof Error ? error.message : 'Failed to send message',
        })
      }
    }
  )

  /* -------------------- PRESENCE -------------------- */

  socket.on(SOCKET_EVENTS.PRESENCE_PING, () => {
    socket.emit('presence:pong')
  })

  socket.on(
    SOCKET_EVENTS.CHAT_READ,
    async (chatId: string, ack?: (res: { success: boolean }) => void) => {
      try {
        const user = socket.data.user as SocketUser

        //  Only chat participants can mark read
        if (user.role !== 'customer' && user.role !== 'vendor') {
          ack?.({ success: false })
          return
        }

        await markChatReadUseCase.execute({
          chatId,
          readerId: user.userId,
          readerRole: user.role,
        })

        //  Optional: notify other participant
        socket.to(`chat:${chatId}`).emit('chat:read:update', {
          chatId,
          readerId: user.userId,
        })

        ack?.({ success: true })
      } catch {
        ack?.({ success: false })
      }
    }
  )

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

  /* -------------------- DASHBOARD -------------------- */

  socket.on(SOCKET_EVENTS.DASHBOARD_JOIN_ADMIN, () => {
    const user = socket.data.user as SocketUser
    if (user?.role === 'admin') {
      socket.join('admin_dashboard')
    }
  })

  socket.on(SOCKET_EVENTS.DASHBOARD_JOIN_VENDOR, () => {
    const user = socket.data.user as SocketUser
    if (user?.role === 'vendor') {
      socket.join(`vendor_${user.userId}_dashboard`)
    }
  })
}
