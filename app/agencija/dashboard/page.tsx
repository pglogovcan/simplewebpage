"use client"

import { useState } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Home,
  Building,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Plus,
  ArrowUpRight,
  Eye,
  Edit,
  Trash2,
  Search,
  Bell,
  User,
  Check,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function AgencyDashboard() {
  const [activeTab, setActiveTab] = useState("pregled")

  // Mock data
  const recentListings = [
    {
      id: 1,
      title: "Luksuzni stan u centru",
      location: "Zagreb, Centar",
      price: "320.000 €",
      status: "active",
      views: 243,
      inquiries: 8,
      date: "12.03.2024.",
    },
    {
      id: 2,
      title: "Moderna kuća s bazenom",
      location: "Split, Žnjan",
      price: "450.000 €",
      status: "active",
      views: 187,
      inquiries: 5,
      date: "15.03.2024.",
    },
    {
      id: 3,
      title: "Poslovni prostor",
      location: "Rijeka, Centar",
      price: "180.000 €",
      status: "pending",
      views: 0,
      inquiries: 0,
      date: "20.03.2024.",
    },
  ]

  const recentInquiries = [
    {
      id: 1,
      name: "Marko Marković",
      email: "marko@example.com",
      phone: "+385 91 234 5678",
      property: "Luksuzni stan u centru",
      date: "19.03.2024.",
      read: false,
    },
    {
      id: 2,
      name: "Ana Anić",
      email: "ana@example.com",
      phone: "+385 98 765 4321",
      property: "Moderna kuća s bazenom",
      date: "18.03.2024.",
      read: true,
    },
    {
      id: 3,
      name: "Ivan Ivić",
      email: "ivan@example.com",
      phone: "+385 95 123 4567",
      property: "Luksuzni stan u centru",
      date: "17.03.2024.",
      read: true,
    },
  ]

  const agents = [
    {
      id: 1,
      name: "Ivana Horvat",
      role: "Voditelj prodaje",
      email: "ivana@agencija.hr",
      phone: "+385 91 123 4567",
      listings: 12,
    },
    {
      id: 2,
      name: "Petar Perić",
      role: "Agent za nekretnine",
      email: "petar@agencija.hr",
      phone: "+385 98 234 5678",
      listings: 8,
    },
    {
      id: 3,
      name: "Maja Majić",
      role: "Agent za nekretnine",
      email: "maja@agencija.hr",
      phone: "+385 95 345 6789",
      listings: 5,
    },
  ]

  const stats = {
    activeListings: 24,
    totalViews: 4328,
    totalInquiries: 56,
    conversionRate: "1.3%",
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-grow pt-32 sm:pt-36 md:pt-40 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <aside className="md:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-40">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Agency Logo" />
                      <AvatarFallback>AN</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-sm">Agencija Nekretnine</h3>
                      <p className="text-xs text-gray-500">Premium plan</p>
                    </div>
                  </div>
                </div>

                <nav className="p-2">
                  <ul className="space-y-1">
                    <li>
                      <Button
                        variant={activeTab === "pregled" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("pregled")}
                      >
                        <Home className="mr-2 h-4 w-4" />
                        Pregled
                      </Button>
                    </li>
                    <li>
                      <Button
                        variant={activeTab === "nekretnine" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("nekretnine")}
                      >
                        <Building className="mr-2 h-4 w-4" />
                        Nekretnine
                      </Button>
                    </li>
                    <li>
                      <Button
                        variant={activeTab === "agenti" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("agenti")}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Agenti
                      </Button>
                    </li>
                    <li>
                      <Button
                        variant={activeTab === "upiti" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("upiti")}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Upiti
                        <Badge className="ml-auto bg-rose-500 hover:bg-rose-600">3</Badge>
                      </Button>
                    </li>
                    <li>
                      <Button
                        variant={activeTab === "statistika" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("statistika")}
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Statistika
                      </Button>
                    </li>
                    <li>
                      <Button
                        variant={activeTab === "postavke" ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveTab("postavke")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Postavke
                      </Button>
                    </li>
                  </ul>
                </nav>

                <div className="p-4 mt-4">
                  <Button className="w-full bg-rose-500 hover:bg-rose-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Dodaj nekretninu
                  </Button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Dashboard Overview */}
              {activeTab === "pregled" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Pregled</h1>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm">
                        <Bell className="h-4 w-4 mr-2" />
                        Obavijesti
                      </Button>
                      <Avatar>
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-gray-500">Aktivni oglasi</p>
                          <h3 className="text-2xl font-bold">{stats.activeListings}</h3>
                          <p className="text-xs text-green-600">+2 u zadnjih 7 dana</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-gray-500">Ukupni pregledi</p>
                          <h3 className="text-2xl font-bold">{stats.totalViews}</h3>
                          <p className="text-xs text-green-600">+342 u zadnjih 7 dana</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-gray-500">Upiti</p>
                          <h3 className="text-2xl font-bold">{stats.totalInquiries}</h3>
                          <p className="text-xs text-green-600">+8 u zadnjih 7 dana</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-gray-500">Stopa konverzije</p>
                          <h3 className="text-2xl font-bold">{stats.conversionRate}</h3>
                          <p className="text-xs text-green-600">+0.2% u zadnjih 7 dana</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Listings */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Nedavno dodane nekretnine</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="#">
                            Vidi sve
                            <ArrowUpRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <CardDescription>Pregled nedavno dodanih nekretnina i njihov status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Naslov</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Lokacija</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cijena</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Pregledi</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Upiti</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Datum</th>
                              <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Akcije</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentListings.map((listing) => (
                              <tr key={listing.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <div className="font-medium">{listing.title}</div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">{listing.location}</td>
                                <td className="py-3 px-4 text-sm font-medium">{listing.price}</td>
                                <td className="py-3 px-4">
                                  <Badge
                                    className={
                                      listing.status === "active"
                                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    }
                                  >
                                    {listing.status === "active" ? "Aktivan" : "Na čekanju"}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-sm">{listing.views}</td>
                                <td className="py-3 px-4 text-sm">{listing.inquiries}</td>
                                <td className="py-3 px-4 text-sm text-gray-600">{listing.date}</td>
                                <td className="py-3 px-4">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Inquiries */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Nedavni upiti</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="#">
                            Vidi sve
                            <ArrowUpRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <CardDescription>Pregled nedavnih upita za vaše nekretnine</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentInquiries.map((inquiry) => (
                          <div
                            key={inquiry.id}
                            className={`p-4 rounded-lg border ${inquiry.read ? "border-gray-200" : "border-rose-200 bg-rose-50"}`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium flex items-center">
                                  {inquiry.name}
                                  {!inquiry.read && <Badge className="ml-2 bg-rose-500">Novo</Badge>}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  Upit za: <span className="font-medium">{inquiry.property}</span>
                                </p>
                                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                  <span>{inquiry.email}</span>
                                  <span>{inquiry.phone}</span>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500">{inquiry.date}</div>
                            </div>
                            <div className="mt-3 flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                Označi kao pročitano
                              </Button>
                              <Button size="sm" className="bg-rose-500 hover:bg-rose-600">
                                Odgovori
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Properties Tab */}
              {activeTab === "nekretnine" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Nekretnine</h1>
                    <Button className="bg-rose-500 hover:bg-rose-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Dodaj nekretninu
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Pretraži nekretnine..." className="pl-10 w-full sm:w-80" />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" className="whitespace-nowrap">
                        Svi oglasi
                      </Button>
                      <Button variant="outline" size="sm" className="whitespace-nowrap">
                        Aktivni
                      </Button>
                      <Button variant="outline" size="sm" className="whitespace-nowrap">
                        Na čekanju
                      </Button>
                      <Button variant="outline" size="sm" className="whitespace-nowrap">
                        Arhivirani
                      </Button>
                    </div>
                  </div>

                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Naslov</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Lokacija</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cijena</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Pregledi</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Upiti</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Datum</th>
                              <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Akcije</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...recentListings, ...recentListings].map((listing, index) => (
                              <tr key={`${listing.id}-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <div className="font-medium">{listing.title}</div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">{listing.location}</td>
                                <td className="py-3 px-4 text-sm font-medium">{listing.price}</td>
                                <td className="py-3 px-4">
                                  <Badge
                                    className={
                                      listing.status === "active"
                                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    }
                                  >
                                    {listing.status === "active" ? "Aktivan" : "Na čekanju"}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-sm">{listing.views}</td>
                                <td className="py-3 px-4 text-sm">{listing.inquiries}</td>
                                <td className="py-3 px-4 text-sm text-gray-600">{listing.date}</td>
                                <td className="py-3 px-4">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Agents Tab */}
              {activeTab === "agenti" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Agenti</h1>
                    <Button className="bg-rose-500 hover:bg-rose-600">
                      <Plus className="mr-2 h-4 w-4" />
                      Dodaj agenta
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents.map((agent) => (
                      <Card key={agent.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage
                                src={`/placeholder.svg?height=64&width=64&text=${agent.name.charAt(0)}`}
                                alt={agent.name}
                              />
                              <AvatarFallback>
                                {agent.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-medium">{agent.name}</h3>
                              <p className="text-sm text-gray-500">{agent.role}</p>
                              <div className="mt-2 space-y-1 text-sm">
                                <p>{agent.email}</p>
                                <p>{agent.phone}</p>
                              </div>
                              <div className="mt-3 flex items-center justify-between">
                                <span className="text-sm">
                                  <span className="font-medium">{agent.listings}</span> aktivnih oglasa
                                </span>
                                <Button variant="ghost" size="sm">
                                  Uredi
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Inquiries Tab */}
              {activeTab === "upiti" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Upiti</h1>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Označi sve kao pročitano
                      </Button>
                      <Button variant="outline" size="sm">
                        Arhiviraj pročitane
                      </Button>
                    </div>
                  </div>

                  <Tabs defaultValue="neprocitani">
                    <TabsList>
                      <TabsTrigger value="neprocitani">Nepročitani</TabsTrigger>
                      <TabsTrigger value="svi">Svi upiti</TabsTrigger>
                      <TabsTrigger value="arhivirani">Arhivirani</TabsTrigger>
                    </TabsList>

                    <TabsContent value="neprocitani" className="mt-4">
                      <Card>
                        <CardContent className="p-4 space-y-4">
                          {recentInquiries
                            .filter((i) => !i.read)
                            .map((inquiry) => (
                              <div key={inquiry.id} className="p-4 rounded-lg border border-rose-200 bg-rose-50">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium flex items-center">
                                      {inquiry.name}
                                      <Badge className="ml-2 bg-rose-500">Novo</Badge>
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1">
                                      Upit za: <span className="font-medium">{inquiry.property}</span>
                                    </p>
                                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                      <span>{inquiry.email}</span>
                                      <span>{inquiry.phone}</span>
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-500">{inquiry.date}</div>
                                </div>
                                <div className="mt-3 flex justify-end gap-2">
                                  <Button variant="outline" size="sm">
                                    Označi kao pročitano
                                  </Button>
                                  <Button size="sm" className="bg-rose-500 hover:bg-rose-600">
                                    Odgovori
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="svi" className="mt-4">
                      <Card>
                        <CardContent className="p-4 space-y-4">
                          {recentInquiries.map((inquiry) => (
                            <div
                              key={inquiry.id}
                              className={`p-4 rounded-lg border ${inquiry.read ? "border-gray-200" : "border-rose-200 bg-rose-50"}`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium flex items-center">
                                    {inquiry.name}
                                    {!inquiry.read && <Badge className="ml-2 bg-rose-500">Novo</Badge>}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    Upit za: <span className="font-medium">{inquiry.property}</span>
                                  </p>
                                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                    <span>{inquiry.email}</span>
                                    <span>{inquiry.phone}</span>
                                  </div>
                                </div>
                                <div className="text-sm text-gray-500">{inquiry.date}</div>
                              </div>
                              <div className="mt-3 flex justify-end gap-2">
                                {!inquiry.read ? (
                                  <Button variant="outline" size="sm">
                                    Označi kao pročitano
                                  </Button>
                                ) : (
                                  <Button variant="outline" size="sm">
                                    Arhiviraj
                                  </Button>
                                )}
                                <Button size="sm" className="bg-rose-500 hover:bg-rose-600">
                                  Odgovori
                                </Button>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="arhivirani" className="mt-4">
                      <Card>
                        <CardContent className="p-6 text-center text-gray-500">
                          <p>Nema arhiviranih upita</p>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {/* Statistics Tab */}
              {activeTab === "statistika" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Statistika</h1>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Ovaj mjesec
                      </Button>
                      <Button variant="outline" size="sm">
                        Zadnjih 30 dana
                      </Button>
                      <Button variant="outline" size="sm">
                        Zadnjih 90 dana
                      </Button>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-gray-500">Aktivni oglasi</p>
                          <h3 className="text-2xl font-bold">{stats.activeListings}</h3>
                          <p className="text-xs text-green-600">+2 u zadnjih 30 dana</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-gray-500">Ukupni pregledi</p>
                          <h3 className="text-2xl font-bold">{stats.totalViews}</h3>
                          <p className="text-xs text-green-600">+1,245 u zadnjih 30 dana</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-gray-500">Upiti</p>
                          <h3 className="text-2xl font-bold">{stats.totalInquiries}</h3>
                          <p className="text-xs text-green-600">+23 u zadnjih 30 dana</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm text-gray-500">Stopa konverzije</p>
                          <h3 className="text-2xl font-bold">{stats.conversionRate}</h3>
                          <p className="text-xs text-green-600">+0.3% u zadnjih 30 dana</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts would go here - using placeholders */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Pregledi po nekretninama</CardTitle>
                        <CardDescription>Broj pregleda za svaku nekretninu u zadnjih 30 dana</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500">Graf pregleda po nekretninama</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Upiti kroz vrijeme</CardTitle>
                        <CardDescription>Broj upita po danu u zadnjih 30 dana</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500">Graf upita kroz vrijeme</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Najpopularnije nekretnine</CardTitle>
                      <CardDescription>Nekretnine s najviše pregleda i upita</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Naslov</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Lokacija</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cijena</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Pregledi</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Upiti</th>
                              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                Stopa konverzije
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentListings.map((listing) => (
                              <tr key={listing.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4">
                                  <div className="font-medium">{listing.title}</div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600">{listing.location}</td>
                                <td className="py-3 px-4 text-sm font-medium">{listing.price}</td>
                                <td className="py-3 px-4 text-sm">{listing.views}</td>
                                <td className="py-3 px-4 text-sm">{listing.inquiries}</td>
                                <td className="py-3 px-4 text-sm">
                                  {((listing.inquiries / listing.views) * 100).toFixed(1)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "postavke" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Postavke</h1>
                  </div>

                  <Tabs defaultValue="profil">
                    <TabsList>
                      <TabsTrigger value="profil">Profil agencije</TabsTrigger>
                      <TabsTrigger value="korisnici">Korisnici</TabsTrigger>
                      <TabsTrigger value="pretplata">Pretplata</TabsTrigger>
                      <TabsTrigger value="obavijesti">Obavijesti</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profil" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Profil agencije</CardTitle>
                          <CardDescription>Uredite osnovne podatke o vašoj agenciji</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-col sm:flex-row gap-6">
                            <div className="sm:w-1/3">
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                  <Building className="h-12 w-12 text-gray-400" />
                                </div>
                                <Button variant="outline" size="sm">
                                  Promijeni logo
                                </Button>
                                <p className="text-xs text-gray-500 mt-2">Preporučena veličina: 400x400px</p>
                              </div>
                            </div>

                            <div className="sm:w-2/3 space-y-4">
                              <div>
                                <Label htmlFor="agencyName">Naziv agencije</Label>
                                <Input id="agencyName" defaultValue="Agencija Nekretnine" />
                              </div>

                              <div>
                                <Label htmlFor="agencyDescription">Opis agencije</Label>
                                <Textarea
                                  id="agencyDescription"
                                  rows={4}
                                  defaultValue="Agencija Nekretnine je vodeća agencija za nekretnine u Hrvatskoj s više od 10 godina iskustva. Specijalizirali smo se za prodaju i najam stanova, kuća i poslovnih prostora."
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="agencyEmail">Email</Label>
                                  <Input id="agencyEmail" defaultValue="info@agencija-nekretnine.hr" />
                                </div>

                                <div>
                                  <Label htmlFor="agencyPhone">Telefon</Label>
                                  <Input id="agencyPhone" defaultValue="+385 1 234 5678" />
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="agencyAddress">Adresa</Label>
                                <Input id="agencyAddress" defaultValue="Ilica 123, 10000 Zagreb" />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <Label htmlFor="agencyWebsite">Web stranica</Label>
                                  <Input id="agencyWebsite" defaultValue="www.agencija-nekretnine.hr" />
                                </div>

                                <div>
                                  <Label htmlFor="agencyFacebook">Facebook</Label>
                                  <Input id="agencyFacebook" defaultValue="facebook.com/agencija" />
                                </div>

                                <div>
                                  <Label htmlFor="agencyInstagram">Instagram</Label>
                                  <Input id="agencyInstagram" defaultValue="instagram.com/agencija" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button className="bg-rose-500 hover:bg-rose-600">Spremi promjene</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="korisnici" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Korisnici</CardTitle>
                          <CardDescription>Upravljajte korisničkim računima za vašu agenciju</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4 flex justify-end">
                            <Button className="bg-rose-500 hover:bg-rose-600">
                              <Plus className="mr-2 h-4 w-4" />
                              Dodaj korisnika
                            </Button>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                    Ime i prezime
                                  </th>
                                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Uloga</th>
                                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Akcije</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                  <td className="py-3 px-4">
                                    <div className="font-medium">Ana Anić</div>
                                  </td>
                                  <td className="py-3 px-4 text-sm">ana@agencija-nekretnine.hr</td>
                                  <td className="py-3 px-4 text-sm">Administrator</td>
                                  <td className="py-3 px-4">
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aktivan</Badge>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex justify-end gap-2">
                                      <Button variant="ghost" size="sm">
                                        Uredi
                                      </Button>
                                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                        Deaktiviraj
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                  <td className="py-3 px-4">
                                    <div className="font-medium">Ivan Ivić</div>
                                  </td>
                                  <td className="py-3 px-4 text-sm">ivan@agencija-nekretnine.hr</td>
                                  <td className="py-3 px-4 text-sm">Agent</td>
                                  <td className="py-3 px-4">
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Aktivan</Badge>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex justify-end gap-2">
                                      <Button variant="ghost" size="sm">
                                        Uredi
                                      </Button>
                                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                        Deaktiviraj
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="pretplata" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Pretplata</CardTitle>
                          <CardDescription>Upravljajte vašom pretplatom i plaćanjima</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                            <div className="flex items-center">
                              <div className="mr-4 p-2 bg-green-100 rounded-full">
                                <Check className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">Premium plan</h3>
                                <p className="text-sm text-gray-600">Vaša pretplata je aktivna do 15.04.2024.</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-medium mb-2">Detalji pretplate</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 border border-gray-200 rounded-lg">
                                  <p className="text-sm text-gray-500">Plan</p>
                                  <p className="font-medium">Premium</p>
                                </div>
                                <div className="p-4 border border-gray-200 rounded-lg">
                                  <p className="text-sm text-gray-500">Cijena</p>
                                  <p className="font-medium">€149 / mjesečno</p>
                                </div>
                                <div className="p-4 border border-gray-200 rounded-lg">
                                  <p className="text-sm text-gray-500">Datum obnove</p>
                                  <p className="font-medium">15.04.2024.</p>
                                </div>
                                <div className="p-4 border border-gray-200 rounded-lg">
                                  <p className="text-sm text-gray-500">Način plaćanja</p>
                                  <p className="font-medium">Kreditna kartica (•••• 4242)</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-medium mb-2">Nedavne transakcije</h3>
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead>
                                    <tr className="border-b border-gray-200">
                                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Datum</th>
                                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Opis</th>
                                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Iznos</th>
                                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                      <td className="py-3 px-4 text-sm">15.03.2024.</td>
                                      <td className="py-3 px-4 text-sm">Premium plan - mjesečna pretplata</td>
                                      <td className="py-3 px-4 text-sm font-medium">€149,00</td>
                                      <td className="py-3 px-4">
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                          Plaćeno
                                        </Badge>
                                      </td>
                                    </tr>
                                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                                      <td className="py-3 px-4 text-sm">15.02.2024.</td>
                                      <td className="py-3 px-4 text-sm">Premium plan - mjesečna pretplata</td>
                                      <td className="py-3 px-4 text-sm font-medium">€149,00</td>
                                      <td className="py-3 px-4">
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                          Plaćeno
                                        </Badge>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            <div className="flex justify-between">
                              <Button variant="outline">Promijeni plan</Button>
                              <Button variant="outline" className="text-red-500 hover:text-red-600">
                                Otkaži pretplatu
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="obavijesti" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Postavke obavijesti</CardTitle>
                          <CardDescription>Prilagodite koje obavijesti želite primati</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-medium mb-4">Email obavijesti</h3>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">Novi upiti</p>
                                    <p className="text-sm text-gray-500">
                                      Primajte obavijesti kada dobijete novi upit za nekretninu
                                    </p>
                                  </div>
                                  <div className="flex items-center h-5">
                                    <input
                                      id="notifications-inquiries"
                                      type="checkbox"
                                      defaultChecked={true}
                                      className="h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">Pregledi nekretnina</p>
                                    <p className="text-sm text-gray-500">
                                      Primajte dnevni sažetak pregleda vaših nekretnina
                                    </p>
                                  </div>
                                  <div className="flex items-center h-5">
                                    <input
                                      id="notifications-views"
                                      type="checkbox"
                                      defaultChecked={true}
                                      className="h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">Obavijesti o pretplati</p>
                                    <p className="text-sm text-gray-500">
                                      Primajte obavijesti o vašoj pretplati i plaćanjima
                                    </p>
                                  </div>
                                  <div className="flex items-center h-5">
                                    <input
                                      id="notifications-subscription"
                                      type="checkbox"
                                      defaultChecked={true}
                                      className="h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">Marketinške poruke</p>
                                    <p className="text-sm text-gray-500">Primajte novosti, savjete i posebne ponude</p>
                                  </div>
                                  <div className="flex items-center h-5">
                                    <input
                                      id="notifications-marketing"
                                      type="checkbox"
                                      defaultChecked={false}
                                      className="h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <Button className="bg-rose-500 hover:bg-rose-600">Spremi promjene</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
