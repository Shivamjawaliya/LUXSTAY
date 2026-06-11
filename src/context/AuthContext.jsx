import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // onAuthStateChange fires INITIAL_SESSION on mount (Supabase v2),
    // which processes any OAuth hash/code in the URL before resolving.
    // Using it as the sole source of truth prevents the OAuth race where
    // getSession() resolved null before the hash was exchanged.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.access_token) {
        localStorage.setItem('luxstay_token', session.access_token)
      } else {
        localStorage.removeItem('luxstay_token')
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('luxstay_token')
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, token: session?.access_token ?? null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
