export interface ICustomerForgotPasswordStrategy {
  execute(email: string): Promise<void>
}
