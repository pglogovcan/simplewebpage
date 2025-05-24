// Simple client-side store for comparison properties

// Define the property type
interface Property {
  id: string
  title?: string
  name?: string
  price: number
  currency?: string
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  square_meters?: number
  type?: string
  property_type?: string
  images: string[]
  description?: string
  features?: string[]
  year_built?: number
  heating?: string
  parking?: number
  floor?: number
  total_floors?: number
  energy_certificate?: string
  dateAdded?: string
}

// Store for properties that are being compared
let compareProperties: Property[] = []

// Add a property to the compare list
export function addToCompare(property: Property): boolean {
  // Check if property already exists
  if (!compareProperties.some((p) => p.id === property.id)) {
    // Limit to exactly 2 properties
    if (compareProperties.length >= 2) {
      // If we already have 2 properties, don't add more
      return false
    }
    compareProperties.push(property)
    return true
  }
  return false
}

// Remove a property from the compare list
export function removeFromCompare(id: string): void {
  compareProperties = compareProperties.filter((p) => p.id !== id)
}

// Get a specific property by ID
export function getCompareProperty(id: string): Property | undefined {
  return compareProperties.find((p) => p.id === id)
}

// Get all properties in the compare list
export function getAllCompareProperties(): Property[] {
  return [...compareProperties]
}

// Clear all properties from the compare list
export function clearCompareProperties(): void {
  compareProperties = []
}

// Check if a property is in the compare list
export function isPropertyInCompare(id: string): boolean {
  return compareProperties.some((p) => p.id === id)
}

// Get the count of properties in the compare list
export function getCompareCount(): number {
  return compareProperties.length
}
