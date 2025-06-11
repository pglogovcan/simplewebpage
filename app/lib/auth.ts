"use server"
import { createClient } from "@/app/lib/supabase/server"

export const checkAuth = async () => {
  const supabase = createClient()

  const { data } = await (await supabase).auth.getSession()
  return !!data.session
}

export async function getAuthenticatedUser() {
  const supabase = createClient()
  const { data: { user } } = await (await supabase).auth.getUser()

  if (!user || !user.email) {
    throw new Error("User not found or email is missing")
  }

  return {
    id: user.id,
    email: user.email
  }
} 