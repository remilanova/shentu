import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function POST(request){
  const form = await request.formData()
  const payload = {
    title: form.get('title'),
    slug: form.get('slug'),
    body: form.get('body') || '',
    is_published: form.get('is_published') === 'on'
  }
  const supabase = createClient(cookies())
  const { data: { user } } = await supabase.auth.getUser()
  if(!user) return redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if(!profile || !['admin','editor'].includes(profile.role)) return redirect('/')

  await supabase.from('posts').insert(payload)
  redirect('/admin/posts')
}
