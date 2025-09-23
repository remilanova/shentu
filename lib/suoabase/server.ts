'use server'

import { createServerClient } from '@supabase/ssr'
import type { Cookies } from 'next/headers'

export function createClient(cookies: Cookies) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookies.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          cookies.set(name, value, options)
        },
        remove: (name: string, options: any) => {
          cookies.set(name, '', { ...options, maxAge: 0 })
        }
      }
    }
  )
}
