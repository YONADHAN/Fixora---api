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
import {
  activeCalls,
  CallAcceptPayload,
  CallEndPayload,
  CallInitiatePayload,
  CallRejectPayload,
} from '../../shared/types/socket/video-chat.type'
import { IChatRepository } from '../../domain/repositoryInterfaces/feature/chat/chat_repository.interface'

export const registerSocketEvents = (socket: Socket) => {
  const markReadUseCase = container.resolve<IMarkNotificationReadUseCase>(
    'IMarkNotificationReadUseCase',
  )
  const sendMessageUseCase = container.resolve<ISendMessageUseCase>(
    'ISendMessageUseCase',
  )

  const markChatReadUseCase = container.resolve<IMarkChatReadUseCase>(
    'IMarkChatReadUseCase',
  )

  const markAllReadUseCase =
    container.resolve<IMarkAllNotificationsReadUseCase>(
      'IMarkAllNotificationsReadUseCase',
    )

  const chatRepository = container.resolve<IChatRepository>('IChatRepository')

  //Notifications

  socket.on(
    SOCKET_EVENTS.NOTIFICATION_READ,
    async (notificationId: string, ack?: (res: any) => void) => {
      try {
        await markReadUseCase.execute(notificationId, socket.data.user.userId)

        ack?.({ success: true })
      } catch (error) {
        ack?.({ success: false })
      }
    },
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
    },
  )

  //Chat

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
      ack?: (res: SocketAckResponse) => void,
    ) => {
      try {
        const user = socket.data.user as SocketUser

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

        //List Update
        const receiverId =
          user.role === 'customer' ? chat.vendor?.userId : chat.customer?.userId

        socket.to(`user:${receiverId}`).emit(SOCKET_EVENTS.CHAT_LIST_UPDATE, {
          ...chat,
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
    },
  )

  //Presence

  socket.on(SOCKET_EVENTS.PRESENCE_PING, () => {
    socket.emit('presence:pong')
  })

  socket.on(
    SOCKET_EVENTS.CHAT_READ,
    async (chatId: string, ack?: (res: { success: boolean }) => void) => {
      try {
        const user = socket.data.user as SocketUser

        if (user.role !== 'customer' && user.role !== 'vendor') {
          ack?.({ success: false })
          return
        }

        await markChatReadUseCase.execute({
          chatId,
          readerId: user.userId,
          readerRole: user.role,
        })

        socket.to(`chat:${chatId}`).emit('chat:read:update', {
          chatId,
          readerId: user.userId,
        })

        ack?.({ success: true })
      } catch {
        ack?.({ success: false })
      }
    },
  )

  //Typing

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

  //Dashboard

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

  //Video call feature
  socket.on(
    SOCKET_EVENTS.CALL_INITIATE,
    async ({ chatId }: { chatId: string }) => {
      console.log(`${socket.data.user} initiated the call on chat ${chatId}`)
      const caller = socket.data.user as SocketUser

      const chat = await chatRepository.findByChatId(chatId)
      if (!chat) return

      const receiverId =
        caller.userId === chat.customer?.userId
          ? chat.vendor?.userId
          : chat.customer?.userId
      if (!receiverId) return

      activeCalls.set(chatId, {
        callerId: caller.userId,
        receiverId,
      })

      socket.to(`user:${receiverId}`).emit(SOCKET_EVENTS.CALL_INCOMING, {
        chatId,
        from: caller.userId,
        role: caller.role,
      })
    },
  )

  socket.on(
    SOCKET_EVENTS.CALL_ACCEPT,
    async ({ chatId }: { chatId: string }) => {
      const call = activeCalls.get(chatId)
      if (!call) return
      socket.to(`user:${call.callerId}`).emit(SOCKET_EVENTS.CALL_ACCEPT, {
        chatId,
      })
    },
  )

  socket.on(
    SOCKET_EVENTS.CALL_REJECT,
    async ({ chatId }: { chatId: string }) => {
      const call = activeCalls.get(chatId)
      if (!call) return

      socket.to(`user:${call.callerId}`).emit(SOCKET_EVENTS.CALL_REJECT, {
        chatId,
      })
      activeCalls.delete(chatId)
    },
  )

  //webrtc signaling

  socket.on(SOCKET_EVENTS.WEBRTC_OFFER, ({ chatId, offer }) => {
    const call = activeCalls.get(chatId)
    if (!call) return
    socket
      .to(`user:${call.receiverId}`)
      .emit(SOCKET_EVENTS.WEBRTC_OFFER, { offer })
  })

  socket.on(SOCKET_EVENTS.WEBRTC_ANSWER, ({ chatId, answer }) => {
    const call = activeCalls.get(chatId)
    if (!call) return
    socket
      .to(`user:${call.callerId}`)
      .emit(SOCKET_EVENTS.WEBRTC_ANSWER, { answer })
  })

  socket.on(SOCKET_EVENTS.WEBRTC_ICE, ({ chatId, candidate }) => {
    const call = activeCalls.get(chatId)
    if (!call) return
    const sender = socket.data.user as SocketUser
    if (sender.userId === call.callerId) {
      socket
        .to(`user:${call.receiverId}`)
        .emit(SOCKET_EVENTS.WEBRTC_ICE, { candidate })
    } else {
      socket
        .to(`user:${call.callerId}`)
        .emit(SOCKET_EVENTS.WEBRTC_ICE, { candidate })
    }
  })
}

// socket.on(
//   SOCKET_EVENTS.CALL_INITIATE,
//async ({ chatId, callType }: CallInitiatePayload) => {
//     console.log(
//       '1. Call Initiated by pressing the camera button on the Chat page, received chatID and callType:',
//       chatId,
//       callType,
//     )
//     const caller = socket.data.user as SocketUser

//     const chat = await chatRepository.findByChatId(chatId)
//     if (!chat) return

//     const receiverId =
//       caller.role === 'customer' ? chat.vendor?.userId : chat.customer?.userId

//     if (!receiverId) return

//     activeCalls.set(chatId, {
//       callerId: caller.userId,
//       receiverId,
//     })

//     socket.to(`user:${receiverId}`).emit(SOCKET_EVENTS.CALL_INCOMING, {
//       chatId,
//       from: caller.userId,
//       role: caller.role,
//       callType,
//     })
//   },
// )

// socket.on(
//   SOCKET_EVENTS.CALL_ACCEPT,
//   async ({ chatId }: CallAcceptPayload) => {
//     const call = activeCalls.get(chatId)
//     if (!call) return

//     socket.to(`user:${call.callerId}`).emit(SOCKET_EVENTS.CALL_ACCEPT, {
//       chatId,
//     })
//   },
// )

// socket.on(
//   SOCKET_EVENTS.CALL_REJECT,
//   async ({ chatId }: CallRejectPayload) => {
//     const call = activeCalls.get(chatId)
//     if (!call) return

//     socket.to(`user:${call.callerId}`).emit(SOCKET_EVENTS.CALL_REJECT, {
//       chatId,
//     })

//     activeCalls.delete(chatId)
//   },
// )

// socket.on(SOCKET_EVENTS.CALL_READY, ({ chatId }) => {
//   console.log('call ready socket event triggered')
//   const call = activeCalls.get(chatId)
//   if (!call) return
//   console.log('[SOCKET] CALL_READY forwarded to caller')
//   socket.to(`user:${call.callerId}`).emit(SOCKET_EVENTS.CALL_READY)
// })

// socket.on(SOCKET_EVENTS.CALL_END, async ({ chatId }: CallEndPayload) => {
//   const call = activeCalls.get(chatId)
//   if (!call) return

//   socket.to(`user:${call.callerId}`).emit(SOCKET_EVENTS.CALL_END, { chatId })
//   socket
//     .to(`user:${call.receiverId}`)
//     .emit(SOCKET_EVENTS.CALL_END, { chatId })

//   activeCalls.delete(chatId)
// })

// //webrtc signaling

// // OFFER
// socket.on(SOCKET_EVENTS.WEBRTC_OFFER, ({ chatId, offer }) => {
//   const call = activeCalls.get(chatId)
//   if (!call) return

//   // send offer to receiver
//   socket
//     .to(`user:${call.receiverId}`)
//     .emit(SOCKET_EVENTS.WEBRTC_OFFER, { offer })
// })

// // ANSWER
// socket.on(SOCKET_EVENTS.WEBRTC_ANSWER, ({ chatId, answer }) => {
//   const call = activeCalls.get(chatId)
//   if (!call) return

//   // send answer to caller
//   socket
//     .to(`user:${call.callerId}`)
//     .emit(SOCKET_EVENTS.WEBRTC_ANSWER, { answer })
// })

// socket.on(SOCKET_EVENTS.WEBRTC_ICE, ({ chatId, candidate }) => {
//   const call = activeCalls.get(chatId)
//   if (!call) return

//   const sender = socket.data.user as SocketUser

//   // Send ICE to the OTHER peer only
//   if (sender.userId === call.callerId) {
//     socket
//       .to(`user:${call.receiverId}`)
//       .emit(SOCKET_EVENTS.WEBRTC_ICE, { candidate })
//   } else {
//     socket
//       .to(`user:${call.callerId}`)
//       .emit(SOCKET_EVENTS.WEBRTC_ICE, { candidate })
//   }
// })
