import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-64 mx-auto mb-2" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>

        <div className="flex items-center justify-center mb-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center">
              <Skeleton className="w-8 h-8 rounded-full" />
              {index < 4 && <Skeleton className="w-12 h-1 mx-1" />}
            </div>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <Skeleton className="h-8 w-48" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-32 w-full" />
              </div>

              <div className="flex justify-between mt-8">
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-36" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
