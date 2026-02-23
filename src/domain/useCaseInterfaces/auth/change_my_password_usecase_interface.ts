export interface IChangeMyPasswordUseCase {
  execute(
    currentPassword: string,
    newPassword: string,
    userId: string,
    role: string
  ): Promise<{ OK: boolean }>
}
