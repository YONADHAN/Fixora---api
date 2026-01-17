import { inject, injectable } from 'tsyringe'
import { v4 as uuidv4 } from 'uuid'
import {
    IInitiateChatUseCase,
    InitiateChatDto,
} from '../../../domain/useCaseInterfaces/chat/initiate_chat_usecase.interface'
import { IChatRepository } from '../../../domain/repositoryInterfaces/feature/chat/chat_repository.interface'
import { IBookingRepository } from '../../../domain/repositoryInterfaces/feature/booking/booking_repository.interface'
import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'
import { IServiceRepository } from '../../../domain/repositoryInterfaces/feature/service/service_repository.interface'
import { CustomError as AppError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS as HttpStatus } from '../../../shared/constants'

@injectable()
export class InitiateChatUseCase implements IInitiateChatUseCase {
    constructor(
        @inject('IChatRepository') private chatRepository: IChatRepository,
        @inject('IBookingRepository') private bookingRepository: IBookingRepository,
        @inject('ICustomerRepository') private customerRepository: ICustomerRepository,
        @inject('IVendorRepository') private vendorRepository: IVendorRepository,
        @inject('IServiceRepository') private serviceRepository: IServiceRepository
    ) { }

    async execute(data: InitiateChatDto): Promise<string> {
        const { bookingId, requesterId, requesterRole } = data


        const booking = await this.bookingRepository.getBookingById(bookingId)
        if (!booking) {
            throw new AppError('Booking not found', HttpStatus.NOT_FOUND)
        }


        const customer = await this.customerRepository.findOne({ _id: booking.customerRef })
        const vendor = await this.vendorRepository.findOne({ _id: booking.vendorRef })
        const service = await this.serviceRepository.findOne({ _id: booking.serviceRef })

        if (!customer || !vendor || !service) {
            throw new AppError('Related entities (Customer, Vendor, or Service) not found', HttpStatus.NOT_FOUND)
        }

        const customerObjectId = customer._id
        const vendorObjectId = vendor._id
        const serviceObjectId = service._id

        if (!customerObjectId || !vendorObjectId || !serviceObjectId) {
            throw new AppError('Invalid entity data: Missing UUIDs', HttpStatus.INTERNAL_SERVER_ERROR)
        }


        const isCustomer = customer.userId === requesterId
        const isVendor = vendor.userId === requesterId

        if (!isCustomer && !isVendor) {
            throw new AppError(
                'Unauthorized: You are not a party to this booking',
                HttpStatus.FORBIDDEN
            )
        }


        const existingChat = await this.chatRepository.findChatByParticipants(
            customerObjectId.toString(),
            vendorObjectId.toString(),
            serviceObjectId.toString()
        )

        if (existingChat) {
            return existingChat.chatId
        }


        const newChat = await this.chatRepository.createChat({
            chatId: uuidv4(),
            customerRef: customerObjectId.toString(),
            vendorRef: vendorObjectId.toString(),
            serviceRef: serviceObjectId.toString(),
            unreadCount: { customer: 0, vendor: 0 },
            isActive: true,
            lastMessage: undefined,
        })

        return newChat.chatId
    }
}
