export interface ICodeGeneratorService {
  // generateBookingCode(): Promise<string>
  generateBookingGroupCode(): Promise<string>
  generateWalletTransactionCode(): Promise<string>
  generateWalletCode(): Promise<string>
}