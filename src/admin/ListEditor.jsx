import { useState } from 'react'
import { Plus, Trash2, Save, ArrowUp, ArrowDown, Upload, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useRows, uploadPhoto, uploadAudio } from './hooks'
import AudioTrimmer from './AudioTrimmer'
import CropDialog from './CropDialog'

const ACCENT_OPTIONS = [
  'bg-punch/15',
  'bg-ocean/15',
  'bg-sun/25',
  'bg-mint/15',
  'bg-grape/15',
]

const ACCENT_DOTS = {
  'bg-punch/15': '#ff4d6d',
  'bg-ocean/15': '#38b6ff',
  'bg-sun/25': '#ffc24b',
  'bg-mint/15': '#2bd576',
  'bg-grape/15': '#7c5cff',
}

export default function ListEditor({ table, fields, title, hint }) {
  const { rows, loading, error, fetchRows } = useRows(table)
  const [drafts, setDrafts] = useState({})
  const [busyId, setBusyId] = useState(null)
  const [uploadingId, setUploadingId] = useState(null)
  const [notice, setNotice] = useState(null)
  const [cropJob, setCropJob] = useState(null)

  const valueFor = (row, field) => {
    const draft = drafts[row.id]
    let v = draft && field.key in draft ? draft[field.key] : row[field.key]
    if (field.type === 'array' && Array.isArray(v)) v = v.join(field.separator)
    return v ?? ''
  }

  const setField = (id, key, value) =>
    setDrafts((d) => ({ ...d, [id]: { ...(d[id] ?? {}), [key]: value } }))

  // ---- Input validation (defense in depth — the DB CHECK constraints back this up) ----
  const MAX_LEN = {
    title: 200, name: 100, label: 100, role: 200, company: 200, period: 200,
    quote: 3000, description: 6000, vibe: 300, emoji: 32, duration: 50,
    alt: 300, caption: 300, group_title: 100, group_emoji: 32,
    issuer: 200, credential_id: 200, issue_date: 100,
    url: 500, cover_url: 500, audio_url: 500, src: 500, demo: 500, repo: 500,
  }
  const MAX_ARRAY_ITEMS = 50
  // Per-column item length limits — must match the DB trigger (tags: 100, points: 2000, skills: 100)
  const MAX_ARRAY_ITEM_LEN = { tags: 100, points: 2000, skills: 100 }
  // Strict URL fields must be empty, an anchor, or an http(s) URL — never javascript:/data:/etc.
  const STRICT_URL = /^\s*(?:https?:\/\/|#|$)/i
  // Social URLs may be scheme-less (socialUrl() prepends https://), but never allow script schemes.
  const BAD_SCHEME = /^\s*(?:javascript|vbscript|data):/i

  const validateRow = (row) => {
    for (const field of fields) {
      const raw = valueFor(row, field)
      if (field.type === 'array') {
        const items = String(raw).split(field.separator).map((s) => s.trim()).filter(Boolean)
        if (items.length > MAX_ARRAY_ITEMS) return `${field.label}: too many items (max ${MAX_ARRAY_ITEMS}).`
        const itemLimit = MAX_ARRAY_ITEM_LEN[field.key] ?? 2000
        for (const item of items) {
          if (item.length > itemLimit) return `${field.label}: an item is too long (max ${itemLimit} chars).`
        }
        continue
      }
      if (field.type === 'number') {
        if (raw !== '' && raw !== null && raw !== undefined && !Number.isFinite(Number(raw))) {
          return `${field.label} must be a number.`
        }
        if (field.key === 'level' && raw !== '' && raw !== null && raw !== undefined) {
          const n = Number(raw)
          if (n < 0 || n > 100) return 'Level must be between 0 and 100.'
        }
        if ((field.key === 'audio_start' || field.key === 'audio_end') && raw !== '' && raw !== null && raw !== undefined && Number(raw) < 0) {
          return `${field.label} can't be negative.`
        }
        continue
      }
      if (typeof raw === 'string') {
        const limit = MAX_LEN[field.key] ?? 2000
        if (raw.length > limit) return `${field.label} is too long (max ${limit} chars).`
        const isStrictUrl = field.key === 'src' || field.key.endsWith('_url') || field.key === 'demo' || field.key === 'repo'
        if (isStrictUrl && raw.trim() && !STRICT_URL.test(raw)) {
          return `${field.label} must be an http(s) link (or empty).`
        }
        if (field.key === 'url' && raw.trim() && BAD_SCHEME.test(raw)) {
          return `${field.label} must be a normal link.`
        }
      }
    }
    return null
  }

  const buildPayload = (row) => {
    const payload = {}
    for (const field of fields) {
      const raw = valueFor(row, field)
      payload[field.key] =
        field.type === 'array'
          ? String(raw)
              .split(field.separator)
              .map((s) => s.trim())
              .filter(Boolean)
          : field.type === 'checkbox'
            ? Boolean(raw)
            : field.type === 'number'
              ? raw === '' || raw === null || raw === undefined
                ? null
                : Math.round(Number(raw))
              : raw
    }
    return payload
  }

  const defaults = () =>
    fields.reduce((acc, f) => {
      if (f.type === 'checkbox') acc[f.key] = false
      else if (f.type === 'array') acc[f.key] = []
      else if (f.type === 'number') acc[f.key] = null
      else acc[f.key] = f.type === 'accent' ? ACCENT_OPTIONS[0] : ''
      return acc
    }, {})

  const save = async (row) => {
    const validationError = validateRow(row)
    if (validationError) {
      setNotice({ type: 'error', text: validationError })
      return
    }
    setBusyId(row.id)
    setNotice(null)
    const payload = buildPayload(row)
    // Never persist a temporary blob: URL — the upload must finish first
    const audioField = fields.find((f) => f.type === 'audio')
    if (
      audioField &&
      typeof payload[audioField.key] === 'string' &&
      payload[audioField.key].startsWith('blob:')
    ) {
      setNotice({ type: 'error', text: 'Audio is still uploading — wait a moment, then save again.' })
      setBusyId(null)
      return
    }
    const { error } = await supabase.from(table).update(payload).eq('id', row.id)
    if (error) setNotice({ type: 'error', text: error.message })
    else {
      setDrafts((d) => {
        const next = { ...d }
        delete next[row.id]
        return next
      })
      await fetchRows()
      setNotice({ type: 'ok', text: 'Saved — changes are live on the site.' })
    }
    setBusyId(null)
  }

  const remove = async (row) => {
    if (!window.confirm(`Delete this ${title}?`)) return
    setNotice(null)
    const { error } = await supabase.from(table).delete().eq('id', row.id)
    if (error) setNotice({ type: 'error', text: error.message })
    else {
      await fetchRows()
      setNotice({ type: 'ok', text: 'Deleted.' })
    }
  }

  const add = async () => {
    setNotice(null)
    const { error } = await supabase.from(table).insert(defaults())
    if (error) setNotice({ type: 'error', text: error.message })
    else {
      await fetchRows()
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }
  }

  const move = async (index, dir) => {
    const target = index + dir
    if (target < 0 || target >= rows.length) return
    const a = rows[index]
    const b = rows[target]
    await Promise.all([
      supabase.from(table).update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from(table).update({ sort_order: a.sort_order }).eq('id', b.id),
    ])
    await fetchRows()
  }

  // Image uploads go through the crop dialog first
  const pickImage = (row, field, file) => {
    if (!file) return
    setCropJob({ src: URL.createObjectURL(file), row, field })
  }

  const upload = async (row, field, file) => {
    if (!file) return
    setUploadingId(row.id)
    setNotice(null)
    try {
      if (field.type === 'audio') {
        // Show the trimmer instantly on the local file while it uploads
        const old = valueFor(row, field)
        if (typeof old === 'string' && old.startsWith('blob:')) URL.revokeObjectURL(old)
        setField(row.id, field.key, URL.createObjectURL(file))
      }
      const url = field.type === 'audio' ? await uploadAudio(file) : await uploadPhoto(file)
      setField(row.id, field.key, url)
    } catch (err) {
      setNotice({ type: 'error', text: err.message })
    } finally {
      setUploadingId(null)
    }
  }

  const renderField = (row, field) => {
    const value = valueFor(row, field)
    const base =
      'w-full rounded-xl border-2 border-ink/15 bg-cream px-3 py-2 text-sm font-semibold outline-none focus:border-ink dark:border-nightline dark:bg-night dark:text-bone dark:placeholder:text-bone/40'

    if (field.type === 'image') {
      return (
        <div className="flex flex-wrap items-center gap-3">
          {value ? (
            <img src={value} alt="preview" className="size-16 rounded-lg border-2 border-ink/15 object-cover" />
          ) : (
            <span className="flex size-16 items-center justify-center rounded-lg border-2 border-dashed border-ink/25 text-xs font-bold text-ink/40 dark:text-bone/40">
              no image
            </span>
          )}
          <label className="sticker inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-extrabold dark:bg-nightcard">
            <Upload className="size-4" />
            {uploadingId === row.id ? 'Uploading…' : 'Upload'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                pickImage(row, field, e.target.files[0])
                e.target.value = ''
              }}
            />
          </label>
          <span className="text-xs font-bold text-ink/40 dark:text-bone/40">crop opens on upload</span>
        </div>
      )
    }

    if (field.type === 'audio') {
      const startField = fields.find((f) => f.key === 'audio_start')
      const endField = fields.find((f) => f.key === 'audio_end')
      const trimStart = startField ? Number(valueFor(row, startField)) || 0 : 0
      const trimEnd = endField ? Number(valueFor(row, endField)) || 0 : 0
      return (
        <div className="space-y-2">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const file = e.dataTransfer.files?.[0]
              if (file) upload(row, field, file)
            }}
            className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-dashed border-ink/25 bg-cream p-3 dark:border-nightline dark:bg-night"
          >
            {value ? (
              <audio controls src={value} className="h-10 max-w-full rounded-lg" />
            ) : (
              <span className="text-xs font-bold text-ink/40 dark:text-bone/40">no audio yet</span>
            )}
            <label className="sticker inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-extrabold dark:bg-nightcard">
              <Upload className="size-4" />
              {uploadingId === row.id ? 'Uploading…' : 'Upload / drop audio'}
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => upload(row, field, e.target.files[0])}
              />
            </label>
          </div>
          {value && (
            <AudioTrimmer
              src={value}
              start={trimStart}
              end={trimEnd}
              onChange={(s, e) => {
                if (startField) setField(row.id, 'audio_start', Math.round(s))
                if (endField) setField(row.id, 'audio_end', Math.round(e))
              }}
            />
          )}
        </div>
      )
    }

    if (field.type === 'checkbox') {
      return (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => setField(row.id, field.key, e.target.checked)}
          className="size-5 accent-punch"
        />
      )
    }

    if (field.type === 'accent') {
      return (
        <div className="flex flex-wrap gap-1.5">
          {ACCENT_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              title={opt}
              onClick={() => setField(row.id, field.key, opt)}
              className={`size-7 rounded-full border-2 ${value === opt ? 'border-ink scale-110 dark:border-bone' : 'border-ink/20'}`}
              style={{ backgroundColor: ACCENT_DOTS[opt] }}
              aria-label={opt}
            />
          ))}
        </div>
      )
    }

    if (field.type === 'textarea' || field.type === 'array') {
      return (
        <textarea
          rows={field.type === 'array' && !field.textarea ? 1 : 3}
          maxLength={MAX_LEN[field.key] ?? 2000}
          value={value}
          onChange={(e) => setField(row.id, field.key, e.target.value)}
          placeholder={field.type === 'array' ? `Separate items with ${field.separator === '\n' ? 'new lines' : 'commas'}` : field.placeholder}
          className={`${base} resize-y`}
        />
      )
    }

    return (
      <input
        type={field.type === 'number' ? 'number' : 'text'}
        maxLength={MAX_LEN[field.key] ?? 2000}
        value={value}
        onChange={(e) => setField(row.id, field.key, e.target.value)}
        placeholder={field.placeholder}
        className={base}
      />
    )
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-extrabold">{title}</h2>
          {hint && <p className="mt-1 text-sm font-semibold text-ink/55 dark:text-bone/55">{hint}</p>}
        </div>
        <button
          type="button"
          onClick={add}
          className="sticker inline-flex items-center gap-2 rounded-full bg-punch px-5 py-2.5 text-sm font-extrabold text-cream"
        >
          <Plus className="size-4" /> Add new
        </button>
      </div>

      {error && (
        <p className="mb-4 flex items-center gap-2 rounded-2xl border-2 border-punch/30 bg-punch/10 px-4 py-3 text-sm font-bold text-punch">
          <AlertCircle className="size-4" /> {error}
        </p>
      )}
      {notice && (
        <p
          className={`mb-4 flex items-center gap-2 rounded-2xl border-2 px-4 py-3 text-sm font-bold ${
            notice.type === 'error'
              ? 'border-punch/30 bg-punch/10 text-punch'
              : 'border-mint/30 bg-mint/10 text-mint'
          }`}
        >
          {notice.type === 'error' ? <AlertCircle className="size-4" /> : <CheckCircle2 className="size-4" />}
          {notice.text}
        </p>
      )}

      {loading ? (
        <p className="py-8 text-center text-sm font-bold text-ink/50 dark:text-bone/50">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-ink/20 p-10 text-center dark:border-nightline">
          <p className="font-bold text-ink/60 dark:text-bone/60">
            Nothing here yet — hit "Add new" to create your first {title.toLowerCase()}.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {rows.map((row, i) => (
            <li key={row.id} className="sticker rounded-3xl bg-white p-5 dark:bg-nightcard">
              <div className="grid gap-3 md:grid-cols-2">
                {fields.map((field) => (
                  <div
                    key={field.key}
                    className={
                      field.type === 'textarea' || field.type === 'image' || field.type === 'audio'
                        ? 'md:col-span-2'
                        : ''
                    }
                  >
                    <span className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-ink/50 dark:text-bone/50">
                      {field.label}
                    </span>
                    {renderField(row, field)}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => save(row)}
                  disabled={busyId === row.id || uploadingId === row.id}
                  className="sticker inline-flex items-center gap-2 rounded-full bg-mint px-4 py-2 text-xs font-extrabold text-ink disabled:opacity-60"
                >
                  <Save className="size-4" /> {busyId === row.id ? 'Saving…' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="sticker flex size-9 items-center justify-center rounded-xl bg-white disabled:opacity-30 dark:bg-nightcard"
                  aria-label="Move up"
                >
                  <ArrowUp className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === rows.length - 1}
                  className="sticker flex size-9 items-center justify-center rounded-xl bg-white disabled:opacity-30 dark:bg-nightcard"
                  aria-label="Move down"
                >
                  <ArrowDown className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(row)}
                  className="sticker ml-auto inline-flex items-center gap-2 rounded-full bg-punch/10 px-4 py-2 text-xs font-extrabold text-punch hover:bg-punch hover:text-cream"
                >
                  <Trash2 className="size-4" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {cropJob && (
        <CropDialog
          src={cropJob.src}
          defaultAspect={cropJob.field.cropAspect}
          onCancel={() => {
            URL.revokeObjectURL(cropJob.src)
            setCropJob(null)
          }}
          onConfirm={async (blob) => {
            const { src, row, field } = cropJob
            URL.revokeObjectURL(src)
            setCropJob(null)
            const file = new File([blob], 'cropped.jpg', { type: blob.type || 'image/jpeg' })
            await upload(row, field, file)
          }}
        />
      )}
    </div>
  )
}
