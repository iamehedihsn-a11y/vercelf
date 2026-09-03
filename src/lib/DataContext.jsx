import { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabase'
import { DataContext } from './useContent'
import content from '../data/content'

function mapProfile(row, local) {
  return {
    ...local,
    ...(row
      ? {
          name: row.name || local.name,
          firstName: row.first_name || local.firstName,
          role: row.role || local.role,
          tagline: row.tagline || local.tagline,
          bio: row.bio || local.bio,
          location: row.location || local.location,
          email: row.email || local.email,
          resumeUrl: row.resume_url || local.resumeUrl,
          avatarEmoji: row.avatar_emoji || local.avatarEmoji,
          // Admin-managed SEO fields (empty → runtime defaults from src/config/seo.js)
          seoTitle: row.seo_title || '',
          metaDescription: row.meta_description || '',
          ogImage: row.og_image || '',
        }
      : {}),
  }
}

function mapRows(rows, keys, fallback) {
  // Only fall back when the query failed (null/undefined).
  // An empty array from a healthy database is respected — deletions stick.
  if (!Array.isArray(rows)) return fallback
  return rows.map((row) => {
    const out = {}
    for (const [dbKey, outKey] of keys) out[outKey] = row[dbKey]
    return out
  })
}

function mapSkills(rows, settings, fallback) {
  // Group flat skill rows by group_title, preserving row order
  if (!Array.isArray(rows)) return fallback
  const groups = []
  const seen = new Map()
  for (const row of rows) {
    const title = row.group_title || 'Skills'
    if (!seen.has(title)) {
      const group = { title, emoji: row.group_emoji || '⭐', items: [] }
      seen.set(title, group)
      groups.push(group)
    }
    seen.get(title).items.push({
      name: row.name ?? '',
      level: Math.min(100, Math.max(0, Number(row.level) || 0)),
    })
  }
  // Respect an admin-cleared marquee; only fall back when the settings row is missing
  const marquee = settings
    ? (settings.marquee ?? '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    : fallback.marquee
  return { groups, marquee }
}

export function DataProvider({ children }) {
  const [data, setData] = useState(() => ({
    profile: mapProfile(null, content.profile),
    socials: content.profile.socials,
    skills: content.skills,
    certifications: content.certifications,
    music: content.music,
    projects: content.projects,
    experience: content.experience,
    testimonials: content.testimonials,
    gallery: content.gallery,
  }))
  const [ready, setReady] = useState(false)
  const [realtime, setRealtime] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setReady(true)
      return
    }

    const load = async () => {
      try {
        const [
          prof,
          projects,
          experience,
          gallery,
          testimonials,
          socials,
          musicSettings,
          musicTracks,
          skillRows,
          skillSettings,
          certifications,
        ] = await Promise.all([
          supabase.from('profile').select('*').eq('id', 1).maybeSingle(),
          supabase.from('projects').select('*').order('sort_order'),
          supabase.from('experience').select('*').order('sort_order'),
          supabase.from('gallery').select('*').order('sort_order'),
          supabase.from('testimonials').select('*').order('sort_order'),
          supabase.from('socials').select('*').order('sort_order'),
          supabase.from('music_settings').select('*').eq('id', 1).maybeSingle(),
          supabase.from('music_tracks').select('*').order('sort_order'),
          supabase.from('skills').select('*').order('sort_order'),
          supabase.from('skills_settings').select('*').eq('id', 1).maybeSingle(),
          supabase.from('certifications').select('*').order('sort_order'),
        ])

        setData({
          profile: mapProfile(prof.data, content.profile),
          socials: mapRows(socials.data, [['label', 'label'], ['url', 'url']], content.profile.socials),
          skills: mapSkills(skillRows.data, skillSettings.data, content.skills),
          certifications: mapRows(
            certifications.data,
            [
              ['title', 'title'],
              ['issuer', 'issuer'],
              ['issue_date', 'issueDate'],
              ['credential_id', 'credentialId'],
              ['credential_url', 'credentialUrl'],
              ['image_url', 'imageUrl'],
              ['emoji', 'emoji'],
              ['skills', 'skills'],
              ['description', 'description'],
            ],
            content.certifications,
          ),
          music: {
            ...content.music,
            vibe: musicSettings.data?.vibe ?? content.music.vibe,
            spotifyEmbedUrl:
              musicSettings.data?.spotify_embed_url ?? content.music.spotifyEmbedUrl,
            playlist: mapRows(
              musicTracks.data,
              [
                ['title', 'title'], ['artist', 'artist'], ['duration', 'duration'],
                ['emoji', 'emoji'], ['audio_url', 'audioUrl'],
                ['audio_start', 'audioStart'], ['audio_end', 'audioEnd'],
                ['cover_url', 'coverUrl'],
              ],
              content.music.playlist,
            ),
          },
          projects: mapRows(
            projects.data,
            [
              ['title', 'title'], ['cover_url', 'coverUrl'], ['emoji', 'emoji'],
              ['description', 'description'], ['tags', 'tags'], ['accent', 'accent'],
              ['demo', 'demo'], ['repo', 'repo'], ['featured', 'featured'],
            ],
            content.projects,
          ),
          experience: mapRows(
            experience.data,
            [
              ['role', 'role'], ['company', 'company'], ['period', 'period'],
              ['emoji', 'emoji'], ['points', 'points'],
            ],
            content.experience,
          ),
          testimonials: mapRows(
            testimonials.data,
            [['quote', 'quote'], ['name', 'name'], ['role', 'role'], ['emoji', 'emoji']],
            content.testimonials,
          ),
          gallery: mapRows(
            gallery.data,
            [['src', 'src'], ['alt', 'alt'], ['caption', 'caption']],
            content.gallery,
          ),
        })
      } catch {
        setData({
          profile: mapProfile(null, content.profile),
          socials: content.profile.socials,
          skills: content.skills,
          certifications: content.certifications,
          music: content.music,
          projects: content.projects,
          experience: content.experience,
          testimonials: content.testimonials,
          gallery: content.gallery,
        })
      } finally {
        setReady(true)
      }
    }

    load()

    const channel = supabase
      .channel('portfolio-content')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => load())
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setRealtime(true)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const value = useMemo(() => ({ ...data, ready, realtime }), [data, ready, realtime])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
