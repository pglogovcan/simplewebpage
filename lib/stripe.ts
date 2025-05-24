import Stripe from "stripe"

// Plan information that's safe to use on the client side
export const PLANS = {
  BASIC: {
    name: "Osnovni",
    id: "basic",
    priceMonthly: "price_1OxYz1ABCDEFghijklmno12", // Replace with your actual Stripe price IDs
    priceYearly: "price_1OxYz2ABCDEFghijklmno34",
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
    priceMonthly: "price_1OxYz3ABCDEFghijklmno56",
    priceYearly: "price_1OxYz4ABCDEFghijklmno78",
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
    priceMonthly: "price_1OxYz5ABCDEFghijklmno90",
    priceYearly: "price_1OxYz6ABCDEFghijklmnoAB",
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
      apiVersion: "2023-10-16",
      typescript: true,
    })
  }

  return stripeInstance
}
