// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies as nextCookies, type Cookies } from 'next/headers'

export function createClient(cookieStore?: Cookies) {
  const store = cookieStore ?? nextCookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // НОВИЯТ API -> няма get/set/remove, а getAll/setAll
        getAll() {
          return store.getAll().map(c => ({ name: c.name, value: c.value }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // `options` идват от Supabase; Next cookies приемат същия shape
            store.set(name, value, options as any)
          })
        }
      }
    }
  )
}
