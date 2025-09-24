export const metadata = { title: 'Shentu' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg">
      <body style={{ fontFamily: 'system-ui', padding: 24 }}>{children}</body>
    </html>
  )
}
