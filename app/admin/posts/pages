import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function PostsAdmin(){
  const supabase = createClient(cookies())
  const { data: { user } } = await supabase.auth.getUser()
  if(!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if(!profile || !['admin','editor'].includes(profile.role)) redirect('/')

  const { data: posts } = await supabase.from('posts').select('*').order('created_at', { ascending: false })

  return (
    <div className="card">
      <h1>Постове</h1>
      <Link href="/admin/posts/new"><button>Нов пост</button></Link>
      <table className="table">
        <thead><tr><th>Заглавие</th><th>Slug</th><th>Публикуван</th><th></th></tr></thead>
        <tbody>
          {(posts||[]).map(p => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td><code>{p.slug}</code></td>
              <td>{p.is_published ? 'Да' : 'Не'}</td>
              <td><Link href={`/admin/posts/${p.id}`}>Редакция</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
