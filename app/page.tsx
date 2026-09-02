'use client'

import { useMemo, useRef, useState } from 'react'
import {
  ArrowUpRight,
  Clipboard,
  CloudUpload,
  FileImage,
  FileText,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'

type Output = { title: string; date: string; time: string; location: string; attendees: string; discussions: string[]; decisions: string[]; actions: string[]; review: string[] }

const sampleNotes = `Weekly Operations Sync\nMarch 14, 2025 · 10:00 AM\nConference Room A\n\nAttendees: Maya Chen, Jordan Lee, Priya Shah, Luis Gomez\n\nWe reviewed the Q2 launch timeline. The website copy is blocked on legal approval, which Priya will follow up on by Friday.\n\nThe team agreed to move the customer beta to April 8. Jordan will share the updated onboarding flow by March 21.\n\nNext sync: March 21 at 10:00 AM.`

const starter: Output = { title: 'Weekly Operations Sync', date: 'March 14, 2025', time: '10:00 AM', location: 'Conference Room A', attendees: 'Maya Chen, Jordan Lee, Priya Shah, Luis Gomez', discussions: ['Reviewed the Q2 launch timeline.', 'Website copy is blocked on legal approval.'], decisions: ['Move the customer beta launch to April 8.'], actions: ['Priya to follow up on legal approval by Friday.', 'Jordan to share the updated onboarding flow by March 21.'], review: [] }

function formatText(raw: string): Output {
  const lines = raw.split('\n').map((line) => line.trim()).filter(Boolean)
  const title = lines[0] || 'Operations Meeting'
  const meta = lines[1] || 'Date and time to confirm'
  const location = lines[2] || 'Location to confirm'
  const attendeesLine = lines.find((line) => /attendees/i.test(line)) || 'Attendees to confirm'
  const body = lines.filter((line) => ![title, meta, location, attendeesLine].includes(line) && !/^next sync/i.test(line))
  const review = [!lines[1] && 'Date and time need review', !lines.find((line) => /attendees/i.test(line)) && 'Attendance needs review'].filter(Boolean) as string[]
  return { title, date: meta.split('·')[0]?.trim() || meta, time: meta.split('·')[1]?.trim() || 'Time to confirm', location, attendees: attendeesLine.replace(/attendees:?/i, '').trim(), discussions: body.slice(0, 2), decisions: body.filter((line) => /agreed|decided|decision|move/i.test(line)).slice(0, 2), actions: body.filter((line) => /will|to | by |follow up|share/i.test(line)).slice(0, 3), review }
}

export default function Page() {
  const [notes, setNotes] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [output, setOutput] = useState<Output | null>(null)
  const [isFormatting, setIsFormatting] = useState(false)
  const [status, setStatus] = useState('')
  const [clearAfterExport, setClearAfterExport] = useState(false)
  const [isEditingOutput, setIsEditingOutput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasInput = notes.trim().length > 0 || files.length > 0
  const fileLabel = useMemo(() => files.length ? `${files.length} visual source${files.length > 1 ? 's' : ''} ready` : 'Drop image or PDF files here', [files.length])

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const accepted = Array.from(list).filter((file) => file.type.startsWith('image/') || file.type === 'application/pdf').slice(0, 5)
    setFiles((current) => [...current, ...accepted].slice(0, 5))
    setStatus(accepted.length ? 'Visual source added. It will be read as an image, not as a filename.' : 'Use a PNG, JPG, WEBP, or PDF file.')
  }

  const format = async () => {
    if (!hasInput) return
    setIsFormatting(true); setStatus(files.length ? 'Reading visual source and structuring the minutes…' : 'Structuring your notes…')
    try {
      if (files.length) {
        const payload = await Promise.all(files.map(async (file) => ({ name: file.name, type: file.type, data: await toDataUrl(file) })))
        const response = await fetch('/api/format-motm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notes, files: payload }) })
        if (response.ok) { const data = await response.json(); setOutput(data.output); setStatus(data.message || 'Visual source analyzed. Please review highlighted details.') }
        else { setOutput(formatText(notes || sampleNotes)); setStatus('Preview created. Add AI Gateway access to analyze uploads live.') }
      } else { await new Promise((resolve) => setTimeout(resolve, 650)); setOutput(formatText(notes)); setStatus('Draft ready for review.') }
    } catch { setOutput(formatText(notes || sampleNotes)); setStatus('Draft created locally. Some source details need review.') }
    setIsFormatting(false)
  }

  const copy = async () => { if (!output) return; await navigator.clipboard?.writeText(toPlainText(output)); setStatus('MOTM copied to clipboard.') }
  const reset = () => { setNotes(''); setFiles([]); setOutput(null); setStatus('') }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3"><div className="brand-mark"><Sparkles size={16} /></div><div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Operations desk</p><p className="font-serif text-lg font-semibold leading-none">Minuteform</p></div></div>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span className="status-dot" /> Secure workspace <ArrowUpRight size={14} /></div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[minmax(360px,0.82fr)_minmax(520px,1.18fr)] lg:px-8 lg:py-14">
        <section className="space-y-7">
          <div className="space-y-4"><p className="eyebrow">Meeting intelligence / 01</p><h1 className="max-w-xl font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-primary sm:text-6xl">From scattered notes to <em className="text-accent">clear action.</em></h1><p className="max-w-md text-base leading-7 text-muted-foreground">Paste notes or upload a photo of the whiteboard. Minuteform turns the visual record into minutes your team can act on.</p></div>
          <div className="input-card">
            <div className="flex items-center justify-between"><label htmlFor="notes" className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-primary">Source notes</label><button onClick={() => setNotes(sampleNotes)} className="text-xs font-semibold text-accent hover:underline">Use sample</button></div>
            <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste meeting notes here…" className="mt-4 min-h-48 w-full resize-y bg-transparent text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground/60" />
            <div className="mt-4 border-t border-border pt-4">
              <input ref={inputRef} type="file" accept="image/*,application/pdf" multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} />
              <button type="button" onClick={() => inputRef.current?.click()} className="upload-zone group w-full text-left"><CloudUpload className="text-accent" size={21} /><span className="flex-1"><strong className="block text-sm font-semibold text-primary">{fileLabel}</strong><small className="mt-1 block text-xs leading-5 text-muted-foreground">JPG, PNG, WEBP, or PDF · up to 5 files · visual reading enabled</small></span><Plus size={17} className="text-muted-foreground transition group-hover:text-accent" /></button>
              {files.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{files.map((file, index) => <div key={`${file.name}-${index}`} className="file-chip"><span className="file-type">{file.type === 'application/pdf' ? <FileText size={13} /> : <FileImage size={13} />}</span><span className="max-w-40 truncate">{file.name}</span><button aria-label={`Remove ${file.name}`} onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}><X size={13} /></button></div>)}</div>}
            </div>
            <div className="mt-5 flex items-center gap-3"><button onClick={format} disabled={!hasInput || isFormatting} className="primary-button flex-1 justify-center">{isFormatting ? <LoaderCircle className="animate-spin" size={16} /> : <Sparkles size={16} />} {isFormatting ? 'Reading source…' : 'Format minutes'}</button><button onClick={reset} aria-label="Clear source" className="icon-button"><Trash2 size={17} /></button></div>
            <label className="mt-4 flex cursor-pointer items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" checked={clearAfterExport} onChange={(e) => setClearAfterExport(e.target.checked)} className="h-3.5 w-3.5 accent-[var(--accent)]" /> Clear output after export</label>
            {status && <p className="mt-3 text-xs leading-5 text-muted-foreground" role="status">{status}</p>}
          </div>
          <div className="flex gap-3 border-l-2 border-accent pl-4 text-xs leading-5 text-muted-foreground"><Sparkles className="mt-0.5 shrink-0 text-accent" size={15} /><p><strong className="text-primary">Visual-first extraction.</strong> Photos and scans are sent as visual inputs so handwriting, diagrams, and page layout stay in context.</p></div>
        </section>
        <section className="document-shell" aria-live="polite">
          <div className="flex items-center justify-between border-b border-border px-6 py-5"><div><p className="eyebrow">Output / 02</p><h2 className="mt-1 font-serif text-2xl font-semibold text-primary">Meeting minutes</h2></div><div className="flex flex-wrap justify-end gap-2">{output && <><button onClick={() => setIsEditingOutput((value) => !value)} className={`secondary-button ${isEditingOutput ? 'bg-accent/10 text-accent' : ''}`} title={isEditingOutput ? 'Finish editing' : 'Edit minutes'}><Pencil size={15} /> <span className="hidden sm:inline">{isEditingOutput ? 'Done' : 'Edit'}</span></button><button onClick={() => { setOutput(null); setIsEditingOutput(false); setStatus('Output cleared. Your source notes are still available.') }} className="secondary-button" title="Clear output"><Trash2 size={15} /> <span className="hidden sm:inline">Clear</span></button><button onClick={copy} className="secondary-button" title="Copy minutes"><Clipboard size={15} /> <span className="hidden sm:inline">Copy</span></button><button onClick={() => { download(output); if (clearAfterExport) { setOutput(null); setStatus('MOTM exported and output cleared.') } }} className="secondary-button" title="Download minutes"><FileText size={15} /> <span className="hidden sm:inline">Export</span></button></>}</div></div>
          {output ? <div className="space-y-7 p-6 sm:p-8"><div><h3 contentEditable={isEditingOutput} suppressContentEditableWarning onBlur={(e) => setOutput({ ...output, title: e.currentTarget.textContent || output.title })} className={`font-serif text-3xl font-semibold leading-tight text-primary ${isEditingOutput ? 'rounded px-1 outline outline-1 outline-accent/40' : ''}`}>{output.title}</h3><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground"><span>{output.date}</span><span>{output.time}</span><span>{output.location}</span></div></div><DocumentSection label="Attendees" content={output.attendees} editable={isEditingOutput} onChange={(value) => setOutput({ ...output, attendees: value })} /><DocumentSection label="Discussion" items={output.discussions} editable={isEditingOutput} onChange={(value) => setOutput({ ...output, discussions: value })} /><DocumentSection label="Decisions" items={output.decisions} editable={isEditingOutput} onChange={(value) => setOutput({ ...output, decisions: value })} /><DocumentSection label="Action items" items={output.actions} editable={isEditingOutput} onChange={(value) => setOutput({ ...output, actions: value })} numbered />{output.review.length > 0 && <div className="review-note"><RefreshCw size={15} /><div><strong>Needs review</strong><p>{output.review.join(' · ')}</p></div></div>}<p className="border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[0.13em] text-muted-foreground">Prepared by Minuteform · Review before sharing</p></div> : <div className="flex min-h-[570px] flex-col items-center justify-center px-8 text-center"><div className="empty-icon"><FileText size={24} /></div><h3 className="mt-5 font-serif text-2xl font-semibold text-primary">Your minutes will appear here</h3><p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">Add notes or a visual source to create a structured, share-ready record.</p></div>}
        </section>
      </div>
    </main>
  )
}

