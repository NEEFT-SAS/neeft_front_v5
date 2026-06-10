<template>
  <SearchPageLayout
    layout-theme="app"
    filter-presentation="sidebar"
    image-src="/images/landing/competition-arena.jpg"
    title-id="marketplace-title"
    actions-label="Categories de services"
    results-count-id="marketplace-results-count"
    eyebrow="Marketplace"
    title="Services esport pour avancer plus vite"
    description="Trouve un community manager, un coach, un manager ou un expert operationnel pour structurer ton projet."
    :results-label="resultsLabel"
    :top-label="topLabel"
    :show-header-summary="false"
    show-toolbar-summary
    :show-toolbar-count="false"
    show-filter-button
    :filter-button-label="filterButtonLabel"
    filter-controls-id="marketplace-filters-title"
    :is-filter-modal-open="isFilterModalOpen"
    :show-sort-control="false"
    :has-results="hasMarketplaceResults"
    result-list-describedby=""
    :empty-message="emptySearchMessage"
    @open-filters="openFilterModal"
  >
    <template #filters>
      <SearchFilterSidebar
        v-model="isFilterModalOpen"
        :active-filter-count="activeFilterCount"
        :active-filter-label="activeFilterLabel"
        controls-id="marketplace-filters-title"
        :filters="filtersWithCounts"
        :filter-values="selectedFilters"
        id-prefix="marketplace"
        theme="app"
        @update:filter-values="updateSelectedFilters"
        @reset="resetFilters"
      />
    </template>

    <template #actions>
      <li class="profile-search-page__action-groups">
        <div class="profile-search-page__action-group">
          <p class="profile-search-page__action-label">
            Categories
          </p>

          <div class="profile-search-page__action-buttons">
            <CustomButton
              v-for="category in marketplaceCategoryActionOptions"
              :key="category.value"
              :label="category.label"
              :left-icon="category.icon"
              theme="app"
              variant="outlined"
              color="secondary"
              size="lg"
              :selected="activeCategoryButtonValue === category.value"
              :aria-pressed="activeCategoryButtonValue === category.value"
              @click="toggleCategoryFilter(String(category.value))"
            />
          </div>
        </div>

        <div class="profile-search-page__action-group">
          <p class="profile-search-page__action-label">
            Suivi
          </p>

          <div class="profile-search-page__action-buttons">
            <CustomLink
              label="Mes achats"
              to="/marketplace/orders"
              left-icon="lucide:shopping-bag"
              theme="app"
              variant="outlined"
              color="secondary"
              size="lg"
            />
            <CustomLink
              label="Mes ventes"
              to="/marketplace/sales"
              left-icon="lucide:inbox"
              theme="app"
              variant="outlined"
              color="secondary"
              size="lg"
            />
            <CustomLink
              label="Mes services"
              to="/marketplace/services"
              left-icon="lucide:store"
              theme="app"
              variant="outlined"
              color="secondary"
              size="lg"
            />
          </div>
        </div>
      </li>
    </template>

    <template #results>
      <li v-if="isServicesPending" class="marketplace-page-state" aria-live="polite">
        <Icon name="lucide:loader-circle" aria-hidden="true" />
        <span>Chargement des services...</span>
      </li>
      <li v-else-if="servicesError" class="marketplace-page-state marketplace-page-state--error" aria-live="polite">
        <Icon name="lucide:circle-alert" aria-hidden="true" />
        <span>Impossible de charger les services marketplace.</span>
        <CustomButton label="Reessayer" theme="app" variant="outlined" color="secondary" size="sm" @click="refreshMarketplaceServices" />
      </li>
      <template v-else>
        <li v-for="service in visibleServices" :key="service.slug">
          <MarketplaceServiceCard :service="service" />
        </li>
      </template>
    </template>

    <template #empty>
      {{ emptySearchMessage }}
    </template>
  </SearchPageLayout>
</template>

<script setup lang="ts">
import type { MarketplaceServiceListItemPresenter } from '~/plugins/marketplace-api'
import type { SearchFilterDefinition, SearchFilterOption, SearchFilterOptionValue, SearchFilterState, SearchFilterValue, SearchRangeValue } from '~/datas/searchs'

definePageMeta({
  layout: 'app'
})

useSeoMeta({
  title: 'Marketplace esport',
  description: 'Services esport pour trouver un community manager, un coach, un manager ou un expert operationnel.',
  ogTitle: 'Marketplace esport',
  ogDescription: 'Services esport pour structurer un projet joueur, equipe ou staff.',
  ogImage: '/images/landing/competition-arena.jpg',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/landing/competition-arena.jpg'
})

const { $marketplaceAPI } = useNuxtApp()
const { data: marketplaceServiceData, pending: isServicesPending, error: servicesError, refresh } = await useAsyncData('marketplace-services', async () => {
  const response = await $marketplaceAPI.services.search({ limit: 100 })
  return response.data
})

const marketplaceServiceList = computed(() => marketplaceServiceData.value || [])
const refreshMarketplaceServices = () => refresh()

