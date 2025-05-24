"use server"

import { createServerSupabaseClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function getRecommendedProperties(limit = 8) {
  const supabase = createServerSupabaseClient()

  try {
    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const userId = session?.user?.id

    // If user is authenticated, get recommendations based on their Supabase history
    if (userId) {
      // Get user's browsing history from Supabase
      const { data: historyData, error: historyError } = await supabase
        .from("user_browsing_history")
        .select("property_type, location, bedrooms, price, area")
        .eq("user_id", userId)
        .order("viewed_at", { ascending: false })
        .limit(10)

      if (historyError || !historyData || historyData.length === 0) {
        // Fallback to featured properties if no history or error
        return getFeaturedPropertiesFallback(supabase, limit)
      }

      // Extract preferences from browsing history
      const preferences = analyzePreferences(historyData)

      // Query properties based on preferences
      return await getPropertiesByPreferences(supabase, preferences, limit)
    } else {
      // For non-authenticated users, get browsing history from cookies
      const cookieStore = cookies()
      const historyCookie = cookieStore.get("property_browsing_history")

      if (!historyCookie?.value) {
        // Fallback to featured properties if no history cookie
        return getFeaturedPropertiesFallback(supabase, limit)
      }

      try {
        const localHistory = JSON.parse(decodeURIComponent(historyCookie.value))
        if (!Array.isArray(localHistory) || localHistory.length === 0) {
          return getFeaturedPropertiesFallback(supabase, limit)
        }

        // Extract preferences from local browsing history
        const preferences = analyzePreferences(localHistory)

        // Query properties based on preferences
        return await getPropertiesByPreferences(supabase, preferences, limit)
      } catch (e) {
        console.error("Error parsing browsing history cookie:", e)
        return getFeaturedPropertiesFallback(supabase, limit)
      }
    }
  } catch (error) {
    console.error("Error getting recommended properties:", error)
    return getFeaturedPropertiesFallback(supabase, limit)
  }
}

// Analyze browsing history to extract user preferences
function analyzePreferences(historyItems: any[]) {
  // Default empty preferences
  const preferences: {
    propertyTypes: Set<string>
    locations: Set<string>
    bedroomsRange: { min: number; max: number }
    priceRange: { min: number; max: number }
    areaRange: { min: number; max: number }
  } = {
    propertyTypes: new Set(),
    locations: new Set(),
    bedroomsRange: { min: 0, max: 10 },
    priceRange: { min: 0, max: 1000000 },
    areaRange: { min: 0, max: 1000 },
  }

  // If no history, return default preferences
  if (!historyItems || historyItems.length === 0) {
    return preferences
  }

  // Extract property types and locations
  historyItems.forEach((item) => {
    if (item.property_type) preferences.propertyTypes.add(item.property_type)
    if (item.location) {
      // Extract city from location (assuming format like "Zagreb, Donji grad")
      const city = item.location.split(",")[0]?.trim()
      if (city) preferences.locations.add(city)
    }
  })

  // Calculate price range (±20% of average)
  const prices = historyItems.map((item) => item.price).filter((price) => typeof price === "number" && !isNaN(price))

  if (prices.length > 0) {
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
    preferences.priceRange = {
      min: Math.max(0, avgPrice * 0.8),
      max: avgPrice * 1.2,
    }
  }

  // Calculate bedrooms range
  const bedrooms = historyItems.map((item) => item.bedrooms).filter((beds) => typeof beds === "number" && !isNaN(beds))

  if (bedrooms.length > 0) {
    const minBeds = Math.min(...bedrooms)
    const maxBeds = Math.max(...bedrooms)
    preferences.bedroomsRange = {
      min: Math.max(0, minBeds - 1),
      max: maxBeds + 1,
    }
  }

  // Calculate area range (±20% of average)
  const areas = historyItems.map((item) => item.area).filter((area) => typeof area === "number" && !isNaN(area))

  if (areas.length > 0) {
    const avgArea = areas.reduce((sum, area) => sum + area, 0) / areas.length
    preferences.areaRange = {
      min: Math.max(0, avgArea * 0.8),
      max: avgArea * 1.2,
    }
  }

  return preferences
}

// Query properties based on user preferences
async function getPropertiesByPreferences(supabase: any, preferences: any, limit: number) {
  let query = supabase.from("properties").select("*").limit(limit)

  // Apply property type filter if we have preferences
  if (preferences.propertyTypes.size > 0) {
    query = query.in("property_type", Array.from(preferences.propertyTypes))
  }

  // Apply location filter if we have preferences
  if (preferences.locations.size > 0) {
    // Use ilike for partial matching on location
    const locationFilters = Array.from(preferences.locations).map((location) => `location.ilike.%${location}%`)
    query = query.or(locationFilters.join(","))
  }

  // Apply price range filter
  query = query.gte("price", preferences.priceRange.min).lte("price", preferences.priceRange.max)

  // Apply bedrooms filter if min > 0
  if (preferences.bedroomsRange.min > 0) {
    query = query.gte("bedrooms", preferences.bedroomsRange.min).lte("bedrooms", preferences.bedroomsRange.max)
  }

  // Apply area filter
  query = query.gte("area", preferences.areaRange.min).lte("area", preferences.areaRange.max)

  const { data, error } = await query

  if (error || !data || data.length < limit / 2) {
    // If we don't have enough results, fall back to featured properties
    return getFeaturedPropertiesFallback(supabase, limit)
  }

  return data
}

// Fallback to featured properties if we can't get recommendations
async function getFeaturedPropertiesFallback(supabase: any, limit: number) {
  const { data, error } = await supabase.from("properties").select("*").eq("featured", true).limit(limit)

  if (error || !data || data.length === 0) {
    // Final fallback - just get any properties
    const { data: anyProperties } = await supabase.from("properties").select("*").limit(limit)

    return anyProperties || []
  }

  return data
}
