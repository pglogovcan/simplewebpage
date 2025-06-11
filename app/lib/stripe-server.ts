"use server"
import { createClient } from "@/app/lib/supabase/server"
import { getStripe } from "@/lib/stripe"

export async function getOrCreateStripeCustomer(user: { id: string; email: string }) {
  const supabase = createClient()
  const stripe = getStripe()

  if (!stripe) {
    throw new Error("Stripe instance not available")
  }

  // Check if customer already exists
  let customerId: string | undefined

  const { data: existingCustomer } = await (await supabase)
    .from("customers")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single()

  if (existingCustomer) {
    customerId = existingCustomer.stripe_customer_id
  } else {
    // Create new customer
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: {
        user_id: user.id,
      },
    })
    customerId = customer.id

    // Store customer in database
    await (await supabase).from("customers").insert({
      user_id: user.id,
      stripe_customer_id: customerId,
    })
  }

  return customerId
}

export async function createCheckoutSession(params: {
  customerId: string
  priceId: string
  userId: string
  planType: string
}): Promise<string> {
  const stripe = getStripe()

  if (!stripe) {
    throw new Error("Stripe instance not available")
  }

  try {
    console.log("Creating Stripe checkout session with params:", {
      customerId: params.customerId,
      priceId: params.priceId,
      userId: params.userId,
      planType: params.planType
    })

    const session = await stripe.checkout.sessions.create({
      customer: params.customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pretplata/uspjeh?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cijene`,
      metadata: {
        user_id: params.userId,
        plan_type: params.planType,
      },
      subscription_data: {
        metadata: {
          user_id: params.userId,
          plan_type: params.planType,
        },
      },
    })

    if (!session.url) {
      throw new Error("Failed to create checkout session: No URL returned")
    }

    return session.url
  } catch (error) {
    console.error("Stripe checkout session creation error:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to create checkout session: ${error.message}`)
    }
    throw new Error("Failed to create checkout session: Unknown error")
  }
} 