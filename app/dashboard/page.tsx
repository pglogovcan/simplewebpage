
import type React from "react"

import { Suspense } from "react"
import DashboardClient from "@/components/dashboard-client"
/* import { getProperties, getSavedSearches, getMarketTrends } from "@/lib/data" // Assuming these functions exist */
import Image from "next/image"
import Link from "next/link"
import { Heart, MapPin, Eye, Bed, Bath, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from "next/headers";
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

import { useAuth } from '@/app/context/AuthContext'
import { toast } from "@/hooks/use-toast"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect("/");
  }
  // Fetch data on the server
  const properties = await getProperties()
  const savedSearchesData = await getSavedSearches()
  const marketTrends = await getMarketTrends()

  return <DashboardClient 
        initialProperties={properties}
        initialSavedSearches={savedSearchesData}
        initialMarketTrends={marketTrends}
        userEmail={session?.user?.email || ""} />;

  /* return (
    <Suspense fallback={<div>Učitavanje...</div>}>
      <DashboardClient
        initialProperties={properties}
        initialSavedSearches={savedSearchesData}
        initialMarketTrends={marketTrends}
      />
    </Suspense>
  ) */
}

// Client Component - to make interactive
// export default function DashboardPage() {
//   const [showNotifications, setShowNotifications] = useState(false)

//   // Mock data
//   const recentProperties = [
//     {
//       id: "1",
//       title: "Moderan stan u centru grada",
//       price: 185000,
//       location: "Zagreb, Donji grad",
//       image: "/placeholder.svg?height=400&width=600&text=Stan+Zagreb",
//       bedrooms: 2,
//       area: 68,
//       date: "Prije 2 dana",
//     },
//     {
//       id: "2",
//       title: "Luksuzna vila s bazenom",
//       price: 750000,
//       location: "Split, Žnjan",
//       bedrooms: 4,
//       bathrooms: 3,
//       area: 220,
//       type: "Vila",
//       images: [
//         "/placeholder.svg?height=400&width=600&text=Slika+4",
//         "/placeholder.svg?height=400&width=600&text=Slika+5",
//         "/placeholder.svg?height=400&width=600&text=Slika+6",
//       ],
//       featured: true,
//       new: false,
//       dateAdded: "2023-11-15",
//       coordinates: [43.51, 16.47],
//     },
//     {
//       id: "3",
//       title: "Novogradnja - stan s terasom",
//       price: 210000,
//       location: "Rijeka, Centar",
//       bedrooms: 3,
//       bathrooms: 2,
//       area: 85,
//       type: "Stan",
//       images: [
//         "/placeholder.svg?height=400&width=600&text=Slika+7",
//         "/placeholder.svg?height=400&width=600&text=Slika+8",
//         "/placeholder.svg?height=400&width=600&text=Slika+9",
//       ],
//       featured: false,
//       new: true,
//       dateAdded: "2023-12-10",
//       coordinates: [45.33, 14.44],
//     },
//     {
//       id: "4",
//       title: "Kuća s vrtom blizu mora",
//       price: 320000,
//       location: "Zadar, Borik",
//       bedrooms: 3,
//       bathrooms: 2,
//       area: 120,
//       type: "Kuća",
//       images: [
//         "/placeholder.svg?height=400&width=600&text=Slika+10",
//         "/placeholder.svg?height=400&width=600&text=Slika+11",
//         "/placeholder.svg?height=400&width=600&text=Slika+12",
//       ],
//       featured: true,
//       new: false,
//       dateAdded: "2023-10-20",
//       coordinates: [44.12, 15.24],
//     },
//     {
//       id: "5",
//       title: "Penthouse s panoramskim pogledom",
//       price: 450000,
//       location: "Split, Bačvice",
//       bedrooms: 3,
//       bathrooms: 2,
//       area: 110,
//       type: "Penthouse",
//       images: [
//         "/placeholder.svg?height=400&width=600&text=Slika+13",
//         "/placeholder.svg?height=400&width=600&text=Slika+14",
//       ],
//       featured: true,
//       new: false,
//       dateAdded: "2023-11-05",
//       coordinates: [43.5, 16.45],
//     },
//     {
//       id: "6",
//       title: "Apartman u turističkom naselju",
//       price: 120000,
//       location: "Poreč, Centar",
//       bedrooms: 1,
//       bathrooms: 1,
//       area: 45,
//       type: "Apartman",
//       images: [
//         "/placeholder.svg?height=400&width=600&text=Slika+15",
//         "/placeholder.svg?height=400&width=600&text=Slika+16",
//       ],
//       featured: false,
//       new: false,
//       dateAdded: "2023-09-15",
//       coordinates: [45.23, 13.59],
//     },
//     {
//       id: "7",
//       title: "Obiteljska kuća s garažom",
//       price: 280000,
//       location: "Osijek, Retfala",
//       bedrooms: 4,
//       bathrooms: 2,
//       area: 150,
//       type: "Kuća",
//       images: [
//         "/placeholder.svg?height=400&width=600&text=Slika+17",
//         "/placeholder.svg?height=400&width=600&text=Slika+18",
//       ],
//       featured: true,
//       new: false,
//       dateAdded: "2023-10-10",
//       coordinates: [45.56, 18.7],
//     },
//     {
//       id: "8",
//       title: "Ekskluzivni dupleks u novogradnji",
//       price: 320000,
//       location: "Zagreb, Maksimir",
//       bedrooms: 3,
//       bathrooms: 2,
//       area: 95,
//       type: "Dupleks",
//       images: [
//         "/placeholder.svg?height=400&width=600&text=Slika+19",
//         "/placeholder.svg?height=400&width=600&text=Slika+20",
//       ],
//       featured: false,
//       new: true,
//       dateAdded: "2023-12-05",
//       coordinates: [45.82, 16.01],
//     },
//   ]

