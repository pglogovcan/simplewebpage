import Stripe from "stripe"

// Plan information that's safe to use on the client side
export const PLANS = {
  BASIC: {
    name: "Osnovni",
    id: "basic",
    // Replace these with your actual Stripe price IDs from the Stripe Dashboard
    priceMonthly: "price_1RWfMh2KElzom3YfbFUw9KPq", // Monthly price ID for Basic plan
    priceYearly: "price_XXXXX",  // Yearly price ID for Basic plan
    features: [
      "Do 3 aktivna oglasa",
      "Osnovni prikaz oglasa",
      "Do 10 fotografija po oglasu",
      "30 dana trajanje oglasa",
      "Email podrška",
    ],
    monthlyPrice: 19,
    yearlyPrice: 182,
  },
  STANDARD: {
    name: "Standard",
    id: "standard",
    // Replace these with your actual Stripe price IDs from the Stripe Dashboard
    priceMonthly: "price_1RWfOx2KElzom3YfVvCrHzdE", // Monthly price ID for Standard plan
    priceYearly: "price_XXXXX",  // Yearly price ID for Standard plan
    features: [
      "Do 20 aktivnih oglasa",
      "Istaknuti oglasi",
      "Do 25 fotografija po oglasu",
      "60 dana trajanje oglasa",
      "Prioritetna email podrška",
      "Statistika ogleda oglasa",
      "Virtualne šetnje",
    ],
    monthlyPrice: 49,
    yearlyPrice: 470,
  },
  PREMIUM: {
    name: "Premium",
    id: "premium",
    // Replace these with your actual Stripe price IDs from the Stripe Dashboard
    priceMonthly: "price_XXXXX", // Monthly price ID for Premium plan
    priceYearly: "price_XXXXX",  // Yearly price ID for Premium plan
    features: [
      "Neograničen broj oglasa",
      "Premium pozicija oglasa",
      "Neograničen broj fotografija",
      "90 dana trajanje oglasa",
      "24/7 telefonska podrška",
      "Napredna analitika i izvještaji",
      "Virtualne šetnje i 3D tlocrti",
      "Profilna stranica agencije",
      "API pristup",
    ],
    monthlyPrice: 99,
    yearlyPrice: 950,
  },
}

export type PlanType = keyof typeof PLANS
export type BillingInterval = "monthly" | "yearly"

// This function is safe to use on the client side
export function getPriceId(plan: PlanType, interval: BillingInterval): string {
  return interval === "monthly" ? PLANS[plan].priceMonthly : PLANS[plan].priceYearly
}

// This function is safe to use on the client side
export function formatAmountForDisplay(amount: number, currency = "EUR"): string {
  const numberFormat = new Intl.NumberFormat(["hr-HR"], {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  })
  return numberFormat.format(amount)
}

// Server-side only code - this will only be executed on the server
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe | null {
  if (typeof window !== "undefined") {
    console.warn("Attempted to access Stripe instance from client side")
    return null
  }

  if (!stripeInstance && process.env.STRIPE_SECRET_KEY) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-04-30.basil",
      typescript: true,
    })
  }

  return stripeInstance
}
