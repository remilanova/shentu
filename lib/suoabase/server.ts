'use server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient(cookieStore) {
  const cookie = cookieStore || cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => cookie.get(name)?.value,
        set: (name, value, options) => {
          cookie.set(name, value, options)
        },
        remove: (name, options) => {
          cookie.set(name, '', { ...options, maxAge: 0 })
        }
      }
    }
  )
}
