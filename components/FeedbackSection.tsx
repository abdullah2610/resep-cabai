'use client'

import { useState } from 'react'

const LABELS = ['', 'Kurang Bermanfaat', 'Cukup Bermanfaat', 'Bermanfaat', 'Sangat Bermanfaat', 'Luar Biasa!']
const ENDPOINT = 'https://formspree.io/f/mwvywldo'

export default function FeedbackSection() {
  const [selected, setSelected] = useState(0)
  const [hover, setHover]       = useState(0)
  const [text, setText]         = useState('')
  const [status, setStatus]     = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const active = hover || selected

  const starLabel = hover
    ? LABELS[hover]
    : selected
    ? `${LABELS[selected]} (${selected}/5 bintang)`
    : 'Pilih bintang untuk memberi nilai'

  const submit = async () => {
    if (!selected) return
    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          app: 'Resep Cabai per Fase',
          rating: `${selected}/5 — ${LABELS[selected]}`,
          saran: text.trim() || '(tidak ada saran)',
        }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <section style={{
        marginTop: 32,
        background: 'var(--paper-alt)',
        border: '1px solid var(--rule)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 20px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
        <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-body)' }}>
          Terima kasih atas masukan Anda!
        </p>
        <p style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 4, fontFamily: 'var(--font-body)' }}>
          Feedback Anda sangat berarti untuk pengembangan aplikasi ini.
        </p>
      </section>
    )
  }

  return (
    <section style={{
      marginTop: 32,
      background: 'var(--paper-alt)',
      border: '1px solid var(--rule)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
    }}>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 900,
        color: 'var(--ink)', marginBottom: 4,
      }}>
        Seberapa Bermanfaat Aplikasi Ini?
      </h2>
      <p style={{ fontSize: 12, color: 'var(--ink-faint)', fontFamily: 'var(--font-body)', marginBottom: 16 }}>
        Bantu kami meningkatkan alat ini dengan memberikan penilaian Anda.
      </p>

      {/* Stars */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onClick={() => setSelected(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 32, lineHeight: 1, padding: '2px 4px',
              color: n <= active ? '#f59e0b' : 'var(--rule)',
              transform: n <= active ? 'scale(1.15)' : 'scale(1)',
              transition: 'color 0.1s, transform 0.1s',
            }}
          >
            ★
          </button>
        ))}
      </div>

      <div style={{
        textAlign: 'center', fontSize: 12, color: 'var(--ink-faint)',
        fontFamily: 'var(--font-body)', marginBottom: 14, minHeight: 18,
      }}>
        {starLabel}
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
        placeholder="Saran atau masukan untuk pengembangan aplikasi ini..."
        style={{
          width: '100%', fontSize: 13, fontFamily: 'var(--font-body)',
          border: '1px solid var(--rule)', borderRadius: 10,
          padding: '10px 12px', color: 'var(--ink)',
          background: 'var(--paper)', resize: 'none',
          outline: 'none', transition: 'border-color 0.15s',
          boxSizing: 'border-box',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--forest)')}
        onBlur={e => (e.currentTarget.style.borderColor = 'var(--rule)')}
      />

      {/* Submit */}
      <button
        onClick={submit}
        disabled={!selected || status === 'sending'}
        style={{
          marginTop: 10, width: '100%',
          background: selected ? 'var(--forest)' : 'var(--rule)',
          color: selected ? '#fff' : 'var(--ink-faint)',
          border: 'none', borderRadius: 10,
          padding: '11px', fontSize: 14, fontWeight: 600,
          fontFamily: 'var(--font-body)', cursor: selected ? 'pointer' : 'not-allowed',
          transition: 'background 0.2s, color 0.2s',
        }}
      >
        {status === 'sending' ? 'Mengirim…' : 'Kirim Feedback'}
      </button>

      {status === 'error' && (
        <p style={{ marginTop: 8, fontSize: 12, color: 'var(--rust)', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
          Gagal mengirim. Periksa koneksi dan coba lagi.
        </p>
      )}
    </section>
  )
}
