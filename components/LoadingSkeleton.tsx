'use client'

export default function LoadingSkeleton() {
  return (
    <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        border: '3px solid rgba(168,224,99,0.15)',
        borderTopColor: 'var(--lime)',
        animation: 'spin 0.9s linear infinite',
      }} />
      <p style={{ fontSize: 13, color: 'rgba(247,243,234,0.4)', fontFamily: 'var(--font-body)' }}>
        Memuat resep…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
