import { getSupabaseClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

export interface SubscriptionFeatures {
  propertyListings: number
  featuredListings: number
  dailySearches: number
  dailyContacts: number
  name: string
  price: string
  features: string[]
}

export async function getUserPlanType(userId: string): Promise<string> {
  try {
    const supabase = getSupabaseClient()

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan_type, status")
      .eq("user_id", userId)
      .eq("status", "active")
      .single()

    return subscription?.plan_type || "basic"
  } catch (error) {
    console.error("Error getting user plan type:", error)
    return "basic"
  }
}

export function getSubscriptionFeatures(planType: string): SubscriptionFeatures {
  switch (planType) {
    case "premium":
      return {
        propertyListings: 999999,
        featuredListings: 999999,
        dailySearches: 999999,
        dailyContacts: 999999,
        name: "Premium",
        price: "€99/month",
        features: [
          "Unlimited property listings",
          "Unlimited featured listings",
          "Unlimited daily searches",
          "Unlimited daily contacts",
          "Priority support",
          "Advanced analytics",
          "Custom branding",
        ],
      }
    case "standard":
      return {
        propertyListings: 25,
        featuredListings: 5,
        dailySearches: 200,
        dailyContacts: 50,
        name: "Standard",
        price: "€29/month",
        features: [
          "25 property listings",
          "5 featured listings",
          "200 daily searches",
          "50 daily contacts",
          "Email support",
          "Basic analytics",
        ],
      }
    default: // basic
      return {
        propertyListings: 5,
        featuredListings: 1,
        dailySearches: 50,
        dailyContacts: 10,
        name: "Basic",
        price: "€9/month",
        features: [
          "5 property listings",
          "1 featured listing",
          "50 daily searches",
          "10 daily contacts",
          "Community support",
        ],
      }
  }
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("user_id", userId)
      .eq("status", "active")
      .single()

    return !!subscription
  } catch (error) {
    console.error("Error checking subscription status:", error)
    return false
  }
}

export async function canPerformAction(
  userId: string,
  action: "property_listing" | "featured_listing" | "search" | "contact",
): Promise<boolean> {
  try {
    const planType = await getUserPlanType(userId)
    const features = getSubscriptionFeatures(planType)

    // For now, just check if user has an active subscription
    // In a real implementation, you'd check current usage against limits
    return features.propertyListings > 0
  } catch (error) {
    console.error("Error checking action permission:", error)
    return false
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = getSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}
