import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { IAdminRepository } from '../../../domain/repositoryInterfaces/users/admin_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { HTTP_STATUS, ERROR_MESSAGES } from '../../../shared/constants'

export class SeedAdminUseCase {
  constructor(private adminRepository: IAdminRepository) {}

  async execute() {
    const email = process.env.SEED_ADMIN_EMAIL || ''
    if(!email.trim()){
      throw new CustomError(ERROR_MESSAGES.SEED_ADMIN_EMAIL_IS_NOT_PROVIDED,HTTP_STATUS.BAD_REQUEST)
    }
    const existingAdmin = await this.adminRepository.findOne({email})

    if (existingAdmin) {
      console.log(' Admin already exists')
      return
    }
    const password = process.env.SEED_ADMIN_PASSWORD || ""
    if(!password.trim()){
      throw new CustomError(ERROR_MESSAGES.SEED_ADMIN_PASSWORD_IS_NOT_GIVEN, HTTP_STATUS.BAD_REQUEST)
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const name = process.env.SEED_ADMIN_NAME || ""
    if(!name.trim()){
      throw new CustomError(ERROR_MESSAGES.SEED_ADMIN_NAME_IS_NOT_GIVEN, HTTP_STATUS.BAD_REQUEST)
    }
    const phone = process.env.SEED_ADMIN_PHONE_NUMBER || ""
    if(!phone.trim()){
      throw new CustomError(ERROR_MESSAGES.SEED_ADMIN_PHONE_NUMBER_IS_NOT_GIVEN, HTTP_STATUS.BAD_REQUEST)
    }
    await this.adminRepository.save({
      userId: uuidv4(), 
      name,
      email:email.trim().toLowerCase(),
      phone,
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    })

    console.log(' Default Admin Created')
  }
}
