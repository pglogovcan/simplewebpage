"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  MapPin,
  Euro,
  Maximize,
  Bed,
  Bath,
  Info,
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { usageService } from "@/lib/usage-service"
import { UsageLimitDialog } from "@/components/usage-limit-dialog"
import { getSupabaseClient } from "@/utils/supabase/client"

// Define types for our form
type PropertyType =
  | "Stan"
  | "Kuća"
  | "Vila"
  | "Apartman"
  | "Penthouse"
  | "Studio"
  | "Dupleks"
  | "Poslovni prostor"
  | "Zemljište"
  | "Garaža"
type ListingType = "Prodaja" | "Najam"

interface PropertyFormData {
  // Basic Information
  title: string
  description: string
  propertyType: PropertyType | ""
  listingType: ListingType | ""
  price: string
  pricePerSquareMeter: string

  // Location
  city: string
  neighborhood: string
  address: string
  zipCode: string

  // Details
  area: string
  landArea: string
  bedrooms: string
  bathrooms: string
  floor: string
  totalFloors: string
  yearBuilt: string
  energyClass: string

  // Features
  features: string[]

  // Media
  images: File[]
  imageUrls: string[] // For preview
}

// Initial form data
const initialFormData: PropertyFormData = {
  title: "",
  description: "",
  propertyType: "",
  listingType: "",
  price: "",
  pricePerSquareMeter: "",

  city: "",
  neighborhood: "",
  address: "",
  zipCode: "",

  area: "",
  landArea: "",
  bedrooms: "",
  bathrooms: "",
  floor: "",
  totalFloors: "",
  yearBuilt: "",
  energyClass: "",

  features: [],

  images: [],
  imageUrls: [],
}

// Available property features
const availableFeatures = [
  "Balkon",
  "Terasa",
  "Vrt",
  "Bazen",
  "Garaža",
  "Parking",
  "Lift",
  "Klima uređaj",
  "Centralno grijanje",
  "Podno grijanje",
  "Namješteno",
  "Novogradnja",
  "Renovirano",
  "Pogled na more",
  "Blizina javnog prijevoza",
  "Blizina škole",
  "Blizina trgovine",
  "Blizina plaže",
  "Internet priključak",
  "Kabelska TV",
  "Alarm",
  "Video nadzor",
  "Roštilj",
  "Spremište",
]

