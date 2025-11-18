export interface ICustomerProfileImageUploadStrategy {
  execute(params: { userId: string; imageUrl: string }): Promise<void>
}
