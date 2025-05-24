"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Bed, Bath, Maximize, MapPin, Heart, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Import the toast and compare store functions at the top of the file
import { toast } from "@/hooks/use-toast"
import { addToCompare, removeFromCompare, getAllCompareProperties } from "@/lib/compare-store"
import { useRouter } from "next/navigation"

type Property = {
  id: string
  title: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  type: string
  property_type?: string
  images: string[]
  featured?: boolean
  new?: boolean
}

interface FeaturedPropertiesProps {
  properties: Property[]
}

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
  // Track active image index for each property
  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({})
  // Reference to the slider container
  const [compareList, setCompareList] = useState<string[]>([])
  const sliderRef = useRef<HTMLDivElement>(null)
  // Track current scroll position
  const [scrollPosition, setScrollPosition] = useState(0)
  // Track if we can scroll left/right
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Initialize compareList from the store on component mount
  useEffect(() => {
    const storeProperties = getAllCompareProperties()
    setCompareList(storeProperties.map((p) => String(p.id).trim()))
  }, [])

  // Check if we can scroll left/right
  useEffect(() => {
    const checkScroll = () => {
      if (!sliderRef.current) return

      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      setScrollPosition(scrollLeft)
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
    }

    const slider = sliderRef.current
    if (slider) {
      slider.addEventListener("scroll", checkScroll)
      // Initial check
      checkScroll()

      return () => {
        slider.removeEventListener("scroll", checkScroll)
      }
    }
  }, [])

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

  const setActiveImage = (propertyId: string, index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveImageIndices((prev) => ({
      ...prev,
      [propertyId]: index,
    }))
  }

  // Get the current active image index for a property, defaulting to 0
  const getActiveImageIndex = (propertyId: string) => {
    return activeImageIndices[propertyId] || 0
  }

  // Scroll the slider left
  const scrollLeft = () => {
    if (!sliderRef.current) return

    const cardWidth = sliderRef.current.querySelector("div")?.offsetWidth || 300
    const scrollAmount = Math.max(cardWidth, 300)

    sliderRef.current.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    })
  }

  // Scroll the slider right
  const scrollRight = () => {
    if (!sliderRef.current) return

    const cardWidth = sliderRef.current.querySelector("div")?.offsetWidth || 300
    const scrollAmount = Math.max(cardWidth, 300)

    sliderRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    })
  }

  // Add the router for navigation to the compare page
  const router = useRouter()

  // Update the toggleCompare function to match the behavior in the search page
  const toggleCompare = (propertyId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Ensure propertyId is a string
    const id = String(propertyId).trim()

    // Find the property in our local data
    const property = properties.find((p) => String(p.id).trim() === id)
    if (!property) {
      toast({
        title: "Greška pri usporedbi",
        description: `Nekretnina nije pronađena. Molimo osvježite stranicu.`,
        variant: "destructive",
      })
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
      // Ensure we're adding the complete property object to the store
      const propertyToAdd = {
        id: property.id,
        title: property.title,
        price: property.price,
        location: property.location,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        type: property.type || property.property_type || "Nekretnina",
        property_type: property.property_type || property.type || "Nekretnina",
        images: property.images || [],
        featured: property.featured || false,
        new: property.new || false,
        dateAdded: new Date().toISOString(),
      }
      addToCompare(propertyToAdd)
    }
  }

  // Function to handle the compare button click
  const handleCompareClick = () => {
    if (compareList.length !== 2) {
      toast({
        title: "Potrebne su točno 2 nekretnine",
        description: "Odaberite točno 2 nekretnine za usporedbu.",
        variant: "destructive",
      })
      return
    }

    // Log for debugging
    console.log("Navigating to compare page with IDs:", compareList)

    // Navigate to the compare page with the selected property IDs
    router.push(`/usporedi?ids=${compareList.join(",")}`)
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Izdvojene nekretnine</h2>
            <p className="text-gray-600 mt-2">Pogledajte našu selekciju najboljih nekretnina</p>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-teal-500 hover:bg-teal-600 shadow-lg flex items-center gap-2"
              onClick={handleCompareClick}
              disabled={compareList.length !== 2}
              title={compareList.length !== 2 ? "Odaberite točno 2 nekretnine za usporedbu" : ""}
            >
              <Scale className="h-4 w-4" />
              <span>Usporedi ({compareList.length}/2)</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className="rounded-full"
              aria-label="Prethodne nekretnine"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollRight}
              disabled={!canScrollRight}
              className="rounded-full"
              aria-label="Sljedeće nekretnine"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Horizontal scrollable container */}
        <div
          ref={sliderRef}
          className="flex overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {properties.map((property) => (
            <div
              key={property.id}
              className="flex-none w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-16px)] mx-2 snap-start"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 group h-full">
                <div className="relative h-48 sm:h-64">
                  {/* Image slider */}
                  <div className="relative w-full h-full overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      property.images.map((image, index) => (
                        <div
                          key={index}
                          className={cn(
                            "absolute inset-0 transition-opacity duration-300",
                            getActiveImageIndex(property.id) === index ? "opacity-100" : "opacity-0",
                          )}
                        >
                          <Image
                            src={
                              image ||
                              `/placeholder.png?height=400&width=600&text=${encodeURIComponent(property.title)}`
                            }
                            alt={`${property.title} - slika ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <Image
                        src={`/placeholder.png?key=vjmhu&height=400&width=600&text=${encodeURIComponent(property.title)}`}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    )}

                    {/* Navigation arrows - only show if there are multiple images */}
                    {property.images && property.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => prevImage(property.id, property.images.length, e)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-colors z-10"
                          aria-label="Prethodna slika"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>

                        <button
                          onClick={(e) => nextImage(property.id, property.images.length, e)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-colors z-10"
                          aria-label="Sljedeća slika"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>

                        {/* Image indicators */}
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
                          {property.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => setActiveImage(property.id, index, e)}
                              className={cn(
                                "w-2 h-2 rounded-full transition-colors",
                                getActiveImageIndex(property.id) === index
                                  ? "bg-white"
                                  : "bg-white/50 hover:bg-white/80",
                              )}
                              aria-label={`Slika ${index + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Property badges - placed next to each other */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    {property.featured && (
                      <div className="bg-rose-400 text-white text-xs font-semibold px-2 py-1 rounded">IZDVOJENO</div>
                    )}
                    {property.new && (
                      <div className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">NOVO</div>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 z-10 flex gap-2">
                    <button
                      className="bg-white/80 hover:bg-white text-gray-600 hover:text-rose-500 rounded-full p-1.5 transition-colors"
                      aria-label="Dodaj u favorite"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <button
                      className={cn(
                        "bg-white/80 rounded-full p-1.5 flex items-center gap-1 transition-colors",
                        compareList.includes(String(property.id).trim())
                          ? "text-teal-500 hover:text-teal-600"
                          : compareList.length >= 2
                            ? "text-gray-400 opacity-50 pointer-events-none"
                            : "text-gray-600 hover:text-gray-700", // Changed hover color to ensure it stays gray
                      )}
                      aria-label={
                        compareList.includes(String(property.id).trim()) ? "Ukloni iz usporedbe" : "Dodaj u usporedbu"
                      }
                      onClick={(e) => toggleCompare(property.id, e)}
                      disabled={compareList.length >= 2 && !compareList.includes(String(property.id).trim())}
                      title={
                        compareList.length >= 2 && !compareList.includes(String(property.id).trim())
                          ? "Možete usporediti samo dvije nekretnine"
                          : ""
                      }
                    >
                      <Scale className="h-4 w-4" />
                      <span className="text-xs">Usporedi</span>
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 z-10">
                    <div className="text-white font-bold text-xl">{formatPrice(property.price)}</div>
                  </div>
                </div>

                <Link href={`/nekretnine/${property.id}`} className="block p-4">
                  <div className="flex items-start gap-1 text-gray-500 text-sm mb-2">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{property.location}</span>
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
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4 text-gray-400" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize className="h-4 w-4 text-gray-400" />
                        <span>{property.area} m²</span>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      {property.type || property.property_type || "Nekretnina"}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
