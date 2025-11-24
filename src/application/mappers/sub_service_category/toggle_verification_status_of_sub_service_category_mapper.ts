import { verificationTypes } from '../../../shared/constants'

export class ToggleVerificationStatusOfSubServiceCategoryRequestMapper {
  static toDTO({
    params,
  }: {
    params: {
      subServiceCategoryId: string
      verificationStatus: verificationTypes
    }
  }) {
    return {
      subServiceCategoryId: params.subServiceCategoryId,
      verificationStatus: params.verificationStatus,
    }
  }
}
