import { inject, injectable } from 'tsyringe'
import { IMarkNotificationReadUseCase } from '../../../domain/useCaseInterfaces/notification/mark_notification_read_usecase.interface'
import { INotificationRepository } from '../../../domain/repositoryInterfaces/feature/notification/notification_repository.interface'
import { CustomError } from '../../../domain/utils/custom.error'
import { ERROR_MESSAGES } from '../../../shared/constants'

@injectable()
export class MarkNotificationReadUseCase
  implements IMarkNotificationReadUseCase
{
  constructor(
    @inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository
  ) {}

  async execute(notificationId: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      notificationId,
      recipientId: userId,
      isActive: true,
    })

    if (!notification) {
      throw new CustomError(ERROR_MESSAGES.NOTIFICATION_NOT_FOUND, 404)
    }

    await this.notificationRepository.markAsRead(notificationId)
  }
}
