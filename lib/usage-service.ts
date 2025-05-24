import { getSupabaseClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

export interface UsageStats {
  propertyListings: number
  featuredListings: number
  dailySearches: number
  dailyContacts: number
}

export interface UsageLimit {
  allowed: boolean
  current: number
  limit: number
  message?: string
}

export interface PlanFeatures {
  propertyListings: number
  featuredListings: number
  dailySearches: number
  dailyContacts: number
  name: string
}

class UsageService {
  private supabase = getSupabaseClient()

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    return user
  }

  async getUserUsageStats(userId: string): Promise<UsageStats> {
    try {
      const today = new Date().toISOString().split("T")[0]

      // Get daily usage
      const { data: dailyUsage } = await this.supabase
        .from("user_usage")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .single()

      // Get total property counts
      const { data: propertyCounts } = await this.supabase
        .from("user_property_counts")
        .select("*")
        .eq("user_id", userId)
        .single()

      return {
        propertyListings: propertyCounts?.total_listings || 0,
        featuredListings: propertyCounts?.featured_listings || 0,
        dailySearches: dailyUsage?.searches_count || 0,
        dailyContacts: dailyUsage?.contacts_count || 0,
      }
    } catch (error) {
      console.error("Error fetching usage stats:", error)
      return {
        propertyListings: 0,
        featuredListings: 0,
        dailySearches: 0,
        dailyContacts: 0,
      }
    }
  }

  async checkUsageLimit(
    userId: string,
    action: "property_listing" | "featured_listing" | "search" | "contact",
  ): Promise<UsageLimit> {
    try {
      // Get user's plan features
      const planFeatures = await this.getUserPlanFeatures(userId)
      const currentUsage = await this.getUserUsageStats(userId)

      switch (action) {
        case "property_listing":
          const canAddProperty = currentUsage.propertyListings < planFeatures.propertyListings
          return {
            allowed: canAddProperty,
            current: currentUsage.propertyListings,
            limit: planFeatures.propertyListings,
            message: canAddProperty
              ? undefined
              : `You've reached your limit of ${planFeatures.propertyListings} property listings. Upgrade to add more properties.`,
          }

        case "featured_listing":
          const canAddFeatured = currentUsage.featuredListings < planFeatures.featuredListings
          return {
            allowed: canAddFeatured,
            current: currentUsage.featuredListings,
            limit: planFeatures.featuredListings,
            message: canAddFeatured
              ? undefined
              : `You've reached your limit of ${planFeatures.featuredListings} featured listings. Upgrade to feature more properties.`,
          }

        case "search":
          const canSearch = currentUsage.dailySearches < planFeatures.dailySearches
          return {
            allowed: canSearch,
            current: currentUsage.dailySearches,
            limit: planFeatures.dailySearches,
            message: canSearch
              ? undefined
              : `You've reached your daily limit of ${planFeatures.dailySearches} searches. Upgrade for more searches.`,
          }

        case "contact":
          const canContact = currentUsage.dailyContacts < planFeatures.dailyContacts
          return {
            allowed: canContact,
            current: currentUsage.dailyContacts,
            limit: planFeatures.dailyContacts,
            message: canContact
              ? undefined
              : `You've reached your daily limit of ${planFeatures.dailyContacts} contacts. Upgrade for more contacts.`,
          }

        default:
          return { allowed: false, current: 0, limit: 0, message: "Invalid action" }
      }
    } catch (error) {
      console.error("Error checking usage limit:", error)
      return { allowed: false, current: 0, limit: 0, message: "Error checking usage limit" }
    }
  }

  async trackUsage(
    userId: string,
    action: "property_listing" | "featured_listing" | "search" | "contact",
  ): Promise<boolean> {
    try {
      const today = new Date().toISOString().split("T")[0]

      switch (action) {
        case "property_listing":
          await this.supabase.rpc("increment_total_listings", { user_id_param: userId })
          await this.supabase.rpc("increment_usage", {
            user_id_param: userId,
            date_param: today,
            column_name: "property_listings_count",
          })
          break

        case "featured_listing":
          await this.supabase.rpc("increment_featured_listings", { user_id_param: userId })
          await this.supabase.rpc("increment_usage", {
            user_id_param: userId,
            date_param: today,
            column_name: "featured_listings_count",
          })
          break

        case "search":
          await this.supabase.rpc("increment_usage", {
            user_id_param: userId,
            date_param: today,
            column_name: "searches_count",
          })
          break

        case "contact":
          await this.supabase.rpc("increment_usage", {
            user_id_param: userId,
            date_param: today,
            column_name: "contacts_count",
          })
          break
      }

      return true
    } catch (error) {
      console.error("Error tracking usage:", error)
      return false
    }
  }

  private async getUserPlanFeatures(userId: string): Promise<PlanFeatures> {
    try {
      // Get user's subscription
      const { data: subscription } = await this.supabase
        .from("subscriptions")
        .select("plan_type, status")
        .eq("user_id", userId)
        .eq("status", "active")
        .single()

      const planType = subscription?.plan_type || "basic"

      // Return plan features based on plan type
      switch (planType) {
        case "premium":
          return {
            propertyListings: 999999, // Unlimited
            featuredListings: 999999, // Unlimited
            dailySearches: 999999, // Unlimited
            dailyContacts: 999999, // Unlimited
            name: "Premium",
          }
        case "standard":
          return {
            propertyListings: 25,
            featuredListings: 5,
            dailySearches: 200,
            dailyContacts: 50,
            name: "Standard",
          }
        default: // basic
          return {
            propertyListings: 5,
            featuredListings: 1,
            dailySearches: 50,
            dailyContacts: 10,
            name: "Basic",
          }
      }
    } catch (error) {
      console.error("Error getting user plan features:", error)
      // Return basic plan as fallback
      return {
        propertyListings: 5,
        featuredListings: 1,
        dailySearches: 50,
        dailyContacts: 10,
        name: "Basic",
      }
    }
  }
}

export const usageService = new UsageService()
