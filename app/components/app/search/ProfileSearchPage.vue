<template>
  <SearchPageLayout
    :layout-theme="layoutTheme"
    filter-presentation="sidebar"
    image-src="/images/landing/competition-arena.jpg"
    :title-id="`${searchDomPrefix}-title`"
    :actions-label="actionsLabel"
    :results-count-id="`${searchDomPrefix}-results-count`"
    :eyebrow="eyebrow"
    :title="title"
    :description="description"
    :results-label="resultsLabel"
    :top-label="topLabel"
    :show-header-summary="false"
    show-toolbar-summary
    :show-toolbar-count="false"
    show-filter-button
    :filter-button-label="filterButtonLabel"
    :filter-controls-id="`${searchDomPrefix}-filters-title`"
    :is-filter-modal-open="isFilterModalOpen"
    :show-sort-control="false"
    :has-results="visibleResultCount > 0"
    result-list-describedby=""
    :empty-message="emptySearchMessage"
    @open-filters="openFilterModal"
  >
    <template #filters>
      <SearchFilterSidebar
        v-model="isFilterModalOpen"
        :active-filter-count="activeFilterCount"
        :active-filter-label="activeFilterLabel"
        :controls-id="`${searchDomPrefix}-filters-title`"
        :filters="filtersWithCounts"
        :filter-values="selectedFilters"
        :id-prefix="searchDomPrefix"
        :theme="layoutTheme"
        @update:filter-values="updateSelectedFilters"
        @reset="resetFilters"
      />
    </template>

    <template #actions>
      <template v-if="profileKind === 'players'">
        <li class="profile-search-page__action-groups">
          <div class="profile-search-page__action-group">
            <p class="profile-search-page__action-label">
              Jeux
            </p>

            <div class="profile-search-page__action-buttons">
              <CustomButton
                v-for="game in availableGames"
                :key="game.value"
                :label="game.label"
                :left-icon="game.icon"
                :theme="layoutTheme"
                variant="outlined"
                color="secondary"
                size="lg"
                :selected="selectedGameValue === game.value"
                :aria-pressed="selectedGameValue === game.value"
                @click="toggleGameFilter(String(game.value))"
              />
            </div>
          </div>

          <div v-if="availableModeOptions.length" class="profile-search-page__action-group">
            <p class="profile-search-page__action-label">
              Modes
            </p>

            <div class="profile-search-page__action-buttons profile-search-page__action-buttons--modes">
              <CustomButton
                v-for="mode in availableModeOptions"
                :key="String(mode.value)"
                :label="mode.label"
                :theme="layoutTheme"
                variant="outlined"
                color="secondary"
                size="md"
                :selected="selectedModeValues.includes(String(mode.value))"
                :aria-pressed="selectedModeValues.includes(String(mode.value))"
                @click="toggleModeFilter(String(mode.value))"
              />
            </div>
          </div>
        </li>
      </template>

      <template v-else-if="profileKind === 'staffs'">
        <li class="profile-search-page__action-groups">
          <div v-if="availableStaffRoleOptions.length" class="profile-search-page__action-group">
            <p class="profile-search-page__action-label">
              Roles
            </p>

            <div class="profile-search-page__action-buttons">
              <CustomButton
                v-for="role in availableStaffRoleOptions"
                :key="String(role.value)"
                :label="role.label"
                :left-icon="role.icon"
                :theme="layoutTheme"
                variant="outlined"
                color="secondary"
                size="md"
                :selected="selectedStaffRoleValues.includes(String(role.value))"
                :aria-pressed="selectedStaffRoleValues.includes(String(role.value))"
                @click="toggleStaffRoleFilter(String(role.value))"
              />
            </div>
          </div>

          <div class="profile-search-page__action-group">
            <p class="profile-search-page__action-label">
              Jeux
            </p>

            <div class="profile-search-page__action-buttons">
              <CustomButton
                v-for="game in availableGames"
                :key="game.value"
                :label="game.label"
                :left-icon="game.icon"
                :theme="layoutTheme"
                variant="outlined"
                color="secondary"
                size="lg"
                :selected="selectedGameValue === game.value"
                :aria-pressed="selectedGameValue === game.value"
                @click="toggleGameFilter(String(game.value))"
              />
            </div>
          </div>
        </li>
      </template>

      <template v-else-if="profileKind === 'teams'">
        <li class="profile-search-page__action-groups">
          <div class="profile-search-page__action-group">
            <p class="profile-search-page__action-label">
              Jeux
            </p>

            <div class="profile-search-page__action-buttons">
              <CustomButton
                v-for="game in availableGames"
                :key="game.value"
                :label="game.label"
                :left-icon="game.icon"
                :theme="layoutTheme"
                variant="outlined"
                color="secondary"
                size="lg"
                :selected="selectedGameValue === game.value"
                :aria-pressed="selectedGameValue === game.value"
                @click="toggleGameFilter(String(game.value))"
              />
            </div>
          </div>

          <div v-if="availableTeamStatusOptions.length" class="profile-search-page__action-group">
            <p class="profile-search-page__action-label">
              Statut
            </p>

            <div class="profile-search-page__action-buttons">
              <CustomButton
                v-for="status in availableTeamStatusOptions"
                :key="String(status.value)"
                :label="status.label"
                :left-icon="status.icon"
                :theme="layoutTheme"
                variant="outlined"
                color="secondary"
                size="md"
                :selected="selectedTeamStatusValue === String(status.value)"
                :aria-pressed="selectedTeamStatusValue === String(status.value)"
                @click="toggleTeamStatusFilter(String(status.value))"
              />
            </div>
          </div>
        </li>
      </template>

      <template v-else>
        <li v-for="game in availableGames" :key="game.value">
          <CustomButton
            :label="game.label"
            :left-icon="game.icon"
            :theme="layoutTheme"
            variant="outlined"
            color="secondary"
            size="lg"
            :selected="selectedGameValue === game.value"
            :aria-pressed="selectedGameValue === game.value"
            @click="toggleGameFilter(String(game.value))"
          />
        </li>
      </template>
    </template>

    <template #results>
      <template v-if="profileKind === 'staffs'">
        <li v-for="staff in visibleStaffProfiles" :key="staff.id">
          <SearchStaffCard
            :staff="staff"
            :profile-path="getHandleProfilePath(staff.handle)"
          />
        </li>
      </template>

      <template v-else-if="profileKind === 'teams'">
        <li v-for="team in visibleTeamProfiles" :key="team.slug">
          <SearchTeamCard
            :team="team"
            :profile-path="getTeamProfilePath(team)"
          />
        </li>
      </template>

      <template v-else>
        <li v-for="player in visiblePlayers" :key="player.id">
          <SearchPlayerCard
            :player="player"
            :profile-path="getPlayerProfilePath(player)"
            :selected-game-id="selectedResourceGame ? selectedResourceGame.id : 0"
            :selected-mode-id="selectedResourceMode ? selectedResourceMode.id : 0"
          />
        </li>
      </template>
    </template>
  </SearchPageLayout>
