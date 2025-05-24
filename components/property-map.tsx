"use client"
import Image from "next/image"
import { Bed, Bath, Maximize, MapPin } from "lucide-react"

// We'll load these dynamically only on the client side
import dynamic from "next/dynamic"

// Import Leaflet CSS
import "leaflet/dist/leaflet.css"

// Define types for our properties
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
  coordinates?: [number, number]
}

type PropertyMapProps = {
  properties: Property[]
  hoveredProperty: string | null
  setHoveredProperty: (id: string | null) => void
  formatPrice: (price: number) => string
}

// Property hover card component
function PropertyHoverCard({ property, formatPrice }: { property: Property; formatPrice: (price: number) => string }) {
  if (!property) return null

  return (
    <div className="absolute left-8 top-0 w-64 bg-white rounded-lg shadow-lg overflow-hidden z-[1000]">
      <div className="relative h-32 w-full">
        <Image src={property.images[0] || "/placeholder.svg"} alt={property.title} fill className="object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
          <div className="text-white font-bold text-sm">{formatPrice(property.price)}</div>
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
  )
}

// Create a simple map component that will be replaced with the actual implementation
function SimpleMap({ properties, hoveredProperty, setHoveredProperty, formatPrice }: PropertyMapProps) {
  return (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
      <div className="text-center p-6">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Učitavanje karte...</p>
      </div>
    </div>
  )
}

// Export a dynamic component that loads only on the client side
export default dynamic(() => Promise.resolve(SimpleMap), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
})
