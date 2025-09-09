import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

/**
 * Retrieves the currently authenticated user from Supabase.
 * This function is a server-side utility to securely get user data.
 * It checks for Supabase configuration and gracefully returns null if not configured,
 * preventing crashes in development or misconfigured environments.
 * @returns {Promise<User | null>} A promise that resolves to the user object or null if not authenticated or if Supabase is not configured.
 */
export async function getUser(): Promise<User | null> {
  // Check if Supabase is configured to avoid errors in environments where it's not set up.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase not configured. User authentication unavailable.')
    return null
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

/**
 * Enforces authentication on a page or component.
 * If the user is not authenticated, it redirects them to the /login page.
 * This is a crucial utility for protecting routes that require a logged-in user.
 * @returns {Promise<User>} A promise that resolves to the user object if authenticated.
 * @throws {Error} Redirects the user to the login page if not authenticated.
 */
export async function requireAuth(): Promise<User> {
  const user = await getUser()
  
  // Redirect to login if no user is found. This protects the route.
  if (!user) {
    redirect('/login')
  }
  
  return user
}
