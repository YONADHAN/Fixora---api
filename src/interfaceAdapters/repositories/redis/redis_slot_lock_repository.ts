import { injectable } from 'tsyringe'
import { IRedisSlotLockRepository } from '../../../domain/repositoryInterfaces/redis/redis_slot_lock_repository_interface'
import { redisClient } from './redis.client'

@injectable()
export class RedisSlotLockRepository implements IRedisSlotLockRepository {
  private buildSlotKey(serviceId: string, date: string, start: string): string {
    return `slot:${serviceId}:${date}:${start}`
  }

  async lockSlot(
    serviceId: string,
    date: string,
    start: string,
    ttlSeconds = 300
  ): Promise<boolean> {
    const key = this.buildSlotKey(serviceId, date, start)

    const result = await redisClient.set(key, 'locked', {
      NX: true,
      EX: ttlSeconds,
    })

    return result === 'OK'
  }

  async releaseSlot(
    serviceId: string,
    date: string,
    start: string
  ): Promise<void> {
    const key = this.buildSlotKey(serviceId, date, start)
    await redisClient.del(key)
  }

  async releaseMultipleSlots(
    serviceId: string,
    slots: { date: string; start: string }[]
  ): Promise<void> {
    if (!slots.length) return

    const keys = slots.map((s) => this.buildSlotKey(serviceId, s.date, s.start))

    await redisClient.del(keys)
  }
}
