'use client'

import type { ContextInfo, PhaseInfo } from '@/types'
import {
  ShieldCheck, CloudRain, Sun, Bug, CircleAlert,
  TrendingDown, ChevronLeft
} from 'lucide-react'

const ICONS: Record<string, React.ReactNode> = {
  'shield-check':           <ShieldCheck size={22} />,
  'cloud-rain':             <CloudRain size={22} />,
  'sun':                    <Sun size={22} />,
  'bug':                    <Bug size={22} />,
  'virus':                  <CircleAlert size={22} />,
  'chart-arrows-vertical':  <TrendingDown size={22} />,
}

const CTX_COLOR: Record<string, string> = {
  'preventif':          '#1f5132',
  'hujan-tinggi':       '#1d4a8c',
  'panas-kering':       '#c87b00',
  'ada-hama':           '#c87b00',
  'ada-penyakit':       '#a83228',
  'drop-produktivitas': '#a83228',
}

const CTX_BG: Record<string, string> = {
  'preventif':          'rgba(31,81,50,0.07)',
  'hujan-tinggi':       'rgba(29,74,140,0.07)',
  'panas-kering':       'rgba(200,123,0,0.07)',
  'ada-hama':           'rgba(200,123,0,0.07)',
  'ada-penyakit':       'rgba(168,50,40,0.07)',
  'drop-produktivitas': 'rgba(168,50,40,0.07)',
}

interface Props {
  contexts: ContextInfo[]
  selectedPhase: PhaseInfo
  onSelect: (slug: string) => void
  onBack: () => void
}

export default function ContextSelector({ contexts, selectedPhase, onSelect, onBack }: Props) {
  return (
    <div style={{ paddingBottom: 32 }}>
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--ink-soft)', fontSize: 13,
            fontFamily: 'var(--font-body)', padding: 0, marginBottom: 16,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-soft)')}
        >
          <ChevronLeft size={16} /> Kembali
        </button>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(31,81,50,0.08)', border: '1px solid rgba(31,81,50,0.2)',
          borderRadius: 20, padding: '5px 14px', marginBottom: 14,
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--forest)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {selectedPhase.label}
          </span>
        </div>

        <div style={{ marginBottom: 6 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(31,81,50,0.08)', border: '1px solid rgba(31,81,50,0.2)',
            borderRadius: 20, padding: '4px 14px', marginBottom: 14,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--forest)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--forest)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Langkah 2 dari 2
            </span>
          </div>
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, color: 'var(--ink)', lineHeight: 1.2 }}>
          Kondisi lapangan<br />saat ini?
        </h2>
        <p style={{ marginTop: 8, fontSize: 14, color: 'var(--ink-soft)' }}>
          Pilih yang paling sesuai dengan situasi lahan
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {contexts.map((ctx, idx) => {
          const iconColor = CTX_COLOR[ctx.slug] ?? 'var(--ink-soft)'
          const bgColor   = CTX_BG[ctx.slug] ?? 'var(--paper-alt)'
          return (
            <button
              key={ctx.slug}
              onClick={() => onSelect(ctx.slug)}
              className={`anim-slide-up anim-delay-${Math.min(idx + 1, 5)}`}
              style={{
                background: bgColor,
                border: `1px solid ${iconColor}28`,
                borderRadius: 'var(--radius-lg)',
                padding: '16px 14px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                transition: 'all 0.18s ease',
                minHeight: 90,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = bgColor.replace('0.07', '0.14')
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = bgColor
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ color: iconColor }}>
                {ICONS[ctx.icon] ?? <ShieldCheck size={22} />}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3, fontFamily: 'var(--font-body)' }}>
                {ctx.label}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
