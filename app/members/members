import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function MembersPage(){
  const supabase = createClient(cookies())
  const { data: { user } } = await supabase.auth.getUser()
  if(!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if(!profile || !['subscriber','admin','editor'].includes(profile.role)) redirect('/login')

  return (
    <div className="card">
      <h1>Затворена зона</h1>
      <p>Само абонати/екип. Тук може да сложиш видео, рецепти, файлове.</p>
    </div>
  )
}
