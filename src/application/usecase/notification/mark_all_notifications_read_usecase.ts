import { inject, injectable } from 'tsyringe'
import { IMarkAllNotificationsReadUseCase } from '../../../domain/useCaseInterfaces/notification/mark_all_notifications_read_usecase.interface'
import { INotificationRepository } from '../../../domain/repositoryInterfaces/feature/notification/notification_repository.interface'

@injectable()
export class MarkAllNotificationsReadUseCase
  implements IMarkAllNotificationsReadUseCase
{
  constructor(
    @inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository
  ) {}

  async execute(userId: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId)
  }
}