//   const savedSearches = [
//     {
//       id: "1",
//       name: "Stan u Zagrebu",
//       criteria: "Zagreb, 2+ sobe, do 200.000€",
//       matches: 24,
//       newMatches: 2,
//     },
//     {
//       id: "2",
//       name: "Kuća na moru",
//       criteria: "Split, Zadar, kuća, blizu mora",
//       matches: 18,
//       newMatches: 0,
//     },
//   ]

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
//       price,
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Welcome section */}
//       <div className="bg-gradient-to-r from-rose-50 to-rose-100 rounded-xl p-4 sm:p-6 mb-6">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Dobrodošli, Korisniče!</h1>
//             <p className="text-sm text-gray-600 mt-1">Vaš osobni prostor za upravljanje nekretninama i pretragama</p>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               className="gap-2 relative h-9 bg-white"
//               onClick={() => setShowNotifications(!showNotifications)}
//             >
//               <Bell className="h-4 w-4" />
//               <span className="hidden xs:inline">Obavijesti</span>
//               <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-rose-400">
//                 5
//               </Badge>
//             </Button>
//             <Button className="gap-2 bg-rose-400 hover:bg-rose-500 h-9 rounded-full" asChild>
//               <Link href="/pretraga">
//                 <Search className="h-4 w-4" />
//                 <span className="hidden xs:inline">Nova pretraga</span>
//               </Link>
//             </Button>
//           </div>
//         </div>
//         {showNotifications && (
//           <div className="mt-4 p-4 bg-white rounded-md shadow-sm">
//             <h3 className="text-lg font-medium mb-2">Obavijesti</h3>
//             <ul className="space-y-2">
//               <li>Nova nekretnina odgovara vašoj pretrazi</li>
//               <li>Netko je spremio vašu nekretninu</li>
//               <li>Novi upit za vašu nekretninu</li>
//             </ul>
//           </div>
//         )}
//       </div>

