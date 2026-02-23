
export interface InitiateChatDto {
  bookingId: string
  requesterId: string
  requesterRole: 'customer' | 'vendor'
}

export interface IInitiateChatUseCase {
  execute(data: InitiateChatDto): Promise<string> // Returns chatId
}
