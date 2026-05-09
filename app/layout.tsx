import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Resep Cabai per Fase',
  description: 'Alat bantu kunjungan lapangan POPT — resep tindakan cabai per fase fenologi',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Resep Cabai' },
}

export const viewport: Viewport = {
  themeColor: '#0f2318',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
