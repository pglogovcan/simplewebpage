"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamically import the RecommendedProperties component with SSR disabled
const RecommendedProperties = dynamic(() => import("@/components/recommended-properties"), {
  ssr: false,
})

export default function RecommendedPropertiesWrapper() {
  return (
    <Suspense fallback={null}>
      <RecommendedProperties />
    </Suspense>
  )
}
