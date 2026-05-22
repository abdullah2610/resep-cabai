'use client'

import { useState } from 'react'

const LABELS = ['', 'Kurang', 'Cukup', 'Bermanfaat', 'Sangat Bermanfaat', 'Luar Biasa!']
const CHIPS = ['Tidak akurat', 'Sulit dipahami', 'Fitur kurang', 'Ada kesalahan', 'Resep kurang lengkap', 'Sangat bermanfaat', 'Lainnya']
const ENDPOINT = 'https://formspree.io/f/mwvywldo'
const MAX_CHARS = 500

export default function FeedbackSection() {
  const [selected, setSelected]     = useState(0)
  const [hover, setHover]           = useState(0)
  const [chips, setChips]           = useState<Set<string>>(new Set())
  const [text, setText]             = useState('')
  const [status, setStatus]         = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [validErr, setValidErr]     = useState(false)

  const active = hover || selected
  const canSubmit = selected > 0 || chips.size > 0

  const starLabel = hover
    ? LABELS[hover]
    : selected
    ? `${LABELS[selected]} (${selected}/5 bintang)`
    : ''

  const toggleChip = (val: string) => {
    setChips(prev => {
      const next = new Set(prev)
      next.has(val) ? next.delete(val) : next.add(val)
      return next
    })
    setValidErr(false)
  }

  const submit = async () => {
    if (!canSubmit) { setValidErr(true); return }
    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          app:    'Resep Cabai per Fase',
          rating: selected ? `${selected}/5 — ${LABELS[selected]}` : '(tidak dinilai)',
          topik:  chips.size > 0 ? [...chips].join(', ') : '(tidak dipilih)',
          saran:  text.trim() || '(tidak ada komentar)',
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
          Masukan Anda membantu pengembangan aplikasi ini.
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
        Bantu kami meningkatkan alat ini dengan berbagi pengalaman Anda.
      </p>

      {/* Chips */}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
          Topik masukan <span style={{ fontWeight: 400 }}>(boleh pilih lebih dari satu)</span>
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {CHIPS.map(val => {
            const on = chips.has(val)
            return (
              <button
                key={val}
                type="button"
                onClick={() => toggleChip(val)}
                style={{
                  border: `1px solid ${on ? 'var(--forest)' : 'var(--rule)'}`,
                  borderRadius: 999,
                  padding: '4px 12px',
                  fontSize: 12,
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  background: on ? 'var(--forest)' : 'var(--paper)',
                  color: on ? '#fff' : 'var(--ink-faint)',
                  transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                }}
              >
                {val}
              </button>
            )
          })}
        </div>
      </div>

      {/* Stars */}
      <div style={{ marginBottom: 6 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
          Penilaian keseluruhan
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => { setSelected(n); setValidErr(false) }}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 32, lineHeight: 1, padding: '2px 3px',
                  color: n <= active ? '#f59e0b' : 'var(--rule)',
                  transform: n <= active ? 'scale(1.15)' : 'scale(1)',
                  transition: 'color 0.1s, transform 0.1s',
                }}
              >
                ★
              </button>
            ))}
          </div>
          {starLabel && (
            <span style={{ fontSize: 12, color: 'var(--forest)', fontWeight: 500, fontFamily: 'var(--font-body)', marginLeft: 4 }}>
              {starLabel}
            </span>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div style={{ marginTop: 14 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
          Komentar <span style={{ fontWeight: 400 }}>(opsional)</span>
        </p>
        <textarea
          value={text}
          onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
          rows={3}
          maxLength={MAX_CHARS}
          placeholder="Tuliskan saran, pertanyaan, atau pengalaman Anda..."
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
        <p style={{ textAlign: 'right', fontSize: 11, color: 'var(--ink-faint)', fontFamily: 'var(--font-body)', marginTop: 2 }}>
          {text.length}/{MAX_CHARS}
        </p>
      </div>

      {/* Submit */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
        <button
          onClick={submit}
          disabled={status === 'sending'}
          style={{
            flex: 1,
            background: 'var(--forest)',
            color: '#fff',
            border: 'none', borderRadius: 10,
            padding: '11px', fontSize: 14, fontWeight: 600,
            fontFamily: 'var(--font-body)', cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {status === 'sending' ? 'Mengirim…' : 'Kirim Masukan'}
        </button>
        {validErr && (
          <span style={{ fontSize: 12, color: 'var(--rust)', fontFamily: 'var(--font-body)' }}>
            Pilih topik atau bintang terlebih dahulu.
          </span>
        )}
      </div>

      {status === 'error' && (
        <p style={{ marginTop: 8, fontSize: 12, color: 'var(--rust)', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
          Gagal kirim. Coba lagi.
        </p>
      )}
    </section>
  )
}
