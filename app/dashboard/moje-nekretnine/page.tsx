"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Bed, Bath, Maximize, MapPin, Heart, ChevronLeft, ChevronRight, Search, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyCard } from "@/components/property-card"
import { getMyProperties } from "@/app/actions/property-actions"
import { toast } from "@/components/ui/use-toast"

type Property = {
  id: string
  title: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  type: string
  images: string[]
  dateAdded: string
}

export default function MyPropertiesPage() {
  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("newest")
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const data = await getMyProperties()
      setProperties(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Filter properties based on search query
  const filteredProperties = properties.filter(
    (property) =>
      (property.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (property.location?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (property.type?.toLowerCase() || '').includes(searchQuery.toLowerCase()),
  )

  // Sort properties based on selected option
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortOption) {
      case "price_asc":
        return a.price - b.price
      case "price_desc":
        return b.price - a.price
      case "area_asc":
        return a.area - b.area
      case "area_desc":
        return b.area - a.area
      case "newest":
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      case "oldest":
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime() 
      default:
        return 0
    }
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
      price,
    )
  }

  const nextImage = (propertyId: string, totalImages: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveImageIndices((prev) => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) + 1) % totalImages,
    }))
  }

  const prevImage = (propertyId: string, totalImages: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveImageIndices((prev) => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) - 1 + totalImages) % totalImages,
    }))
  }

  // Get the current active image index for a property, defaulting to 0
  const getActiveImageIndex = (propertyId: string) => {
    return activeImageIndices[propertyId] || 0
  }

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Jeste li sigurni da želite obrisati ovu nekretninu?")) {
      return
    }

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 204) {
        // Success - no content returned
        toast({
          title: "Nekretnina obrisana",
          description: "Nekretnina je uspješno obrisana.",
        })
        await fetchProperties()
      } else if (response.status === 404) {
        toast({
          title: "Greška",
          description: "Nekretnina nije pronađena.",
          variant: "destructive",
        })
      } else if (response.status === 401) {
        toast({
          title: "Greška",
          description: "Niste autorizirani za ovu akciju.",
          variant: "destructive",
        })
      } else {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to delete property')
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      toast({
        title: "Greška",
        description: error instanceof Error ? error.message : "Došlo je do greške prilikom brisanja nekretnine.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Moje nekretnine</h1>
          <p className="text-muted-foreground">Upravljajte svojim nekretninama.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Pretraži svoje nekretnine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sortiraj po" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Najnovije prvo</SelectItem>
                  <SelectItem value="oldest">Najstarije prvo</SelectItem>
                  <SelectItem value="price_asc">Cijena: od niže prema višoj</SelectItem>
                  <SelectItem value="price_desc">Cijena: od više prema nižoj</SelectItem>
                  <SelectItem value="area_asc">Površina: od manje prema većoj</SelectItem>
                  <SelectItem value="area_desc">Površina: od veće prema manjoj</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grid" className="w-full">
            <div className="flex justify-end mb-4">
              <TabsList>
                <TabsTrigger value="grid">Mreža</TabsTrigger>
                <TabsTrigger value="list">Lista</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid">
              {sortedProperties.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Nema spremljenih nekretnina</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "Nema nekretnina koje odgovaraju vašoj pretrazi."
                      : "Još niste spremili nijednu nekretninu."}
                  </p>
                  {searchQuery ? (
                    <Button onClick={() => setSearchQuery("")}>Poništi pretragu</Button>
                  ) : (
                    <Button asChild>
                      <Link href="/pretraga">Pretraži nekretnine</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {sortedProperties.map((property) => (
                    <PropertyCard 
                      key={property.id} 
                      property={property} 
                      onUpdate={fetchProperties} 
                      editable={true} 
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="list">
              {sortedProperties.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Nema spremljenih nekretnina</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "Nema nekretnina koje odgovaraju vašoj pretrazi."
                      : "Još niste spremili nijednu nekretninu."}
                  </p>
                  {searchQuery ? (
                    <Button onClick={() => setSearchQuery("")}>Poništi pretragu</Button>
                  ) : (
                    <Button asChild>
                      <Link href="/pretraga">Pretraži nekretnine</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedProperties.map((property) => (
                    <div key={property.id} className="group relative">
                      <Link href={`/nekretnine/${property.id}`} className="block">
                        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                          <div className="flex flex-col sm:flex-row">
                            <div className="relative w-full sm:w-1/3 h-48">
                              <div className="relative w-full h-full overflow-hidden">
                                {property.images.map((image, index) => (
                                  <div
                                    key={index}
                                    className={cn(
                                      "absolute inset-0 transition-opacity duration-300",
                                      getActiveImageIndex(property.id) === index ? "opacity-100" : "opacity-0",
                                    )}
                                  >
                                    <Image
                                      src={image || "/placeholder.svg"}
                                      alt={`${property.title} - slika ${index + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ))}

                                <button
                                  onClick={(e) => prevImage(property.id, property.images.length, e)}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-colors z-10"
                                  aria-label="Prethodna slika"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </button>

                                <button
                                  onClick={(e) => nextImage(property.id, property.images.length, e)}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-colors z-10"
                                  aria-label="Sljedeća slika"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 z-10">
                                <div className="text-white font-bold text-xl">{formatPrice(property.price)}</div>
                              </div>
                            </div>

                            <div className="p-4 sm:p-6 flex-1 flex flex-col">
                              <div className="flex items-start gap-1 text-gray-500 text-sm mb-2">
                                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                <span>{property.location}</span>
                              </div>
                              <h3 className="font-semibold text-lg mb-2 group-hover:text-rose-500 transition-colors">
                                {property.title}
                              </h3>

                              <div className="flex items-center gap-4 mb-4">
                                {property.bedrooms > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Bed className="h-4 w-4 text-gray-400" />
                                    <span>{property.bedrooms}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Bath className="h-4 w-4 text-gray-400" />
                                  <span>{property.bathrooms}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Maximize className="h-4 w-4 text-gray-400" />
                                  <span>{property.area} m²</span>
                                </div>
                                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{property.type}</span>
                              </div>

                              <div className="mt-auto text-xs text-gray-500">
                                Dodano: {new Date(property.dateAdded).toLocaleDateString("hr-HR")}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white text-rose-500 hover:text-rose-600 rounded-full z-20"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDelete(property.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
