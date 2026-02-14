export interface IGetWalletUseCase {
  execute(payload: {
    userId: string
    role: 'customer' | 'vendor'
    page?: number
    limit?: number
    sortBy?: 'amount' | 'createdAt' | 'type'
    order?: 'asc' | 'desc'
    search?: string
  }): Promise<{
    wallet: {
      walletId: string
      balance: number
      currency: string
    } | null
    data: any[]
    totalPages: number
    currentPage: number
    totalCount: number
  }>
}
