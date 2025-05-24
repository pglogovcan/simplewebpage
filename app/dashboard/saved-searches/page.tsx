"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, X, Trash2, Edit, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

type SavedSearch = {
  id: string
  name: string
  query: string
  location: string
  propertyType: string
  priceRange: [number, number]
  areaRange: [number, number]
  bedrooms: number[]
  notificationsEnabled: boolean
  dateAdded: string
  lastUpdated: string
  matchCount: number
  newMatches: number
}

export default function SavedSearchesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for saved searches
  const savedSearches: SavedSearch[] = [
    {
      id: "1",
      name: "Stan u Zagrebu",
      query: "Zagreb, stan, 2+ sobe",
      location: "Zagreb",
      propertyType: "Stan",
      priceRange: [100000, 200000],
      areaRange: [50, 100],
      bedrooms: [2, 3],
      notificationsEnabled: true,
      dateAdded: "2025-03-01",
      lastUpdated: "2025-03-12",
      matchCount: 24,
      newMatches: 2,
    },
    {
      id: "2",
      name: "Kuća na moru",
      query: "Split, Zadar, kuća, blizu mora",
      location: "Split, Zadar",
      propertyType: "Kuća",
      priceRange: [200000, 500000],
      areaRange: [100, 300],
      bedrooms: [3, 4, 5],
      notificationsEnabled: true,
      dateAdded: "2025-02-15",
      lastUpdated: "2025-03-10",
      matchCount: 18,
      newMatches: 0,
    },
    {
      id: "3",
      name: "Apartman za najam",
      query: "Dubrovnik, apartman, najam",
      location: "Dubrovnik",
      propertyType: "Apartman",
      priceRange: [0, 150000],
      areaRange: [30, 70],
      bedrooms: [1, 2],
      notificationsEnabled: false,
      dateAdded: "2025-02-10",
      lastUpdated: "2025-02-10",
      matchCount: 12,
      newMatches: 0,
    },
    {
      id: "4",
      name: "Poslovni prostor",
      query: "Zagreb, poslovni prostor, najam",
      location: "Zagreb",
      propertyType: "Poslovni prostor",
      priceRange: [0, 300000],
      areaRange: [50, 200],
      bedrooms: [],
      notificationsEnabled: false,
      dateAdded: "2025-01-20",
      lastUpdated: "2025-01-20",
      matchCount: 8,
      newMatches: 0,
    },
  ]

  // Filter searches based on search query
  const filteredSearches = savedSearches.filter(
    (search) =>
      search.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      search.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
      search.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      search.propertyType.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
      price,
    )
  }

  const toggleNotifications = (id: string) => {
    // In a real app, this would update the state and make an API call
    console.log(`Toggle notifications for search ${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Spremljene pretrage</h1>
          <p className="text-muted-foreground">Upravljajte svojim spremljenim pretragama i obavijestima.</p>
        </div>
        <Button className="bg-rose-400 hover:bg-rose-500">
          <Link href="/pretraga">Nova pretraga</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Pretraži spremljene pretrage..."
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
          </div>
        </CardHeader>
        <CardContent>
          {filteredSearches.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Nema spremljenih pretraga</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Nema pretraga koje odgovaraju vašoj pretrazi." : "Još niste spremili nijednu pretragu."}
              </p>
              {searchQuery ? (
                <Button onClick={() => setSearchQuery("")}>Poništi pretragu</Button>
              ) : (
                <Button className="bg-rose-400 hover:bg-rose-500">
                  <Link href="/pretraga">Kreiraj pretragu</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSearches.map((search) => (
                <div key={search.id} className="bg-white rounded-lg border shadow-sm p-4">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{search.name}</h3>
                        {search.newMatches > 0 && <Badge className="bg-rose-400">{search.newMatches} novih</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{search.query}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="bg-gray-50">
                          {search.location}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-50">
                          {search.propertyType}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-50">
                          {formatPrice(search.priceRange[0])} - {formatPrice(search.priceRange[1])}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-50">
                          {search.areaRange[0]} - {search.areaRange[1]} m²
                        </Badge>
                        {search.bedrooms.length > 0 && (
                          <Badge variant="outline" className="bg-gray-50">
                            {search.bedrooms.join(", ")} {search.bedrooms.length === 1 ? "soba" : "sobe"}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div>Pronađeno: {search.matchCount}</div>
                        <div>Zadnje ažuriranje: {new Date(search.lastUpdated).toLocaleDateString("hr-HR")}</div>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={search.notificationsEnabled}
                          onCheckedChange={() => toggleNotifications(search.id)}
                          id={`notifications-${search.id}`}
                        />
                        <label htmlFor={`notifications-${search.id}`} className="text-sm font-medium cursor-pointer">
                          Obavijesti
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-rose-500 hover:text-rose-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" className="gap-2">
                      <span>Pogledaj rezultate</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
