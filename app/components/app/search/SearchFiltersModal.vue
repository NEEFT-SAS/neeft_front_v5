<template>
  <CustomModal
    :model-value="props.modelValue"
    :title="props.title"
    :desc="props.activeFilterLabel"
    icon="lucide:list-checks"
    size="xl"
    :close-label="props.closeLabel"
    :theme="props.theme"
    :title-id="props.controlsId"
    @update:model-value="updateModalVisibility"
  >
    <form class="search-filters-modal__form" @submit.prevent>
      <section
        v-for="filter in props.filters"
        :key="filter.key"
        class="search-filters-modal__group"
        :aria-labelledby="`${props.idPrefix}-${filter.key}-title`"
      >
        <div class="search-filters-modal__group-head">
          <CustomIcon :icon="filter.icon" size="sm" color="primary" shape="ghost" />
          <h3 :id="`${props.idPrefix}-${filter.key}-title`">
            {{ filter.label }}
          </h3>
        </div>

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
          :placeholder="props.selectPlaceholder"
          :options="getOptions(filter)"
          :searchable="filter.searchable === true"
          size="md"
          @update:model-value="value => updateSingleFilter(filter.key, value)"
        />

        <div v-else-if="filter.type === 'multiFacet'" class="search-filters-modal__options">
          <div
            v-for="option in getOptions(filter)"
            :key="String(option.value)"
            class="search-filters-modal__option"
          >
            <CustomInputCheckbox
              :id="`${props.idPrefix}-${filter.key}-${toDomValue(option.value)}`"
              :model-value="isMultiSelected(filter.key, option.value)"
              :name="filter.key"
              :value="option.value"
              :label="option.label"
              size="sm"
              :selected="isMultiSelected(filter.key, option.value)"
              @update:model-value="checked => updateMultiFilter(filter.key, option.value, checked)"
            />
            <CustomBadge
              v-if="typeof option.count === 'number'"
              :value="option.count"
              :show-zero="true"
              :theme="props.theme"
              variant="soft"
              color="neutral"
              size="sm"
              :aria-label="`${option.count} resultat${option.count > 1 ? 's' : ''}`"
            />
          </div>
        </div>

        <CustomInputCheckbox
          v-else-if="filter.type === 'boolean'"
          :id="`${props.idPrefix}-${filter.key}`"
          :model-value="getBooleanValue(filter.key)"
          :name="filter.key"
          :value="filter.trueValue"
          :label="filter.optionLabel"
          size="sm"
          :selected="getBooleanValue(filter.key)"
          @update:model-value="checked => updateBooleanFilter(filter.key, checked)"
        />

        <div v-else-if="filter.type === 'range'" class="search-filters-modal__range">
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

    <template #footer>
      <CustomButton
        :label="props.resetLabel"
        :theme="props.theme"
        variant="outlined"
        color="secondary"
        size="md"
        :disabled="props.activeFilterCount === 0"
        @click="emit('reset')"
      />
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { SearchFilterDefinition, SearchFilterOption, SearchFilterOptionValue, SearchFilterState, SearchRangeValue } from '~/datas/searchs'

const emptyRangeValue = (): SearchRangeValue => ({
  min: '',
  max: ''
})

const props = defineProps({
  activeFilterCount: { type: Number, required: true },
  activeFilterLabel: { type: String, required: true },
  closeLabel: { type: String, default: 'Fermer les filtres' },
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
  resetLabel: { type: String, default: 'Reinitialiser' },
  selectPlaceholder: { type: String, default: 'Tous' },
  theme: {
    type: String,
    default: 'landing',
    validator: (value: string) => ['landing', 'app'].includes(value)
  },
  title: { type: String, default: 'Cibler la recherche' }
})

const emit = defineEmits(['reset', 'update:modelValue', 'update:filterValues'])

const updateModalVisibility = (value: boolean) => {
  emit('update:modelValue', value)
}