</template>

<script setup lang="ts">
import type { RscCountryPresenter, RscGamePlatformPresenter, RscGamePositionPresenter, RscGamePresenter, RscGameRankPresenter, RscLanguagePresenter, SearchPlayerPresenter, SearchPlayersPresenter, SearchPlayersQueryDto, SearchTeamPresenter, SearchTeamsPresenter, SearchTeamsQueryDto, SearchTeamStatus } from '@neeft-sas/shared'
import { composeSearchSchema, searchGameOptions, type SearchEntityKind, type SearchFacetFilter, type SearchFilterDefinition, type SearchFilterOption, type SearchFilterOptionValue, type SearchFilterState, type SearchFilterValue, type SearchGameId, type SearchRangeValue } from '~/datas/searchs'

type LayoutTheme = 'landing' | 'app'
type ProfileKind = SearchEntityKind

const { t } = useI18n()

const props = defineProps({
  layoutTheme: {
    type: String,
    default: 'landing',
    validator: (value: string) => ['landing', 'app'].includes(value)
  },
  profileKind: {
    type: String,
    default: 'players',
    validator: (value: string) => ['players', 'staffs', 'teams'].includes(value)
  },
  profilePathPrefix: { type: String, default: '/players' }
})

const searchI18nKey = computed(() => `app.search.${props.profileKind}`)

const eyebrow = computed(() => {
  const value = t(`${searchI18nKey.value}.hero.eyebrow`)
  return typeof value === 'string' ? value : ''
})
const title = computed(() => {
  const value = t(`${searchI18nKey.value}.hero.title`)
  return typeof value === 'string' ? value : ''
})
const description = computed(() => {
  const value = t(`${searchI18nKey.value}.hero.description`)
  return typeof value === 'string' ? value : ''
})
const searchLabel = computed(() => {
  const value = t(`${searchI18nKey.value}.searchLabel`)
  return typeof value === 'string' ? value : ''
})
const searchPlaceholder = computed(() => {
  const value = t(`${searchI18nKey.value}.searchPlaceholder`)
  return typeof value === 'string' ? value : ''
})
const resultSingular = computed(() => {
  const value = t(`${searchI18nKey.value}.resultSingular`)
  return typeof value === 'string' ? value : 'joueur'
})
const resultPlural = computed(() => {
  const value = t(`${searchI18nKey.value}.resultPlural`)
  return typeof value === 'string' ? value : 'joueurs'
})
const emptyMessage = computed(() => {
  const value = t(`${searchI18nKey.value}.emptyMessage`)
  return typeof value === 'string' ? value : 'Aucun résultat'
})

const searchPageSize = 24
const gameIconFallback = 'lucide:gamepad-2'
const gameIconBySlug = new Map(searchGameOptions.map(game => [String(game.value), game.icon || gameIconFallback]))

const toPositiveInt = (value: unknown) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : 0
}

const createPlayerSearchMeta = (): SearchPlayersPresenter => ({
  data: [],
  meta: {
    found: 0,
    page: 1,
    perPage: 20,
    outOf: 0
  }
})