export default function AddPropertyPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData)
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Partial<Record<keyof PropertyFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [showUsageLimitDialog, setShowUsageLimitDialog] = useState(false)
  const [usageLimitInfo, setUsageLimitInfo] = useState<{
    limitType: "property_listing" | "featured_listing" | "search" | "contact"
    currentUsage: number
    limit: number
    planType: string
  }>({
    limitType: "property_listing",
    currentUsage: 0,
    limit: 0,
    planType: "basic",
  })
  

  // Total number of steps in the form
  const totalSteps = 5

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field if it exists
    if (errors[name as keyof PropertyFormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof PropertyFormData]
        return newErrors
      })
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field if it exists
    if (errors[name as keyof PropertyFormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof PropertyFormData]
        return newErrors
      })
    }
  }

  // Handle feature toggle
  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => {
      const features = prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature]
      return { ...prev, features }
    })
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)

      // Check if adding these files would exceed the limit
      if (formData.images.length + newFiles.length > 10) {
        setErrors((prev) => ({
          ...prev,
          images: "Možete dodati najviše 10 slika.",
        }))
        return
      }

      // Create URLs for preview
      const newImageUrls = newFiles.map((file) => URL.createObjectURL(file))

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
        imageUrls: [...prev.imageUrls, ...newImageUrls],
      }))

      // Clear error if it exists
      if (errors.images) {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.images
          return newErrors
        })
      }
    }
  }

  // Remove image
  const removeImage = (index: number) => {
    setFormData((prev) => {
      const newImages = [...prev.images]
      const newImageUrls = [...prev.imageUrls]

      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(newImageUrls[index])

      newImages.splice(index, 1)
      newImageUrls.splice(index, 1)

      return {
        ...prev,
        images: newImages,
        imageUrls: newImageUrls,
      }
    })
  }

  // Validate the current step
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof PropertyFormData, string>> = {}

    if (step === 1) {
      // Basic Information validation
      if (!formData.title.trim()) newErrors.title = "Naslov je obavezan."
      if (!formData.description.trim()) newErrors.description = "Opis je obavezan."
      if (!formData.propertyType) newErrors.propertyType = "Tip nekretnine je obavezan."
      if (!formData.listingType) newErrors.listingType = "Tip oglasa je obavezan."
      if (!formData.price.trim()) {
        newErrors.price = "Cijena je obavezna."
      } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
        newErrors.price = "Cijena mora biti pozitivan broj."
      }
    } else if (step === 2) {
      // Location validation
      if (!formData.city.trim()) newErrors.city = "Grad je obavezan."
      if (!formData.neighborhood.trim()) newErrors.neighborhood = "Kvart/naselje je obavezno."
      if (!formData.address.trim()) newErrors.address = "Adresa je obavezna."
      if (!formData.zipCode.trim()) {
        newErrors.zipCode = "Poštanski broj je obavezan."
      } else if (!/^\d+$/.test(formData.zipCode)) {
        newErrors.zipCode = "Poštanski broj mora sadržavati samo brojeve."
      }
    } else if (step === 3) {
      // Details validation
      if (!formData.area.trim()) {
        newErrors.area = "Površina je obavezna."
      } else if (isNaN(Number(formData.area)) || Number(formData.area) <= 0) {
        newErrors.area = "Površina mora biti pozitivan broj."
      }

      if (formData.landArea.trim() && (isNaN(Number(formData.landArea)) || Number(formData.landArea) <= 0)) {
        newErrors.landArea = "Površina zemljišta mora biti pozitivan broj."
      }

      if (formData.bedrooms.trim() && (isNaN(Number(formData.bedrooms)) || Number(formData.bedrooms) < 0)) {
        newErrors.bedrooms = "Broj spavaćih soba mora biti pozitivan broj."
      }

      if (formData.bathrooms.trim() && (isNaN(Number(formData.bathrooms)) || Number(formData.bathrooms) < 0)) {
        newErrors.bathrooms = "Broj kupaonica mora biti pozitivan broj."
      }

      if (formData.floor.trim() && (isNaN(Number(formData.floor)) || Number(formData.floor) < 0)) {
        newErrors.floor = "Kat mora biti pozitivan broj."
      }

      if (formData.totalFloors.trim() && (isNaN(Number(formData.totalFloors)) || Number(formData.totalFloors) < 0)) {
        newErrors.totalFloors = "Ukupan broj katova mora biti pozitivan broj."
      }

      if (formData.yearBuilt.trim()) {
        const year = Number(formData.yearBuilt)
        const currentYear = new Date().getFullYear()
        if (isNaN(year) || year < 1800 || year > currentYear) {
          newErrors.yearBuilt = `Godina izgradnje mora biti između 1800 i ${currentYear}.`
        }
      }
    } else if (step === 4) {
      // Media validation
      if (formData.images.length === 0) {
        newErrors.images = "Dodajte barem jednu sliku."
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all steps before submitting
    let isValid = true
    for (let step = 1; step <= totalSteps - 1; step++) {
      if (!validateStep(step)) {
        isValid = false
        setCurrentStep(step)
        break
      }
    }

    if (!isValid) return

    setIsSubmitting(true)

    try {
      // Check if user is authenticated
      const supabase = getSupabaseClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setErrors((prev) => ({
          ...prev,
          submit: "Morate biti prijavljeni da biste dodali nekretninu.",
        }))
        setIsSubmitting(false)
        return
      }

      // Check usage limits before submitting
      const usageCheck = await usageService.checkUsageLimit(user.id, "property_listing")

      if (!usageCheck.allowed) {
        setUsageLimitInfo({
          limitType: "property_listing",
          currentUsage: usageCheck.currentUsage || 0,
          limit: usageCheck.limit || 0,
          planType: "basic", // You might want to fetch this from the user's subscription
        })
        setShowUsageLimitDialog(true)
        setIsSubmitting(false)
        return
      }

      // In a real application, you would send the form data to your backend
      // For this example, we'll simulate a successful submission after a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Track the usage after successful submission
      await usageService.trackUsage(user.id, "property_listing")

      setSubmitSuccess(true)

      // Redirect to success page or dashboard after a delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrors((prev) => ({
        ...prev,
        submit: "Došlo je do greške prilikom slanja obrasca. Molimo pokušajte ponovno.",
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render step indicator
  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                currentStep > index + 1
                  ? "bg-rose-400 text-white"
                  : currentStep === index + 1
                    ? "bg-rose-400 text-white"
                    : "bg-gray-200 text-gray-500",
              )}
            >
              {currentStep > index + 1 ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div className={cn("w-12 h-1 mx-1", currentStep > index + 1 ? "bg-rose-400" : "bg-gray-200")} />
            )}
          </div>
        ))}
      </div>
    )
  }

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Osnovne informacije</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title" className="required">
                    Naslov oglasa
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="npr. Moderan stan u centru grada"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType" className="required">
                    Tip nekretnine
                  </Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(value) => handleSelectChange("propertyType", value)}
                  >
                    <SelectTrigger id="propertyType" className={errors.propertyType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Odaberite tip nekretnine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Stan">Stan</SelectItem>
                      <SelectItem value="Kuća">Kuća</SelectItem>
                      <SelectItem value="Vila">Vila</SelectItem>
                      <SelectItem value="Apartman">Apartman</SelectItem>
                      <SelectItem value="Penthouse">Penthouse</SelectItem>
                      <SelectItem value="Studio">Studio</SelectItem>
                      <SelectItem value="Dupleks">Dupleks</SelectItem>
                      <SelectItem value="Poslovni prostor">Poslovni prostor</SelectItem>
                      <SelectItem value="Zemljište">Zemljište</SelectItem>
                      <SelectItem value="Garaža">Garaža</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.propertyType && <p className="text-sm text-red-500">{errors.propertyType}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="listingType" className="required">
                    Tip oglasa
                  </Label>
                  <RadioGroup
                    value={formData.listingType}
                    onValueChange={(value) => handleSelectChange("listingType", value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Prodaja" id="prodaja" />
                      <Label htmlFor="prodaja">Prodaja</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Najam" id="najam" />
                      <Label htmlFor="najam">Najam</Label>
                    </div>
                  </RadioGroup>
                  {errors.listingType && <p className="text-sm text-red-500">{errors.listingType}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="required">
                    Cijena (€)
                  </Label>
                  <div className="relative">
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="npr. 150000"
                      className={cn("pl-8", errors.price ? "border-red-500" : "")}
                    />
                    <Euro className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePerSquareMeter">Cijena po m² (€)</Label>
                  <div className="relative">
                    <Input
                      id="pricePerSquareMeter"
                      name="pricePerSquareMeter"
                      type="number"
                      value={formData.pricePerSquareMeter}
                      onChange={handleInputChange}
                      placeholder="npr. 2000"
                      className="pl-8"
                    />
                    <Euro className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="required">
                  Opis
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detaljan opis nekretnine..."
                  className={cn("min-h-[150px]", errors.description ? "border-red-500" : "")}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Lokacija</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="required">
                    Grad
                  </Label>
                  <Select value={formData.city} onValueChange={(value) => handleSelectChange("city", value)}>
                    <SelectTrigger id="city" className={errors.city ? "border-red-500" : ""}>
                      <SelectValue placeholder="Odaberite grad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zagreb">Zagreb</SelectItem>
                      <SelectItem value="Split">Split</SelectItem>
                      <SelectItem value="Rijeka">Rijeka</SelectItem>
                      <SelectItem value="Osijek">Osijek</SelectItem>
                      <SelectItem value="Zadar">Zadar</SelectItem>
                      <SelectItem value="Dubrovnik">Dubrovnik</SelectItem>
                      <SelectItem value="Pula">Pula</SelectItem>
                      <SelectItem value="Varaždin">Varaždin</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood" className="required">
                    Kvart/Naselje
                  </Label>
                  <Input
                    id="neighborhood"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    placeholder="npr. Trešnjevka, Centar"
                    className={errors.neighborhood ? "border-red-500" : ""}
                  />
                  {errors.neighborhood && <p className="text-sm text-red-500">{errors.neighborhood}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address" className="required">
                    Adresa
                  </Label>
                  <div className="relative">
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="npr. Ilica 45"
                      className={cn("pl-8", errors.address ? "border-red-500" : "")}
                    />
                    <MapPin className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="required">
                    Poštanski broj
                  </Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="npr. 10000"
                    className={errors.zipCode ? "border-red-500" : ""}
                  />
                  {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode}</p>}
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-700 mb-1">Napomena o privatnosti</p>
                    <p>
                      Točna adresa nekretnine bit će vidljiva samo zainteresiranim kupcima nakon što ih odobrite. Na
                      javnom oglasu bit će prikazana samo šira lokacija (kvart/naselje).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Detalji nekretnine</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area" className="required">
                    Površina (m²)
                  </Label>
                  <div className="relative">
                    <Input
                      id="area"
                      name="area"
                      type="number"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="npr. 75"
                      className={cn("pl-8", errors.area ? "border-red-500" : "")}
                    />
                    <Maximize className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.area && <p className="text-sm text-red-500">{errors.area}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landArea">Površina zemljišta (m²)</Label>
                  <div className="relative">
                    <Input
                      id="landArea"
                      name="landArea"
                      type="number"
                      value={formData.landArea}
                      onChange={handleInputChange}
                      placeholder="npr. 500"
                      className={cn("pl-8", errors.landArea ? "border-red-500" : "")}
                    />
                    <Maximize className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.landArea && <p className="text-sm text-red-500">{errors.landArea}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Broj spavaćih soba</Label>
                  <div className="relative">
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      placeholder="npr. 2"
                      className={cn("pl-8", errors.bedrooms ? "border-red-500" : "")}
                    />
                    <Bed className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.bedrooms && <p className="text-sm text-red-500">{errors.bedrooms}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Broj kupaonica</Label>
                  <div className="relative">
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      placeholder="npr. 1"
                      className={cn("pl-8", errors.bathrooms ? "border-red-500" : "")}
                    />
                    <Bath className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {errors.bathrooms && <p className="text-sm text-red-500">{errors.bathrooms}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floor">Kat</Label>
                  <Input
                    id="floor"
                    name="floor"
                    type="number"
                    value={formData.floor}
                    onChange={handleInputChange}
                    placeholder="npr. 3"
                    className={errors.floor ? "border-red-500" : ""}
                  />
                  {errors.floor && <p className="text-sm text-red-500">{errors.floor}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalFloors">Ukupno katova</Label>
                  <Input
                    id="totalFloors"
                    name="totalFloors"
                    type="number"
                    value={formData.totalFloors}
                    onChange={handleInputChange}
                    placeholder="npr. 5"
                    className={errors.totalFloors ? "border-red-500" : ""}
                  />
                  {errors.totalFloors && <p className="text-sm text-red-500">{errors.totalFloors}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="yearBuilt">Godina izgradnje</Label>
                  <Input
                    id="yearBuilt"
                    name="yearBuilt"
                    type="number"
                    value={formData.yearBuilt}
                    onChange={handleInputChange}
                    placeholder="npr. 2010"
                    className={errors.yearBuilt ? "border-red-500" : ""}
                  />
                  {errors.yearBuilt && <p className="text-sm text-red-500">{errors.yearBuilt}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="energyClass">Energetski razred</Label>
                  <Select
                    value={formData.energyClass}
                    onValueChange={(value) => handleSelectChange("energyClass", value)}
                  >
                    <SelectTrigger id="energyClass">
                      <SelectValue placeholder="Odaberite energetski razred" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                      <SelectItem value="G">G</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Karakteristike i pogodnosti</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {availableFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={`feature-${feature}`}
                        checked={formData.features.includes(feature)}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                      <Label
                        htmlFor={`feature-${feature}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Fotografije</h2>

              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-700 mb-1">Savjeti za fotografije</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Dodajte najmanje 3 fotografije visoke kvalitete</li>
                      <li>Prva fotografija će biti naslovna slika oglasa</li>
                      <li>Fotografije trebaju biti u formatu JPG, PNG ili WEBP</li>
                      <li>Maksimalna veličina pojedine fotografije je 5MB</li>
                      <li>Možete dodati najviše 10 fotografija</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="images" className="required">
                  Fotografije nekretnine
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Label htmlFor="images" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700">Kliknite za odabir fotografija</p>
                      <p className="text-xs text-gray-500 mt-1">ili povucite i ispustite fotografije ovdje</p>
                    </div>
                  </Label>
                </div>
                {errors.images && <p className="text-sm text-red-500">{errors.images}</p>}

                {formData.imageUrls.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Odabrane fotografije ({formData.imageUrls.length}/10)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="relative aspect-video rounded-md overflow-hidden border border-gray-200">
                            <Image
                              src={url || "/placeholder.svg"}
                              alt={`Fotografija ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </button>
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-rose-400 text-white text-xs px-2 py-0.5 rounded">
                              Naslovna
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Pregled i objava</h2>

              {submitSuccess ? (
                <Alert className="bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Uspješno!</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Vaš oglas je uspješno poslan na pregled. Preusmjerit ćemo vas na kontrolnu ploču.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Pregled oglasa</AlertTitle>
                    <AlertDescription>
                      Molimo pregledajte sve unesene podatke prije objave. Nakon što objavite oglas, bit će poslan na
                      pregled i objavljen nakon odobrenja.
                    </AlertDescription>
                  </Alert>

                  <Tabs defaultValue="basic" className="mt-6">
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger value="basic">Osnovne informacije</TabsTrigger>
                      <TabsTrigger value="location">Lokacija</TabsTrigger>
                      <TabsTrigger value="details">Detalji</TabsTrigger>
                      <TabsTrigger value="media">Fotografije</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Naslov</h3>
                          <p className="mt-1">{formData.title || "-"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Tip nekretnine</h3>
                          <p className="mt-1">{formData.propertyType || "-"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Tip oglasa</h3>
                          <p className="mt-1">{formData.listingType || "-"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Cijena</h3>
                          <p className="mt-1">{formData.price ? `${formData.price} €` : "-"}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Opis</h3>
                        <p className="mt-1 whitespace-pre-line">{formData.description || "-"}</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="location" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Grad</h3>
                          <p className="mt-1">{formData.city || "-"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Kvart/Naselje</h3>
                          <p className="mt-1">{formData.neighborhood || "-"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Adresa</h3>
                          <p className="mt-1">{formData.address || "-"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Poštanski broj</h3>
                          <p className="mt-1">{formData.zipCode || "-"}</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Površina</h3>
                          <p className="mt-1">{formData.area ? `${formData.area} m²` : "-"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Površina zemljišta</h3>
                          <p className="mt-1">{formData.landArea ? `${formData.landArea} m²` : "-"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Broj spavaćih soba</h3>
                          <p className="mt-1">{formData.bedrooms || "-"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Broj kupaonica</h3>
                          <p className="mt-1">{formData.bathrooms || "-"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Kat</h3>
                          <p className="mt-1">{formData.floor || "-"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Ukupno katova</h3>
                          <p className="mt-1">{formData.totalFloors || "-"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Godina izgradnje</h3>
                          <p className="mt-1">{formData.yearBuilt || "-"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Energetski razred</h3>
                          <p className="mt-1">{formData.energyClass || "-"}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Karakteristike</h3>
                        {formData.features.length > 0 ? (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {formData.features.map((feature) => (
                              <span
                                key={feature}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="mt-1">-</p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="media">
                      {formData.imageUrls.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {formData.imageUrls.map((url, index) => (
                            <div key={index} className="relative">
                              <div className="relative aspect-video rounded-md overflow-hidden border border-gray-200">
                                <Image
                                  src={url || "/placeholder.svg"}
                                  alt={`Fotografija ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              {index === 0 && (
                                <div className="absolute top-2 left-2 bg-rose-400 text-white text-xs px-2 py-0.5 rounded">
                                  Naslovna
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>Nema dodanih fotografija.</p>
                      )}
                    </TabsContent>
                  </Tabs>

                  {errors.submit && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Greška</AlertTitle>
                      <AlertDescription>{errors.submit}</AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dodaj novu nekretninu</h1>
          <p className="mt-2 text-gray-600">Ispunite obrazac s detaljima o vašoj nekretnini i objavite oglas.</p>
        </div>

        {renderStepIndicator()}

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              {renderStepContent()}

              <div className="flex justify-between mt-8">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" onClick={handlePrevStep} disabled={isSubmitting}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Prethodni korak
                  </Button>
                ) : (
                  <Button type="button" variant="outline" onClick={() => router.push("/")} disabled={isSubmitting}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Odustani
                  </Button>
                )}

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-rose-400 hover:bg-rose-500"
                    disabled={isSubmitting}
                  >
                    Sljedeći korak
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="bg-rose-400 hover:bg-rose-500" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Objavljujem...
                      </>
                    ) : (
                      <>
                        Objavi oglas
                        <Check className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        {/* Usage Limit Dialog */}
        <UsageLimitDialog
          open={showUsageLimitDialog}
          onOpenChange={setShowUsageLimitDialog}
          limitType={usageLimitInfo.limitType}
          currentUsage={usageLimitInfo.currentUsage}
          limit={usageLimitInfo.limit}
          planType={usageLimitInfo.planType}
        />
      </div>
    </div>
  )
}
