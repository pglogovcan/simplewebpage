import { redirect } from "next/navigation"
import { getPriceId, PLANS } from "@/lib/stripe"
import type { PlanType, BillingInterval } from "@/lib/stripe"
import { checkAuth, getAuthenticatedUser } from "@/app/lib/auth"
import { getOrCreateStripeCustomer, createCheckoutSession } from "@/app/lib/stripe-server"

interface CheckoutPageProps {
  searchParams: {
    plan?: string
    interval?: string
  }
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  // Check if user is authenticated
  const isAuthenticated = await checkAuth()

  if (!isAuthenticated) {
    redirect("/")
  }

  const plan = searchParams.plan as PlanType
  const interval = (searchParams.interval as BillingInterval) || "monthly"

  // Validate plan
  if (!plan || !PLANS[plan]) {
    redirect("/cijene")
  }

  try {
    // Get authenticated user
    const user = await getAuthenticatedUser()

    // Get or create Stripe customer
    const customerId = await getOrCreateStripeCustomer(user)
    if (!customerId) {
      throw new Error("Failed to get or create customer")
    }

    // Get price ID and log it for debugging
    const priceId = getPriceId(plan, interval)
    console.log("Creating checkout session with:", {
      customerId,
      priceId,
      userId: user.id,
      planType: plan,
      interval
    })

    // Create checkout session
    const checkoutUrl = await createCheckoutSession({
      customerId,
      priceId,
      userId: user.id,
      planType: plan
    })

    redirect(checkoutUrl)
  } catch (error) {
    console.error("Checkout error details:", error)
    redirect("/cijene?error=checkout_failed")
  }
}
