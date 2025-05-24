"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowLeft, Loader2 } from "lucide-react"
import { PLANS } from "@/lib/stripe"
import type { BillingInterval, PlanType } from "@/lib/stripe"
import { getSupabaseClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  const planParam = searchParams.get("plan") as PlanType | null
  const intervalParam = searchParams.get("interval") as BillingInterval | null

  // Default to BASIC and monthly if params are missing
  const plan = planParam || "BASIC"
  const interval = intervalParam || "monthly"

  // Get plan details
  const planDetails = PLANS[plan]
  const price = interval === "monthly" ? planDetails.monthlyPrice : planDetails.yearlyPrice

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        toast({
          title: "Potrebna je prijava",
          description: "Morate biti prijavljeni kako biste se pretplatili na plan.",
          variant: "destructive",
        })
        router.push("/prijava")
        return
      }
      setIsAuthenticated(true)
    }

    checkAuth()
  }, [router, toast, supabase.auth])

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      // In a real implementation, this would call a server action to create a Stripe checkout session
      // For now, we'll simulate a successful checkout with a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Uspješno!",
        description: "Vaša pretplata je aktivirana. Preusmjeravamo vas na nadzornu ploču.",
      })

      // Redirect to dashboard after successful checkout
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom obrade plaćanja. Molimo pokušajte ponovno.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-rose-400" />
            <p className="text-lg">Provjeravamo vaše podatke...</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-8" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Natrag na planove
          </Button>

          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Dovršite pretplatu</h1>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Pregled narudžbe</CardTitle>
                <CardDescription>Provjerite detalje vaše pretplate prije plaćanja</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-4">
                    <span className="font-medium">Plan:</span>
                    <span>{planDetails.name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-4">
                    <span className="font-medium">Razdoblje naplate:</span>
                    <span>{interval === "monthly" ? "Mjesečno" : "Godišnje"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-4">
                    <span className="font-medium">Cijena:</span>
                    <span className="font-bold">{price} €</span>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Uključene značajke:</h4>
                    <ul className="space-y-2">
                      {planDetails.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-rose-400 mr-2 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-rose-400 hover:bg-rose-500" onClick={handleCheckout} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Obrađujemo...
                    </>
                  ) : (
                    "Plati i aktiviraj pretplatu"
                  )}
                </Button>
              </CardFooter>
            </Card>

            <div className="text-center text-sm text-gray-500">
              <p>
                Klikom na gumb "Plati i aktiviraj pretplatu" prihvaćate naše{" "}
                <a href="/uvjeti-koristenja" className="underline hover:text-gray-800">
                  Uvjete korištenja
                </a>{" "}
                i{" "}
                <a href="/privatnost" className="underline hover:text-gray-800">
                  Politiku privatnosti
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
