export interface IServiceHistoryEntity {
  _id?: string
  serviceRef: string
  historyId?: string
  title?: string
  description?: string
  images?: string[]
  completedOn?: Date
  createdAt?: Date
  updatedAt?: Date
}
