// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shentu Portal',
  description: 'Здраве отвътре навън',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg">
      <body style={{ fontFamily: 'system-ui', margin: 0 }}>{children}</body>
    </html>
  )
}
