"use client"

import Link from "next/link"
import { Menu, User as IconUser, Users, Newspaper, Megaphone, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AuthDialog } from "@/components/auth-dialog"
import { User } from "@supabase/supabase-js"
import { useAuth } from '@/app/context/AuthContext'
import { getSupabaseClient } from '@/utils/supabase/client'

interface SiteHeaderProps {
  user: User | null;
}

export function SiteHeader() {
  const { user, loading } = useAuth()
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
      <div className="w-full px-[21px] py-4">
        {/* Navigation */}
        <nav className="flex flex-wrap items-center justify-between gap-2">
          <Link href="/" className="flex items-center text-black">
            <span className="text-2xl font-bold">Pačonž</span>
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Button variant="ghost" className="text-black hover:text-black/90 border border-black/20">
            <Link href="/dodaj-nekretninu">Dodaj nekretninu</Link>
            </Button>

            ) : (
              <>
              {/* <Button variant="ghost" onClick={() => setAuthDialogOpen(true)} className="text-black hover:text-black/90 border border-black/20">
                Dodaj nekretninu
            </Button> */}
            <AuthDialog/>
            </>
            )}
            

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-black hover:text-black/90 border border-black/20 w-[42px] text-xs sm:text-sm"
                >
                  HR
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[42px] min-w-0 p-0">
                <DropdownMenuItem className="justify-center">EN</DropdownMenuItem>
                <DropdownMenuItem className="justify-center">DE</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Main Navigation Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-black hover:text-black/90 border border-black/20">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[350px] p-4">
                <div className="grid gap-4">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium uppercase text-gray-500">PRONAĐI NEKRETNINU</h4>
                    <div className="grid gap-4">
                      <Button variant="ghost" className="flex w-full justify-start gap-2" asChild>
                        <Link href="/pretraga">
                          <div className="p-1.5 bg-orange-50 rounded-lg">
                            <Search className="h-4 w-4 text-orange-500" />
                          </div>
                          <div className="text-left">
                            <div>Prodaja</div>
                            <div className="text-sm text-gray-500"></div>
                          </div>
                        </Link>
                      </Button>
                      <Button variant="ghost" className="flex w-full justify-start gap-2" asChild>
                        <Link href="/pretraga">
                          <div className="p-1.5 bg-orange-50 rounded-lg">
                            <Search className="h-4 w-4 text-orange-500" />
                          </div>
                          <div className="text-left">
                            <div>Najam</div>
                            <div className="text-sm text-gray-500"></div>
                          </div>
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium uppercase text-gray-500">OTKRIJ VIŠE</h4>
                    <div className="grid gap-4">
                      <Button variant="ghost" className="flex w-full justify-start gap-2" asChild>
                        <Link href="/agenti">
                          <div className="p-1.5 bg-violet-50 rounded-lg">
                            <Users className="h-4 w-4 text-violet-500" />
                          </div>
                          <div className="text-left">
                            <div>Agenti za nekretnine</div>
                            <div className="text-sm text-gray-500"></div>
                          </div>
                        </Link>
                      </Button>
                      <Button variant="ghost" className="flex w-full justify-start gap-2" asChild>
                        <Link href="/blog">
                          <div className="p-1.5 bg-violet-50 rounded-lg">
                            <Newspaper className="h-4 w-4 text-violet-500" />
                          </div>
                          <div className="text-left">
                            <div>Crozilla blog</div>
                            <div className="text-sm text-gray-500"></div>
                          </div>
                        </Link>
                      </Button>
                      <Button variant="ghost" className="flex w-full justify-start gap-2" asChild>
                        <Link href="/oglasavanje">
                          <div className="p-1.5 bg-violet-50 rounded-lg">
                            <Megaphone className="h-4 w-4 text-violet-500" />
                          </div>
                          <div className="text-left">
                            <div>Oglašavanje</div>
                            <div className="text-sm text-gray-500"></div>
                          </div>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-black hover:text-black/90 border rounded-full border-black/20"
                >
                  <IconUser className="h-6 w-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[300px] p-4">
                <div className="space-y-4">
                  {user ? (
                    <div className="text-lg font-medium">Pozdrav, {user.email}!</div>
                  ) : (
                    <div className="text-lg font-medium">Pozdrav, gost!</div>
                  )}
                  <AuthDialog />
                  <div className="text-sm text-gray-500">
                    Jeste li agent za nekretnine?
                    <Link href="/registracija-agencije" className="block text-rose-400 hover:text-rose-500">
                      Prijava | Registracija
                    </Link>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </nav>
      </div>
    </header>
  )
}
