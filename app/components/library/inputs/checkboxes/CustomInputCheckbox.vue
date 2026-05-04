<template>
  <div
    class="cus-input-checkbox"
    :data-size="props.size"
    :data-checked="isChecked ? 'true' : 'false'"
    :data-indeterminate="props.indeterminate ? 'true' : 'false'"
    :data-selected="props.selected ? 'true' : 'false'"
    :data-disabled="props.disabled ? 'true' : 'false'"
    :data-error="hasError ? 'true' : 'false'"
  >
    <label class="cus-input-checkbox__label" :for="checkboxId">
      <input
        :id="checkboxId"
        ref="inputElement"
        class="cus-input-checkbox__native"
        type="checkbox"
        :name="props.name || undefined"
        :value="props.value"
        :checked="isChecked"
        :disabled="props.disabled"
        :required="props.required"
        :aria-invalid="hasError ? 'true' : undefined"
        :aria-describedby="describedBy"
        :aria-label="accessibleLabel"
        @change="onChange"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      >
      <span class="cus-input-checkbox__box" aria-hidden="true">
        <Icon v-if="props.indeterminate" class="cus-input-checkbox__mark" name="lucide:minus" aria-hidden="true" />
        <Icon v-else-if="isChecked" class="cus-input-checkbox__mark" name="lucide:check" aria-hidden="true" />
      </span>
      <span class="cus-input-checkbox__content">
        <span v-if="props.label" class="cus-input-checkbox__text">
          {{ props.label }}
          <span v-if="props.required" class="cus-input-checkbox__required" aria-hidden="true">*</span>
        </span>
        <span v-if="props.description" class="cus-input-checkbox__description">
          {{ props.description }}
        </span>
      </span>
    </label>

    <p
      :id="errorId"
      class="cus-input-checkbox__error"
      :data-visible="hasError ? 'true' : 'false'"
      :aria-live="hasError ? 'polite' : undefined"
      :aria-hidden="hasError ? undefined : 'true'"
    >
      {{ props.errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
const generatedId = useId()

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  value: { type: [String, Number, Boolean], default: 'on' },
  label: { type: String, default: '' },
  description: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
  indeterminate: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur'])

const inputElement = ref<HTMLInputElement | null>(null)
const checkboxId = computed(() => props.id || `cus-input-checkbox-${generatedId}`)
const errorId = computed(() => `${checkboxId.value}-error`)
const hasError = computed(() => props.errorMessage.length > 0)
const describedBy = computed(() => {
  if (!props.errorMessage) return undefined
  return errorId.value
})
const accessibleLabel = computed(() => {
  if (props.label) return undefined
  return props.ariaLabel || props.name || checkboxId.value
})
const isChecked = computed(() => props.modelValue)

const syncIndeterminateState = () => {
  if (!inputElement.value) return
  inputElement.value.indeterminate = props.indeterminate
}

const onChange = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  emit('update:modelValue', checked)
  emit('change', checked, event)
}

watch(() => props.indeterminate, syncIndeterminateState)
onMounted(syncIndeterminateState)
</script>

<style scoped>
.cus-input-checkbox {
  --checkbox-box-sm: calc(var(--unit) * 2.25);
  --checkbox-box-md: calc(var(--unit) * 2.75);
  --checkbox-box-lg: calc(var(--unit) * 3.25);
  --checkbox-icon-sm: calc(var(--unit) * 1.5);
  --checkbox-icon-md: calc(var(--unit) * 1.75);
  --checkbox-icon-lg: calc(var(--unit) * 2);
  --checkbox-gap-sm: calc(var(--unit) * 0.75);
  --checkbox-gap-md: var(--space-1);
  --checkbox-gap-lg: calc(var(--unit) * 1.25);
  --checkbox-font-sm: calc(var(--unit) * 1.875);
  --checkbox-font-md: var(--font-body);
  --checkbox-font-lg: calc(var(--unit) * 2.25);
  --checkbox-bg: color-mix(in oklch, var(--color-bg-soft) 88%, var(--color-panel));
  --checkbox-text: var(--color-text);
  --checkbox-description: var(--color-subtle);
  --checkbox-border: var(--color-panel-line);
  --checkbox-hover-bg: var(--color-bg-soft-hover);
  --checkbox-hover-border: color-mix(in oklch, var(--color-line) 68%, var(--color-accent));
  --checkbox-selected-bg: color-mix(in oklch, var(--color-bg-soft-hover) 84%, var(--color-accent));
  --checkbox-selected-border: var(--color-accent-strong);
  --checkbox-selected-outline: color-mix(in oklch, var(--color-accent-strong) 42%, var(--color-transparent));
  --checkbox-error: oklch(66% 0.19 28);
  --checkbox-error-bg: color-mix(in oklch, var(--checkbox-error) 14%, var(--color-bg-soft));
  --checkbox-error-border: var(--checkbox-error);
  --checkbox-error-outline: color-mix(in oklch, var(--checkbox-error) 34%, var(--color-transparent));
  --checkbox-error-text: color-mix(in oklch, var(--checkbox-error) 80%, var(--landing-color-header-strong));
  --checkbox-disabled-bg: color-mix(in oklch, var(--color-surface-deep) 72%, var(--color-transparent));
  --checkbox-disabled-text: color-mix(in oklch, var(--color-text) 42%, var(--color-transparent));
  --checkbox-disabled-border: color-mix(in oklch, var(--color-line) 68%, var(--color-transparent));
  --checkbox-current-box: var(--checkbox-box-md);
  --checkbox-current-icon: var(--checkbox-icon-md);
  --checkbox-current-gap: var(--checkbox-gap-md);
  --checkbox-current-font: var(--checkbox-font-md);
  gap: var(--space-1);

  @apply grid;
}

.cus-input-checkbox__label {
  gap: var(--checkbox-current-gap);
  color: var(--checkbox-text);
  font-family: inherit;
  font-size: var(--checkbox-current-font);
  line-height: var(--line-base);

  @apply relative flex w-fit cursor-pointer items-start;
}

.cus-input-checkbox__native {
  inset-block-start: 0;
  inset-inline-start: 0;
  width: var(--checkbox-current-box);
  height: var(--checkbox-current-box);
  margin: 0;
  opacity: 0;

  @apply absolute;
}

.cus-input-checkbox__box {
  width: var(--checkbox-current-box);
  height: var(--checkbox-current-box);
  margin-top: calc((var(--checkbox-current-font) * var(--line-base) - var(--checkbox-current-box)) / 2);
  border: var(--border) solid var(--checkbox-border);
  border-radius: var(--radius);
  outline: calc(var(--border) * 2) solid var(--color-transparent);
  outline-offset: calc(var(--border) * 2);
  background-color: var(--checkbox-bg);
  color: var(--checkbox-text);
  transition-duration: var(--motion-fast);

  @apply inline-flex shrink-0 items-center justify-center transition-colors;
}

.cus-input-checkbox__mark {
  width: var(--checkbox-current-icon);
  height: var(--checkbox-current-icon);
  color: currentColor;
}

.cus-input-checkbox__content {
  gap: calc(var(--unit) * 0.25);

  @apply grid min-w-0;
}

.cus-input-checkbox__text {
  font-weight: var(--font-weight-semibold);

  @apply min-w-0;
}

.cus-input-checkbox__required {
  color: var(--color-accent-strong);
}

.cus-input-checkbox__description {
  color: var(--checkbox-description);
  font-size: var(--font-eyebrow);
  line-height: var(--line-base);
}

.cus-input-checkbox__error {
  margin: 0;
  min-height: calc(var(--font-eyebrow) * var(--line-base));
  color: var(--checkbox-error-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.cus-input-checkbox__error[data-visible='false'] {
  visibility: hidden;
}

.cus-input-checkbox[data-size='sm'] {
  --checkbox-current-box: var(--checkbox-box-sm);
  --checkbox-current-icon: var(--checkbox-icon-sm);
  --checkbox-current-gap: var(--checkbox-gap-sm);
  --checkbox-current-font: var(--checkbox-font-sm);
}

.cus-input-checkbox[data-size='md'] {
  --checkbox-current-box: var(--checkbox-box-md);
  --checkbox-current-icon: var(--checkbox-icon-md);
  --checkbox-current-gap: var(--checkbox-gap-md);
  --checkbox-current-font: var(--checkbox-font-md);
}

.cus-input-checkbox[data-size='lg'] {
  --checkbox-current-box: var(--checkbox-box-lg);
  --checkbox-current-icon: var(--checkbox-icon-lg);
  --checkbox-current-gap: var(--checkbox-gap-lg);
  --checkbox-current-font: var(--checkbox-font-lg);
}

.cus-input-checkbox:not([data-disabled='true']):hover .cus-input-checkbox__box {
  border-color: var(--checkbox-hover-border);
  background-color: var(--checkbox-hover-bg);
}

.cus-input-checkbox__native:focus-visible + .cus-input-checkbox__box,
.cus-input-checkbox:not([data-disabled='true'])[data-selected='true'] .cus-input-checkbox__box {
  border-color: var(--checkbox-selected-border);
  outline-color: var(--checkbox-selected-outline);
  background-color: var(--checkbox-selected-bg);
}

.cus-input-checkbox:not([data-disabled='true'])[data-checked='true'] .cus-input-checkbox__box,
.cus-input-checkbox:not([data-disabled='true'])[data-indeterminate='true'] .cus-input-checkbox__box {
  border-color: var(--checkbox-selected-border);
  background-color: var(--checkbox-selected-bg);
}

.cus-input-checkbox:not([data-disabled='true'])[data-error='true'] .cus-input-checkbox__box {
  border-color: var(--checkbox-error-border);
  outline-color: var(--checkbox-error-outline);
  background-color: var(--checkbox-error-bg);
}

.cus-input-checkbox:not([data-disabled='true'])[data-error='true'] .cus-input-checkbox__text {
  color: var(--checkbox-error-text);
}

.cus-input-checkbox[data-disabled='true'] .cus-input-checkbox__label {
  color: var(--checkbox-disabled-text);

  @apply cursor-not-allowed;
}

.cus-input-checkbox[data-disabled='true'] .cus-input-checkbox__box {
  border-color: var(--checkbox-disabled-border);
  background-color: var(--checkbox-disabled-bg);
}
</style>
