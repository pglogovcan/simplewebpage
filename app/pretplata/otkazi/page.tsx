import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function CancelPage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/prijava")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <AlertCircle className="h-16 w-16 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Plaćanje otkazano</h1>
          <p className="text-gray-600 mb-8">
            Vaše plaćanje je otkazano i niste pretplaćeni. Možete se vratiti na stranicu s cijenama i pokušati ponovno.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/cijene">Povratak na cijene</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Povratak na početnu stranicu</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