function DocumentSection({ label, content, items, numbered, editable, onChange }: { label: string; content?: string; items?: string[]; numbered?: boolean; editable?: boolean; onChange?: (value: string | string[]) => void }) { return <div className="document-section"><p className="eyebrow">{label}</p>{content && <p contentEditable={editable} suppressContentEditableWarning onBlur={(e) => onChange?.(e.currentTarget.textContent || '')} className={`mt-2 text-sm leading-6 text-foreground ${editable ? 'rounded px-1 outline outline-1 outline-accent/40' : ''}`}>{content}</p>}{items?.length ? <ul className={`mt-2 space-y-2 text-sm leading-6 text-foreground ${numbered ? 'list-decimal pl-5' : 'list-disc pl-5'}`}>{items.map((item, i) => <li key={i} contentEditable={editable} suppressContentEditableWarning onBlur={(e) => { const next = [...items]; next[i] = e.currentTarget.textContent || ''; onChange?.(next) }} className={editable ? 'rounded px-1 outline outline-1 outline-accent/40' : ''}>{item}</li>)}</ul> : !content && <p className="mt-2 text-sm italic text-muted-foreground">No details captured</p>}</div> }
function toDataUrl(file: File) { return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file) }) }
function toPlainText(o: Output) { return `${o.title}\n${o.date} · ${o.time} · ${o.location}\n\nAttendees\n${o.attendees}\n\nDiscussion\n${o.discussions.map((x) => `• ${x}`).join('\n')}\n\nDecisions\n${o.decisions.map((x) => `• ${x}`).join('\n')}\n\nAction items\n${o.actions.map((x, i) => `${i + 1}. ${x}`).join('\n')}` }
function download(o: Output) { const blob = new Blob([toPlainText(o)], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${o.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`; a.click(); URL.revokeObjectURL(url) }