//       {/* Stats overview */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//         <StatCard
//           title="Spremljene nekretnine"
//           value="12"
//           icon={<Heart className="h-4 w-4 text-rose-400" />}
//           trend={
//             <>
//               <TrendingUp className="h-3 w-3 text-green-500" /> <span className="text-green-500">+2</span>
//             </>
//           }
//           trendText="u posljednjih 30 dana"
//         />
//         <StatCard
//           title="Spremljene pretrage"
//           value="4"
//           icon={<Search className="h-4 w-4 text-rose-400" />}
//           trend={
//             <>
//               <TrendingUp className="h-3 w-3 text-green-500" /> <span className="text-green-500">+1</span>
//             </>
//           }
//           trendText="u posljednjih 30 dana"
//         />
//         <StatCard
//           title="Nepročitane poruke"
//           value="3"
//           icon={<MessageSquare className="h-4 w-4 text-rose-400" />}
//           trendText="2 nove poruke danas"
//         />
//         <StatCard
//           title="Aktivnost profila"
//           value="78%"
//           icon={<BarChart3 className="h-4 w-4 text-rose-400" />}
//           progressValue={78}
//         />
//       </div>

//       {/* Recent saved properties */}
//       <div>
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold">Nedavno spremljene nekretnine</h2>
//           <Button variant="ghost" size="sm" className="text-rose-500 h-8 px-2" asChild>
//             <Link href="/dashboard/saved-properties">
//               Vidi sve
//               <ChevronRight className="ml-1 h-4 w-4" />
//             </Link>
//           </Button>
//         </div>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {recentProperties.map((property) => (
//             <PropertyCard key={property.id} property={property} />
//           ))}
//         </div>
//       </div>

//       {/* Saved searches */}
//       <Card>
//         <CardHeader className="pb-2">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-lg">Spremljene pretrage</CardTitle>
//             <Button variant="ghost" size="sm" className="text-rose-500 h-8 px-2" asChild>
//               <Link href="/dashboard/saved-searches">
//                 Vidi sve
//                 <ChevronRight className="ml-1 h-4 w-4" />
//               </Link>
//             </Button>
//           </div>
//           <CardDescription>Vaše aktivne pretrage nekretnina</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-3">
//           {savedSearches.map((search) => (
//             <div key={search.id} className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
//               <div className="flex justify-between items-start">
//                 <h3 className="font-medium text-sm">{search.name}</h3>
//                 {search.newMatches > 0 && <Badge className="bg-rose-400 text-xs">{search.newMatches} novih</Badge>}
//               </div>
//               <p className="text-xs text-muted-foreground mt-1">{search.criteria}</p>
//               <div className="flex justify-between items-center mt-3">
//                 <div className="text-xs text-muted-foreground">
//                   Pronađeno: <span className="font-medium">{search.matches}</span>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="h-7 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 p-0"
//                 >
//                   <span>Rezultati</span>
//                   <ChevronRight className="h-3 w-3 ml-1" />
//                 </Button>
//               </div>
//             </div>
//           ))}
//           <Button variant="outline" className="w-full gap-2 text-sm mt-2" asChild>
//             <Link href="/pretraga">
//               <Plus className="h-4 w-4" />
//               <span>Nova pretraga</span>
//             </Link>
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Market insights */}
//       <Card>
//         <CardHeader className="pb-2">
//           <CardTitle className="text-lg">Tržišni trendovi</CardTitle>
//           <CardDescription>Uvid u trenutno stanje tržišta nekretnina</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-6">
//             <div className="space-y-2">
//               <div className="text-sm font-medium">Prosječna cijena stanova</div>
//               <div className="text-2xl font-bold">2.350 €/m²</div>
//               <div className="flex items-center text-xs text-green-500">
//                 <TrendingUp className="mr-1 h-3 w-3" />
//                 <span>+3.2% u odnosu na prošli mjesec</span>
//               </div>
//               <p className="text-xs text-muted-foreground mt-1">Bazirano na 1,245 nekretnina u Zagrebu</p>
//             </div>

