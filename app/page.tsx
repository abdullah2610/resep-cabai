'use client'

import { useState, useEffect, useCallback } from 'react'
import type { IndexData, RecipeCard, PhaseInfo } from '@/types'
import { loadIndex, loadPhaseCards } from '@/lib/data'
import PhaseSelector from '@/components/PhaseSelector'
import ContextSelector from '@/components/ContextSelector'
import RecipeCardView from '@/components/RecipeCardView'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import FeedbackSection from '@/components/FeedbackSection'
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
      background: 'var(--paper)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <header style={{
        padding: '16px 20px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        background: 'var(--paper)',
        position: 'sticky', top: 0, zIndex: 20,
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 900,
            color: 'var(--forest)', letterSpacing: '-0.01em', lineHeight: 1,
          }}>
            🌶 Resep Cabai
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--ink-faint)', letterSpacing: '0.08em',
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
              background: 'var(--paper-alt)', border: '1px solid var(--rule)',
              borderRadius: 20, padding: '6px 12px', cursor: 'pointer',
              color: 'var(--ink-soft)', fontSize: 12,
              fontFamily: 'var(--font-body)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e0d5bc')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--paper-alt)')}
          >
            <RefreshCw size={12} /> Ulang
          </button>
        )}
      </header>

      {/* Horizontal rule */}
      <div style={{ height: 1, background: 'var(--rule)', margin: '14px 0 0' }} />

      {/* BRMP Kalbar banner */}
      <div style={{
        padding: '6px 20px',
        background: 'rgba(31,81,50,0.06)',
        borderBottom: '1px solid rgba(31,81,50,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--forest)', letterSpacing: '0.07em',
          textTransform: 'uppercase', opacity: 0.8,
        }}>
          🏛 Balai Besar Penerapan Modernisasi Pertanian Kalimantan Barat
        </span>
      </div>

      {/* Main content */}
      <main style={{
        flex: 1, padding: '20px 20px 24px',
        maxWidth: 520, width: '100%', margin: '0 auto',
        display: 'flex', flexDirection: 'column',
      }}>
        {error && (
          <div style={{
            background: 'var(--rust-bg)', border: '1px solid rgba(168,50,40,0.3)',
            borderRadius: 10, padding: '12px 14px', marginBottom: 16,
            fontSize: 13, color: 'var(--rust)', fontFamily: 'var(--font-body)',
          }}>
            ⚠ {error}
          </div>
        )}

        {!index && !error && <LoadingSkeleton />}
        {loadingCard && <LoadingSkeleton />}

        {index && !loadingCard && (
          <>
            {screen === 'phase' && (
              <>
                <PhaseSelector
                  phases={index.meta.phases}
                  onSelect={handlePhaseSelect}
                />
                <FeedbackSection />
              </>
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
        borderTop: '1px solid var(--rule)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        background: 'var(--paper)',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--ink-faint)', letterSpacing: '0.05em',
        }}>
          v1.0 · {index?.meta.total_cards ?? '—'} kartu resep
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--ink-faint)', letterSpacing: '0.05em',
        }}>
          POPT · Kementan
        </span>
      </footer>
    </div>
  )
}
