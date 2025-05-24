import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await (await supabase).auth.getSession()

    let recommendations = []

    if (session?.user) {
      // For authenticated users, get recommendations from database
      recommendations = await getRecommendationsFromDatabase(session.user.id)
    } else {
      // For non-authenticated users, get recommendations from cookies
      recommendations = await getRecommendationsFromCookies()
    }

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error getting recommendations:", error)
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 })
  }
}

async function getRecommendationsFromDatabase(userId: string) {
  try {
    const supabase = createClient()

    // Get user's browsing history
    const { data: history, error: historyError } = await (await supabase)
      .from("user_browsing_history")
      .select("*")
      .eq("user_id", userId)
      .order("viewed_at", { ascending: false })
      .limit(10)

    if (historyError || !history || history.length === 0) {
      return []
    }

    // Extract preferences from browsing history
    const propertyTypes = [...new Set(history.map((item) => item.property_type).filter(Boolean))]
    const locations = [...new Set(history.map((item) => item.location).filter(Boolean))]
    const avgPrice = history.reduce((sum, item) => sum + (item.price || 0), 0) / history.length
    const avgBedrooms = Math.round(history.reduce((sum, item) => sum + (item.bedrooms || 0), 0) / history.length)

    // Find similar properties
    let query = (await supabase).from("properties").select("*")

    // Filter by property type if available
    if (propertyTypes.length > 0) {
      query = query.in("property_type", propertyTypes)
    }

    // Filter by location if available
    if (locations.length > 0) {
      query = query.in("location", locations)
    }

    // Filter by price range (±20%)
    if (avgPrice > 0) {
      query = query.gte("price", avgPrice * 0.8).lte("price", avgPrice * 1.2)
    }

    // Exclude properties the user has already viewed
    const viewedIds = history.map((item) => item.property_id)
    if (viewedIds.length > 0) {
      query = query.not("id", "in", `(${viewedIds.join(",")})`)
    }

    // Limit results
    query = query.limit(6)

    const { data: recommendations, error } = await query

    if (error) {
      console.error("Error fetching recommendations:", error)
      return []
    }

    return recommendations || []
  } catch (error) {
    console.error("Error in getRecommendationsFromDatabase:", error)
    return []
  }
}

async function getRecommendationsFromCookies() {
  try {
    const cookieStore = cookies()
    const existingHistory = cookieStore.get("property_history")

    if (!existingHistory) {
      return []
    }

    let history = []
    try {
      history = JSON.parse(existingHistory.value)
      if (!Array.isArray(history)) history = []
    } catch (e) {
      return []
    }

    if (history.length === 0) {
      return []
    }

    // Extract preferences from browsing history
    const propertyTypes = [...new Set(history.map((item: any) => item.property_type).filter(Boolean))]
    const locations = [...new Set(history.map((item: any) => item.location).filter(Boolean))]

    // Find similar properties
    const supabase = createClient()
    let query = (await supabase).from("properties").select("*")

    // Filter by property type if available
    if (propertyTypes.length > 0) {
      query = query.in("property_type", propertyTypes)
    }

    // Filter by location if available
    if (locations.length > 0) {
      query = query.in("location", locations)
    }

    // Exclude properties the user has already viewed
    const viewedIds = history.map((item: any) => item.property_id)
    if (viewedIds.length > 0) {
      query = query.not("id", "in", `(${viewedIds.join(",")})`)
    }

    // Limit results
    query = query.limit(6)

    const { data: recommendations, error } = await query

    if (error) {
      console.error("Error fetching recommendations:", error)
      return []
    }

    return recommendations || []
  } catch (error) {
    console.error("Error in getRecommendationsFromCookies:", error)
    return []
  }
}
