"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Property {
  id: string
  title?: string
  name?: string
  price: number
  currency?: string
  location: string
  images: string[]
  bedrooms: number
  bathrooms: number
  area: number
  square_meters?: number
  type?: string
  property_type?: string
}

interface PropertySummaryCardProps {
  property: Property
  formatPrice: (price: number, currency?: string) => string
  onRemove: (id: string) => void
  showRemoveButton?: boolean
}

export default function PropertySummaryCard({
  property,
  formatPrice,
  onRemove,
  showRemoveButton = true,
}: PropertySummaryCardProps) {
  const propertyTitle = property.title || property.name || "Nekretnina"
  const propertyType = property.type || property.property_type || "Nekretnina"

  return (
    <div className="relative group transition-all duration-300 hover:translate-y-[-2px]">
      {showRemoveButton && (
        <button
          onClick={() => onRemove(property.id)}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 hover:text-rose-500 rounded-full p-1.5 transition-colors z-10"
          aria-label="Ukloni iz usporedbe"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="relative h-32 sm:h-40 rounded-lg overflow-hidden group-hover:shadow-md transition-shadow duration-300">
        <Image src={property.images[0] || "/placeholder.svg"} alt={propertyTitle} fill className="object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
          <div className="text-white font-bold text-lg">{formatPrice(property.price, property.currency)}</div>
        </div>
      </div>

      <h3 className="font-semibold text-base mt-2 mb-1 truncate group-hover:text-rose-500 transition-colors">
        <Link href={`/nekretnine/${property.id}`} className="transition-colors">
          {propertyTitle}
        </Link>
      </h3>

      <div className="flex items-start gap-1 text-gray-500 text-xs mb-1">
        <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
        <span className="truncate">{property.location}</span>
      </div>

      <Badge variant="outline" className="text-xs font-normal bg-white/80">
        {propertyType}
      </Badge>
    </div>
  )
}
