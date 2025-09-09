'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

/**
 * @typedef AuthContextType
 * @property {User | null} user - The current authenticated user object, or null if not logged in.
 * @property {boolean} loading - True while the authentication state is being determined.
 * @property {(email: string, password: string) => Promise<{ error: Error | null }>} signIn - Function to sign in a user.
 * @property {(email: string, password: string, name: string) => Promise<{ error: Error | null }>} signUp - Function to sign up a new user.
 * @property {() => Promise<void>} signOut - Function to sign out the current user.
 */
type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * The AuthProvider component is a React Context provider that manages the application's
 * authentication state. It provides user information and authentication methods to all
 * child components.
 * @param {{ children: React.ReactNode }} { children } - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The AuthProvider component.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Check if Supabase is configured to prevent errors if env variables are missing.
  const isSupabaseConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  useEffect(() => {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Authentication features disabled.')
      setLoading(false)
      return
    }

    /**
     * This effect hook handles the user's session state.
     * It fetches the initial session and sets up a listener for any authentication state changes,
     * ensuring the app's UI reacts to logins, logouts, and token refreshes.
     */
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // The cleanup function unsubscribes from the auth state listener to prevent memory leaks.
    return () => subscription.unsubscribe()
  }, [supabase, isSupabaseConfigured])

  /**
   * Signs in a user with their email and password.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<{ error: Error | null }>} An object containing an error if the sign-in fails.
   */
  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Authentication not configured. Please set up Supabase environment variables.' } as Error }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  /**
   * Signs up a new user with their email, password, and name.
   * @param {string} email - The new user's email address.
   * @param {string} password - The new user's password.
   * @param {string} name - The new user's name.
   * @returns {Promise<{ error: Error | null }>} An object containing an error if the sign-up fails.
   */
  const signUp = async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Authentication not configured. Please set up Supabase environment variables.' } as Error }
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })
    return { error }
  }

  /**
   * Signs out the currently authenticated user.
   * After signing out, it redirects the user to the homepage.
   */
  const signOut = async () => {
    if (!isSupabaseConfigured) {
      console.warn('Authentication not configured.')
      return
    }

    await supabase.auth.signOut()
    // The redirect is handled by the middleware, but a client-side redirect is a good fallback.
    window.location.href = '/'
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * A custom hook to access the authentication context.
 * It provides a convenient way to get the user and authentication methods.
 * Throws an error if used outside of an AuthProvider to prevent runtime issues.
 * @returns {AuthContextType} The authentication context.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
