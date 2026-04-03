import { GetMySubscriptionRequestDTO, GetMySubscriptionResponseDTO } from "../../../application/dtos/subscription_dto";

export interface IGetMySubscriptionPlansUseCase{
  execute(
          input: GetMySubscriptionRequestDTO
      ): Promise<GetMySubscriptionResponseDTO> 
}