const emptyRangeValue = (): SearchRangeValue => ({
  min: '',
  max: ''
})

const buildNumberOptions = (
  values: number[],
  formatLabel: (value: number) => string
): SearchFilterOption[] => {
  return values.map(value => ({
    label: formatLabel(value),
    value
  }))
}

const priceOptions = buildNumberOptions(
  [0, 100, 200, 300, 400, 500, 600, 700],
  value => `${value} EUR`
)

const ratingOptions = buildNumberOptions(
  [4.5, 4.6, 4.7, 4.8, 4.9, 5],
  value => `${value.toFixed(1).replace('.', ',')}/5`
)

const getCategoryValue = (category: MarketplaceServiceListItemPresenter['rscCategories'][number]) => {
  return category.slug || category.id || category.label
}

const getServiceCategoryValues = (service: MarketplaceServiceListItemPresenter) => {
  return (service.rscCategories || [])
    .map(getCategoryValue)
    .filter(Boolean)
}

const marketplaceCategoryOptions = computed<SearchFilterOption[]>(() => {
  const categoryOptions = new Map<string, SearchFilterOption>()

  marketplaceServiceList.value.forEach((service) => {
    service.rscCategories?.forEach((category) => {
      const value = getCategoryValue(category)
      if (!value || categoryOptions.has(value)) return

      categoryOptions.set(value, {
        label: category.label,
        value,
        icon: category.icon || undefined
      })
    })
  })

  return [...categoryOptions.values()].sort((left, right) => String(left.label).localeCompare(String(right.label), 'fr-FR'))
})

const marketplaceCategoryActionOptions = computed<SearchFilterOption[]>(() => [
  { label: 'Tous les services', value: 'all', icon: 'lucide:layout-grid' },
  ...marketplaceCategoryOptions.value
])

const activeFilters = computed<SearchFilterDefinition[]>(() => {
  const filters: SearchFilterDefinition[] = [{
    key: 'query',
    type: 'text',
    label: 'Service',
    field: 'query',
    icon: 'lucide:search',
    placeholder: 'Coach, manager, video...'
  }]

  if (marketplaceCategoryOptions.value.length) {
    filters.push({
      key: 'categories',
      type: 'multiFacet',
      label: 'Categories',
      field: 'rscCategories',
      icon: 'lucide:layout-grid',
      options: marketplaceCategoryOptions.value
    })
  }

  filters.push({
    key: 'price',
    type: 'range',
    label: 'Prix',
    field: 'price',
    icon: 'lucide:badge-euro',
    minLabel: 'Prix minimum',
    maxLabel: 'Prix maximum',
    minPlaceholder: 'Min',
    maxPlaceholder: 'Max',
    options: priceOptions
  })

  filters.push({
    key: 'rating',
    type: 'range',
    label: 'Note',
    field: 'rating',
    icon: 'lucide:star',
    minLabel: 'Note minimum',
    maxLabel: 'Note maximum',
    minPlaceholder: 'Min',
    maxPlaceholder: 'Max',
    options: ratingOptions
  })

  return filters
})

const selectedFilters = reactive<SearchFilterState>({})
const isFilterModalOpen = ref(false)

const getFilterOptions = (filter: SearchFilterDefinition) => {
  if (!('options' in filter)) return []
  return filter.options || []
}

const isAllowedOption = (filter: SearchFilterDefinition, value: unknown) => {
  const options = getFilterOptions(filter)
  if (!options.length) return true
  return options.some(option => String(option.value) === String(value))
}

const getDefaultFilterValue = (filter: SearchFilterDefinition): SearchFilterValue => {
  if (filter.type === 'multiFacet') return []
  if (filter.type === 'boolean') return false
  if (filter.type === 'range') return emptyRangeValue()
  return ''
}

