export interface IChangeVendorPasswordStrategy {
  execute(
    currentPassword: string,
    newPassword: string,
    userId: string
  ): Promise<{ OK: boolean }>
}
