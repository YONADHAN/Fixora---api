export interface VendorDocumentDTO {
  name: string
  url: string
}

export interface VendorVerificationStatusDTO {
  status: string
  description?: string
}

export interface VendorRequestDTO {
  userId: string
  name: string
  email: string
  documents: VendorDocumentDTO[]
  isVerified: VendorVerificationStatusDTO
}
