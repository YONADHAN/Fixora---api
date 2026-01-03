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

        // 1. Validate Booking
        const booking = await this.bookingRepository.getBookingById(bookingId)
        if (!booking) {
            throw new AppError('Booking not found', HttpStatus.NOT_FOUND)
        }

        // 2. Fetch Entities to get UUIDs
        const customer = await this.customerRepository.findOne({ _id: booking.customerRef })
        const vendor = await this.vendorRepository.findOne({ _id: booking.vendorRef })
        const service = await this.serviceRepository.findOne({ _id: booking.serviceRef })

        if (!customer || !vendor || !service) {
            throw new AppError('Related entities (Customer, Vendor, or Service) not found', HttpStatus.NOT_FOUND)
        }

        const customerUuid = customer.userId
        const vendorUuid = vendor.userId
        const serviceUuid = service.serviceId

        if (!customerUuid || !vendorUuid || !serviceUuid) {
            throw new AppError('Invalid entity data: Missing UUIDs', HttpStatus.INTERNAL_SERVER_ERROR)
        }

        // 3. Validate Ownership (Security Gate) using UUIDs
        const isCustomer = customerUuid === requesterId
        const isVendor = vendorUuid === requesterId

        if (!isCustomer && !isVendor) {
            throw new AppError(
                'Unauthorized: You are not a party to this booking',
                HttpStatus.FORBIDDEN
            )
        }

        // 4. Check for Existing Chat (Idempotency)
        const existingChat = await this.chatRepository.findChatByParticipants(
            customerUuid,
            vendorUuid,
            serviceUuid
        )

        if (existingChat) {
            return existingChat.chatId
        }

        // 5. Create New Chat
        const newChat = await this.chatRepository.createChat({
            chatId: uuidv4(),
            customerId: customerUuid,
            vendorId: vendorUuid,
            serviceId: serviceUuid,
            unreadCount: { customer: 0, vendor: 0 },
            isActive: true,
            lastMessage: undefined,
        })

        return newChat.chatId
    }
}
