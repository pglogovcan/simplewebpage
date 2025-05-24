export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: number
          title: string
          description: string
          property_type: string
          location: string
          address: string
          price: number
          bedrooms: number | null
          bathrooms: number | null
          area: number
          image_url: string | null
          date_added: string
          featured: boolean
          new: boolean
          year_built: number | null
          heating: string | null
          parking: string | null
          energy_certificate: string | null
          property_subtype: string | null
          status: string | null
          unit_number: string | null
          city: string | null
          state_province: string | null
          country: string | null
          neighborhood: string | null
          latitude: number | null
          longitude: number | null
          location_notes: string | null
          map_url: string | null
        }
        Insert: {
          id?: number
          title: string
          description: string
          property_type: string
          location: string
          address: string
          price: number
          bedrooms?: number | null
          bathrooms?: number | null
          area: number
          image_url?: string | null
          date_added?: string
          featured?: boolean
          new?: boolean
          year_built?: number | null
          heating?: string | null
          parking?: string | null
          energy_certificate?: string | null
          property_subtype?: string | null
          status?: string | null
          unit_number?: string | null
          city?: string | null
          state_province?: string | null
          country?: string | null
          neighborhood?: string | null
          latitude?: number | null
          longitude?: number | null
          location_notes?: string | null
          map_url?: string | null
        }
        Update: {
          id?: number
          title?: string
          description?: string
          property_type?: string
          location?: string
          address?: string
          price?: number
          bedrooms?: number | null
          bathrooms?: number | null
          area?: number
          image_url?: string | null
          date_added?: string
          featured?: boolean
          new?: boolean
          year_built?: number | null
          heating?: string | null
          parking?: string | null
          energy_certificate?: string | null
          property_subtype?: string | null
          status?: string | null
          unit_number?: string | null
          city?: string | null
          state_province?: string | null
          country?: string | null
          neighborhood?: string | null
          latitude?: number | null
          longitude?: number | null
          location_notes?: string | null
          map_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
