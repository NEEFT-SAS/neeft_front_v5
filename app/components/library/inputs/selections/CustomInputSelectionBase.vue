<template>
  <div
    ref="rootElement"
    class="cus-input-selection"
    :data-size="props.size"
    :data-open="isOpen ? 'true' : 'false'"
    :data-selected="props.selected ? 'true' : 'false'"
    :data-disabled="isDisabled ? 'true' : 'false'"
    :data-error="hasError ? 'true' : 'false'"
    :data-placement="popupPlacement"
    :data-label-position="props.labelPosition"
    :data-has-inside-label="hasInsideLabel ? 'true' : 'false'"
  >
    <label v-if="hasExternalLabel" :id="labelId" class="cus-input-selection__label" :for="triggerId">
      <span>{{ props.label }}</span>
      <span v-if="props.required" class="cus-input-selection__required" aria-hidden="true">*</span>
    </label>

    <div class="cus-input-selection__control">
      <button
        :id="triggerId"
        ref="triggerElement"
        class="cus-input-selection__trigger"
        type="button"
        :role="props.multiple ? undefined : 'combobox'"
        aria-haspopup="listbox"
        :disabled="isDisabled"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="isOpen ? listboxId : undefined"
        :aria-activedescendant="props.multiple ? undefined : activeDescendant"
        :aria-invalid="hasError ? 'true' : undefined"
        :aria-describedby="describedBy"
        :aria-label="accessibleLabel"
        :aria-required="props.required ? 'true' : undefined"
        @click="togglePopup"
        @keydown="onTriggerKeydown"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      >
        <Icon v-if="displayIcon" class="cus-input-selection__icon cus-input-selection__icon--left" :name="displayIcon" aria-hidden="true" />
        <span class="cus-input-selection__value" :data-placeholder="selectedOptions.length > 0 ? 'false' : 'true'">
          <span v-if="showInsideLabel" class="cus-input-selection__inside-label" aria-hidden="true">
            <span class="cus-input-selection__inside-label-text">{{ props.label }}</span>
            <span v-if="props.required" class="cus-input-selection__required">*</span>
          </span>
          <template v-else>
            {{ displayLabel }}
          </template>
        </span>
        <Icon class="cus-input-selection__icon cus-input-selection__icon--right" :name="props.rightIcon" aria-hidden="true" />
      </button>
      <template v-if="props.name">
        <template v-if="props.multiple">
          <input v-for="value in selectedValues" :key="String(value)" type="hidden" :name="props.name" :value="String(value)">
        </template>
        <input v-else type="hidden" :name="props.name" :value="hiddenValue">
      </template>
    </div>

    <div v-if="isOpen" class="cus-input-selection__popup" :style="popupStyle">
      <div v-if="props.searchable" class="cus-input-selection__search">
        <Icon class="cus-input-selection__search-icon" name="lucide:search" aria-hidden="true" />
        <input
          ref="searchElement"
          v-model="searchQuery"
          class="cus-input-selection__search-input"
          type="text"
          :placeholder="props.searchPlaceholder"
          :aria-label="props.searchPlaceholder"
          :aria-controls="listboxId"
          @keydown="onSearchKeydown"
          @input="emit('search', searchQuery)"
        >
      </div>

      <ul
        :id="listboxId"
        class="cus-input-selection__list"
        role="listbox"
        :aria-labelledby="hasExternalLabel ? labelId : undefined"
        :aria-label="hasExternalLabel ? undefined : accessibleLabel"
        :aria-multiselectable="props.multiple ? 'true' : undefined"
      >
        <li
          v-for="(option, index) in filteredOptions"
          :id="getOptionId(index)"
          :key="option.key"
          class="cus-input-selection__option"
          role="option"
          :aria-selected="isOptionSelected(option) ? 'true' : 'false'"
          :aria-disabled="option.disabled ? 'true' : undefined"
          :data-active="activeIndex === index ? 'true' : 'false'"
          :data-selected="isOptionSelected(option) ? 'true' : 'false'"
          :data-disabled="option.disabled ? 'true' : 'false'"
          @mousedown.prevent
          @mousemove="activateOption(index)"
          @click="selectOption(option)"
        >
          <Icon v-if="option.icon" class="cus-input-selection__option-icon" :name="option.icon" aria-hidden="true" />
          <span class="cus-input-selection__option-label">{{ option.label }}</span>
          <Icon v-if="isOptionSelected(option)" class="cus-input-selection__option-check" name="lucide:check" aria-hidden="true" />
        </li>

        <li v-if="filteredOptions.length === 0" class="cus-input-selection__empty">
          {{ props.emptyLabel }}
        </li>
      </ul>
    </div>

    <p
      :id="errorId"
      class="cus-input-selection__error"
      :data-visible="hasError ? 'true' : 'false'"
      :aria-live="hasError ? 'polite' : undefined"
      :aria-hidden="hasError ? undefined : 'true'"
    >
      {{ props.errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
type SelectionOptionValue = string | number

type SelectionOptionInput = Record<string, unknown> & {
  label: string
  value: SelectionOptionValue
  icon?: string
  disabled?: boolean
}

type SelectionOption = SelectionOptionInput & {
  count?: number
}

const { t, te } = useI18n()

const props = defineProps({
  modelValue: { type: [String, Number, Array], default: '' },
  multiple: { type: Boolean, default: false },
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  label: { type: String, default: '' },
  labelPosition: {
    type: String,
    default: 'outside',
    validator: (value: string) => ['inside', 'outside'].includes(value)
  },
  placeholder: { type: String, default: 'Selectionner' },
  options: { type: Array, default: () => [] },
  optionValue: { type: String, default: 'value' },
  optionLabel: { type: String, default: 'label' },
  i18nPrefix: { type: String, default: '' },
  i18nLabel: { type: [Boolean, String], default: false },
  leftIcon: { type: String, default: '' },
  rightIcon: { type: String, default: 'lucide:chevron-down' },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
  searchable: { type: Boolean, default: false },
  searchPlaceholder: { type: String, default: 'Rechercher' },
  emptyLabel: { type: String, default: 'Aucun resultat' },
  errorMessage: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur', 'open', 'close', 'search'])

const rootElement = ref<HTMLElement | null>(null)
const triggerElement = ref<HTMLButtonElement | null>(null)
const searchElement = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const activeIndex = ref(-1)
const searchQuery = ref('')
const popupPlacement = ref('bottom')
const listMaxHeight = ref('')

const triggerId = computed(() => props.id || `cus-input-selection-${generatedId}`)
const labelId = computed(() => `${triggerId.value}-label`)
const listboxId = computed(() => `${triggerId.value}-listbox`)
const errorId = computed(() => `${triggerId.value}-error`)
const hasError = computed(() => props.errorMessage.length > 0)
const hasExternalLabel = computed(() => props.label.length > 0 && props.labelPosition === 'outside')
const hasInsideLabel = computed(() => props.label.length > 0 && props.labelPosition === 'inside')
const placeholderValue = computed(() => {
  return props.placeholder
})
const describedBy = computed(() => {
  if (!props.errorMessage) return undefined
  return errorId.value
})

const getOptionProperty = (option: SelectionOptionInput, path: string) => {
  if (!path) return undefined
  return path.split('.').reduce<unknown>((currentValue, pathPart) => {
    if (!pathPart || !currentValue || typeof currentValue !== 'object') return undefined
    return (currentValue as Record<string, unknown>)[pathPart]
  }, option)
}

const getOptionValue = (option: SelectionOptionInput, index: number): SelectionOptionValue => {
  const rawValue = getOptionProperty(option, props.optionValue)
  if (typeof rawValue === 'string' || typeof rawValue === 'number') return rawValue
  return String(index)
}

const getTranslationKey = (option: SelectionOptionInput, fallbackLabel: string) => {
  const rawTranslationValue = typeof props.i18nLabel === 'string' ? getOptionProperty(option, props.i18nLabel) : fallbackLabel
  const translationValue = rawTranslationValue === null || rawTranslationValue === undefined ? '' : String(rawTranslationValue)
  if (!translationValue) return ''
  const normalizedPrefix = props.i18nPrefix.replace(/\.$/, '')
  const normalizedTranslationValue = translationValue.replace(/^\./, '')
  return normalizedPrefix ? `${normalizedPrefix}.${normalizedTranslationValue}` : normalizedTranslationValue
}

const getOptionLabel = (option: SelectionOptionInput) => {
  const rawLabel = getOptionProperty(option, props.optionLabel)
  const fallbackLabel = rawLabel === null || rawLabel === undefined ? '' : String(rawLabel)
  const shouldTranslateLabel = Boolean(props.i18nPrefix || props.i18nLabel)
  if (!shouldTranslateLabel) return fallbackLabel

  const translationKey = getTranslationKey(option, fallbackLabel)
  if (!translationKey || !te(translationKey)) return fallbackLabel
  return t(translationKey)
}

const normalizedOptions = computed<SelectionOption[]>(() => {
  return (props.options as SelectionOptionInput[]).map((option, index) => {
    const value = getOptionValue(option, index)

    return {
      value,
      label: getOptionLabel(option),
      icon: typeof option.icon === 'string' ? option.icon : undefined,
      disabled: option.disabled === true,
      key: `${String(value)}-${index}`,
      raw: option
    }
  })
})

const isDisabled = computed(() => props.disabled || normalizedOptions.value.length === 0)

const isSelectionValue = (value: unknown): value is SelectionOptionValue => {
  return typeof value === 'string' || typeof value === 'number'
}

const selectedValues = computed<SelectionOptionValue[]>(() => {
  if (!props.multiple) return isSelectionValue(props.modelValue) ? [props.modelValue] : []
  if (!Array.isArray(props.modelValue)) return []
  return props.modelValue.filter(isSelectionValue)
})

const isOptionSelected = (option: SelectionOption) => {
  return selectedValues.value.some((value) => value === option.value)
}

const selectedOptions = computed(() => {
  return normalizedOptions.value.filter((option) => isOptionSelected(option))
})
const showInsideLabel = computed(() => hasInsideLabel.value && selectedOptions.value.length === 0)

const selectedOption = computed(() => {
  return selectedOptions.value[0]
})

const filteredOptions = computed(() => {
  const query = searchQuery.value.toLocaleLowerCase()
  if (!query) return normalizedOptions.value
  return normalizedOptions.value.filter((option) => option.label.toLocaleLowerCase().includes(query))
})

const displayIcon = computed(() => {
  if (!props.multiple) return selectedOption.value?.icon || props.leftIcon
  if (selectedOptions.value.length === 1) return selectedOptions.value[0]?.icon || props.leftIcon
  return props.leftIcon
})
const displayLabel = computed(() => {
  if (selectedOptions.value.length === 0) return placeholderValue.value
  if (!props.multiple) return selectedOption.value?.label || placeholderValue.value
  return selectedOptions.value.map((option) => option.label).join(', ')
})
const hiddenValue = computed(() => String(props.modelValue))
const activeDescendant = computed(() => {
  if (!isOpen.value || activeIndex.value < 0) return undefined
  return getOptionId(activeIndex.value)
})
const accessibleLabel = computed(() => {
  if (hasExternalLabel.value) return undefined
  if (props.label) return props.label
  return displayLabel.value
})
const popupStyle = computed(() => {
  if (!listMaxHeight.value) return undefined
  return { '--selection-list-max-height': listMaxHeight.value }
})

const getOptionId = (index: number) => `${triggerId.value}-option-${index}`

const getTokenPixels = (tokenName: string) => {
  if (!rootElement.value) return 0
  const rawValue = window.getComputedStyle(rootElement.value).getPropertyValue(tokenName)
  if (!rawValue) return 0

  const measureElement = document.createElement('div')
  measureElement.style.position = 'absolute'
  measureElement.style.visibility = 'hidden'
  measureElement.style.width = rawValue
  measureElement.style.pointerEvents = 'none'
  rootElement.value.appendChild(measureElement)

  const pixels = measureElement.getBoundingClientRect().width
  measureElement.remove()

  return pixels
}

const updatePopupGeometry = () => {
  if (!rootElement.value) return
  const rect = rootElement.value.getBoundingClientRect()
  const unit = getTokenPixels('--unit')
  const viewportGap = unit * 2
  const preferredHeight = unit * 42
  const minimumListHeight = unit * 16
  const searchHeight = props.searchable ? unit * 6 : 0
  const availableBelow = window.innerHeight - rect.bottom - viewportGap
  const availableAbove = rect.top - viewportGap
  const shouldOpenBelow = availableBelow >= availableAbove
  const availableHeight = Math.max(shouldOpenBelow ? availableBelow : availableAbove, 0)
  const availableListHeight = Math.max(availableHeight - searchHeight, minimumListHeight)
  const maxHeight = Math.min(availableListHeight, preferredHeight)

  popupPlacement.value = shouldOpenBelow ? 'bottom' : 'top'
  listMaxHeight.value = `${maxHeight}px`
}

const activateFirstAvailableOption = () => {
  activeIndex.value = filteredOptions.value.findIndex((option) => !option.disabled)
}

const activateSelectedOption = () => {
  const selectedIndex = filteredOptions.value.findIndex((option) => isOptionSelected(option) && !option.disabled)
  if (selectedIndex >= 0) {
    activeIndex.value = selectedIndex
    return
  }
  activateFirstAvailableOption()
}

const activateOption = (index: number) => {
  const option = filteredOptions.value[index]
  if (!option || option.disabled) return
  activeIndex.value = index
}

const moveActiveOption = (direction: number) => {
  const options = filteredOptions.value
  if (options.length === 0) return
  const startIndex = activeIndex.value >= 0 ? activeIndex.value : 0

  for (let offset = 1; offset <= options.length; offset += 1) {
    const index = (startIndex + direction * offset + options.length) % options.length
    if (!options[index]?.disabled) {
      activeIndex.value = index
      return
    }
  }
}

const moveToEdgeOption = (direction: number) => {
  const options = direction > 0 ? [...filteredOptions.value].reverse() : filteredOptions.value
  const option = options.find((currentOption) => !currentOption.disabled)
  if (!option) return
  activeIndex.value = filteredOptions.value.findIndex((currentOption) => currentOption.key === option.key)
}

const selectSingleOption = (option: SelectionOption) => {
  emit('update:modelValue', option.value)
  emit('change', option)
  closePopup()
}

const toggleMultipleOption = (option: SelectionOption) => {
  const nextValues = isOptionSelected(option)
    ? selectedValues.value.filter((value) => value !== option.value)
    : [...selectedValues.value, option.value]
  const nextOptions = normalizedOptions.value.filter((currentOption) => {
    return nextValues.some((value) => value === currentOption.value)
  })

  emit('update:modelValue', nextValues)
  emit('change', nextValues, nextOptions)
}

const selectOption = (option: SelectionOption | undefined) => {
  if (!option || option.disabled) return
  if (props.multiple) {
    toggleMultipleOption(option)
    return
  }
  selectSingleOption(option)
}

const openPopup = async () => {
  if (isDisabled.value || isOpen.value) return
  isOpen.value = true
  emit('open')
  await nextTick()
  updatePopupGeometry()
  activateSelectedOption()
  if (props.searchable) searchElement.value?.focus()
}

const closePopup = () => {
  if (!isOpen.value) return
  isOpen.value = false
  searchQuery.value = ''
  activeIndex.value = -1
  emit('close')
}

const togglePopup = () => {
  if (isOpen.value) {
    closePopup()
    return
  }
  openPopup()
}

const onTriggerKeydown = (event: KeyboardEvent) => {
  if (isDisabled.value) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (!isOpen.value) {
      openPopup()
      return
    }
    moveActiveOption(1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (!isOpen.value) {
      openPopup()
      return
    }
    moveActiveOption(-1)
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (!isOpen.value) {
      openPopup()
      return
    }
    selectOption(filteredOptions.value[activeIndex.value])
    return
  }

  if (event.key === 'Home' && isOpen.value) {
    event.preventDefault()
    moveToEdgeOption(-1)
    return
  }

  if (event.key === 'End' && isOpen.value) {
    event.preventDefault()
    moveToEdgeOption(1)
    return
  }

  if (event.key === 'Escape') {
    closePopup()
    return
  }

  if (event.key === 'Tab') {
    closePopup()
  }
}

const onSearchKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveActiveOption(1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveActiveOption(-1)
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    selectOption(filteredOptions.value[activeIndex.value])
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    moveToEdgeOption(-1)
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    moveToEdgeOption(1)
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closePopup()
    triggerElement.value?.focus()
    return
  }

  if (event.key === 'Tab') {
    closePopup()
  }
}

const onDocumentPointerDown = (event: PointerEvent) => {
  if (!rootElement.value?.contains(event.target as Node)) closePopup()
}

watch(filteredOptions, () => {
  activateFirstAvailableOption()
})

watch(isOpen, (open) => {
  if (open) {
    document.addEventListener('pointerdown', onDocumentPointerDown)
    window.addEventListener('resize', updatePopupGeometry)
    window.addEventListener('scroll', updatePopupGeometry, true)
    return
  }

  document.removeEventListener('pointerdown', onDocumentPointerDown)
  window.removeEventListener('resize', updatePopupGeometry)
  window.removeEventListener('scroll', updatePopupGeometry, true)
})

watch(isDisabled, (disabled) => {
  if (disabled) closePopup()
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  window.removeEventListener('resize', updatePopupGeometry)
  window.removeEventListener('scroll', updatePopupGeometry, true)
})
</script>

<style scoped>
.cus-input-selection {
  --input-height-sm: calc(var(--unit) * 5);
  --input-height-md: calc(var(--unit) * 6);
  --input-height-lg: calc(var(--unit) * 8);
  --input-padding-x-sm: calc(var(--unit) * 1.5);
  --input-padding-x-md: calc(var(--unit) * 2);
  --input-padding-x-lg: calc(var(--unit) * 3);
  --input-gap-sm: calc(var(--unit) * 0.75);
  --input-gap-md: var(--space-1);
  --input-gap-lg: calc(var(--unit) * 1.25);
  --input-font-sm: calc(var(--unit) * 2);
  --input-font-md: calc(var(--unit) * 2.125);
  --input-font-lg: calc(var(--unit) * 2.25);
  --input-icon-sm: calc(var(--unit) * 1.75);
  --input-icon-md: calc(var(--unit) * 2);
  --input-icon-lg: calc(var(--unit) * 2.25);
  --input-bg: color-mix(in oklch, var(--color-bg-soft) 88%, var(--color-panel));
  --input-text: var(--color-text);
  --input-label: var(--color-muted);
  --input-placeholder: color-mix(in oklch, var(--color-subtle) 76%, var(--color-transparent));
  --input-icon: var(--color-subtle);
  --input-border: var(--color-panel-line);
  --input-hover-bg: var(--color-bg-soft-hover);
  --input-hover-border: color-mix(in oklch, var(--color-line) 68%, var(--color-accent));
  --input-selected-bg: color-mix(in oklch, var(--color-bg-soft-hover) 84%, var(--color-accent));
  --input-selected-border: var(--color-accent-strong);
  --input-selected-outline: color-mix(in oklch, var(--color-accent-strong) 42%, var(--color-transparent));
  --input-error: oklch(66% 0.19 28);
  --input-error-bg: color-mix(in oklch, var(--input-error) 14%, var(--color-bg-soft));
  --input-error-border: var(--input-error);
  --input-error-outline: color-mix(in oklch, var(--input-error) 34%, var(--color-transparent));
  --input-error-text: color-mix(in oklch, var(--input-error) 80%, var(--landing-color-header-strong));
  --input-disabled-bg: color-mix(in oklch, var(--color-surface-deep) 72%, var(--color-transparent));
  --input-disabled-text: color-mix(in oklch, var(--color-text) 42%, var(--color-transparent));
  --input-disabled-border: color-mix(in oklch, var(--color-line) 68%, var(--color-transparent));
  --selection-popup-bg: color-mix(in oklch, var(--color-panel) 92%, var(--color-bg-soft));
  --selection-popup-border: color-mix(in oklch, var(--color-line) 86%, var(--color-transparent));
  --selection-option-hover-bg: color-mix(in oklch, var(--landing-color-header-strong) 10%, var(--color-transparent));
  --selection-option-selected-bg: color-mix(in oklch, var(--color-accent) 18%, var(--color-transparent));
  --selection-shadow: 0 calc(var(--unit) * 2) calc(var(--unit) * 5) var(--color-shadow);
  --selection-popup-layer: var(--layer-popover);
  --selection-list-max-height: calc(var(--unit) * 42);
  --input-current-height: var(--input-height-md);
  --input-current-padding-x: var(--input-padding-x-md);
  --input-current-gap: var(--input-gap-md);
  --input-current-font: var(--input-font-md);
  --input-current-icon: var(--input-icon-md);
  position: relative;
  gap: var(--space-1);

  @apply grid w-full;
}

.cus-input-selection__label {
  gap: calc(var(--unit) * 0.5);
  color: var(--input-label);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);

  @apply inline-flex w-fit items-center;
}

.cus-input-selection__required {
  color: var(--input-error);
}

.cus-input-selection__control {
  @apply w-full;
}

.cus-input-selection__trigger {
  gap: var(--input-current-gap);
  width: 100%;
  height: var(--input-current-height);
  min-height: var(--input-current-height);
  padding: 0 var(--input-current-padding-x);
  border: var(--border) solid var(--input-border);
  border-radius: var(--radius);
  outline: calc(var(--border) * 2) solid var(--color-transparent);
  outline-offset: calc(var(--border) * 2);
  background-color: var(--input-bg);
  color: var(--input-text);
  font-family: inherit;
  font-size: var(--input-current-font);
  line-height: var(--line-tight);
  transition-duration: var(--motion-fast);

  @apply flex cursor-pointer items-center text-left transition-colors;
}

.cus-input-selection__value {
  color: var(--input-text);

  @apply flex-1 truncate;
}

.cus-input-selection__inside-label {
  gap: calc(var(--unit) * 0.5);
  max-width: 100%;

  @apply inline-flex items-center overflow-hidden whitespace-nowrap;
}

.cus-input-selection__inside-label-text {
  @apply truncate;
}

.cus-input-selection__value[data-placeholder='true'] {
  color: var(--input-placeholder);
}

.cus-input-selection__icon,
.cus-input-selection__search-icon,
.cus-input-selection__option-icon,
.cus-input-selection__option-check {
  width: var(--input-current-icon);
  height: var(--input-current-icon);
  color: var(--input-icon);

  @apply shrink-0;
}

.cus-input-selection__popup {
  z-index: var(--selection-popup-layer);
  border: var(--border) solid var(--selection-popup-border);
  border-radius: var(--radius);
  background-color: var(--selection-popup-bg);
  box-shadow: var(--selection-shadow);
  overflow: hidden;

  @apply absolute left-0 right-0 flex flex-col;
}

.cus-input-selection[data-placement='bottom'] .cus-input-selection__popup {
  top: calc(100% + var(--input-current-gap));
}

.cus-input-selection[data-placement='top'] .cus-input-selection__popup {
  bottom: calc(100% + var(--input-current-gap));
}

.cus-input-selection__search {
  gap: var(--input-current-gap);
  min-height: var(--input-current-height);
  padding: 0 var(--input-current-padding-x);
  border-bottom: var(--border) solid var(--selection-popup-border);
  color: var(--input-text);

  @apply flex items-center;
}

.cus-input-selection__search-input {
  width: 100%;
  border: 0;
  outline: 0;
  background-color: var(--color-transparent);
  color: inherit;
  caret-color: var(--color-accent-strong);
  font-family: inherit;
  font-size: var(--input-current-font);
  line-height: var(--line-tight);

  @apply appearance-none;
}

.cus-input-selection__search-input::placeholder {
  color: var(--input-placeholder);
  opacity: 1;
}

.cus-input-selection__list {
  flex: 1 1 auto;
  max-height: var(--selection-list-max-height);
  min-height: 0;
  margin: 0;
  padding: var(--input-current-gap);
  overflow-y: auto;

  @apply grid list-none;
}

.cus-input-selection__option {
  gap: var(--input-current-gap);
  min-height: var(--input-current-height);
  padding: 0 var(--input-current-padding-x);
  border-radius: var(--radius);
  color: var(--input-text);
  font-size: var(--input-current-font);
  line-height: var(--line-tight);

  @apply flex cursor-pointer select-none items-center;
}

.cus-input-selection__option-label {
  @apply flex-1 truncate;
}

.cus-input-selection__empty {
  min-height: var(--input-current-height);
  padding: 0 var(--input-current-padding-x);
  color: var(--input-placeholder);
  font-size: var(--input-current-font);
  line-height: var(--line-tight);

  @apply flex items-center;
}

.cus-input-selection__error {
  margin: 0;
  min-height: calc(var(--font-eyebrow) * var(--line-base));
  color: var(--input-error-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.cus-input-selection__error[data-visible='false'] {
  visibility: hidden;
}

.cus-input-selection[data-size='sm'] {
  --input-current-height: var(--input-height-sm);
  --input-current-padding-x: var(--input-padding-x-sm);
  --input-current-gap: var(--input-gap-sm);
  --input-current-font: var(--input-font-sm);
  --input-current-icon: var(--input-icon-sm);
}

.cus-input-selection[data-size='md'] {
  --input-current-height: var(--input-height-md);
  --input-current-padding-x: var(--input-padding-x-md);
  --input-current-gap: var(--input-gap-md);
  --input-current-font: var(--input-font-md);
  --input-current-icon: var(--input-icon-md);
}

.cus-input-selection[data-size='lg'] {
  --input-current-height: var(--input-height-lg);
  --input-current-padding-x: var(--input-padding-x-lg);
  --input-current-gap: var(--input-gap-lg);
  --input-current-font: var(--input-font-lg);
  --input-current-icon: var(--input-icon-lg);
}

.cus-input-selection:not([data-disabled='true']):hover .cus-input-selection__trigger {
  border-color: var(--input-hover-border);
  background-color: var(--input-hover-bg);
}

.cus-input-selection:not([data-disabled='true'])[data-error='true'] .cus-input-selection__label {
  color: var(--input-error-text);
}

.cus-input-selection:not([data-disabled='true'])[data-error='true'] .cus-input-selection__trigger {
  border-color: var(--input-error-border);
  outline-color: var(--input-error-outline);
  background-color: var(--input-error-bg);
}

.cus-input-selection:not([data-disabled='true']):not([data-error='true'])[data-open='true'] .cus-input-selection__trigger,
.cus-input-selection:not([data-disabled='true']):not([data-error='true']) .cus-input-selection__trigger:focus-visible,
.cus-input-selection:not([data-disabled='true']):not([data-error='true'])[data-selected='true'] .cus-input-selection__trigger {
  border-color: var(--input-selected-border);
  outline-color: var(--input-selected-outline);
  background-color: var(--input-selected-bg);
}

.cus-input-selection:not([data-disabled='true']):not([data-error='true'])[data-open='true'] .cus-input-selection__label,
.cus-input-selection:not([data-disabled='true']):not([data-error='true']):focus-within .cus-input-selection__label,
.cus-input-selection:not([data-disabled='true']):not([data-error='true'])[data-selected='true'] .cus-input-selection__label {
  color: var(--color-accent-strong);
}

.cus-input-selection__option[data-active='true'] {
  background-color: var(--selection-option-hover-bg);
}

.cus-input-selection__option[data-selected='true'] {
  background-color: var(--selection-option-selected-bg);
}

.cus-input-selection__option[data-disabled='true'] {
  color: var(--input-disabled-text);

  @apply cursor-not-allowed;
}

.cus-input-selection[data-disabled='true'] .cus-input-selection__label,
.cus-input-selection[data-disabled='true'] .cus-input-selection__trigger,
.cus-input-selection[data-disabled='true'] .cus-input-selection__icon {
  color: var(--input-disabled-text);
}

.cus-input-selection[data-disabled='true'] .cus-input-selection__trigger {
  border-color: var(--input-disabled-border);
  background-color: var(--input-disabled-bg);

  @apply cursor-not-allowed;
}
</style>
