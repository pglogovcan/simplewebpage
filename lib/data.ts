import { createClient } from "@/app/lib/supabase/server"

// Function to get featured properties from the database
export async function getFeaturedProperties(limit = 8) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching featured properties:", error)
      return /* getMockFeaturedProperties() */ // Fallback to mock data if there's an error
    }

    if (!data || data.length === 0) {
      console.warn("No featured properties found, using mock data")
      return /* getMockFeaturedProperties() */ // Fallback to mock data if no properties found
    }

    // Transform the data to match the expected format with proper null checks
    return data
      .filter((property) => property && property.id) // Filter out any null/undefined properties
      .map((property) => ({
        id: String(property.id), // Ensure id is always a string
        title: property.title || "Nekretnina",
        price: Number(property.price) || 0,
        location: property.location || "Hrvatska",
        bedrooms: Number(property.bedrooms) || 0,
        bathrooms: Number(property.bathrooms) || 0,
        area: Number(property.area || property.square_meters) || 0,
        type: property.property_type || property.type || "Nekretnina",
        property_type: property.property_type || property.type || "Nekretnina",
        images: Array.isArray(property.images) ? property.images : [],
        featured: true,
        new: Boolean(property.is_new),
        dateAdded: property.created_at || new Date().toISOString(),
      }))
  } catch (error) {
    console.error("Unexpected error fetching featured properties:", error)
    return /* getMockFeaturedProperties() */ // Fallback to mock data if there's an exception
  }
}

// Mock data for featured properties as a fallback
/* function getMockFeaturedProperties() {
  return [
    {
      id: "1",
      title: "Moderan stan u centru grada",
      price: 185000,
      location: "Zagreb, Donji grad",
      bedrooms: 2,
      bathrooms: 1,
      area: 68,
      type: "Stan",
      property_type: "Stan",
      images: [
        "/placeholder.svg?height=400&width=600&text=Slika+1",
        "/placeholder.svg?height=400&width=600&text=Slika+2",
        "/placeholder.svg?height=400&width=600&text=Slika+3",
      ],
      featured: true,
      new: false,
      dateAdded: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Luksuzna vila s bazenom",
      price: 750000,
      location: "Split, Žnjan",
      bedrooms: 4,
      bathrooms: 3,
      area: 220,
      type: "Vila",
      property_type: "Vila",
      images: [
        "/placeholder.svg?height=400&width=600&text=Slika+1",
        "/placeholder.svg?height=400&width=600&text=Slika+2",
      ],
      featured: true,
      new: false,
      dateAdded: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Novogradnja - stan s terasom",
      price: 210000,
      location: "Rijeka, Centar",
      bedrooms: 3,
      bathrooms: 2,
      area: 85,
      type: "Stan",
      property_type: "Stan",
      images: ["/placeholder.svg?height=400&width=600&text=Slika+1"],
      new: true,
      featured: true,
      dateAdded: new Date().toISOString(),
    },
    {
      id: "4",
      title: "Kuća s vrtom blizu mora",
      price: 320000,
      location: "Zadar, Borik",
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      type: "Kuća",
      property_type: "Kuća",
      images: [
        "/placeholder.svg?height=400&width=600&text=Slika+1",
        "/placeholder.svg?height=400&width=600&text=Slika+2",
      ],
      featured: true,
      new: false,
      dateAdded: new Date().toISOString(),
    },
  ]
} */

export async function getPropertyById(id: string) {
  try {
    const supabase = await createClient()

    // Normalize the ID to ensure consistent comparison
    const normalizedId = String(id).trim()

    console.log(`Looking for property with ID: "${normalizedId}" (type: ${typeof normalizedId})`)

    // Query the property from Supabase
    const { data: property, error } = await supabase.from("properties").select("*").eq("id", normalizedId).single()

    if (error) {
      console.error(`Error fetching property with ID ${normalizedId}:`, error)
      throw new Error(`Failed to fetch property: ${error.message}`)
    }

    if (!property) {
      console.error(`Property with ID ${normalizedId} not found!`)
      throw new Error(`Property with ID ${normalizedId} not found`)
    }

    // Transform the property to match the expected format
    return {
      id: property.id,
      title: property.title,
      description: property.description,
      location: property.location,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      property_type: property.property_type,
      images:
        property.images ||
        (property.image_url
          ? [property.image_url]
          : [
              `/placeholder.svg?height=400&width=600&text=Property+${normalizedId}`,
              `/placeholder.svg?height=400&width=600&text=Property+${normalizedId}+Image+2`,
            ]),
      features: property.features || ["Balkon", "Parking", "Klima uređaj"],
      dateAdded: property.date_added,
      year_built: property.year_built,
      heating: property.heating,
      energy_certificate: property.energy_certificate,
      // Add mock agent data since we don't have an agent table yet
      agent: {
        id: "1",
        name: "Ana Horvat",
        phone: "+385 91 234 5678",
        email: "ana.horvat@example.com",
        image: "/placeholder.svg?height=200&width=200&text=Agent",
        agency: "Pačonž Nekretnine",
        listings: 24,
        experience: 5,
      },
    }
  } catch (error) {
    console.error(`Error in getPropertyById:`, error)

    // Return a fallback property
    return {
      id: id,
      title: `Property ${id}`,
      description: "Property details currently unavailable.",
      location: "Unknown location",
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      property_type: "Unknown",
      images: [`/placeholder.svg?height=400&width=600&text=Property+${id}`],
      features: [],
      dateAdded: new Date().toISOString(),
      year_built: null,
      heating: null,
      energy_certificate: null,
      agent: {
        id: "1",
        name: "Ana Horvat",
        phone: "+385 91 234 5678",
        email: "ana.horvat@example.com",
        image: "/placeholder.svg?height=200&width=200&text=Agent",
        agency: "Pačonž Nekretnine",
        listings: 24,
        experience: 5,
      },
    }
  }
}

