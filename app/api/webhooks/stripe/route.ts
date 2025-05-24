import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/utils/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      console.error("Missing stripe-signature header")
      return NextResponse.json({ error: "Missing signature" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    console.log("Received webhook event:", event.type)

    const supabase = createClient()

    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription, supabase)
        break

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase)
        break

      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, supabase)
        break

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice, supabase)
        break

      case "customer.subscription.trial_will_end":
        await handleTrialWillEnd(event.data.object as Stripe.Subscription, supabase)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any) {
  console.log("Handling subscription created:", subscription.id)

  try {
    const customerId = subscription.customer as string
    const priceId = subscription.items.data[0]?.price.id

    // Get the user_id from the customers table using stripe_customer_id
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("user_id")
      .eq("stripe_customer_id", customerId)
      .single()

    if (customerError || !customer) {
      console.error("Customer not found for stripe_customer_id:", customerId)
      throw new Error("Customer not found")
    }

    const planType = getPlanFromPriceId(priceId)

    // Update or create subscription record
    const { error } = await supabase.from("subscriptions").upsert({
      user_id: customer.user_id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: customerId,
      status: subscription.status,
      plan_type: planType,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error creating subscription:", error)
      throw error
    }

    console.log("Subscription created successfully for user:", customer.user_id)
  } catch (error) {
    console.error("Error handling subscription created:", error)
    throw error
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  console.log("Handling subscription updated:", subscription.id)

  try {
    const priceId = subscription.items.data[0]?.price.id
    const planType = getPlanFromPriceId(priceId)

    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: subscription.status,
        plan_type: planType,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscription.id)

    if (error) {
      console.error("Error updating subscription:", error)
      throw error
    }

    console.log("Subscription updated successfully")
  } catch (error) {
    console.error("Error handling subscription updated:", error)
    throw error
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  console.log("Handling subscription deleted:", subscription.id)

  try {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: "canceled",
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscription.id)

    if (error) {
      console.error("Error deleting subscription:", error)
      throw error
    }

    console.log("Subscription deleted successfully")
  } catch (error) {
    console.error("Error handling subscription deleted:", error)
    throw error
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  console.log("Handling payment succeeded:", invoice.id)

  try {
    if (invoice.subscription) {
      // Update subscription status to active
      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", invoice.subscription)

      if (error) {
        console.error("Error updating subscription after payment:", error)
        throw error
      }

      // Log the payment
      const { error: paymentError } = await supabase.from("payments").insert({
        stripe_invoice_id: invoice.id,
        stripe_subscription_id: invoice.subscription as string,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: "succeeded",
        created_at: new Date().toISOString(),
      })

      if (paymentError) {
        console.error("Error logging payment:", paymentError)
      }
    }

    console.log("Payment succeeded handled successfully")
  } catch (error) {
    console.error("Error handling payment succeeded:", error)
    throw error
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  console.log("Handling payment failed:", invoice.id)

  try {
    if (invoice.subscription) {
      // Update subscription status
      const { error } = await supabase
        .from("subscriptions")
        .update({
          status: "past_due",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", invoice.subscription)

      if (error) {
        console.error("Error updating subscription after failed payment:", error)
        throw error
      }

      // Log the failed payment
      const { error: paymentError } = await supabase.from("payments").insert({
        stripe_invoice_id: invoice.id,
        stripe_subscription_id: invoice.subscription as string,
        amount: invoice.amount_due,
        currency: invoice.currency,
        status: "failed",
        created_at: new Date().toISOString(),
      })

      if (paymentError) {
        console.error("Error logging failed payment:", paymentError)
      }
    }

    console.log("Payment failed handled successfully")
  } catch (error) {
    console.error("Error handling payment failed:", error)
    throw error
  }
}

async function handleTrialWillEnd(subscription: Stripe.Subscription, supabase: any) {
  console.log("Handling trial will end:", subscription.id)

  try {
    // You can add logic here to send notification emails
    // or update user records about trial ending

    const { error } = await supabase
      .from("subscriptions")
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscription.id)

    if (error) {
      console.error("Error updating subscription for trial end:", error)
      throw error
    }

    console.log("Trial will end handled successfully")
  } catch (error) {
    console.error("Error handling trial will end:", error)
    throw error
  }
}

function getPlanFromPriceId(priceId: string): string {
  // Map Stripe price IDs to plan types
  const priceToPlans: Record<string, string> = {
    price_1OxYz1ABCDEFghijklmno12: "BASIC",
    price_1OxYz2ABCDEFghijklmno34: "BASIC",
    price_1OxYz3ABCDEFghijklmno56: "STANDARD",
    price_1OxYz4ABCDEFghijklmno78: "STANDARD",
    price_1OxYz5ABCDEFghijklmno90: "PREMIUM",
    price_1OxYz6ABCDEFghijklmnoAB: "PREMIUM",
  }

  return priceToPlans[priceId] || "BASIC"
}
