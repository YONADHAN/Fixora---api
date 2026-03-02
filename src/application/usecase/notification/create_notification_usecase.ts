import { inject, injectable } from 'tsyringe'
import {
  CreateNotificationInput,
  ICreateNotificationUseCase,
} from '../../../domain/useCaseInterfaces/notification/create_notification_usecase_interface'
import { INotificationEntity } from '../../../domain/models/notification_entity'
import { v4 as uuid } from 'uuid'
import { INotificationRepository } from '../../../domain/repositoryInterfaces/feature/notification/notification_repository.interface'
import { getIO } from '../../../presentation/socket/socket.server'
import { SOCKET_EVENTS } from '../../../shared/constants'
@injectable()
export class CreateNotificationUseCase implements ICreateNotificationUseCase {
  constructor(
    @inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository
  ) { }

  async execute(data: CreateNotificationInput): Promise<INotificationEntity> {
    const notification: INotificationEntity = {
      notificationId: uuid(),
      recipientId: data.recipientId,
      recipientRole: data.recipientRole,

      type: data.type,
      title: data.title,
      message: data.message,
      metadata: data.metadata,

      isRead: false,
      isActive: true,
      createdAt: new Date(),
    }

    const saved = await this.notificationRepository.save(notification)

    // const socketPayload = {
    //   notificationId: saved.notificationId,
    //   title: saved.title,
    //   message: saved.message,
    //   type: saved.type,
    //   metadata: saved.metadata,
    //   createdAt: saved.createdAt,
    // }

    try {
      const io = getIO()
      io.to(`user:${data.recipientId}`).emit(
        SOCKET_EVENTS.NOTIFICATION_NEW,
        saved
      )
    } catch (err) {
      console.error('Socket notification emit failed', err)
    }

    return saved
  }
}
