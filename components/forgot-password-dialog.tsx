"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { resetPassword } from "@/app/actions/auth-actions"

export function ForgotPasswordDialog() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  // Ensure component is mounted before rendering Dialog to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <Button variant="link" className="text-rose-400 hover:text-rose-500 p-0 h-auto">
        Izgubljena lozinka?
      </Button>
    )
  }

  const resetPasswordHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await resetPassword(formData)

    if (result.error) {
      toast({
        title: "Greška",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Uspješno",
        description: "Provjerite svoj email za daljnje upute.",
        variant: "default",
      })
      setOpen(false)
    }
  }

  return (
    <>
      <Button variant="link" className="text-rose-400 hover:text-rose-500 p-0 h-auto" onClick={() => setOpen(true)}>
        Izgubljena lozinka?
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[450px] p-6">
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-2">Resetiranje lozinke</DialogTitle>
            <p className="text-gray-600 text-sm">
              Unesite email adresu povezanu s vašim računom i poslat ćemo vam upute za resetiranje lozinke.
            </p>
            
          </DialogHeader>
          
            <form method="POST" className="space-y-4 mt-4" onSubmit={resetPasswordHandler}>
              <div className="space-y-2">
                <Input
                  type="email"
                  name="email"
                  placeholder="Vaš e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus:border-rose-400 focus:ring-rose-400"
                />
              </div>

              <Button type="submit" className="w-full bg-rose-400 hover:bg-rose-500">
                Resetiraj
              </Button>

              <div className="text-center text-sm mt-4">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-gray-600 hover:text-gray-900"
                  onClick={() => setOpen(false)}
                  
                >
                  Natrag na prijavu
                </Button>
              </div>
            </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
