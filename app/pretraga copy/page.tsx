"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  Menu,
  User,
  Users,
  Newspaper,
  Megaphone,
  ChevronRight,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Heart,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Grid,
  List,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  Map,
  Scale,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { AuthDialog } from "@/components/auth-dialog"
import { useRouter } from "next/navigation"
import { addToCompare, removeFromCompare } from "@/lib/compare-store"
import { toast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"


// At the top of the file, import the searchProperties action
import { searchProperties } from "@/app/actions/search-properties"

// Add this function to the top of the file, after the imports but before the component definition
// This will make the properties data available to other components
export const searchPageProperties = []

// This is the page component that will handle the URL parameters
// and pass them to the SearchResults component
export default function SearchPage() {
  const searchParams = useSearchParams()

  // Convert search parameters to the format expected by our server action
  const params = {
    location: searchParams.get("location") || "",
    propertyType: searchParams.get("property_type") || "",
    status: searchParams.get("status") || "",
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    minArea: searchParams.get("minArea") ? Number(searchParams.get("minArea")) : undefined,
    maxArea: searchParams.get("maxArea") ? Number(searchParams.get("maxArea")) : undefined,
    bedrooms: searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined,
    bathrooms: searchParams.get("bathrooms") ? Number(searchParams.get("bathrooms")) : undefined,
  }

  return (
    
      <SearchResultsWrapper params={params} searchParams={Object.fromEntries(searchParams.entries())} />
    
  )
}

function SearchResultsWrapper({
  params,
  searchParams,
}: {
  params: { [key: string]: any }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const [properties, setProperties] = useState<Property[]>([])
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    async function fetchProperties() {
      const { properties, error } = await searchProperties(params)
      setProperties(properties || [])
      setError(error)
    }
    fetchProperties()
  }, [params])

  return <SearchResults initialProperties={properties} searchParams={searchParams} error={error} />
}

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
  featured?: boolean
  new?: boolean
  dateAdded: string
  coordinates?: [number, number] // Latitude, Longitude
}

type FilterState = {
  priceRange: [number, number]
  areaRange: [number, number]
  bedrooms: number[]
  propertyTypes: string[]
  amenities: string[]
}

