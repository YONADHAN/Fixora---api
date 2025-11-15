export interface IAdminForgotPasswordStrategy {
  execute(email: string): Promise<void>
}
