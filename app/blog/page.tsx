import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function BlogIndex(){
  const supabase = createClient(cookies())
  const { data: posts } = await supabase.from('posts').select('id,title,slug,is_published').eq('is_published', true).order('created_at', { ascending:false })
  return (
    <div className="card">
      <h1>Блог</h1>
      <ul>
        {(posts||[]).map(p => <li key={p.id}><Link href={`/blog/${p.slug}`}>{p.title}</Link></li>)}
      </ul>
    </div>
  )
}