export async function getProperties(userId?: string) {
  try {
    const supabase = await createClient()

    // Build the query
    let query = supabase.from("properties").select("*")
    
    // If userId is provided, filter by user_id
    if (userId) {
      query = query.eq('user_id', userId)
    }

    // Execute the query with limit
    const { data: properties, error } = await query.order('created_at', { ascending: false }).limit(50)

    if (error) {
      console.error("Error fetching properties:", error)
      throw new Error(`Failed to fetch properties: ${error.message}`)
    }

    if (!properties || properties.length === 0) {
      return []
    }

    // Transform the properties to match the expected format
    return properties.map((property) => ({
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location || property.city,
      image: property.image_url || `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(property.title)}`,
      images: property.images || [],
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      type: property.property_type,
      dateAdded: property.created_at,
      updatedAt: property.updated_at,
      userId: property.user_id
    }))
  } catch (error) {
    console.error("Error in getProperties:", error)
    return []
  }
}

export async function getRecommendedProperties(limit = 8) {
  try {
    // For now, we'll use localStorage-based recommendations for all users
    // In a production app, you would check if the user is authenticated and use their user ID

    // This function will be called from the server, so we'll return featured properties
    // The client-side component will handle fetching personalized recommendations
    return getFeaturedProperties(limit)
  } catch (error) {
    console.error("Error getting recommended properties:", error)
    return getFeaturedProperties(limit)
  }
}

export async function getSavedSearches() {
  // In a real app, you would fetch from your database
  return [
    {
      id: "1",
      name: "Stan u Zagrebu",
      criteria: "Zagreb, 2+ sobe, do 200.000€",
      matches: 24,
      newMatches: 2,
    },
    {
      id: "2",
      name: "Kuća na moru",
      criteria: "Split, Zadar, kuća, blizu mora",
      matches: 18,
      newMatches: 0,
    },
  ]
}

export async function getMarketTrends() {
  // In a real app, you would fetch market data
  return {
    apartmentPrice: "2.350 €/m²",
    apartmentChange: "+3.2%",
    apartmentSample: 1245,
    housePrice: "1.850 €/m²",
    houseChange: "+1.8%",
    houseSample: 875,
    demandByLocation: [
      { location: "Zagreb", percentage: 42 },
      { location: "Split", percentage: 28 },
      { location: "Rijeka", percentage: 15 },
    ],
  }
}

export async function getRecommendedPropertiesForUser(userId: string, limit = 8) {
  const supabase = await createClient()

  try {
    // First, get the user's browsing history
    const { data: historyData, error: historyError } = await supabase
      .from("user_browsing_history")
      .select("property_id, property_type, location, bedrooms, price, area")
      .eq("user_id", userId)
      .order("viewed_at", { ascending: false })
      .limit(10)

    if (historyError || !historyData || historyData.length === 0) {
      // Fallback to featured properties if no history
      return getFeaturedProperties(limit)
    }

    // Extract property types and locations from history
    const propertyTypes = new Set(historyData.map((item) => item.property_type).filter(Boolean))
    const locations = new Set(historyData.map((item) => item.location?.split(",")[0]?.trim()).filter(Boolean))

    // Build query based on user preferences
    let query = supabase.from("properties").select("*").limit(limit)

    // Apply property type filter if we have preferences
    if (propertyTypes.size > 0) {
      query = query.in("property_type", Array.from(propertyTypes))
    }

    // Apply location filter if we have preferences
    if (locations.size > 0) {
      // Use ilike for partial matching on location
      const locationFilters = Array.from(locations).map((location) => `location.ilike.%${location}%`)
      query = query.or(locationFilters.join(","))
    }

    // Execute query
    const { data, error } = await query

    if (error || !data || data.length === 0) {
      // Fallback to featured properties
      return getFeaturedProperties(limit)
    }

    return data.map((property) => ({
      ...property,
      id: property.id.toString(),
      images: property.image_url ? [property.image_url] : [],
    }))
  } catch (error) {
    console.error("Error getting recommended properties:", error)
    return getFeaturedProperties(limit)
  }
}
