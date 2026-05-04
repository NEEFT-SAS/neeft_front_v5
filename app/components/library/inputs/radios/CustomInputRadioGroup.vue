<template>
  <fieldset
    class="cus-input-radio-group"
    :data-size="props.size"
    :data-direction="props.direction"
    :data-disabled="isDisabled ? 'true' : 'false'"
    :data-error="hasError ? 'true' : 'false'"
    :aria-describedby="describedBy"
  >
    <legend v-if="props.label" class="cus-input-radio-group__legend">
      <span>{{ props.label }}</span>
      <span v-if="props.required" class="cus-input-radio-group__required" aria-hidden="true">*</span>
    </legend>

    <p v-if="props.description" :id="descriptionId" class="cus-input-radio-group__description">
      {{ props.description }}
    </p>

    <div class="cus-input-radio-group__items">
      <CustomInputRadio
        v-for="option in normalizedOptions"
        :id="`${groupId}-${option.key}`"
        :key="option.key"
        :model-value="props.modelValue"
        :name="groupName"
        :value="option.value"
        :label="option.label"
        :description="option.description"
        :size="props.size"
        :required="props.required"
        :disabled="isDisabled || option.disabled"
        :selected="props.selected"
        @update:model-value="selectOption(option)"
        @change="emit('item-change', option)"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />

      <p v-if="normalizedOptions.length === 0" class="cus-input-radio-group__empty">
        {{ props.emptyLabel }}
      </p>
    </div>

    <p
      :id="errorId"
      class="cus-input-radio-group__error"
      :data-visible="hasError ? 'true' : 'false'"
      :aria-live="hasError ? 'polite' : undefined"
      :aria-hidden="hasError ? undefined : 'true'"
    >
      {{ props.errorMessage }}
    </p>
  </fieldset>
</template>

<script setup lang="ts">
import CustomInputRadio from './CustomInputRadio.vue'

type RadioOptionValue = string | number | boolean

type RadioOptionInput = Record<string, unknown> & {
  value?: RadioOptionValue
  label?: string
  description?: string
  disabled?: boolean
}

type RadioOption = {
  value: RadioOptionValue
  label: string
  description: string
  disabled: boolean
  key: string
  raw: RadioOptionInput
}

const generatedId = useId()
const { t, te } = useI18n()

