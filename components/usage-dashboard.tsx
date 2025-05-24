"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { usageService } from "@/lib/usage-service"
import { getSupabaseClient } from "@/utils/supabase/client"
import { Home, Star, Search, MessageCircle, Crown } from "lucide-react"
import Link from "next/link"

interface UsageStats {
  currentUsage: {
    propertyListingsCount: number
    featuredListingsCount: number
    searchesCount: number
    contactsCount: number
    date: string
  }
  totalListings: number
  totalFeatured: number
  limits: {
    propertyListings: number
    featuredListings: number
    searchesPerDay: number
    contactsPerDay: number
  }
  planType: string
}

export function UsageDashboard() {
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsageStats() {
      try {
        const supabase = getSupabaseClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setLoading(false)
          return
        }

        const stats = await usageService.getUserUsageStats(user.id)
        setUsageStats(stats)
      } catch (error) {
        console.error("Error fetching usage stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsageStats()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!usageStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please log in to view your usage statistics.</p>
        </CardContent>
      </Card>
    )
  }

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0 // Unlimited
    return Math.min((current / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-amber-600"
    return "text-green-600"
  }

  const formatLimit = (limit: number) => {
    return limit === -1 ? "Unlimited" : limit.toString()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Usage Overview
            <Badge variant="outline" className="capitalize">
              {usageStats.planType} Plan
            </Badge>
          </CardTitle>
          {usageStats.planType !== "premium" && (
            <Button asChild size="sm" className="bg-rose-500 hover:bg-rose-600">
              <Link href="/cijene">
                <Crown className="w-4 h-4 mr-1" />
                Upgrade
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Property Listings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-blue-500" />
                <span className="font-medium">Property Listings</span>
              </div>
              <span
                className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usageStats.totalListings, usageStats.limits.propertyListings))}`}
              >
                {usageStats.totalListings} / {formatLimit(usageStats.limits.propertyListings)}
              </span>
            </div>
            {usageStats.limits.propertyListings !== -1 && (
              <Progress
                value={getUsagePercentage(usageStats.totalListings, usageStats.limits.propertyListings)}
                className="h-2"
              />
            )}
          </div>

          {/* Featured Listings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="font-medium">Featured Listings</span>
              </div>
              <span
                className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usageStats.totalFeatured, usageStats.limits.featuredListings))}`}
              >
                {usageStats.totalFeatured} / {formatLimit(usageStats.limits.featuredListings)}
              </span>
            </div>
            {usageStats.limits.featuredListings !== -1 && (
              <Progress
                value={getUsagePercentage(usageStats.totalFeatured, usageStats.limits.featuredListings)}
                className="h-2"
              />
            )}
          </div>

          {/* Daily Searches */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-green-500" />
                <span className="font-medium">Searches Today</span>
              </div>
              <span
                className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usageStats.currentUsage.searchesCount, usageStats.limits.searchesPerDay))}`}
              >
                {usageStats.currentUsage.searchesCount} / {formatLimit(usageStats.limits.searchesPerDay)}
              </span>
            </div>
            {usageStats.limits.searchesPerDay !== -1 && (
              <Progress
                value={getUsagePercentage(usageStats.currentUsage.searchesCount, usageStats.limits.searchesPerDay)}
                className="h-2"
              />
            )}
          </div>

          {/* Daily Contacts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-purple-500" />
                <span className="font-medium">Contacts Today</span>
              </div>
              <span
                className={`text-sm font-medium ${getUsageColor(getUsagePercentage(usageStats.currentUsage.contactsCount, usageStats.limits.contactsPerDay))}`}
              >
                {usageStats.currentUsage.contactsCount} / {formatLimit(usageStats.limits.contactsPerDay)}
              </span>
            </div>
            {usageStats.limits.contactsPerDay !== -1 && (
              <Progress
                value={getUsagePercentage(usageStats.currentUsage.contactsCount, usageStats.limits.contactsPerDay)}
                className="h-2"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Your Plan Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Property Listings:</span>
              <span className="ml-2">{formatLimit(usageStats.limits.propertyListings)}</span>
            </div>
            <div>
              <span className="font-medium">Featured Listings:</span>
              <span className="ml-2">{formatLimit(usageStats.limits.featuredListings)}</span>
            </div>
            <div>
              <span className="font-medium">Daily Searches:</span>
              <span className="ml-2">{formatLimit(usageStats.limits.searchesPerDay)}</span>
            </div>
            <div>
              <span className="font-medium">Daily Contacts:</span>
              <span className="ml-2">{formatLimit(usageStats.limits.contactsPerDay)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
