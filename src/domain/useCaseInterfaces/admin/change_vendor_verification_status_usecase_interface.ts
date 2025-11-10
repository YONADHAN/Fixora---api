export interface IChangeVendorVerificationStatusUseCase {
  execute({
    userId,
    verificationStatus,
    adminId,
    description,
  }: {
    userId: string
    verificationStatus: 'accepted' | 'rejected'
    adminId: string
    description?: string
  }): Promise<{
    userId: string
    name: string
    status: 'accepted' | 'rejected'
    reviewedBy: { adminId: string; reviewedAt: Date }
    description: string
  }>
}
