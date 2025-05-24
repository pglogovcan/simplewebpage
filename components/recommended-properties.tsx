"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bed, Bath, Maximize, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function RecommendedProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true)
        const response = await fetch("/api/recommendations")

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations")
        }

        const data = await response.json()

        if (data.recommendations && data.recommendations.length > 0) {
          setProperties(data.recommendations)
        } else {
          // If no recommendations, don't show the component
          setProperties([])
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error)
        toast({
          title: "Greška",
          description: "Nije moguće dohvatiti preporuke. Pokušajte ponovno kasnije.",
          variant: "destructive",
        })
        setProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [toast])

  // Don't render anything if there are no recommendations
  if (!loading && properties.length === 0) {
    return null
  }

  // Format price to EUR with thousand separators
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("hr-HR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Preporučeno za vas</h2>
            <p className="text-gray-600 mt-1">
              Nekretnine koje bi vam se mogle svidjeti na temelju vaše povijesti pregledavanja
            </p>
          </div>
          <Link href="/pretraga">
            <Button variant="outline" className="hidden sm:flex">
              Pogledaj sve
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md h-[350px] animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: any) => {
              // Safely parse images
              let propertyImages = []
              try {
                propertyImages =
                  typeof property.images === "string"
                    ? JSON.parse(property.images)
                    : Array.isArray(property.images)
                      ? property.images
                      : []
              } catch (e) {
                propertyImages = ["/placeholder.svg?height=400&width=600&text=No+Image"]
              }

              return (
                <Link href={`/nekretnine/${property.id}`} key={property.id} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                    <div className="relative h-48">
                      <Image
                        src={propertyImages[0] || "/placeholder.svg?height=400&width=600&text=No+Image"}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                      {property.featured && (
                        <div className="absolute top-3 left-3 bg-rose-400 text-white text-xs font-semibold px-2 py-1 rounded">
                          IZDVOJENO
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="text-white font-bold text-xl">{formatPrice(property.price)}</div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start gap-1 text-gray-500 text-sm mb-2">
                        <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{property.location || property.city || "Nepoznata lokacija"}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-rose-500 transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-4">
                          {property.bedrooms > 0 && (
                            <div className="flex items-center gap-1">
                              <Bed className="h-4 w-4 text-gray-400" />
                              <span>{property.bedrooms}</span>
                            </div>
                          )}
                          {property.bathrooms > 0 && (
                            <div className="flex items-center gap-1">
                              <Bath className="h-4 w-4 text-gray-400" />
                              <span>{property.bathrooms}</span>
                            </div>
                          )}
                          {property.area > 0 && (
                            <div className="flex items-center gap-1">
                              <Maximize className="h-4 w-4 text-gray-400" />
                              <span>{property.area} m²</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                          {property.property_type || "Nekretnina"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <div className="mt-8 flex justify-center sm:hidden">
          <Link href="/pretraga">
            <Button variant="outline">Pogledaj sve</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
