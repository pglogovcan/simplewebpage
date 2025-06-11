export interface Property {
  id: string
  title: string
  description?: string
  price: number
  location: string
  image?: string
  images?: string[]
  bedrooms: number
  bathrooms?: number
  area: number
  type?: string
  featured?: boolean
  new?: boolean
  dateAdded?: string
  coordinates?: [number, number]
  createdAt?: string
  updatedAt?: string
  userId?: string
}

export interface SavedSearch {
  id: string
  name: string
  criteria: string
  matches: number
  newMatches: number
}

export interface MarketTrends {
  apartmentPrice: string
  apartmentChange: string
  apartmentSample: number
  housePrice: string
  houseChange: string
  houseSample: number
  demandByLocation: Array<{
    location: string
    percentage: number
  }>
}

export interface DashboardData {
  properties: Property[]
  savedSearches: SavedSearch[]
  marketTrends: MarketTrends
} 