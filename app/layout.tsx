import './globals.css'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export const metadata = { title: 'Shentu Portal' }

export default async function RootLayout({ children }) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="bg">
      <body>
        <header className="site-header">
          <nav className="container">
            <div className="brand"><Link href="/">Shentu</Link></div>
            <div className="spacer" />
            <Link href="/blog">Блог</Link>
            {!!user && <Link href="/members">Абонати</Link>}
            {!!user && <Link href="/admin">Админ</Link>}
            {!user ? <Link href="/login">Вход</Link> : <form action="/logout" method="post"><button>Изход</button></form>}
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer"><div className="container">© Shentu</div></footer>
      </body>
    </html>
  )
}
