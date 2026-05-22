import FeedbackSection from '@/components/FeedbackSection'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Beri Masukan — Resep Cabai per Fase',
}

export default function MasukanPage() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>

      <header style={{
        background: 'var(--forest)',
        color: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        position: 'sticky', top: 0, zIndex: 20,
      }}>
        <div style={{
          maxWidth: 560, margin: '0 auto',
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Link href="/" style={{ color: '#fff', fontSize: 20, lineHeight: 1, textDecoration: 'none' }}>←</Link>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 900, lineHeight: 1.2 }}>
              💬 Beri Masukan
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 2 }}>
              Resep Cabai · POPT Kalbar
            </div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, maxWidth: 560, width: '100%', margin: '0 auto', padding: '20px 20px 40px' }}>
        <FeedbackSection />
      </main>

    </div>
  )
}
