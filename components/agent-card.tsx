import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, Phone, Mail } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface AgentCardProps {
  agent: any
  featured?: boolean
}

export function AgentCard({ agent, featured = false }: AgentCardProps) {
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${featured ? "border-primary" : ""}`}>
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <Image
            src={agent.photo || "/placeholder.svg"}
            alt={agent.name}
            width={400}
            height={400}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        </div>
        {featured && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">Istaknuti agent</Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xl font-semibold">{agent.name}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-medium">{agent.average_rating.toFixed(1)}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3">{agent.title}</p>

        <div className="flex items-center text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
          <span className="text-muted-foreground">
            {agent.areas.slice(0, 2).join(", ")}
            {agent.areas.length > 2 ? "..." : ""}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div>
            <span className="font-medium">{agent.active_listings}</span>
            <span className="text-muted-foreground ml-1">Aktivnih</span>
          </div>
          <div>
            <span className="font-medium">{agent.sold_properties}</span>
            <span className="text-muted-foreground ml-1">Prodanih</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {agent.specializations.slice(0, 2).map((spec: string, index: number) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {spec}
            </Badge>
          ))}
          {agent.specializations.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{agent.specializations.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Link href={`/agenti/${agent.id}`} passHref>
            <Button className="w-full">Pogledaj profil</Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="flex-1" asChild>
              <a href={`tel:${agent.phone}`} aria-label="Nazovi agenta">
                <Phone className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="flex-1" asChild>
              <a href={`mailto:${agent.email}`} aria-label="Pošalji email agentu">
                <Mail className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
