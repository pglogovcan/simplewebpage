import { FeaturedProperties } from "@/components/featured-properties"
import { SearchForm } from "@/components/search-form"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { getFeaturedProperties } from "@/lib/data"

export default async function Home() {
  // Fetch featured properties from the database
  const featuredProperties = await getFeaturedProperties()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-purple-600 opacity-90" />
          <div className="relative container mx-auto px-4 py-24 sm:py-32">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">Pronađite savršenu nekretninu</h1>
              <p className="text-xl mb-8">
                Pretražite tisuće nekretnina u Hrvatskoj i pronađite svoj savršeni dom ili investiciju.
              </p>
              <SearchForm />
            </div>
          </div>
        </section>

        <FeaturedProperties properties={featuredProperties} />

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Zašto odabrati nas?</h2>
              <p className="text-gray-600 mt-2">Pružamo najbolje usluge za kupnju, prodaju i najam nekretnina</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-rose-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Jednostavna pretraga</h3>
                <p className="text-gray-600">
                  Napredni filtri i intuitivno sučelje omogućuju vam da brzo pronađete nekretnine koje odgovaraju vašim
                  potrebama.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-rose-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Ušteda vremena</h3>
                <p className="text-gray-600">
                  Sve informacije o nekretninama na jednom mjestu, bez potrebe za dugotrajnim pretraživanjem i
                  obilascima.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-rose-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Sigurnost i povjerenje</h3>
                <p className="text-gray-600">
                  Provjereni oglasi i pouzdani agenti za nekretnine osiguravaju sigurnu kupnju, prodaju ili najam.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Kako funkcionira</h2>
              <p className="text-gray-600 mt-2">Tri jednostavna koraka do vaše nove nekretnine</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-4 mt-2">Pretražite nekretnine</h3>
                  <p className="text-gray-600">
                    Koristite našu naprednu pretragu da filtrirate nekretnine prema vašim željama i potrebama.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-4 mt-2">Kontaktirajte agenta</h3>
                  <p className="text-gray-600">
                    Kada pronađete nekretninu koja vam se sviđa, jednostavno kontaktirajte agenta putem obrasca ili
                    telefona.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-4 mt-2">Dogovorite obilazak</h3>
                  <p className="text-gray-600">
                    Dogovorite termin za obilazak nekretnine i započnite svoj put prema novom domu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
