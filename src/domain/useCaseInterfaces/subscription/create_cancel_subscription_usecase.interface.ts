import { CreateCancelSubscriptionRequestDTO, CreateCancelSubscriptionResponseDTO } from "../../../application/dtos/subscription_dto";

export interface ICreateCancelSubscriptionUseCase{
    execute(input: CreateCancelSubscriptionRequestDTO): Promise<CreateCancelSubscriptionResponseDTO>
}