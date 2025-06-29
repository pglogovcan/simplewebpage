import { Loader2 } from "lucide-react"

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-rose-400" />
        <h2 className="text-2xl font-semibold mb-2">Učitavanje...</h2>
        <p className="text-gray-500">Pripremamo vašu stranicu za plaćanje</p>
      </div>
    </div>
  )
}
