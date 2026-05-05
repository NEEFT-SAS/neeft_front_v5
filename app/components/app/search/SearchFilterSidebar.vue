<template>
  <Transition name="search-filter-sidebar-layer" :duration="420">
    <div v-if="props.modelValue" class="search-filter-sidebar__layer">
      <button
        class="search-filter-sidebar__backdrop"
        type="button"
        :aria-label="closeLabel"
        @click="updateSidebarVisibility(false)"
      />

      <aside
        :id="props.controlsId"
        class="search-filter-sidebar"
        :aria-labelledby="panelHeadingId"
        @keydown.esc="updateSidebarVisibility(false)"
      >
        <div class="search-filter-sidebar__surface">
          <header class="search-filter-sidebar__header">
            <div class="search-filter-sidebar__heading">
              <div class="search-filter-sidebar__title">
                <CustomIcon icon="lucide:list-checks" size="sm" color="primary" shape="ghost" />
                <h2 :id="panelHeadingId">
                  {{ title }}
                </h2>
              </div>

              <p>
                {{ props.activeFilterLabel }}
              </p>
            </div>

            <button
              class="search-filter-sidebar__close"
              type="button"
              :aria-label="closeLabel"
              @click="updateSidebarVisibility(false)"
            >
              <Icon name="lucide:x" aria-hidden="true" />
            </button>
          </header>

          <form class="search-filter-sidebar__form" @submit.prevent>
            <section
              v-for="filter in props.filters"
              :key="filter.key"
              class="search-filter-sidebar__section"
              :aria-label="filter.label"
            >
              <CustomInputText
                v-if="filter.type === 'text'"
                :id="`${props.idPrefix}-${filter.key}`"
                :model-value="getTextValue(filter.key)"
                :name="filter.key"
                :label="filter.label"
                :placeholder="filter.placeholder"
                left-icon="lucide:search"
                type="text"
                size="md"
                autocomplete="off"
                @update:model-value="value => updateTextFilter(filter.key, value)"
              />

              <CustomInputSelection
                v-else-if="filter.type === 'singleFacet'"
                :id="`${props.idPrefix}-${filter.key}`"
                :model-value="getSingleValue(filter.key)"
                :name="filter.key"
                :label="filter.label"
                :placeholder="selectPlaceholder"
                :options="getOptions(filter)"
                :searchable="filter.searchable === true"
                size="md"
                @update:model-value="value => updateSingleFilter(filter.key, value)"
              />

              <CustomInputMultiselect
                v-else-if="filter.type === 'multiFacet'"
                :id="`${props.idPrefix}-${filter.key}`"
                :model-value="getMultiValue(filter.key)"
                :name="filter.key"
                :label="filter.label"
                :placeholder="selectPlaceholder"
                :options="getOptions(filter)"
                :searchable="filter.searchable === true"
                size="md"
                @update:model-value="value => updateMultiSelectionFilter(filter.key, value)"
              />

              <CustomInputSelection
                v-else-if="filter.type === 'boolean'"
                :id="`${props.idPrefix}-${filter.key}`"
                :model-value="getBooleanSelectionValue(filter.key, filter)"
                :name="filter.key"
                :label="filter.label"
                :placeholder="selectPlaceholder"
                :options="getBooleanOptions(filter)"
                size="md"
                @update:model-value="value => updateBooleanSelectionFilter(filter.key, filter, value)"
              />

              <div v-else-if="filter.type === 'range'" class="search-filter-sidebar__range">
                <CustomInputSelection
                  :id="`${props.idPrefix}-${filter.key}-min`"
                  :model-value="getRangeValue(filter.key).min"
                  :name="`${filter.key}-min`"
                  :label="filter.minLabel"
                  :placeholder="filter.minPlaceholder"
                  :options="getOptions(filter)"
                  searchable
                  size="md"
                  @update:model-value="value => updateRangeFilter(filter.key, 'min', value)"
                />
                <CustomInputSelection
                  :id="`${props.idPrefix}-${filter.key}-max`"
                  :model-value="getRangeValue(filter.key).max"
                  :name="`${filter.key}-max`"
                  :label="filter.maxLabel"
                  :placeholder="filter.maxPlaceholder"
                  :options="getOptions(filter)"
                  searchable
                  size="md"
                  @update:model-value="value => updateRangeFilter(filter.key, 'max', value)"
                />
              </div>
            </section>
          </form>

          <div class="search-filter-sidebar__footer">
            <CustomButton
              :label="resetLabel"
              :theme="props.theme"
              variant="outlined"
              color="secondary"
              size="md"
              :disabled="props.activeFilterCount === 0"
              @click="emit('reset')"
            />
          </div>

        </div>
      </aside>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type PropType } from 'vue'
