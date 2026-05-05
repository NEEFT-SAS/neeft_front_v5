import type { SearchFilterOption } from '../types'

const buildNumberOptions = (min: number, max: number, step: number, formatLabel: (value: number) => string): SearchFilterOption[] => {
  const optionCount = Math.floor((max - min) / step) + 1

  return Array.from({ length: optionCount }, (_, index) => {
    const value = min + index * step

    return {
      label: formatLabel(value),
      value
    }
  })
}

export const searchCountryOptions: SearchFilterOption[] = [
  { label: 'France', value: 'fr' },
  { label: 'Belgique', value: 'be' },
  { label: 'Suisse', value: 'ch' },
  { label: 'Canada', value: 'ca' },
  { label: 'Espagne', value: 'es' }
]

export const searchLanguageOptions: SearchFilterOption[] = [
  { label: 'Francais', value: 'fr' },
  { label: 'Anglais', value: 'en' },
  { label: 'Espagnol', value: 'es' },
  { label: 'Allemand', value: 'de' }
]

export const searchAvailabilityOptions: SearchFilterOption[] = [
  { label: 'Disponible', value: 'open' },
  { label: 'A ecouter', value: 'watch' },
  { label: 'Indisponible', value: 'busy' }
]

export const searchLevelOptions: SearchFilterOption[] = [
  { label: 'Elite', value: 'elite' },
  { label: 'Semi-pro', value: 'semi-pro' },
  { label: 'Academy', value: 'academy' }
]

export const searchStaffRoleOptions: SearchFilterOption[] = [
  { label: 'CM', value: 'community-manager', icon: 'lucide:megaphone' },
  { label: 'Developpeur', value: 'developer', icon: 'lucide:code-2' },
  { label: 'Graphiste', value: 'designer', icon: 'lucide:palette' },
  { label: 'Monteur', value: 'video-editor', icon: 'lucide:clapperboard' },
  { label: 'Coach', value: 'coach', icon: 'lucide:radio-tower' }
]

export const searchLegalStatusOptions: SearchFilterOption[] = [
  { label: 'Sans structure', value: 'no-structure' },
  { label: 'Association', value: 'association' },
  { label: 'Entreprise', value: 'company' }
]

export const searchAgeOptions = buildNumberOptions(13, 60, 1, value => `${value} ans`)

export const buildEloOptions = (min: number, max: number, step: number) => buildNumberOptions(min, max, step, value => `${value} elo`)
