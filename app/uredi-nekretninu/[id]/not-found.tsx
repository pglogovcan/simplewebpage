import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"

export default function PropertyNotFound() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Nekretnina nije pronađena</h1>
            <p className="text-gray-600 mb-6">Nekretnina koju pokušavate urediti ne postoji ili je uklonjena.</p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Povratak na kontrolnu ploču
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">Početna stranica</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
