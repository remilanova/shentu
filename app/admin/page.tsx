import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminPage(){
  const supabase = createClient(cookies())
  const { data: { user } } = await supabase.auth.getUser()
  if(!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if(!profile || !['admin','editor'].includes(profile.role)) redirect('/')

  return (
    <div className="card">
      <h1>Админ</h1>
      <ul>
        <li><Link href="/admin/posts">Постове</Link></li>
        <li><Link href="/admin/uploads">Качване на файлове</Link></li>
        <li><Link href="/admin/pages">Страници</Link></li>
      </ul>
    </div>
  )
}
