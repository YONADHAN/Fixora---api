import { inject, injectable } from 'tsyringe'
import { IGetUserChatsUseCase } from '../../../domain/useCaseInterfaces/chat/get_user_chats_usecase.interface'
import { IChatRepository } from '../../../domain/repositoryInterfaces/feature/chat/chat_repository.interface'
import { IChatEntity } from '../../../domain/models/chat_entity'

@injectable()
export class GetUserChatsUseCase implements IGetUserChatsUseCase {
    constructor(
        @inject('IChatRepository') private chatRepository: IChatRepository
    ) { }

    async execute(userId: string): Promise<IChatEntity[]> {
        return await this.chatRepository.getUserChats(userId)
    }
}
