"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Phone, Mail } from "lucide-react"
import { usageService } from "@/lib/usage-service"
import { getSupabaseClient } from "@/utils/supabase/client"
import { UsageLimitDialog } from "@/components/usage-limit-dialog"

interface PropertyContactFormProps {
  agentName: string
  agentTitle?: string
  agentPhoto?: string
  agentPhone: string
  agentEmail: string
  propertyId?: string
  publishDate?: string
  agentRating?: number
  agentExperience?: number
}

export function PropertyContactForm({
  agentName,
  agentTitle = "Agent za nekretnine",
  agentPhoto = "/placeholder.svg",
  agentPhone,
  agentEmail,
  propertyId,
  publishDate,
  agentRating,
  agentExperience,
}: PropertyContactFormProps) {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    termsAccepted: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [showUsageLimitDialog, setShowUsageLimitDialog] = useState(false)
  const [usageLimitInfo, setUsageLimitInfo] = useState<{
    limitType: "property_listing" | "featured_listing" | "search" | "contact"
    currentUsage: number
    limit: number
    planType: string
  }>({
    limitType: "contact",
    currentUsage: 0,
    limit: 0,
    planType: "basic",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))

    if (name === "message") {
      setCharCount(value.length)
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormState((prev) => ({ ...prev, termsAccepted: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Check if user is authenticated and track contact usage
      const supabase = getSupabaseClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Check usage limits for authenticated users
        const usageCheck = await usageService.checkUsageLimit(user.id, "contact")

        if (!usageCheck.allowed) {
          setUsageLimitInfo({
            limitType: "contact",
            currentUsage: usageCheck.currentUsage || 0,
            limit: usageCheck.limit || 0,
            planType: "basic", // You might want to fetch this from the user's subscription
          })
          setShowUsageLimitDialog(true)
          setIsSubmitting(false)
          return
        }

        // Track the contact usage
        await usageService.trackUsage(user.id, "contact")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSubmitted(true)

      // Reset form after submission
      setFormState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        termsAccepted: false,
      })
      setCharCount(0)

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    } catch (error) {
      console.error("Error submitting contact form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="sticky top-[189px]">
      <Card className="overflow-hidden shadow-md" id="contact-form">
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-center">Javite se agenciji</h2>
          </div>

          {/* Contact form section */}
          <div className="p-4">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Poruka poslana!</h3>
                <p className="text-muted-foreground">Vaša poruka je uspješno poslana. Očekujte odgovor uskoro.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      name="firstName"
                      placeholder="Ime*"
                      value={formState.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      name="lastName"
                      placeholder="Prezime*"
                      value={formState.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email*"
                    value={formState.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex items-center">
                  <div className="bg-gray-100 text-gray-500 px-3 py-2 border border-r-0 rounded-l-md">+385</div>
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Telefon*"
                    value={formState.phone}
                    onChange={handleChange}
                    className="rounded-l-none"
                    required
                  />
                </div>

                <div className="relative">
                  <Textarea
                    name="message"
                    placeholder="Zanima me ova nekretnina koju sam pronašao u Pačonž. Molim vas da mi date više informacija. Hvala vam!"
                    value={formState.message}
                    onChange={handleChange}
                    rows={4}
                    maxLength={600}
                    required
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">{charCount}/600</div>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formState.termsAccepted}
                    onCheckedChange={handleCheckboxChange}
                    required
                  />
                  <label htmlFor="terms" className="text-sm leading-tight text-muted-foreground">
                    Slanjem ovog obrasca potvrđujete da se slažete s{" "}
                    <a href="#" className="text-rose-500 hover:underline">
                      Uvjeti korištenja
                    </a>{" "}
                    i{" "}
                    <a href="#" className="text-rose-500 hover:underline">
                      Pravila o privatnosti
                    </a>{" "}
                    Pačonž web stranice.
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                  disabled={isSubmitting || !formState.termsAccepted}
                >
                  {isSubmitting ? "Slanje..." : "POŠALJI PORUKU"}
                </Button>
              </form>
            )}
          </div>
          {/* Agent profile section */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <Image
                  src={agentPhoto || "/placeholder.svg"}
                  alt={agentName}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{agentName}</h3>
                <p className="text-muted-foreground text-sm">{agentTitle}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-500" />
                <a href={`tel:${agentPhone}`} className="hover:underline">
                  {agentPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-500" />
                <a href={`mailto:${agentEmail}`} className="hover:underline">
                  {agentEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Property details footer */}
          {(propertyId || publishDate) && (
            <div className="p-4 border-t bg-gray-50 text-sm text-muted-foreground flex justify-between">
              {propertyId && <div>Šifra nekretnine: {propertyId}</div>}
              {publishDate && <div>Objavljeno: {publishDate}</div>}
            </div>
          )}
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
  )
}
