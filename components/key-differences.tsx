import { Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

interface KeyDifferencesProps {
  properties: Property[]
  formatPrice: (price: number, currency?: string) => string
  className?: string
}

export default function KeyDifferences({ properties, formatPrice, className }: KeyDifferencesProps) {
  if (properties.length < 2) return null

  const prop1 = properties[0]
  const prop2 = properties[1]

  // Calculate price difference
  const priceDiff = prop1.price - prop2.price
  const priceDiffPercentage = Math.abs(Math.round((priceDiff / Math.max(prop1.price, prop2.price)) * 100))

  // Calculate area difference
  const area1 = prop1.area || prop1.square_meters || 0
  const area2 = prop2.area || prop2.square_meters || 0
  const areaDiff = area1 - area2

  // Calculate price per square meter
  const pricePerSqm1 = prop1.price / (area1 || 1)
  const pricePerSqm2 = prop2.price / (area2 || 1)
  const pricePerSqmDiff = pricePerSqm1 - pricePerSqm2

  return (
    <div
      className={`bg-gradient-to-r from-rose-50 to-amber-50 p-3 sm:p-5 rounded-lg border border-gray-200 mb-6 shadow-sm animate-in fade-in-50 duration-500 ${className || ""}`}
    >
      <h3 className="font-semibold text-lg mb-4 flex items-center border-b border-gray-200 pb-2">
        <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
        Ključne razlike
      </h3>

      <div className="space-y-3">
        {/* Mobile-optimized layout */}
        <div className="sm:hidden">
          {/* Price difference - Mobile */}
          <div className="mb-4 pb-3 border-b border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Razlika u cijeni</span>
              <span className="text-xs font-medium text-gray-500">
                {formatPrice(Math.abs(priceDiff))} ({priceDiffPercentage}%)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{formatPrice(prop1.price)}</span>
                {prop1.price < prop2.price && (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs mt-1 px-1.5 py-0.5">
                    Povoljnije
                  </Badge>
                )}
                {prop1.price > prop2.price && (
                  <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 text-xs mt-1 px-1.5 py-0.5">
                    Skuplje
                  </Badge>
                )}
              </div>

              <div className="flex flex-col items-end">
                <span className="font-medium text-sm">{formatPrice(prop2.price)}</span>
                {prop2.price < prop1.price && (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs mt-1 px-1.5 py-0.5">
                    Povoljnije
                  </Badge>
                )}
                {prop2.price > prop1.price && (
                  <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 text-xs mt-1 px-1.5 py-0.5">
                    Skuplje
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Area difference - Mobile */}
          <div className="mb-4 pb-3 border-b border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Razlika u površini</span>
              <span className="text-xs font-medium text-gray-500">{Math.abs(areaDiff)} m²</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{area1} m²</span>
                {area1 > area2 && (
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs mt-1 px-1.5 py-0.5">Veće</Badge>
                )}
                {area1 < area2 && (
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs mt-1 px-1.5 py-0.5">
                    Manje
                  </Badge>
                )}
              </div>

              <div className="flex flex-col items-end">
                <span className="font-medium text-sm">{area2} m²</span>
                {area2 > area1 && (
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs mt-1 px-1.5 py-0.5">Veće</Badge>
                )}
                {area2 < area1 && (
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs mt-1 px-1.5 py-0.5">
                    Manje
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Price per square meter - Mobile */}
          <div className="mb-4 pb-3 border-b border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Cijena po m²</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm">{formatPrice(Math.round(pricePerSqm1))}</span>
                {pricePerSqm1 < pricePerSqm2 && (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs mt-1 px-1.5 py-0.5">
                    Isplativije
                  </Badge>
                )}
                {pricePerSqm1 > pricePerSqm2 && (
                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-xs mt-1 px-1.5 py-0.5">
                    Skuplje po m²
                  </Badge>
                )}
              </div>

              <div className="flex flex-col items-end">
                <span className="font-medium text-sm">{formatPrice(Math.round(pricePerSqm2))}</span>
                {pricePerSqm2 < pricePerSqm1 && (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs mt-1 px-1.5 py-0.5">
                    Isplativije
                  </Badge>
                )}
                {pricePerSqm2 > pricePerSqm1 && (
                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 text-xs mt-1 px-1.5 py-0.5">
                    Skuplje po m²
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Bedrooms difference - Mobile */}
          <div className="mb-4 pb-3 border-b border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Spavaće sobe</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">{prop1.bedrooms}</span>
              <span className="font-medium text-sm">{prop2.bedrooms}</span>
            </div>
          </div>

          {/* Year built difference - Mobile */}
          {prop1.year_built && prop2.year_built && (
            <div className="mb-4 pb-3 border-b border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Godina izgradnje</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{prop1.year_built}</span>
                <span className="font-medium text-sm">{prop2.year_built}</span>
              </div>
            </div>
          )}
        </div>

        {/* Desktop layout - hidden on mobile */}
        <div className="hidden sm:block space-y-4">
          {/* Price difference */}
          <div className="grid grid-cols-3 gap-4 py-4 border-b border-gray-100 hover:bg-white/50 px-2 rounded-md transition-colors">
            <div className="flex items-center">
              <span className="font-medium">{formatPrice(prop1.price)}</span>
              {prop1.price < prop2.price && (
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 ml-2 font-medium">
                  Povoljnije
                </Badge>
              )}
              {prop1.price > prop2.price && (
                <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 ml-2 font-medium">Skuplje</Badge>
              )}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">Razlika u cijeni</span>
              <span className="text-xs font-medium text-gray-500">
                {formatPrice(Math.abs(priceDiff))} ({priceDiffPercentage}%)
              </span>
            </div>
            <div className="flex items-center justify-end">
              {prop2.price < prop1.price && (
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 mr-2 font-medium">
                  Povoljnije
                </Badge>
              )}
              {prop2.price > prop1.price && (
                <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 mr-2 font-medium">Skuplje</Badge>
              )}
              <span className="font-medium">{formatPrice(prop2.price)}</span>
            </div>
          </div>

          {/* Area difference */}
          <div className="grid grid-cols-3 gap-4 py-4 border-b border-gray-100 hover:bg-white/50 px-2 rounded-md transition-colors">
            <div className="flex items-center">
              <span className="font-medium">{area1} m²</span>
              {area1 > area2 && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 ml-2 font-medium">Veće</Badge>
              )}
              {area1 < area2 && (
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 ml-2 font-medium">Manje</Badge>
              )}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-sm font-medium">Razlika u površini</span>
              <span className="text-xs font-medium text-gray-500">{Math.abs(areaDiff)} m²</span>
            </div>
            <div className="flex items-center justify-end">
              {area2 > area1 && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 mr-2 font-medium">Veće</Badge>
              )}
              {area2 < area1 && (
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 mr-2 font-medium">Manje</Badge>
              )}
              <span className="font-medium">{area2} m²</span>
            </div>
          </div>

          {/* Price per square meter */}
          <div className="grid grid-cols-3 gap-4 py-4 border-b border-gray-100 hover:bg-white/50 px-2 rounded-md transition-colors">
            <div className="flex items-center">
              <span className="font-medium">{formatPrice(Math.round(pricePerSqm1))}</span>
              {pricePerSqm1 < pricePerSqm2 && (
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 ml-2 font-medium">
                  Isplativije
                </Badge>
              )}
              {pricePerSqm1 > pricePerSqm2 && (
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 ml-2 font-medium">Skuplje po m²</Badge>
              )}
            </div>
            <div className="flex items-center justify-center">
              <span className="text-sm font-medium">Cijena po m²</span>
            </div>
            <div className="flex items-center justify-end">
              {pricePerSqm2 < pricePerSqm1 && (
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 mr-2 font-medium">
                  Isplativije
                </Badge>
              )}
              {pricePerSqm2 > pricePerSqm1 && (
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 mr-2 font-medium">Skuplje po m²</Badge>
              )}
              <span className="font-medium">{formatPrice(Math.round(pricePerSqm2))}</span>
            </div>
          </div>

          {/* Bedrooms difference */}
          <div className="grid grid-cols-3 gap-4 py-4 border-b border-gray-100 hover:bg-white/50 px-2 rounded-md transition-colors">
            <div className="flex items-center">
              <span className="font-medium">{prop1.bedrooms}</span>
            </div>
            <span className="text-sm font-medium text-center">Spavaće sobe</span>
            <div className="flex items-center justify-end">
              <span className="font-medium">{prop2.bedrooms}</span>
            </div>
          </div>

          {/* Year built difference */}
          {prop1.year_built && prop2.year_built && (
            <div className="grid grid-cols-3 gap-4 py-4 border-b border-gray-100 hover:bg-white/50 px-2 rounded-md transition-colors">
              <div className="flex items-center">
                <span className="font-medium">{prop1.year_built}</span>
              </div>
              <span className="text-sm font-medium text-center">Godina izgradnje</span>
              <div className="flex items-center justify-end">
                <span className="font-medium">{prop2.year_built}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
