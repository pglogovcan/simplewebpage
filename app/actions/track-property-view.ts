"use server"

import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

// Function to track property views for both authenticated and non-authenticated users
export async function trackPropertyView(propertyId: string, property: any) {
  try {
    // Get the current user session
    const supabase = createClient()
    const {
      data: { session },
    } = await (await supabase).auth.getSession()

    if (session?.user) {
      // For authenticated users, store in database
      await storePropertyViewInDatabase(session.user.id, propertyId, property)
    } else {
      // For non-authenticated users, store in cookies
      storePropertyViewInCookies(propertyId, property)
    }

    return { success: true }
  } catch (error) {
    console.error("Error tracking property view:", error)
    return { success: false, error: "Failed to track property view" }
  }
}

// Store property view in database for authenticated users
async function storePropertyViewInDatabase(userId: string, propertyId: string, property: any) {
  try {
    const supabase = createClient()

    // Insert or update the browsing history record
    const { error } = await (await supabase).from("user_browsing_history").upsert(
      {
        user_id: userId,
        property_id: propertyId,
        viewed_at: new Date().toISOString(),
        property_type: property?.property_type || null,
        location: property?.location || property?.city || null,
        bedrooms: property?.bedrooms || null,
        price: property?.price || null,
        area: property?.area || null,
      },
      {
        onConflict: "user_id,property_id",
        ignoreDuplicates: false,
      },
    )

    if (error) {
      console.error("Error storing property view in database:", error)
    }
  } catch (error) {
    console.error("Error in storePropertyViewInDatabase:", error)
  }
}

// Store property view in cookies for non-authenticated users
function storePropertyViewInCookies(propertyId: string, property: any) {
  try {
    const cookieStore = cookies()
    const existingHistory = cookieStore.get("property_history")

    let history = []
    if (existingHistory) {
      try {
        history = JSON.parse(existingHistory.value)
        // Ensure it's an array
        if (!Array.isArray(history)) history = []
      } catch (e) {
        history = []
      }
    }

    // Check if this property is already in history
    const existingIndex = history.findIndex((item: any) => item.property_id === propertyId)

    if (existingIndex >= 0) {
      // Update existing entry
      history[existingIndex].viewed_at = new Date().toISOString()
      // Move to the beginning of the array (most recent)
      const item = history.splice(existingIndex, 1)[0]
      history.unshift(item)
    } else {
      // Add new entry at the beginning
      history.unshift({
        property_id: propertyId,
        viewed_at: new Date().toISOString(),
        property_type: property?.property_type || null,
        location: property?.location || property?.city || null,
        bedrooms: property?.bedrooms || null,
        price: property?.price || null,
        area: property?.area || null,
      })
    }

    // Limit history to 20 items
    if (history.length > 20) {
      history = history.slice(0, 20)
    }

    // Store back in cookies (7 day expiry)
    cookieStore.set("property_history", JSON.stringify(history), {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    })
  } catch (error) {
    console.error("Error storing property view in cookies:", error)
  }
}
