"use client"

import type React from "react"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Check, ChevronRight, Upload, Building2, User, MapPin, CreditCard, Shield } from "lucide-react"

type Step = "basic-info" | "contact-info" | "representative" | "areas" | "subscription" | "verification"

export default function AgencyRegistrationPage() {
  const [currentStep, setCurrentStep] = useState<Step>("basic-info")
  const [formData, setFormData] = useState({
    // Basic info
    agencyName: "",
    agencyType: "real-estate",
    yearEstablished: "",
    registrationNumber: "",
    vatNumber: "",
    website: "",
    description: "",

    // Contact info
    address: "",
    city: "",
    postalCode: "",
    country: "Hrvatska",
    phone: "",
    email: "",
    facebook: "",
    instagram: "",
    linkedin: "",

    // Representative
    repName: "",
    repPosition: "",
    repEmail: "",
    repPhone: "",
    password: "",
    confirmPassword: "",

    // Areas
    regions: [] as string[],
    specializations: [] as string[],
    numberOfAgents: "1-5",

    // Subscription
    plan: "standard",

    // Verification
    termsAccepted: false,
    privacyAccepted: false,
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
      case "basic-info":
        setCurrentStep("contact-info")
        break
      case "contact-info":
        setCurrentStep("representative")
        break
      case "representative":
        setCurrentStep("areas")
        break
      case "areas":
        setCurrentStep("subscription")
        break
      case "subscription":
        setCurrentStep("verification")
        break
      case "verification":
        handleSubmit()
        break
    }
  }

  const prevStep = () => {
    switch (currentStep) {
      case "contact-info":
        setCurrentStep("basic-info")
        break
      case "representative":
        setCurrentStep("contact-info")
        break
      case "areas":
        setCurrentStep("representative")
        break
      case "subscription":
        setCurrentStep("areas")
        break
      case "verification":
        setCurrentStep("subscription")
        break
    }
  }

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)
    // Redirect to success page or dashboard
    alert("Registration successful! You will be redirected to the dashboard.")
  }

  const steps = [
    { id: "basic-info", label: "Osnovni podaci", icon: Building2 },
    { id: "contact-info", label: "Kontakt podaci", icon: MapPin },
    { id: "representative", label: "Predstavnik", icon: User },
    { id: "areas", label: "Područja rada", icon: MapPin },
    { id: "subscription", label: "Pretplata", icon: CreditCard },
    { id: "verification", label: "Verifikacija", icon: Shield },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-grow pt-32 sm:pt-36 md:pt-40 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Registracija agencije za nekretnine</h1>
            <p className="text-gray-600 mb-8">
              Popunite obrazac ispod kako biste registrirali svoju agenciju i započeli s oglašavanjem nekretnina.
            </p>

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
                        <step.icon className="w-5 h-5" />
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
                  {(() => {
                    const currentStepObj = steps.find((s) => s.id === currentStep)
                    const StepIcon = currentStepObj?.icon
                    return StepIcon ? (
                      <div className="bg-rose-100 text-rose-500 p-2 rounded-full mr-3">
                        <StepIcon className="w-5 h-5" />
                      </div>
                    ) : null
                  })()}
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
                {currentStep === "basic-info" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Osnovni podaci o agenciji</h2>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="agencyName">Naziv agencije *</Label>
                        <Input
                          id="agencyName"
                          name="agencyName"
                          value={formData.agencyName}
                          onChange={handleInputChange}
                          placeholder="Unesite naziv agencije"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="agencyType">Vrsta agencije *</Label>
                        <Select
                          value={formData.agencyType}
                          onValueChange={(value) => handleSelectChange("agencyType", value)}
                        >
                          <SelectTrigger id="agencyType">
                            <SelectValue placeholder="Odaberite vrstu agencije" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="real-estate">Agencija za nekretnine</SelectItem>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="consultant">Konzultantska tvrtka</SelectItem>
                            <SelectItem value="other">Ostalo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="yearEstablished">Godina osnivanja</Label>
                          <Input
                            id="yearEstablished"
                            name="yearEstablished"
                            value={formData.yearEstablished}
                            onChange={handleInputChange}
                            placeholder="npr. 2010"
                          />
                        </div>

                        <div>
                          <Label htmlFor="registrationNumber">Matični broj tvrtke *</Label>
                          <Input
                            id="registrationNumber"
                            name="registrationNumber"
                            value={formData.registrationNumber}
                            onChange={handleInputChange}
                            placeholder="Unesite matični broj"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="vatNumber">OIB *</Label>
                          <Input
                            id="vatNumber"
                            name="vatNumber"
                            value={formData.vatNumber}
                            onChange={handleInputChange}
                            placeholder="Unesite OIB"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="website">Web stranica</Label>
                          <Input
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="https://www.vasa-agencija.hr"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Opis agencije</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Unesite kratak opis vaše agencije"
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Info */}
                {currentStep === "contact-info" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Kontakt podaci</h2>

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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">Grad *</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="Grad"
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
                      </div>

                      <div>
                        <Label htmlFor="country">Država *</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) => handleSelectChange("country", value)}
                        >
                          <SelectTrigger id="country">
                            <SelectValue placeholder="Odaberite državu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Hrvatska">Hrvatska</SelectItem>
                            <SelectItem value="Slovenija">Slovenija</SelectItem>
                            <SelectItem value="Bosna i Hercegovina">Bosna i Hercegovina</SelectItem>
                            <SelectItem value="Srbija">Srbija</SelectItem>
                            <SelectItem value="Crna Gora">Crna Gora</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Telefon *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+385 1 234 5678"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="info@vasa-agencija.hr"
                            required
                          />
                        </div>
                      </div>

                      <h3 className="text-lg font-medium mt-6 mb-2">Društvene mreže</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="facebook">Facebook</Label>
                          <Input
                            id="facebook"
                            name="facebook"
                            value={formData.facebook}
                            onChange={handleInputChange}
                            placeholder="https://facebook.com/vasa-agencija"
                          />
                        </div>

                        <div>
                          <Label htmlFor="instagram">Instagram</Label>
                          <Input
                            id="instagram"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleInputChange}
                            placeholder="https://instagram.com/vasa-agencija"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          placeholder="https://linkedin.com/company/vasa-agencija"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Representative */}
                {currentStep === "representative" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Podaci o predstavniku</h2>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="repName">Ime i prezime *</Label>
                        <Input
                          id="repName"
                          name="repName"
                          value={formData.repName}
                          onChange={handleInputChange}
                          placeholder="Ime i prezime predstavnika"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="repPosition">Pozicija *</Label>
                        <Input
                          id="repPosition"
                          name="repPosition"
                          value={formData.repPosition}
                          onChange={handleInputChange}
                          placeholder="npr. Direktor, Voditelj prodaje"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="repEmail">Email *</Label>
                          <Input
                            id="repEmail"
                            name="repEmail"
                            type="email"
                            value={formData.repEmail}
                            onChange={handleInputChange}
                            placeholder="email@primjer.hr"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="repPhone">Telefon *</Label>
                          <Input
                            id="repPhone"
                            name="repPhone"
                            value={formData.repPhone}
                            onChange={handleInputChange}
                            placeholder="+385 91 234 5678"
                            required
                          />
                        </div>
                      </div>

                      <h3 className="text-lg font-medium mt-6 mb-2">Pristupni podaci</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="password">Lozinka *</Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Unesite lozinku"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="confirmPassword">Potvrdite lozinku *</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Ponovite lozinku"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Areas */}
                {currentStep === "areas" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Područja rada</h2>

                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2 block">Regije u kojima poslujete *</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            "Zagreb i okolica",
                            "Dalmacija",
                            "Istra i Kvarner",
                            "Slavonija",
                            "Središnja Hrvatska",
                            "Gorski kotar i Lika",
                          ].map((region) => (
                            <div key={region} className="flex items-center space-x-2">
                              <Checkbox
                                id={`region-${region}`}
                                checked={formData.regions.includes(region)}
                                onCheckedChange={(checked) =>
                                  handleMultiSelectChange("regions", region, checked as boolean)
                                }
                              />
                              <label
                                htmlFor={`region-${region}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {region}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="mb-2 block">Specijalizacije *</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            "Stanovi",
                            "Kuće",
                            "Poslovni prostori",
                            "Zemljišta",
                            "Luksuzne nekretnine",
                            "Novogradnja",
                            "Najam",
                            "Prodaja",
                            "Turistički objekti",
                          ].map((spec) => (
                            <div key={spec} className="flex items-center space-x-2">
                              <Checkbox
                                id={`spec-${spec}`}
                                checked={formData.specializations.includes(spec)}
                                onCheckedChange={(checked) =>
                                  handleMultiSelectChange("specializations", spec, checked as boolean)
                                }
                              />
                              <label
                                htmlFor={`spec-${spec}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {spec}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="numberOfAgents">Broj agenata u agenciji</Label>
                        <RadioGroup
                          value={formData.numberOfAgents}
                          onValueChange={(value) => handleSelectChange("numberOfAgents", value)}
                          className="flex flex-col space-y-1 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1-5" id="agents-1-5" />
                            <Label htmlFor="agents-1-5" className="font-normal">
                              1-5
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="6-10" id="agents-6-10" />
                            <Label htmlFor="agents-6-10" className="font-normal">
                              6-10
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="11-20" id="agents-11-20" />
                            <Label htmlFor="agents-11-20" className="font-normal">
                              11-20
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="21+" id="agents-21+" />
                            <Label htmlFor="agents-21+" className="font-normal">
                              21+
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Subscription */}
                {currentStep === "subscription" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Odaberite plan pretplate</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          formData.plan === "basic"
                            ? "border-rose-500 bg-rose-50"
                            : "border-gray-200 hover:border-rose-200 hover:bg-rose-50/50"
                        }`}
                        onClick={() => handleSelectChange("plan", "basic")}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg">Basic</h3>
                            <p className="text-gray-500 text-sm">Za male agencije</p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border ${
                              formData.plan === "basic" ? "border-rose-500 bg-rose-500" : "border-gray-300"
                            }`}
                          >
                            {formData.plan === "basic" && <Check className="text-white w-4 h-4 mx-auto mt-0.5" />}
                          </div>
                        </div>
                        <div className="mb-4">
                          <span className="text-2xl font-bold">€29</span>
                          <span className="text-gray-500">/mjesečno</span>
                        </div>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-rose-500 mr-2" />
                            <span>Do 10 aktivnih oglasa</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-rose-500 mr-2" />
                            <span>1 korisnički račun</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-rose-500 mr-2" />
                            <span>Osnovni profil agencije</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-rose-500 mr-2" />
                            <span>Email podrška</span>
                          </li>
                        </ul>
                      </div>

                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          formData.plan === "standard"
                            ? "border-rose-500 bg-rose-50"
                            : "border-gray-200 hover:border-rose-200 hover:bg-rose-50/50"
                        }`}
                        onClick={() => handleSelectChange("plan", "standard")}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg">Standard</h3>
                            <p className="text-gray-500 text-sm">Najpopularniji izbor</p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border ${
                              formData.plan === "standard" ? "border-rose-500 bg-rose-500" : "border-gray-300"
                            }`}
                          >
                            {formData.plan === "standard" && <Check className="text-white w-4 h-4 mx-auto mt-0.5" />}
                          </div>
                        </div>
                        <div className="mb-4">
                          <span className="text-2xl font-bold">€79</span>
                          <span className="text-gray-500">/mjesečno</span>
                        </div>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-rose-500 mr-2" />
                            <span>Do 50 aktivnih oglasa</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-rose-500 mr-2" />
                            <span>5 korisničkih računa</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-rose-500 mr-2" />
                            <span>Istaknuti profil agencije</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-rose-500 mr-2" />
                            <span>Prioritet u rezultatima pretrage</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-rose-500 mr-2" />
                            <span>Email i telefonska podrška</span>
                          </li>
                        </ul>
                      </div>

                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          formData.plan === "premium"
                            ? "border-rose-500 bg-rose-50"
                            : "border-gray-200 hover:border-rose-200 hover:bg-rose-50/50"
                        }`}
                        onClick={() => handleSelectChange("plan", "premium")}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg">Premium</h3>
                            <p className="text-gray-500 text-sm">Za velike agencije</p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border ${
                              formData.plan === "premium" ? "border-rose-500 bg-rose-500" : "border-gray-300"
                            }`}
                          >
                            {formData.plan === "premium" && <Check className="text-white w-4 h-4 mx-auto mt-0.5" />}
                          </div>
                        </div>
                        <div className="mb-4">
                          <span className="text-2xl font-bold">€149</span>
                          <span className="text-gray-500">/mjesečno</span>
                        </div>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-rose-500 mr-2" />
                            <span>Neograničen broj oglasa</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-rose-500 mr-2" />
                            <span>Neograničen broj korisnika</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-rose-500 mr-2" />
                            <span>Premium profil agencije</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-rose-500 mr-2" />
                            <span>Top pozicija u rezultatima</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-rose-500 mr-2" />
                            <span>Prioritetna podrška 24/7</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="w-4 h-4 text-rose-500 mr-2" />
                            <span>Analitika i izvještaji</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Svi planovi uključuju 14 dana besplatnog probnog razdoblja. Možete otkazati pretplatu u bilo
                        kojem trenutku. Za više informacija o planovima pretplate, kontaktirajte našu prodaju na{" "}
                        <span className="text-rose-500">prodaja@paconz.hr</span>.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 6: Verification */}
                {currentStep === "verification" && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold mb-4">Verifikacija i završni korak</h2>

                    <div className="space-y-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-medium mb-3">Dokumenti za verifikaciju</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Molimo vas da priložite dokumente koji potvrđuju identitet vaše agencije. Ovo može uključivati
                          izvod iz sudskog registra, licencu za poslovanje s nekretninama ili drugi službeni dokument.
                        </p>

                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-2">Povucite i ispustite dokumente ovdje ili</p>
                            <Button variant="outline" size="sm">
                              Odaberite datoteke
                            </Button>
                            <p className="text-xs text-gray-500 mt-2">Podržani formati: PDF, JPG, PNG (max 5MB)</p>
                          </div>

                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-2">Priložite logo vaše agencije</p>
                            <Button variant="outline" size="sm">
                              Odaberite sliku
                            </Button>
                            <p className="text-xs text-gray-500 mt-2">Preporučena veličina: 400x400px (max 2MB)</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="termsAccepted"
                            checked={formData.termsAccepted}
                            onCheckedChange={(checked) => handleCheckboxChange("termsAccepted", checked as boolean)}
                            required
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="termsAccepted"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Prihvaćam uvjete korištenja *
                            </label>
                            <p className="text-xs text-gray-500">
                              Pročitao/la sam i slažem se s{" "}
                              <a href="#" className="text-rose-500 hover:underline">
                                Uvjetima korištenja
                              </a>{" "}
                              i potvrđujem da sam ovlašten/a za registraciju agencije.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="privacyAccepted"
                            checked={formData.privacyAccepted}
                            onCheckedChange={(checked) => handleCheckboxChange("privacyAccepted", checked as boolean)}
                            required
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor="privacyAccepted"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Prihvaćam pravila privatnosti *
                            </label>
                            <p className="text-xs text-gray-500">
                              Razumijem i prihvaćam{" "}
                              <a href="#" className="text-rose-500 hover:underline">
                                Pravila privatnosti
                              </a>{" "}
                              i slažem se s obradom podataka kako je opisano.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>Napomena:</strong> Nakon što pošaljete zahtjev za registraciju, naš tim će pregledati
                          vaše podatke i dokumente. Proces verifikacije obično traje 1-2 radna dana. Bit ćete
                          obaviješteni putem e-maila kada vaš račun bude aktiviran.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  {currentStep !== "basic-info" ? (
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Natrag
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  <Button
                    type="button"
                    className="bg-rose-500 hover:bg-rose-600"
                    onClick={nextStep}
                    disabled={currentStep === "verification" && (!formData.termsAccepted || !formData.privacyAccepted)}
                  >
                    {currentStep === "verification" ? "Pošalji zahtjev" : "Nastavi"}
                    {currentStep !== "verification" && <ChevronRight className="ml-1 h-4 w-4" />}
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