const createTeamSearchMeta = (): SearchTeamsPresenter => ({
  data: [],
  meta: {
    found: 0,
    page: 1,
    perPage: 20,
    outOf: 0
  }
})

type SearchMetaUpdate = {
  target: SearchPlayersPresenter | SearchTeamsPresenter,
  responseMeta: Partial<SearchPlayersPresenter['meta'] | SearchTeamsPresenter['meta']> | undefined,
}

const applySearchMeta = (
  target: SearchPlayersPresenter | SearchTeamsPresenter,
  responseMeta: Partial<SearchPlayersPresenter['meta'] | SearchTeamsPresenter['meta']> | undefined,
  itemCount: number
) => {
  target.meta.found = Number(responseMeta?.found || itemCount)
  target.meta.page = Math.max(1, toPositiveInt(responseMeta?.page) || 1)
  target.meta.perPage = Math.min(50, toPositiveInt(responseMeta?.perPage) || searchPageSize)
  target.meta.outOf = Number(responseMeta?.outOf || 0)
}

const resetSearchMeta = (target: SearchPlayersPresenter | SearchTeamsPresenter) => {
  if ('data' in target) {
    target.data = []
  }
  target.meta.found = 0
  target.meta.page = 1
  target.meta.perPage = 20
  target.meta.outOf = 0
}

const sortByLabel = (left: SearchFilterOption, right: SearchFilterOption) => {
  return left.label.localeCompare(right.label, 'fr')
}

const isSearchResourceGame = (game: RscGamePresenter) => {
  return Boolean(game.id && game.name && game.slug)
}

const isSearchResourceCountry = (country: RscCountryPresenter) => {
  return Boolean(country.id && country.code && (country.name || country.i18nName))
}

const isSearchResourceLanguage = (language: RscLanguagePresenter) => {
  return Boolean(language.id && language.code && (language.label || language.i18nLabel))
}

const selectedFilters = reactive<SearchFilterState>({})
const isFilterModalOpen = ref(false)

const profileKind = computed(() => props.profileKind as ProfileKind)
const layoutTheme = computed(() => props.layoutTheme as LayoutTheme)
const searchDomPrefix = computed(() => `search-${profileKind.value}`)
const actionsLabel = computed(() => {
  if (profileKind.value === 'players') return 'Jeux et modes disponibles'
  if (profileKind.value === 'staffs') return 'Roles et jeux disponibles'
  if (profileKind.value === 'teams') return 'Jeux et statuts disponibles'
  return 'Jeux disponibles'
})
const resourcesStore = useResourcesStore()
const { $searchAPI } = useNuxtApp()
const playerSearchResults = ref<SearchPlayerPresenter[]>([])
const teamSearchResults = ref<SearchTeamPresenter[]>([])
const playerSearchMeta = reactive<SearchPlayersPresenter>(createPlayerSearchMeta())
const teamSearchMeta = reactive<SearchTeamsPresenter>(createTeamSearchMeta())
const isPlayerSearchLoading = ref(false)
const isTeamSearchLoading = ref(false)
const playerSearchError = ref('')
const teamSearchError = ref('')

let playerSearchRequestId = 0
let teamSearchRequestId = 0
let playerSearchDebounceTimer: ReturnType<typeof setTimeout> | null = null
let teamSearchDebounceTimer: ReturnType<typeof setTimeout> | null = null

const resourceGames = computed(() => {
  return resourcesStore.rscGames.filter(isSearchResourceGame)
})

const searchableResourceGames = computed(() => {
  return searchGameOptions
    .map((option) => {
      const value = String(option.value)
      return resourceGames.value.find(game => game.slug === value) || null
    })
    .filter((game): game is RscGamePresenter => Boolean(game))
})

const supportedResourceGames = computed(() => {
  return searchableResourceGames.value.filter(game => game.rscGameModes.length > 0)
})

const resourceCountries = computed(() => {
  return resourcesStore.resources.rscCountries
    .filter(isSearchResourceCountry)
})

const resourceLanguages = computed(() => {
  return resourcesStore.resources.rscLanguages
    .filter(isSearchResourceLanguage)
})

const isSearchGameId = (value: SearchFilterValue | undefined): value is SearchGameId => {
  return typeof value === 'string' && searchGameOptions.some(game => game.value === value)
}

const selectedGameValue = computed<SearchGameId | null>(() => {
  const value = selectedFilters.games
  return isSearchGameId(value) ? value : null
})

const selectedResourceGame = computed(() => {
  if (!selectedGameValue.value) return null

  return resourceGames.value.find(game => game.slug === selectedGameValue.value) || null
})

const activeSearchSchema = computed(() => {
  return composeSearchSchema(profileKind.value, selectedGameValue.value)
})

const schemaModeOptions = computed(() => {
  const modeFilter = activeSearchSchema.value.filters.find((filter) => {
    return filter.key === 'modes' && 'options' in filter
  })

  return modeFilter && 'options' in modeFilter ? modeFilter.options || [] : []
})

