import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AgentCard } from "@/components/agent-card"

export const dynamic = "force_dynamic"

export default async function AgentsPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch all agents
  const { data: agents, error } = await supabase.from("agents").select("*")

  if (error) {
    console.error("Error fetching agents:", error)
    return <div>Error loading agents</div>
  }

  // Get agents marked as featured in the database
  const featuredAgents = agents ? agents.filter((agent) => agent.featured) : []

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <main className="flex-grow pt-32 sm:pt-36 md:pt-40">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Naši agenti za nekretnine</h1>
            <p className="text-muted-foreground">
              Upoznajte naš tim stručnih agenata koji će vam pomoći pronaći savršenu nekretninu.
            </p>
          </div>

          {/* Search and filter section */}
          <div className="bg-muted p-4 rounded-lg mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Pretražite agente po imenu ili specijalizaciji" className="pl-10" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="whitespace-nowrap">
                  Filtriraj
                </Button>
                <Button className="whitespace-nowrap">Pretraži</Button>
              </div>
            </div>
          </div>

          {/* Featured agents section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Istaknuti agenti</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} featured={true} />
              ))}
            </div>
          </section>

          {/* All agents section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Svi agenti</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {agents?.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
