<template>
  <fieldset
    class="cus-input-checkbox-group"
    :data-size="props.size"
    :data-direction="props.direction"
    :data-disabled="isDisabled ? 'true' : 'false'"
    :data-error="hasError ? 'true' : 'false'"
    :aria-describedby="describedBy"
  >
    <legend v-if="props.label" class="cus-input-checkbox-group__legend">
      <span>{{ props.label }}</span>
      <span v-if="props.required" class="cus-input-checkbox-group__required" aria-hidden="true">*</span>
    </legend>

    <p v-if="props.description" :id="descriptionId" class="cus-input-checkbox-group__description">
      {{ props.description }}
    </p>

    <div class="cus-input-checkbox-group__items">
      <CustomInputCheckbox
        v-for="option in normalizedOptions"
        :id="`${groupId}-${option.key}`"
        :key="option.key"
        :model-value="isOptionChecked(option)"
        :name="props.name"
        :value="option.value"
        :label="option.label"
        :description="option.description"
        :size="props.size"
        :required="props.required && selectedValues.length === 0"
        :disabled="isDisabled || option.disabled"
        :selected="props.selected"
        @update:model-value="toggleOption(option)"
        @change="emit('item-change', option)"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />

      <p v-if="normalizedOptions.length === 0" class="cus-input-checkbox-group__empty">
        {{ props.emptyLabel }}
      </p>
    </div>

    <p
      :id="errorId"
      class="cus-input-checkbox-group__error"
      :data-visible="hasError ? 'true' : 'false'"
      :aria-live="hasError ? 'polite' : undefined"
      :aria-hidden="hasError ? undefined : 'true'"
    >
      {{ props.errorMessage }}
    </p>
  </fieldset>
</template>

<script setup lang="ts">
import CustomInputCheckbox from './CustomInputCheckbox.vue'

type CheckboxOptionValue = string | number

type CheckboxOptionInput = Record<string, unknown> & {
  label: string
  value: CheckboxOptionValue
  disabled?: boolean
}

type CheckboxOption = CheckboxOptionInput & {
  checked?: boolean
}

const generatedId = useId()
const { t, te } = useI18n()

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  label: { type: String, default: '' },
  description: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  optionValue: { type: String, default: 'value' },
  optionLabel: { type: String, default: 'label' },
  optionDescription: { type: String, default: 'description' },
  i18nPrefix: { type: String, default: '' },
  i18nLabel: { type: [Boolean, String], default: false },
  direction: {
    type: String,
    default: 'vertical',
    validator: (value: string) => ['vertical', 'horizontal'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
  emptyLabel: { type: String, default: 'Aucune option' },
  errorMessage: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'change', 'item-change', 'focus', 'blur'])

const groupId = computed(() => props.id || `cus-input-checkbox-group-${generatedId}`)
const descriptionId = computed(() => `${groupId.value}-description`)
const errorId = computed(() => `${groupId.value}-error`)
const hasError = computed(() => props.errorMessage.length > 0)
const describedBy = computed(() => {
  const ids = []
  if (props.description) ids.push(descriptionId.value)
  if (props.errorMessage) ids.push(errorId.value)
  return ids.length > 0 ? ids.join(' ') : undefined
})

const getOptionProperty = (option: CheckboxOptionInput, path: string) => {
  if (!path) return undefined
  return path.split('.').reduce<unknown>((currentValue, pathPart) => {
    if (!pathPart || !currentValue || typeof currentValue !== 'object') return undefined
    return (currentValue as Record<string, unknown>)[pathPart]
  }, option)
}

const getOptionValue = (option: CheckboxOptionInput, index: number): CheckboxOptionValue => {
  const rawValue = getOptionProperty(option, props.optionValue)
  if (typeof rawValue === 'string' || typeof rawValue === 'number') return rawValue
  return String(index)
}

const getTranslationKey = (option: CheckboxOptionInput, fallbackLabel: string) => {
  const rawTranslationValue = typeof props.i18nLabel === 'string' ? getOptionProperty(option, props.i18nLabel) : fallbackLabel
  const translationValue = rawTranslationValue === null || rawTranslationValue === undefined ? '' : String(rawTranslationValue)
  if (!translationValue) return ''
  const normalizedPrefix = props.i18nPrefix.replace(/\.$/, '')
  const normalizedTranslationValue = translationValue.replace(/^\./, '')
  return normalizedPrefix ? `${normalizedPrefix}.${normalizedTranslationValue}` : normalizedTranslationValue
}