export function SearchResults({
  initialProperties,
  searchParams,
  error,
}: { initialProperties: Property[]; searchParams: { [key: string]: string | string[] | undefined }; error: any }) {
  // Change the viewMode state to include "split" and set it as default
  const [viewMode, setViewMode] = useState<"grid" | "list" | "split">("split")
  const [mapView, setMapView] = useState(false)
  const [sortOption, setSortOption] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [totalResults, setTotalResults] = useState(0)
  const [properties, setProperties] = useState<Property[]>(initialProperties)
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  // Add a new state to track which property pin is being hovered
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null)
  // Add a new state to track which properties are selected for comparison
  const [compareList, setCompareList] = useState<string[]>([])

  const itemsPerPage = 12

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000000],
    areaRange: [0, 500],
    bedrooms: [],
    propertyTypes: [],
    amenities: [],
  })

  // Apply filters and sorting
  useEffect(() => {
    if (properties.length === 0) return

    let results = [...properties]

    // Apply price filter
    results = results.filter(
      (property) => property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1],
    )

    // Apply area filter
    results = results.filter(
      (property) => property.area >= filters.areaRange[0] && property.area <= filters.areaRange[1],
    )

    // Apply bedrooms filter
    if (filters.bedrooms.length > 0) {
      results = results.filter((property) => filters.bedrooms.includes(property.bedrooms))
    }

    // Apply property type filter
    if (filters.propertyTypes.length > 0) {
      results = results.filter((property) => filters.propertyTypes.includes(property.type))
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (property) =>
          property.title.toLowerCase().includes(query) ||
          property.location.toLowerCase().includes(query) ||
          property.type.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    results = sortProperties(results, sortOption)

    setFilteredProperties(results)
    setTotalResults(results.length)
    setCurrentPage(1) // Reset to first page when filters change
  }, [filters, sortOption, searchQuery, properties])

  function sortProperties(props: Property[], option: string) {
    const sorted = [...props]

    switch (option) {
      case "price_asc":
        return sorted.sort((a, b) => a.price - b.price)
      case "price_desc":
        return sorted.sort((a, b) => b.price - a.price)
      case "area_asc":
        return sorted.sort((a, b) => a.area - b.area)
      case "area_desc":
        return sorted.sort((a, b) => b.area - a.area)
      case "newest":
        return sorted.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      case "oldest":
        return sorted.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime())
      default:
        return sorted
    }
  }

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

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)
  const currentResults = filteredProperties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleBedroom = (value: number) => {
    setFilters((prev) => {
      const newBedrooms = prev.bedrooms.includes(value)
        ? prev.bedrooms.filter((b) => b !== value)
        : [...prev.bedrooms, value]
      return { ...prev, bedrooms: newBedrooms }
    })
  }

  const togglePropertyType = (value: string) => {
    setFilters((prev) => {
      const newTypes = prev.propertyTypes.includes(value)
        ? prev.propertyTypes.filter((t) => t !== value)
        : [...prev.propertyTypes, value]
      return { ...prev, propertyTypes: newTypes }
    })
  }

  const toggleAmenity = (value: string) => {
    setFilters((prev) => {
      const newAmenities = prev.amenities.includes(value)
        ? prev.amenities.filter((a) => a !== value)
        : [...prev.amenities, value]
      return { ...prev, amenities: newAmenities }
    })
  }

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 1000000],
      areaRange: [0, 500],
      bedrooms: [],
      propertyTypes: [],
      amenities: [],
    })
    setSearchQuery("")
  }

  const router = useRouter()

  // Add a toggle function to add/remove properties from the comparison list
  // In the toggleCompare function, add console logs to track the property data
  const toggleCompare = (propertyId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Ensure propertyId is a string
    const id = String(propertyId).trim()

    // Find the property in our local data
    const property = properties.find((p) => p.id === id)
    if (!property) {
      console.error(`Property with ID ${id} not found!`)
      return
    }

    // Check if the property is already in the compare list
    const isAlreadyInCompare = compareList.includes(id)

    // If trying to add a new property and already have 2 selected, show error and return
    if (!isAlreadyInCompare && compareList.length >= 2) {
      toast({
        title: "Možete usporediti samo 2 nekretnine",
        description: "Uklonite jednu nekretninu prije dodavanja nove.",
        variant: "destructive",
      })
      return
    }

    // Update the compare list
    if (isAlreadyInCompare) {
      // Remove property from list
      setCompareList((prev) => prev.filter((prevId) => prevId !== id))
      removeFromCompare(id)
    } else {
      // Add property to list
      setCompareList((prev) => [...prev, id])
      addToCompare(property)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
        <div className="w-full px-3 sm:px-[21px] py-3 sm:py-4">
          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-between gap-2">
            <Link href="/" className="flex items-center text-black">
              <span className="text-xl sm:text-2xl font-bold">Pačonž</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Update the Button component to link to /dodaj-nekretninu */}
              <Button
                variant="ghost"
                size="sm"
                className="text-black hover:text-black/90 border border-black/20 text-xs sm:text-sm px-2 sm:px-4"
              >
                <Link href="/dodaj-nekretninu">Dodaj nekretninu</Link>
              </Button>

              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-black hover:text-black/90 border border-black/20 w-[42px] text-xs"
                  >
                    HR
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[42px] min-w-0 p-0">
                  <DropdownMenuItem className="justify-center">EN</DropdownMenuItem>
                  <DropdownMenuItem className="justify-center">DE</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Main Navigation Menu */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-black hover:text-black/90 border border-black/20 h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <Menu className="h-4 w-4 sm:h-6 sm:w-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[300px] sm:w-[350px] p-4">
                  <div className="grid gap-4">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium uppercase text-gray-500">PRONAĐI NEKRETNINU</h4>
                      <div className="grid gap-4">
                        <Button variant="ghost" className="flex w-full justify-start gap-2">
                          <div className="p-1.5 bg-orange-50 rounded-lg">
                            <Search className="h-4 w-4 text-orange-500" />
                          </div>
                          <div className="text-left">
                            <div>Prodaja</div>
                            <div className="text-sm text-gray-500"></div>
                          </div>
                        </Button>
                        <Button variant="ghost" className="flex w-full justify-start gap-2">
                          <div className="p-1.5 bg-orange-50 rounded-lg">
                            <Search className="h-4 w-4 text-orange-500" />
                          </div>
                          <div className="text-left">
                            <div>Najam</div>
                            <div className="text-sm text-gray-500"></div>
                          </div>
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium uppercase text-gray-500">OTKRIJ VIŠE</h4>
                      <div className="grid gap-4">
                        <Button variant="ghost" className="flex w-full justify-start gap-2">
                          <div className="p-1.5 bg-violet-50 rounded-lg">
                            <Users className="h-4 w-4 text-violet-500" />
                          </div>
                          <div className="text-left">
                            <div>Agenti za nekretnine</div>
                            <div className="text-sm text-gray-500"></div>
                          </div>
                        </Button>
                        <Button variant="ghost" className="flex w-full justify-start gap-2">
                          <div className="p-1.5 bg-violet-50 rounded-lg">
                            <Newspaper className="h-4 w-4 text-violet-500" />
                          </div>
                          <div className="text-left">
                            <div>Crozilla blog</div>
                            <div className="text-sm text-gray-500"></div>
                          </div>
                        </Button>
                        <Button variant="ghost" className="flex w-full justify-start gap-2">
                          <div className="p-1.5 bg-violet-50 rounded-lg">
                            <Megaphone className="h-4 w-4 text-violet-500" />
                          </div>
                          <div className="text-left">
                            <div>Oglašavanje</div>
                            <div className="text-sm text-gray-500"></div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* User Menu */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-black hover:text-black/90 border rounded-full border-black/20 h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <User className="h-4 w-4 sm:h-6 sm:w-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[300px] p-4">
                  <div className="space-y-4">
                    <div className="text-lg font-medium">Pozdrav!</div>
                    <AuthDialog />
                    <div className="text-sm text-gray-500">
                      Jeste li agent za nekretnine?
                      <Link href="#" className="block text-rose-400 hover:text-rose-500">
                        Prijava | Registracija
                      </Link>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </nav>
        </div>
      </header>

      <div className="flex-grow pt-20">
        <div className="w-full px-[21px]">
          {/* Search and filter bar - positioned right under the header */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 mb-4 sm:mb-6 sticky top-[60px] sm:top-[80px] z-30">
            <div className="flex flex-col gap-3">
              {/* 1. Search bar */}
              <div className="w-full">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Pretraži po lokaciji, tipu nekretnine..."
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

              <div className="flex flex-wrap items-center gap-2 w-full">
                {/* 2. Filters button */}
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("gap-1 px-3 py-1 h-9", filtersOpen && "bg-gray-100")}
                  onClick={() => setFiltersOpen(!filtersOpen)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filteri</span>
                </Button>

                {/* 3. Order by dropdown */}
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="h-9 text-sm w-[140px] sm:w-[180px] gap-1">
                    <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    <SelectValue placeholder="Sortiraj" />
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

                {/* 4-6. View toggle buttons */}
                <div className="flex gap-1">
                  {/* 4. Map view button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("h-9 w-9 p-0", viewMode === "split" && "bg-gray-100")}
                    onClick={() => {
                      setViewMode("split")
                      setMapView(false)
                    }}
                    title="Prikaz karte i nekretnina"
                  >
                    <Map className="h-4 w-4" />
                  </Button>

                  {/* 5. Grid view button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("h-9 w-9 p-0", viewMode === "grid" && !mapView && "bg-gray-100")}
                    onClick={() => {
                      setViewMode("grid")
                      setMapView(false)
                    }}
                    title="Prikaz mreže"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>

                  {/* 6. List view button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("h-9 w-9 p-0", viewMode === "list" && !mapView && "bg-gray-100")}
                    onClick={() => {
                      setViewMode("list")
                      setMapView(false)
                    }}
                    title="Prikaz liste"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full">
                {/* 7. "Spremi pretragu" button */}
                <Button variant="outline" size="sm" className="h-9 gap-1 flex-1">
                  <Heart className="h-4 w-4" />
                  <span>Spremi pretragu</span>
                </Button>

                {/* 8. "Usporedi" button - only show when there are items to compare */}
                <Button
                  className="bg-teal-500 hover:bg-teal-600 flex items-center gap-1 h-9 flex-1"
                  onClick={() => {
                    const url = `/usporedi?ids=${compareList.join(",")}`
                    console.log("Navigating to:", url)
                    router.push(url)
                  }}
                  disabled={compareList.length !== 2}
                  title={compareList.length !== 2 ? "Odaberite točno 2 nekretnine za usporedbu" : ""}
                  size="sm"
                >
                  <Scale className="h-4 w-4" />
                  <span>Usporedi ({compareList.length}/2)</span>
                </Button>
              </div>
            </div>

            {/* Expanded filters */}
            {filtersOpen && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Price range */}
                  <div>
                    <h3 className="font-medium mb-3">Cijena (€)</h3>
                    <div className="space-y-4">
                      <Slider
                        defaultValue={[0, 1000000]}
                        min={0}
                        max={1000000}
                        step={10000}
                        value={filters.priceRange}
                        onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                        className="mb-6"
                      />
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Od"
                          value={filters.priceRange[0]}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              priceRange: [Number.parseInt(e.target.value) || 0, filters.priceRange[1]],
                            })
                          }
                          className="w-1/2"
                        />
                        <Input
                          type="number"
                          placeholder="Do"
                          value={filters.priceRange[1]}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              priceRange: [filters.priceRange[0], Number.parseInt(e.target.value) || 1000000],
                            })
                          }
                          className="w-1/2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Area range */}
                  <div>
                    <h3 className="font-medium mb-3">Površina (m²)</h3>
                    <div className="space-y-4">
                      <Slider
                        defaultValue={[0, 500]}
                        min={0}
                        max={500}
                        step={5}
                        value={filters.areaRange}
                        onValueChange={(value) => setFilters({ ...filters, areaRange: value as [number, number] })}
                        className="mb-6"
                      />
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Od"
                          value={filters.areaRange[0]}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              areaRange: [Number.parseInt(e.target.value) || 0, filters.areaRange[1]],
                            })
                          }
                          className="w-1/2"
                        />
                        <Input
                          type="number"
                          placeholder="Do"
                          value={filters.areaRange[1]}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              areaRange: [filters.areaRange[0], Number.parseInt(e.target.value) || 500],
                            })
                          }
                          className="w-1/2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bedrooms */}
                  <div>
                    <h3 className="font-medium mb-3">Broj spavaćih soba</h3>
                    <div className="flex flex-wrap gap-2">
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
                  </div>

                  {/* Property type */}
                  <div>
                    <h3 className="font-medium mb-3">Tip nekretnine</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["Stan", "Kuća", "Vila", "Apartman", "Penthouse", "Studio"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={filters.propertyTypes.includes(type)}
                            onCheckedChange={() => togglePropertyType(type)}
                          />
                          <label
                            htmlFor={`type-${type}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional filters */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="font-medium mb-3">Dodatne karakteristike</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {[
                      "Balkon",
                      "Terasa",
                      "Vrt",
                      "Bazen",
                      "Garaža",
                      "Parking",
                      "Lift",
                      "Klima",
                      "Namješteno",
                      "Novogradnja",
                      "Pogled na more",
                      "Blizina plaže",
                    ].map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={filters.amenities.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <label
                          htmlFor={`amenity-${amenity}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filter actions */}
                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="outline" onClick={resetFilters}>
                    Poništi filtere
                  </Button>
                  <Button className="bg-rose-400 hover:bg-rose-500">Primijeni filtere</Button>
                </div>
              </div>
            )}
          </div>

          {/* Results count and save search */}
          <div className="flex justify-between items-center mb-6">
            <div className="w-1/2">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Rezultati pretrage</h1>
              <p className="text-gray-600">
                {isLoading ? "Učitavanje..." : `${totalResults} ${totalResults === 1 ? "nekretnina" : "nekretnina"}`}
              </p>
            </div>
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : totalResults === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Nema rezultata</h2>
              <p className="text-gray-600 mb-6">
                Nažalost, nema nekretnina koje odgovaraju vašim kriterijima pretrage.
              </p>
              <Button onClick={resetFilters} className="bg-rose-400 hover:bg-rose-500">
                Poništi filtere
              </Button>
            </div>
          ) : (
            <>
              {/* Property grid or map view */}
              {mapView ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-[600px]">
                    {/* Real Map - INLINE IMPLEMENTATION */}
                    <div className="h-full w-full relative bg-gray-100">
                      {/* Mock map background */}
                      <div className="absolute inset-0 bg-[#e8e8e8]">
                        <div className="h-full w-full relative">
                          {/* City name */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-300 text-4xl font-bold">
                            ZAGREB
                          </div>

                          {/* Mock streets */}
                          <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-300"></div>
                          <div className="absolute top-2/4 left-0 right-0 h-px bg-gray-300"></div>
                          <div className="absolute top-3/4 left-0 right-0 h-px bg-gray-300"></div>
                          <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gray-300"></div>
                          <div className="absolute left-2/4 top-0 bottom-0 w-px bg-gray-300"></div>
                          <div className="absolute left-3/4 top-0 bottom-0 w-px bg-gray-300"></div>

                          {/* Property markers */}
                          {currentResults.slice(0, 8).map((property, index) => {
                            // Generate a deterministic position based on property id
                            const idSum = property.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
                            const top = `${20 + (idSum % 60)}%`
                            const left = `${20 + ((idSum * 13) % 60)}%`

                            return (
                              <div
                                key={property.id}
                                className={`absolute ${
                                  hoveredProperty === property.id
                                    ? "w-8 h-8 bg-rose-600 shadow-lg z-20"
                                    : "w-6 h-6 bg-rose-500"
                                } rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-rose-600 transition-all duration-200`}
                                style={{
                                  top,
                                  left,
                                  zIndex: hoveredProperty === property.id ? 20 : 10,
                                }}
                                onMouseEnter={() => setHoveredProperty(property.id)}
                                onMouseLeave={() => setHoveredProperty(null)}
                                onClick={() => router.push(`/nekretnine/${property.id}`)}
                              >
                                {index + 1}

                                {/* Property card that appears on hover */}
                                {hoveredProperty === property.id && (
                                  <div
                                    className="absolute left-8 top-0 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-20"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="relative h-32 w-full">
                                      <Image
                                        src={property.images[0] || "/placeholder.svg"}
                                        alt={property.title}
                                        fill
                                        className="object-cover"
                                      />
                                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                        <div className="text-white font-bold text-sm">
                                          {formatPrice(property.price)}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="p-3">
                                      <h4 className="font-medium text-sm line-clamp-1">{property.title}</h4>
                                      <div className="flex items-start gap-1 text-gray-500 text-xs mb-1">
                                        <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                                        <span className="line-clamp-1">{property.location}</span>
                                      </div>
                                      <div className="flex items-center gap-3 text-xs text-gray-600">
                                        {property.bedrooms > 0 && (
                                          <div className="flex items-center gap-1">
                                            <Bed className="h-3 w-3 text-gray-400" />
                                            <span>{property.bedrooms}</span>
                                          </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                          <Bath className="h-3 w-3 text-gray-400" />
                                          <span>{property.bathrooms}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Maximize className="h-3 w-3 text-gray-400" />
                                          <span>{property.area} m²</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Map attribution */}
                      <div className="absolute bottom-2 right-2 text-xs text-gray-500">© Pačonž Maps</div>
                    </div>

                    {/* Property list sidebar */}
                    <div className="absolute top-4 right-4 bottom-4 w-80 bg-white rounded-lg shadow-lg overflow-y-auto p-4">
                      <h3 className="font-medium mb-4">Prikazane nekretnine ({totalResults})</h3>
                      <div className="space-y-4">
                        {currentResults.slice(0, 8).map((property, index) => (
                          <Link href={`/nekretnine/${property.id}`} key={property.id} className="block group">
                            <div className="flex gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                              <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                                <Image
                                  src={property.images[0] || "/placeholder.svg"}
                                  alt={property.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate group-hover:text-rose-500 transition-colors">
                                  {property.title}
                                </p>
                                <p className="text-xs text-gray-500 mb-1">{property.location}</p>
                                <p className="text-rose-500 font-semibold">{formatPrice(property.price)}</p>
                              </div>
                              <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs font-bold">
                                {index + 1}
                              </div>
                            </div>
                          </Link>
                        ))}
                        {totalResults > 8 && (
                          <Button variant="outline" className="w-full text-sm" onClick={() => setMapView(false)}>
                            Prikaži sve rezultate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : viewMode === "split" ? (
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Property list on the left */}
                  <div className="lg:w-1/2 space-y-6">
                    {currentResults.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        viewMode="list"
                        getActiveImageIndex={getActiveImageIndex}
                        prevImage={prevImage}
                        nextImage={nextImage}
                        formatPrice={formatPrice}
                        compareList={compareList}
                        toggleCompare={toggleCompare}
                      />
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-6 flex justify-center">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Show first page, last page, current page, and pages around current page
                            if (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                              return (
                                <Button
                                  key={page}
                                  variant={currentPage === page ? "default" : "outline"}
                                  className={cn(
                                    "min-w-[40px]",
                                    currentPage === page && "bg-rose-400 hover:bg-rose-500",
                                  )}
                                  onClick={() => handlePageChange(page)}
                                >
                                  {page}
                                </Button>
                              )
                            }
                            // Show ellipsis for skipped pages
                            if (
                              (page === 2 && currentPage > 3) ||
                              (page === totalPages - 1 && currentPage < totalPages - 2)
                            ) {
                              return (
                                <Button key={page} variant="outline" disabled className="min-w-[40px]">
                                  ...
                                </Button>
                              )
                            }
                            return null
                          })}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Map on the right - INLINE IMPLEMENTATION */}
                  <div className="lg:w-1/2 bg-white rounded-lg shadow-md overflow-hidden sticky top-[165px] h-[calc(100vh-180px)] -mt-[95px]">
                    <div className="h-full w-full relative bg-gray-100">
                      {/* Mock map background */}
                      <div className="absolute inset-0 bg-[#e8e8e8]">
                        <div className="h-full w-full relative">
                          {/* City name */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-300 text-4xl font-bold">
                            ZAGREB
                          </div>

                          {/* Mock streets */}
                          <div className="absolute top-1/4 left-0 right-0 h-px bg-gray-300"></div>
                          <div className="absolute top-2/4 left-0 right-0 h-px bg-gray-300"></div>
                          <div className="absolute top-3/4 left-0 right-0 h-px bg-gray-300"></div>
                          <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gray-300"></div>
                          <div className="absolute left-2/4 top-0 bottom-0 w-px bg-gray-300"></div>
                          <div className="absolute left-3/4 top-0 bottom-0 w-px bg-gray-300"></div>

                          {/* Property markers */}
                          {currentResults.map((property, index) => {
                            // Generate a deterministic position based on property id
                            const idSum = property.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
                            const top = `${20 + (idSum % 60)}%`
                            const left = `${20 + ((idSum * 13) % 60)}%`

                            return (
                              <div
                                key={property.id}
                                className={`absolute ${
                                  hoveredProperty === property.id
                                    ? "w-8 h-8 bg-rose-600 shadow-lg z-20"
                                    : "w-6 h-6 bg-rose-500"
                                } rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-rose-600 transition-all duration-200`}
                                style={{
                                  top,
                                  left,
                                  zIndex: hoveredProperty === property.id ? 20 : 10,
                                }}
                                onMouseEnter={() => setHoveredProperty(property.id)}
                                onMouseLeave={() => setHoveredProperty(null)}
                                onClick={() => router.push(`/nekretnine/${property.id}`)}
                              >
                                {index + 1}

                                {/* Property card that appears on hover */}
                                {hoveredProperty === property.id && (
                                  <div
                                    className="absolute left-8 top-0 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-20"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="relative h-32 w-full">
                                      <Image
                                        src={property.images[0] || "/placeholder.svg"}
                                        alt={property.title}
                                        fill
                                        className="object-cover"
                                      />
                                      {/* Property badges - placed next to each other */}
                                      <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                                        {property.featured && (
                                          <div className="bg-rose-400 text-white text-xs font-semibold px-2 py-1 rounded">
                                            IZDVOJENO
                                          </div>
                                        )}
                                        {property.new && (
                                          <div className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                            NOVO
                                          </div>
                                        )}
                                      </div>
                                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                        <div className="text-white font-bold text-sm">
                                          {formatPrice(property.price)}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="p-3">
                                      <h4 className="font-medium text-sm line-clamp-1">{property.title}</h4>
                                      <div className="flex items-start gap-1 text-gray-500 text-xs mb-1">
                                        <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                                        <span className="line-clamp-1">{property.location}</span>
                                      </div>
                                      <div className="flex items-center gap-3 text-xs text-gray-600">
                                        {property.bedrooms > 0 && (
                                          <div className="flex items-center gap-1">
                                            <Bed className="h-3 w-3 text-gray-400" />
                                            <span>{property.bedrooms}</span>
                                          </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                          <Bath className="h-3 w-3 text-gray-400" />
                                          <span>{property.bathrooms}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Maximize className="h-3 w-3 text-gray-400" />
                                          <span>{property.area} m²</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Map attribution */}
                      <div className="absolute bottom-2 right-2 text-xs text-gray-500">© Pačonž Maps</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-6",
                  )}
                >
                  {currentResults.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      viewMode={viewMode}
                      getActiveImageIndex={getActiveImageIndex}
                      prevImage={prevImage}
                      nextImage={nextImage}
                      formatPrice={formatPrice}
                      compareList={compareList}
                      toggleCompare={toggleCompare}
                    />
                  ))}
                </div>
              )}
              {/* If not in split view, show pagination after the property grid */}
              {viewMode !== "split" && totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current page
                      if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            className={cn("min-w-[40px]", currentPage === page && "bg-rose-400 hover:bg-rose-500")}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        )
                      }
                      // Show ellipsis for skipped pages
                      if (
                        (page === 2 && currentPage > 3) ||
                        (page === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <Button key={page} variant="outline" disabled className="min-w-[40px]">
                            ...
                          </Button>
                        )
                      }
                      return null
                    })}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="w-full px-[21px] py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Column 1: About & Contact */}
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold">Pačonž</span>
              </div>
              <p className="text-gray-400 text-sm">
                Vodeći portal za nekretnine u Hrvatskoj. Pronađite svoj savršeni dom ili poslovni prostor uz našu pomoć.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-rose-400" />
                  <span>+385 1 123 4567</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-rose-400" />
                  <span>info@example.hr</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-rose-400" />
                  <span>Ilica 345, 10000 Zagreb</span>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Brzi linkovi</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                    Prodaja nekretnina
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                    Najam nekretnina
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                    Novogradnja
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                    Poslovni prostori
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                    Agencije za nekretnine
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                    Pačonž blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                    Oglašavanje
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Popular Locations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Popularne lokacije</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                    Zagreb
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                    Split
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                    Rijeka
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                    Osijek
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                    Zadar
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                    Dubrovnik
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                    Pula
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pretplatite se na newsletter</h3>
              <p className="text-gray-400 text-sm">
                Primajte najnovije ponude nekretnina i savjete direktno u svoj inbox.
              </p>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Vaša email adresa"
                  className="rounded-r-none bg-gray-800 border-gray-700 text-white focus:ring-rose-400 focus:border-rose-400"
                />
                <Button className="rounded-l-none bg-rose-400 hover:bg-rose-500">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom section with legal links */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-500 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} Pačonž. Sva prava pridržana.
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                  Uvjeti korištenja
                </a>
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                  Pravila privatnosti
                </a>
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                  Kolačići
                </a>
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                  O nama
                </a>
                <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                  Kontakt
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Update the PropertyCard component props to include compareList and toggleCompare
function PropertyCard({
  property,
  viewMode,
  getActiveImageIndex,
  prevImage,
  nextImage,
  formatPrice,
  compareList,
  toggleCompare,
}: {
  property: Property
  viewMode: "grid" | "list"
  getActiveImageIndex: (id: string) => number
  prevImage: (id: string, total: number, e: React.MouseEvent) => void
  nextImage: (id: string, total: number, e: React.MouseEvent) => void
  formatPrice: (price: number) => string
  compareList: string[]
  toggleCompare: (propertyId: string, e: React.MouseEvent) => void
}) {
  // Check if this property is in the compare list
  const isInCompare = compareList.includes(property.id)

  // Check if compare is disabled (when 2 properties are selected and this one isn't one of them)
  const isCompareDisabled = compareList.length >= 2 && !isInCompare

  // Function to handle compare button click
  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Only proceed if not disabled
    if (!isCompareDisabled) {
      toggleCompare(property.id, e)
    }
  }

  if (viewMode === "grid") {
    return (
      <Link href={`/nekretnine/${property.id}`} className="block group">
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
          <div className="relative h-40 sm:h-48">
            {/* Image slider */}
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

              {/* Navigation arrows */}
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

            {/* Property badges - placed in a column */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
              {property.featured && (
                <div className="bg-rose-400 text-white text-xs font-semibold px-2 py-0.5 rounded">IZDVOJENO</div>
              )}
              {property.new && (
                <div className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded">NOVO</div>
              )}
            </div>
            <div className="absolute top-2 right-2 z-10 flex gap-1">
              <button
                className="bg-white/80 hover:bg-white text-gray-600 hover:text-rose-500 rounded-full p-1.5 transition-colors"
                aria-label="Dodaj u favorite"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart className="h-3.5 w-3.5" />
              </button>
              <button
                className={cn(
                  "bg-white/80 rounded-full p-1.5 flex items-center gap-1 transition-colors",
                  isInCompare
                    ? "text-teal-500 hover:text-teal-600"
                    : isCompareDisabled
                      ? "text-gray-400 opacity-50 pointer-events-none"
                      : "text-gray-600 hover:text-gray-700",
                )}
                aria-label={isInCompare ? "Ukloni iz usporedbe" : "Dodaj u usporedbu"}
                onClick={handleCompareClick}
                disabled={isCompareDisabled}
                title={isCompareDisabled ? "Možete usporediti samo 2 nekretnine" : ""}
              >
                <Scale className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 z-10">
              <div className="text-white font-bold text-lg sm:text-xl">{formatPrice(property.price)}</div>
            </div>
          </div>

          <div className="p-3">
            <div className="flex items-start gap-1 text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 mt-0.5" />
              <span className="truncate">{property.location}</span>
            </div>
            <h3 className="font-semibold text-sm sm:text-lg mb-2 group-hover:text-rose-500 transition-colors line-clamp-2">
              {property.title}
            </h3>
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2 sm:gap-4">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-1">
                    <Bed className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Bath className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <span>{property.bathrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Maximize className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <span>{property.area} m²</span>
                </div>
              </div>
              <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded-full">{property.type}</span>
            </div>
          </div>
        </div>
      </Link>
    )
  } else {
    // List view
    return (
      <Link href={`/nekretnine/${property.id}`} className="block group">
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row">
            <div className="relative w-full sm:w-1/3 h-40 sm:h-48">
              {/* Image slider */}
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

                {/* Navigation arrows */}
                <button
                  onClick={(e) => prevImage(property.id, property.images.length, e)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-colors z-10"
                  aria-label="Prethodna slika"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Navigation arrows */}
                <button
                  onClick={(e) => nextImage(property.id, property.images.length, e)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-colors z-10"
                  aria-label="Sljedeća slika"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Property badges - placed in a column */}
              <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                {property.featured && (
                  <div className="bg-rose-400 text-white text-xs font-semibold px-2 py-0.5 rounded">IZDVOJENO</div>
                )}
                {property.new && (
                  <div className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded">NOVO</div>
                )}
              </div>
              <div className="absolute top-2 right-2 z-10 flex gap-1">
                <button
                  className="bg-white/80 hover:bg-white text-gray-600 hover:text-rose-500 rounded-full p-1.5 transition-colors"
                  aria-label="Dodaj u favorite"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart className="h-3.5 w-3.5" />
                </button>
                <button
                  className={cn(
                    "bg-white/80 rounded-full p-1.5 flex items-center gap-1 transition-colors",
                    isInCompare
                      ? "text-teal-500 hover:text-teal-600"
                      : isCompareDisabled
                        ? "text-gray-400 opacity-50 pointer-events-none"
                        : "text-gray-600 hover:text-gray-700",
                  )}
                  aria-label={isInCompare ? "Ukloni iz usporedbe" : "Dodaj u usporedbu"}
                  onClick={handleCompareClick}
                  disabled={isCompareDisabled}
                  title={isCompareDisabled ? "Možete usporediti samo 2 nekretnine" : ""}
                >
                  <Scale className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 z-10">
                <div className="text-white font-bold text-lg">{formatPrice(property.price)}</div>
              </div>
            </div>

            <div className="p-3 sm:p-4 flex-1 flex flex-col">
              <div className="flex items-start gap-1 text-gray-500 text-xs sm:text-sm mb-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 mt-0.5" />
                <span className="truncate">{property.location}</span>
              </div>
              <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2 group-hover:text-rose-500 transition-colors line-clamp-2">
                {property.title}
              </h3>

              <div className="flex items-center gap-3 mb-2 sm:mb-4 flex-wrap">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                    <Bed className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                  <Bath className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <span>{property.bathrooms}</span>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                  <Maximize className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <span>{property.area} m²</span>
                </div>
                <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded-full">{property.type}</span>
              </div>

              <div className="mt-auto flex justify-between items-center">
                <div className="text-rose-500 font-bold text-base sm:text-xl">{formatPrice(property.price)}</div>
                <div className="text-xs text-gray-500 hidden sm:block">
                  Dodano: {new Date(property.dateAdded).toLocaleDateString("hr-HR")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }
}
