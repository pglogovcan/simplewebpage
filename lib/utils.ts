import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names with Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency
 * @param value - The number to format
 * @param currency - The currency code (default: 'EUR')
 * @param locale - The locale to use for formatting (default: 'hr-HR')
 */
export function formatCurrency(value: number, currency = "EUR", locale = "hr-HR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Formats a number as square meters
 * @param value - The number to format
 * @param locale - The locale to use for formatting (default: 'hr-HR')
 */
export function formatArea(value: number, locale = "hr-HR"): string {
  return `${new Intl.NumberFormat(locale).format(value)} m²`
}

/**
 * Truncates text to a specified length and adds ellipsis
 * @param text - The text to truncate
 * @param length - The maximum length (default: 100)
 */
export function truncateText(text: string, length = 100): string {
  if (text.length <= length) return text
  return text.slice(0, length) + "..."
}

/**
 * Generates a slug from a string
 * @param text - The text to convert to a slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
}

/**
 * Debounces a function
 * @param fn - The function to debounce
 * @param ms - The debounce delay in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), ms)
  }
}

/**
 * Gets a random item from an array
 * @param arr - The array to get a random item from
 */
export function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Calculates the monthly mortgage payment
 * @param principal - The loan amount
 * @param interestRate - The annual interest rate (as a decimal)
 * @param termYears - The loan term in years
 */
export function calculateMortgagePayment(principal: number, interestRate: number, termYears: number): number {
  const monthlyRate = interestRate / 12
  const payments = termYears * 12
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1)
}

/**
 * Formats a date
 * @param date - The date to format
 * @param locale - The locale to use for formatting (default: 'hr-HR')
 */
export function formatDate(date: Date | string, locale = "hr-HR"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj)
}

/**
 * Calculates the time elapsed since a date
 * @param date - The date to calculate from
 */
export function timeAgo(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  const intervals = {
    godina: 31536000,
    mjesec: 2592000,
    tjedan: 604800,
    dan: 86400,
    sat: 3600,
    minuta: 60,
    sekunda: 1,
  }

  type IntervalKey = keyof typeof intervals

  for (const [name, secondsInInterval] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInInterval)
    if (interval >= 1) {
      // Handle Croatian grammar for different numbers
      let suffix = ""
      if (name === "godina") {
        suffix = interval === 1 ? "godinu" : interval < 5 ? "godine" : "godina"
      } else if (name === "mjesec") {
        suffix = interval === 1 ? "mjesec" : interval < 5 ? "mjeseca" : "mjeseci"
      } else if (name === "tjedan") {
        suffix = interval === 1 ? "tjedan" : interval < 5 ? "tjedna" : "tjedana"
      } else if (name === "dan") {
        suffix = interval === 1 ? "dan" : "dana"
      } else if (name === "sat") {
        suffix = interval === 1 ? "sat" : interval < 5 ? "sata" : "sati"
      } else if (name === "minuta") {
        suffix = interval === 1 ? "minutu" : interval < 5 ? "minute" : "minuta"
      } else if (name === "sekunda") {
        suffix = interval === 1 ? "sekundu" : interval < 5 ? "sekunde" : "sekundi"
      }

      return `prije ${interval} ${suffix}`
    }
  }

  return "upravo sada"
}

/**
 * Generates a random ID
 * @param length - The length of the ID (default: 8)
 */
export function generateId(length = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
}
