"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { setOptions } from "leaflet"

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {  
      persistence: formData.get("rememberMe")
    } 
  }
  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  /* revalidatePath("/", "layout") */
  return { success: true }
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get("email") as string

  if (!email || typeof email !== "string") {
    return { error: "Molimo unesite valjanu email adresu" }
  }

  // Send password reset email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get("password") as string

  if (!password || typeof password !== "string" || password.length < 6) {
    return { error: "Lozinka mora imati najmanje 6 znakova" }
  }

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut();
}
