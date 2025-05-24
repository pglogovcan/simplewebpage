import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SubscriptionManagement } from "@/components/subscription-management"

export default async function SubscriptionsPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/prijava")
  }

  // Get subscription data
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", session.user.id)
    .single()

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8">Upravljanje pretplatom</h1>
        <SubscriptionManagement subscription={subscription} />
      </main>
      <SiteFooter />
    </div>
  )
}