import type { SearchFilterDefinition, SearchFilterOption, SearchFilterState, SearchRangeValue } from '~/datas/searchs'

const emptyRangeValue = (): SearchRangeValue => ({
  min: '',
  max: ''
})

const { t } = useI18n()

const props = defineProps({
  activeFilterCount: { type: Number, required: true },
  activeFilterLabel: { type: String, required: true },
  closeLabel: { type: String, default: '' },
  controlsId: { type: String, default: 'search-filters-title' },
  filters: {
    type: Array as PropType<SearchFilterDefinition[]>,
    required: true
  },
  filterValues: {
    type: Object as PropType<SearchFilterState>,
    required: true
  },
  idPrefix: { type: String, default: 'search-filters' },
  modelValue: { type: Boolean, default: false },
  resetLabel: { type: String, default: '' },
  selectPlaceholder: { type: String, default: '' },
  theme: {
    type: String,
    default: 'landing',
    validator: (value: string) => ['landing', 'app'].includes(value)
  },
  title: { type: String, default: '' }
})

const closeLabel = computed(() => props.closeLabel || t('app.search.filters.closeLabel'))
const resetLabel = computed(() => props.resetLabel || t('app.search.filters.resetLabel'))
const selectPlaceholder = computed(() => props.selectPlaceholder || t('app.search.filters.selectPlaceholder'))
const title = computed(() => props.title || t('app.search.filters.title'))

const emit = defineEmits(['reset', 'update:modelValue', 'update:filterValues'])

const panelHeadingId = computed(() => `${props.controlsId}-heading`)
const compactSidebarQuery = '(max-width: 1024px)'
const isCompactSidebarViewport = ref(false)

let sidebarMediaQuery: MediaQueryList | null = null

const updateSidebarVisibility = (value: boolean) => {
  emit('update:modelValue', value)
}

const syncCompactSidebarViewport = (matches: boolean) => {
  isCompactSidebarViewport.value = matches
}

const onCompactSidebarChange = (event: MediaQueryListEvent) => {
  syncCompactSidebarViewport(event.matches)
}

const closeSidebarAfterSelection = () => {
  if (!props.modelValue || !isCompactSidebarViewport.value) return

  if (typeof window !== 'undefined') {
    window.requestAnimationFrame(() => updateSidebarVisibility(false))
    return
  }

  updateSidebarVisibility(false)
}

const getOptions = (filter: SearchFilterDefinition): SearchFilterOption[] => {
  if (!('options' in filter)) return []
  return filter.options || []
}

const getBooleanOptions = (filter: SearchFilterDefinition): SearchFilterOption[] => {
  if (filter.type !== 'boolean') return []

  return [
    { label: props.selectPlaceholder, value: '' },
    { label: filter.optionLabel, value: filter.trueValue }
  ]
}

const emitFilterValue = (key: string, value: SearchFilterState[string]) => {
  emit('update:filterValues', {
    ...props.filterValues,
    [key]: value
  })
}

const getTextValue = (key: string) => {
  const value = props.filterValues[key]
  return typeof value === 'string' ? value : ''
}

