import { ProfileUpdateDTO } from "../../../dtos/profile_update_dto";

export interface IVendorProfileUpdateStrategy {
  execute({ data, userId }: { data: ProfileUpdateDTO; userId: string }): Promise<void>
}