const getAllowedFilterValue = (
  filter: SearchFilterDefinition,
  value: SearchFilterValue | undefined
): SearchFilterValue => {
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

const alignFilterStateWithSchema = () => {
  const validKeys = new Set(activeFilters.value.map(filter => filter.key))

  Object.keys(selectedFilters).forEach((key) => {
    if (!validKeys.has(key)) delete selectedFilters[key]
  })

  activeFilters.value.forEach((filter) => {
    selectedFilters[filter.key] = getAllowedFilterValue(filter, selectedFilters[filter.key])
  })
}

watch(activeFilters, () => alignFilterStateWithSchema(), { immediate: true })

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

const getFacetCount = (value: SearchFilterOptionValue) => {
  return marketplaceServiceList.value.filter(service => getServiceCategoryValues(service).includes(String(value))).length
}

const filtersWithCounts = computed<SearchFilterDefinition[]>(() => {
  return activeFilters.value.map((filter) => {
    if (filter.type !== 'multiFacet') return filter

    return {
      ...filter,
      options: getFilterOptions(filter).map(option => ({
        ...option,
        count: getFacetCount(option.value)
      }))
    }
  })
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

const toNumberOrNull = (value: SearchFilterOptionValue | '') => {
  if (value === '') return null
  const numberValue = Number(value)
  return Number.isFinite(numberValue) ? numberValue : null
}

const selectedCategoryValues = computed(() => getSelectedFilterValues('categories'))

const activeCategoryButtonValue = computed(() => {
  if (selectedCategoryValues.value.length === 0) return 'all'
  if (selectedCategoryValues.value.length === 1) return selectedCategoryValues.value[0]
  return ''
})

const activeCategoryLabel = computed(() => {
  if (selectedCategoryValues.value.length === 0) return 'Tous les services'

  if (selectedCategoryValues.value.length > 1) {
    return `${selectedCategoryValues.value.length} categories`
  }

  return marketplaceCategoryOptions.value.find(category => String(category.value) === selectedCategoryValues.value[0])?.label || 'Categorie'
})

const normalizeSearch = (value: string) => value
  .toLocaleLowerCase('fr-FR')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')

const getServiceMinPrice = (service: MarketplaceServiceListItemPresenter) => {
  const prices = (service.offers || [])
    .map(offer => Number(offer.price))
    .filter(price => Number.isFinite(price))

  return prices.length ? Math.min(...prices) : 0
}

const serviceMatchesSearch = (service: MarketplaceServiceListItemPresenter, query: string) => {
  if (!query) return true

  const serviceIndex = normalizeSearch([
    service.title,
    service.shortDescription,
    service.seller?.username || '',
    ...service.rscCategories.flatMap(category => [category.label, category.slug || '']),
    ...service.rscGames.flatMap(game => [game.name, game.shortName || '', game.slug]),
    ...service.offers.flatMap(offer => [offer.title, offer.description])
  ].join(' '))

  return serviceIndex.includes(query)
}

const serviceMatchesRange = (serviceValue: number, range: SearchRangeValue) => {
  const min = toNumberOrNull(range.min)
  const max = toNumberOrNull(range.max)

  if (min !== null && serviceValue < min) return false
  if (max !== null && serviceValue > max) return false
  return true
}

const sortServices = (services: MarketplaceServiceListItemPresenter[]) => {
  return [...services].sort((left, right) => {
    const leftScore = left.rating * left.reviewCount
    const rightScore = right.rating * right.reviewCount

    return rightScore - leftScore || right.rating - left.rating || getServiceMinPrice(left) - getServiceMinPrice(right)
  })
}

const visibleServices = computed(() => {
  const queryValue = selectedFilters.query
  const query = normalizeSearch(typeof queryValue === 'string' ? queryValue.trim() : '')
  const priceRange = getRangeFilterValue('price')
  const ratingRange = getRangeFilterValue('rating')

  const filteredServices = marketplaceServiceList.value.filter((service) => {
    const serviceCategoryValues = getServiceCategoryValues(service)
    const matchesCategory = selectedCategoryValues.value.length === 0 || selectedCategoryValues.value.some(value => serviceCategoryValues.includes(value))
    const matchesSearch = serviceMatchesSearch(service, query)
    const matchesPrice = serviceMatchesRange(getServiceMinPrice(service), priceRange)
    const matchesRating = serviceMatchesRange(service.rating, ratingRange)

    return matchesCategory && matchesSearch && matchesPrice && matchesRating
  })

  return sortServices(filteredServices)
})

const resultsLabel = computed(() => {
  const total = visibleServices.value.length
  return `${total} service${total > 1 ? 's' : ''}`
})

const topLabel = computed(() => activeCategoryLabel.value)
const hasMarketplaceResults = computed(() => isServicesPending.value || Boolean(servicesError.value) || visibleServices.value.length > 0)
const emptySearchMessage = computed(() => isServicesPending.value ? 'Chargement des services...' : servicesError.value ? 'Impossible de charger les services marketplace.' : 'Aucun service ne correspond a cette recherche.')

const toggleCategoryFilter = (value: string) => {
  if (value === 'all') {
    selectedFilters.categories = []
    return
  }

  selectedFilters.categories = activeCategoryButtonValue.value === value ? [] : [value]
}

const resetFilters = () => {
  Object.keys(selectedFilters).forEach(key => delete selectedFilters[key])
  activeFilters.value.forEach((filter) => {
    selectedFilters[filter.key] = getDefaultFilterValue(filter)
  })
}

const updateSelectedFilters = (filters: SearchFilterState) => {
  Object.keys(selectedFilters).forEach(key => delete selectedFilters[key])
  Object.assign(selectedFilters, filters)
  alignFilterStateWithSchema()
}

const openFilterModal = () => {
  isFilterModalOpen.value = !isFilterModalOpen.value
}
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

.marketplace-page-state {
  display: grid;
  justify-items: center;
  gap: var(--search-space-2);
  padding: var(--search-space-6, 48px) var(--search-space-3, 24px);
  color: var(--search-color-muted);
  text-align: center;
  list-style: none;
}

.marketplace-page-state svg {
  width: calc(var(--search-unit, 8px) * 5);
  height: calc(var(--search-unit, 8px) * 5);
  color: var(--search-color-subtle);
}

.marketplace-page-state--error svg {
  color: var(--color-danger);
}
</style>
