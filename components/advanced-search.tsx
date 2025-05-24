"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Search,
  MapPin,
  Home,
  Bed,
  Bath,
  Maximize,
  Euro,
  Calendar,
  X,
  Save,
  Filter,
  CheckSquare,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

// Types
type PropertyType = "all" | "house" | "apartment" | "villa" | "penthouse" | "studio" | "duplex" | "land" | "commercial"
type ListingType = "all" | "sale" | "rent"

interface SearchFilters {
  query: string
  location: string
  propertyType: PropertyType
  listingType: ListingType
  priceRange: [number, number]
  areaRange: [number, number]
  bedrooms: number[]
  bathrooms: number[]
  amenities: string[]
  yearBuilt: [number, number]
  sortBy: string
}

interface SavedSearch {
  id: string
  name: string
  filters: SearchFilters
  createdAt: string
}

// Default filter values
const defaultFilters: SearchFilters = {
  query: "",
  location: "",
  propertyType: "all",
  listingType: "all",
  priceRange: [0, 1000000],
  areaRange: [0, 500],
  bedrooms: [],
  bathrooms: [],
  amenities: [],
  yearBuilt: [1950, new Date().getFullYear()],
  sortBy: "newest",
}

// Mock locations for dropdown
const locations = [
  { id: "zagreb", name: "Zagreb" },
  { id: "split", name: "Split" },
  { id: "rijeka", name: "Rijeka" },
  { id: "osijek", name: "Osijek" },
  { id: "zadar", name: "Zadar" },
  { id: "dubrovnik", name: "Dubrovnik" },
  { id: "pula", name: "Pula" },
  { id: "varazdin", name: "Varaždin" },
  { id: "sibenik", name: "Šibenik" },
  { id: "karlovac", name: "Karlovac" },
]

// Property types
const propertyTypes = [
  { id: "all", name: "Sve vrste" },
  { id: "house", name: "Kuća" },
  { id: "apartment", name: "Stan" },
  { id: "villa", name: "Vila" },
  { id: "penthouse", name: "Penthouse" },
  { id: "studio", name: "Studio" },
  { id: "duplex", name: "Dupleks" },
  { id: "land", name: "Zemljište" },
  { id: "commercial", name: "Poslovni prostor" },
]

// Amenities
const amenitiesList = [
  { id: "parking", name: "Parking" },
  { id: "garage", name: "Garaža" },
  { id: "balcony", name: "Balkon" },
  { id: "terrace", name: "Terasa" },
  { id: "garden", name: "Vrt" },
  { id: "pool", name: "Bazen" },
  { id: "elevator", name: "Lift" },
  { id: "airConditioning", name: "Klima uređaj" },
  { id: "heating", name: "Grijanje" },
  { id: "furnished", name: "Namješteno" },
  { id: "petFriendly", name: "Ljubimci dozvoljeni" },
  { id: "storage", name: "Spremište" },
  { id: "securitySystem", name: "Sigurnosni sustav" },
  { id: "fireplace", name: "Kamin" },
  { id: "newBuilding", name: "Novogradnja" },
  { id: "seaView", name: "Pogled na more" },
]

// Sort options
const sortOptions = [
  { id: "newest", name: "Najnovije" },
  { id: "priceAsc", name: "Cijena (niža prema višoj)" },
  { id: "priceDesc", name: "Cijena (viša prema nižoj)" },
  { id: "areaAsc", name: "Površina (manja prema većoj)" },
  { id: "areaDesc", name: "Površina (veća prema manjoj)" },
]

