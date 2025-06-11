import { getProperties, getSavedSearches, getMarketTrends } from "@/lib/data"
import { createClient } from "@/app/lib/supabase/server"
import { redirect } from 'next/navigation'
import DashboardClient from "@/components/dashboard-client"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Get authenticated user data
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Authentication error:', userError?.message)
    redirect("/")
  }

  // Fetch data on the server - pass user ID to get only their properties
  const properties = await getProperties(user.id)
  const savedSearchesData = await getSavedSearches()
  const marketTrends = await getMarketTrends()

  return (
    <DashboardClient 
      initialProperties={properties}
      initialSavedSearches={savedSearchesData}
      initialMarketTrends={marketTrends}
      userEmail={user.email || ""}
    />
  )
}
