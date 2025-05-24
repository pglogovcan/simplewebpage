"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ChevronLeft } from "lucide-react"

interface MortgageCalculatorProps {
  propertyPrice: number
}

export function MortgageCalculator({ propertyPrice }: MortgageCalculatorProps) {
  // Fixed values
  const interestRate = 3.5 // 3.5% fixed interest rate

  // State for adjustable values
  const [downPaymentPercent, setDownPaymentPercent] = useState(20)
  const [paymentPeriod, setPaymentPeriod] = useState(20)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Clear error when user types
    if (formErrors[id]) {
      setFormErrors((prev) => ({
        ...prev,
        [id]: "",
      }))
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.firstName.trim()) errors.firstName = "Ime je obavezno"
    if (!formData.lastName.trim()) errors.lastName = "Prezime je obavezno"

    if (!formData.email.trim()) {
      errors.email = "Email je obavezan"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Unesite ispravan email"
    }

    if (!formData.phone.trim()) {
      errors.phone = "Broj telefona je obavezan"
    }

    if (!formData.city.trim()) errors.city = "Grad je obavezan"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowForm(false)

      // Show success toast
      toast({
        title: "Zahtjev uspješno poslan",
        description: "Vaš zahtjev za kredit je uspješno poslan. Banka će vas uskoro kontaktirati.",
      })

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        city: "",
      })
    }, 1000)
  }

  // Calculate values
  const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100
  const loanAmount = propertyPrice - downPaymentAmount

  // Calculate monthly payment using the formula: M = P[r(1+r)^n]/[(1+r)^n-1]
  const monthlyInterestRate = interestRate / 100 / 12
  const numberOfPayments = paymentPeriod * 12
  const monthlyPayment =
    (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("hr-HR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className="w-full mt-2 border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-800">
            {showForm ? "Zatražite ponudu za kredit" : "Kalkulator kredita"}
          </CardTitle>
          <Image src="/bank-logo.png" alt="Bank Logo" width={120} height={40} className="object-contain" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {!showForm ? (
          // Calculator View
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="property-price" className="text-gray-700">
                  Cijena nekretnine
                </Label>
                <span className="font-medium text-gray-900">{formatCurrency(propertyPrice)}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="down-payment" className="text-gray-700">
                  Učešće ({downPaymentPercent}%)
                </Label>
                <span className="font-medium text-gray-900">{formatCurrency(downPaymentAmount)}</span>
              </div>
              <Slider
                id="down-payment"
                min={5}
                max={50}
                step={1}
                value={[downPaymentPercent]}
                onValueChange={(value) => setDownPaymentPercent(value[0])}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>5%</span>
                <span>50%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="payment-period" className="text-gray-700">
                  Period otplate ({paymentPeriod} godina)
                </Label>
              </div>
              <Slider
                id="payment-period"
                min={5}
                max={30}
                step={1}
                value={[paymentPeriod]}
                onValueChange={(value) => setPaymentPeriod(value[0])}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>5 godina</span>
                <span>30 godina</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="interest-rate" className="text-gray-700">
                  Kamatna stopa
                </Label>
                <span className="font-medium text-gray-900">{interestRate}%</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Iznos kredita</span>
                <span className="font-medium text-gray-900">{formatCurrency(loanAmount)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-semibold">Mjesečna rata</span>
                <span className="font-bold text-xl text-teal-600">{formatCurrency(monthlyPayment)}</span>
              </div>
            </div>

            <div>
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3"
                onClick={() => setShowForm(true)}
              >
                NASTAVI DALJE
              </Button>
            </div>
          </div>
        ) : (
          // Form View
          <div className="space-y-0">
            <form onSubmit={handleSubmit} className="space-y-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0">
                  <Label htmlFor="firstName" className="text-gray-700">
                    Ime
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Unesite ime"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={formErrors.firstName ? "border-red-500" : ""}
                  />
                  {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                </div>
                <div className="space-y-0">
                  <Label htmlFor="lastName" className="text-gray-700">
                    Prezime
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Unesite prezime"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={formErrors.lastName ? "border-red-500" : ""}
                  />
                  {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                </div>
              </div>
              <div className="space-y-0">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vasa@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
              <div className="space-y-0">
                <Label htmlFor="phone" className="text-gray-700">
                  Broj telefona
                </Label>
                <Input
                  id="phone"
                  placeholder="+385 XX XXX XXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={formErrors.phone ? "border-red-500" : ""}
                />
                {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
              </div>
              <div className="space-y-0">
                <Label htmlFor="city" className="text-gray-700">
                  Grad
                </Label>
                <Input
                  id="city"
                  placeholder="Unesite grad"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={formErrors.city ? "border-red-500" : ""}
                />
                {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Slanje...
                    </div>
                  ) : (
                    "POŠALJI ZAHTJEV"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 font-semibold py-3 flex items-center justify-center"
                  onClick={() => setShowForm(false)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  NAZAD
                </Button>
              </div>
            </form>

            <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
              <p>Slanjem zahtjeva pristajete da vas banka kontaktira s ponudom za kredit.</p>
              <p className="mt-2">Vaši podaci će biti korišteni isključivo u svrhu obrade zahtjeva za kredit.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MortgageCalculator