const getSingleValue = (key: string) => {
  const value = props.filterValues[key]
  return typeof value === 'string' ? value : ''
}

const getBooleanSelectionValue = (key: string, filter: SearchFilterDefinition) => {
  if (filter.type !== 'boolean') return ''
  return props.filterValues[key] === true ? filter.trueValue : ''
}

const getMultiValue = (key: string) => {
  const value = props.filterValues[key]
  return Array.isArray(value) ? value : []
}

const getRangeValue = (key: string): SearchRangeValue => {
  const value = props.filterValues[key]
  if (!value || typeof value !== 'object' || Array.isArray(value)) return emptyRangeValue()
  return {
    min: value.min,
    max: value.max
  }
}

const updateTextFilter = (key: string, value: string) => {
  emitFilterValue(key, value)
}

const updateSingleFilter = (key: string, value: unknown) => {
  emitFilterValue(key, typeof value === 'number' ? String(value) : String(value || ''))
  closeSidebarAfterSelection()
}

const updateMultiSelectionFilter = (key: string, value: unknown) => {
  const nextValues = Array.isArray(value)
    ? value.map(selectedValue => String(selectedValue || '')).filter(Boolean)
    : []

  emitFilterValue(key, nextValues)
  closeSidebarAfterSelection()
}

const updateBooleanSelectionFilter = (key: string, filter: SearchFilterDefinition, value: unknown) => {
  if (filter.type !== 'boolean') return

  emitFilterValue(key, String(value || '') === String(filter.trueValue))
  closeSidebarAfterSelection()
}

const updateRangeFilter = (key: string, side: keyof SearchRangeValue, value: unknown) => {
  emitFilterValue(key, {
    ...getRangeValue(key),
    [side]: typeof value === 'number' ? value : String(value || '')
  })
}

onMounted(() => {
  if (typeof window === 'undefined') return

  sidebarMediaQuery = window.matchMedia(compactSidebarQuery)
  syncCompactSidebarViewport(sidebarMediaQuery.matches)

  if (typeof sidebarMediaQuery.addEventListener === 'function') {
    sidebarMediaQuery.addEventListener('change', onCompactSidebarChange)
    return
  }

  sidebarMediaQuery.addListener(onCompactSidebarChange)
})

onBeforeUnmount(() => {
  if (!sidebarMediaQuery) return

  if (typeof sidebarMediaQuery.removeEventListener === 'function') {
    sidebarMediaQuery.removeEventListener('change', onCompactSidebarChange)
    return
  }

  sidebarMediaQuery.removeListener(onCompactSidebarChange)
})
</script>

<style scoped>
.search-filter-sidebar,
.search-filter-sidebar__surface {
  --search-filter-sidebar-range-column-min: calc(var(--search-unit) * 24);
  --search-filter-sidebar-mobile-width: calc(var(--search-sidebar-width) + var(--search-space-12));
  --search-filter-sidebar-border-color: color-mix(in oklch, var(--search-color-panel-line) 78%, var(--search-color-transparent));
  --search-filter-sidebar-action-bg: color-mix(in oklch, var(--search-color-panel) 88%, var(--search-color-transparent));
  --search-filter-sidebar-action-hover-bg: color-mix(in oklch, var(--search-color-panel) 78%, var(--search-color-accent));
}

.search-filter-sidebar__backdrop {
  display: none;
}

.search-filter-sidebar__layer {
  display: flex;
  flex: 0 0 var(--search-sidebar-width);
  width: var(--search-sidebar-width);
  max-width: 100%;
  min-width: 0;
  margin-inline-end: 0;
  align-self: stretch;
}

.search-filter-sidebar {
  box-sizing: border-box;
  position: relative;
  top: auto;
  flex: none;
  width: var(--search-sidebar-width);
  max-width: var(--search-sidebar-width);
  min-height: 100%;
  padding-inline-end: var(--search-space-4);
  border-inline-end: var(--search-border) solid var(--search-filter-sidebar-border-color);
  align-self: stretch;
  display: flex;
  z-index: 21;
}