//             <div className="space-y-2">
//               <div className="text-sm font-medium">Prosječna cijena kuća</div>
//               <div className="text-2xl font-bold">1.850 €/m²</div>
//               <div className="flex items-center text-xs text-green-500">
//                 <TrendingUp className="mr-1 h-3 w-3" />
//                 <span>+1.8% u odnosu na prošli mjesec</span>
//               </div>
//               <p className="text-xs text-muted-foreground mt-1">Bazirano na 875 nekretnina u Hrvatskoj</p>
//             </div>

//             <div className="space-y-2">
//               <div className="text-sm font-medium">Potražnja po lokacijama</div>
//               <div className="space-y-2 mt-2">
//                 <div>
//                   <div className="flex justify-between text-xs mb-1">
//                     <span>Zagreb</span>
//                     <span>42%</span>
//                   </div>
//                   <Progress value={42} className="h-1.5" />
//                 </div>
//                 <div>
//                   <div className="flex justify-between text-xs mb-1">
//                     <span>Split</span>
//                     <span>28%</span>
//                   </div>
//                   <Progress value={28} className="h-1.5" />
//                 </div>
//                 <div>
//                   <div className="flex justify-between text-xs mb-1">
//                     <span>Rijeka</span>
//                     <span>15%</span>
//                   </div>
//                   <Progress value={15} className="h-1.5" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button variant="link" className="mx-auto text-rose-500 text-sm">
//             Pogledaj detaljnu analizu tržišta
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  trend,
  trendText,
  progressValue,
}: {
  title: string
  value: string
  icon: React.ReactNode
  trend?: React.ReactNode
  trendText?: string
  progressValue?: number
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-3">
        <CardTitle className="text-xs font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="px-3 pb-3 pt-0">
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {trend} {trendText}
          </div>
        )}
        {!trend && trendText && <p className="text-xs text-muted-foreground mt-1">{trendText}</p>}
        {progressValue !== undefined && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Popunjenost profila</span>
              <span>{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-1.5" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Activity Item Component
function ActivityItem({
  icon,
  iconBg,
  title,
  description,
  time,
  action,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  description: string
  time: string
  action: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      <div className={`rounded-full ${iconBg} p-2 shrink-0`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-muted-foreground mt-1">{description}</div>
        <div className="mt-2">{action}</div>
      </div>
      <div className="text-xs text-muted-foreground whitespace-nowrap">{time}</div>
    </div>
  )
}

// Property Card Component
function PropertyCard({ property }: { property: any }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
      price,
    )
  }

  return (
    <Link href={`/nekretnine/${property.id}`}>
      <Card className="overflow-hidden group">
        <div className="relative h-40 w-full">
          <Image
            src={property.image || "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur-sm rounded-full">
              <Heart className="h-4 w-4 text-rose-500" />
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 z-10">
            <div className="text-white font-bold text-lg sm:text-xl">{formatPrice(property.price)}</div>
          </div>
        </div>
        <CardContent className="p-3">
          <div className="flex items-start gap-1 text-gray-500 text-xs sm:text-sm mb-2">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 mt-0.5" />
            <span>{property.location}</span>
          </div>
          <h3 className="font-semibold text-sm sm:text-lg mb-2 group-hover:text-rose-500 transition-colors line-clamp-2">
            {property.title}
          </h3>
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-2 sm:gap-4">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bed className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <span>{property.bedrooms}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Bath className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                <span>{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Maximize className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                <span>{property.area} m²</span>
              </div>
            </div>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{property.type}</span>
          </div>
        </CardContent>
        <CardFooter className="p-0">
          <Link href={`/nekretnine/${property.id}`} className="w-full">
            <Button
              variant="ghost"
              className="w-full rounded-none text-xs justify-center gap-1 text-rose-500 hover:bg-rose-50"
            >
              <Eye className="h-3 w-3" />
              Pogledaj detalje
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </Link>
  )
}

// Empty State Component
function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action: React.ReactNode
}) {
  return (
    <Card className="mt-6">
      <CardContent className="flex items-center justify-center py-10">
        <div className="text-center">
          {icon}
          <h3 className="text-lg font-medium mb-2 mt-4">{title}</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">{description}</p>
          {action}
        </div>
      </CardContent>
    </Card>
  )
}
