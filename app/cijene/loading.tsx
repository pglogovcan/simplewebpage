import { Skeleton } from "@/components/ui/skeleton"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-grow pt-24">
        {/* Hero Section Skeleton */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <Skeleton className="h-12 w-3/4 max-w-2xl mx-auto mb-6" />
            <Skeleton className="h-6 w-2/3 max-w-xl mx-auto mb-10" />
            <Skeleton className="h-10 w-64 mx-auto mb-12" />
          </div>
        </section>

        {/* Pricing Cards Skeleton */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-2 border-gray-200 rounded-lg p-6">
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-48 mb-6" />
                  <Skeleton className="h-10 w-24 mb-8" />
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="flex items-start">
                        <Skeleton className="h-5 w-5 mr-2" />
                        <Skeleton className="h-5 w-full" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full mt-6" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison Skeleton */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-64 mx-auto mb-12" />
            <div className="max-w-5xl mx-auto">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </section>

        {/* Testimonials Skeleton */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-64 mx-auto mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-6">
                  <Skeleton className="h-5 w-32 mb-4" />
                  <Skeleton className="h-24 w-full mb-6" />
                  <div className="flex items-center">
                    <Skeleton className="h-12 w-12 rounded-full mr-4" />
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section Skeleton */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-rose-500 to-rose-400">
          <div className="container mx-auto px-4 text-center">
            <Skeleton className="h-10 w-64 bg-white/30 mx-auto mb-6" />
            <Skeleton className="h-6 w-2/3 max-w-xl bg-white/30 mx-auto mb-10" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-12 w-40 bg-white/30" />
              <Skeleton className="h-12 w-40 bg-white/30" />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
