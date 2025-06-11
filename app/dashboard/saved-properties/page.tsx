"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { getMySavedProperties } from "@/app/actions/property-actions"
import { PropertyCard } from "@/components/property-card"

export type Property = {
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

export default function SavedPropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("newest")
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSavedProperties()
  }, [])

  const fetchSavedProperties = async () => {
    try {
      const data = await getMySavedProperties()
      setProperties(data)
      console.log(data)
    } catch (error) {
      console.error('Error fetching saved properties:', error)
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom dohvaćanja spremljenih nekretnina.",
        variant: "destructive",
      })
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

  const handleUnsave = async (propertyId: string) => {
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
          title: "Nekretnina uklonjena",
          description: "Nekretnina je uspješno uklonjena iz spremljenih.",
        })
        await fetchSavedProperties()
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
      console.error('Error unsaving property:', error)
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom uklanjanja nekretnine iz spremljenih.",
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
          <h1 className="text-2xl font-bold tracking-tight">Spremljene nekretnine</h1>
          <p className="text-muted-foreground">Upravljajte svojim spremljenim nekretninama.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Pretraži spremljene nekretnine..."
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
                    <Button className="bg-rose-400 hover:bg-rose-500">
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
                      onUpdate={fetchSavedProperties}
                      editable={false}
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
                    <Button className="bg-rose-400 hover:bg-rose-500">
                      <Link href="/pretraga">Pretraži nekretnine</Link>
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onUpdate={fetchSavedProperties}
                      editable={false}
                    />
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
