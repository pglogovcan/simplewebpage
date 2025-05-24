"use client"

import { useState } from "react"
import Image from "next/image"
import { School, ShoppingBag, Utensils, Bus, ParkingMeterIcon as Park, Star, MapPin } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Types for neighborhood data
type PointOfInterest = {
  id: string
  name: string
  type: "school" | "shop" | "restaurant" | "transport" | "park" | "other"
  distance: number // in meters
  rating?: number
}

type NeighborhoodRating = {
  category: string
  score: number // 0-100
}

type NeighborhoodData = {
  name: string
  description: string
  image: string
  pointsOfInterest: PointOfInterest[]
  ratings: NeighborhoodRating[]
}

// Props for the component
interface NeighborhoodInfoProps {
  propertyAddress: string
  neighborhoodData: NeighborhoodData
  hideRatings?: boolean
}

// Helper function to get icon based on POI type
const getPoiIcon = (type: PointOfInterest["type"]) => {
  switch (type) {
    case "school":
      return <School className="h-4 w-4" />
    case "shop":
      return <ShoppingBag className="h-4 w-4" />
    case "restaurant":
      return <Utensils className="h-4 w-4" />
    case "transport":
      return <Bus className="h-4 w-4" />
    case "park":
      return <Park className="h-4 w-4" />
    default:
      return <Park className="h-4 w-4" />
  }
}

// Helper function to format distance
const formatDistance = (meters: number) => {
  if (meters < 1000) {
    return `${meters} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

export default function NeighborhoodInfo({ propertyAddress, neighborhoodData, hideRatings }: NeighborhoodInfoProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Filter POIs by category
  const filteredPois = activeCategory
    ? neighborhoodData.pointsOfInterest.filter((poi) => poi.type === activeCategory)
    : neighborhoodData.pointsOfInterest.slice(0, 5) // Show only top 5 by default

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Neighborhood header with image */}
      <div className="relative h-40 w-full">
        <Image
          src={neighborhoodData.image || "/placeholder.svg?height=400&width=800&text=Neighborhood"}
          alt={neighborhoodData.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h2 className="text-xl font-bold">{neighborhoodData.name}</h2>
            <div className="flex items-center text-sm mt-1">
              <MapPin className="h-4 w-4 mr-1 text-rose-400" />
              <span>{propertyAddress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Neighborhood content */}
      <div className="p-4">
        {/* Description - shortened */}
        <p className="text-gray-600 text-sm mb-4">{neighborhoodData.description}</p>

        {/* Top 3 Neighborhood ratings - conditionally rendered */}
        {!hideRatings && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Ocjene kvarta</h3>
            <div className="space-y-3">
              {neighborhoodData.ratings.slice(0, 3).map((rating) => (
                <div key={rating.category} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{rating.category}</span>
                    <span className="text-sm font-semibold">{rating.score}/100</span>
                  </div>
                  <Progress
                    value={rating.score}
                    className="h-2"
                    indicatorClassName={cn(
                      rating.score >= 80
                        ? "bg-green-500"
                        : rating.score >= 60
                          ? "bg-lime-500"
                          : rating.score >= 40
                            ? "bg-yellow-500"
                            : rating.score >= 20
                              ? "bg-orange-500"
                              : "bg-red-500",
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Points of interest - simplified */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">U blizini</h3>
          </div>

          {/* POI category filters - simplified */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={activeCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(null)}
              className={activeCategory === null ? "bg-rose-400 hover:bg-rose-500" : ""}
            >
              Sve
            </Button>
            <Button
              variant={activeCategory === "school" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("school")}
              className={activeCategory === "school" ? "bg-rose-400 hover:bg-rose-500" : ""}
            >
              <School className="h-3.5 w-3.5 mr-1" />
              Škole
            </Button>
            <Button
              variant={activeCategory === "shop" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("shop")}
              className={activeCategory === "shop" ? "bg-rose-400 hover:bg-rose-500" : ""}
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-1" />
              Trgovine
            </Button>
            <Button
              variant={activeCategory === "restaurant" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("restaurant")}
              className={activeCategory === "restaurant" ? "bg-rose-400 hover:bg-rose-500" : ""}
            >
              <Utensils className="h-3.5 w-3.5 mr-1" />
              Restorani
            </Button>
          </div>

          {/* POI list - simplified */}
          <div className="space-y-2">
            {filteredPois.length === 0 ? (
              <p className="text-center py-2 text-gray-500">Nema pronađenih lokacija</p>
            ) : (
              filteredPois.map((poi) => (
                <div key={poi.id} className="border border-gray-200 rounded-lg p-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-full shrink-0",
                        poi.type === "school"
                          ? "bg-blue-100 text-blue-600"
                          : poi.type === "shop"
                            ? "bg-purple-100 text-purple-600"
                            : poi.type === "restaurant"
                              ? "bg-orange-100 text-orange-600"
                              : poi.type === "transport"
                                ? "bg-green-100 text-green-600"
                                : poi.type === "park"
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {getPoiIcon(poi.type)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{poi.name}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        <span>{formatDistance(poi.distance)}</span>
                        {poi.rating && (
                          <div className="flex items-center">
                            <span className="mx-1">•</span>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="ml-0.5">{poi.rating}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
