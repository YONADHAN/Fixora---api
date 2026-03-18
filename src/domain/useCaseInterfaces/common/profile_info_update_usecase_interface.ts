// type data = {
//   name: string
//   phone: string
//   location:{
//     displayName: string
//     zipCode: string
//   }
// }

import { ProfileUpdateDTO } from "../../../application/dtos/profile_update_dto";


export interface IProfileInfoUpdateUseCase {
  execute(role: string, data: ProfileUpdateDTO, userId: string): Promise<void>
}
