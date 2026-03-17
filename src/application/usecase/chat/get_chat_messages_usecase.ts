import { inject, injectable } from 'tsyringe'

import { IChatRepository } from '../../../domain/repositoryInterfaces/feature/chat/chat_repository.interface'
import { IMessageRepository } from '../../../domain/repositoryInterfaces/feature/chat/message_repository.interface'

import {
  IGetChatMessagesUseCase,
  GetChatMessagesInput,
  GetChatMessagesOutput,
} from '../../../domain/repositoryInterfaces/feature/chat/get_chat_messages_usecase.interface'

import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS } from '../../../shared/constants'
@injectable()
export class GetChatMessagesUseCase implements IGetChatMessagesUseCase {
  constructor(
    @inject('IChatRepository')
    private readonly _chatRepository: IChatRepository,

    @inject('IMessageRepository')
    private readonly _messageRepository: IMessageRepository,
  ) {}

  async execute(input: GetChatMessagesInput): Promise<GetChatMessagesOutput> {
    const { chatId, requesterId, requesterRole, before, limit = 20 } = input

    const chat = await this._chatRepository.findByChatId(chatId)

    if (!chat) {
      throw new CustomError('Chat not found', HTTP_STATUS.NOT_FOUND)
    }

    const isCustomer =
      requesterRole === 'customer' && chat.customer?.userId === requesterId

    const isVendor =
      requesterRole === 'vendor' && chat.vendor?.userId === requesterId

    if (!isCustomer && !isVendor) {
      throw new CustomError('You are not allowed to view this chat', HTTP_STATUS.FORBIDDEN)
    }

    const result = await this._messageRepository.findMessagesByChatId(
      chatId,
      before ? new Date(before) : undefined,
      limit,
    )

    return {
      messages: result.messages,
      hasMore: result.hasMore,
      nextCursor: result.nextCursor,
    }
  }
}
