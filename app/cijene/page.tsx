"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, HelpCircle, Star, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseClient } from "@/utils/supabase/client"
import { PLANS } from "@/lib/stripe"
import type { BillingInterval, PlanType } from "@/lib/stripe"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingInterval>("monthly")
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession()
    return !!data.session
  }

  const handleSubscribeClick = async (planType: PlanType) => {
    const isAuthenticated = await checkAuth()

    if (!isAuthenticated) {
      setSelectedPlan(planType)
      setIsAuthDialogOpen(true)
      return
    }

    // User is authenticated, redirect to checkout page
    router.push(`/checkout?plan=${planType}&interval=${billingCycle}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Jednostavno i transparentno oglašavanje</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Odaberite plan koji odgovara vašim potrebama i počnite oglašavati svoje nekretnine već danas.
            </p>

            <Tabs defaultValue="monthly" className="w-full max-w-md mx-auto mb-12">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly" onClick={() => setBillingCycle("monthly")}>
                  Mjesečno
                </TabsTrigger>
                <TabsTrigger value="yearly" onClick={() => setBillingCycle("yearly")}>
                  Godišnje <Badge className="ml-2 bg-rose-400">20% popusta</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Basic Plan */}
              <Card className="border-2 border-gray-200 transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Osnovni</CardTitle>
                  <CardDescription>Idealno za privatne oglašivače</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {billingCycle === "monthly" ? PLANS.BASIC.monthlyPrice : PLANS.BASIC.yearlyPrice}
                    </span>
                    <span className="text-gray-500 ml-1">€/{billingCycle === "monthly" ? "mj" : "god"}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {PLANS.BASIC.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-rose-400 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" onClick={() => handleSubscribeClick("BASIC")}>
                    Odaberi plan
                  </Button>
                </CardFooter>
              </Card>

              {/* Standard Plan */}
              <Card className="border-2 border-rose-400 relative transition-all duration-200 hover:shadow-lg">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-rose-400 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Najpopularnije
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Standard</CardTitle>
                  <CardDescription>Za agente i manje agencije</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {billingCycle === "monthly" ? PLANS.STANDARD.monthlyPrice : PLANS.STANDARD.yearlyPrice}
                    </span>
                    <span className="text-gray-500 ml-1">€/{billingCycle === "monthly" ? "mj" : "god"}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {PLANS.STANDARD.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-rose-400 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-rose-400 hover:bg-rose-500"
                    onClick={() => handleSubscribeClick("STANDARD")}
                  >
                    Odaberi plan
                  </Button>
                </CardFooter>
              </Card>

              {/* Premium Plan */}
              <Card className="border-2 border-gray-200 transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Premium</CardTitle>
                  <CardDescription>Za agencije i developere</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {billingCycle === "monthly" ? PLANS.PREMIUM.monthlyPrice : PLANS.PREMIUM.yearlyPrice}
                    </span>
                    <span className="text-gray-500 ml-1">€/{billingCycle === "monthly" ? "mj" : "god"}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {PLANS.PREMIUM.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-rose-400 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" onClick={() => handleSubscribeClick("PREMIUM")}>
                    Odaberi plan
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Usporedba značajki</h2>
            <div className="overflow-x-auto">
              <table className="w-full max-w-5xl mx-auto border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-4">Značajka</th>
                    <th className="p-4 text-center">Osnovni</th>
                    <th className="p-4 text-center bg-rose-50">Standard</th>
                    <th className="p-4 text-center">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium">Broj aktivnih oglasa</td>
                    <td className="p-4 text-center">3</td>
                    <td className="p-4 text-center bg-rose-50">20</td>
                    <td className="p-4 text-center">Neograničeno</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium">Fotografije po oglasu</td>
                    <td className="p-4 text-center">10</td>
                    <td className="p-4 text-center bg-rose-50">25</td>
                    <td className="p-4 text-center">Neograničeno</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium">Trajanje oglasa</td>
                    <td className="p-4 text-center">30 dana</td>
                    <td className="p-4 text-center bg-rose-50">60 dana</td>
                    <td className="p-4 text-center">90 dana</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium">Istaknuti oglasi</td>
                    <td className="p-4 text-center">-</td>
                    <td className="p-4 text-center bg-rose-50">
                      <Check className="h-5 w-5 text-rose-400 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <Check className="h-5 w-5 text-rose-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium">Virtualne šetnje</td>
                    <td className="p-4 text-center">-</td>
                    <td className="p-4 text-center bg-rose-50">
                      <Check className="h-5 w-5 text-rose-400 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <Check className="h-5 w-5 text-rose-400 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium">Analitika i izvještaji</td>
                    <td className="p-4 text-center">Osnovna</td>
                    <td className="p-4 text-center bg-rose-50">Standardna</td>
                    <td className="p-4 text-center">Napredna</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium">Korisnička podrška</td>
                    <td className="p-4 text-center">Email</td>
                    <td className="p-4 text-center bg-rose-50">Prioritetni email</td>
                    <td className="p-4 text-center">24/7 telefon i email</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 font-medium">API pristup</td>
                    <td className="p-4 text-center">-</td>
                    <td className="p-4 text-center bg-rose-50">-</td>
                    <td className="p-4 text-center">
                      <Check className="h-5 w-5 text-rose-400 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Što kažu naši korisnici</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Testimonial 1 */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">
                    "Otkako koristim Pačonž, moji oglasi dobivaju puno više upita. Sučelje je jednostavno za korištenje,
                    a podrška je uvijek spremna pomoći."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold mr-4">
                      MN
                    </div>
                    <div>
                      <p className="font-medium">Marko Novak</p>
                      <p className="text-sm text-gray-500">Agent za nekretnine, Zagreb</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">
                    "Standard paket je savršen za našu malu agenciju. Dobivamo kvalitetne upite i prodali smo više
                    nekretnina nego ikad prije."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold mr-4">
                      AK
                    </div>
                    <div>
                      <p className="font-medium">Ana Kovačević</p>
                      <p className="text-sm text-gray-500">Vlasnica agencije, Split</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">
                    "Premium paket nam je omogućio da proširimo poslovanje. Analitika nam pomaže da bolje razumijemo
                    tržište i optimiziramo oglase."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold mr-4">
                      IH
                    </div>
                    <div>
                      <p className="font-medium">Ivan Horvat</p>
                      <p className="text-sm text-gray-500">Developer, Rijeka</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Često postavljana pitanja</h2>
            <div className="max-w-3xl mx-auto space-y-6">
              {/* FAQ Item 1 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <HelpCircle className="h-5 w-5 text-rose-400 mr-2" />
                    Mogu li promijeniti paket kasnije?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Da, možete nadograditi ili smanjiti svoj paket u bilo kojem trenutku. Promjene će stupiti na snagu
                    od sljedećeg obračunskog razdoblja.
                  </p>
                </CardContent>
              </Card>

              {/* FAQ Item 2 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <HelpCircle className="h-5 w-5 text-rose-400 mr-2" />
                    Postoji li probno razdoblje?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Da, nudimo 14-dnevno probno razdoblje za sve pakete. Tijekom tog razdoblja možete testirati sve
                    značajke bez obveze.
                  </p>
                </CardContent>
              </Card>

              {/* FAQ Item 3 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <HelpCircle className="h-5 w-5 text-rose-400 mr-2" />
                    Kako se obračunava godišnja pretplata?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Godišnja pretplata se naplaćuje jednokratno za cijelu godinu. Dobivate popust od 20% u odnosu na
                    mjesečno plaćanje.
                  </p>
                </CardContent>
              </Card>

              {/* FAQ Item 4 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <HelpCircle className="h-5 w-5 text-rose-400 mr-2" />
                    Što ako trebam više oglasa od onih u mom paketu?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Možete nadograditi svoj paket ili kupiti dodatne oglase pojedinačno. Kontaktirajte našu korisničku
                    podršku za više informacija.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-rose-500 to-rose-400 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Spremni za početak?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-10">
              Pridružite se tisućama zadovoljnih korisnika i počnite oglašavati svoje nekretnine već danas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-rose-500 hover:bg-gray-100">
                <Link href="/registracija">Registrirajte se</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-rose-600">
                <Link href="/kontakt">Kontaktirajte nas</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      {/* Authentication Dialog */}
      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Potrebna je prijava</DialogTitle>
            <DialogDescription>
              Morate biti prijavljeni kako biste se pretplatili na plan. Molimo prijavite se ili registrirajte novi
              račun.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-start space-x-3 mt-2">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">
              Nakon prijave, bit ćete preusmjereni na stranicu za plaćanje gdje možete dovršiti pretplatu.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsAuthDialogOpen(false)}>
              Odustani
            </Button>
            <Button
              onClick={() => {
                setIsAuthDialogOpen(false)
                router.push("/prijava")
              }}
            >
              Prijavi se
            </Button>
            <Button
              onClick={() => {
                setIsAuthDialogOpen(false)
                router.push("/registracija")
              }}
            >
              Registriraj se
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
