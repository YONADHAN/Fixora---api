export interface IVendorForgotPasswordStrategy {
  execute(email: string): Promise<void>
}
