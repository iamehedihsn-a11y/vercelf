import { useState, useEffect } from 'react'
import { Award, ExternalLink, X, ZoomIn, CheckCircle2 } from 'lucide-react'
import { useContent } from '../lib/useContent'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const ACCENT_COLORS = [
  'bg-punch/10 text-punch border-punch/30',
  'bg-ocean/10 text-ocean border-ocean/30',
  'bg-sun/20 text-ink border-sun/50 dark:text-sun',
  'bg-mint/10 text-mint border-mint/30',
  'bg-grape/10 text-grape border-grape/30',
]

export default function Certifications() {
  const { certifications } = useContent()
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedImage(null)
    }
    if (selectedImage) {
      window.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [selectedImage])

  if (!certifications || certifications.length === 0) return null

  return (
    <section id="certifications" className="relative scroll-mt-24 py-24 bg-cream/50 dark:bg-night/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          kicker="Credentials"
          title={
            <>
              Certificates & <span className="text-punch">achievements</span>
            </>
          }
        />

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, i) => {
            const hasImage = Boolean(cert.imageUrl)
            const accentClass = ACCENT_COLORS[i % ACCENT_COLORS.length]

            return (
              <Reveal key={cert.title + i} delay={(i % 3) * 100} className="flex">
                <article className="sticker group flex w-full flex-col justify-between rounded-[2rem] bg-white p-6 sm:p-7 dark:bg-nightcard">
                  <div>
                    {/* Visual Media Header */}
                    {hasImage ? (
                      <div
                        className="relative mb-5 aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl border-3 border-ink bg-ink/5 dark:border-nightline"
                        onClick={() => setSelectedImage({ url: cert.imageUrl, title: cert.title })}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedImage({ url: cert.imageUrl, title: cert.title })
                          }
                        }}
                        aria-label={`View certificate for ${cert.title}`}
                      >
                        <img
                          src={cert.imageUrl}
                          alt={cert.title}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="absolute bottom-2.5 right-2.5 flex size-8 items-center justify-center rounded-lg bg-ink/75 text-cream backdrop-blur-sm transition-opacity group-hover:opacity-100 sm:opacity-0">
                          <ZoomIn className="size-4" />
                        </span>
                      </div>
                    ) : (
                      <div className="mb-5 flex aspect-[16/9] w-full items-center justify-center rounded-2xl border-3 border-ink bg-gradient-to-br from-sun/20 via-punch/10 to-grape/20 text-6xl shadow-inner dark:border-nightline">
                        <span className="transition-transform duration-300 group-hover:scale-110">
                          {cert.emoji || '📜'}
                        </span>
                      </div>
                    )}

                    {/* Meta info bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-extrabold">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-bold ${accentClass}`}>
                        <Award className="size-3.5" />
                        {cert.issuer || 'Certification'}
                      </span>
                      {cert.issueDate && (
                        <span className="rounded-full border-2 border-ink/15 bg-cream px-2.5 py-0.5 font-bold text-ink/70 dark:border-nightline dark:bg-night dark:text-bone/70">
                          {cert.issueDate}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="mt-3 font-display text-xl font-extrabold leading-snug tracking-tight sm:text-2xl">
                      {cert.title}
                    </h3>

                    {/* Credential ID chip */}
                    {cert.credentialId && (
                      <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-ink/5 px-2 py-0.5 font-mono text-[11px] font-semibold text-ink/60 dark:bg-bone/10 dark:text-bone/60">
                        <span>ID:</span>
                        <span>{cert.credentialId}</span>
                      </div>
                    )}

                    {/* Description */}
                    {cert.description && (
                      <p className="mt-3 text-sm leading-relaxed text-ink/75 dark:text-bone/75">
                        {cert.description}
                      </p>
                    )}

                    {/* Skill Tags */}
                    {Array.isArray(cert.skills) && cert.skills.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {cert.skills.map((skill) => (
                          <li
                            key={skill}
                            className="inline-flex items-center gap-1 rounded-lg border border-ink/10 bg-cream px-2 py-0.5 text-xs font-bold text-ink/80 dark:border-nightline dark:bg-night dark:text-bone/80"
                          >
                            <CheckCircle2 className="size-3 text-mint" />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Actions / Verification Link */}
                  {cert.credentialUrl && (
                    <div className="mt-6 pt-4 border-t-2 border-ink/10 dark:border-nightline">
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="sticker inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sun px-4 py-2.5 text-sm font-extrabold text-ink transition-transform hover:-rotate-1"
                      >
                        Verify Credential
                        <ExternalLink className="size-4" />
                      </a>
                    </div>
                  )}
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl border-3 border-ink bg-white p-3 shadow-2xl dark:border-nightline dark:bg-nightcard"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 px-2">
              <h4 className="font-display font-extrabold text-lg truncate pr-4">
                {selectedImage.title}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="sticker flex size-9 items-center justify-center rounded-xl bg-white hover:bg-punch/10 dark:bg-nightcard"
                aria-label="Close dialog"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="overflow-hidden rounded-2xl border-2 border-ink/20 dark:border-nightline">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-h-[75vh] w-auto object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
