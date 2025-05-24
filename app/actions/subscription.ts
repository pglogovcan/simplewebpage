"use server"

import { createClient } from "@/utils/supabase/server"
import { stripe, getPriceId } from "@/lib/stripe"
import { redirect } from "next/navigation"
import { cookies, headers } from "next/headers"
import type { PlanType, BillingInterval } from "@/lib/stripe"

export async function createCheckoutSession(planType: PlanType, billingInterval: BillingInterval) {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return { error: "Morate biti prijavljeni za pretplatu." }
    }

    const priceId = getPriceId(planType, billingInterval)
    const headersList = headers()
    const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    // Create a new customer if one doesn't exist
    const { data: customerData } = await supabase
      .from("customers")
      .select("stripe_customer_id")
      .eq("user_id", session.user.id)
      .single()

    let customerId = customerData?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          supabase_id: session.user.id,
        },
      })

      customerId = customer.id

      // Store the customer ID in Supabase
      await supabase.from("customers").insert({
        user_id: session.user.id,
        stripe_customer_id: customerId,
      })
    }

    // Create a checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/pretplata/uspjeh?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cijene`,
      subscription_data: {
        metadata: {
          user_id: session.user.id,
          plan_type: planType,
        },
      },
      metadata: {
        user_id: session.user.id,
        plan_type: planType,
      },
    })

    if (!checkoutSession.url) {
      return { error: "Greška pri stvaranju sesije za plaćanje." }
    }

    // Store checkout session in cookies for retrieval later
    cookies().set("checkout_session_id", checkoutSession.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 30, // 30 minutes
      path: "/",
    })

    return { sessionUrl: checkoutSession.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return { error: "Došlo je do greške pri obradi zahtjeva." }
  }
}

export async function redirectToCheckout(planType: PlanType, billingInterval: BillingInterval) {
  const { sessionUrl, error } = await createCheckoutSession(planType, billingInterval)

  if (error) {
    // Return the error to be handled by the client
    return { error }
  }

  if (sessionUrl) {
    redirect(sessionUrl)
  }

  return { error: "Neuspješno preusmjeravanje na stranicu za plaćanje." }
}

export async function getSubscriptionStatus() {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return { status: "unauthenticated" }
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", session.user.id)
      .single()

    if (!subscription) {
      return { status: "no_subscription" }
    }

    // Check if subscription is active
    if (subscription.status === "active" || subscription.status === "trialing") {
      return {
        status: "active",
        plan: subscription.plan_type,
        interval: subscription.billing_interval,
        currentPeriodEnd: subscription.current_period_end,
      }
    }

    return { status: subscription.status }
  } catch (error) {
    console.error("Error getting subscription status:", error)
    return { status: "error", error: "Došlo je do greške pri dohvaćanju statusa pretplate." }
  }
}

export async function cancelSubscription() {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return { error: "Morate biti prijavljeni za otkazivanje pretplate." }
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id")
      .eq("user_id", session.user.id)
      .single()

    if (!subscription?.stripe_subscription_id) {
      return { error: "Pretplata nije pronađena." }
    }

    await stripe.subscriptions.update(subscription.stripe_subscription_id, {
      cancel_at_period_end: true,
    })

    return { success: true }
  } catch (error) {
    console.error("Error canceling subscription:", error)
    return { error: "Došlo je do greške pri otkazivanju pretplate." }
  }
}
