// app/admin/posts/[id]/delete/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export const runtime = 'nodejs' // важен ред за стабилност (не Edge)

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient(cookies())

  // 1) Вход
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2) Роля
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 3) Изтриване
  const { error } = await supabase.from('posts').delete().eq('id', params.id)
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  // 4) Обратно към списъка
  return NextResponse.redirect(new URL('/admin/posts', request.url))
}

