'use client'
import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'

export default function Uploads(){
  const supabase = createBrowserClient()
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState('')

  async function onUpload(e){
    const file = e.target.files?.[0]
    if(!file) return
    setStatus('Качване…')
    const name = `${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from('media').upload(name, file, { upsert:false })
    if(error){ setStatus('Грешка: ' + error.message); return }
    const { data } = supabase.storage.from('media').getPublicUrl(name)
    setFiles(prev => [{ name, url: data.publicUrl }, ...prev])
    setStatus('Готово.')
  }

  return (
    <div className="card">
      <h1>Качване на файлове</h1>
      <input type="file" onChange={onUpload} />
      <p>{status}</p>
      <ul>
        {files.map(f => <li key={f.name}><a href={f.url} target="_blank">{f.name}</a></li>)}
      </ul>
    </div>
  )
}
