'use client'

import { useState, useEffect, useCallback } from 'react'
import type { IndexData, RecipeCard, PhaseInfo } from '@/types'
import { loadIndex, loadPhaseCards } from '@/lib/data'
import PhaseSelector from '@/components/PhaseSelector'
import ContextSelector from '@/components/ContextSelector'
import RecipeCardView from '@/components/RecipeCardView'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { RefreshCw } from 'lucide-react'

type Screen = 'phase' | 'context' | 'card'

export default function Home() {
  const [index, setIndex]           = useState<IndexData | null>(null)
  const [screen, setScreen]         = useState<Screen>('phase')
  const [selectedPhase, setPhase]   = useState<string>('')
  const [selectedCtx, setCtx]       = useState<string>('')
  const [card, setCard]             = useState<RecipeCard | null>(null)
  const [loadingCard, setLoadingCard] = useState(false)
  const [error, setError]           = useState('')

  // Load index on mount
  useEffect(() => {
    loadIndex().then(setIndex).catch(() => setError('Gagal memuat data. Periksa koneksi internet.'))
  }, [])

  const handlePhaseSelect = useCallback(async (phaseSlug: string) => {
    setPhase(phaseSlug)
    setScreen('context')
  }, [])

  const handleContextSelect = useCallback(async (ctxSlug: string) => {
    if (!index) return
    setCtx(ctxSlug)
    setLoadingCard(true)
    setError('')
    try {
      const key    = `${selectedPhase}__${ctxSlug}`
      const cardId = index.lookup[key]
      if (!cardId) { setError('Resep untuk kombinasi ini belum tersedia.'); setLoadingCard(false); return }
      const cards = await loadPhaseCards(selectedPhase)
      const found = cards.find(c => c.id === cardId) ?? null
      setCard(found)
      setScreen('card')
    } catch {
      setError('Gagal memuat kartu resep.')
    } finally {
      setLoadingCard(false)
    }
  }, [index, selectedPhase])

  const handleReset = () => {
    setScreen('phase'); setPhase(''); setCtx(''); setCard(null); setError('')
  }

  const selectedPhaseInfo: PhaseInfo | undefined =
    index?.meta.phases.find(p => p.slug === selectedPhase)

  const selectedCtxInfo =
    index?.meta.contexts.find(c => c.slug === selectedCtx)

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--forest)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <header style={{
        padding: '16px 20px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900,
            color: 'var(--lime)', letterSpacing: '-0.01em', lineHeight: 1,
          }}>
            🌶 Resep Cabai
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'rgba(168,224,99,0.5)', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginTop: 3,
          }}>
            per Fase · POPT Kalbar
          </div>
        </div>

        {screen !== 'phase' && (
          <button
            onClick={handleReset}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20, padding: '6px 12px', cursor: 'pointer',
              color: 'rgba(247,243,234,0.55)', fontSize: 12,
              fontFamily: 'var(--font-body)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          >
            <RefreshCw size={12} /> Ulang
          </button>
        )}
      </header>

      {/* Horizontal rule */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '14px 0 0' }} />

      {/* BRMP Kalbar banner */}
      <div style={{
        padding: '6px 20px',
        background: 'rgba(52,211,153,0.06)',
        borderBottom: '1px solid rgba(52,211,153,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'rgba(110,231,183,0.65)', letterSpacing: '0.07em',
          textTransform: 'uppercase',
        }}>
          🏛 Balai Riset dan Modernisasi Pertanian Kalimantan Barat
        </span>
      </div>

      {/* Main content */}
      <main style={{
        flex: 1, padding: '20px 20px 24px',
        maxWidth: 520, width: '100%', margin: '0 auto',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)',
            borderRadius: 10, padding: '12px 14px', marginBottom: 16,
            fontSize: 13, color: '#fca5a5', fontFamily: 'var(--font-body)',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Loading index */}
        {!index && !error && <LoadingSkeleton />}

        {/* Loading card */}
        {loadingCard && <LoadingSkeleton />}

        {/* Screens */}
        {index && !loadingCard && (
          <>
            {screen === 'phase' && (
              <PhaseSelector
                phases={index.meta.phases}
                onSelect={handlePhaseSelect}
              />
            )}

            {screen === 'context' && selectedPhaseInfo && (
              <ContextSelector
                contexts={index.meta.contexts}
                selectedPhase={selectedPhaseInfo}
                onSelect={handleContextSelect}
                onBack={() => setScreen('phase')}
              />
            )}

            {screen === 'card' && card && (
              <RecipeCardView
                card={card}
                phaseLabel={selectedPhaseInfo?.label ?? selectedPhase}
                contextLabel={selectedCtxInfo?.label ?? selectedCtx}
                onBack={() => setScreen('context')}
                onReset={handleReset}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        padding: '12px 20px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'rgba(247,243,234,0.2)', letterSpacing: '0.05em',
        }}>
          v1.0 · {index?.meta.total_cards ?? '—'} kartu resep
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'rgba(247,243,234,0.2)', letterSpacing: '0.05em',
        }}>
          POPT · Kementan
        </span>
      </footer>
    </div>
  )
}
