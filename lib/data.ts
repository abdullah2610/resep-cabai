import type { IndexData, RecipeCard } from '@/types'

let indexCache: IndexData | null = null
const phaseCache: Record<string, RecipeCard[]> = {}

export async function loadIndex(): Promise<IndexData> {
  if (indexCache) return indexCache
  const res = await fetch('/data/resep_cabai_index.json')
  indexCache = await res.json()
  return indexCache!
}

export async function loadPhaseCards(phaseSlug: string): Promise<RecipeCard[]> {
  if (phaseCache[phaseSlug]) return phaseCache[phaseSlug]
  const res = await fetch(`/data/phases/${phaseSlug}.json`)
  const cards = await res.json()
  phaseCache[phaseSlug] = cards
  return cards
}

export async function getCard(
  phaseSlug: string,
  contextSlug: string
): Promise<RecipeCard | null> {
  const index = await loadIndex()
  const key = `${phaseSlug}__${contextSlug}`
  const cardId = index.lookup[key]
  if (!cardId) return null
  const cards = await loadPhaseCards(phaseSlug)
  return cards.find((c) => c.id === cardId) ?? null
}

export function priorityColor(priority: string): string {
  if (priority === 'P0') return '#dc2626'
  if (priority === 'P1') return '#d97706'
  return '#16a34a'
}

export function priorityBg(priority: string): string {
  if (priority === 'P0') return 'rgba(220,38,38,0.12)'
  if (priority === 'P1') return 'rgba(217,119,6,0.12)'
  return 'rgba(22,163,74,0.12)'
}

export function copyCardText(card: RecipeCard): string {
  const lines: string[] = []
  lines.push(`🌶️ RESEP CABAI — ${card.phase.toUpperCase()}`)
  lines.push(`📋 Konteks: ${card.context}`)
  lines.push(``)
  lines.push(`✅ TINDAKAN HARI INI:`)
  card.actions.forEach((a, i) => lines.push(`${i + 1}. ${a}`))

  if (card.fertilizer.items.length > 0) {
    lines.push(``)
    lines.push(`🌱 RESEP PUPUK (per 10 liter air):`)
    card.fertilizer.items.forEach((f) => lines.push(`• ${f.bahan}: ${f.dosis}`))
    if (card.fertilizer.notes) lines.push(`📌 ${card.fertilizer.notes}`)
  }

  if (card.pesticide.steps.length > 0) {
    lines.push(``)
    lines.push(`🧪 PESTISIDA (W-A-L-E):`)
    card.pesticide.steps.forEach((s) => lines.push(`• ${s.langkah}: ${s.detail}`))
    if (card.pesticide.notes) lines.push(`📌 ${card.pesticide.notes}`)
  }

  if (card.warnings.length > 0) {
    lines.push(``)
    lines.push(`⚠️ PERINGATAN:`)
    card.warnings.forEach((w) => lines.push(`• ${w}`))
  }

  lines.push(``)
  lines.push(`📱 Resep dari Aplikasi Resep Cabai per Fase — POPT Kalbar`)
  return lines.join('\n')
}
