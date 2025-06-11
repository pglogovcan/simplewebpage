"use server"

import { createClient } from "@/app/lib/supabase/server"

// Define the type for search parameters
export type SearchParams = {
  location?: string
  propertyType?: string
  status?: "for_sale" | "for_rent" | string // Make it clear what values are expected
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  bedrooms?: number
  bathrooms?: number
  query?: string
}

// Define the type for search results
export type SearchResult = {
  properties: {
    id: string
    title: string
    price: number
    location: string
    bedrooms: number
    bathrooms: number
    area: number
    property_type: string
    images: string[]
    featured: boolean
    new: boolean
    dateAdded: string
  }[] | null
  error: string | null
  debug?: any
}

export async function searchProperties(params: SearchParams): Promise<SearchResult> {
  try {
    // Create Supabase client
    const supabase = await createClient()

    // Start building the query
    let query = supabase.from("properties").select("*").limit(1000) // Limit to 1000 results for performance

    // Apply filters based on search parameters - using the CORRECT column names
    if (params.location) {
      const locationLower = params.location.toLowerCase()
      // Use ilike for case-insensitive matching on multiple location fields
      query = query.or(
        `location.ilike.%${locationLower}%,city.ilike.%${locationLower}%,neighborhood.ilike.%${locationLower}%`,
      )
    }

    // Apply search query if provided
    if (params.query) {
      const queryLower = params.query.toLowerCase()
      // Search in title, location, and description
      query = query.or(
        `title.ilike.%${queryLower}%,location.ilike.%${queryLower}%,description.ilike.%${queryLower}%,city.ilike.%${queryLower}%,neighborhood.ilike.%${queryLower}%,property_type.ilike.%${queryLower}%`,
      )
    }

    if (params.propertyType) {
      // Use property_type instead of type
      query = query.eq("property_type", params.propertyType)
    }

    if (params.status) {
      // Make sure we're only using valid status values
      const validStatus = params.status === "for_sale" || params.status === "for_rent" ? params.status : undefined

      if (validStatus) {
        query = query.eq("status", validStatus)
      }
    }

    if (params.minPrice) {
      query = query.gte("price", params.minPrice)
    }

    if (params.maxPrice) {
      query = query.lte("price", params.maxPrice)
    }

    if (params.minArea) {
      query = query.gte("area", params.minArea)
    }

    if (params.maxArea) {
      query = query.lte("area", params.maxArea)
    }

    if (params.bedrooms) {
      query = query.eq("bedrooms", params.bedrooms)
    }

    if (params.bathrooms) {
      query = query.eq("bathrooms", params.bathrooms)
    }

    // Execute the query
    const { data, error } = await query

    if (error) {
      console.error("Supabase filtered query error:", error)
      return {
        properties: null,
        error: "Failed to fetch properties from database: " + error.message,
        debug: { error },
      }
    }

    console.log(`Filtered properties count: ${data?.length || 0}`)
    console.log("Applied filters:", params)

    // Transform the properties to match the expected format
    const transformedProperties = data.map((property) => ({
      id: property.id,
      title: property.title || "Unnamed Property",
      price: property.price || 0,
      location: property.location || property.city || "Unknown Location",
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      area: property.area || 0,
      // Use property_type instead of type
      property_type: property.property_type || "Unknown Type",
      // Handle image_url if it exists
      images: property.images || (property.image_url ? [property.image_url] : []),
      featured: property.featured || false,
      new: property.new || false,
      dateAdded: property.date_added || new Date().toISOString(),
    }))

    return {
      properties: transformedProperties,
      error: null,
      debug: {
        filteredCount: data.length,
        filters: params,
        transformedSample: transformedProperties[0],
      },
    }
  } catch (error) {
    console.error("Error in searchProperties:", error)
    return {
      properties: null,
      error: "Failed to search properties: " + (error instanceof Error ? error.message : String(error)),
      debug: { error },
    }
  }
}
