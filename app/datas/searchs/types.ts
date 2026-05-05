export type SearchEntityKind = 'players' | 'staffs' | 'teams'

export type SearchGameId = 'valorant' | 'league-of-legends' | 'rocket-league'

export type SearchFilterCapability = 'platforms' | 'modes' | 'ranks' | 'elo' | 'positions'

export type SearchFilterKind = 'text' | 'singleFacet' | 'multiFacet' | 'boolean' | 'range'

export type SearchFilterOptionValue = string | number

export type SearchFilterOption = {
  label: string
  value: SearchFilterOptionValue
  icon?: string
  count?: number
}

export type SearchFilterBase = {
  key: string
  label: string
  field: string
  icon: string
  capability?: SearchFilterCapability
}

export type SearchTextFilter = SearchFilterBase & {
  type: 'text'
  placeholder: string
}

export type SearchFacetFilter = SearchFilterBase & {
  type: 'singleFacet' | 'multiFacet'
  options?: SearchFilterOption[]
  optionsCapability?: SearchFilterCapability
  searchable?: boolean
}

export type SearchBooleanFilter = SearchFilterBase & {
  type: 'boolean'
  optionLabel: string
  trueValue: string
}

export type SearchRangeFilter = SearchFilterBase & {
  type: 'range'
  minLabel: string
  maxLabel: string
  minPlaceholder: string
  maxPlaceholder: string
  options?: SearchFilterOption[]
  optionsCapability?: SearchFilterCapability
}

export type SearchFilterDefinition =
  | SearchTextFilter
  | SearchFacetFilter
  | SearchBooleanFilter
  | SearchRangeFilter

export type SearchEntitySchema = {
  entity: SearchEntityKind
  filters: SearchFilterDefinition[]
}

export type SearchGameCapabilities = {
  game: SearchGameId
  platforms?: SearchFilterOption[]
  modes?: SearchFilterOption[]
  ranks?: SearchFilterOption[]
  elo?: SearchFilterOption[]
  positions?: SearchFilterOption[]
}

export type ComposedSearchSchema = {
  entity: SearchEntityKind
  selectedGame: SearchGameId | null
  filters: SearchFilterDefinition[]
}

export type SearchRangeValue = {
  min: SearchFilterOptionValue | ''
  max: SearchFilterOptionValue | ''
}

export type SearchFilterValue = string | boolean | string[] | SearchRangeValue

export type SearchFilterState = Record<string, SearchFilterValue>
