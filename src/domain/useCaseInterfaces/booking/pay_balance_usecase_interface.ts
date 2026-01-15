
export interface IPayBalanceUseCase {
    execute(bookingId: string): Promise<string>
}
