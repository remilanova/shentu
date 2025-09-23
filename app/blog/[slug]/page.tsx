import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import remark from 'remark'
import html from 'remark-html'

export const dynamic = 'force-dynamic'

export default async function BlogPost({ params }){
  const supabase = createClient(cookies())
  const { data: post } = await supabase.from('posts').select('*').eq('slug', params.slug).eq('is_published', true).single()
  if(!post) return notFound()
  const processed = await remark().use(html).process(post.body || '')
  return (
    <article className="card">
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{__html: processed.toString()}} />
    </article>
  )
}