const toResourceFilterOptions = (
  items: Array<RscGamePlatformPresenter | RscGamePositionPresenter | RscGameRankPresenter>,
  valueResolver: (item: RscGamePlatformPresenter | RscGamePositionPresenter | RscGameRankPresenter) => SearchFilterOptionValue = item => item.id
) => {
  return items
    .map(item => ({
      label: item.name,
      value: valueResolver(item),
      icon: item.icon || undefined
    }))
    .sort(sortByLabel)
}

const countryFilterOptions = computed<SearchFilterOption[]>(() => {
  return resourceCountries.value
    .map(country => ({
      label: country.i18nName || country.name,
      value: country.id
    }))
    .sort(sortByLabel)
})

const languageFilterOptions = computed<SearchFilterOption[]>(() => {
  return resourceLanguages.value
    .map(language => ({
      label: language.i18nLabel || language.label,
      value: language.id
    }))
    .sort(sortByLabel)
})

const resourceModeOptions = computed<SearchFilterOption[]>(() => {
  const modes = selectedResourceGame.value?.rscGameModes || []

  return [...modes]
    .sort((left, right) => Number(left.order ?? 0) - Number(right.order ?? 0))
    .map(mode => ({
      label: mode.name,
      value: mode.id
    }))
})

const resourceRankOptions = computed<SearchFilterOption[]>(() => {
  const ranks = selectedResourceGame.value?.rscGameRanks || []

  return [...ranks]
    .filter(rank => Number.isFinite(Number(rank.order)))
    .sort((left, right) => Number(left.order ?? 0) - Number(right.order ?? 0))
    .map(rank => ({
      label: rank.name,
      value: Number(rank.order),
      icon: rank.icon || undefined
    }))
})

const playerModeOptions = computed(() => {
  return resourceModeOptions.value.length ? resourceModeOptions.value : schemaModeOptions.value
})

const getSearchFilterOverride = (filter: SearchFilterDefinition): Partial<SearchFilterDefinition> | null => {
  const usesApiResources = profileKind.value === 'players' || profileKind.value === 'teams'
  if (!usesApiResources) return null

  if (filter.key === 'countries' && countryFilterOptions.value.length) {
    return { options: countryFilterOptions.value }
  }

  if (filter.key === 'languages' && languageFilterOptions.value.length) {
    return { options: languageFilterOptions.value }
  }

  if (filter.key === 'games') {
    return { options: availableGames.value }
  }

  if (profileKind.value !== 'players') return null

  if (filter.key === 'modes' && 'options' in filter) {
    return {
      type: 'singleFacet',
      options: playerModeOptions.value
    } as Partial<SearchFilterDefinition>
  }

  if (filter.key === 'platforms' && selectedResourceGame.value?.rscGamePlatforms.length) {
    return { options: toResourceFilterOptions(selectedResourceGame.value.rscGamePlatforms) }
  }

  if (filter.key === 'positions' && selectedResourceGame.value?.rscGamePositions.length) {
    return { options: toResourceFilterOptions(selectedResourceGame.value.rscGamePositions) }
  }

  if (filter.key === 'ranks' && resourceRankOptions.value.length) {
    return { options: resourceRankOptions.value }
  }

  return null
}

const activeFilters = computed<SearchFilterDefinition[]>(() => {
  return activeSearchSchema.value.filters.map((filter) => {
    const filterOverride = getSearchFilterOverride(filter)
    const nextFilter = filterOverride
      ? { ...filter, ...filterOverride } as SearchFilterDefinition
      : filter

    if (nextFilter.type !== 'text') return nextFilter

    return {
      ...nextFilter,
      label: searchLabel || nextFilter.label,
      placeholder: searchPlaceholder || nextFilter.placeholder
    }
  })
})

const availableGames = computed(() => {
  if (profileKind.value === 'players' && supportedResourceGames.value.length) {
    return supportedResourceGames.value.map(game => ({
      label: game.name || game.shortName || game.slug,
      value: game.slug,
      icon: game.icon || gameIconBySlug.get(game.slug) || gameIconFallback
    }))
  }

  if (profileKind.value === 'teams' && supportedResourceGames.value.length) {
    return supportedResourceGames.value.map(game => ({
      label: game.name || game.shortName || game.slug,
      value: game.slug,
      icon: game.icon || gameIconBySlug.get(game.slug) || gameIconFallback
    }))
  }

  return searchGameOptions.map(game => ({
    ...game,
    icon: game.icon || gameIconFallback
  }))
})

const activeModeFilter = computed<SearchFacetFilter | null>(() => {
  const filter = activeFilters.value.find((item): item is SearchFacetFilter => {
    return item.key === 'modes' && (item.type === 'multiFacet' || item.type === 'singleFacet')
  })

  return filter || null
})

const availableModeOptions = computed(() => {
  return activeModeFilter.value?.options || []
})

const activeTeamStatusFilter = computed<SearchFacetFilter | null>(() => {
  const filter = activeFilters.value.find((item): item is SearchFacetFilter => {
    return item.key === 'teamStatus' && (item.type === 'multiFacet' || item.type === 'singleFacet')
  })

  return filter || null
})

