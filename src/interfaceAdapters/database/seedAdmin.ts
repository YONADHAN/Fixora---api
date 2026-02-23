import { SeedAdminUseCase } from "../../application/usecase/admin/seedAdminUsecase"
import { AdminRepository } from "../repositories/users/admin_repository"

export const seedAdmin = async () => {
  if (process.env.ENABLE_SEED_ADMIN !== 'true') {
    return
  }

  const adminRepository = new AdminRepository()
  const seedAdminUseCase = new SeedAdminUseCase(adminRepository)

  await seedAdminUseCase.execute()
}
