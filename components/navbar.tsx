import { Menu, Home, Key, Users, BookOpen, Megaphone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const Navbar = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-3 border-b border-border/40">
          <h3 className="text-sm font-medium text-muted-foreground tracking-wide">PRONAĐI NEKRETNINU</h3>
        </div>

        <DropdownMenuItem className="p-3 cursor-pointer hover:bg-accent group" asChild>
          <Link href="/pretraga">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-100 text-orange-600 group-hover:bg-orange-200">
                <Home className="h-5 w-5" />
              </div>
              <span className="font-medium">Prodaja</span>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="p-3 cursor-pointer hover:bg-accent group" asChild>
          <Link href="/pretraga">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200">
                <Key className="h-5 w-5" />
              </div>
              <span className="font-medium">Najam</span>
            </div>
          </Link>
        </DropdownMenuItem>

        <div className="p-3 border-t border-b border-border/40">
          <h3 className="text-sm font-medium text-muted-foreground tracking-wide">OTKRIJ VIŠE</h3>
        </div>

        <DropdownMenuItem className="p-3 cursor-pointer hover:bg-accent group" asChild>
          <Link href="/agenti">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-200">
                <Users className="h-5 w-5" />
              </div>
              <span className="font-medium">Agenti za nekretnine</span>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="p-3 cursor-pointer hover:bg-accent group" asChild>
          <Link href="/blog">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100 text-green-600 group-hover:bg-green-200">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-medium">Crozilla blog</span>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="p-3 cursor-pointer hover:bg-accent group" asChild>
          <Link href="/oglasavanje">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-100 text-red-600 group-hover:bg-red-200">
                <Megaphone className="h-5 w-5" />
              </div>
              <span className="font-medium">Oglašavanje</span>
            </div>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Navbar
