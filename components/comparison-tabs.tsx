"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Bed, Bath, Maximize, Sparkles, Info, Home, Ruler } from "lucide-react"

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

interface ComparisonTabsProps {
  properties: Property[]
  formatPrice: (price: number, currency?: string) => string
}

export default function ComparisonTabs({ properties, formatPrice }: ComparisonTabsProps) {
  const [activeTab, setActiveTab] = useState("basic")

  // Helper function to determine which property has better features
  const getBetterProperty = (prop1: any, prop2: any, type: string): number => {
    // If either value is missing, the one with a value is better
    if (prop1 === undefined || prop1 === null || prop1 === "Nije navedeno") return prop2 ? 2 : 0
    if (prop2 === undefined || prop2 === null || prop2 === "Nije navedeno") return prop1 ? 1 : 0

    // For numeric comparisons (higher is better)
    if (type === "numeric") {
      if (prop1 > prop2) return 1
      if (prop2 > prop1) return 2
      return 0 // equal
    }

    // For year built (newer is better)
    if (type === "year") {
      if (prop1 > prop2) return 1
      if (prop2 > prop1) return 2
      return 0 // equal
    }

    // For energy certificate (A is better than G)
    if (type === "energy") {
      const ratings = ["A+", "A", "B", "C", "D", "E", "F", "G"]
      const rating1 = ratings.indexOf(prop1)
      const rating2 = ratings.indexOf(prop2)

      if (rating1 !== -1 && rating2 !== -1) {
        if (rating1 < rating2) return 1 // Lower index is better (A+ is 0)
        if (rating2 < rating1) return 2
      }
      return 0
    }

    // For price (lower is better)
    if (type === "price") {
      if (prop1 < prop2) return 1
      if (prop2 < prop1) return 2
      return 0 // equal
    }

    // Default case
    return 0
  }

  // Add this class helper function
  const getBetterClass = (isBetter: boolean) => {
    return isBetter ? "text-emerald-600 font-semibold" : ""
  }

  return (
    <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-4 sm:mb-6 sticky top-[70px] bg-white z-30 rounded-lg overflow-x-auto">
        <TabsTrigger
          value="basic"
          className="flex items-center justify-center gap-1 data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700 transition-all px-1 sm:px-2"
        >
          <Info className="h-4 w-4" />
          <span className="hidden sm:inline">Osnovne informacije</span>
        </TabsTrigger>
        <TabsTrigger
          value="details"
          className="flex items-center justify-center gap-1 data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700 transition-all px-1 sm:px-2"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Detalji</span>
        </TabsTrigger>
        <TabsTrigger
          value="features"
          className="flex items-center justify-center gap-1 data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700 transition-all px-1 sm:px-2"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Značajke</span>
        </TabsTrigger>
        <TabsTrigger
          value="other"
          className="flex items-center justify-center gap-1 data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700 transition-all px-1 sm:px-2"
        >
          <Ruler className="h-4 w-4" />
          <span className="hidden sm:inline">Ostalo</span>
        </TabsTrigger>
      </TabsList>

      {/* Basic Information Tab */}
      <TabsContent value="basic" className="space-y-4 animate-in fade-in-50 duration-300 pt-2">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-md text-sm sm:text-base">
          {/* Left Property */}
          <div
            className={`text-right font-bold ${
              properties.length > 1
                ? getBetterClass(
                    getBetterProperty(
                      -properties[0].price, // Negative because lower price is better
                      -properties[1].price,
                      "numeric",
                    ) === 1,
                  )
                : ""
            }`}
          >
            {properties.length > 0 ? formatPrice(properties[0].price, properties[0].currency) : ""}
          </div>

          {/* Middle - Label */}
          <div className="font-medium text-gray-700 text-center flex items-center justify-center">Cijena</div>

          {/* Right Property */}
          <div
            className={`font-bold ${
              properties.length > 1
                ? getBetterClass(
                    getBetterProperty(
                      -properties[0].price, // Negative because lower price is better
                      -properties[1].price,
                      "numeric",
                    ) === 2,
                  )
                : ""
            }`}
          >
            {properties.length > 1 ? formatPrice(properties[1].price, properties[1].currency) : ""}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-md text-sm sm:text-base">
          {/* Left Property */}
          <div className="text-right">
            {properties.length > 0 ? properties[0].type || properties[0].property_type || "Nije navedeno" : ""}
          </div>

          {/* Middle - Label */}
          <div className="font-medium text-gray-700 text-center flex items-center justify-center">Vrsta nekretnine</div>

          {/* Right Property */}
          <div>{properties.length > 1 ? properties[1].type || properties[1].property_type || "Nije navedeno" : ""}</div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-md text-sm sm:text-base">
          {/* Left Property */}
          <div className="text-right">{properties.length > 0 ? properties[0].location || "Nije navedeno" : ""}</div>

          {/* Middle - Label */}
          <div className="font-medium text-gray-700 text-center flex items-center justify-center">Lokacija</div>

          {/* Right Property */}
          <div>{properties.length > 1 ? properties[1].location || "Nije navedeno" : ""}</div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-md text-sm sm:text-base">
          {/* Left Property */}
          <div
            className={`flex items-center justify-end gap-1 ${
              properties.length > 1
                ? getBetterClass(
                    getBetterProperty(
                      properties[0].area || properties[0].square_meters,
                      properties[1].area || properties[1].square_meters,
                      "numeric",
                    ) === 1,
                  )
                : ""
            }`}
          >
            <span>{properties.length > 0 ? properties[0].area || properties[0].square_meters || 0 : 0} m²</span>
            <Maximize className="h-4 w-4 text-gray-400" />
          </div>

          {/* Middle - Label */}
          <div className="font-medium text-gray-700 text-center flex items-center justify-center">Površina</div>

          {/* Right Property */}
          <div
            className={`flex items-center gap-1 ${
              properties.length > 1
                ? getBetterClass(
                    getBetterProperty(
                      properties[0].area || properties[0].square_meters,
                      properties[1].area || properties[1].square_meters,
                      "numeric",
                    ) === 2,
                  )
                : ""
            }`}
          >
            <Maximize className="h-4 w-4 text-gray-400" />
            <span>{properties.length > 1 ? properties[1].area || properties[1].square_meters || 0 : 0} m²</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-md text-sm sm:text-base">
          {/* Left Property */}
          <div
            className={`flex items-center justify-end gap-1 ${
              properties.length > 1
                ? getBetterClass(getBetterProperty(properties[0].bedrooms, properties[1].bedrooms, "numeric") === 1)
                : ""
            }`}
          >
            <span>{properties.length > 0 ? properties[0].bedrooms : 0}</span>
            <Bed className="h-4 w-4 text-gray-400" />
          </div>

          {/* Middle - Label */}
          <div className="font-medium text-gray-700 text-center flex items-center justify-center">Spavaće sobe</div>

          {/* Right Property */}
          <div
            className={`flex items-center gap-1 ${
              properties.length > 1
                ? getBetterClass(getBetterProperty(properties[0].bedrooms, properties[1].bedrooms, "numeric") === 2)
                : ""
            }`}
          >
            <Bed className="h-4 w-4 text-gray-400" />
            <span>{properties.length > 1 ? properties[1].bedrooms : 0}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-md text-sm sm:text-base">
          {/* Left Property */}
          <div
            className={`flex items-center justify-end gap-1 ${
              properties.length > 1
                ? getBetterClass(getBetterProperty(properties[0].bathrooms, properties[1].bathrooms, "numeric") === 1)
                : ""
            }`}
          >
            <span>{properties.length > 0 ? properties[0].bathrooms : 0}</span>
            <Bath className="h-4 w-4 text-gray-400" />
          </div>

          {/* Middle - Label */}
          <div className="font-medium text-gray-700 text-center flex items-center justify-center">Kupaonice</div>

          {/* Right Property */}
          <div
            className={`flex items-center gap-1 ${
              properties.length > 1
                ? getBetterClass(getBetterProperty(properties[0].bathrooms, properties[1].bathrooms, "numeric") === 2)
                : ""
            }`}
          >
            <Bath className="h-4 w-4 text-gray-400" />
            <span>{properties.length > 1 ? properties[1].bathrooms : 0}</span>
          </div>
        </div>
      </TabsContent>

      {/* Details Tab */}
      <TabsContent value="details" className="space-y-4 animate-in fade-in-50 duration-300 pt-2">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-md text-sm sm:text-base">
          {/* Left Property */}
          <div
            className={`text-right ${
              properties.length > 1
                ? getBetterClass(getBetterProperty(properties[0].year_built, properties[1].year_built, "year") === 1)
                : ""
            }`}
          >
            {properties.length > 0 ? properties[0].year_built || "Nije navedeno" : ""}
          </div>

          {/* Middle - Label */}
          <div className="font-medium text-gray-700 text-center flex items-center justify-center">Godina izgradnje</div>

          {/* Right Property */}
          <div
            className={`${
              properties.length > 1
                ? getBetterClass(getBetterProperty(properties[0].year_built, properties[1].year_built, "year") === 2)
                : ""
            }`}
          >
            {properties.length > 1 ? properties[1].year_built || "Nije navedeno" : ""}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-md text-sm sm:text-base">
          {/* Left Property */}
          <div className="text-right">{properties.length > 0 ? properties[0].heating || "Nije navedeno" : ""}</div>

          {/* Middle - Label */}
          <div className="font-medium text-gray-700 text-center flex items-center justify-center">Grijanje</div>

          {/* Right Property */}
          <div>{properties.length > 1 ? properties[1].heating || "Nije navedeno" : ""}</div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-md text-sm sm:text-base">
          {/* Left Property */}
          <div className="text-right">
            {properties.length > 0
              ? properties[0].floor !== undefined
                ? `${properties[0].floor}${properties[0].total_floors ? `/${properties[0].total_floors}` : ""}`
                : "Nije navedeno"
              : ""}
          </div>

          {/* Middle - Label */}
          <div className="font-medium text-gray-700 text-center flex items-center justify-center">Kat</div>

          {/* Right Property */}
          <div>
            {properties.length > 1
              ? properties[1].floor !== undefined
                ? `${properties[1].floor}${properties[1].total_floors ? `/${properties[1].total_floors}` : ""}`
                : "Nije navedeno"
              : ""}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-md text-sm sm:text-base">
          {/* Left Property */}
          <div
            className={`text-right ${
              properties.length > 1
                ? getBetterClass(
                    getBetterProperty(properties[0].energy_certificate, properties[1].energy_certificate, "energy") ===
                      1,
                  )
                : ""
            }`}
          >
            {properties.length > 0 ? properties[0].energy_certificate || "Nije navedeno" : ""}
          </div>

          {/* Middle - Label */}
          <div className="font-medium text-gray-700 text-center flex items-center justify-center">
            Energetski certifikat
          </div>

          {/* Right Property */}
          <div
            className={`${
              properties.length > 1
                ? getBetterClass(
                    getBetterProperty(properties[0].energy_certificate, properties[1].energy_certificate, "energy") ===
                      2,
                  )
                : ""
            }`}
          >
            {properties.length > 1 ? properties[1].energy_certificate || "Nije navedeno" : ""}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-md text-sm sm:text-base">
          {/* Left Property */}
          <div className="text-right text-sm text-gray-500">
            {properties.length > 0 && properties[0].dateAdded
              ? new Date(properties[0].dateAdded).toLocaleDateString("hr-HR")
              : ""}
          </div>

          {/* Middle - Label */}
          <div className="font-medium text-gray-700 text-center flex items-center justify-center">Datum objave</div>

          {/* Right Property */}
          <div className="text-sm text-gray-500">
            {properties.length > 1 && properties[1].dateAdded
              ? new Date(properties[1].dateAdded).toLocaleDateString("hr-HR")
              : ""}
          </div>
        </div>
      </TabsContent>

      {/* Features Tab */}
      <TabsContent value="features" className="space-y-4 animate-in fade-in-50 duration-300 pt-2">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-md text-sm sm:text-base">
          {/* Left Property */}
          <div
            className={`text-right ${
              properties.length > 1 && properties[0].features && properties[1].features
                ? getBetterClass(
                    getBetterProperty(properties[0].features?.length, properties[1].features?.length, "numeric") === 1,
                  )
                : ""
            }`}
          >
            {properties.length > 0 ? (
              properties[0].features && properties[0].features.length > 0 ? (
                <ul className="list-disc list-inside">
                  {properties[0].features.map((feature, index) => (
                    <li key={index} className="text-sm">
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : (
                "Nije navedeno"
              )
            ) : (
              ""
            )}
          </div>

          {/* Middle - Label */}
          <div className="font-medium text-gray-700 text-center flex items-center justify-center">Dodatne značajke</div>

          {/* Right Property */}
          <div
            className={`${
              properties.length > 1 && properties[0].features && properties[1].features
                ? getBetterClass(
                    getBetterProperty(properties[0].features?.length, properties[1].features?.length, "numeric") === 2,
                  )
                : ""
            }`}
          >
            {properties.length > 1 ? (
              properties[1].features && properties[1].features.length > 0 ? (
                <ul className="list-disc list-inside">
                  {properties[1].features.map((feature, index) => (
                    <li key={index} className="text-sm">
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : (
                "Nije navedeno"
              )
            ) : (
              ""
            )}
          </div>
        </div>
      </TabsContent>

      {/* Other Tab */}
      <TabsContent value="other" className="space-y-4 animate-in fade-in-50 duration-300 pt-2">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-3 sm:py-4 hover:bg-gray-50 transition-colors rounded-md text-sm sm:text-base">
          {/* Left Property */}
          <div className="text-right text-sm">
            {properties.length > 0 ? (
              properties[0].description ? (
                <div className="line-clamp-4">{properties[0].description}</div>
              ) : (
                "Nije navedeno"
              )
            ) : (
              ""
            )}
          </div>

          {/* Middle - Label */}
          <div className="font-medium text-gray-700 text-center flex items-center justify-center">Opis</div>

          {/* Right Property */}
          <div className="text-sm">
            {properties.length > 1 ? (
              properties[1].description ? (
                <div className="line-clamp-4">{properties[1].description}</div>
              ) : (
                "Nije navedeno"
              )
            ) : (
              ""
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