.search-filter-sidebar__surface {
  box-sizing: border-box;
  border: 0;
  border-radius: 0;
  background-color: transparent;
  box-shadow: none;
  overflow: visible;
  flex: 1 1 auto;
  min-height: 100%;
  max-block-size: none;
  min-block-size: 0;
  align-content: start;
  gap: var(--search-space-4);

  @apply grid;
}

.search-filter-sidebar-layer-enter-active,
.search-filter-sidebar-layer-leave-active {
  overflow: hidden;
  transition:
    flex-basis 0.42s cubic-bezier(0.16, 1, 0.3, 1),
    width 0.42s cubic-bezier(0.16, 1, 0.3, 1),
    max-width 0.42s cubic-bezier(0.16, 1, 0.3, 1),
    margin-inline-end 0.42s cubic-bezier(0.16, 1, 0.3, 1);
}

.search-filter-sidebar__header {
  gap: var(--search-space-3);
  padding: 0 0 var(--search-space-4);
  border-bottom: 0;
  background-color: transparent;

  @apply flex items-start justify-between;
}

.search-filter-sidebar__heading {
  gap: var(--search-space-1);

  @apply grid;
}

.search-filter-sidebar__title {
  gap: var(--search-space-2);

  @apply flex items-center;
}

.search-filter-sidebar__title h2 {
  margin: 0;
  color: var(--search-color-text);
  font-size: var(--search-font-section-title);
  line-height: var(--search-line-tight);

  @apply font-semibold;
}

.search-filter-sidebar__heading p {
  margin: 0;
  color: var(--search-color-muted);
  font-size: var(--search-font-small);
  line-height: var(--search-line-base);
}

.search-filter-sidebar__close {
  width: var(--search-hit-size);
  min-width: var(--search-hit-size);
  height: var(--search-hit-size);
  padding: 0;
  border: var(--search-border) solid var(--search-filter-sidebar-border-color);
  border-radius: var(--search-radius);
  background-color: var(--search-filter-sidebar-action-bg);
  color: var(--search-color-text);
  transition-duration: 0.15s;

  @apply inline-flex shrink-0 items-center justify-center transition-colors;
}

.search-filter-sidebar__close:hover {
  border-color: color-mix(in oklch, var(--search-color-panel-line) 54%, var(--search-color-accent));
  background-color: var(--search-filter-sidebar-action-hover-bg);
  color: var(--search-color-accent);
}

.search-filter-sidebar__close:focus-visible {
  outline: calc(var(--search-border) * 2) solid color-mix(in oklch, var(--search-color-accent) 72%, var(--search-color-transparent));
  outline-offset: calc(var(--search-border) * 2);
}

.search-filter-sidebar__close svg {
  width: calc(var(--search-unit) * 2.4);
  height: calc(var(--search-unit) * 2.4);
}

.search-filter-sidebar__form {
  min-height: 0;
  overflow: visible;
  overscroll-behavior: contain;
  background-color: transparent;

  @apply grid;
}

.search-filter-sidebar__footer {
  padding-top: var(--search-space-3);
  border-top: var(--search-border) solid var(--search-filter-sidebar-border-color);
  background-color: transparent;

  @apply grid;
}

.search-filter-sidebar__section {
  gap: var(--search-space-2);
  padding: 0 0 var(--search-space-4);
  border-block-start: 0;
  align-content: start;

  @apply grid;
}

.search-filter-sidebar__range {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--search-filter-sidebar-range-column-min)), 1fr));
  gap: var(--search-space-2);

  @apply grid;
}

.search-filter-sidebar-layer-enter-active .search-filter-sidebar__backdrop,
.search-filter-sidebar-layer-leave-active .search-filter-sidebar__backdrop {
  transition:
    opacity 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    backdrop-filter 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}

