export interface IChangeCustomerPasswordStrategy {
  execute(
    currentPassword: string,
    newPassword: string,
    userId: string
  ): Promise<{ OK: boolean }>
}
