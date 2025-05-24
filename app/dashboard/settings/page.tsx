"use client"

import type React from "react"

import { useState } from "react"
import { User, Mail, Phone, Lock, Globe, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [profileForm, setProfileForm] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+385 91 234 5678",
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would update the profile via API
    console.log("Profile updated:", profileForm)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would update the password via API
    console.log("Password updated:", passwordForm)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Postavke računa</h1>
        <p className="text-muted-foreground">Upravljajte svojim korisničkim računom i postavkama.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="password">Lozinka</TabsTrigger>
          <TabsTrigger value="notifications">Obavijesti</TabsTrigger>
          <TabsTrigger value="preferences">Postavke</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleProfileSubmit}>
              <CardHeader>
                <CardTitle>Profil</CardTitle>
                <CardDescription>
                  Uredite svoje osobne podatke. Ove informacije će biti vidljive agentima za nekretnine.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Promijeni sliku
                    </Button>
                  </div>
                  <div className="flex-1 grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Ime</Label>
                        <div className="relative">
                          <Input
                            id="firstName"
                            name="firstName"
                            value={profileForm.firstName}
                            onChange={handleProfileChange}
                            className="pl-10"
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Prezime</Label>
                        <div className="relative">
                          <Input
                            id="lastName"
                            name="lastName"
                            value={profileForm.lastName}
                            onChange={handleProfileChange}
                            className="pl-10"
                          />
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email adresa</Label>
                      <div className="relative">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          className="pl-10"
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <div className="relative">
                        <Input
                          id="phone"
                          name="phone"
                          value={profileForm.phone}
                          onChange={handleProfileChange}
                          className="pl-10"
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" className="bg-rose-400 hover:bg-rose-500">
                  Spremi promjene
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <form onSubmit={handlePasswordSubmit}>
              <CardHeader>
                <CardTitle>Lozinka</CardTitle>
                <CardDescription>
                  Promijenite svoju lozinku. Preporučujemo korištenje jake lozinke koju ne koristite nigdje drugdje.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Trenutna lozinka</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="pl-10"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova lozinka</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="pl-10"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Potvrdi novu lozinku</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="pl-10"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" className="bg-rose-400 hover:bg-rose-500">
                  Promijeni lozinku
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Obavijesti</CardTitle>
              <CardDescription>Prilagodite postavke obavijesti prema svojim preferencijama.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email obavijesti</h3>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-new-properties">Nove nekretnine</Label>
                      <p className="text-sm text-muted-foreground">
                        Primajte obavijesti o novim nekretninama koje odgovaraju vašim pretragama.
                      </p>
                    </div>
                    <Switch id="email-new-properties" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-messages">Nove poruke</Label>
                      <p className="text-sm text-muted-foreground">
                        Primajte obavijesti o novim porukama od agenata za nekretnine.
                      </p>
                    </div>
                    <Switch id="email-messages" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-price-changes">Promjene cijena</Label>
                      <p className="text-sm text-muted-foreground">
                        Primajte obavijesti o promjenama cijena nekretnina koje pratite.
                      </p>
                    </div>
                    <Switch id="email-price-changes" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-newsletter">Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Primajte mjesečni newsletter s novostima i savjetima o nekretninama.
                      </p>
                    </div>
                    <Switch id="email-newsletter" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Push obavijesti</h3>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-new-properties">Nove nekretnine</Label>
                      <p className="text-sm text-muted-foreground">
                        Primajte push obavijesti o novim nekretninama koje odgovaraju vašim pretragama.
                      </p>
                    </div>
                    <Switch id="push-new-properties" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-messages">Nove poruke</Label>
                      <p className="text-sm text-muted-foreground">
                        Primajte push obavijesti o novim porukama od agenata za nekretnine.
                      </p>
                    </div>
                    <Switch id="push-messages" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="bg-rose-400 hover:bg-rose-500">
                <Save className="mr-2 h-4 w-4" />
                Spremi postavke
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Postavke</CardTitle>
              <CardDescription>Prilagodite postavke aplikacije prema svojim preferencijama.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Opće postavke</h3>
                <Separator />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Jezik</Label>
                    <Select defaultValue="hr">
                      <SelectTrigger id="language" className="w-full md:w-[240px]">
                        <Globe className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Odaberite jezik" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hr">Hrvatski</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="it">Italiano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Valuta</Label>
                    <Select defaultValue="eur">
                      <SelectTrigger id="currency" className="w-full md:w-[240px]">
                        <SelectValue placeholder="Odaberite valutu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eur">Euro (€)</SelectItem>
                        <SelectItem value="hrk">Hrvatska kuna (kn)</SelectItem>
                        <SelectItem value="usd">US Dollar ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Tamni način rada</Label>
                      <p className="text-sm text-muted-foreground">
                        Uključite tamni način rada za bolju vidljivost u uvjetima slabog osvjetljenja.
                      </p>
                    </div>
                    <Switch id="dark-mode" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Privatnost</h3>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="save-search-history">Spremi povijest pretraga</Label>
                      <p className="text-sm text-muted-foreground">
                        Dopustite spremanje vaše povijesti pretraga za bolje preporuke.
                      </p>
                    </div>
                    <Switch id="save-search-history" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="personalized-ads">Personalizirani oglasi</Label>
                      <p className="text-sm text-muted-foreground">
                        Dopustite prikazivanje personaliziranih oglasa na temelju vaših preferencija.
                      </p>
                    </div>
                    <Switch id="personalized-ads" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="bg-rose-400 hover:bg-rose-500">
                <Save className="mr-2 h-4 w-4" />
                Spremi postavke
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