.search-filter-sidebar-layer-enter-active .search-filter-sidebar,
.search-filter-sidebar-layer-leave-active .search-filter-sidebar {
  will-change: opacity, transform;
  transition:
    opacity 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.42s cubic-bezier(0.16, 1, 0.3, 1);
}

.search-filter-sidebar-layer-enter-active .search-filter-sidebar__surface,
.search-filter-sidebar-layer-leave-active .search-filter-sidebar__surface {
  will-change: transform;
  transition: transform 0.42s cubic-bezier(0.16, 1, 0.3, 1);
}

.search-filter-sidebar-layer-enter-from .search-filter-sidebar__backdrop,
.search-filter-sidebar-layer-leave-to .search-filter-sidebar__backdrop {
  opacity: 0;
  backdrop-filter: blur(0);
}

.search-filter-sidebar-layer-enter-from,
.search-filter-sidebar-layer-leave-to {
  flex-basis: 0;
  width: 0;
  max-width: 0;
  margin-inline-end: calc(var(--search-space-4) * -1);
}

.search-filter-sidebar-layer-enter-from .search-filter-sidebar,
.search-filter-sidebar-layer-leave-to .search-filter-sidebar {
  opacity: 0;
}

.search-filter-sidebar-layer-enter-from .search-filter-sidebar,
.search-filter-sidebar-layer-leave-to .search-filter-sidebar {
  transform: translate3d(calc(var(--search-space-6) * -1), 0, 0);
}

.search-filter-sidebar-layer-enter-from .search-filter-sidebar__surface,
.search-filter-sidebar-layer-leave-to .search-filter-sidebar__surface {
  transform: scale(0.985);
}

@media (max-width: 1024px) {
  .search-filter-sidebar__layer {
    position: fixed;
    inset: 0;
    z-index: 40;
    flex-basis: auto;
    width: auto;
    max-width: none;
    margin-inline-end: 0;
    align-self: auto;
  }

  .search-filter-sidebar__backdrop {
    position: fixed;
    inset: 0;
    z-index: 20;
    display: block;
    padding: 0;
    border: 0;
    background: color-mix(in oklch, var(--search-color-bg) 26%, var(--search-color-transparent));
    backdrop-filter: blur(2px);
  }

  .search-filter-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    flex-basis: auto;
    width: min(calc(100vw - (var(--search-space-2) * 2)), var(--search-filter-sidebar-mobile-width));
    max-width: 100vw;
    padding: var(--search-space-2);
    border-inline-end: 0;
  }

  .search-filter-sidebar-layer-enter-active,
  .search-filter-sidebar-layer-leave-active {
    overflow: visible;
    transition: opacity 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .search-filter-sidebar-layer-enter-from,
  .search-filter-sidebar-layer-leave-to {
    flex-basis: auto;
    width: auto;
    max-width: none;
    margin-inline-end: 0;
  }

  .search-filter-sidebar__surface {
    height: calc(100svh - (var(--search-space-2) * 2));
    padding: var(--search-space-4);
    border: var(--search-border) solid var(--search-filter-sidebar-border-color);
    border-radius: var(--search-radius);
    background-color: var(--search-color-section);
    overflow: auto;
    max-block-size: none;
  }

  .search-filter-sidebar-layer-enter-from .search-filter-sidebar,
  .search-filter-sidebar-layer-leave-to .search-filter-sidebar {
    transform: translate3d(-100%, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .search-filter-sidebar-layer-enter-active,
  .search-filter-sidebar-layer-leave-active,
  .search-filter-sidebar-layer-enter-active .search-filter-sidebar__backdrop,
  .search-filter-sidebar-layer-leave-active .search-filter-sidebar__backdrop,
  .search-filter-sidebar-layer-enter-active .search-filter-sidebar,
  .search-filter-sidebar-layer-leave-active .search-filter-sidebar,
  .search-filter-sidebar-layer-enter-active .search-filter-sidebar__surface,
  .search-filter-sidebar-layer-leave-active .search-filter-sidebar__surface {
    transition: none;
  }
}
</style>
