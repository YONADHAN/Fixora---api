import { statusTypes } from '../../../shared/constants'

export class toggleBlockStatusOfSubServiceCategoryRequestMapper {
  static toDTO({
    params,
  }: {
    params: {
      subServiceCategoryId: string
      blockStatus: statusTypes
    }
  }) {
    return {
      subServiceCategoryId: params.subServiceCategoryId,
      blockStatus: params.blockStatus,
    }
  }
}
