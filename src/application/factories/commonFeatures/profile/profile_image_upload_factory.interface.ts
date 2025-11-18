export interface IProfileImageUploadFactory {
  execute(role: string, userId: string, imageUrl: string): Promise<any>
}
