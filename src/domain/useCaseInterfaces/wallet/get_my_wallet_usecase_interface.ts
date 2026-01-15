export interface IGetWalletUseCase {
  execute(payload: {
    userId: string
    role: 'customer' | 'vendor'
    sortBy?: 'amount' | 'createdAt' | 'type'
    order?: 'asc' | 'desc'
  }): Promise<any>
}
