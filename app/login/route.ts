import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function POST(request){
  const formData = await request.formData()
  const email = formData.get('email')
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { error } = await supabase.auth.signInWithOtp({ email, options:{ emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/auth/callback' }})
  if(error){ return new Response('Error', { status: 500 }) }
  return redirect('/login?sent=1')
}
