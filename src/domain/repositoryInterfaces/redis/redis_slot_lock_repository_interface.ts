export interface IRedisSlotLockRepository {
  lockSlot(
    serviceId: string,
    date: string,
    start: string,
    ttlSeconds?: number
  ): Promise<boolean>

  releaseSlot(serviceId: string, date: string, start: string): Promise<void>

  releaseMultipleSlots(
    serviceId: string,
    slots: { date: string; start: string }[]
  ): Promise<void>
}
