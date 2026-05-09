'use client'

import { useState } from 'react'
import type { RecipeCard } from '@/types'
import { copyCardText, priorityColor, priorityBg } from '@/lib/data'
import {
  ChevronLeft, CheckSquare, FlaskConical, Sprout,
  AlertTriangle, SplitSquareHorizontal, MapPin,
  Share2, Printer, Copy, Check, ChevronDown, ChevronUp
} from 'lucide-react'

interface Props {
  card: RecipeCard
  phaseLabel: string
  contextLabel: string
  onBack: () => void
  onReset: () => void
}

function Section({
  icon, title, children, defaultOpen = true, accent
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  accent?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      marginBottom: 10,
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          gap: 10, padding: '14px 16px',
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ color: accent ?? 'var(--lime)', flexShrink: 0 }}>{icon}</span>
        <span style={{
          flex: 1, fontFamily: 'var(--font-body)', fontWeight: 600,
          fontSize: 13, color: 'var(--cream)', letterSpacing: '0.01em',
          textTransform: 'uppercase',
        }}>
          {title}
        </span>
        <span style={{ color: 'rgba(247,243,234,0.35)', flexShrink: 0 }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function RecipeCardView({ card, phaseLabel, contextLabel, onBack, onReset }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyCardText(card))
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handlePrint = () => window.print()

  const handleShare = async () => {
    const text = copyCardText(card)
    if (navigator.share) {
      await navigator.share({ title: 'Resep Cabai', text })
    } else {
      await handleCopy()
    }
  }

  const pColor = priorityColor(card.priority)
  const pBg    = priorityBg(card.priority)

  return (
    <div className="anim-fade-in print-card">
      {/* Back button */}
      <button
        onClick={onBack}
        className="no-print"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(247,243,234,0.45)', fontSize: 13,
          fontFamily: 'var(--font-body)', padding: 0,
          marginBottom: 18, transition: 'color 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--cream)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(247,243,234,0.45)')}
      >
        <ChevronLeft size={16} /> Pilih konteks lain
      </button>

      {/* Card header */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 18px 16px',
        marginBottom: 10,
      }}>
        {/* breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--lime)', background: 'rgba(168,224,99,0.12)',
            padding: '2px 8px', borderRadius: 10, letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>{phaseLabel}</span>
          <span style={{ color: 'rgba(247,243,234,0.25)', fontSize: 12 }}>×</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'rgba(247,243,234,0.6)', background: 'rgba(255,255,255,0.07)',
            padding: '2px 8px', borderRadius: 10, letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>{contextLabel}</span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 900,
          color: 'var(--cream)', lineHeight: 1.2, marginBottom: 10,
        }}>
          {card.phase}<br />
          <span style={{ color: 'rgba(247,243,234,0.55)', fontWeight: 700, fontSize: 18 }}>
            {card.context}
          </span>
        </h2>

        {/* Priority + ID row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            background: pBg, border: `1px solid ${pColor}`,
            color: pColor, fontSize: 11, fontWeight: 700,
            fontFamily: 'var(--font-mono)', padding: '3px 10px',
            borderRadius: 10, letterSpacing: '0.05em',
          }}>
            {card.priority} — {card.priority_label}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'rgba(247,243,234,0.3)', letterSpacing: '0.04em',
          }}>
            #{card.id}
          </span>
        </div>

        {/* See also */}
        {card.see_also && (
          <div style={{
            marginTop: 12, padding: '8px 12px',
            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)',
            borderRadius: 8, fontSize: 12, color: 'rgba(147,197,253,0.9)',
            fontFamily: 'var(--font-body)',
          }}>
            📋 {card.see_also}
          </div>
        )}
      </div>

      {/* TINDAKAN */}
      {card.actions.length > 0 && (
        <Section icon={<CheckSquare size={16} />} title="Tindakan Hari Ini">
          <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 14 }}>
            {card.actions.map((a, i) => (
              <li key={i} className={`anim-slide-up anim-delay-${Math.min(i+1,5)}`}
                style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(168,224,99,0.15)', border: '1px solid rgba(168,224,99,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--lime)',
                  fontWeight: 700, marginTop: 1,
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--cream)', fontFamily: 'var(--font-body)' }}>
                  {a}
                </span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* PUPUK */}
      {card.fertilizer.items.length > 0 && (
        <Section icon={<Sprout size={16} />} title="Resep Pupuk" accent="rgba(168,224,99,0.8)">
          <div style={{ paddingTop: 14 }}>
            <div style={{
              background: 'rgba(168,224,99,0.05)',
              border: '1px solid rgba(168,224,99,0.15)',
              borderRadius: 10, overflow: 'hidden', marginBottom: 10,
            }}>
              {card.fertilizer.items.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  padding: '10px 14px', gap: 12,
                  borderBottom: i < card.fertilizer.items.length - 1
                    ? '1px solid rgba(168,224,99,0.1)' : 'none',
                }}>
                  <span style={{ fontSize: 13, color: 'rgba(247,243,234,0.7)', fontFamily: 'var(--font-body)', lineHeight: 1.4 }}>
                    {item.bahan}
                  </span>
                  <span style={{
                    fontSize: 13, fontWeight: 600, color: 'var(--lime)',
                    fontFamily: 'var(--font-mono)', textAlign: 'right', flexShrink: 0,
                    maxWidth: '55%', lineHeight: 1.4,
                  }}>
                    {item.dosis}
                  </span>
                </div>
              ))}
            </div>
            {card.fertilizer.notes && (
              <p style={{ fontSize: 13, color: 'rgba(247,243,234,0.55)', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
                📌 {card.fertilizer.notes}
              </p>
            )}
          </div>
        </Section>
      )}

      {/* PESTISIDA */}
      {card.pesticide.steps.length > 0 && (
        <Section icon={<FlaskConical size={16} />} title="Pestisida W-A-L-E" accent="rgba(147,197,253,0.8)">
          <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {card.pesticide.steps.map((step, i) => (
              <div key={i} style={{
                background: 'rgba(59,130,246,0.06)',
                border: '1px solid rgba(59,130,246,0.15)',
                borderRadius: 10, padding: '10px 14px',
              }}>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'rgba(147,197,253,0.7)', letterSpacing: '0.05em', marginBottom: 4, textTransform: 'uppercase' }}>
                  {step.langkah}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--cream)', fontFamily: 'var(--font-body)' }}>
                  {step.detail}
                </div>
              </div>
            ))}
            {card.pesticide.notes && (
              <div style={{
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: 10, padding: '10px 14px',
                fontSize: 13, color: 'rgba(147,197,253,0.85)', lineHeight: 1.6,
                fontFamily: 'var(--font-body)',
              }}>
                📋 {card.pesticide.notes}
              </div>
            )}
          </div>
        </Section>
      )}

      {/* PERINGATAN */}
      {card.warnings.length > 0 && (
        <Section
          icon={<AlertTriangle size={16} />}
          title="Peringatan"
          accent="rgba(245,166,35,0.9)"
        >
          <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {card.warnings.map((w, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                background: 'rgba(245,166,35,0.07)',
                border: '1px solid rgba(245,166,35,0.2)',
                borderRadius: 10, padding: '10px 14px',
              }}>
                <AlertTriangle size={14} style={{ color: 'var(--amber)', flexShrink: 0, marginTop: 3 }} />
                <span style={{ fontSize: 13, lineHeight: 1.55, color: 'rgba(247,243,234,0.85)', fontFamily: 'var(--font-body)' }}>
                  {w}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* DIFERENSIASI */}
      {card.differential.length > 0 && (
        <Section
          icon={<SplitSquareHorizontal size={16} />}
          title="Diferensiasi Diagnosis"
          defaultOpen={false}
          accent="rgba(192,132,252,0.8)"
        >
          <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {card.differential.map((d, i) => (
              <div key={i} style={{
                background: 'rgba(192,132,252,0.05)',
                border: '1px solid rgba(192,132,252,0.15)',
                borderRadius: 10, padding: '10px 14px',
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(216,180,254,0.8)', fontFamily: 'var(--font-body)', marginBottom: 4 }}>
                  {d.label}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.55, color: 'rgba(247,243,234,0.75)', fontFamily: 'var(--font-body)' }}>
                  {d.penjelasan}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* CATATAN LOKAL */}
      {card.local_notes.length > 0 && (
        <Section
          icon={<MapPin size={16} />}
          title="Catatan Lokal Kalbar"
          defaultOpen={false}
          accent="rgba(52,211,153,0.8)"
        >
          <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {card.local_notes.map((n, i) => (
              <div key={i} style={{
                background: 'rgba(52,211,153,0.05)',
                border: '1px solid rgba(52,211,153,0.15)',
                borderRadius: 10, padding: '10px 14px',
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(110,231,183,0.8)', fontFamily: 'var(--font-body)', marginBottom: 4 }}>
                  📍 {n.label}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.55, color: 'rgba(247,243,234,0.75)', fontFamily: 'var(--font-body)' }}>
                  {n.catatan}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Action buttons */}
      <div className="no-print" style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8, marginTop: 16, marginBottom: 8,
      }}>
        <button
          onClick={handleShare}
          style={actionBtnStyle('var(--lime)', 'var(--ink)')}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <Share2 size={15} />
          <span>Bagikan</span>
        </button>
        <button
          onClick={handleCopy}
          style={actionBtnStyle('rgba(168,224,99,0.15)', 'var(--lime)', '1px solid rgba(168,224,99,0.35)')}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,224,99,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(168,224,99,0.15)'}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          <span>{copied ? 'Tersalin!' : 'Salin'}</span>
        </button>
        <button
          onClick={handlePrint}
          style={actionBtnStyle('rgba(255,255,255,0.07)', 'rgba(247,243,234,0.7)', '1px solid rgba(255,255,255,0.1)')}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
        >
          <Printer size={15} />
          <span>Cetak</span>
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="no-print"
        style={{
          width: '100%', padding: '12px',
          background: 'none', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 'var(--radius-md)', cursor: 'pointer',
          color: 'rgba(247,243,234,0.4)', fontSize: 13,
          fontFamily: 'var(--font-body)', transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(247,243,234,0.7)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(247,243,234,0.4)' }}
      >
        ↺ Mulai dari awal
      </button>
    </div>
  )
}

function actionBtnStyle(bg: string, color: string, border?: string): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '12px 8px', borderRadius: 'var(--radius-md)',
    background: bg, color, border: border ?? 'none',
    fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)',
    cursor: 'pointer', transition: 'all 0.15s',
  }
}