const availableTeamStatusOptions = computed(() => {
  return activeTeamStatusFilter.value?.options || []
})

const activeStaffRoleFilter = computed<SearchFacetFilter | null>(() => {
  const filter = activeFilters.value.find((item): item is SearchFacetFilter => {
    return item.key === 'roles' && profileKind.value === 'staffs' && (item.type === 'multiFacet' || item.type === 'singleFacet')
  })

  return filter || null
})

const availableStaffRoleOptions = computed(() => {
  return activeStaffRoleFilter.value?.options || []
})

const selectedModeValues = computed<string[]>(() => {
  const value = selectedFilters.modes
  if (typeof value === 'string' && value) return [value]
  return Array.isArray(value) ? value.map(String) : []
})

const selectedModeValue = computed(() => {
  return selectedModeValues.value[0] || ''
})

const selectedTeamStatusValue = computed(() => {
  const value = selectedFilters.teamStatus
  return typeof value === 'string' ? value : ''
})

const selectedStaffRoleValues = computed<string[]>(() => {
  const value = selectedFilters.roles
  if (typeof value === 'string' && value) return [value]
  return Array.isArray(value) ? value.map(String) : []
})

const emptyRangeValue = (): SearchRangeValue => ({
  min: '',
  max: ''
})

const getDefaultFilterValue = (filter: SearchFilterDefinition): SearchFilterValue => {
  if (filter.type === 'multiFacet') return []
  if (filter.type === 'boolean') return false
  if (filter.type === 'range') return emptyRangeValue()
  return ''
}

const getFilterOptions = (filter: SearchFilterDefinition) => {
  if (!('options' in filter)) return []
  return filter.options || []
}

const isAllowedOption = (filter: SearchFilterDefinition, value: unknown) => {
  const options = getFilterOptions(filter)
  if (!options.length) return true
  return options.some(option => String(option.value) === String(value))
}

const getAllowedFilterValue = (filter: SearchFilterDefinition, value: SearchFilterValue | undefined): SearchFilterValue => {
  if (filter.type === 'text') return typeof value === 'string' ? value : ''
  if (filter.type === 'boolean') return value === true
  if (filter.type === 'singleFacet') return typeof value === 'string' && isAllowedOption(filter, value) ? value : ''
  if (filter.type === 'multiFacet') {
    return Array.isArray(value) ? value.filter(item => isAllowedOption(filter, item)) : []
  }
  if (filter.type === 'range') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return emptyRangeValue()
    return {
      min: value.min !== '' && isAllowedOption(filter, value.min) ? value.min : '',
      max: value.max !== '' && isAllowedOption(filter, value.max) ? value.max : ''
    }
  }

  return getDefaultFilterValue(filter)
}

const alignFilterStateWithSchema = (filters: SearchFilterDefinition[]) => {
  const validKeys = new Set(filters.map(filter => filter.key))

  Object.keys(selectedFilters).forEach((key) => {
    if (!validKeys.has(key)) delete selectedFilters[key]
  })

  filters.forEach((filter) => {
    selectedFilters[filter.key] = getAllowedFilterValue(filter, selectedFilters[filter.key])
  })
}

const getDefaultGameValue = () => {
  return String(availableGames.value[0]?.value || '')
}

const getDefaultModeValue = () => {
  return String(availableModeOptions.value[0]?.value || '')
}

const getDefaultStaffRoleValue = () => {
  return String(availableStaffRoleOptions.value[0]?.value || '')
}

const enforceRequiredPlayerFilters = () => {
  if (profileKind.value !== 'players') return

  const gameValue = selectedGameValue.value || getDefaultGameValue()
  if (gameValue && selectedFilters.games !== gameValue) {
    selectedFilters.games = gameValue
  }

  const modeValue = selectedModeValue.value
  const modeExists = availableModeOptions.value.some(option => String(option.value) === modeValue)
  const defaultModeValue = getDefaultModeValue()

  if ((!modeValue || !modeExists) && defaultModeValue) {
    selectedFilters.modes = defaultModeValue
  }
}

const enforceRequiredStaffFilters = () => {
  if (profileKind.value !== 'staffs') return

  const allowedRoleValues = new Set(availableStaffRoleOptions.value.map(option => String(option.value)))
  const roleValues = selectedStaffRoleValues.value.filter(value => allowedRoleValues.has(value))

  if (roleValues.length) {
    if (roleValues.length !== selectedStaffRoleValues.value.length) {
      selectedFilters.roles = roleValues
    }

    return
  }

  const defaultRoleValue = getDefaultStaffRoleValue()
  if (defaultRoleValue) {
    selectedFilters.roles = [defaultRoleValue]
  }
}

const enforceRequiredTeamFilters = () => {
  if (profileKind.value !== 'teams') return

  const selectedValue = selectedGameValue.value
  const selectedGameExists = availableGames.value.some(game => String(game.value) === selectedValue)
  const gameValue = selectedGameExists ? selectedValue : getDefaultGameValue()

  if (gameValue && selectedFilters.games !== gameValue) {
    selectedFilters.games = gameValue
  }
}

