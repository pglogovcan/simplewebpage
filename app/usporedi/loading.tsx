import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[768px]">
          {/* Property Cards Skeleton */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="flex flex-col justify-end">
              <div className="h-64 flex items-end">
                <Skeleton className="h-6 w-32" />
              </div>
            </div>

            {[1, 2, 3].map((index) => (
              <div key={index} className="relative">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-6 w-full mt-2 mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>

          {/* Comparison Table Skeleton */}
          <div className="border-t border-gray-200 pt-6">
            <Skeleton className="h-8 w-48 mb-4" />

            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((row) => (
              <div key={row} className="grid grid-cols-4 gap-4 py-3 border-b border-gray-100">
                <Skeleton className="h-6 w-32" />
                {[1, 2, 3].map((col) => (
                  <Skeleton key={`${row}-${col}`} className="h-6 w-full" />
                ))}
              </div>
            ))}
          </div>

          {/* Action Buttons Skeleton */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div></div>
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex flex-col gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
