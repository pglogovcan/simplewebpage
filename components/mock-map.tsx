"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Bed, Bath, Maximize, MapPin } from "lucide-react"
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
  images: string[]
  coordinates?: [number, number]
}

type PropertyMapProps = {
  properties: Property[]
  hoveredProperty: string | null
  setHoveredProperty: (id: string | null) => void
  formatPrice: (price: number) => string
}

export default function PropertyMap({
  properties,
  hoveredProperty,
  setHoveredProperty,
  formatPrice,
}: PropertyMapProps) {
  const router = useRouter()
  const [positions, setPositions] = useState<Record<string, { top: string; left: string }>>({})

  // Generate random positions for property pins on mount
  useEffect(() => {
    const newPositions: Record<string, { top: string; left: string }> = {}

    properties.forEach((property) => {
      newPositions[property.id] = {
        top: `${20 + Math.random() * 60}%`,
        left: `${20 + Math.random() * 60}%`,
      }
    })

    setPositions(newPositions)
  }, [properties])

  return (
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
          {properties.map((property, index) => (
            <div
              key={property.id}
              className={`absolute ${
                hoveredProperty === property.id ? "w-8 h-8 bg-rose-600 shadow-lg z-20" : "w-6 h-6 bg-rose-500"
              } rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-rose-600 transition-all duration-200`}
              style={{
                top: positions[property.id]?.top || "50%",
                left: positions[property.id]?.left || "50%",
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
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-gray-500">© Pačonž Maps</div>
    </div>
  )
}
