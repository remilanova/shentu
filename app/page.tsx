import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="card">
      <h1>Shentu Portal</h1>
      <p>Добре дошла! Избери къде да продължиш:</p>
      <ul>
        <li><Link href="/blog">Блог</Link></li>
        <li><Link href="/admin">Админ панел</Link> (ще иска логин)</li>
      </ul>
    </div>
  )
}
