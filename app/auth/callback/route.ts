// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const supabase = createClient(cookies())

  if (!code) {
    return NextResponse.redirect(new URL('/login?err=missing_code', url.origin))
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(new URL('/login?err=exchange', url.origin))
  }

  // накъде да прати след логин – можеш да смениш на /admin
  return NextResponse.redirect(new URL('/members', url.origin))
}
