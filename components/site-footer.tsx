import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About & Contact */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold">Pačonž</span>
            </div>
            <p className="text-gray-400 text-sm">
              Vodeći portal za nekretnine u Hrvatskoj. Pronađite svoj savršeni dom ili poslovni prostor uz našu pomoć.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-rose-400" />
                <span>+385 1 123 4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-rose-400" />
                <span>info@example.hr</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-rose-400" />
                <span>Ilica 345, 10000 Zagreb</span>
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Brzi linkovi</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pretraga" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                  Prodaja nekretnina
                </Link>
              </li>
              <li>
                <Link href="/pretraga" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                  Najam nekretnina
                </Link>
              </li>
              <li>
                <Link
                  href="/pretraga?type=novogradnja"
                  className="text-gray-400 hover:text-rose-400 transition-colors text-sm"
                >
                  Novogradnja
                </Link>
              </li>
              <li>
                <Link
                  href="/pretraga?type=poslovni"
                  className="text-gray-400 hover:text-rose-400 transition-colors text-sm"
                >
                  Poslovni prostori
                </Link>
              </li>
              <li>
                <Link href="/agenti" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                  Agenti za nekretnine
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                  Pačonž blog
                </Link>
              </li>
              <li>
                <Link href="/oglasavanje" className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                  Oglašavanje
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Locations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Popularne lokacije</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pretraga?location=zagreb"
                  className="text-gray-400 hover:text-rose-400 transition-colors text-sm"
                >
                  Zagreb
                </Link>
              </li>
              <li>
                <Link
                  href="/pretraga?location=split"
                  className="text-gray-400 hover:text-rose-400 transition-colors text-sm"
                >
                  Split
                </Link>
              </li>
              <li>
                <Link
                  href="/pretraga?location=rijeka"
                  className="text-gray-400 hover:text-rose-400 transition-colors text-sm"
                >
                  Rijeka
                </Link>
              </li>
              <li>
                <Link
                  href="/pretraga?location=osijek"
                  className="text-gray-400 hover:text-rose-400 transition-colors text-sm"
                >
                  Osijek
                </Link>
              </li>
              <li>
                <Link
                  href="/pretraga?location=zadar"
                  className="text-gray-400 hover:text-rose-400 transition-colors text-sm"
                >
                  Zadar
                </Link>
              </li>
              <li>
                <Link
                  href="/pretraga?location=dubrovnik"
                  className="text-gray-400 hover:text-rose-400 transition-colors text-sm"
                >
                  Dubrovnik
                </Link>
              </li>
              <li>
                <Link
                  href="/pretraga?location=pula"
                  className="text-gray-400 hover:text-rose-400 transition-colors text-sm"
                >
                  Pula
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pretplatite se na newsletter</h3>
            <p className="text-gray-400 text-sm">
              Primajte najnovije ponude nekretnina i savjete direktno u svoj inbox.
            </p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Vaša email adresa"
                className="rounded-r-none bg-gray-800 border-gray-700 text-white focus:ring-rose-400 focus:border-rose-400"
              />
              <Button className="rounded-l-none bg-rose-400 hover:bg-rose-500">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom section with legal links */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Pačonž. Sva prava pridržana.
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/uvjeti-koristenja" className="text-gray-400 hover:text-rose-400 transition-colors">
                Uvjeti korištenja
              </Link>
              <Link href="/pravila-privatnosti" className="text-gray-400 hover:text-rose-400 transition-colors">
                Pravila privatnosti
              </Link>
              <Link href="/kolacici" className="text-gray-400 hover:text-rose-400 transition-colors">
                Kolačići
              </Link>
              <Link href="/o-nama" className="text-gray-400 hover:text-rose-400 transition-colors">
                O nama
              </Link>
              <Link href="/kontakt" className="text-gray-400 hover:text-rose-400 transition-colors">
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
