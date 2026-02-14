import { inject, injectable } from 'tsyringe'

import {
  IGetMyNotificationsUseCase,
  GetMyNotificationsResponse,
  GetMyNotificationsInput,
} from '../../../domain/useCaseInterfaces/notification/get_my_notifications_usecase_interface'

import { INotificationRepository } from '../../../domain/repositoryInterfaces/feature/notification/notification_repository.interface'

@injectable()
export class GetMyNotificationsUseCase implements IGetMyNotificationsUseCase {
  constructor(
    @inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository
  ) { }

  async execute(
    data: GetMyNotificationsInput
  ): Promise<GetMyNotificationsResponse> {
    return this.notificationRepository.findByRecipient(
      data.userId,
      data.limit,
      data.cursor,
      data.filter,
      data.search
    )
  }
}
