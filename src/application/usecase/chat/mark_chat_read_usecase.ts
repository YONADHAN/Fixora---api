import { inject, injectable } from 'tsyringe'

import { IChatRepository } from '../../../domain/repositoryInterfaces/feature/chat/chat_repository.interface'
import { IMessageRepository } from '../../../domain/repositoryInterfaces/feature/chat/message_repository.interface'

import {
  IMarkChatReadUseCase,
  MarkChatReadInput,
} from '../../../domain/useCaseInterfaces/chat/mark_chat_read_usecase.interface'

import { CustomError } from '../../../domain/utils/custom.error'

@injectable()
export class MarkChatReadUseCase implements IMarkChatReadUseCase {
  constructor(
    @inject('IChatRepository')
    private readonly chatRepository: IChatRepository,

    @inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository
  ) {}

  async execute(input: MarkChatReadInput): Promise<void> {
    const { chatId, readerId, readerRole } = input

    /*  Fetch chat */
    const chat = await this.chatRepository.findByChatId(chatId)

    if (!chat) {
      throw new CustomError('Chat not found', 404)
    }

    /*  Authorize reader */
    const isCustomer = readerRole === 'customer' && chat.customerId === readerId
    const isVendor = readerRole === 'vendor' && chat.vendorId === readerId

    if (!isCustomer && !isVendor) {
      throw new CustomError('You are not allowed to read this chat', 403)
    }

    /*  Reset unread count for reader */
    await this.chatRepository.resetUnread(chatId, readerRole)

    /*  Mark messages as read */
    await this.messageRepository.markMessagesAsRead(chatId, readerId)
  }
}
