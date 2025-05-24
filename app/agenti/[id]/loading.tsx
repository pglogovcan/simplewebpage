import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen pt-32 sm:pt-36 md:pt-40">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <Skeleton className="h-5 w-64 mb-6" />

        {/* Agent profile header */}
        <Card className="mb-8">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <Skeleton className="w-full aspect-square rounded-lg" />
              </div>

              <div className="md:w-3/4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <div className="flex items-center mt-2 sm:mt-0 gap-4">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-28" />
                </div>

                <div className="flex gap-2">
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-10 w-40" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Agent details */}
          <div className="lg:col-span-2">
            <Skeleton className="h-10 w-full mb-6" />
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-7 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Skeleton className="h-6 w-32 mb-3" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  </div>

                  <div>
                    <Skeleton className="h-6 w-32 mb-3" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Contact form */}
          <div>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-7 w-48 mb-4" />
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
