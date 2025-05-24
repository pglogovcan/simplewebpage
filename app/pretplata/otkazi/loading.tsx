import { Skeleton } from "@/components/ui/skeleton"

export default function CancelLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md p-6 space-y-6">
        <div className="flex justify-center">
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
        <Skeleton className="h-10 w-3/4 mx-auto" />
        <Skeleton className="h-20 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
