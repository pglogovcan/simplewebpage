'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AuthDialog } from './auth-dialog'
import { useAuth } from '@/app/context/AuthContext'

export function AuthHandler() {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const authRequired = searchParams.get('auth') === 'required'
    const redirectPath = searchParams.get('redirect')

    if (authRequired && !user) {
      setShowAuthDialog(true)
    } else if (user && redirectPath) {
      router.push(redirectPath)
    }
  }, [searchParams, user, router])

  return (
    <>
      {showAuthDialog && (
        <AuthDialog 
          onClose={() => setShowAuthDialog(false)}
          defaultView="sign_in"
          redirectAfterAuth={searchParams.get('redirect') || '/'}
        />
      )}
    </>
  )
} 