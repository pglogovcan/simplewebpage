"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface EmailConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
  onBackToLogin: () => void
}

export function EmailConfirmationDialog({ open, onOpenChange, email, onBackToLogin }: EmailConfirmationDialogProps) {
  const [isMounted, setIsMounted] = useState(false)

  // Ensure component is mounted before rendering Dialog to avoid hydration issues
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="rounded-full bg-teal-100 p-3">
              <CheckCircle2 className="h-12 w-12 text-teal-500" />
            </div>

            <h2>Confirm your signup</h2>

            <p className="text-gray-600 max-w-sm">
              Poslali smo e-mail s potvrdom na adresu <span className="font-medium">{email}</span>.
            </p>

            <p className="text-gray-600 max-w-sm">
              Ako ne primite e-mail, provjerite svoju mapu neželjene pošte ili pokušajte ponovno.
            </p>
            <div className="w-full pt-4 space-y-3">
              <Button className="w-full bg-teal-400 hover:bg-teal-500 text-white" onClick={onBackToLogin}>
                Natrag na prijavu
              </Button>

              <p className="text-sm text-gray-500">
                Niste primili e-mail?{" "}
                <Link href="#" className="text-rose-500 hover:underline">
                  Pošalji ponovno
                </Link>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
