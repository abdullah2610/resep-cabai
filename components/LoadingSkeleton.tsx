'use client'

export default function LoadingSkeleton() {
  return (
    <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        border: '3px solid rgba(31,81,50,0.15)',
        borderTopColor: 'var(--forest)',
        animation: 'spin 0.9s linear infinite',
      }} />
      <p style={{ fontSize: 13, color: 'var(--ink-faint)', fontFamily: 'var(--font-body)' }}>
        Memuat resep…
      </p>
    </div>
  )
}
