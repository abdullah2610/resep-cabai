'use client'

import type { PhaseInfo } from '@/types'
import {
  Sprout, Flower2, ShoppingBasket,
  TrendingDown, Leaf, Loader2
} from 'lucide-react'

const ICONS: Record<string, React.ReactNode> = {
  'seeding':         <Sprout size={28} />,
  'plant-2':         <Sprout size={28} />,
  'flower':          <Flower2 size={28} />,
  'basket':          <ShoppingBasket size={28} />,
  'trending-down':   <TrendingDown size={28} />,
  'leaf-off':        <Leaf size={28} />,
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
  loading?: boolean
}

export default function PhaseSelector({ phases, onSelect, loading }: Props) {
  return (
    <div style={{ padding: '0 0 32px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28, textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(168,224,99,0.1)', border: '1px solid rgba(168,224,99,0.25)',
          borderRadius: 20, padding: '4px 14px', marginBottom: 16,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--lime)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--lime)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Langkah 1 dari 2
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, color: 'var(--cream)', lineHeight: 1.2 }}>
          Fase tanaman<br />saat ini?
        </h2>
        <p style={{ marginTop: 8, fontSize: 14, color: 'rgba(247,243,234,0.5)', fontFamily: 'var(--font-body)' }}>
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
              disabled={loading}
              className={`anim-slide-up anim-delay-${Math.min(idx + 1, 5)}`}
              style={{
                gridColumn: isMain ? '1 / -1' : undefined,
                background: isMain
                  ? 'linear-gradient(135deg, rgba(168,224,99,0.18) 0%, rgba(168,224,99,0.06) 100%)'
                  : 'rgba(255,255,255,0.04)',
                border: isMain
                  ? '1.5px solid rgba(168,224,99,0.45)'
                  : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-lg)',
                padding: isMain ? '18px 20px' : '16px 14px',
                cursor: loading ? 'wait' : 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: isMain ? 'center' : 'flex-start',
                gap: 14,
                transition: 'all 0.18s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.background = isMain
                  ? 'linear-gradient(135deg, rgba(168,224,99,0.28) 0%, rgba(168,224,99,0.12) 100%)'
                  : 'rgba(255,255,255,0.08)'
                el.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.background = isMain
                  ? 'linear-gradient(135deg, rgba(168,224,99,0.18) 0%, rgba(168,224,99,0.06) 100%)'
                  : 'rgba(255,255,255,0.04)'
                el.style.transform = 'translateY(0)'
              }}
            >
              {/* Icon */}
              <div style={{
                color: isMain ? 'var(--lime)' : 'rgba(168,224,99,0.6)',
                flexShrink: 0,
                marginTop: isMain ? 0 : 2,
              }}>
                {ICONS[ph.icon] ?? <Sprout size={24} />}
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: isMain ? 15 : 14,
                  fontWeight: 600,
                  color: isMain ? 'var(--lime)' : 'var(--cream)',
                  lineHeight: 1.3,
                  fontFamily: 'var(--font-body)',
                }}>
                  {ph.label.split('(')[0].trim()}
                </div>
                <div style={{
                  fontSize: 11,
                  color: isMain ? 'rgba(168,224,99,0.7)' : 'rgba(247,243,234,0.4)',
                  marginTop: 3,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.03em',
                }}>
                  {PHASE_DAYS[ph.slug] ?? ''}
                </div>
              </div>

              {/* Badge for main card */}
              {isMain && (
                <div style={{
                  background: 'var(--lime)', color: 'var(--ink)',
                  fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)',
                  padding: '3px 9px', borderRadius: 10, flexShrink: 0,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                }}>
                  UTAMA
                </div>
              )}

              {loading && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-lg)' }}>
                  <Loader2 size={20} style={{ color: 'var(--lime)', animation: 'spin 1s linear infinite' }} />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
