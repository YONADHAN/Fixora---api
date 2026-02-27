export interface IRedisSlotLockRepository {
  lockSlot(
    serviceId: string,
    date: string,
    start: string,
    customerId: string,
    ttlSeconds?: number
  ): Promise<boolean>

  releaseSlot(serviceId: string, date: string, start: string , customerId: string): Promise<void>

  releaseMultipleSlots(
    serviceId: string,
    slots: { date: string; start: string }[],
    customerId: string
  ): Promise<void>


  isLockedByOtherUser(
    serviceId: string,
    date: string,
    start: string,
    customerId: string
  ): Promise<boolean> 

  
}
