'use client'
import React, { useState } from 'react'
import Link from 'next/link'

type Pet = { name: string; breed: string; age: string }
type FormState = { pet: Pet; owner: { email: string } }
const DEFAULT_PET: Pet = { name: '', breed: '', age: '' }
const DEFAULT_OWNER = { email: '' }

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border bg-white p-4 shadow-sm">{children}</div>
}
function Section({ title, subtitle, children }:{title:string; subtitle?:string; children:React.ReactNode}) {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-semibold mb-1">{title}</h2>
      {subtitle && <p className="text-sm text-gray-600 mb-4">{subtitle}</p>}
      {children}
    </section>
  )
}
function Field({ label, children }:{label:string; children:React.ReactNode}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-gray-700">{label}</span>
      {children}
    </label>
  )
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="border rounded px-3 py-2 outline-none" />
}

export default function Home() {
  const [form, setForm] = useState<FormState>({ pet: DEFAULT_PET, owner: DEFAULT_OWNER })
  const [earlyConsent, setEarlyConsent] = useState(false)

  function submitMiniCard(e: React.FormEvent) {
    e.preventDefault()
    alert(`OK: ${JSON.stringify(form)}`)
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#3F3A34]">
      <header className="bg-white border-b">
        <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="font-bold">Shentu</Link>
          <div className="flex-1" />
          <Link href="/blog">Блог</Link>
          <Link href="/members">Абонати</Link>
          <Link href="/admin">Админ</Link>
          <Link href="/login">Вход</Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Section title="Начало">
          <Card><p>Това е минимална работеща начална страница. Оттук ще надграждаме дизайна.</p></Card>
        </Section>

        <Section
          title="Мини здравна карта"
          subtitle="Попълнете празните полета, после ще се отвори пълният въпросник."
        >
          <form onSubmit={submitMiniCard}>
            <Card>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
                <Field label="Име на кучето">
                  <Input
                    value={form.pet.name}
                    onChange={e => setForm(prev => ({
                      ...prev,
                      pet: { ...(prev.pet ?? DEFAULT_PET), name: e.target.value }
                    }))}
                  />
                </Field>
                <Field label="Порода">
                  <Input
                    value={form.pet.breed}
                    onChange={e => setForm(prev => ({
                      ...prev,
                      pet: { ...(prev.pet ?? DEFAULT_PET), breed: e.target.value }
                    }))}
                  />
                </Field>
                <Field label="Възраст">
                  <Input
                    value={form.pet.age}
                    onChange={e => setForm(prev => ({
                      ...prev,
                      pet: { ...(prev.pet ?? DEFAULT_PET), age: e.target.value }
                    }))}
                  />
                </Field>
                <Field label="Вашият имейл">
                  <Input
                    type="email"
                    value={form.owner.email}
                    onChange={e => setForm(prev => ({
                      ...prev,
                      owner: { ...(prev.owner ?? DEFAULT_OWNER), email: e.target.value }
                    }))}
                    placeholder="name@example.com"
                  />
                </Field>
              </div>

              <div className="mt-3 flex items-start gap-2">
                <input
                  id="consent-early"
                  type="checkbox"
                  checked={earlyConsent}
                  onChange={e => setEarlyConsent(!!e.target.checked)}
                />
                <label htmlFor="consent-early" className="text-xs text-[#5A544C]">
                  Съгласявам се предоставените данни да бъдат обработвани за целите на услугата и за връзка с мен.
                </label>
              </div>

              <div className="mt-4">
                <button className="px-4 py-2 rounded bg-[#3F3A34] text-white">Продължи</button>
              </div>
            </Card>
          </form>
        </Section>
      </main>

      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-6">© Shentu</div>
      </footer>
    </div>
  )
}
