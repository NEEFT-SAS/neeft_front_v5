export const getProfileExperienceText = (value: unknown) => {
  return typeof value === 'string' ? value : ''
}

export const parseProfileExperienceDate = (value: unknown) => {
  if (!value) return null

  const date = value instanceof Date ? value : new Date(String(value))
  if (Number.isNaN(date.getTime())) return null

  return date
}

export const toProfileExperienceDateInput = (value: unknown) => {
  const date = parseProfileExperienceDate(value)
  if (!date) return ''

  return date.toISOString().slice(0, 10)
}

export const toProfileExperienceDatePayload = (value: string) => {
  const normalizedValue = getProfileExperienceText(value)
  if (!normalizedValue) return null

  const date = new Date(normalizedValue)
  if (Number.isNaN(date.getTime())) return null

  return date
}

export const formatProfileExperienceDateLabel = (value: unknown, locale = 'fr-FR') => {
  const date = parseProfileExperienceDate(value)
  if (!date) return ''

  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric'
  }).format(date)
}

export const formatProfileExperiencePeriodLabel = (
  startValue: unknown,
  endValue: unknown,
  locale = 'fr-FR',
  currentLabel = 'Aujourd hui'
) => {
  const start = formatProfileExperienceDateLabel(startValue, locale)
  const end = formatProfileExperienceDateLabel(endValue, locale)

  if (start && end) return `${start} - ${end}`
  if (start) return `${start} - ${currentLabel}`
  return end
}

export const getProfileExperienceDurationParts = (startValue: unknown, endValue: unknown) => {
  const startDate = parseProfileExperienceDate(startValue)
  const endDate = parseProfileExperienceDate(endValue) || new Date()
  if (!startDate || endDate.getTime() < startDate.getTime()) return []

  let years = endDate.getFullYear() - startDate.getFullYear()
  let months = endDate.getMonth() - startDate.getMonth()
  let days = endDate.getDate() - startDate.getDate()

  if (days < 0) {
    months -= 1
    days += new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate()
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  return [
    { value: years, singular: 'an', plural: 'ans' },
    { value: months, singular: 'mois', plural: 'mois' },
    { value: days, singular: 'jour', plural: 'jours' }
  ].filter(part => part.value > 0)
}

export const formatProfileExperienceDurationLabel = (
  startValue: unknown,
  endValue: unknown,
  emptyLabel = 'Moins d un jour'
) => {
  const parts = getProfileExperienceDurationParts(startValue, endValue).slice(0, 2)
  if (parts.length === 0) return emptyLabel

  return parts
    .map(part => `${part.value} ${part.value > 1 ? part.plural : part.singular}`)
    .join(' ')
}

export const compactProfileExperienceText = (value: string) => {
  return value.replace(/\s+/g, ' ')
}

export const nullableProfileExperienceText = (value: string) => {
  const compacted = compactProfileExperienceText(value)
  return compacted.length > 0 ? compacted : null
}
