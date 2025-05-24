import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-rose-400" />
        <p className="text-gray-600">Učitavanje rezultata pretrage...</p>
      </div>
    </div>
  )
}
