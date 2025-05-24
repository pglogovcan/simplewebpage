import Image from "next/image"
import { MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PropertyCardProps {
  property: {
    id: string
    title: string
    price: number
    location: string
    bedrooms: number
    bathrooms: number
    size: number
    image: string
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/nekretnine/${property.id}`}>
      <Card className="overflow-hidden">
        <div className="relative aspect-video">
          <Image
            src={property.image || "/placeholder.svg"}
            alt={property.title}
            width={300}
            height={200}
            className="object-cover w-full h-full"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{property.location}</span>
          </div>
          <div className="mb-3">
            <span className="text-xl font-bold">
              {property.price.toLocaleString("hr-HR", { style: "currency", currency: "HRK" })}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{property.bedrooms} Spavaće sobe</span>
            <span>{property.bathrooms} Kupaonice</span>
            <span>{property.size} m²</span>
          </div>
          <Button className="w-full mt-4" asChild>
            <Link href={`/nekretnine/${property.id}`}>Pogledaj nekretninu</Link>
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
