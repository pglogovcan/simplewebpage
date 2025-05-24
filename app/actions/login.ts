"use server"

// This file is now deprecated, we're using auth-actions.ts instead
// Keeping this file for backward compatibility

import { login as loginAction, signup as signupAction } from "./auth-actions"

export async function login(formData: FormData) {
  return loginAction(formData)
}

export async function signup(formData: FormData) {
  return signupAction(formData)
}