const toDomValue = (value: SearchFilterOptionValue) => {
  return String(value).toLocaleLowerCase('fr-FR').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const getOptions = (filter: SearchFilterDefinition): SearchFilterOption[] => {
  if (!('options' in filter)) return []
  return filter.options || []
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

const getBooleanValue = (key: string) => {
  return props.filterValues[key] === true
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

const isMultiSelected = (key: string, value: SearchFilterOptionValue) => {
  return getMultiValue(key).includes(String(value))
}

const updateTextFilter = (key: string, value: string) => {
  emitFilterValue(key, value)
}

const updateSingleFilter = (key: string, value: unknown) => {
  emitFilterValue(key, typeof value === 'number' ? String(value) : String(value || ''))
}

const updateMultiFilter = (key: string, value: SearchFilterOptionValue, checked: boolean) => {
  const currentValues = getMultiValue(key)
  const nextValue = String(value)
  const nextValues = checked
    ? Array.from(new Set([...currentValues, nextValue]))
    : currentValues.filter(selectedValue => selectedValue !== nextValue)

  emitFilterValue(key, nextValues)
}

const updateBooleanFilter = (key: string, checked: boolean) => {
  emitFilterValue(key, checked)
}

const updateRangeFilter = (key: string, side: keyof SearchRangeValue, value: unknown) => {
  emitFilterValue(key, {
    ...getRangeValue(key),
    [side]: typeof value === 'number' ? value : String(value || '')
  })
}
</script>

<style scoped>
.search-filters-modal__form {
  --search-filters-row-column-min: calc(var(--search-unit) * 28);
  --search-filters-group-padding: var(--search-space-4);
  --search-filters-option-min-height: var(--search-hit-size);
  --search-filters-option-column-min: calc(var(--search-unit) * 22);
  --search-filters-range-column-min: calc(var(--search-unit) * 24);
  --search-filters-panel-bg: color-mix(in oklch, var(--search-color-bg-soft) 64%, var(--search-color-transparent));
  --search-filters-panel-border: color-mix(in oklch, var(--search-color-panel-line) 84%, var(--search-color-transparent));
  --search-filters-row-border: color-mix(in oklch, var(--search-color-panel-line) 72%, var(--search-color-transparent));
  --search-filters-option-bg: color-mix(in oklch, var(--search-color-bg-soft) 82%, var(--search-color-transparent));
  --search-filters-option-border: color-mix(in oklch, var(--search-color-panel-line) 76%, var(--search-color-transparent));
  border: var(--search-border) solid var(--search-filters-panel-border);
  border-radius: var(--search-radius);
  background-color: var(--search-filters-panel-bg);
  overflow: hidden;

  @apply grid;
}

.search-filters-modal__group {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--search-filters-row-column-min)), 1fr));
  gap: var(--search-space-4);
  padding: var(--search-filters-group-padding);
  border-block-start: var(--search-border) solid var(--search-filters-row-border);
  align-content: start;

  @apply grid;
}

.search-filters-modal__group:first-child {
  border-block-start: 0;
}

.search-filters-modal__group-head {
  gap: var(--search-space-1);
  align-self: start;

  @apply flex items-center;
}

.search-filters-modal__group-head h3 {
  margin: 0;
  color: var(--search-color-text);
  font-size: var(--search-font-small);
  line-height: var(--search-line-base);

  @apply font-semibold;
}

.search-filters-modal__options {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--search-filters-option-column-min)), 1fr));
  gap: var(--search-space-2);

  @apply grid;
}

.search-filters-modal__option {
  gap: var(--search-space-2);
  min-height: var(--search-filters-option-min-height);
  padding: var(--search-space-2);
  border: var(--search-border) solid var(--search-filters-option-border);
  border-radius: var(--search-radius);
  background-color: var(--search-filters-option-bg);

  @apply flex items-start justify-between;
}

.search-filters-modal__range {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--search-filters-range-column-min)), 1fr));
  gap: var(--search-space-2);

  @apply grid;
}
</style>
