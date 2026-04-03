export interface ICodeGeneratorService {
  generateBookingCode(): Promise<string>
  generateWalletTransactionCode(): Promise<string>
  generateWalletCode(): Promise<string>
}