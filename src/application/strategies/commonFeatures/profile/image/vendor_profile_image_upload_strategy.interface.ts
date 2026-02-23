export interface IVendorProfileImageUploadStrategy {
  execute(params: { userId: string; imageUrl: string }): Promise<void>
}
