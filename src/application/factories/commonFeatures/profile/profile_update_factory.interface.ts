import { ProfileUpdateDTO } from "../../../dtos/profile_update_dto";

export interface IProfileUpdateFactory {
  getStrategy(role: string, data: ProfileUpdateDTO, userId: string): Promise<void>
}
