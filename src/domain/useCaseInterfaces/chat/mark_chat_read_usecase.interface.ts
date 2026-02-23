export interface MarkChatReadInput {
  chatId: string
  readerId: string
  readerRole: 'customer' | 'vendor'
}

export interface IMarkChatReadUseCase {
  execute(input: MarkChatReadInput): Promise<void>
}
