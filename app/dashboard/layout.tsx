"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Menu, LayoutDashboard, Heart, Search, MessageSquare, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SiteHeader } from "@/components/site-header" // Import the SiteHeader component

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SiteHeader /> {/* Include the SiteHeader component here */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <Link href="/" className="flex items-center text-black">
              <span className="text-2xl font-bold">Pačonž</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dodaj-nekretninu">
              <Button variant="outline" className="h-10 px-4 text-sm font-medium border-gray-300">
                Dodaj nekretninu
              </Button>
            </Link>
            <Button variant="outline" className="h-10 w-10 px-0 font-medium border-gray-300">
              HR
            </Button>
            <Button
              variant="outline"
              className="h-10 w-10 px-0 border-gray-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              open={isMobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="h-10 w-10 px-0 rounded-full border-gray-300"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              open={isUserMenuOpen}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="sticky top-20 space-y-2">
              <SidebarLink href="/dashboard" icon={LayoutDashboard} isActive={pathname === "/dashboard"}>
                Pregled
              </SidebarLink>
              <SidebarLink
                href="/dashboard/saved-properties"
                icon={Heart}
                isActive={pathname === "/dashboard/saved-properties"}
              >
                Spremljene nekretnine
              </SidebarLink>
              <SidebarLink
                href="/dashboard/saved-searches"
                icon={Search}
                isActive={pathname === "/dashboard/saved-searches"}
              >
                Spremljene pretrage
              </SidebarLink>
              <SidebarLink
                href="/dashboard/messages"
                icon={MessageSquare}
                isActive={pathname === "/dashboard/messages"}
              >
                Poruke
              </SidebarLink>
              <SidebarLink href="/dashboard/settings" icon={Settings} isActive={pathname === "/dashboard/settings"}>
                Postavke
              </SidebarLink>
            </div>
          </aside>

          {/* Main content */}
          <div className="md:col-span-4">{children}</div>
        </div>
      </main>
    </div>
  )
}

// Sidebar link component
function SidebarLink({
  href,
  icon: Icon,
  children,
  isActive,
}: { href: string; icon: any; children: React.ReactNode; isActive?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100",
        isActive ? "bg-gray-100 text-rose-500" : "text-gray-700",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  )
}
