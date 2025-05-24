"use client"

import type React from "react"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, ChevronRight, ChevronLeft, Check, X, Info } from "lucide-react"

type Step = "basic" | "details" | "location" | "features" | "media" | "price" | "preview"

export default function AddPropertyPage() {
  const [currentStep, setCurrentStep] = useState<Step>("basic")
  const [formData, setFormData] = useState({
    // Basic info
    title: "",
    description: "",
    propertyType: "",
    transactionType: "sale",

    // Details
    size: "",
    landSize: "",
    rooms: "",
    bathrooms: "",
    floors: "",
    yearBuilt: "",
    energyCertificate: "",

    // Location
    address: "",
    city: "",
    postalCode: "",
    region: "",
    latitude: "",
    longitude: "",

    // Features
    features: [] as string[],
    parking: false,
    garage: false,
    balcony: false,
    terrace: false,
    garden: false,
    elevator: false,
    airConditioning: false,
    heating: "",

    // Media
    images: [] as string[],
    videos: [] as string[],
    virtualTour: "",

    // Price
    price: "",
    pricePerSquareMeter: "",
    negotiable: false,
    includeVAT: true,
    commission: "",
    availability: "immediate",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleMultiSelectChange = (name: string, value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentValues = prev[name as keyof typeof prev] as string[]
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] }
      } else {
        return { ...prev, [name]: currentValues.filter((v) => v !== value) }
      }
    })
  }

  const nextStep = () => {
    switch (currentStep) {
      case "basic":
        setCurrentStep("details")
        break
      case "details":
        setCurrentStep("location")
        break
      case "location":
        setCurrentStep("features")
        break
      case "features":
        setCurrentStep("media")
        break
      case "media":
        setCurrentStep("price")
        break
      case "price":
        setCurrentStep("preview")
        break
      case "preview":
        handleSubmit()
        break
    }
  }

  const prevStep = () => {
    switch (currentStep) {
      case "details":
        setCurrentStep("basic")
        break
      case "location":
        setCurrentStep("details")
        break
      case "features":
        setCurrentStep("location")
        break
      case "media":
        setCurrentStep("features")
        break
      case "price":
        setCurrentStep("media")
        break
      case "preview":
        setCurrentStep("price")
        break
    }
  }

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)
    // Redirect to success page or dashboard
    alert("Nekretnina uspješno dodana!")
  }

  const steps = [
    { id: "basic", label: "Osnovni podaci" },
    { id: "details", label: "Detalji" },
    { id: "location", label: "Lokacija" },
    { id: "features", label: "Značajke" },
    { id: "media", label: "Fotografije i video" },
    { id: "price", label: "Cijena" },
    { id: "preview", label: "Pregled" },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-grow pt-32 sm:pt-36 md:pt-40 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Dodaj novu nekretninu</h1>
            <p className="text-gray-600 mb-8">Ispunite obrazac ispod kako biste dodali novu nekretninu na portal.</p>

            {/* Progress Steps */}
            <div className="mb-8 hidden md:block">
              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center relative ${
                      steps.findIndex((s) => s.id === currentStep) >= index ? "text-rose-500" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`
                      w-10 h-10 rounded-full flex items-center justify-center mb-2
                      ${
                        steps.findIndex((s) => s.id === currentStep) > index
                          ? "bg-rose-500 text-white"
                          : steps.findIndex((s) => s.id === currentStep) === index
                            ? "border-2 border-rose-500 text-rose-500"
                            : "border-2 border-gray-300 text-gray-400"
                      }
                    `}
                    >
                      {steps.findIndex((s) => s.id === currentStep) > index ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span className="text-xs font-medium">{step.label}</span>

                    {/* Connector line */}
                    {index < steps.length - 1 && (
                      <div
                        className={`
                        absolute top-5 left-[calc(100%_-_10px)] w-[calc(100%_-_20px)] h-[2px]
                        ${steps.findIndex((s) => s.id === currentStep) > index ? "bg-rose-500" : "bg-gray-300"}
                      `}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Step Indicator */}
            <div className="mb-6 md:hidden">
              <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-rose-100 text-rose-500 p-2 rounded-full mr-3">
                    <span className="font-medium">{steps.findIndex((s) => s.id === currentStep) + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Korak {steps.findIndex((s) => s.id === currentStep) + 1} od {steps.length}
                    </p>
                    <p className="font-medium">{steps.find((s) => s.id === currentStep)?.label}</p>
                  </div>
                </div>
                <div className="text-rose-500 font-medium">
                  {Math.round(((steps.findIndex((s) => s.id === currentStep) + 1) / steps.length) * 100)}%
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                {/* Step 1: Basic Info */}
                {currentStep === "basic" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Osnovni podaci o nekretnini</h2>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Naslov oglasa *</Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="npr. Luksuzni stan u centru Zagreba"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Opis nekretnine *</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Detaljan opis nekretnine..."
                          rows={6}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="propertyType">Vrsta nekretnine *</Label>
                          <Select
                            value={formData.propertyType}
                            onValueChange={(value) => handleSelectChange("propertyType", value)}
                          >
                            <SelectTrigger id="propertyType">
                              <SelectValue placeholder="Odaberite vrstu nekretnine" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="apartment">Stan</SelectItem>
                              <SelectItem value="house">Kuća</SelectItem>
                              <SelectItem value="land">Zemljište</SelectItem>
                              <SelectItem value="commercial">Poslovni prostor</SelectItem>
                              <SelectItem value="garage">Garaža</SelectItem>
                              <SelectItem value="vacation">Vikendica</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="transactionType">Vrsta transakcije *</Label>
                          <RadioGroup
                            value={formData.transactionType}
                            onValueChange={(value) => handleSelectChange("transactionType", value)}
                            className="flex gap-4 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="sale" id="transaction-sale" />
                              <Label htmlFor="transaction-sale" className="font-normal">
                                Prodaja
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="rent" id="transaction-rent" />
                              <Label htmlFor="transaction-rent" className="font-normal">
                                Najam
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Details */}
                {currentStep === "details" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Detalji nekretnine</h2>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="size">Stambena površina (m²) *</Label>
                          <Input
                            id="size"
                            name="size"
                            type="number"
                            value={formData.size}
                            onChange={handleInputChange}
                            placeholder="npr. 85"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="landSize">Površina zemljišta (m²)</Label>
                          <Input
                            id="landSize"
                            name="landSize"
                            type="number"
                            value={formData.landSize}
                            onChange={handleInputChange}
                            placeholder="npr. 150"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="rooms">Broj soba *</Label>
                          <Select value={formData.rooms} onValueChange={(value) => handleSelectChange("rooms", value)}>
                            <SelectTrigger id="rooms">
                              <SelectValue placeholder="Odaberite" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="1.5">1.5</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="2.5">2.5</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="3.5">3.5</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="4+">4+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="bathrooms">Broj kupaonica *</Label>
                          <Select
                            value={formData.bathrooms}
                            onValueChange={(value) => handleSelectChange("bathrooms", value)}
                          >
                            <SelectTrigger id="bathrooms">
                              <SelectValue placeholder="Odaberite" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4+">4+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="floors">Broj etaža</Label>
                          <Select
                            value={formData.floors}
                            onValueChange={(value) => handleSelectChange("floors", value)}
                          >
                            <SelectTrigger id="floors">
                              <SelectValue placeholder="Odaberite" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4+">4+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="yearBuilt">Godina izgradnje</Label>
                          <Input
                            id="yearBuilt"
                            name="yearBuilt"
                            type="number"
                            value={formData.yearBuilt}
                            onChange={handleInputChange}
                            placeholder="npr. 2010"
                          />
                        </div>

                        <div>
                          <Label htmlFor="energyCertificate">Energetski certifikat</Label>
                          <Select
                            value={formData.energyCertificate}
                            onValueChange={(value) => handleSelectChange("energyCertificate", value)}
                          >
                            <SelectTrigger id="energyCertificate">
                              <SelectValue placeholder="Odaberite" />
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
                              <SelectItem value="none">Nema certifikat</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Location */}
                {currentStep === "location" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Lokacija nekretnine</h2>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Adresa *</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Ulica i broj"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">Grad/Mjesto *</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="npr. Zagreb"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="postalCode">Poštanski broj *</Label>
                          <Input
                            id="postalCode"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                            placeholder="npr. 10000"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="region">Regija/Županija *</Label>
                          <Select
                            value={formData.region}
                            onValueChange={(value) => handleSelectChange("region", value)}
                          >
                            <SelectTrigger id="region">
                              <SelectValue placeholder="Odaberite" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="zagreb">Grad Zagreb</SelectItem>
                              <SelectItem value="zagrebacka">Zagrebačka županija</SelectItem>
                              <SelectItem value="splitsko-dalmatinska">Splitsko-dalmatinska županija</SelectItem>
                              <SelectItem value="primorsko-goranska">Primorsko-goranska županija</SelectItem>
                              <SelectItem value="istarska">Istarska županija</SelectItem>
                              <SelectItem value="osjecko-baranjska">Osječko-baranjska županija</SelectItem>
                              <SelectItem value="dubrovacko-neretvanska">Dubrovačko-neretvanska županija</SelectItem>
                              <SelectItem value="other">Ostalo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start mb-4">
                          <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                          <p className="text-sm text-gray-600">
                            Označite lokaciju na karti ili unesite koordinate ručno. Ovo će pomoći kupcima da lakše
                            pronađu vašu nekretninu.
                          </p>
                        </div>

                        <div className="h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                          <p className="text-gray-500">Karta za odabir lokacije</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="latitude">Geografska širina</Label>
                            <Input
                              id="latitude"
                              name="latitude"
                              value={formData.latitude}
                              onChange={handleInputChange}
                              placeholder="npr. 45.815399"
                            />
                          </div>

                          <div>
                            <Label htmlFor="longitude">Geografska dužina</Label>
                            <Input
                              id="longitude"
                              name="longitude"
                              value={formData.longitude}
                              onChange={handleInputChange}
                              placeholder="npr. 15.966568"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Features */}
                {currentStep === "features" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Značajke nekretnine</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Osnovna oprema</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="parking"
                              checked={formData.parking}
                              onCheckedChange={(checked) => handleCheckboxChange("parking", checked as boolean)}
                            />
                            <label
                              htmlFor="parking"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Parking
                            </label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="garage"
                              checked={formData.garage}
                              onCheckedChange={(checked) => handleCheckboxChange("garage", checked as boolean)}
                            />
                            <label
                              htmlFor="garage"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Garaža
                            </label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="balcony"
                              checked={formData.balcony}
                              onCheckedChange={(checked) => handleCheckboxChange("balcony", checked as boolean)}
                            />
                            <label
                              htmlFor="balcony"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Balkon
                            </label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="terrace"
                              checked={formData.terrace}
                              onCheckedChange={(checked) => handleCheckboxChange("terrace", checked as boolean)}
                            />
                            <label
                              htmlFor="terrace"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Terasa
                            </label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="garden"
                              checked={formData.garden}
                              onCheckedChange={(checked) => handleCheckboxChange("garden", checked as boolean)}
                            />
                            <label
                              htmlFor="garden"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Vrt
                            </label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="elevator"
                              checked={formData.elevator}
                              onCheckedChange={(checked) => handleCheckboxChange("elevator", checked as boolean)}
                            />
                            <label
                              htmlFor="elevator"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Lift
                            </label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="airConditioning"
                              checked={formData.airConditioning}
                              onCheckedChange={(checked) => handleCheckboxChange("airConditioning", checked as boolean)}
                            />
                            <label
                              htmlFor="airConditioning"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Klima uređaj
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="heating">Grijanje</Label>
                        <Select
                          value={formData.heating}
                          onValueChange={(value) => handleSelectChange("heating", value)}
                        >
                          <SelectTrigger id="heating">
                            <SelectValue placeholder="Odaberite vrstu grijanja" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="central">Centralno</SelectItem>
                            <SelectItem value="gas">Plinsko</SelectItem>
                            <SelectItem value="electric">Električno</SelectItem>
                            <SelectItem value="floor">Podno</SelectItem>
                            <SelectItem value="wood">Na drva</SelectItem>
                            <SelectItem value="none">Nema grijanje</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-3">Dodatne značajke</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            "Namješteno",
                            "Novogradnja",
                            "Adaptiran",
                            "Pogled na more",
                            "Bazen",
                            "Sauna",
                            "Jacuzzi",
                            "Teretana",
                            "Alarm",
                            "Video nadzor",
                            "Kućni ljubimci",
                            "Internet",
                            "Kabelska TV",
                            "Perilica rublja",
                            "Perilica posuđa",
                            "Hladnjak",
                          ].map((feature) => (
                            <div key={feature} className="flex items-center space-x-2">
                              <Checkbox
                                id={`feature-${feature}`}
                                checked={formData.features.includes(feature)}
                                onCheckedChange={(checked) =>
                                  handleMultiSelectChange("features", feature, checked as boolean)
                                }
                              />
                              <label
                                htmlFor={`feature-${feature}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {feature}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Media */}
                {currentStep === "media" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Fotografije i video</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Fotografije nekretnine *</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Dodajte najmanje 3 fotografije. Prva fotografija će biti naslovna. Preporučena veličina:
                          1200x800px.
                        </p>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">Povucite i ispustite fotografije ovdje ili</p>
                          <Button variant="outline" size="sm">
                            Odaberite fotografije
                          </Button>
                          <p className="text-xs text-gray-500 mt-2">
                            Podržani formati: JPG, PNG (max 5MB po fotografiji)
                          </p>
                        </div>

                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {/* Placeholder for uploaded images */}
                          <div className="relative aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                            <p className="text-xs text-gray-500">Fotografija 1</p>
                            <button className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm">
                              <X className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                          <div className="relative aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                            <p className="text-xs text-gray-500">Fotografija 2</p>
                            <button className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm">
                              <X className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                          <div className="relative aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                            <p className="text-xs text-gray-500">Fotografija 3</p>
                            <button className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm">
                              <X className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-3">Video (opcionalno)</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Dodajte video obilazak nekretnine. Možete dodati YouTube ili Vimeo poveznicu.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="videoUrl">Video poveznica</Label>
                            <Input id="videoUrl" name="videoUrl" placeholder="npr. https://youtube.com/watch?v=..." />
                          </div>

                          <div>
                            <Label htmlFor="virtualTour">Virtualna šetnja (360°)</Label>
                            <Input
                              id="virtualTour"
                              name="virtualTour"
                              value={formData.virtualTour}
                              onChange={handleInputChange}
                              placeholder="Poveznica na virtualnu šetnju"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 6: Price */}
                {currentStep === "price" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Cijena i dostupnost</h2>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">
                            Cijena ({formData.transactionType === "rent" ? "mjesečno" : "ukupno"}) *
                          </Label>
                          <div className="relative">
                            <Input
                              id="price"
                              name="price"
                              type="number"
                              value={formData.price}
                              onChange={handleInputChange}
                              placeholder="npr. 150000"
                              className="pl-8"
                              required
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="pricePerSquareMeter">Cijena po m²</Label>
                          <div className="relative">
                            <Input
                              id="pricePerSquareMeter"
                              name="pricePerSquareMeter"
                              type="number"
                              value={formData.pricePerSquareMeter}
                              onChange={handleInputChange}
                              placeholder="Automatski izračun"
                              className="pl-8"
                              disabled
                            />
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="negotiable"
                          checked={formData.negotiable}
                          onCheckedChange={(checked) => handleCheckboxChange("negotiable", checked as boolean)}
                        />
                        <label
                          htmlFor="negotiable"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Cijena je podložna pregovorima
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="includeVAT"
                          checked={formData.includeVAT}
                          onCheckedChange={(checked) => handleCheckboxChange("includeVAT", checked as boolean)}
                        />
                        <label
                          htmlFor="includeVAT"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Cijena uključuje PDV
                        </label>
                      </div>

                      {formData.transactionType === "sale" && (
                        <div>
                          <Label htmlFor="commission">Agencijska provizija (%)</Label>
                          <Input
                            id="commission"
                            name="commission"
                            type="number"
                            value={formData.commission}
                            onChange={handleInputChange}
                            placeholder="npr. 2"
                          />
                        </div>
                      )}

                      <div>
                        <Label htmlFor="availability">Dostupnost</Label>
                        <Select
                          value={formData.availability}
                          onValueChange={(value) => handleSelectChange("availability", value)}
                        >
                          <SelectTrigger id="availability">
                            <SelectValue placeholder="Odaberite" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Odmah</SelectItem>
                            <SelectItem value="1month">Za 1 mjesec</SelectItem>
                            <SelectItem value="3months">Za 3 mjeseca</SelectItem>
                            <SelectItem value="6months">Za 6 mjeseci</SelectItem>
                            <SelectItem value="custom">Po dogovoru</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 7: Preview */}
                {currentStep === "preview" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Pregled oglasa</h2>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                      <div className="flex items-center">
                        <div className="mr-4 p-2 bg-green-100 rounded-full">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Sve je spremno!</h3>
                          <p className="text-sm text-gray-600">Pregledajte podatke o nekretnini prije objave oglasa.</p>
                        </div>
                      </div>
                    </div>

                    <Tabs defaultValue="basic">
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="basic">Osnovni podaci</TabsTrigger>
                        <TabsTrigger value="details">Detalji i značajke</TabsTrigger>
                        <TabsTrigger value="media">Fotografije i cijena</TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-500">Naslov oglasa</p>
                            <p className="font-medium">{formData.title || "Nije uneseno"}</p>
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-500">Vrsta nekretnine</p>
                            <p className="font-medium">
                              {formData.propertyType === "apartment"
                                ? "Stan"
                                : formData.propertyType === "house"
                                  ? "Kuća"
                                  : formData.propertyType === "land"
                                    ? "Zemljište"
                                    : formData.propertyType === "commercial"
                                      ? "Poslovni prostor"
                                      : formData.propertyType === "garage"
                                        ? "Garaža"
                                        : formData.propertyType === "vacation"
                                          ? "Vikendica"
                                          : "Nije odabrano"}
                            </p>
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-500">Vrsta transakcije</p>
                            <p className="font-medium">{formData.transactionType === "sale" ? "Prodaja" : "Najam"}</p>
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-500">Lokacija</p>
                            <p className="font-medium">
                              {formData.city ? `${formData.address}, ${formData.city}` : "Nije uneseno"}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <p className="text-sm text-gray-500">Opis nekretnine</p>
                          <p className="mt-1">{formData.description || "Nije uneseno"}</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="details" className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-500">Površina</p>
                            <p className="font-medium">{formData.size ? `${formData.size} m²` : "Nije uneseno"}</p>
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-500">Broj soba</p>
                            <p className="font-medium">{formData.rooms || "Nije uneseno"}</p>
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-500">Broj kupaonica</p>
                            <p className="font-medium">{formData.bathrooms || "Nije uneseno"}</p>
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-500">Godina izgradnje</p>
                            <p className="font-medium">{formData.yearBuilt || "Nije uneseno"}</p>
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <p className="text-sm text-gray-500 mb-2">Značajke</p>
                          <div className="flex flex-wrap gap-2">
                            {formData.parking && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">Parking</span>
                            )}
                            {formData.garage && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">Garaža</span>
                            )}
                            {formData.balcony && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">Balkon</span>
                            )}
                            {formData.terrace && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">Terasa</span>
                            )}
                            {formData.garden && <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">Vrt</span>}
                            {formData.elevator && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">Lift</span>
                            )}
                            {formData.airConditioning && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">Klima uređaj</span>
                            )}
                            {formData.features.map((feature) => (
                              <span key={feature} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                {feature}
                              </span>
                            ))}
                            {!formData.parking &&
                              !formData.garage &&
                              !formData.balcony &&
                              !formData.terrace &&
                              !formData.garden &&
                              !formData.elevator &&
                              !formData.airConditioning &&
                              formData.features.length === 0 && <span className="text-gray-500">Nije odabrano</span>}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="media" className="space-y-4">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <p className="text-sm text-gray-500 mb-2">Fotografije</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                              <p className="text-xs text-gray-500">Fotografija 1</p>
                            </div>
                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                              <p className="text-xs text-gray-500">Fotografija 2</p>
                            </div>
                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                              <p className="text-xs text-gray-500">Fotografija 3</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-500">Cijena</p>
                            <p className="font-medium">{formData.price ? `${formData.price} €` : "Nije uneseno"}</p>
                            {formData.negotiable && (
                              <p className="text-xs text-gray-500 mt-1">Cijena je podložna pregovorima</p>
                            )}
                          </div>

                          <div className="p-4 border border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-500">Dostupnost</p>
                            <p className="font-medium">
                              {formData.availability === "immediate"
                                ? "Odmah"
                                : formData.availability === "1month"
                                  ? "Za 1 mjesec"
                                  : formData.availability === "3months"
                                    ? "Za 3 mjeseca"
                                    : formData.availability === "6months"
                                      ? "Za 6 mjeseci"
                                      : formData.availability === "custom"
                                        ? "Po dogovoru"
                                        : "Nije odabrano"}
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium mb-2">Opcije objave</h3>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="publish-now" defaultChecked />
                        <label
                          htmlFor="publish-now"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Objavi odmah
                        </label>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox id="featured" />
                        <label
                          htmlFor="featured"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Istakni oglas (dodatna naplata)
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  {currentStep !== "basic" ? (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Natrag
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  <Button type="button" className="bg-rose-500 hover:bg-rose-600" onClick={nextStep}>
                    {currentStep === "preview" ? "Objavi oglas" : "Nastavi"}
                    {currentStep !== "preview" && <ChevronRight className="ml-1 h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
