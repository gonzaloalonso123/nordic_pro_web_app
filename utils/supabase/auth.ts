import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Database } from "../database.types"

// Sign in with email and password
export async function signIn(email: string, password: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { user: data.user, session: data.session }
}

// Sign up with email and password
export async function signUp(email: string, password: string, metadata: { firstName: string; lastName: string }) {
  const supabase = createServerActionClient<Database>({ cookies })

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        first_name: metadata.firstName,
        last_name: metadata.lastName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { user: data.user, session: data.session }
}

// Sign out
export async function signOut() {
  const supabase = createServerActionClient<Database>({ cookies })
  await supabase.auth.signOut()
  redirect("/login")
}

// Reset password
export async function resetPassword(email: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

// Update password
export async function updatePassword(password: string) {
  const supabase = createServerActionClient<Database>({ cookies })

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

// Get current session
export async function getCurrentSession() {
  const supabase = createServerActionClient<Database>({ cookies })

  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session) {
    return null
  }

  return data.session
}

// Get current user
export async function getCurrentUser() {
  const supabase = createServerActionClient<Database>({ cookies })

  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return null
  }

  return data.user
}

// Middleware to check if user is authenticated
export async function requireAuth() {
  const session = await getCurrentSession()

  if (!session) {
    redirect("/login")
  }

  return session
}
