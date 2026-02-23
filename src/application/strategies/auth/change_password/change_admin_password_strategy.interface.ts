export interface IChangeAdminPasswordStrategy {
  execute(
    currentPassword: string,
    newPassword: string,
    userId: string
  ): Promise<{ OK: boolean }>
}
