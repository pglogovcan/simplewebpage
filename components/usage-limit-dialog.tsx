"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Crown, TrendingUp } from "lucide-react"
import Link from "next/link"

interface UsageLimitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  limitType: "property_listing" | "featured_listing" | "search" | "contact"
  currentUsage: number
  limit: number
  planType: string
}

export function UsageLimitDialog({
  open,
  onOpenChange,
  limitType,
  currentUsage,
  limit,
  planType,
}: UsageLimitDialogProps) {
  const getLimitMessage = () => {
    switch (limitType) {
      case "property_listing":
        return {
          title: "Property Listing Limit Reached",
          description: `You've reached your limit of ${limit} property listings on the ${planType} plan.`,
          action: "list more properties",
        }
      case "featured_listing":
        return {
          title: "Featured Listing Limit Reached",
          description: `You've reached your limit of ${limit} featured listings on the ${planType} plan.`,
          action: "feature more properties",
        }
      case "search":
        return {
          title: "Daily Search Limit Reached",
          description: `You've reached your daily limit of ${limit} searches on the ${planType} plan.`,
          action: "perform more searches",
        }
      case "contact":
        return {
          title: "Daily Contact Limit Reached",
          description: `You've reached your daily limit of ${limit} contacts on the ${planType} plan.`,
          action: "contact more agents",
        }
    }
  }

  const getUpgradeRecommendation = () => {
    if (planType === "basic") {
      return {
        plan: "Standard",
        benefits: ["25 property listings", "5 featured listings", "200 searches/day", "50 contacts/day"],
      }
    } else if (planType === "standard") {
      return {
        plan: "Premium",
        benefits: ["Unlimited listings", "Unlimited featured", "Unlimited searches", "Unlimited contacts"],
      }
    }
    return {
      plan: "Standard",
      benefits: ["25 property listings", "5 featured listings", "200 searches/day", "50 contacts/day"],
    }
  }

  const message = getLimitMessage()
  const upgrade = getUpgradeRecommendation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <DialogTitle>{message.title}</DialogTitle>
          </div>
          <DialogDescription>{message.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <TrendingUp className="h-4 w-4" />
            <AlertDescription>
              <strong>Current usage:</strong> {currentUsage} of {limit}
            </AlertDescription>
          </Alert>

          <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-rose-500" />
              <h4 className="font-semibold text-rose-900">Upgrade to {upgrade.plan}</h4>
            </div>
            <p className="text-sm text-rose-700 mb-3">
              Upgrade your plan to {message.action} and unlock these benefits:
            </p>
            <ul className="text-sm text-rose-700 space-y-1">
              {upgrade.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
          <Button asChild className="bg-rose-500 hover:bg-rose-600">
            <Link href="/cijene">Upgrade Now</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
