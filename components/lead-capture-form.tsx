"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Mail, Phone, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LeadCaptureFormProps {
  propertyIds: string[]
  propertyTitles: string[]
}

export default function LeadCaptureForm({ propertyIds, propertyTitles }: LeadCaptureFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Upit poslan",
        description: "Vaš upit je uspješno poslan. Kontaktirat ćemo vas uskoro.",
        variant: "default",
      })

      // Reset form
      setName("")
      setEmail("")
      setPhone("")
      setMessage("")
      setConsent(false)
    }, 1000)
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-lg mb-4">Zatražite više informacija</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input placeholder="Vaše ime i prezime" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Email adresa"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Broj telefona"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Textarea
            placeholder={`Zanima me više informacija o nekretninama ${propertyTitles.join(" i ")}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox id="consent" checked={consent} onCheckedChange={(checked) => setConsent(checked as boolean)} />
          <label htmlFor="consent" className="text-sm text-gray-600 leading-tight">
            Slažem se s obradom mojih osobnih podataka u svrhu odgovora na upit. Pročitao/la sam i prihvaćam pravila
            privatnosti.
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            className="bg-rose-500 hover:bg-rose-600 w-full sm:w-auto"
            disabled={!consent || loading}
          >
            {loading ? (
              <>Šaljem upit...</>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Pošalji upit
              </>
            )}
          </Button>

          <Button type="button" variant="outline" className="w-full sm:w-auto">
            <Calendar className="h-4 w-4 mr-2" />
            Dogovori obilazak
          </Button>
        </div>
      </form>
    </div>
  )
}
