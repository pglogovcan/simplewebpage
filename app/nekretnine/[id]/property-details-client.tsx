"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Heart,
  Share2,
  Calendar,
  Home,
  Check,
  Phone,
  Mail,
  ArrowRight,
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
  Calculator,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AuthDialog } from "@/components/auth-dialog"
import MortgageCalculator from "@/components/mortgage-calculator"
import NeighborhoodInfo from "@/components/neighborhood-info"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PropertyContactForm } from "@/components/property-contact-form"
import { useMobile } from "@/hooks/use-mobile"

interface PropertyDetailsClientProps {
  property: any
  similarProperties: any[]
  neighborhoodData: any
}

export default function PropertyDetailsClient({
  property,
  similarProperties,
  neighborhoodData,
}: PropertyDetailsClientProps) {
  const router = useRouter()
  const isMobile = useMobile()

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showAllFeatures, setShowAllFeatures] = useState(false)
  const [mortgageDialogOpen, setMortgageDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  // Safely parse JSON fields if they are strings
  const [images, setImages] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])

  useEffect(() => {
    // Parse images
    try {
      if (typeof property.images === "string") {
        setImages(JSON.parse(property.images))
      } else if (Array.isArray(property.images)) {
        setImages(property.images)
      } else {
        // Fallback
        setImages(["/placeholder.svg?height=600&width=800&text=No+Image+Available"])
      }
    } catch (e) {
      console.error("Error parsing images:", e)
      setImages(["/placeholder.svg?height=600&width=800&text=Error+Loading+Image"])
    }

    // Parse features - now handling JSONB data from Supabase
    try {
      if (typeof property.features === "string") {
        setFeatures(JSON.parse(property.features))
      } else if (Array.isArray(property.features)) {
        setFeatures(property.features)
      } else if (property.features && typeof property.features === "object") {
        // If it's already an object (from JSONB), convert to array if needed
        setFeatures(
          Array.isArray(Object.values(property.features)[0])
            ? Object.values(property.features)[0]
            : Object.values(property.features),
        )
      } else {
        // Fallback
        setFeatures([])
      }
    } catch (e) {
      console.error("Error parsing features:", e)
      setFeatures([])
    }
  }, [property])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
      price,
    )
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("hr-HR", { day: "numeric", month: "long", year: "numeric" }).format(date)
    } catch (e) {
      return "Datum nije dostupan"
    }
  }

  const nextImage = () => {
    if (images.length <= 1) return
    setActiveImageIndex((activeImageIndex + 1) % images.length)
  }

  const prevImage = () => {
    if (images.length <= 1) return
    setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length)
  }

  const setImage = (index: number) => {
    setActiveImageIndex(index)
  }

  // Ensure agent data is available
  const agent = property.agent || {
    name: "Agent",
    email: "contact@example.com",
    phone: "+385 99 123 4567",
    image_url: "/placeholder.svg?height=200&width=200&text=Agent",
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="flex-grow pt-20">
        {isMobile ? (
          /* Mobile layout - no sticky header, property info at the top */
          <div className="container mx-auto px-4 pt-6">
            {/* Property title and price */}
            <div className="mb-4">
              <h1 className="text-xl font-bold text-gray-900">{property.title}</h1>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPin className="h-3 w-3 mr-1 text-rose-400" />
                <span>{property.address || property.location}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-2xl font-bold text-gray-900">{formatPrice(property.price)}</div>
                <div className="text-sm text-gray-500">
                  {property.area} m² • {Math.round(property.price / property.area)} €/m²
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>Spremi</span>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-1">
                  <Share2 className="h-4 w-4" />
                  <span>Dijeli</span>
                </Button>
              </div>
            </div>

            {/* Image gallery */}
            <div className="mb-8">
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                {images.length > 0 ? (
                  images.map((image: string, index: number) => (
                    <div
                      key={index}
                      className={cn(
                        "absolute inset-0 transition-opacity duration-300",
                        activeImageIndex === index ? "opacity-100" : "opacity-0",
                      )}
                    >
                      <Image
                        src={image || "/placeholder.svg?height=600&width=800&text=No+Image"}
                        alt={`${property.title} - slika ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">Slika nije dostupna</p>
                  </div>
                )}

                {/* Navigation arrows - only show if there are multiple images */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors z-10"
                      aria-label="Prethodna slika"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>

                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors z-10"
                      aria-label="Sljedeća slika"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Image counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full z-10">
                      {activeImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails - only show if there are multiple images */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setImage(index)}
                      className={cn(
                        "relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border-2",
                        activeImageIndex === index ? "border-rose-400" : "border-transparent",
                      )}
                      aria-label={`Slika ${index + 1}`}
                    >
                      <Image
                        src={image || "/placeholder.svg?height=600&width=800&text=No+Image"}
                        alt={`${property.title} - thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Add mortgage calculator button */}
              <div className="mt-4 flex justify-start">
                <Button
                  onClick={() => setMortgageDialogOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2 border-teal-600 text-teal-600 hover:bg-teal-50"
                >
                  Izračunaj ratu kredita
                  <Calculator className="h-4 w-4" />
                </Button>
              </div>

              {/* Mortgage calculator dialog */}
              <Dialog open={mortgageDialogOpen} onOpenChange={setMortgageDialogOpen}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Kalkulator kredita</DialogTitle>
                  </DialogHeader>
                  <MortgageCalculator propertyPrice={property.price} />
                </DialogContent>
              </Dialog>
            </div>

            {/* Property details */}
            <div className="space-y-6">
              <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6 w-full">
                  <TabsTrigger value="details" className="flex-1">
                    Detalji
                  </TabsTrigger>
                  {features.length > 0 && (
                    <TabsTrigger value="features" className="flex-1">
                      Karakteristike
                    </TabsTrigger>
                  )}
                  <TabsTrigger value="location" className="flex-1">
                    Lokacija
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Osnovne informacije</h2>
                    <div className="grid grid-cols-2 gap-y-4">
                      <div className="flex items-center gap-2">
                        <Bed className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Spavaće sobe</div>
                          <div className="font-medium">{property.bedrooms}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Kupaonice</div>
                          <div className="font-medium">{property.bathrooms}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Maximize className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Površina</div>
                          <div className="font-medium">{property.area} m²</div>
                        </div>
                      </div>
                      {property.land_area && (
                        <div className="flex items-center gap-2">
                          <Maximize className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Zemljište</div>
                            <div className="font-medium">{property.land_area} m²</div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Tip</div>
                          <div className="font-medium">{property.property_type || "Nije definirano"}</div>
                        </div>
                      </div>
                      {property.year_built && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Godina izgradnje</div>
                            <div className="font-medium">{property.year_built}.</div>
                          </div>
                        </div>
                      )}
                      {property.floor !== undefined && (
                        <div className="flex items-center gap-2">
                          <Home className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Kat</div>
                            <div className="font-medium">
                              {property.floor}. / {property.total_floors || "?"}
                            </div>
                          </div>
                        </div>
                      )}
                      {property.heating && (
                        <div className="flex items-center gap-2">
                          <Home className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Grijanje</div>
                            <div className="font-medium">{property.heating}</div>
                          </div>
                        </div>
                      )}
                      {property.parking && (
                        <div className="flex items-center gap-2">
                          <Home className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm text-gray-500">Parking</div>
                            <div className="font-medium">{property.parking}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4">Opis</h2>
                    <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
                  </div>

                  {features.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold mb-4">Karakteristike</h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAllFeatures(!showAllFeatures)}
                          className="text-rose-400 hover:text-rose-500"
                        >
                          {showAllFeatures ? "Prikaži manje" : "Prikaži sve"}
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                        {(showAllFeatures ? features : features.slice(0, 6)).map((feature: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-rose-400" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {features.length > 0 && (
                  <TabsContent value="features" className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Sve karakteristike</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                        {features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-rose-400" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                )}

                <TabsContent value="location">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Lokacija</h2>
                    <div className="bg-gray-100 rounded-lg h-[300px] flex items-center justify-center mb-4">
                      <div className="text-center p-6">
                        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Karta lokacije</p>
                        <p className="text-gray-700 font-medium mt-2">{property.address || property.location}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">U blizini:</h3>
                      <div className="grid grid-cols-1 gap-y-2">
                        {neighborhoodData?.pointsOfInterest?.slice(0, 4).map((poi: any, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-rose-400" />
                            <span className="text-gray-700">
                              {poi.name} ({poi.distance})
                            </span>
                          </div>
                        )) || (
                          <>
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-rose-400" />
                              <span className="text-gray-700">Javni prijevoz (150m)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-rose-400" />
                              <span className="text-gray-700">Trgovina (300m)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-rose-400" />
                              <span className="text-gray-700">Škola (500m)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-rose-400" />
                              <span className="text-gray-700">Park (400m)</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Agent info and contact */}
              <div className="mt-8">
                <PropertyContactForm
                  agentName={property.agent.name}
                  agentTitle={property.agent.title || "Agent za nekretnine"}
                  agentPhoto={property.agent.photo || "/placeholder.svg?height=200&width=200&text=Agent"}
                  agentPhone={property.agent.phone}
                  agentEmail={property.agent.email}
                  propertyId={`ID-${property.id}`}
                  publishDate={formatDate(property.created_at)}
                  agentRating={property.agent.average_rating}
                  agentExperience={property.agent.experience}
                />
                <Link href={`/agenti/${property.agent.id}`} passHref>
                  <Button variant="outline" className="w-full mt-2 flex items-center justify-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Pogledaj profil agenta</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Similar properties */}
            {similarProperties && similarProperties.length > 0 && (
              <div className="mt-16 bg-gray-50 py-12 -mx-4 px-4">
                <div className="container mx-auto">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Slične nekretnine</h2>
                      <p className="text-gray-600 mt-1">Pogledajte još nekretnina koje bi vam se mogle svidjeti</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {similarProperties.map((similarProperty) => {
                      // Safely parse images
                      let similarImages = []
                      try {
                        similarImages =
                          typeof similarProperty.images === "string"
                            ? JSON.parse(similarProperty.images)
                            : Array.isArray(similarProperty.images)
                              ? similarProperty.images
                              : []
                      } catch (e) {
                        similarImages = ["/placeholder.svg?height=400&width=600&text=No+Image"]
                      }

                      return (
                        <Link href={`/nekretnine/${similarProperty.id}`} key={similarProperty.id} className="group">
                          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                            <div className="relative h-48">
                              <Image
                                src={similarImages[0] || "/placeholder.svg?height=400&width=600&text=No+Image"}
                                alt={similarProperty.title}
                                fill
                                className="object-cover"
                              />
                              {similarProperty.featured && (
                                <div className="absolute top-3 left-3 bg-rose-400 text-white text-xs font-semibold px-2 py-1 rounded">
                                  IZDVOJENO
                                </div>
                              )}
                              {similarProperty.new && (
                                <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                  NOVO
                                </div>
                              )}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                <div className="text-white font-bold text-xl">{formatPrice(similarProperty.price)}</div>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-start gap-1 text-gray-500 text-sm mb-2">
                                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                <span>{similarProperty.location}</span>
                              </div>
                              <h3 className="font-semibold text-lg mb-2 group-hover:text-rose-500 transition-colors">
                                {similarProperty.title}
                              </h3>
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center gap-4">
                                  {similarProperty.bedrooms > 0 && (
                                    <div className="flex items-center gap-1">
                                      <Bed className="h-4 w-4 text-gray-400" />
                                      <span>{similarProperty.bedrooms}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Bath className="h-4 w-4 text-gray-400" />
                                    <span>{similarProperty.bathrooms}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Maximize className="h-4 w-4 text-gray-400" />
                                    <span>{similarProperty.area} m²</span>
                                  </div>
                                </div>
                                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                  {similarProperty.property_type || "Nekretnina"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Desktop layout - with sticky header */
          <>
            {/* Sticky Property Header */}
            <div className="sticky top-[80px] bg-white z-40 border-b border-gray-100 shadow-sm">
              <div className="container mx-auto px-4 py-3">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{property.title}</h1>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-3 w-3 mr-1 text-rose-400" />
                      <span>{property.address || property.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {property.featured && (
                        <span className="bg-rose-400 text-white text-xs font-semibold px-2 py-0.5 rounded">
                          IZDVOJENO
                        </span>
                      )}
                      <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded">
                        {property.property_type ? property.property_type.toUpperCase() : "NEKRETNINA"}
                      </span>
                      {property.energy_certificate && (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded">
                          ENERGETSKI RAZRED {property.energy_certificate}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 md:mt-0 flex flex-col items-end">
                    <div className="text-2xl font-bold text-gray-900">{formatPrice(property.price)}</div>
                    <div className="text-gray-500 text-sm">
                      {property.area} m² • {Math.round(property.price / property.area)} €/m²
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>Spremi</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                        <span>Podijeli</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 pt-24 pb-8">
              {/* Image gallery */}
              <div className="mb-8">
                <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                  {images.length > 0 ? (
                    images.map((image: string, index: number) => (
                      <div
                        key={index}
                        className={cn(
                          "absolute inset-0 transition-opacity duration-300",
                          activeImageIndex === index ? "opacity-100" : "opacity-0",
                        )}
                      >
                        <Image
                          src={image || "/placeholder.svg?height=600&width=800&text=No+Image"}
                          alt={`${property.title} - slika ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <p className="text-gray-500">Slika nije dostupna</p>
                    </div>
                  )}

                  {/* Navigation arrows - only show if there are multiple images */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors z-10"
                        aria-label="Prethodna slika"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>

                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-colors z-10"
                        aria-label="Sljedeća slika"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>

                      {/* Image counter */}
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full z-10">
                        {activeImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails - only show if there are multiple images */}
                {images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {images.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setImage(index)}
                        className={cn(
                          "relative h-20 w-20 sm:h-24 sm:w-24 rounded-md overflow-hidden flex-shrink-0 border-2",
                          activeImageIndex === index ? "border-rose-400" : "border-transparent",
                        )}
                        aria-label={`Slika ${index + 1}`}
                      >
                        <Image
                          src={image || "/placeholder.svg?height=600&width=800&text=No+Image"}
                          alt={`${property.title} - thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Add mortgage calculator button */}
                <div className="mt-4 flex justify-start">
                  <Button
                    onClick={() => setMortgageDialogOpen(true)}
                    variant="outline"
                    className="flex items-center gap-2 border-teal-600 text-teal-600 hover:bg-teal-50"
                  >
                    Izračunaj ratu kredita
                    <Calculator className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mortgage calculator dialog */}
                <Dialog open={mortgageDialogOpen} onOpenChange={setMortgageDialogOpen}>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">Kalkulator kredita</DialogTitle>
                    </DialogHeader>
                    <MortgageCalculator propertyPrice={property.price} />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Main content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left column - Property details */}
                <div className="lg:col-span-2">
                  <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                      <TabsTrigger value="details">Detalji</TabsTrigger>
                      {features.length > 0 && <TabsTrigger value="features">Karakteristike</TabsTrigger>}
                      <TabsTrigger value="location">Lokacija</TabsTrigger>
                      <TabsTrigger value="neighborhood">Kvart</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Osnovne informacije</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4">
                          <div className="flex items-center gap-2">
                            <Bed className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-500">Spavaće sobe</div>
                              <div className="font-medium">{property.bedrooms}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Bath className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-500">Kupaonice</div>
                              <div className="font-medium">{property.bathrooms}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Maximize className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-500">Površina</div>
                              <div className="font-medium">{property.area} m²</div>
                            </div>
                          </div>
                          {property.land_area && (
                            <div className="flex items-center gap-2">
                              <Maximize className="h-5 w-5 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-500">Zemljište</div>
                                <div className="font-medium">{property.land_area} m²</div>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Home className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="text-sm text-gray-500">Tip</div>
                              <div className="font-medium">{property.property_type || "Nije definirano"}</div>
                            </div>
                          </div>
                          {property.year_built && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-500">Godina izgradnje</div>
                                <div className="font-medium">{property.year_built}.</div>
                              </div>
                            </div>
                          )}
                          {property.floor !== undefined && (
                            <div className="flex items-center gap-2">
                              <Home className="h-5 w-5 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-500">Kat</div>
                                <div className="font-medium">
                                  {property.floor}. / {property.total_floors || "?"}
                                </div>
                              </div>
                            </div>
                          )}
                          {property.heating && (
                            <div className="flex items-center gap-2">
                              <Home className="h-5 w-5 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-500">Grijanje</div>
                                <div className="font-medium">{property.heating}</div>
                              </div>
                            </div>
                          )}
                          {property.parking && (
                            <div className="flex items-center gap-2">
                              <Home className="h-5 w-5 text-gray-400" />
                              <div>
                                <div className="text-sm text-gray-500">Parking</div>
                                <div className="font-medium">{property.parking}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold mb-4">Opis</h2>
                        <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
                      </div>

                      {features.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold mb-4">Karakteristike</h2>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowAllFeatures(!showAllFeatures)}
                              className="text-rose-400 hover:text-rose-500"
                            >
                              {showAllFeatures ? "Prikaži manje" : "Prikaži sve"}
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                            {(showAllFeatures ? features : features.slice(0, 6)).map(
                              (feature: string, index: number) => (
                                <div key={index} className="flex items-center gap-2">
                                  <Check className="h-4 w-4 text-rose-400" />
                                  <span className="text-gray-700">{feature}</span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    {features.length > 0 && (
                      <TabsContent value="features" className="space-y-6">
                        <div>
                          <h2 className="text-xl font-semibold mb-4">Sve karakteristike</h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                            {features.map((feature: string, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-rose-400" />
                                <span className="text-gray-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    )}

                    <TabsContent value="location">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Lokacija</h2>
                        <div className="bg-gray-100 rounded-lg h-[400px] flex items-center justify-center mb-4">
                          <div className="text-center p-6">
                            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Karta lokacije</p>
                            <p className="text-gray-700 font-medium mt-2">{property.address || property.location}</p>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">U blizini:</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                            {neighborhoodData?.pointsOfInterest?.slice(0, 4).map((poi: any, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-rose-400" />
                                <span className="text-gray-700">
                                  {poi.name} ({poi.distance})
                                </span>
                              </div>
                            )) || (
                              <>
                                <div className="flex items-center gap-2">
                                  <Check className="h-4 w-4 text-rose-400" />
                                  <span className="text-gray-700">Javni prijevoz (150m)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Check className="h-4 w-4 text-rose-400" />
                                  <span className="text-gray-700">Trgovina (300m)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Check className="h-4 w-4 text-rose-400" />
                                  <span className="text-gray-700">Škola (500m)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Check className="h-4 w-4 text-rose-400" />
                                  <span className="text-gray-700">Park (400m)</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="neighborhood">
                      {neighborhoodData && (
                        <NeighborhoodInfo
                          propertyAddress={property.address || property.location}
                          neighborhoodData={neighborhoodData}
                          hideRatings={true}
                        />
                      )}
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Right column - Agent info and contact */}
                <div id="contact-form">
                  <div className="sticky top-[180px] space-y-6 z-30">
                    <PropertyContactForm
                      agentName={property.agent.name}
                      agentTitle={property.agent.title || "Agent za nekretnine"}
                      agentPhoto={property.agent.photo || "/placeholder.svg?height=200&width=200&text=Agent"}
                      agentPhone={property.agent.phone}
                      agentEmail={property.agent.email}
                      propertyId={`ID-${property.id}`}
                      publishDate={formatDate(property.created_at)}
                      agentRating={property.agent.average_rating}
                      agentExperience={property.agent.experience}
                    />
                    <Link href={`/agenti/${property.agent.id}`} passHref>
                      <Button variant="outline" className="w-full mt-2 flex items-center justify-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Pogledaj profil agenta</span>
                      </Button>
                    </Link>

                    {/* Neighborhood highlight box - simplified */}
                    {neighborhoodData && activeTab !== "neighborhood" && (
                      <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">Kvart {neighborhoodData.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveTab("neighborhood")}
                            className="text-rose-400 hover:text-rose-500 p-0 h-auto text-xs"
                          >
                            Više
                          </Button>
                        </div>

                        {/* POI summary */}
                        <div className="text-xs text-gray-500">
                          U blizini:{" "}
                          {Object.entries(
                            neighborhoodData.pointsOfInterest.reduce((acc: any, poi: any) => {
                              if (!acc[poi.type]) acc[poi.type] = 0
                              acc[poi.type]++
                              return acc
                            }, {}),
                          )
                            .slice(0, 3)
                            .map(([type, count]: [string, any], index, array) => (
                              <span key={type}>
                                {type === "school"
                                  ? `${count} škola`
                                  : type === "shop"
                                    ? `${count} trgovina`
                                    : type === "restaurant"
                                      ? `${count} restoran`
                                      : type === "transport"
                                        ? `${count} prijevoz`
                                        : type === "park"
                                          ? `${count} park`
                                          : `${count} ostalo`}
                                {index < array.length - 1 ? ", " : ""}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Similar properties */}
              {similarProperties && similarProperties.length > 0 && (
                <div className="mt-16 bg-gray-50 py-12 -mx-4 px-4">
                  <div className="container mx-auto">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Slične nekretnine</h2>
                        <p className="text-gray-600 mt-1">Pogledajte još nekretnina koje bi vam se mogle svidjeti</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {similarProperties.map((similarProperty) => {
                        // Safely parse images
                        let similarImages = []
                        try {
                          similarImages =
                            typeof similarProperty.images === "string"
                              ? JSON.parse(similarProperty.images)
                              : Array.isArray(similarProperty.images)
                                ? similarProperty.images
                                : []
                        } catch (e) {
                          similarImages = ["/placeholder.svg?height=400&width=600&text=No+Image"]
                        }

                        return (
                          <Link href={`/nekretnine/${similarProperty.id}`} key={similarProperty.id} className="group">
                            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                              <div className="relative h-48">
                                <Image
                                  src={similarImages[0] || "/placeholder.svg?height=400&width=600&text=No+Image"}
                                  alt={similarProperty.title}
                                  fill
                                  className="object-cover"
                                />
                                {similarProperty.featured && (
                                  <div className="absolute top-3 left-3 bg-rose-400 text-white text-xs font-semibold px-2 py-1 rounded">
                                    IZDVOJENO
                                  </div>
                                )}
                                {similarProperty.new && (
                                  <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                                    NOVO
                                  </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                  <div className="text-white font-bold text-xl">
                                    {formatPrice(similarProperty.price)}
                                  </div>
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="flex items-start gap-1 text-gray-500 text-sm mb-2">
                                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                  <span>{similarProperty.location}</span>
                                </div>
                                <h3 className="font-semibold text-lg mb-2 group-hover:text-rose-500 transition-colors">
                                  {similarProperty.title}
                                </h3>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                  <div className="flex items-center gap-4">
                                    {similarProperty.bedrooms > 0 && (
                                      <div className="flex items-center gap-1">
                                        <Bed className="h-4 w-4 text-gray-400" />
                                        <span>{similarProperty.bedrooms}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <Bath className="h-4 w-4 text-gray-400" />
                                      <span>{similarProperty.bathrooms}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Maximize className="h-4 w-4 text-gray-400" />
                                      <span>{similarProperty.area} m²</span>
                                    </div>
                                  </div>
                                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                    {similarProperty.property_type || "Nekretnina"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

// Header Component
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

// Footer Component
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
              Vodeći portal za nekretnine u Hrvatskoj. Pronađite svoj savršeni dom ili poslovni prostor uz našu pomoć.
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
