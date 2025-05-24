import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { AgentReview } from "@/lib/agent-data"

interface AgentReviewsProps {
  reviews: AgentReview[]
}

export function AgentReviews({ reviews }: AgentReviewsProps) {
  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("hr-HR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Recenzije klijenata</h3>

      {reviews.length === 0 ? (
        <p className="text-muted-foreground">Ovaj agent još nema recenzija.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{review.clientName}</h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{formatDate(review.date)}</p>
                <p className="text-sm">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
