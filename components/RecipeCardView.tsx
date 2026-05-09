'use client'

import { useState } from 'react'
import type { RecipeCard } from '@/types'
import { copyCardText, priorityColor } from '@/lib/data'
import { ChevronLeft, Share2, Printer, Copy, Check } from 'lucide-react'

interface Props {
  card: RecipeCard
  phaseLabel: string
  contextLabel: string
  onBack: () => void
  onReset: () => void
}

const S = {
  rust:   '#a83228',
  forest: '#1f5132',
  sky:    '#1d4a8c',
  amber:  '#c87b00',
  plum:   '#6c2d7a',
}

function SectionA({
  stripe, num, title, badge, children,
}: {
  stripe: string
  num: string
  title: string
  badge?: string
  children: React.ReactNode
}) {
  return (
    <section style={{
      display: 'grid', gridTemplateColumns: '6px 1fr',
      borderBottom: '1px solid var(--rule)',
    }}>
      <div style={{ background: stripe }} />
      <div style={{ padding: '16px 16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: stripe, fontWeight: 700,
          }}>{num}</span>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 17, color: 'var(--ink)', letterSpacing: '-0.01em', flex: 1,
          }}>{title}</h2>
          {badge && (
            <span style={{
              fontSize: 10, fontFamily: 'var(--font-mono)',
              background: stripe, color: '#fff',
              padding: '2px 7px', borderRadius: 3,
              letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600,
            }}>{badge}</span>
          )}
        </div>
        {children}
      </div>
    </section>
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

  return (
    <div className="anim-fade-in print-card" style={{ margin: '0 -20px' }}>

      {/* Sticky card header */}
      <header style={{
        position: 'sticky', top: 57, zIndex: 5,
        background: 'var(--paper)',
        borderBottom: '1px solid var(--rule)',
        padding: '12px 16px 10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <button
            onClick={onBack}
            className="no-print"
            style={{
              border: 'none', background: 'none', color: 'var(--ink-soft)',
              fontSize: 22, padding: '0 4px 0 0', lineHeight: 1, cursor: 'pointer',
              display: 'flex', alignItems: 'center',
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--ink-faint)', letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            {phaseLabel} · #{card.id}
          </span>
          <span style={{ flex: 1 }} />
          <span style={{
            background: pColor, color: '#fff',
            fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700,
            padding: '3px 8px', borderRadius: 3, letterSpacing: '0.08em',
          }}>{card.priority}</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900,
          fontSize: 21, lineHeight: 1.1, color: 'var(--ink)', letterSpacing: '-0.01em',
        }}>
          {card.phase}
        </h1>
        <div style={{ marginTop: 4, fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.3 }}>
          dengan <strong style={{ color: 'var(--ink)' }}>{card.context.toLowerCase()}</strong>
        </div>
      </header>

      {/* Priority strip */}
      <div style={{
        background: 'var(--rust-bg)', color: 'var(--rust)',
        padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8,
        borderBottom: '1px solid var(--rule)',
        fontSize: 12, fontWeight: 600,
      }}>
        <span>⚠ Prioritas {card.priority_label}</span>
        {card.see_also && (
          <span style={{
            marginLeft: 'auto', fontSize: 11,
            color: S.sky, fontStyle: 'italic', fontWeight: 400,
          }}>
            {card.see_also}
          </span>
        )}
      </div>

      {/* Sections */}
      <div style={{ paddingBottom: 16 }}>

        {card.actions.length > 0 && (
          <SectionA stripe={S.rust} num="01" title="Tindakan Hari Ini" badge={`${card.actions.length} langkah`}>
            <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {card.actions.map((a, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: 'var(--ink)', color: 'var(--paper)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 15, lineHeight: 1.45, color: 'var(--ink)', paddingTop: 4 }}>{a}</span>
                </li>
              ))}
            </ol>
          </SectionA>
        )}

        {card.fertilizer.items.length > 0 && (
          <SectionA stripe={S.forest} num="02" title="Resep Pupuk">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, marginBottom: card.fertilizer.notes ? 12 : 0 }}>
              <tbody>
                {card.fertilizer.items.map((it, i) => (
                  <tr key={i} style={{ borderBottom: '1px dashed var(--rule)' }}>
                    <td style={{ padding: '10px 0', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{it.bahan}</div>
                    </td>
                    <td style={{
                      padding: '10px 0 10px 12px', textAlign: 'right', verticalAlign: 'top',
                      fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
                      color: S.forest, whiteSpace: 'nowrap',
                    }}>{it.dosis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {card.fertilizer.notes && (
              <div style={{
                background: 'var(--paper-alt)', padding: '10px 12px', borderRadius: 6,
                fontSize: 13, lineHeight: 1.5, color: 'var(--ink-soft)',
              }}>
                <strong style={{ color: 'var(--ink)' }}>Catatan.</strong> {card.fertilizer.notes}
              </div>
            )}
          </SectionA>
        )}

        {card.pesticide.steps.length > 0 && (
          <SectionA stripe={S.sky} num="03" title="Pestisida W-A-L-E">
            {card.pesticide.steps.map((s, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '32px 1fr',
                gap: 12, padding: '10px 0',
                borderBottom: i < card.pesticide.steps.length - 1 ? '1px solid var(--rule)' : 'none',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: S.sky, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700,
                }}>{s.langkah.charAt(0)}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{s.langkah}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 2 }}>{s.detail}</div>
                </div>
              </div>
            ))}
            {card.pesticide.notes && (
              <div style={{
                marginTop: 12, padding: '10px 12px',
                background: 'var(--sky-bg)', borderRadius: 6,
                fontSize: 12, lineHeight: 1.5, color: S.sky,
              }}>
                {card.pesticide.notes}
              </div>
            )}
          </SectionA>
        )}

        {card.warnings.length > 0 && (
          <SectionA stripe={S.amber} num="04" title="Peringatan">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {card.warnings.map((w, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, padding: '8px 12px',
                  background: 'var(--amber-bg)', borderRadius: 6,
                  fontSize: 13, lineHeight: 1.45, color: '#5d3700',
                  borderLeft: `3px solid ${S.amber}`,
                }}>
                  <span style={{ flexShrink: 0, color: S.amber, fontWeight: 700 }}>⚠</span>
                  <span>{w}</span>
                </div>
              ))}
            </div>
          </SectionA>
        )}

        {card.differential.length > 0 && (
          <SectionA stripe={S.plum} num="05" title="Diferensiasi Diagnosis">
            {card.differential.map((d, i) => (
              <div key={i} style={{
                padding: '10px 0',
                borderBottom: i < card.differential.length - 1 ? '1px dashed var(--rule)' : 'none',
              }}>
                <div style={{
                  fontSize: 13, fontWeight: 700, color: S.plum,
                  fontStyle: 'italic', fontFamily: 'var(--font-display)',
                }}>{d.label}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, marginTop: 4 }}>{d.penjelasan}</div>
              </div>
            ))}
          </SectionA>
        )}

        {card.local_notes.length > 0 && (
          <SectionA stripe={S.forest} num="06" title="Catatan Kalbar">
            {card.local_notes.map((n, i) => (
              <div key={i} style={{
                padding: '8px 0',
                borderBottom: i < card.local_notes.length - 1 ? '1px dashed var(--rule)' : 'none',
              }}>
                <div style={{
                  fontSize: 12, fontFamily: 'var(--font-mono)',
                  color: S.forest, letterSpacing: '0.04em',
                  textTransform: 'uppercase', marginBottom: 3,
                }}>📍 {n.label}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5 }}>{n.catatan}</div>
              </div>
            ))}
          </SectionA>
        )}
      </div>

      {/* Sticky bottom action bar */}
      <div
        className="no-print"
        style={{
          position: 'sticky', bottom: 0,
          background: 'var(--paper)', borderTop: '1px solid var(--rule)',
          padding: '10px 16px',
          display: 'flex', gap: 8,
        }}
      >
        <button
          onClick={handleShare}
          style={{
            flex: 1, background: 'var(--ink)', color: 'var(--paper)',
            border: 'none', borderRadius: 8, padding: '12px',
            fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-body)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <Share2 size={15} /> Bagikan
        </button>
        <button
          onClick={handleCopy}
          style={{
            background: 'transparent', color: 'var(--ink)',
            border: '1px solid var(--rule)', borderRadius: 8,
            padding: '12px 16px', fontSize: 14, fontWeight: 600,
            fontFamily: 'var(--font-body)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--paper-alt)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? 'Tersalin!' : 'Salin'}
        </button>
        <button
          onClick={handlePrint}
          style={{
            background: 'transparent', color: 'var(--ink)',
            border: '1px solid var(--rule)', borderRadius: 8,
            padding: '12px 14px', fontSize: 14,
            fontFamily: 'var(--font-body)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--paper-alt)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <Printer size={15} />
        </button>
      </div>

      {/* Reset */}
      <div className="no-print" style={{ padding: '12px 16px 24px', background: 'var(--paper)' }}>
        <button
          onClick={onReset}
          style={{
            width: '100%', padding: '12px',
            background: 'none', border: '1px solid var(--rule)',
            borderRadius: 'var(--radius-md)', cursor: 'pointer',
            color: 'var(--ink-faint)', fontSize: 13,
            fontFamily: 'var(--font-body)', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink-soft)'; e.currentTarget.style.color = 'var(--ink-soft)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--rule)'; e.currentTarget.style.color = 'var(--ink-faint)' }}
        >
          ↺ Mulai dari awal
        </button>
      </div>
    </div>
  )
}
