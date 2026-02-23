import { verificationTypes } from '../../../shared/constants'

export class ToggleVerificationStatusOfSubServiceCategoryRequestMapper {
  static toDTO({
    payload,
  }: {
    payload: {
      subServiceCategoryId: string
      verificationStatus: verificationTypes
    }
  }) {
    return {
      subServiceCategoryId: payload.subServiceCategoryId,
      verificationStatus: payload.verificationStatus,
    }
  }
}
