import { Home, CheckCircle, Clock, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface AgentStatsProps {
  activeListings: number
  soldProperties: number
  experience: number
  averageRating: number
}

export function AgentStats({ activeListings, soldProperties, experience, averageRating }: AgentStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Home className="w-8 h-8 text-primary mb-2" />
          <span className="text-2xl font-bold">{activeListings}</span>
          <span className="text-sm text-muted-foreground">Aktivnih oglasa</span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-8 h-8 text-primary mb-2" />
          <span className="text-2xl font-bold">{soldProperties}</span>
          <span className="text-sm text-muted-foreground">Prodanih nekretnina</span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Clock className="w-8 h-8 text-primary mb-2" />
          <span className="text-2xl font-bold">{experience}</span>
          <span className="text-sm text-muted-foreground">Godina iskustva</span>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
          <Award className="w-8 h-8 text-primary mb-2" />
          <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">Prosječna ocjena</span>
        </CardContent>
      </Card>
    </div>
  )
}
