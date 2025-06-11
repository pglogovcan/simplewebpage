import { createClient } from "@/app/lib/supabase/server"
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user data
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const propertyId = context.params.id

    // Check if property exists
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id')
      .eq('id', propertyId)
      .single()

    if (propertyError || !property) {
      return new NextResponse('Property not found', { status: 404 })
    }

    // Save the property
    const { error: saveError } = await supabase
      .from('saved_properties')
      .insert({
        user_id: user.id,
        id: propertyId
      })

    if (saveError) {
      // If it's a unique violation, the property is already saved
      if (saveError.code === '23505') {
        return new NextResponse('Property already saved', { status: 409 })
      }
      return new NextResponse(saveError.message, { status: 400 })
    }

    return new NextResponse(null, { status: 201 })
  } catch (error) {
    console.error('Error saving property:', error)
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
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const propertyId = context.params.id

    // Remove the saved property
    const { error: deleteError } = await supabase
      .from('saved_properties')
      .delete()
      .eq('user_id', user.id)
      .eq('id', propertyId)

    if (deleteError) {
      return new NextResponse(deleteError.message, { status: 400 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error unsaving property:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user data
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const propertyId = context.params.id

    // Check if property is saved
    const { data, error } = await supabase
      .from('saved_properties')
      .select('id')
      .eq('user_id', user.id)
      .eq('id', propertyId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      return new NextResponse(error.message, { status: 400 })
    }

    return NextResponse.json({ saved: !!data })
  } catch (error) {
    console.error('Error checking saved property:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 