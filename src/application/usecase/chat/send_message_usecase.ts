import { inject, injectable } from 'tsyringe'
import { v4 as uuid } from 'uuid'

import { IChatRepository } from '../../../domain/repositoryInterfaces/feature/chat/chat_repository.interface'
import { IMessageRepository } from '../../../domain/repositoryInterfaces/feature/chat/message_repository.interface'

import {
  ISendMessageUseCase,
  SendMessageInput,
  SendMessageOutput,
} from '../../../domain/useCaseInterfaces/chat/send_message_usecase.interface'

import { CustomError } from '../../../domain/utils/custom.error'

@injectable()
export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    @inject('IChatRepository')
    private readonly chatRepository: IChatRepository,

    @inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository,
  ) { }

  async execute(input: SendMessageInput): Promise<SendMessageOutput> {
    const {
      chatId,
      senderId,
      senderRole,
      content,
      messageType = 'text',
      replyTo,
      booking,
    } = input

    const chat = await this.chatRepository.findByChatId(chatId)

    if (!chat) {
      throw new CustomError('Chat not found', 404)
    }

    const isCustomer =
      senderRole === 'customer' && chat.customer!.userId === senderId
    const isVendor = senderRole === 'vendor' && chat.vendor!.userId === senderId

    if (!isCustomer && !isVendor) {
      throw new CustomError('You are not a participant of this chat', 403)
    }

    const message = await this.messageRepository.createMessage({
      messageId: uuid(),
      chatId,
      senderId,
      senderRole,
      content,
      messageType,
      replyTo,
      booking,
      isRead: false,
    })

    await this.chatRepository.updateLastMessage(chatId, {
      messageId: message.messageId,
      content: message.content,
      senderId: message.senderId,
      senderRole: message.senderRole,
      createdAt: message.createdAt!,
    })

    const receiverRole = senderRole === 'customer' ? 'vendor' : 'customer'
    await this.chatRepository.incrementUnread(chatId, receiverRole)

    return {
      message,
      chat: {
        ...chat,
        lastMessage: {
          messageId: message.messageId,
          content: message.content,
          senderId: message.senderId,
          senderRole: message.senderRole,
          createdAt: message.createdAt!,
        },
        unreadCount: {
          customer:
            senderRole === 'vendor'
              ? chat.unreadCount.customer + 1
              : chat.unreadCount.customer,
          vendor:
            senderRole === 'customer'
              ? chat.unreadCount.vendor + 1
              : chat.unreadCount.vendor,
        },
      } as any,
    }
  }
}
