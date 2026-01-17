import { IChatEntity } from '../../models/chat_entity'

export interface IGetUserChatsUseCase {
    execute(userId: string, role: string): Promise<IChatEntity[]>
}
