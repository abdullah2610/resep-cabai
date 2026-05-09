export interface PhaseInfo {
  slug: string
  label: string
  icon: string
}

export interface ContextInfo {
  slug: string
  label: string
  icon: string
}

export interface FertilizerItem {
  bahan: string
  dosis: string
}

export interface PesticideStep {
  langkah: string
  detail: string
}

export interface DifferentialItem {
  label: string
  penjelasan: string
}

export interface LocalNote {
  label: string
  catatan: string
}

export interface RecipeCard {
  id: string
  sheet: string
  phase: string
  phase_slug: string
  context: string
  context_slug: string
  priority: 'P0' | 'P1' | 'P2'
  priority_label: string
  see_also: string
  is_summary: boolean
  actions: string[]
  fertilizer: {
    items: FertilizerItem[]
    notes: string
  }
  pesticide: {
    steps: PesticideStep[]
    notes: string
  }
  warnings: string[]
  differential: DifferentialItem[]
  local_notes: LocalNote[]
  sources: string
  status: string
}

export interface IndexData {
  meta: {
    title: string
    version: string
    total_cards: number
    phases: PhaseInfo[]
    contexts: ContextInfo[]
  }
  lookup: Record<string, string>
  cards_index: {
    id: string
    phase: string
    phase_slug: string
    context: string
    context_slug: string
    priority: string
    priority_label: string
    is_summary: boolean
    see_also: string
  }[]
}
