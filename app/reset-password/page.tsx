"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePassword } from "@/app/actions/auth-actions"
/* import { useFormState } from "react-dom" */
import { toast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, CheckCircle } from "lucide-react"

const initialState: { error: string | null; success: boolean } = {
  error: null,
  success: false,
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [state, setState] = useState(initialState)
  const [passwordError, setPasswordError] = useState("")
  const router = useRouter()


  // Handle form state changes
  useEffect(() => {
    if (state.error) {
      toast({
        title: "Greška",
        description: state.error,
        variant: "destructive",
      })
      setIsSubmitting(false)
    }

    if (state.success) {
      toast({
        title: "Uspjeh",
        description: "Vaša lozinka je uspješno promijenjena",
      })
      setIsSubmitting(false)

      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push("/")
      }, 2000)
    }
  }, [state, router])

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError("Lozinke se ne podudaraju")
      return false
    }

    if (password.length < 6) {
      setPasswordError("Lozinka mora imati najmanje 6 znakova")
      return false
    }

    setPasswordError("")
    return true
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate passwords
    if (!validatePasswords()) {
      return
    }

 /*    // Get the token from URL
    const token = searchParams.get("token")

    if (!token) {
      toast({
        title: "Greška",
        description: "Nedostaje token za resetiranje lozinke. Provjerite link iz email-a.",
        variant: "destructive",
      })
      return
    }
 */
    setIsSubmitting(true)

    // Create a FormData object to pass to the server action
    const formData = new FormData(e.currentTarget)

  /*   // Add the token to the form data
    formData.append("token", token) */

    // Call the server action
    updatePassword(formData)
      .then((response) => {
        setState({
          error: response.error || null,
          success: response.success || false,
        })
      })
      .catch((error) => {
        setState({ error: error.message, success: false })
      })
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Postavite novu lozinku</CardTitle>
          <CardDescription>Unesite novu lozinku za vaš račun</CardDescription>
        </CardHeader>

        {state.success ? (
          <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="bg-green-50 rounded-full p-3">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-center">Lozinka promijenjena!</h3>
            <p className="text-gray-600 text-center">
              Vaša lozinka je uspješno promijenjena. Preusmjeravamo vas na početnu stranicu...
            </p>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova lozinka</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Potvrdite lozinku</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" className="w-full bg-rose-400 hover:bg-rose-500" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-20 border-t-white"></span>
                    Spremanje...
                  </span>
                ) : (
                  "Spremi novu lozinku"
                )}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
