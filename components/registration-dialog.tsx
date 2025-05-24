"use client"
import { signup } from "@/app/actions/login"
import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
import {EmailConfirmationDialog} from "@/components/email-confirmation-dialog"

interface RegistrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
  onBack: () => void
  onRegistrationComplete?: () => void
}


export function RegistrationDialog({open,
  onOpenChange,
  email,
  onBack,
  onRegistrationComplete,}: RegistrationDialogProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [newsletterConsent, setNewsletterConsent] = useState(true)
  const [termsConsent, setTermsConsent] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [showEmailConfirmationDialog, setShowEmailConfirmationDialog] = useState(false)
  const [registerEmail, setRegisterEmail] = useState(email)

  

  // Ensure component is mounted before rendering Dialog to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    // Add the email to the form data
    e.preventDefault(); // <-- This prevents the page reload
    const formData = new FormData(e.currentTarget);
    formData.append("email", email);
    

    try {
      await signup(formData)
      // Close this dialog and show the confirmation dialog
      if (true) {
        setShowEmailConfirmationDialog(true); // Show confirmation message
      }
      /* onOpenChange(false) */
    } catch (error) {
      console.error("Registration error:", error)
      // Handle error (you could add error state and display it)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b p-4">
          <button onClick={onBack} className="flex items-center text-gray-700 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Natrag</span>
          </button>
          <button
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            onClick={() => onOpenChange(false)}
          >
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Dobrodošli!</h2>
            <p className="text-gray-600">
              Odaberite lozinku za e-mail adresu
              <br />
              <span className="font-medium">{email}</span>
            </p>
          </div>

          <div className="space-y-4">
          <form method="POST" onSubmit={handleRegistration}>
            <div>
            
              <div className="relative">
                <div className="hidden">
                {/* <Input type="email" id="email" value={email} readOnly className="bg-gray-100 cursor-not-allowed" /> */}
                </div>
                
              
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Lozinka"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Šifra se mora sastojati od najmanje 6 znakova</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="newsletter"
                  checked={newsletterConsent}
                  onCheckedChange={(checked) => setNewsletterConsent(checked as boolean)}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <label htmlFor="newsletter" className="text-sm leading-tight">
                  Želim primati newsletter i informativnu e-poštu od crozilla.com
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsConsent}
                  onCheckedChange={(checked) => setTermsConsent(checked as boolean)}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
                <div className="text-sm leading-tight">
                  <label htmlFor="terms">
                    Pročitao/la sam i prihvaćam{" "}
                    <Link href="#" className="text-rose-500 hover:underline">
                      Uvjeti korištenja
                    </Link>{" "}
                    i{" "}
                    <Link href="#" className="text-rose-500 hover:underline">
                      Pravila o privatnosti
                    </Link>{" "}
                    Pačonž
                  </label>
                </div>
              </div>
            </div>

            <Button
              className="w-full bg-teal-400 hover:bg-teal-500 text-white"
              disabled={password.length < 6 || !termsConsent}
              type="submit"
            >
              Registrirajte se
            </Button>
            </form>
            <EmailConfirmationDialog
        open={showEmailConfirmationDialog}
        onOpenChange={setShowEmailConfirmationDialog}
        email={registerEmail}
        onBackToLogin={() => {
          setShowEmailConfirmationDialog(false)
        }}
        ></EmailConfirmationDialog>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
