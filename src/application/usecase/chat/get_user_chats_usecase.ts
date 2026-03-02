import { inject, injectable } from 'tsyringe'
import { IGetUserChatsUseCase } from '../../../domain/useCaseInterfaces/chat/get_user_chats_usecase.interface'
import { IChatRepository } from '../../../domain/repositoryInterfaces/feature/chat/chat_repository.interface'
import { IChatEntity } from '../../../domain/models/chat_entity'
import { ICustomerRepository } from '../../../domain/repositoryInterfaces/users/customer_repository.interface'
import { IVendorRepository } from '../../../domain/repositoryInterfaces/users/vendor_repository.interface'


@injectable()
export class GetUserChatsUseCase implements IGetUserChatsUseCase {
    constructor(
        @inject('IChatRepository') private chatRepository: IChatRepository,
        @inject('ICustomerRepository') private customerRepository: ICustomerRepository,
        @inject('IVendorRepository') private vendorRepository: IVendorRepository
    ) { }

    async execute(userId: string, role: string): Promise<IChatEntity[]> {
        let userObjectId = userId

        if (role === 'customer') {
            const customer = await this.customerRepository.findOne({ userId })
            if (customer && customer._id) {
                userObjectId = customer._id.toString()
            }
        } else if (role === 'vendor') {
            const vendor = await this.vendorRepository.findOne({ userId })
            if (vendor && vendor._id) {
                userObjectId = vendor._id.toString()
            }
        }

        return await this.chatRepository.getUserChats(userObjectId)
    }
}