const enforceRequiredSearchFilters = () => {
  enforceRequiredPlayerFilters()
  enforceRequiredStaffFilters()
  enforceRequiredTeamFilters()
}

watch(activeFilters, (filters) => {
  alignFilterStateWithSchema(filters)
  enforceRequiredSearchFilters()
}, { immediate: true })

watch([availableGames, availableModeOptions, availableStaffRoleOptions, profileKind], enforceRequiredSearchFilters, { immediate: true })

const getActiveFilterWeight = (filter: SearchFilterDefinition) => {
  const value = selectedFilters[filter.key]
  if (filter.type === 'text') return typeof value === 'string' && value ? 1 : 0
  if (filter.type === 'singleFacet') return typeof value === 'string' && value ? 1 : 0
  if (filter.type === 'multiFacet') return Array.isArray(value) ? value.length : 0
  if (filter.type === 'boolean') return value === true ? 1 : 0
  if (filter.type === 'range') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return 0
    return Number(value.min !== '') + Number(value.max !== '')
  }

  return 0
}

const activeFilterCount = computed(() => {
  return activeFilters.value.reduce((total, filter) => total + getActiveFilterWeight(filter), 0)
})

const activeFilterLabel = computed(() => {
  if (activeFilterCount.value === 0) return 'Aucun filtre actif'
  return `${activeFilterCount.value} filtre${activeFilterCount.value > 1 ? 's' : ''} actif${activeFilterCount.value > 1 ? 's' : ''}`
})

const filterButtonLabel = computed(() => {
  if (activeFilterCount.value === 0) return 'Filtres'
  return `Filtres (${activeFilterCount.value})`
})

const getFacetCount = (filter: SearchFilterDefinition, value: SearchFilterOptionValue) => {
  if (profileKind.value === 'players' || profileKind.value === 'teams') return undefined
  return activeStaticProfiles.value.filter(profile => (profile.filters[filter.key] || []).includes(String(value))).length
}

const filtersWithCounts = computed<SearchFilterDefinition[]>(() => {
  return activeFilters.value.map((filter) => {
    if (filter.type !== 'multiFacet') return filter

    return {
      ...filter,
      options: getFilterOptions(filter).map((option) => {
        const count = getFacetCount(filter, option.value)
        return typeof count === 'number' ? { ...option, count } : option
      })
    }
  })
})

const selectedResourceMode = computed(() => {
  const game = selectedResourceGame.value
  if (!game) return null

  const modeId = toPositiveInt(selectedModeValue.value)
  if (modeId) {
    return game.rscGameModes.find(mode => mode.id === modeId) || null
  }

  return game.rscGameModes.find(mode => mode.slug === selectedModeValue.value) || null
})

const getRangeFilterValue = (key: string): SearchRangeValue => {
  const value = selectedFilters[key]
  if (!value || typeof value !== 'object' || Array.isArray(value)) return emptyRangeValue()

  return value
}

const getSelectedFilterValues = (key: string) => {
  const value = selectedFilters[key]
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string' && value) return [value]
  return []
}

const getRangeBound = (key: string, side: keyof SearchRangeValue) => {
  return toPositiveInt(getRangeFilterValue(key)[side])
}

const getPositiveIds = (key: string) => {
  return getSelectedFilterValues(key)
    .map(toPositiveInt)
    .filter(id => id > 0)
}

const playerSearchQuery = computed<SearchPlayersQueryDto | null>(() => {
  if (profileKind.value !== 'players') return null

  const game = selectedResourceGame.value
  const mode = selectedResourceMode.value
  if (!game || !mode) return null

  const q = typeof selectedFilters.pseudo === 'string' ? selectedFilters.pseudo : ''
  const countryId = getSelectedFilterValues('countries')[0] || undefined
  const languageIds = getSelectedFilterValues('languages')
  const recruitable = selectedFilters.recruitable === true ? 'available' : undefined
  const query: SearchPlayersQueryDto = {
    q: q || undefined,
    page: 1,
    perPage: searchPageSize,
    gameId: game.id,
    modeId: mode.id,
    nationalityId: countryId,
    languageIds: languageIds.length ? languageIds : undefined,
    ageMin: getRangeBound('age', 'min') || undefined,
    ageMax: getRangeBound('age', 'max') || undefined,
    rankMin: getRangeBound('ranks', 'min') || undefined,
    rankMax: getRangeBound('ranks', 'max') || undefined,
    eloMin: getRangeBound('elo', 'min') || undefined,
    eloMax: getRangeBound('elo', 'max') || undefined,
    recruitable,
    positionIds: getPositiveIds('positions'),
    platformIds: getPositiveIds('platforms')
  }

  if (!query.positionIds?.length) delete query.positionIds
  if (!query.platformIds?.length) delete query.platformIds

  return query
})

const teamStatusValue = computed<SearchTeamStatus | undefined>(() => {
  const value = selectedTeamStatusValue.value
  return value === 'active' || value === 'open' || value === 'full' ? value : undefined
})

