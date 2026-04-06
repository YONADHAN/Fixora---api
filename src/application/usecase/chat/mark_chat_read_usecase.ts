import { inject, injectable } from 'tsyringe'

import { IChatRepository } from '../../../domain/repositoryInterfaces/feature/chat/chat_repository.interface'
import { IMessageRepository } from '../../../domain/repositoryInterfaces/feature/chat/message_repository.interface'

import {
  IMarkChatReadUseCase,
  MarkChatReadInput,
} from '../../../domain/useCaseInterfaces/chat/mark_chat_read_usecase.interface'

import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS, ERROR_MESSAGES } from '../../../shared/constants'

@injectable()
export class MarkChatReadUseCase implements IMarkChatReadUseCase {
  constructor(
    @inject('IChatRepository')
    private readonly chatRepository: IChatRepository,

    @inject('IMessageRepository')
    private readonly messageRepository: IMessageRepository
  ) { }

  async execute(input: MarkChatReadInput): Promise<void> {
    const { chatId, readerId, readerRole } = input


    const chat = await this.chatRepository.findByChatId(chatId)

    if (!chat) {
      throw new CustomError(ERROR_MESSAGES.CHAT_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }


    const isCustomer = readerRole === 'customer' && chat.customer?.userId === readerId
    const isVendor = readerRole === 'vendor' && chat.vendor?.userId === readerId

    if (!isCustomer && !isVendor) {
      throw new CustomError(ERROR_MESSAGES.YOU_ARE_NOT_ALLOWED_TO_READ_THIS_CHAT, HTTP_STATUS.FORBIDDEN)
    }


    await this.chatRepository.resetUnread(chatId, readerRole)


    await this.messageRepository.markMessagesAsRead(chatId, readerId)
  }
}
