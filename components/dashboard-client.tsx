"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  Heart,
  Search,
  MessageSquare,
  Bell,
  TrendingUp,
  BarChart3,
  Plus,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PropertyCard } from "@/components/property-card"
import type { Property, SavedSearch, MarketTrends } from "@/types/dashboard"

// Define types for our props
interface DashboardClientProps {
  initialProperties: Property[]
  initialSavedSearches: SavedSearch[]
  initialMarketTrends: MarketTrends
  userEmail: string
}

export default function DashboardClient({
  userEmail,
  initialProperties,
  initialSavedSearches,
  initialMarketTrends, 
}: DashboardClientProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [properties, setProperties] = useState(initialProperties)
  const [savedSearches] = useState(initialSavedSearches)

  const handlePropertyUpdate = async () => {
    // Refetch properties
    try {
      const response = await fetch('/api/properties')
      if (!response.ok) throw new Error('Failed to fetch properties')
      const updatedProperties = await response.json()
      setProperties(updatedProperties)
    } catch (error) {
      console.error('Error refreshing properties:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-rose-50 to-rose-100 rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Welcome, {userEmail}</h1>
            <p className="text-sm text-gray-600 mt-1">Vaš osobni prostor za upravljanje nekretninama i pretragama</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2 relative h-9 bg-white"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-4 w-4" />
              <span className="hidden xs:inline">Obavijesti</span>
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-rose-400">
                5
              </Badge>
            </Button>
            <Button className="gap-2 bg-rose-400 hover:bg-rose-500 h-9 rounded-full" asChild>
              <Link href="/pretraga">
                <Search className="h-4 w-4" />
                <span className="hidden xs:inline">Nova pretraga</span>
              </Link>
            </Button>
          </div>
        </div>
        {showNotifications && (
          <div className="mt-4 p-4 bg-white rounded-md shadow-sm">
            <h3 className="text-lg font-medium mb-2">Obavijesti</h3>
            <ul className="space-y-2">
              <li>Nova nekretnina odgovara vašoj pretrazi</li>
              <li>Netko je spremio vašu nekretninu</li>
              <li>Novi upit za vašu nekretninu</li>
            </ul>
          </div>
        )}
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="Spremljene nekretnine"
          value={properties.length.toString()} //change to saved properties
          icon={<Heart className="h-4 w-4 text-rose-400" />}
        />
        <StatCard
          title="Spremljene pretrage"
          value={savedSearches.length.toString()}
          icon={<Search className="h-4 w-4 text-rose-400" />}
        />
        <StatCard
          title="Nepročitane poruke"
          value="3"
          icon={<MessageSquare className="h-4 w-4 text-rose-400" />}

        />
        <StatCard
          title="Aktivnost profila"
          value="78%"
          icon={<BarChart3 className="h-4 w-4 text-rose-400" />}
          progressValue={78}
          
        />
      </div>

      {/* MOJE NEKRETNINE */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Moje nekretnine</h2>
          <Button variant="ghost" size="sm" className="text-rose-500 h-8 px-2" asChild>
            <Link href="/dashboard/moje-nekretnine">
              Vidi sve
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} onUpdate={handlePropertyUpdate} editable={true} />
          ))}
        </div>
      </div>
      {/* SPREMLJENE NEKRETNINE */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Spremljene nekretnine</h2>
          <Button variant="ghost" size="sm" className="text-rose-500 h-8 px-2" asChild>
            <Link href="/dashboard/saved-properties">
              Vidi sve
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* change to saved properties */}
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} onUpdate={handlePropertyUpdate} editable={false} />
          ))}
        </div>
      </div>

      {/* Saved searches */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Spremljene pretrage</CardTitle>
            <Button variant="ghost" size="sm" className="text-rose-500 h-8 px-2" asChild>
              <Link href="/dashboard/saved-searches">
                Vidi sve
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <CardDescription>Vaše aktivne pretrage nekretnina</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {savedSearches.map((search) => (
            <div key={search.id} className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm">{search.name}</h3>
                {search.newMatches > 0 && <Badge className="bg-rose-400 text-xs">{search.newMatches} novih</Badge>}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{search.criteria}</p>
              <div className="flex justify-between items-center mt-3">
                <div className="text-xs text-muted-foreground">
                  Pronađeno: <span className="font-medium">{search.matches}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 p-0"
                >
                  <span>Rezultati</span>
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full gap-2 text-sm mt-2" asChild>
            <Link href="/pretraga">
              <Plus className="h-4 w-4" />
              <span>Nova pretraga</span>
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Market insights */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Tržišni trendovi</CardTitle>
          <CardDescription>Uvid u trenutno stanje tržišta nekretnina</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-sm font-medium">Prosječna cijena stanova</div>
              <div className="text-2xl font-bold">{initialMarketTrends.apartmentPrice}</div>
              <div className="flex items-center text-xs text-green-500">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span>{initialMarketTrends.apartmentChange} u odnosu na prošli mjesec</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Bazirano na {initialMarketTrends.apartmentSample} nekretnina u Zagrebu
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Prosječna cijena kuća</div>
              <div className="text-2xl font-bold">{initialMarketTrends.housePrice}</div>
              <div className="flex items-center text-xs text-green-500">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span>{initialMarketTrends.houseChange} u odnosu na prošli mjesec</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Bazirano na {initialMarketTrends.houseSample} nekretnina u Hrvatskoj
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Potražnja po lokacijama</div>
              <div className="space-y-2 mt-2">
                {initialMarketTrends.demandByLocation.map((item) => (
                  <div key={item.location}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{item.location}</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <Progress value={item.percentage} className="h-1.5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="link" className="mx-auto text-rose-500 text-sm">
            Pogledaj detaljnu analizu tržišta
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

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
    <Card className="overflow-hidden  h-20">
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
