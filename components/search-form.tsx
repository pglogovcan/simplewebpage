"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { usageService } from "@/lib/usage-service"
import { getSupabaseClient } from "@/utils/supabase/client"
import { UsageLimitDialog } from "@/components/usage-limit-dialog"

type PropertyType = {
  id: string
  label: string
  value: string
  children?: {
    id: string
    label: string
    value: string
  }[]
}

export function SearchForm() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [selectedProperty, setSelectedProperty] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [minArea, setMinArea] = useState("")
  const [maxArea, setMaxArea] = useState("")
  const [isPropertyPopoverOpen, setIsPropertyPopoverOpen] = useState(false)
  const [listingType, setListingType] = useState<"prodaja" | "najam">("prodaja")

  const [showUsageLimitDialog, setShowUsageLimitDialog] = useState(false)
  const [usageLimitInfo, setUsageLimitInfo] = useState<{
    limitType: "property_listing" | "featured_listing" | "search" | "contact"
    currentUsage: number
    limit: number
    planType: string
  }>({
    limitType: "search",
    currentUsage: 0,
    limit: 0,
    planType: "basic",
  })

  const propertyTypes: PropertyType[] = [
    {
      id: "all",
      label: "Sve vrste",
      value: "all",
    },
    {
      id: "stan",
      label: "Stan",
      value: "Stan",
    },
    {
      id: "kuca",
      label: "Kuća",
      value: "Kuća",
    },
    {
      id: "studio",
      label: "Studio / Garsonijera",
      value: "Garsonjera",
    },
    {
      id: "vila",
      label: "Vila",
      value: "Vila",
    },
    {
      id: "poslovni-prostor",
      label: "Poslovni prostor",
      value: "Poslovni prostor",
    },
    {
      id: "zemljiste",
      label: "Zemljište",
      value: "Zemljište",
    },
  ]

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      // Check if user is authenticated and track search usage
      const supabase = getSupabaseClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Check usage limits for authenticated users
        const usageCheck = await usageService.checkUsageLimit(user.id, "search")

        if (!usageCheck.allowed) {
          setUsageLimitInfo({
            limitType: "search",
            currentUsage: usageCheck.currentUsage || 0,
            limit: usageCheck.limit || 0,
            planType: "basic", // You might want to fetch this from the user's subscription
          })
          setShowUsageLimitDialog(true)
          return
        }

        // Track the search usage
        await usageService.trackUsage(user.id, "search")
      }

      // Build query parameters
      const params = new URLSearchParams()

      if (location) params.append("location", location)

      if (selectedProperty && selectedProperty !== "all") {
        const propertyType = propertyTypes.find((t) => t.id === selectedProperty)
        if (propertyType) params.append("propertyType", propertyType.value)
      }

      if (listingType) params.append("status", listingType === "prodaja" ? "for_sale" : "for_rent")

      if (minPrice) params.append("minPrice", minPrice)
      if (maxPrice) params.append("maxPrice", maxPrice)
      if (minArea) params.append("minArea", minArea)
      if (maxArea) params.append("maxArea", maxArea)

      // Navigate to search results page
      router.push(`/pretraga?${params.toString()}`)
    } catch (error) {
      console.error("Error during search:", error)
      // Still allow the search to proceed for non-authenticated users
      const params = new URLSearchParams()
      if (location) params.append("location", location)
      router.push(`/pretraga?${params.toString()}`)
    }
  }

  // Function to get the display name of the selected property
  const getSelectedPropertyName = () => {
    const propertyType = propertyTypes.find((t) => t.id === selectedProperty)
    return propertyType ? propertyType.label : "Tip nekretnine"
  }

  return (
    <form onSubmit={handleSubmit} className="w-full rounded-lg bg-white p-3 sm:p-4 shadow-lg">
      <div className="mb-4 flex gap-2">
        <Button
          type="button"
          variant={listingType === "prodaja" ? "default" : "outline"}
          className={
            listingType === "prodaja" ? "bg-rose-400 hover:bg-rose-400 border-l-rose-400" : "hover:bg-gray-100"
          }
          onClick={() => setListingType("prodaja")}
        >
          Prodaja
        </Button>
        <Button
          type="button"
          variant={listingType === "najam" ? "default" : "outline"}
          className={listingType === "najam" ? "bg-rose-400 hover:bg-rose-400 border-l-rose-400" : "hover:bg-gray-100"}
          onClick={() => setListingType("najam")}
        >
          Najam
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <div>
          <div className="relative">
            <Input
              type="text"
              placeholder="Pretraži lokaciju"
              className="pl-10"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="relative">
          <Popover open={isPropertyPopoverOpen} onOpenChange={setIsPropertyPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {getSelectedPropertyName()}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <div className="max-h-[300px] overflow-y-auto">
                {propertyTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer ${
                      selectedProperty === type.id ? "bg-teal-50" : ""
                    }`}
                    onClick={() => {
                      setSelectedProperty(type.id)
                      setIsPropertyPopoverOpen(false)
                    }}
                  >
                    <span className="text-sm">{type.label}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="€ Od"
            className="w-1/2"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="€ Do"
            className="w-1/2"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="m² Od"
            className="w-1/2"
            value={minArea}
            onChange={(e) => setMinArea(e.target.value)}
          />
          <Input
            type="number"
            placeholder="m² Do"
            className="w-1/2"
            value={maxArea}
            onChange={(e) => setMaxArea(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="submit" className="bg-gray-600 hover:bg-gray-700 text-white text-xs sm:text-sm">
          <Search className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">POGLEDAJ</span> REZULTATE
        </Button>
      </div>
      {/* Usage Limit Dialog */}
      <UsageLimitDialog
        open={showUsageLimitDialog}
        onOpenChange={setShowUsageLimitDialog}
        limitType={usageLimitInfo.limitType}
        currentUsage={usageLimitInfo.currentUsage}
        limit={usageLimitInfo.limit}
        planType={usageLimitInfo.planType}
      />
    </form>
  )
}
