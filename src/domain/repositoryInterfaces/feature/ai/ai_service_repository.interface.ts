export interface IAiServiceRepository {
  getTopServices(): Promise<
    {
      name: string
      category: string
      priceRange?: string
    }[]
  >

  searchServices(query: string): Promise<
    {
      name: string
      description?: string
    }[]
  >
}