const getOptionLabel = (option: CheckboxOptionInput) => {
  const rawLabel = getOptionProperty(option, props.optionLabel)
  const fallbackLabel = rawLabel === null || rawLabel === undefined ? '' : String(rawLabel)
  const shouldTranslateLabel = Boolean(props.i18nPrefix || props.i18nLabel)
  if (!shouldTranslateLabel) return fallbackLabel

  const translationKey = getTranslationKey(option, fallbackLabel)
  if (!translationKey || !te(translationKey)) return fallbackLabel
  return t(translationKey)
}

const getOptionDescription = (option: CheckboxOptionInput) => {
  const rawDescription = getOptionProperty(option, props.optionDescription)
  return rawDescription === null || rawDescription === undefined ? '' : String(rawDescription)
}

const normalizedOptions = computed<CheckboxOption[]>(() => {
  return (props.options as CheckboxOptionInput[]).map((option, index) => {
    const value = getOptionValue(option, index)

    return {
      value,
      label: getOptionLabel(option),
      description: getOptionDescription(option),
      disabled: option.disabled === true,
      key: `${String(value)}-${index}`,
      raw: option
    }
  })
})

const isDisabled = computed(() => props.disabled || normalizedOptions.value.length === 0)

const isCheckboxValue = (value: unknown): value is CheckboxOptionValue => {
  return typeof value === 'string' || typeof value === 'number'
}

const selectedValues = computed<CheckboxOptionValue[]>(() => {
  return props.modelValue.filter(isCheckboxValue)
})

const isOptionChecked = (option: CheckboxOption) => {
  return selectedValues.value.some((value) => value === option.value)
}

const toggleOption = (option: CheckboxOption) => {
  if (isDisabled.value || option.disabled) return

  const nextValues = isOptionChecked(option)
    ? selectedValues.value.filter((value) => value !== option.value)
    : [...selectedValues.value, option.value]
  const nextOptions = normalizedOptions.value.filter((currentOption) => {
    return nextValues.some((value) => value === currentOption.value)
  })

  emit('update:modelValue', nextValues)
  emit('change', nextValues, nextOptions)
}
</script>

<style scoped>
.cus-input-checkbox-group {
  --checkbox-group-gap-sm: calc(var(--unit) * 1.25);
  --checkbox-group-gap-md: var(--space-2);
  --checkbox-group-gap-lg: calc(var(--unit) * 2.5);
  --checkbox-group-current-gap: var(--checkbox-group-gap-md);
  --checkbox-group-label: var(--color-muted);
  --checkbox-group-text: var(--color-text);
  --checkbox-group-description: var(--color-subtle);
  --checkbox-group-error: oklch(66% 0.19 28);
  --checkbox-group-error-text: color-mix(in oklch, var(--checkbox-group-error) 80%, var(--landing-color-header-strong));
  --checkbox-group-disabled-text: color-mix(in oklch, var(--color-text) 42%, var(--color-transparent));
  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
  gap: var(--space-1);

  @apply grid;
}

.cus-input-checkbox-group__legend {
  gap: calc(var(--unit) * 0.5);
  margin: 0;
  padding: 0;
  color: var(--checkbox-group-label);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);

  @apply w-fit;
}

.cus-input-checkbox-group__required {
  color: var(--color-accent-strong);
}

.cus-input-checkbox-group__description,
.cus-input-checkbox-group__empty {
  margin: 0;
  color: var(--checkbox-group-description);
  font-size: var(--font-eyebrow);
  line-height: var(--line-base);
}

.cus-input-checkbox-group__items {
  gap: var(--checkbox-group-current-gap);

  @apply grid;
}

.cus-input-checkbox-group[data-direction='horizontal'] .cus-input-checkbox-group__items {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--landing-card-min)), 1fr));
}

.cus-input-checkbox-group__error {
  margin: 0;
  min-height: calc(var(--font-eyebrow) * var(--line-base));
  color: var(--checkbox-group-error-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.cus-input-checkbox-group__error[data-visible='false'] {
  visibility: hidden;
}

.cus-input-checkbox-group[data-size='sm'] {
  --checkbox-group-current-gap: var(--checkbox-group-gap-sm);
}

.cus-input-checkbox-group[data-size='md'] {
  --checkbox-group-current-gap: var(--checkbox-group-gap-md);
}

.cus-input-checkbox-group[data-size='lg'] {
  --checkbox-group-current-gap: var(--checkbox-group-gap-lg);
}

.cus-input-checkbox-group[data-error='true'] .cus-input-checkbox-group__legend {
  color: var(--checkbox-group-error-text);
}

.cus-input-checkbox-group[data-disabled='true'] .cus-input-checkbox-group__legend,
.cus-input-checkbox-group[data-disabled='true'] .cus-input-checkbox-group__description,
.cus-input-checkbox-group[data-disabled='true'] .cus-input-checkbox-group__empty {
  color: var(--checkbox-group-disabled-text);
}
</style>
