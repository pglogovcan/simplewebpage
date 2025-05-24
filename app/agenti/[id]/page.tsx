import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { MapPin, Phone, Mail, Briefcase, Languages, Award, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PropertyCard } from "@/components/property-card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AgentContactForm } from "@/components/agent-contact-form"

export const dynamic = "force-dynamic"

interface AgentPageProps {
  params: {
    id: string
  }
}

export default async function AgentPage({ params }: AgentPageProps) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch agent data
  const { data: agent, error: agentError } = await supabase.from("agents").select("*").eq("id", params.id).single()

  if (agentError || !agent) {
    notFound()
  }

  // Fetch agent reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from("agent_reviews")
    .select("*")
    .eq("agent_id", agent.id)
    .order("review_date", { ascending: false })

  // Fetch agent's properties
  const { data: properties, error: propertiesError } = await supabase
    .from("properties")
    .select("*")
    .eq("listing_agent_id", agent.id)

  // Calculate average rating from reviews
  const averageRating =
    reviews && reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("hr-HR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-grow pt-32 sm:pt-36 md:pt-40">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4">
            <Link href="/agenti">
              <Button variant="ghost" size="sm">
                ← Natrag na popis agenata
              </Button>
            </Link>
          </div>

          {/* Agent header section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="rounded-lg overflow-hidden border">
                <Image
                  src={agent.photo || "/placeholder.svg"}
                  alt={agent.name}
                  width={400}
                  height={400}
                  className="object-cover w-full aspect-square"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold mb-1">{agent.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">{agent.title}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {agent.specializations.map((spec: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {spec}
                  </Badge>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-muted-foreground" />
                  <span>{agent.areas.join(", ")}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-muted-foreground" />
                  <a href={`tel:${agent.phone}`} className="hover:underline">
                    {agent.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-muted-foreground" />
                  <a href={`mailto:${agent.email}`} className="hover:underline">
                    {agent.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-muted-foreground" />
                  <span>{agent.experience} godina iskustva</span>
                </div>
                <div className="flex items-center">
                  <Languages className="w-5 h-5 mr-2 text-muted-foreground" />
                  <span>{agent.languages.join(", ")}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground ml-1">({reviews?.length || 0} recenzija)</span>
                </div>
                <Button>Kontaktirajte agenta</Button>
              </div>
            </div>
          </div>

          {/* Agent stats */}
          <section className="mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold">{agent.active_listings}</span>
                <span className="text-sm text-muted-foreground">Aktivnih oglasa</span>
              </div>

              <div className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold">{agent.sold_properties}</span>
                <span className="text-sm text-muted-foreground">Prodanih nekretnina</span>
              </div>

              <div className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold">{agent.experience}</span>
                <span className="text-sm text-muted-foreground">Godina iskustva</span>
              </div>

              <div className="bg-muted rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">Prosječna ocjena</span>
              </div>
            </div>
          </section>

          {/* Agent bio and certifications */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold mb-4">O agentu</h2>
              <p className="mb-6">{agent.bio}</p>

              {agent.certifications.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">Certifikati i licence</h3>
                  <ul className="space-y-2">
                    {agent.certifications.map((cert: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Award className="w-5 h-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="md:col-span-1">
              <AgentContactForm
                agentName={agent.name}
                agentEmail={agent.email}
                agentPhone={agent.phone}
                agentPhoto={agent.photo}
              />
            </div>
          </section>

          {/* Agent active listings */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Aktivni oglasi ({properties?.length || 0})</h2>
            {properties && properties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Trenutno nema aktivnih oglasa.</p>
            )}
          </section>

          {/* Agent reviews */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Recenzije klijenata</h2>
            {reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{review.client_name}</h4>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{formatDate(review.review_date)}</p>
                    <p className="text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Ovaj agent još nema recenzija.</p>
            )}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
