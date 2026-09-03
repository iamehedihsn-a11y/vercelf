import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { LogOut, Radio, Home, PencilRuler } from 'lucide-react'
import ProfileForm from './ProfileForm'
import ListEditor from './ListEditor'
import MusicSettingsForm from './MusicSettingsForm'
import SkillsSettingsForm from './SkillsSettingsForm'

const fieldDefs = {
  projects: [
    { key: 'title', label: 'Title' },
    { key: 'cover_url', label: 'Cover image', type: 'image', cropAspect: 16 / 10 },
    { key: 'emoji', label: 'Emoji' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'tags', label: 'Tags', type: 'array', separator: ',' },
    { key: 'accent', label: 'Accent colour', type: 'accent' },
    { key: 'demo', label: 'Demo URL' },
    { key: 'repo', label: 'Repo URL' },
    { key: 'featured', label: 'Featured', type: 'checkbox' },
  ],
  experience: [
    { key: 'role', label: 'Role' },
    { key: 'company', label: 'Company' },
    { key: 'period', label: 'Period' },
    { key: 'emoji', label: 'Emoji' },
    { key: 'points', label: 'Highlights', type: 'array', separator: '\n', textarea: true },
  ],
  skills: [
    { key: 'group_emoji', label: 'Group emoji' },
    { key: 'group_title', label: 'Group name' },
    { key: 'name', label: 'Skill name' },
    { key: 'level', label: 'Level (%)', type: 'number' },
  ],
  certifications: [
    { key: 'title', label: 'Title / Certificate name' },
    { key: 'issuer', label: 'Issuer / Organization' },
    { key: 'issue_date', label: 'Issue date / Year' },
    { key: 'credential_id', label: 'Credential ID' },
    { key: 'credential_url', label: 'Credential verification URL' },
    { key: 'image_url', label: 'Badge / Certificate image', type: 'image', cropAspect: 4 / 3 },
    { key: 'emoji', label: 'Emoji' },
    { key: 'skills', label: 'Skills / Topics', type: 'array', separator: ',' },
    { key: 'description', label: 'Description', type: 'textarea' },
  ],
  gallery: [
    { key: 'src', label: 'Photo', type: 'image' },
    { key: 'alt', label: 'Alt text' },
    { key: 'caption', label: 'Caption' },
  ],
  testimonials: [
    { key: 'quote', label: 'Quote', type: 'textarea' },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'emoji', label: 'Emoji' },
  ],
  socials: [
    { key: 'label', label: 'Label' },
    { key: 'url', label: 'URL' },
  ],
  musicTracks: [
    { key: 'title', label: 'Title' },
    { key: 'artist', label: 'Artist' },
    { key: 'duration', label: 'Duration' },
    { key: 'emoji', label: 'Emoji' },
    { key: 'cover_url', label: 'Cover image', type: 'image', cropAspect: 1 },
    { key: 'audio_url', label: 'Audio file', type: 'audio' },
    { key: 'audio_start', label: 'Trim start (seconds)', type: 'number' },
    { key: 'audio_end', label: 'Trim end (seconds)', type: 'number' },
  ],
}

const tabs = [
  { id: 'profile', label: '👤 Profile', hint: 'Name, bio & contact info' },
  { id: 'projects', label: '💼 Projects', hint: 'Reorder with ▲ ▼, save after edits' },
  { id: 'experience', label: '🛠️ Experience', hint: 'Job history & highlights' },
  { id: 'skills', label: '🧰 Skills', hint: 'Add skills + levels, group them, and edit the scrolling marquee' },
  { id: 'certifications', label: '📜 Certifications', hint: 'Licenses, courses, degrees & certifications' },
  { id: 'gallery', label: '📸 Gallery', hint: 'Upload photos (crop before saving) straight to Supabase Storage' },
  { id: 'testimonials', label: '💬 Testimonials', hint: 'Kind words from clients' },
  { id: 'socials', label: '🔗 Socials', hint: 'Links shown in the contact section' },
  { id: 'music', label: '🎵 Music', hint: 'Vibe text, playlist tracks, cover art & Spotify embed' },
]