const props = defineProps({
  modelValue: { type: [String, Number, Boolean], default: '' },
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

const groupId = computed(() => props.id || `cus-input-radio-group-${generatedId}`)
const groupName = computed(() => props.name || groupId.value)
const descriptionId = computed(() => `${groupId.value}-description`)
const errorId = computed(() => `${groupId.value}-error`)
const hasError = computed(() => props.errorMessage.length > 0)
const describedBy = computed(() => {
  const ids = []
  if (props.description) ids.push(descriptionId.value)
  if (props.errorMessage) ids.push(errorId.value)
  return ids.length > 0 ? ids.join(' ') : undefined
})

const getOptionProperty = (option: RadioOptionInput, path: string) => {
  if (!path) return undefined
  return path.split('.').reduce<unknown>((currentValue, pathPart) => {
    if (!pathPart || !currentValue || typeof currentValue !== 'object') return undefined
    return (currentValue as Record<string, unknown>)[pathPart]
  }, option)
}

const getOptionValue = (option: RadioOptionInput, index: number): RadioOptionValue => {
  const rawValue = getOptionProperty(option, props.optionValue)
  if (typeof rawValue === 'string' || typeof rawValue === 'number' || typeof rawValue === 'boolean') return rawValue
  return String(index)
}

const getTranslationKey = (option: RadioOptionInput, fallbackLabel: string) => {
  const rawTranslationValue = typeof props.i18nLabel === 'string' ? getOptionProperty(option, props.i18nLabel) : fallbackLabel
  const translationValue = rawTranslationValue === null || rawTranslationValue === undefined ? '' : String(rawTranslationValue)
  if (!translationValue) return ''
  const normalizedPrefix = props.i18nPrefix.replace(/\.$/, '')
  const normalizedTranslationValue = translationValue.replace(/^\./, '')
  return normalizedPrefix ? `${normalizedPrefix}.${normalizedTranslationValue}` : normalizedTranslationValue
}

const getOptionLabel = (option: RadioOptionInput) => {
  const rawLabel = getOptionProperty(option, props.optionLabel)
  const fallbackLabel = rawLabel === null || rawLabel === undefined ? '' : String(rawLabel)
  const shouldTranslateLabel = Boolean(props.i18nPrefix || props.i18nLabel)
  if (!shouldTranslateLabel) return fallbackLabel

  const translationKey = getTranslationKey(option, fallbackLabel)
  if (!translationKey || !te(translationKey)) return fallbackLabel
  return t(translationKey)
}

const getOptionDescription = (option: RadioOptionInput) => {
  const rawDescription = getOptionProperty(option, props.optionDescription)
  return rawDescription === null || rawDescription === undefined ? '' : String(rawDescription)
}

const normalizedOptions = computed<RadioOption[]>(() => {
  return (props.options as RadioOptionInput[]).map((option, index) => {
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

const selectOption = (option: RadioOption) => {
  if (isDisabled.value || option.disabled) return

  emit('update:modelValue', option.value)
  emit('change', option.value, option)
}
</script>

<style scoped>
.cus-input-radio-group {
  --radio-group-gap-sm: calc(var(--unit) * 1.25);
  --radio-group-gap-md: var(--space-2);
  --radio-group-gap-lg: calc(var(--unit) * 2.5);
  --radio-group-current-gap: var(--radio-group-gap-md);
  --radio-group-label: var(--color-muted);
  --radio-group-text: var(--color-text);
  --radio-group-description: var(--color-subtle);
  --radio-group-error: oklch(66% 0.19 28);
  --radio-group-error-text: color-mix(in oklch, var(--radio-group-error) 80%, var(--landing-color-header-strong));
  --radio-group-disabled-text: color-mix(in oklch, var(--color-text) 42%, var(--color-transparent));
  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
  gap: var(--space-1);

  @apply grid;
}

.cus-input-radio-group__legend {
  gap: calc(var(--unit) * 0.5);
  margin: 0;
  padding: 0;
  color: var(--radio-group-label);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);

  @apply w-fit;
}

.cus-input-radio-group__required {
  color: var(--color-accent-strong);
}

.cus-input-radio-group__description,
.cus-input-radio-group__empty {
  margin: 0;
  color: var(--radio-group-description);
  font-size: var(--font-eyebrow);
  line-height: var(--line-base);
}

.cus-input-radio-group__items {
  gap: var(--radio-group-current-gap);

  @apply grid;
}

.cus-input-radio-group[data-direction='horizontal'] .cus-input-radio-group__items {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--landing-card-min)), 1fr));
}

.cus-input-radio-group__error {
  margin: 0;
  min-height: calc(var(--font-eyebrow) * var(--line-base));
  color: var(--radio-group-error-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.cus-input-radio-group__error[data-visible='false'] {
  visibility: hidden;
}

.cus-input-radio-group[data-size='sm'] {
  --radio-group-current-gap: var(--radio-group-gap-sm);
}

.cus-input-radio-group[data-size='md'] {
  --radio-group-current-gap: var(--radio-group-gap-md);
}

.cus-input-radio-group[data-size='lg'] {
  --radio-group-current-gap: var(--radio-group-gap-lg);
}

.cus-input-radio-group[data-error='true'] .cus-input-radio-group__legend {
  color: var(--radio-group-error-text);
}

.cus-input-radio-group[data-disabled='true'] .cus-input-radio-group__legend,
.cus-input-radio-group[data-disabled='true'] .cus-input-radio-group__description,
.cus-input-radio-group[data-disabled='true'] .cus-input-radio-group__empty {
  color: var(--radio-group-disabled-text);
}
</style>
