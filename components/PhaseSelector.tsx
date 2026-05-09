'use client'

import type { PhaseInfo } from '@/types'
import { Sprout, Flower2, ShoppingBasket, TrendingDown, Leaf } from 'lucide-react'

const ICONS: Record<string, React.ReactNode> = {
  'seeding':         <Sprout size={26} />,
  'plant-2':         <Sprout size={26} />,
  'flower':          <Flower2 size={26} />,
  'basket':          <ShoppingBasket size={26} />,
  'trending-down':   <TrendingDown size={26} />,
  'leaf-off':        <Leaf size={26} />,
}

const PHASE_DAYS: Record<string, string> = {
  'vegetatif':           '0–30 HST',
  'pra-pembungaan':      '30–60 HST',
  'generatif':           '60–90 HST',
  'panen-pertama':       '~75 HST+',
  'pasca-panen-pertama': 'Setelah panen 1',
  'akhir-musim':         'Menjelang selesai',
}

interface Props {
  phases: PhaseInfo[]
  onSelect: (slug: string) => void
}

export default function PhaseSelector({ phases, onSelect }: Props) {
  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(31,81,50,0.08)', border: '1px solid rgba(31,81,50,0.2)',
          borderRadius: 20, padding: '4px 14px', marginBottom: 16,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--forest)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--forest)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Langkah 1 dari 2
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, color: 'var(--ink)', lineHeight: 1.2 }}>
          Fase tanaman<br />saat ini?
        </h2>
        <p style={{ marginTop: 8, fontSize: 14, color: 'var(--ink-soft)', fontFamily: 'var(--font-body)' }}>
          Pilih berdasarkan umur atau kondisi tanaman
        </p>
      </div>

      {/* Phase grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {phases.map((ph, idx) => {
          const isMain = ph.slug === 'pasca-panen-pertama'
          return (
            <button
              key={ph.slug}
              onClick={() => onSelect(ph.slug)}
              className={`anim-slide-up anim-delay-${Math.min(idx + 1, 5)}`}
              style={{
                gridColumn: isMain ? '1 / -1' : undefined,
                background: isMain ? 'rgba(31,81,50,0.07)' : 'var(--paper-alt)',
                border: isMain ? '1.5px solid rgba(31,81,50,0.35)' : '1px solid var(--rule)',
                borderRadius: 'var(--radius-lg)',
                padding: isMain ? '18px 20px' : '16px 14px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: isMain ? 'center' : 'flex-start',
                gap: 14,
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isMain ? 'rgba(31,81,50,0.13)' : '#e3d9c4'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isMain ? 'rgba(31,81,50,0.07)' : 'var(--paper-alt)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ color: 'var(--forest)', flexShrink: 0, marginTop: isMain ? 0 : 2 }}>
                {ICONS[ph.icon] ?? <Sprout size={24} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: isMain ? 15 : 14,
                  fontWeight: 600,
                  color: 'var(--ink)',
                  lineHeight: 1.3,
                  fontFamily: 'var(--font-body)',
                }}>
                  {ph.label.split('(')[0].trim()}
                </div>
                <div style={{
                  fontSize: 11,
                  color: 'var(--ink-faint)',
                  marginTop: 3,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.03em',
                }}>
                  {PHASE_DAYS[ph.slug] ?? ''}
                </div>
              </div>
              {isMain && (
                <div style={{
                  background: 'var(--forest)', color: '#fff',
                  fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)',
                  padding: '3px 9px', borderRadius: 10, flexShrink: 0,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                }}>
                  UTAMA
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
