import PropertyDetailsClient from "./property-details-client"
import { createClient } from "@/utils/supabase/server"

// Import mock data for fallback and neighborhood data
import { mockProperties } from "@/lib/mock-data"
import { getNeighborhoodData } from "@/lib/mock-neighborhood-data"

export const dynamic = "force-dynamic"

async function getPropertyById(id: string) {
  console.log(`Fetching property with ID: ${id}`)

  try {
    const supabase = createClient()

    // First, fetch the property with the given ID
    const { data: property, error } = await (await supabase).from("properties").select("*").eq("id", id).single()

    if (error) {
      console.error("Supabase error fetching property:", error)
      // Try to find the property in mock data as fallback
      const mockProperty = mockProperties.find((p) => String(p.id) === String(id))
      if (mockProperty) {
        console.log("Found property in mock data:", mockProperty.title)
        return {
          ...mockProperty,
          agent: {
            id: "mock-agent",
            name: "Agent Name",
            email: "agent@example.com",
            phone: "+385 99 123 4567",
            photo: "/placeholder.svg?height=200&width=200&text=Agent",
          },
        }
      }
      return null
    }

    console.log("Property found in database:", property?.title || "No title")

    // If property has a listing_agent_id, fetch the agent data
    if (property.listing_agent_id) {
      const { data: agent, error: agentError } = await (await supabase)
        .from("agents")
        .select("*")
        .eq("id", property.listing_agent_id)
        .single()

      if (!agentError && agent) {
        // Add agent data to property
        return {
          ...property,
          agent: agent,
        }
      }
    }

    // If no agent found or there was an error, add mock agent data as fallback
    return {
      ...property,
      agent: {
        id: "mock-agent",
        name: "Agent Name",
        email: "agent@example.com",
        phone: "+385 99 123 4567",
        photo: "/placeholder.svg?height=200&width=200&text=Agent",
      },
    }
  } catch (err) {
    console.error("Error in getPropertyById:", err)
    return null
  }
}

async function getSimilarProperties(id: string, propertyType: string) {
  try {
    const supabase = createClient()

    // Query similar properties from Supabase
    const { data: similarProperties, error } = await (await supabase)
      .from("properties")
      .select("*")
      .eq("property_type", propertyType)
      .neq("id", id)
      .limit(4)

    if (error) {
      console.error("Error fetching similar properties:", error)
      throw new Error(`Error fetching similar properties: ${error.message}`)
    }

    // Transform the properties to match the expected format
    return similarProperties.map((property) => ({
      id: property.id,
      title: property.title,
      price: property.price,
      location: property.location || property.city,
      images: property.images || [],
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      property_type: property.property_type,
    }))
  } catch (error) {
    console.error(`Error in getSimilarProperties:`, error)
    return []
  }
}

export default async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  console.log(`Rendering property page for ID: ${params.id}`)

  // Get property data
  const property = await getPropertyById(params.id)

  // If no property found, use fallback mock data instead of showing 404
  if (!property) {
    console.log("Property not found, using fallback data")
    // Create a fallback property
    const fallbackProperty = {
      id: params.id,
      title: `Property ${params.id}`,
      description: "This is a fallback property description.",
      location: "Zagreb, Croatia",
      address: "Example Street 123, Zagreb",
      price: 200000,
      bedrooms: 2,
      bathrooms: 1,
      area: 75,
      property_type: "Stan", // Updated to use property_type instead of type
      images: [
        `/placeholder.svg?height=600&width=800&text=Property+${params.id}`,
        `/placeholder.svg?height=600&width=800&text=Property+${params.id}+Image+2`,
      ],
      features: ["Balkon", "Parking", "Klima uređaj"],
      created_at: new Date().toISOString(),
      year_built: 2015,
      heating: "Centralno",
      floor: 2,
      total_floors: 4,
      energy_certificate: "B",
      agent: {
        id: "fallback-agent",
        name: "Agent Name",
        email: "agent@example.com",
        phone: "+385 99 123 4567",
        photo: "/placeholder.svg?height=200&width=200&text=Agent",
      },
    }

    // Get neighborhood data based on property location
    const neighborhoodData = getNeighborhoodData(fallbackProperty.location)

    // Get similar properties
    const similarProperties = await getSimilarProperties(params.id, fallbackProperty.property_type)

    return (
      <PropertyDetailsClient
        property={fallbackProperty}
        similarProperties={similarProperties}
        neighborhoodData={neighborhoodData}
      />
    )
  }

  // Get neighborhood data based on property location
  const neighborhoodData = getNeighborhoodData(property.location)

  // Get similar properties - use property_type instead of type
  const similarProperties = await getSimilarProperties(params.id, property.property_type)

  return (
    <PropertyDetailsClient
      property={property}
      similarProperties={similarProperties}
      neighborhoodData={neighborhoodData}
    />
  )
}
