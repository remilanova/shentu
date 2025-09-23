import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function LoginPage(){
  return (
    <div className="card">
      <h1>Вход</h1>
      <form action="/login" method="post" className="grid">
        <label>Имейл<input type="email" name="email" required/></label>
        <button type="submit">Изпрати линк за вход</button>
      </form>
    </div>
  )
}
