import { createClient } from '@/app/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get authenticated user data
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('Authentication error:', userError?.message)
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get properties for the current user
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching properties:', error)
      return new NextResponse(error.message, { status: 400 })
    }

    // Transform the properties to match the frontend format
    const transformedProperties = properties.map((property) => ({
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      type: property.property_type,
      images: property.images || [],
      dateAdded: property.created_at,
      updatedAt: property.updated_at,
      userId: property.user_id
    }))

    return NextResponse.json(transformedProperties)
  } catch (error) {
    console.error('Error in GET /api/properties:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 