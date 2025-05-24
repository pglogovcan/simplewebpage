import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { stripe } from "@/lib/stripe"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string }
}) {
  const sessionId = searchParams.session_id

  if (!sessionId) {
    redirect("/cijene")
  }

  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/prijava")
  }

  try {
    // Retrieve the checkout session to get subscription details
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    })

    if (checkoutSession.subscription && typeof checkoutSession.subscription !== "string") {
      const subscription = checkoutSession.subscription

      // Check if subscription already exists in database
      const { data: existingSubscription } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("stripe_subscription_id", subscription.id)
        .single()

      if (!existingSubscription) {
        // Store subscription details in Supabase
        await supabase.from("subscriptions").insert({
          user_id: session.user.id,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer as string,
          status: subscription.status,
          plan_type: checkoutSession.metadata?.plan_type || "BASIC",
          billing_interval: subscription.items.data[0].plan.interval === "month" ? "monthly" : "yearly",
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
      }
    }
  } catch (error) {
    console.error("Error processing successful subscription:", error)
    // Continue to success page even if there's an error storing the subscription
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Uspješna pretplata!</h1>
          <p className="text-gray-600 mb-8">
            Hvala vam na pretplati. Vaš račun je uspješno aktiviran i možete početi koristiti sve značajke vašeg plana.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/dashboard">Idi na nadzornu ploču</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dodaj-nekretninu">Dodaj nekretninu</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
