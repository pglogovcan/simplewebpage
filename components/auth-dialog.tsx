"use client"
import { login } from "@/app/actions/login"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ForgotPasswordDialog } from "./forgot-password-dialog"
import { RegistrationDialog } from "./registration-dialog"
import { EmailConfirmationDialog } from "./email-confirmation-dialog"
import { toast } from "@/hooks/use-toast"
import { signOut } from "@/app/actions/auth-actions"
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'




export interface RegistrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
  onBack: () => void
  onRegistrationComplete?: () => void
}

type View = "login" | "register"

export function AuthDialog() {
  const [view, setView] = useState<View>("login")
  const [open, setOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [email, setLoginEmail] = useState("")
  const [password, setLoginPassword] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false)
  const [showEmailConfirmationDialog, setShowEmailConfirmationDialog] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()
  const [rememberMe, setRememberMe] = useState(true)


  // Ensure component is mounted before rendering Dialog to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Reset view to login when dialog is closed
  useEffect(() => {
    if (!open) {
      setView("login")
      // Reset form fields when dialog is closed
      setLoginEmail("")
      setLoginPassword("")
      setRegisterEmail("")
    }
  }, [open])

  const handleContinue = () => {
    if (registerEmail) {
      setShowRegistrationDialog(true)
    }
  }

  if (!isMounted) {
    return (
      <Button className="w-full bg-rose-400 hover:bg-rose-500" onClick={() => setOpen(true)}>
        Prijava / Registracija
      </Button>
    )
  }
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append("rememberMe", rememberMe ? 'on' : '');
    const result = await login(formData)

    if (result.error) {
      toast({
        title: "Greška",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Uspješno",
        description: "Uspješno ste se prijavili.",
        variant: "default",
      })
      setOpen(false)
      window.location.reload()
    }
  }
  if (loading) return null

  const handleLogout = async () => {

    await signOut().then(() => {
      toast({
        title: "Uspješno",
        description: "Uspješno ste se odjavili.",
        variant: "default",
      })
    }
    
    ).catch((error) => {
      toast({
        title: "Greška",
        description: error.message,
        variant: "destructive",
      })
    }
   )
   window.location.reload()
  }
  return (
    <>
    {user ? (
      <>
      <Button className="w-full bg-rose-400 hover:bg-rose-500" onClick={handleLogout}>Logout</Button>
    </>
    ) : (
      <Button className="w-full bg-rose-400 hover:bg-rose-500" onClick={() => setOpen(true)}>
        Prijava / Registracija
      </Button>
    )}
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          {view === "login" ? (
            <div className="grid sm:grid-cols-2">
              {/* Left side - Illustration */}
              <div className="hidden sm:flex flex-col items-center justify-center bg-gray-50 p-8">
                <div className="max-w-[200px] mb-4">
                  <Image
                    src="@/public/placeholder.svg" // Replace with your image path
                    alt="Login illustration"
                    width={300}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-center text-gray-500 text-sm mt-4">Samo za fizička lica</p>
              </div>

              {/* Right side - Login form */}
              
              <div className="p-6 sm:p-8">
                                <DialogHeader>
                                  <DialogTitle className="text-2xl font-bold mb-6">Prijava</DialogTitle>
                                </DialogHeader>
                
                <div className="space-y-4">
              <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <Input
                          type="email"
                          name="email"
                          placeholder="Vaš e-mail"
                          value={email}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                          <div className="relative">
                                    <Input
                                      type={showPassword ? "text" : "password"}
                                      name="password"
                                      placeholder="Lozinka"
                                      value={password}
                                      onChange={(e) => setLoginPassword(e.target.value)}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                    >
                                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        
                        <label
                          htmlFor="remember"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <input type="checkbox" checked={rememberMe}  onChange={() => setRememberMe(!rememberMe)}/>
                          Zapamti me
                        </label><br /><br />
                      </div>
                      
                    </div>
                  </div>

                  <Button
                    className="w-full bg-rose-400 hover:bg-rose-500"
                    type="submit"
                  >
                    Prijava
                  </Button>
              </form>
                <ForgotPasswordDialog />
                  

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">ili putem formulara</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                        <path
                          fill="#FFC107"
                          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                        />
                        <path
                          fill="#FF3D00"
                          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                        />
                        <path
                          fill="#4CAF50"
                          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                        />
                        <path
                          fill="#1976D2"
                          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                        />
                      </svg>
                      Povežite sa Google nalogom
                    </Button>
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                        <linearGradient
                          id="Ld6sqrtcxMyckEl6xeDdMa"
                          x1="9.993"
                          x2="40.615"
                          y1="9.993"
                          y2="40.615"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0" stopColor="#2aa4f4" />
                          <stop offset="1" stopColor="#007ad9" />
                        </linearGradient>
                        <path
                          fill="url(#Ld6sqrtcxMyckEl6xeDdMa)"
                          d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
                        />
                        <path
                          fill="#fff"
                          d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
                        />
                      </svg>
                      Povežite sa Facebook nalogom
                    </Button>
                  </div>

                  <div className="text-center text-sm mt-4">
                    <span className="text-gray-600">Nemate nalog?</span>{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto text-rose-400 hover:text-rose-500"
                      onClick={() => setView("register")}
                    >
                      Registrujte se
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2">
              {/* Left side - Benefits */}
              <div className="hidden sm:block bg-gray-50 p-8">
                <h3 className="font-medium mb-4">Putem svog računa možete:</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-4 w-4 rounded-full bg-rose-100 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-rose-400" />
                    </div>
                    Spremiti svoja pretraživanja
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-4 w-4 rounded-full bg-rose-100 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-rose-400" />
                    </div>
                    Primati obavijesti o novim oglasima
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-4 w-4 rounded-full bg-rose-100 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-rose-400" />
                    </div>
                    Dodati nekretnine koje vam se dopadaju u svoje favorite
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="h-4 w-4 rounded-full bg-rose-100 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-rose-400" />
                    </div>
                    Iskoristite sve značajke svog profila
                  </li>
                </ul>
              </div>

              {/* Right side - Registration form */}
              <div className="p-6 sm:p-8">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold mb-2">Registrirajte se</DialogTitle>
                  <p className="text-gray-600 text-sm">Dobrodošli na Pačonž</p>
                </DialogHeader>

                <div className="space-y-4 mt-6">
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      className="mb-4"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                    <Button className="w-full bg-rose-400 hover:bg-rose-500" onClick={handleContinue}>
                      Nastavite
                    </Button>
                  </div>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">ili</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                        <linearGradient
                          id="Ld6sqrtcxMyckEl6xeDdMa"
                          x1="9.993"
                          x2="40.615"
                          y1="9.993"
                          y2="40.615"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0" stopColor="#2aa4f4" />
                          <stop offset="1" stopColor="#007ad9" />
                        </linearGradient>
                        <path
                          fill="url(#Ld6sqrtcxMyckEl6xeDdMa)"
                          d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
                        />
                        <path
                          fill="#fff"
                          d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
                        />
                      </svg>
                      Prijavi se putem Facebook-a
                    </Button>
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                        <path
                          fill="#FFC107"
                          d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                        />
                        <path
                          fill="#FF3D00"
                          d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                        />
                        <path
                          fill="#4CAF50"
                          d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                        />
                        <path
                          fill="#1976D2"
                          d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                        />
                      </svg>
                      Prijavi se putem Google-a
                    </Button>
                  </div>

                  <div className="text-center text-sm mt-6">
                    <p className="text-gray-600 mb-2">Jeste li profesionalac za promet nekretnina?</p>
                    <div className="text-rose-400">
                      <Link href="#" className="hover:text-rose-500">
                        Prijavite se
                      </Link>
                      {" na Upravljačku ploču ili se "}
                      <Link href="#" className="hover:text-rose-500">
                        Registrirajte kao profesionalac
                      </Link>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <Button
                      variant="link"
                      className="p-0 h-auto text-rose-400 hover:text-rose-500"
                      onClick={() => setView("login")}
                    >
                      Natrag na prijavu
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <RegistrationDialog
        open={showRegistrationDialog}
        onOpenChange={setShowRegistrationDialog}
        email={registerEmail}
        onBack={() => setShowRegistrationDialog(false)}
        onRegistrationComplete={() => {
          setShowEmailConfirmationDialog(true)
        }}
      />
      <EmailConfirmationDialog
        open={showEmailConfirmationDialog}
        onOpenChange={setShowEmailConfirmationDialog}
        email={registerEmail}
        onBackToLogin={() => {
          setShowEmailConfirmationDialog(false)
          setView("login")
        }}
        ></EmailConfirmationDialog>
        
    </>
  )
}
