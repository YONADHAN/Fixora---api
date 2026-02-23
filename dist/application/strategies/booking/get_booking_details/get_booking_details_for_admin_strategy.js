"use strict";
// import { inject, injectable } from 'tsyringe'
// import { CustomError } from '../../../../domain/utils/custom.error'
// import { ERROR_MESSAGES, HTTP_STATUS } from '../../../../shared/constants'
// import { IGetBookingDetailsForAdminStrategy } from './get_booking_details_for_admin_strategy.interface'
// import { IBookingRepository } from '../../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
// import { IAdminRepository } from '../../../../domain/repositoryInterfaces/users/admin_repository.interface'
// injectable()
// export class GetBookingDetailsForAdminStrategy
//   implements IGetBookingDetailsForAdminStrategy
// {
//   constructor(
//     @inject('IBookingRepository')
//     private readonly _bookingRepository: IBookingRepository,
//     @inject('IAdminRepository')
//     private readonly _adminRepository: IAdminRepository
//   ) {}
//   async execute(
//     payload: GetBookingDetailsRequestDTO
//   ): Promise<GetBookingDetailsForAdminStrategyResponseDTO> {
//     const { bookingId, userId } = payload
//     const admin = await this._adminRepository.findOne({ userId })
//     if (!admin) {
//       throw new CustomError(
//         ERROR_MESSAGES.USERS_NOT_FOUND,
//         HTTP_STATUS.NOT_FOUND
//       )
//     }
//     const booking = await this._bookingRepository.findOne({ bookingId })
//     if (!booking) {
//       throw new CustomError(
//         ERROR_MESSAGES.NO_BOOKING_FOUND,
//         HTTP_STATUS.NOT_FOUND
//       )
//     }
//     return GetBookingDetailsForAdminRequestMapper.toDTO(admin, booking)
//   }
// }
