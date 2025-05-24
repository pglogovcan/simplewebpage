import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) console.error('getSession error:', error)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false) 
    })

    return () => subscription.subscription.unsubscribe()
  }, [supabase])

  return { user, loading }
}
