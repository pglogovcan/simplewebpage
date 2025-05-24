import { Skeleton } from "@/components/ui/skeleton"

export default function SubscriptionsLoading() {
  return (
    <div className="container mx-auto py-10 px-4">
      <Skeleton className="h-10 w-48 mb-8" />
      <div className="space-y-6">
        <Skeleton className="h-[300px] w-full max-w-3xl" />
      </div>
    </div>
  )
}