const teamSearchQuery = computed<SearchTeamsQueryDto | null>(() => {
  if (profileKind.value !== 'teams') return null
  const game = selectedResourceGame.value
  if (!game) return null

  const q = typeof selectedFilters.query === 'string' ? selectedFilters.query : ''
  const countryId = getSelectedFilterValues('countries')[0] || undefined
  const languageIds = getSelectedFilterValues('languages')
  const query: SearchTeamsQueryDto = {
    q: q || undefined,
    page: 1,
    perPage: searchPageSize,
    countryId,
    languageIds: languageIds.length ? languageIds : undefined,
    gameId: game.id,
    teamStatus: teamStatusValue.value
  }

  return query
})

const applyPlayerSearchResponse = (response: SearchPlayersPresenter) => {
  playerSearchResults.value = response.data || []
  applySearchMeta(playerSearchMeta, response.meta, playerSearchResults.value.length)
}

const applyTeamSearchResponse = (response: SearchTeamsPresenter) => {
  teamSearchResults.value = response.data || []
  applySearchMeta(teamSearchMeta, response.meta, teamSearchResults.value.length)
}

const resetPlayerSearchResponse = () => {
  playerSearchResults.value = []
  resetSearchMeta(playerSearchMeta)
}

const resetTeamSearchResponse = () => {
  teamSearchResults.value = []
  resetSearchMeta(teamSearchMeta)
}

const fetchPlayerSearch = async () => {
  const query = playerSearchQuery.value
  if (!query) {
    resetPlayerSearchResponse()
    return
  }

  const requestId = ++playerSearchRequestId
  isPlayerSearchLoading.value = true
  playerSearchError.value = ''

  try {
    const response = await $searchAPI.searchPlayers(query)
    if (requestId !== playerSearchRequestId) return

    applyPlayerSearchResponse(response)
  } catch (error) {
    if (requestId !== playerSearchRequestId) return

    resetPlayerSearchResponse()
    playerSearchError.value = error instanceof Error ? error.message : 'Impossible de charger les joueurs.'
  } finally {
    if (requestId === playerSearchRequestId) {
      isPlayerSearchLoading.value = false
    }
  }
}

const fetchTeamSearch = async () => {
  const query = teamSearchQuery.value
  if (!query) {
    resetTeamSearchResponse()
    return
  }

  const requestId = ++teamSearchRequestId
  isTeamSearchLoading.value = true
  teamSearchError.value = ''

  try {
    const response = await $searchAPI.searchTeams(query)
    if (requestId !== teamSearchRequestId) return

    applyTeamSearchResponse(response)
  } catch (error) {
    if (requestId !== teamSearchRequestId) return

    resetTeamSearchResponse()
    teamSearchError.value = error instanceof Error ? error.message : 'Impossible de charger les equipes.'
  } finally {
    if (requestId === teamSearchRequestId) {
      isTeamSearchLoading.value = false
    }
  }
}

const queuePlayerSearch = (delay = 220) => {
  if (playerSearchDebounceTimer) {
    clearTimeout(playerSearchDebounceTimer)
  }

  playerSearchDebounceTimer = setTimeout(() => {
    playerSearchDebounceTimer = null
    void fetchPlayerSearch()
  }, delay)
}

const queueTeamSearch = (delay = 220) => {
  if (teamSearchDebounceTimer) {
    clearTimeout(teamSearchDebounceTimer)
  }

  teamSearchDebounceTimer = setTimeout(() => {
    teamSearchDebounceTimer = null
    void fetchTeamSearch()
  }, delay)
}

const visiblePlayers = computed(() => {
  return playerSearchResults.value
})

const visibleStaffProfiles = computed(() => {
  return [] // TODO: Use SearchStaffPresenter when available from API
})

const visibleTeamProfiles = computed(() => {
  return teamSearchResults.value
})

const visibleResultCount = computed(() => {
  if (profileKind.value === 'players') return visiblePlayers.value.length
  if (profileKind.value === 'staffs') return visibleStaffProfiles.value.length
  return visibleTeamProfiles.value.length
})

const resultsLabel = computed(() => {
  const total = profileKind.value === 'players'
    ? playerSearchMeta.found
    : profileKind.value === 'teams'
      ? teamSearchMeta.found
      : visibleResultCount.value
  const singular = typeof resultSingular.value === 'string' ? resultSingular.value : 'joueur'
  const plural = typeof resultPlural.value === 'string' ? resultPlural.value : 'joueurs'
  const totalNum = Number(total) || 0
  return `${totalNum} ${totalNum > 1 ? plural : singular}`
})

const topLabel = computed(() => {
  const value = topGameLabel.value
  return typeof value === 'string' ? value : ''
})

const emptySearchMessage = computed(() => {
  if (profileKind.value === 'players') {
    if (isPlayerSearchLoading.value) return 'Chargement des joueurs.'
    if (playerSearchError.value) return playerSearchError.value
  }

  if (profileKind.value === 'teams') {
    if (isTeamSearchLoading.value) return 'Chargement des equipes.'
    if (teamSearchError.value) return teamSearchError.value
  }

  return emptyMessage
})

