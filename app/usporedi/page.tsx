"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Share2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAllCompareProperties } from "@/lib/compare-store"
import PropertySummaryCard from "@/components/property-summary-card"
import ComparisonTabs from "@/components/comparison-tabs"
import KeyDifferences from "@/components/key-differences"

interface Property {
  id: string
  title?: string
  name?: string
  price: number
  currency?: string
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  square_meters?: number
  type?: string
  property_type?: string
  images: string[]
  description?: string
  features?: string[]
  year_built?: number
  heating?: string
  parking?: number
  floor?: number
  total_floors?: number
  energy_certificate?: string
  dateAdded?: string
}

export default function ComparePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const formatPrice = useCallback((price: number, currency?: string) => {
    return new Intl.NumberFormat("hr-HR", {
      style: "currency",
      currency: currency || "EUR",
      maximumFractionDigits: 0,
    }).format(price)
  }, [])

  // Extract the IDs string once
  const idsString = searchParams.get("ids") || ""

  // Use a ref to track if we've already processed these IDs
  const processedIdsRef = useRef<string>("")

  // Ref for the sticky header
  const stickyHeaderRef = useRef<HTMLDivElement>(null)

  // Optimize the scroll handler with a throttle function
  const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean
    return function (this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  useEffect(() => {
    // Only process if the IDs have changed
    if (idsString === processedIdsRef.current) {
      return
    }

    // Update the ref to mark these IDs as processed
    processedIdsRef.current = idsString

    // Set loading state
    setLoading(true)
    setError(null)

    // Process the IDs
    if (!idsString) {
      console.log("No IDs parameter found")
      setLoading(false)
      setProperties([])
      router.push("/pretraga")
      return
    }

    try {
      // Split the IDs and ensure they're properly formatted
      const ids = idsString
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
      console.log("Parsed IDs for comparison:", ids)

      // Ensure exactly 2 properties are selected
      if (ids.length !== 2) {
        console.log("Exactly 2 properties must be selected for comparison")
        router.push("/pretraga")
        return
      }

      // Get all properties from the compare store first
      const allStoreProperties = getAllCompareProperties()
      console.log("All properties in compare store:", allStoreProperties.length)

      if (allStoreProperties.length === 0) {
        setError(
          "Nije moguće dohvatiti podatke o nekretninama. Molimo vratite se na pretragu i ponovno odaberite nekretnine za usporedbu.",
        )
        setLoading(false)
        return
      }

      // Filter to only the ones we need, ensuring string comparison
      const filteredProperties = allStoreProperties.filter((p) => ids.includes(String(p.id).trim()))
      console.log("Filtered properties from store:", filteredProperties.length)

      if (filteredProperties.length === 2) {
        setProperties(filteredProperties)
        setLoading(false)
      } else {
        setError(
          "Nije moguće dohvatiti podatke o nekretninama. Molimo vratite se na pretragu i ponovno odaberite nekretnine za usporedbu.",
        )
        // Don't redirect immediately, let the user see the error
        setTimeout(() => {
          router.push("/pretraga")
        }, 3000)
      }
    } catch (error) {
      console.error("Error processing properties for comparison:", error)
      setError("Došlo je do greške prilikom dohvaćanja podataka.")
      setProperties([])
      setLoading(false)
      // Don't redirect immediately, let the user see the error
      setTimeout(() => {
        router.push("/pretraga")
      }, 3000)
    }
  }, [idsString, router])

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (stickyHeaderRef.current) {
        if (window.scrollY > 200) {
          stickyHeaderRef.current.classList.add("translate-y-0")
          stickyHeaderRef.current.classList.remove("-translate-y-full")
        } else {
          stickyHeaderRef.current.classList.add("-translate-y-full")
          stickyHeaderRef.current.classList.remove("translate-y-0")
        }
      }
    }, 100)

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const removeProperty = (id: string) => {
    // If removing a property, redirect back to search
    // since we need exactly 2 properties
    router.push("/pretraga")
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 border-opacity-80"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Usporedba nekretnina</h1>
          <p className="mb-6 text-red-500">{error}</p>
          <Button asChild>
            <Link href="/pretraga" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Povratak na pretragu
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (properties.length !== 2) {
    router.push("/pretraga")
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Usporedba nekretnina</h1>
          <p className="mb-6">Za usporedbu su potrebne točno 2 nekretnine.</p>
          <Button asChild>
            <Link href="/pretraga" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Povratak na pretragu
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Sticky header that appears on scroll */}
      <div
        ref={stickyHeaderRef}
        className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 transform -translate-y-full transition-transform duration-500 backdrop-blur-sm bg-white/95"
      >
        <div className="container mx-auto py-3 px-4">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild className="h-8">
                <Link href="/pretraga">
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Natrag
                </Link>
              </Button>
              <h2 className="text-sm font-medium hidden sm:block">Usporedba nekretnina</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-3">
            {properties.map((property) => (
              <PropertySummaryCard
                key={property.id}
                property={property}
                formatPrice={formatPrice}
                onRemove={removeProperty}
                showRemoveButton={false}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-10 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Usporedba nekretnina</h1>
            <p className="text-gray-500">
              Uspoređujete {properties.length}{" "}
              {properties.length === 1 ? "nekretninu" : properties.length < 5 ? "nekretnine" : "nekretnina"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/pretraga" className="flex items-center gap-2 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Povratak na pretragu
              </Link>
            </Button>
            <Button variant="outline" className="flex items-center gap-2 transition-colors hover:bg-gray-100">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Podijeli</span>
            </Button>
          </div>
        </div>

        {/* Property Cards at the top */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-8 mb-6 sm:mb-10">
          {properties.map((property) => (
            <div
              className="relative group transition-all duration-300 hover:shadow-md rounded-lg p-2 sm:p-3 -m-2 sm:-m-3"
              key={property.id}
            >
              <div className="relative h-40 sm:h-64 rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-lg">
                <Image
                  src={property.images[0] || "/placeholder.svg"}
                  alt={property.title || property.name || "Nekretnina"}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => removeProperty(property.id)}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-600 hover:text-rose-500 rounded-full p-1.5 transition-colors z-10 shadow-sm"
                  aria-label="Ukloni iz usporedbe"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4 transition-opacity duration-300">
                  <div className="text-white font-bold text-lg sm:text-xl">
                    {formatPrice(property.price, property.currency)}
                  </div>
                </div>
              </div>

              <h3 className="font-semibold text-base sm:text-lg mt-2 sm:mt-3 mb-1 group-hover:text-rose-500 transition-colors line-clamp-1">
                <Link href={`/nekretnine/${property.id}`} className="hover:text-rose-500 transition-colors">
                  {property.title || property.name || "Nekretnina"}
                </Link>
              </h3>

              <div className="flex items-start gap-1 text-gray-500 text-xs sm:text-sm mb-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{property.location}</span>
              </div>

              <div className="flex gap-2 mt-2 sm:mt-3">
                <Button asChild className="w-full bg-rose-500 hover:bg-rose-600 text-sm sm:text-base py-1.5 sm:py-2">
                  <Link href={`/nekretnine/${property.id}`}>Pogledaj detalje</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Key Differences Section */}
        {properties.length > 1 && <KeyDifferences properties={properties} formatPrice={formatPrice} className="mb-6" />}

        {/* Tabbed Comparison Interface */}
        <ComparisonTabs properties={properties} formatPrice={formatPrice} />

        {/* Floating CTA for mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-40 shadow-lg backdrop-blur-sm bg-white/95">
          <div className="flex gap-2">
            <Button asChild className="flex-1 bg-rose-500 hover:bg-rose-600 py-3">
              <Link href="/pretraga" className="flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Povratak na pretragu
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
