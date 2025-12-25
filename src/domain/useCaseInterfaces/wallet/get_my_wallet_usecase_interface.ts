export interface IGetWalletUseCase {
  execute(payload: {
    userId: string
    role: 'customer' | 'vendor'
  }): Promise<any>
}
