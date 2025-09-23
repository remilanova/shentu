import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function NewPost(){
  return (
    <div className="card">
      <h1>Нов пост</h1>
      <form action="/admin/posts/create" method="post" className="grid">
        <label>Заглавие<input name="title" required/></label>
        <label>Slug<input name="slug" required placeholder="krotak-statia"/></label>
        <label>Съдържание (Markdown)<textarea name="body" rows={12} /></label>
        <label><input type="checkbox" name="is_published"/> Публикуван</label>
        <button type="submit">Запази</button>
      </form>
    </div>
  )
}