const topGameLabel = computed(() => {
  const option = searchGameOptions.find(item => item.value === selectedGameValue.value)
  const fallback = availableGames.value.find(item => item.value === selectedGameValue.value)

  if (selectedGameValue.value) return option?.label || fallback?.label || 'Jeu selectionne'
  if (profileKind.value === 'players') return availableGames.value[0]?.label || 'Jeu requis'

  return 'Tous les jeux'
})

const toggleGameFilter = (value: string) => {
  if (profileKind.value === 'players') {
    if (selectedGameValue.value === value) return

    selectedFilters.games = value
    selectedFilters.modes = ''
    selectedFilters.platforms = []
    selectedFilters.positions = []
    selectedFilters.ranks = emptyRangeValue()
    selectedFilters.elo = emptyRangeValue()
    enforceRequiredSearchFilters()
    return
  }

  if (profileKind.value === 'teams') {
    if (selectedGameValue.value === value) return

    selectedFilters.games = value
    return
  }

  selectedFilters.games = selectedGameValue.value === value ? '' : value
}

const toggleModeFilter = (value: string) => {
  if (profileKind.value === 'players') {
    selectedFilters.modes = value
    enforceRequiredSearchFilters()
    return
  }

  const nextValues = selectedModeValues.value.includes(value)
    ? selectedModeValues.value.filter(item => item !== value)
    : [...selectedModeValues.value, value]

  selectedFilters.modes = nextValues
}

const toggleTeamStatusFilter = (value: string) => {
  if (profileKind.value !== 'teams') return

  selectedFilters.teamStatus = selectedTeamStatusValue.value === value ? '' : value
}

const toggleStaffRoleFilter = (value: string) => {
  if (profileKind.value !== 'staffs') return

  const nextValues = selectedStaffRoleValues.value.includes(value)
    ? selectedStaffRoleValues.value.filter(item => item !== value)
    : [...selectedStaffRoleValues.value, value]

  if (!nextValues.length) return

  selectedFilters.roles = nextValues
}

const resetFilters = () => {
  Object.keys(selectedFilters).forEach(key => delete selectedFilters[key])
  activeFilters.value.forEach((filter) => {
    selectedFilters[filter.key] = filter.key === 'games' && profileKind.value !== 'players' ? '' : getDefaultFilterValue(filter)
  })
  enforceRequiredSearchFilters()
}

const updateSelectedFilters = (filters: SearchFilterState) => {
  Object.keys(selectedFilters).forEach(key => delete selectedFilters[key])
  Object.assign(selectedFilters, filters)
  alignFilterStateWithSchema(activeFilters.value)
  enforceRequiredSearchFilters()
}

const getHandleProfilePath = (handle: string) => {
  return `${props.profilePathPrefix}/${handle.replace('@', '')}`
}

const getPlayerProfilePath = (player: SearchPlayerPresenter) => {
  return `${props.profilePathPrefix}/${player.slug}`
}

const getTeamProfilePath = (team: SearchTeamPresenter) => {
  return `${props.profilePathPrefix}/${team.slug}`
}

const openFilterModal = async () => {
  isFilterModalOpen.value = !isFilterModalOpen.value
}

watch(playerSearchQuery, (query) => {
  if (!import.meta.client || profileKind.value !== 'players') return

  if (!query) {
    resetPlayerSearchResponse()
    return
  }

  queuePlayerSearch()
}, { deep: true, immediate: true })

watch(teamSearchQuery, (query) => {
  if (!import.meta.client || profileKind.value !== 'teams') return

  if (!query) {
    resetTeamSearchResponse()
    return
  }

  queueTeamSearch()
}, { deep: true, immediate: true })

onMounted(async () => {
  if (profileKind.value !== 'players' && profileKind.value !== 'teams') return

  if (!resourcesStore.loaded && !resourcesStore.loading) {
    await resourcesStore.bootstrap()
  }

  enforceRequiredSearchFilters()
})

onBeforeUnmount(() => {
  if (playerSearchDebounceTimer) {
    clearTimeout(playerSearchDebounceTimer)
    playerSearchDebounceTimer = null
  }

  if (teamSearchDebounceTimer) {
    clearTimeout(teamSearchDebounceTimer)
    teamSearchDebounceTimer = null
  }
})

</script>

<style scoped>
.profile-search-page__action-groups {
  flex: 1 1 100%;
  width: 100%;
  list-style: none;
}

.profile-search-page__action-group {
  gap: var(--search-space-2);

  @apply grid;
}

.profile-search-page__action-group + .profile-search-page__action-group {
  margin-top: var(--search-space-3);
}

.profile-search-page__action-label {
  margin: 0;
  color: var(--search-color-muted);
  font-size: var(--search-font-small);
  line-height: var(--search-line-base);

  @apply font-semibold;
}

.profile-search-page__action-buttons {
  gap: var(--search-space-2);

  @apply flex flex-wrap;
}
</style>
