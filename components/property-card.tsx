"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, MapPin, Eye, Bed, Bath, Maximize, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PropertyForm } from "@/components/property-form"
import type { Property } from "@/types/dashboard"
import { useToast } from "@/components/ui/use-toast"

interface PropertyCardProps {
  editable: boolean
  property: Property
  onUpdate?: () => void
}

export function PropertyCard({ property, onUpdate, editable }: PropertyCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const { toast } = useToast()
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Check if property is saved when component mounts
    const checkSavedStatus = async () => {
      try {
        const response = await fetch(`/api/properties/${property.id}/save`)
        if (response.ok) {
          const data = await response.json()
          setIsSaved(data.saved)
        }
      } catch (error) {
        console.error('Error checking saved status:', error)
      }
    }
    checkSavedStatus()
  }, [property.id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
      price,
    )
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!confirm("Jeste li sigurni da želite obrisati ovu nekretninu?")) {
      return
    }

    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete property')
      }

      toast({
        title: "Nekretnina obrisana",
        description: "Nekretnina je uspješno obrisana.",
      })

      onUpdate?.()
    } catch (error) {
      console.error('Error deleting property:', error)
      toast({
        title: "Greška",
        description: "Došlo je do greške prilikom brisanja nekretnine.",
        variant: "destructive",
      })
    }
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isSaving) return
    setIsSaving(true)

    try {
      const method = isSaved ? 'DELETE' : 'POST'
      const response = await fetch(`/api/properties/${property.id}/save`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setIsSaved(!isSaved)
        if (onUpdate) {
          onUpdate()
        }
      } else {
        console.error('Failed to update saved status')
      }
    } catch (error) {
      console.error('Error updating saved status:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Card className="overflow-hidden group">
        <div className="relative h-40 w-full">
          <Image
            src={property.image || property.images?.[0] || "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            {editable ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-white/80 backdrop-blur-sm rounded-full"
                  onClick={(e) => {
                    e.preventDefault()
                    setShowEditDialog(true)
                  }}
                >
                  <Edit className="h-4 w-4 text-gray-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-white/80 backdrop-blur-sm rounded-full hover:text-rose-500"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white ${
                  isSaved ? 'text-rose-500' : 'text-gray-400'
                }`}
                onClick={handleSave}
                disabled={isSaving}
              >
                <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 z-10">
            <div className="text-white font-bold text-lg sm:text-xl">{formatPrice(property.price)}</div>
          </div>
        </div>
        <Link href={`/nekretnine/${property.id}`}>
          <CardContent className="p-3">
            <div className="flex items-start gap-1 text-gray-500 text-xs sm:text-sm mb-2">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 mt-0.5" />
              <span>{property.location}</span>
            </div>
            <h3 className="font-semibold text-sm sm:text-lg mb-2 group-hover:text-rose-500 transition-colors line-clamp-2">
              {property.title}
            </h3>
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2 sm:gap-4">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-1">
                    <Bed className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <span>{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-1">
                    <Bath className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <span>{property.bathrooms}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Maximize className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <span>{property.area} m²</span>
                </div>
              </div>
              {property.type && <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{property.type}</span>}
            </div>
          </CardContent>
          <CardFooter className="p-0">
            <Button
              variant="ghost"
              className="w-full rounded-none text-xs justify-center gap-1 text-rose-500 hover:bg-rose-50"
            >
              <Eye className="h-3 w-3" />
              Pogledaj detalje
            </Button>
          </CardFooter>
        </Link>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
            <DialogDescription>Make changes to the property details below.</DialogDescription>
          </DialogHeader>
          <PropertyForm
            property={property}
            onSuccess={() => {
              setShowEditDialog(false)
              onUpdate?.()
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
