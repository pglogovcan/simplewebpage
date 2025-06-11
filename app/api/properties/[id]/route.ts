import { createClient } from '@/app/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user data
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('Authentication error:', userError?.message)
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Await params before using them
    const params = await context.params
    const propertyId = params.id

    const formData = await request.json()
    
    // First verify the property exists and belongs to the user
    const { data: existingProperty, error: findError } = await supabase
      .from('properties')
      .select()
      .eq('id', propertyId)
      .eq('user_id', user.id)
      .single()

    if (findError || !existingProperty) {
      console.error('Property not found or unauthorized:', propertyId)
      return new NextResponse('Property not found or unauthorized', { status: 404 })
    }

    // Map form fields to database columns
    const dbData = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      location: formData.location,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      area: formData.area,
      property_type: formData.type, // Map 'type' to 'property_type'
      updated_at: new Date().toISOString(),
      user_id: user.id
    }

    const { data, error } = await supabase
      .from('properties')
      .update(dbData)
      .eq('id', propertyId)
      .eq('user_id', user.id) // Ensure user can only update their own properties
      .select()
      .maybeSingle()

    if (error) {
      console.error('Supabase error:', error)
      return new NextResponse(error.message, { status: 400 })
    }

    if (!data) {
      return new NextResponse('Property not found after update', { status: 404 })
    }

    // Transform the response data to match the frontend format
    const responseData = {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      location: data.location,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      area: data.area,
      type: data.property_type, // Map back to 'type' for frontend
      images: data.images || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      userId: data.user_id
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Error updating property:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user data
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('Authentication error:', userError?.message)
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Await params before using them
    const params = await context.params
    const propertyId = params.id

    // First verify the property exists and belongs to the user
    const { data: existingProperty, error: findError } = await supabase
      .from('properties')
      .select()
      .eq('id', propertyId)
      .eq('user_id', user.id)
      .single()

    if (findError || !existingProperty) {
      console.error('Property not found or unauthorized:', propertyId)
      return new NextResponse('Property not found or unauthorized', { status: 404 })
    }

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId)
      .eq('user_id', user.id) // Ensure user can only delete their own properties

    if (error) {
      return new NextResponse(error.message, { status: 400 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting property:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 