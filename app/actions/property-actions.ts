"use server"

import { createClient } from "@/app/lib/supabase/server"
import { getPropertyById } from "@/lib/data"
import { Property } from "@/app/dashboard/saved-properties/page"
import { revalidatePath } from "next/cache"

interface UpdatePropertyData {
  title: string
  description: string | null
  property_type: string | null
  location: string | null
  address: string | null
  price: number | null
  bedrooms: number | null
  bathrooms: number | null
  area: number | null
  year_built: number | null
  heating: string | null
  parking: string | null
  featured: boolean
  new: boolean
  images: string[] | null
}

export async function getMyProperties() {
  const supabase = await createClient()
  
  // Get the current user's session
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    return []
  }

  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching properties:', error)
    return []
  }

  return properties
} 

export async function getMySavedProperties() {
  const supabase = await createClient()
  
  // Get the current user's session
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user) {
    return []
  }

  const { data: savedProperties, error } = await supabase
    .from('saved_properties')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching saved properties:', error)
    return []
  }

  const savedPropertiesWithData = await Promise.all(savedProperties.map(async (property) => {
    const propertyData = await getPropertyById(property.id)
    return {
      id: propertyData.id,
      title: propertyData.title,
      price: propertyData.price,
      location: propertyData.location,
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      area: propertyData.area,
      type: propertyData.property_type,
      images: propertyData.images,
      dateAdded: propertyData.dateAdded
    } as Property
  }))

  return savedPropertiesWithData
}

export async function updateProperty(propertyId: number, updateData: UpdatePropertyData) {
  try {
    const supabase = await createClient()

    // Get the current user's session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return { success: false, error: "Unauthorized" }
    }

    // First, verify the user owns this property
    const { data: existingProperty, error: fetchError } = await supabase
      .from("properties")
      .select("user_id")
      .eq("id", propertyId)
      .single()

    if (fetchError) {
      return { success: false, error: "Property not found" }
    }

    if (existingProperty.user_id !== session.user.id) {
      return { success: false, error: "Unauthorized to edit this property" }
    }

    // Update the property
    const { error } = await supabase.from("properties").update(updateData).eq("id", propertyId)

    if (error) {
      console.error("Error updating property:", error)
      return { success: false, error: "Failed to update property" }
    }

    // Revalidate the property page
    revalidatePath(`/nekretnine/${propertyId}`)
    revalidatePath(`/uredi-nekretninu/${propertyId}`)

    return { success: true }
  } catch (error) {
    console.error("Error in updateProperty:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function getPropertyForEdit(propertyId: string) {
  try {
    const supabase = await createClient()

    // Get the current user's session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return null
    }

    const { data: property, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", propertyId)
      .eq("user_id", session.user.id) // Only allow editing own properties
      .single()

    if (error) {
      console.error("Error fetching property:", error)
      return null
    }

    return property
  } catch (error) {
    console.error("Error in getPropertyForEdit:", error)
    return null
  }
}