export default function AdminPanel({ session }) {
  const [tab, setTab] = useState('profile')
  const [live, setLive] = useState(false)

  useEffect(() => {
    const channel = supabase
      .channel('admin-status')
      .subscribe((status) => setLive(status === 'SUBSCRIBED'))
    return () => supabase.removeChannel(channel)
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-night">
      <header className="sticky top-0 z-40 border-b-2 border-ink/10 bg-white/90 backdrop-blur-md dark:border-nightline dark:bg-nightcard/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 font-display text-lg font-extrabold">
            <span className="flex size-8 items-center justify-center rounded-xl bg-sun text-ink">
              <PencilRuler className="size-4" />
            </span>
            Admin
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold ${
                live ? 'bg-mint/15 text-mint' : 'bg-punch/15 text-punch'
              }`}
              title={live ? 'Realtime connected' : 'Connecting…'}
            >
              <Radio className={`size-3.5 ${live ? 'animate-pulse' : ''}`} />
              {live ? 'Live' : '…'}
            </span>
            <a
              href="/"
              className="sticker inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-extrabold dark:bg-nightcard"
            >
              <Home className="size-4" /> Site
            </a>
            <button
              type="button"
              onClick={logout}
              className="sticker inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-extrabold hover:bg-punch/10 dark:bg-nightcard"
            >
              <LogOut className="size-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="mb-6 text-sm font-semibold text-ink/60 dark:text-bone/60">
          Signed in as <span className="font-extrabold text-ink dark:text-bone">{session.user.email}</span> — edits
          go live instantly on the site.
        </p>

        <div className="mb-8 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-full border-2 px-4 py-2 text-sm font-extrabold transition-colors ${
                tab === t.id
                  ? 'border-ink bg-sun text-ink dark:border-bone'
                  : 'border-ink/15 bg-white text-ink/60 hover:text-ink dark:border-nightline dark:bg-nightcard dark:text-bone/60 dark:hover:text-bone'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'profile' && <ProfileForm />}
        {tab === 'projects' && (
          <ListEditor table="projects" fields={fieldDefs.projects} title="Projects" hint="Add a cover image to replace the emoji tile on your site. The 🎯 highlighted ones show as featured." />
        )}
        {tab === 'experience' && <ListEditor table="experience" fields={fieldDefs.experience} title="Experience" hint="Newest first — use ▲ ▼ to order." />}
        {tab === 'skills' && (
          <>
            <SkillsSettingsForm />
            <div className="mt-10">
              <ListEditor
                table="skills"
                fields={fieldDefs.skills}
                title="Skill list"
                hint="Each row is one skill. Skills with the same Group name show together in one card — use ▲ ▼ to reorder, and set the level as a percentage. Group emoji + name appear as the card header."
              />
            </div>
          </>
        )}
        {tab === 'certifications' && (
          <ListEditor
            table="certifications"
            fields={fieldDefs.certifications}
            title="Certifications"
            hint="Add your certifications, degrees, and licenses. Upload a badge or certificate image (4:3 recommended) and provide verification links."
          />
        )}
        {tab === 'gallery' && <ListEditor table="gallery" fields={fieldDefs.gallery} title="Gallery" hint="Upload photos — they go to your public 'photos' storage bucket." />}
        {tab === 'testimonials' && <ListEditor table="testimonials" fields={fieldDefs.testimonials} title="Testimonials" hint="Quotes shown in the testimonials section." />}
        {tab === 'socials' && <ListEditor table="socials" fields={fieldDefs.socials} title="Socials" hint="Supported labels: GitHub, LinkedIn, Twitter, Dribbble, Facebook, Instagram, WhatsApp." />}
        {tab === 'music' && (
          <>
            <MusicSettingsForm />
            <div className="mt-10">
              <ListEditor table="music_tracks" fields={fieldDefs.musicTracks} title="Playlist" hint="Upload or drag & drop an audio file to make a track playable. Add a square cover image to show on the player. Optional trim start/end (seconds) to play only a part of the song." />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
