import { IChatEntity } from '../../models/chat_entity'

export interface IGetUserChatsUseCase {
    execute(userId: string): Promise<IChatEntity[]>
}
