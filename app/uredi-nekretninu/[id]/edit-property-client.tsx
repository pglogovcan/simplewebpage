"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Save,
  AlertCircle,
  CheckCircle,
  Menu,
  User,
  Users,
  Newspaper,
  Megaphone,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Search,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  X,
  ArrowUp,
  ArrowDown,
  Plus,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AuthDialog } from "@/components/auth-dialog"
import { cn } from "@/lib/utils"
import { updateProperty } from "@/app/actions/property-actions"

interface Property {
  id: number
  title: string
  description: string | null
  property_type: string | null
  location: string | null
  address: string | null
  price: number | null
  bedrooms: number | null
  bathrooms: number | null
  area: number | null
  year_built: number | null
  heating: string | null
  parking: string | null
  featured: boolean | null
  new: boolean | null
  images: string[] | null
}

interface EditPropertyClientProps {
  property: Property
}

interface FormErrors {
  [key: string]: string
}

export default function EditPropertyClient({ property }: EditPropertyClientProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: property.title || "",
    description: property.description || "",
    property_type: property.property_type || "",
    location: property.location || "",
    address: property.address || "",
    price: property.price?.toString() || "",
    bedrooms: property.bedrooms?.toString() || "",
    bathrooms: property.bathrooms?.toString() || "",
    area: property.area?.toString() || "",
    year_built: property.year_built?.toString() || "",
    heating: property.heating || "",
    parking: property.parking || "",
    featured: property.featured || false,
    new: property.new || false,
  })

  const [propertyImages, setPropertyImages] = useState<string[]>(property.images || [])
  const [newImageUrl, setNewImageUrl] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = "Naslov je obavezan"
    } else if (formData.title.length > 255) {
      newErrors.title = "Naslov ne smije biti duži od 255 znakova"
    }

    // Optional but validated fields
    if (formData.property_type && formData.property_type.length > 50) {
      newErrors.property_type = "Tip nekretnine ne smije biti duži od 50 znakova"
    }

    if (formData.location && formData.location.length > 255) {
      newErrors.location = "Lokacija ne smije biti duža od 255 znakova"
    }

    if (formData.address && formData.address.length > 255) {
      newErrors.address = "Adresa ne smije biti duža od 255 znakova"
    }

    if (formData.heating && formData.heating.length > 50) {
      newErrors.heating = "Grijanje ne smije biti duže od 50 znakova"
    }

    if (formData.parking && formData.parking.length > 50) {
      newErrors.parking = "Parking ne smije biti duži od 50 znakova"
    }

    // Numeric validations
    if (formData.price && (isNaN(Number(formData.price)) || Number(formData.price) < 0)) {
      newErrors.price = "Cijena mora biti pozitivan broj"
    }

    if (formData.bedrooms && (isNaN(Number(formData.bedrooms)) || Number(formData.bedrooms) < 0)) {
      newErrors.bedrooms = "Broj spavaćih soba mora biti pozitivan broj"
    }

    if (formData.bathrooms && (isNaN(Number(formData.bathrooms)) || Number(formData.bathrooms) < 0)) {
      newErrors.bathrooms = "Broj kupaonica mora biti pozitivan broj"
    }

    if (formData.area && (isNaN(Number(formData.area)) || Number(formData.area) <= 0)) {
      newErrors.area = "Površina mora biti pozitivan broj"
    }

    if (formData.year_built) {
      const year = Number(formData.year_built)
      const currentYear = new Date().getFullYear()
      if (isNaN(year) || year < 1800 || year > currentYear) {
        newErrors.year_built = `Godina izgradnje mora biti između 1800 i ${currentYear}`
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setSubmitStatus("error")
      setSubmitMessage("Molimo ispravite greške u obrascu")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Prepare data for update
      const updateData = {
        title: formData.title,
        description: formData.description || null,
        property_type: formData.property_type || null,
        location: formData.location || null,
        address: formData.address || null,
        price: formData.price ? Number(formData.price) : null,
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
        area: formData.area ? Number(formData.area) : null,
        year_built: formData.year_built ? Number(formData.year_built) : null,
        heating: formData.heating || null,
        parking: formData.parking || null,
        featured: formData.featured,
        new: formData.new,
        images: propertyImages.length > 0 ? propertyImages : null,
      }

      const result = await updateProperty(property.id, updateData)

      if (result.success) {
        setSubmitStatus("success")
        setSubmitMessage("Nekretnina je uspješno ažurirana!")

        // Redirect after success
        setTimeout(() => {
          router.push(`/nekretnine/${property.id}`)
        }, 2000)
      } else {
        setSubmitStatus("error")
        setSubmitMessage(result.error || "Došlo je do greške prilikom ažuriranja nekretnine")
      }
    } catch (error) {
      console.error("Error updating property:", error)
      setSubmitStatus("error")
      setSubmitMessage("Došlo je do greške prilikom ažuriranja nekretnine")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Image management functions
  const handleMoveImage = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === propertyImages.length - 1)) {
      return // Can't move further in this direction
    }

    const newIndex = direction === "up" ? index - 1 : index + 1
    const newImages = [...propertyImages]
    const temp = newImages[index]
    newImages[index] = newImages[newIndex]
    newImages[newIndex] = temp

    setPropertyImages(newImages)
  }

  const handleDeleteImage = (index: number) => {
    if (!confirm("Jeste li sigurni da želite obrisati ovu sliku?")) {
      return
    }

    const newImages = propertyImages.filter((_, i) => i !== index)
    setPropertyImages(newImages)
  }

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return

    // Basic URL validation
    try {
      new URL(newImageUrl)
      setPropertyImages([...propertyImages, newImageUrl.trim()])
      setNewImageUrl("")
    } catch {
      alert("Molimo unesite valjanu URL adresu slike")
    }
  }

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return // Already primary

    const newImages = [...propertyImages]
    const primaryImage = newImages.splice(index, 1)[0]
    newImages.unshift(primaryImage)
    setPropertyImages(newImages)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="flex-grow pt-20">
        {/* Sticky Property Header */}
        <div className="sticky top-[80px] bg-white z-40 border-b border-gray-100 shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <Button variant="ghost" onClick={() => router.back()} className="p-0 h-auto">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Natrag
                  </Button>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Uredi nekretninu</h1>
                <p className="text-gray-600 text-sm">Ažurirajte informacije o nekretnini #{property.id}</p>
              </div>
              <div className="mt-3 md:mt-0 flex gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                  Odustani
                </Button>
                <Button
                  form="edit-property-form"
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-rose-400 hover:bg-rose-500"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Ažuriranje...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Spremi promjene
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pt-6 pb-8">
          {/* Status Messages */}
          {submitStatus && (
            <Alert
              className={cn(
                "mb-6",
                submitStatus === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200",
              )}
            >
              {submitStatus === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={submitStatus === "success" ? "text-green-700" : "text-red-700"}>
                {submitMessage}
              </AlertDescription>
            </Alert>
          )}

          <form id="edit-property-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Property Images */}
            <Card>
              <CardHeader>
                <CardTitle>Fotografije nekretnine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add new image */}
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="URL adresa nove slike..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddImage}
                    variant="outline"
                    className="text-rose-400 border-rose-400"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Dodaj
                  </Button>
                </div>

                {propertyImages.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-300" />
                    <p className="mt-2 text-gray-500">Nema fotografija za ovu nekretninu</p>
                    <p className="text-sm text-gray-400">Dodajte URL adresu slike iznad</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {propertyImages.map((imageUrl, index) => (
                      <div
                        key={index}
                        className={cn(
                          "relative group rounded-lg overflow-hidden border",
                          index === 0 ? "border-rose-400 ring-2 ring-rose-400" : "border-gray-200",
                        )}
                      >
                        <div className="aspect-[4/3] relative">
                          <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt={`Slika nekretnine ${property.id} - ${index + 1}`}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg?height=300&width=400&text=Slika+nije+dostupna"
                            }}
                          />
                        </div>

                        {/* Image controls overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => handleMoveImage(index, "up")}
                                disabled={index === 0}
                                className="h-8 w-8 p-0"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => handleMoveImage(index, "down")}
                                disabled={index === propertyImages.length - 1}
                                className="h-8 w-8 p-0"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </div>
                            {index !== 0 && (
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => handleSetPrimaryImage(index)}
                                className="text-xs"
                              >
                                Postavi kao glavnu
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteImage(index)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Primary badge */}
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-rose-400 text-white text-xs px-2 py-1 rounded">
                            Glavna
                          </div>
                        )}

                        {/* Position indicator */}
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {propertyImages.length > 0 && (
                  <p className="text-sm text-gray-500">
                    💡 Prva slika će biti prikazana kao glavna fotografija nekretnine. Koristite strelice za promjenu
                    redoslijeda.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Osnovne informacije</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title" className="required">
                      Naslov *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Naslov nekretnine"
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <Label htmlFor="property_type">Tip nekretnine</Label>
                    <Select
                      value={formData.property_type}
                      onValueChange={(value) => handleSelectChange("property_type", value)}
                    >
                      <SelectTrigger className={errors.property_type ? "border-red-500" : ""}>
                        <SelectValue placeholder="Odaberite tip" />
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
                    {errors.property_type && <p className="text-sm text-red-500 mt-1">{errors.property_type}</p>}
                  </div>

                  <div>
                    <Label htmlFor="price">Cijena (€)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="150000"
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Opis</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detaljan opis nekretnine..."
                    className="min-h-[120px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Lokacija</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Lokacija</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Zagreb, Centar"
                      className={errors.location ? "border-red-500" : ""}
                    />
                    {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
                  </div>

                  <div>
                    <Label htmlFor="address">Adresa</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Ilica 45"
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalji nekretnine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="area">Površina (m²)</Label>
                    <Input
                      id="area"
                      name="area"
                      type="number"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="75"
                      className={errors.area ? "border-red-500" : ""}
                    />
                    {errors.area && <p className="text-sm text-red-500 mt-1">{errors.area}</p>}
                  </div>

                  <div>
                    <Label htmlFor="bedrooms">Spavaće sobe</Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      placeholder="2"
                      className={errors.bedrooms ? "border-red-500" : ""}
                    />
                    {errors.bedrooms && <p className="text-sm text-red-500 mt-1">{errors.bedrooms}</p>}
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Kupaonica</Label>
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      placeholder="1"
                      className={errors.bathrooms ? "border-red-500" : ""}
                    />
                    {errors.bathrooms && <p className="text-sm text-red-500 mt-1">{errors.bathrooms}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="year_built">Godina izgradnje</Label>
                    <Input
                      id="year_built"
                      name="year_built"
                      type="number"
                      value={formData.year_built}
                      onChange={handleInputChange}
                      placeholder="2010"
                      className={errors.year_built ? "border-red-500" : ""}
                    />
                    {errors.year_built && <p className="text-sm text-red-500 mt-1">{errors.year_built}</p>}
                  </div>

                  <div>
                    <Label htmlFor="heating">Grijanje</Label>
                    <Select value={formData.heating} onValueChange={(value) => handleSelectChange("heating", value)}>
                      <SelectTrigger className={errors.heating ? "border-red-500" : ""}>
                        <SelectValue placeholder="Odaberite tip grijanja" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Centralno">Centralno</SelectItem>
                        <SelectItem value="Podno">Podno</SelectItem>
                        <SelectItem value="Klima uređaj">Klima uređaj</SelectItem>
                        <SelectItem value="Peć na drva">Peć na drva</SelectItem>
                        <SelectItem value="Plin">Plin</SelectItem>
                        <SelectItem value="Struja">Struja</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.heating && <p className="text-sm text-red-500 mt-1">{errors.heating}</p>}
                  </div>

                  <div>
                    <Label htmlFor="parking">Parking</Label>
                    <Select value={formData.parking} onValueChange={(value) => handleSelectChange("parking", value)}>
                      <SelectTrigger className={errors.parking ? "border-red-500" : ""}>
                        <SelectValue placeholder="Odaberite tip parkinga" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Garaža">Garaža</SelectItem>
                        <SelectItem value="Parking mjesto">Parking mjesto</SelectItem>
                        <SelectItem value="Ulica">Ulica</SelectItem>
                        <SelectItem value="Nema">Nema</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.parking && <p className="text-sm text-red-500 mt-1">{errors.parking}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Options */}
            <Card>
              <CardHeader>
                <CardTitle>Status nekretnine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleCheckboxChange("featured", checked as boolean)}
                    />
                    <Label htmlFor="featured">Istaknuta nekretnina</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="new"
                      checked={formData.new}
                      onCheckedChange={(checked) => handleCheckboxChange("new", checked as boolean)}
                    />
                    <Label htmlFor="new">Nova nekretnina</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

// Header Component (same as property details)
function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-16 py-4">
        {/* Navigation */}
        <nav className="flex flex-wrap items-center justify-between gap-2">
          <Link href="/" className="flex items-center text-black">
            <span className="text-2xl font-bold">Pačonž</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-black hover:text-black/90 border border-black/20">
              <Link href="/dodaj-nekretninu">Dodaj nekretninu</Link>
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-black hover:text-black/90 border border-black/20 w-[42px] text-xs sm:text-sm"
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
                <Button variant="ghost" size="icon" className="text-black hover:text-black/90 border border-black/20">
                  <Menu className="h-6 w-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[350px] p-4">
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
                  className="text-black hover:text-black/90 border rounded-full border-black/20"
                >
                  <User className="h-6 w-6" />
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
  )
}

// Footer Component (same as property details)
function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About & Contact */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold">Pačonž</span>
            </div>
            <p className="text-gray-400 text-sm">
              Vodeći portal za nekretnine u hrvatskoj. Pronađite svoj savršeni dom ili poslovni prostor uz našu pomoć.
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
  )
}
