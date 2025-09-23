// app/admin/posts/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditPost({ params }: { params: { id: string } }) {
  const supabase = createClient(cookies())
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!profile || !['admin', 'editor'].includes(profile.role)) redirect('/')

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .single()

  return (
    <div className="card">
      <h1>Редакция</h1>

      <form action={`/admin/posts/${params.id}/update`} method="post" className="grid">
        <label>Заглавие<input name="title" defaultValue={post?.title ?? ''} required /></label>
        <label>Slug<input name="slug" defaultValue={post?.slug ?? ''} required /></label>
        <label>Съдържание (Markdown)<textarea name="body" rows={12} defaultValue={post?.body ?? ''} /></label>
        <label><input type="checkbox" name="is_published" defaultChecked={!!post?.is_published} /> Публикуван</label>
        <button type="submit">Запази</button>
      </form>

      <form action={`/admin/posts/${params.id}/delete`} method="post" style={{ marginTop: 12 }}>
        <button>Изтрий</button>
      </form>
    </div>
  )
}