export function AdvancedSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State for filters
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [saveSearchName, setSaveSearchName] = useState("")
  const [isSaveSearchOpen, setIsSaveSearchOpen] = useState(false)

  // Ref to track initialization
  const initializedRef = useRef(false)

  // Initialize filters from URL params - only on mount
  useEffect(() => {
    // Mock login status - in a real app, this would come from your auth system
    setIsLoggedIn(true)

    // Load saved searches from localStorage (in a real app, this would come from your backend)
    const savedSearchesFromStorage = localStorage.getItem("savedSearches")
    if (savedSearchesFromStorage) {
      setSavedSearches(JSON.parse(savedSearchesFromStorage))
    }

    if (!initializedRef.current) {
      // Parse URL params to set initial filters
      const query = searchParams.get("query") || ""
      const location = searchParams.get("location") || ""
      const propertyType = (searchParams.get("propertyType") as PropertyType) || "all"
      const listingType = (searchParams.get("listingType") as ListingType) || "all"

      // Parse numeric ranges
      const minPrice = Number.parseInt(searchParams.get("minPrice") || "0")
      const maxPrice = Number.parseInt(searchParams.get("maxPrice") || "1000000")
      const minArea = Number.parseInt(searchParams.get("minArea") || "0")
      const maxArea = Number.parseInt(searchParams.get("maxArea") || "500")

      // Parse arrays
      const bedrooms = searchParams.get("bedrooms")?.split(",").map(Number) || []
      const bathrooms = searchParams.get("bathrooms")?.split(",").map(Number) || []
      const amenities = searchParams.get("amenities")?.split(",") || []

      // Parse year built range
      const minYear = Number.parseInt(searchParams.get("minYear") || "1950")
      const maxYear = Number.parseInt(searchParams.get("maxYear") || new Date().getFullYear().toString())

      // Sort option
      const sortBy = searchParams.get("sortBy") || "newest"

      setFilters({
        query,
        location,
        propertyType,
        listingType,
        priceRange: [minPrice, maxPrice],
        areaRange: [minArea, maxArea],
        bedrooms,
        bathrooms,
        amenities,
        yearBuilt: [minYear, maxYear],
        sortBy,
      })

      initializedRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Count active filters for badge
  useEffect(() => {
    let count = 0

    if (filters.query) count++
    if (filters.location) count++
    if (filters.propertyType !== "all") count++
    if (filters.listingType !== "all") count++
    if (filters.priceRange[0] > defaultFilters.priceRange[0] || filters.priceRange[1] < defaultFilters.priceRange[1])
      count++
    if (filters.areaRange[0] > defaultFilters.areaRange[0] || filters.areaRange[1] < defaultFilters.areaRange[1])
      count++
    if (filters.bedrooms.length > 0) count++
    if (filters.bathrooms.length > 0) count++
    if (filters.amenities.length > 0) count++
    if (filters.yearBuilt[0] > defaultFilters.yearBuilt[0] || filters.yearBuilt[1] < defaultFilters.yearBuilt[1])
      count++
    if (filters.sortBy !== "newest") count++

    setActiveFiltersCount(count)
  }, [filters])

  // Handle search submission
  const handleSearch = () => {
    // Build query params
    const params = new URLSearchParams()

    if (filters.query) params.set("query", filters.query)
    if (filters.location) params.set("location", filters.location)
    if (filters.propertyType !== "all") params.set("propertyType", filters.propertyType)
    if (filters.listingType !== "all") params.set("listingType", filters.listingType)

    // Price range
    if (filters.priceRange[0] > defaultFilters.priceRange[0]) params.set("minPrice", filters.priceRange[0].toString())
    if (filters.priceRange[1] < defaultFilters.priceRange[1]) params.set("maxPrice", filters.priceRange[1].toString())

    // Area range
    if (filters.areaRange[0] > defaultFilters.areaRange[0]) params.set("minArea", filters.areaRange[0].toString())
    if (filters.areaRange[1] < defaultFilters.areaRange[1]) params.set("maxArea", filters.areaRange[1].toString())

    // Arrays
    if (filters.bedrooms.length > 0) params.set("bedrooms", filters.bedrooms.join(","))
    if (filters.bathrooms.length > 0) params.set("bathrooms", filters.bathrooms.join(","))
    if (filters.amenities.length > 0) params.set("amenities", filters.amenities.join(","))

    // Year built
    if (filters.yearBuilt[0] > defaultFilters.yearBuilt[0]) params.set("minYear", filters.yearBuilt[0].toString())
    if (filters.yearBuilt[1] < defaultFilters.yearBuilt[1]) params.set("maxYear", filters.yearBuilt[1].toString())

    // Sort
    if (filters.sortBy !== "newest") params.set("sortBy", filters.sortBy)

    // Navigate to search results
    const url = `/pretraga?${params.toString()}`
    router.push(url)
  }

  // Reset filters
  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  // Toggle bedroom selection
  const toggleBedroom = (value: number) => {
    setFilters((prev) => {
      const newBedrooms = prev.bedrooms.includes(value)
        ? prev.bedrooms.filter((b) => b !== value)
        : [...prev.bedrooms, value]
      return { ...prev, bedrooms: newBedrooms }
    })
  }

  // Toggle bathroom selection
  const toggleBathroom = (value: number) => {
    setFilters((prev) => {
      const newBathrooms = prev.bathrooms.includes(value)
        ? prev.bathrooms.filter((b) => b !== value)
        : [...prev.bathrooms, value]
      return { ...prev, bathrooms: newBathrooms }
    })
  }

  // Toggle amenity selection
  const toggleAmenity = (value: string) => {
    setFilters((prev) => {
      const newAmenities = prev.amenities.includes(value)
        ? prev.amenities.filter((a) => a !== value)
        : [...prev.amenities, value]
      return { ...prev, amenities: newAmenities }
    })
  }

  // Save current search
  const saveSearch = () => {
    if (!saveSearchName.trim()) {
      toast({
        title: "Greška",
        description: "Molimo unesite naziv za spremljenu pretragu",
        variant: "destructive",
      })
      return
    }

    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: saveSearchName,
      filters: { ...filters },
      createdAt: new Date().toISOString(),
    }

    const updatedSearches = [...savedSearches, newSavedSearch]
    setSavedSearches(updatedSearches)

    // In a real app, you would save this to your backend
    // For now, we'll use localStorage
    localStorage.setItem("savedSearches", JSON.stringify(updatedSearches))

    toast({
      title: "Pretraga spremljena",
      description: "Vaša pretraga je uspješno spremljena",
    })

    setSaveSearchName("")
    setIsSaveSearchOpen(false)
  }

  // Load a saved search
  const loadSavedSearch = (search: SavedSearch) => {
    setFilters(search.filters)
    handleSearch()
  }

  // Delete a saved search
  const deleteSavedSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    const updatedSearches = savedSearches.filter((search) => search.id !== id)
    setSavedSearches(updatedSearches)

    // In a real app, you would update this on your backend
    localStorage.setItem("savedSearches", JSON.stringify(updatedSearches))

    toast({
      title: "Pretraga izbrisana",
      description: "Vaša spremljena pretraga je izbrisana",
    })
  }

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("hr-HR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="w-full">
      {/* Main search bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search query input */}
          <div className="flex-grow">
            <div className="relative">
              <Input
                type="text"
                placeholder="Pretraži po lokaciji, tipu nekretnine..."
                value={filters.query}
                onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              {filters.query && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, query: "" }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Location dropdown */}
          <div className="w-full md:w-64">
            <Select
              value={filters.location}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, location: value }))}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Lokacija" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Sve lokacije</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property type dropdown */}
          <div className="w-full md:w-64">
            <Select
              value={filters.propertyType}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, propertyType: value as PropertyType }))}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Home className="mr-2 h-4 w-4 text-gray-400" />
                  <SelectValue placeholder="Tip nekretnine" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Advanced filters button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="mr-2 h-4 w-4" />
                <span>Filteri</span>
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-rose-500">{activeFiltersCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Napredna pretraga</SheetTitle>
                <SheetDescription>Prilagodite pretragu prema vašim željama</SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-6">
                {/* Listing type */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Vrsta oglasa</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={filters.listingType === "all" ? "default" : "outline"}
                      className={cn(filters.listingType === "all" && "bg-rose-500 hover:bg-rose-600")}
                      onClick={() => setFilters((prev) => ({ ...prev, listingType: "all" }))}
                    >
                      Sve
                    </Button>
                    <Button
                      variant={filters.listingType === "sale" ? "default" : "outline"}
                      className={cn(filters.listingType === "sale" && "bg-rose-500 hover:bg-rose-600")}
                      onClick={() => setFilters((prev) => ({ ...prev, listingType: "sale" }))}
                    >
                      Prodaja
                    </Button>
                    <Button
                      variant={filters.listingType === "rent" ? "default" : "outline"}
                      className={cn(filters.listingType === "rent" && "bg-rose-500 hover:bg-rose-600")}
                      onClick={() => setFilters((prev) => ({ ...prev, listingType: "rent" }))}
                    >
                      Najam
                    </Button>
                  </div>
                </div>

                {/* Price range */}
                <Accordion type="single" collapsible defaultValue="price">
                  <AccordionItem value="price">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center">
                        <Euro className="mr-2 h-4 w-4 text-gray-500" />
                        <span>Cijena</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <Slider
                          min={0}
                          max={1000000}
                          step={10000}
                          value={filters.priceRange}
                          onValueChange={(value) =>
                            setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))
                          }
                          className="mb-6"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{formatPrice(filters.priceRange[0])}</span>
                          <span>{formatPrice(filters.priceRange[1])}</span>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Od"
                            value={filters.priceRange[0]}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                priceRange: [Number.parseInt(e.target.value) || 0, prev.priceRange[1]],
                              }))
                            }
                            className="w-1/2"
                          />
                          <Input
                            type="number"
                            placeholder="Do"
                            value={filters.priceRange[1]}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                priceRange: [prev.priceRange[0], Number.parseInt(e.target.value) || 1000000],
                              }))
                            }
                            className="w-1/2"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Area range */}
                <Accordion type="single" collapsible defaultValue="area">
                  <AccordionItem value="area">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center">
                        <Maximize className="mr-2 h-4 w-4 text-gray-500" />
                        <span>Površina (m²)</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <Slider
                          min={0}
                          max={500}
                          step={5}
                          value={filters.areaRange}
                          onValueChange={(value) =>
                            setFilters((prev) => ({ ...prev, areaRange: value as [number, number] }))
                          }
                          className="mb-6"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{filters.areaRange[0]} m²</span>
                          <span>{filters.areaRange[1]} m²</span>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Od"
                            value={filters.areaRange[0]}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                areaRange: [Number.parseInt(e.target.value) || 0, prev.areaRange[1]],
                              }))
                            }
                            className="w-1/2"
                          />
                          <Input
                            type="number"
                            placeholder="Do"
                            value={filters.areaRange[1]}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                areaRange: [prev.areaRange[0], Number.parseInt(e.target.value) || 500],
                              }))
                            }
                            className="w-1/2"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Bedrooms */}
                <Accordion type="single" collapsible defaultValue="bedrooms">
                  <AccordionItem value="bedrooms">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center">
                        <Bed className="mr-2 h-4 w-4 text-gray-500" />
                        <span>Broj spavaćih soba</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <Button
                            key={num}
                            variant="outline"
                            size="sm"
                            className={cn(
                              "rounded-full",
                              filters.bedrooms.includes(num) && "bg-rose-100 text-rose-600 border-rose-200",
                            )}
                            onClick={() => toggleBedroom(num)}
                          >
                            {num === 5 ? "5+" : num}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Bathrooms */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="bathrooms">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center">
                        <Bath className="mr-2 h-4 w-4 text-gray-500" />
                        <span>Broj kupaonica</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {[1, 2, 3, 4].map((num) => (
                          <Button
                            key={num}
                            variant="outline"
                            size="sm"
                            className={cn(
                              "rounded-full",
                              filters.bathrooms.includes(num) && "bg-rose-100 text-rose-600 border-rose-200",
                            )}
                            onClick={() => toggleBathroom(num)}
                          >
                            {num === 4 ? "4+" : num}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Year built */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="yearBuilt">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                        <span>Godina izgradnje</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <Slider
                          min={1950}
                          max={new Date().getFullYear()}
                          step={1}
                          value={filters.yearBuilt}
                          onValueChange={(value) =>
                            setFilters((prev) => ({ ...prev, yearBuilt: value as [number, number] }))
                          }
                          className="mb-6"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{filters.yearBuilt[0]}.</span>
                          <span>{filters.yearBuilt[1]}.</span>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="Od"
                            value={filters.yearBuilt[0]}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                yearBuilt: [Number.parseInt(e.target.value) || 1950, prev.yearBuilt[1]],
                              }))
                            }
                            className="w-1/2"
                          />
                          <Input
                            type="number"
                            placeholder="Do"
                            value={filters.yearBuilt[1]}
                            onChange={(e) =>
                              setFilters((prev) => ({
                                ...prev,
                                yearBuilt: [
                                  prev.yearBuilt[0],
                                  Number.parseInt(e.target.value) || new Date().getFullYear(),
                                ],
                              }))
                            }
                            className="w-1/2"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Amenities */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="amenities">
                    <AccordionTrigger className="text-sm font-medium">
                      <div className="flex items-center">
                        <CheckSquare className="mr-2 h-4 w-4 text-gray-500" />
                        <span>Dodatne karakteristike</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        {amenitiesList.map((amenity) => (
                          <div key={amenity.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`amenity-${amenity.id}`}
                              checked={filters.amenities.includes(amenity.id)}
                              onCheckedChange={() => toggleAmenity(amenity.id)}
                            />
                            <label
                              htmlFor={`amenity-${amenity.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {amenity.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Sort by */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Sortiraj po</h3>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sortiraj po" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <SheetFooter className="sm:justify-between gap-2">
                <Button variant="outline" onClick={resetFilters}>
                  Poništi filtere
                </Button>
                <SheetClose asChild>
                  <Button className="bg-rose-500 hover:bg-rose-600" onClick={handleSearch}>
                    Primijeni filtere
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Search button */}
          <Button className="bg-rose-500 hover:bg-rose-600" onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
            Pretraži
          </Button>
        </div>

        {/* Active filters display */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.query && (
              <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
                <span>Upit: {filters.query}</span>
                <button onClick={() => setFilters((prev) => ({ ...prev, query: "" }))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.location && (
              <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
                <span>Lokacija: {locations.find((l) => l.id === filters.location)?.name}</span>
                <button onClick={() => setFilters((prev) => ({ ...prev, location: "" }))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.propertyType !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
                <span>Tip: {propertyTypes.find((t) => t.id === filters.propertyType)?.name}</span>
                <button onClick={() => setFilters((prev) => ({ ...prev, propertyType: "all" }))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.listingType !== "all" && (
              <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
                <span>{filters.listingType === "sale" ? "Prodaja" : "Najam"}</span>
                <button onClick={() => setFilters((prev) => ({ ...prev, listingType: "all" }))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {(filters.priceRange[0] > defaultFilters.priceRange[0] ||
              filters.priceRange[1] < defaultFilters.priceRange[1]) && (
              <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
                <span>
                  Cijena: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                </span>
                <button onClick={() => setFilters((prev) => ({ ...prev, priceRange: defaultFilters.priceRange }))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {(filters.areaRange[0] > defaultFilters.areaRange[0] ||
              filters.areaRange[1] < defaultFilters.areaRange[1]) && (
              <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
                <span>
                  Površina: {filters.areaRange[0]} - {filters.areaRange[1]} m²
                </span>
                <button onClick={() => setFilters((prev) => ({ ...prev, areaRange: defaultFilters.areaRange }))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.bedrooms.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
                <span>Spavaće sobe: {filters.bedrooms.join(", ")}</span>
                <button onClick={() => setFilters((prev) => ({ ...prev, bedrooms: [] }))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.bathrooms.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
                <span>Kupaonice: {filters.bathrooms.join(", ")}</span>
                <button onClick={() => setFilters((prev) => ({ ...prev, bathrooms: [] }))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.amenities.length > 0 && (
              <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
                <span>Karakteristike: {filters.amenities.length}</span>
                <button onClick={() => setFilters((prev) => ({ ...prev, amenities: [] }))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {(filters.yearBuilt[0] > defaultFilters.yearBuilt[0] ||
              filters.yearBuilt[1] < defaultFilters.yearBuilt[1]) && (
              <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
                <span>
                  Godina: {filters.yearBuilt[0]} - {filters.yearBuilt[1]}
                </span>
                <button onClick={() => setFilters((prev) => ({ ...prev, yearBuilt: defaultFilters.yearBuilt }))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.sortBy !== "newest" && (
              <Badge variant="outline" className="flex items-center gap-1 bg-gray-50">
                <span>Sortirano: {sortOptions.find((o) => o.id === filters.sortBy)?.name}</span>
                <button onClick={() => setFilters((prev) => ({ ...prev, sortBy: "newest" }))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-500 hover:text-gray-700"
              onClick={resetFilters}
            >
              Poništi sve
            </Button>
          </div>
        )}

        {/* Save search and saved searches */}
        {isLoggedIn && (
          <div className="mt-4 flex justify-between items-center">
            <Popover open={isSaveSearchOpen} onOpenChange={setIsSaveSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <Save className="mr-2 h-3 w-3" />
                  Spremi pretragu
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Spremi trenutnu pretragu</h4>
                  <div className="space-y-2">
                    <label htmlFor="search-name" className="text-sm">
                      Naziv pretrage
                    </label>
                    <Input
                      id="search-name"
                      placeholder="npr. Stanovi u centru Zagreba"
                      value={saveSearchName}
                      onChange={(e) => setSaveSearchName(e.target.value)}
                    />
                  </div>
                  <Button className="w-full bg-rose-500 hover:bg-rose-600" onClick={saveSearch}>
                    Spremi pretragu
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {savedSearches.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Heart className="mr-2 h-3 w-3" />
                    Spremljene pretrage ({savedSearches.length})
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <h4 className="font-medium">Vaše spremljene pretrage</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {savedSearches.map((search) => (
                        <div
                          key={search.id}
                          className="p-2 hover:bg-gray-50 rounded cursor-pointer flex justify-between items-center"
                          onClick={() => loadSavedSearch(search)}
                        >
                          <div>
                            <div className="font-medium text-sm">{search.name}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(search.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            className="text-gray-400 hover:text-rose-500"
                            onClick={(e) => deleteSavedSearch(search.id, e)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
