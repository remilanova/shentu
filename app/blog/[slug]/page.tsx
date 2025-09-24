// app/blog/[slug]/page.tsx
import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

// ВАЖНО: правилният импорт за remark (няма default export)
import { remark } from 'remark'
import html from 'remark-html'

export const dynamic = 'force-dynamic'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const supabase = createClient(cookies())

  // 1) Взимаме поста по slug
  const { data: post } = await supabase
    .from('posts')
    .select('id, title, slug, body, created_at')
    .eq('slug', params.slug)
    .single()

  // 2) Преобразуваме Markdown → HTML (получаваме string с HTML)
  const processed = await remark().use(html).process(post?.body ?? '')
  const bodyHtml = processed.toString() // <- това е готовият HTML

  // 3) В JSX показваме HTML-а чрез dangerouslySetInnerHTML
  return (
    <main className="container">
      <p><Link href="/blog">← обратно към блога</Link></p>
      <h1>{post?.title}</h1>

      {/* ЕТО ТУК използваме dangerouslySetInnerHTML */}
      <div
        className="post-body"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
    </main>
  )
}
