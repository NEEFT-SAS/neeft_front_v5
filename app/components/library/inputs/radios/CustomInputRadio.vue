<template>
  <div
    class="cus-input-radio"
    :data-size="props.size"
    :data-checked="isChecked ? 'true' : 'false'"
    :data-selected="props.selected ? 'true' : 'false'"
    :data-disabled="props.disabled ? 'true' : 'false'"
    :data-error="hasError ? 'true' : 'false'"
  >
    <label class="cus-input-radio__label" :for="radioId">
      <input
        :id="radioId"
        class="cus-input-radio__native"
        type="radio"
        :name="props.name || undefined"
        :value="nativeValue"
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
      <span class="cus-input-radio__dot" aria-hidden="true">
        <span class="cus-input-radio__mark"></span>
      </span>
      <span class="cus-input-radio__content">
        <span v-if="props.label" class="cus-input-radio__text">
          {{ props.label }}
          <span v-if="props.required" class="cus-input-radio__required" aria-hidden="true">*</span>
        </span>
        <span v-if="props.description" class="cus-input-radio__description">
          {{ props.description }}
        </span>
      </span>
    </label>

    <p
      :id="errorId"
      class="cus-input-radio__error"
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
  modelValue: { type: [String, Number, Boolean], default: '' },
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  value: { type: [String, Number, Boolean], default: '' },
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
  errorMessage: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur'])

const radioId = computed(() => props.id || `cus-input-radio-${generatedId}`)
const errorId = computed(() => `${radioId.value}-error`)
const hasError = computed(() => props.errorMessage.length > 0)
const describedBy = computed(() => {
  if (!props.errorMessage) return undefined
  return errorId.value
})
const accessibleLabel = computed(() => {
  if (props.label) return undefined
  return props.ariaLabel || props.name || radioId.value
})
const isChecked = computed(() => props.modelValue === props.value)
const nativeValue = computed(() => String(props.value))

const onChange = (event: Event) => {
  if (!(event.target as HTMLInputElement).checked) return
  emit('update:modelValue', props.value)
  emit('change', props.value, event)
}
</script>

<style scoped>
.cus-input-radio {
  --radio-box-sm: calc(var(--unit) * 2.25);
  --radio-box-md: calc(var(--unit) * 2.75);
  --radio-box-lg: calc(var(--unit) * 3.25);
  --radio-mark-sm: calc(var(--unit) * 1);
  --radio-mark-md: calc(var(--unit) * 1.25);
  --radio-mark-lg: calc(var(--unit) * 1.5);
  --radio-gap-sm: calc(var(--unit) * 0.75);
  --radio-gap-md: var(--space-1);
  --radio-gap-lg: calc(var(--unit) * 1.25);
  --radio-font-sm: calc(var(--unit) * 1.875);
  --radio-font-md: var(--font-body);
  --radio-font-lg: calc(var(--unit) * 2.25);
  --radio-bg: color-mix(in oklch, var(--color-bg-soft) 88%, var(--color-panel));
  --radio-text: var(--color-text);
  --radio-description: var(--color-subtle);
  --radio-border: var(--color-panel-line);
  --radio-hover-bg: var(--color-bg-soft-hover);
  --radio-hover-border: color-mix(in oklch, var(--color-line) 68%, var(--color-accent));
  --radio-selected-bg: color-mix(in oklch, var(--color-bg-soft-hover) 84%, var(--color-accent));
  --radio-selected-border: var(--color-accent-strong);
  --radio-selected-outline: color-mix(in oklch, var(--color-accent-strong) 42%, var(--color-transparent));
  --radio-error: oklch(66% 0.19 28);
  --radio-error-bg: color-mix(in oklch, var(--radio-error) 14%, var(--color-bg-soft));
  --radio-error-border: var(--radio-error);
  --radio-error-outline: color-mix(in oklch, var(--radio-error) 34%, var(--color-transparent));
  --radio-error-text: color-mix(in oklch, var(--radio-error) 80%, var(--landing-color-header-strong));
  --radio-disabled-bg: color-mix(in oklch, var(--color-surface-deep) 72%, var(--color-transparent));
  --radio-disabled-text: color-mix(in oklch, var(--color-text) 42%, var(--color-transparent));
  --radio-disabled-border: color-mix(in oklch, var(--color-line) 68%, var(--color-transparent));
  --radio-current-box: var(--radio-box-md);
  --radio-current-mark: var(--radio-mark-md);
  --radio-current-gap: var(--radio-gap-md);
  --radio-current-font: var(--radio-font-md);
  gap: var(--space-1);

  @apply grid;
}

.cus-input-radio__label {
  gap: var(--radio-current-gap);
  color: var(--radio-text);
  font-family: inherit;
  font-size: var(--radio-current-font);
  line-height: var(--line-base);

  @apply relative flex w-fit cursor-pointer items-start;
}

.cus-input-radio__native {
  inset-block-start: 0;
  inset-inline-start: 0;
  width: var(--radio-current-box);
  height: var(--radio-current-box);
  margin: 0;
  opacity: 0;

  @apply absolute;
}

.cus-input-radio__dot {
  width: var(--radio-current-box);
  height: var(--radio-current-box);
  margin-top: calc((var(--radio-current-font) * var(--line-base) - var(--radio-current-box)) / 2);
  border: var(--border) solid var(--radio-border);
  border-radius: var(--radius-round);
  outline: calc(var(--border) * 2) solid var(--color-transparent);
  outline-offset: calc(var(--border) * 2);
  background-color: var(--radio-bg);
  transition-duration: var(--motion-fast);

  @apply inline-flex shrink-0 items-center justify-center transition-colors;
}

.cus-input-radio__mark {
  width: var(--radio-current-mark);
  height: var(--radio-current-mark);
  border-radius: var(--radius-round);
  background-color: var(--color-transparent);
  transform: scale(0);
  transition-duration: var(--motion-fast);

  @apply block transition-transform;
}

.cus-input-radio__content {
  gap: calc(var(--unit) * 0.25);

  @apply grid min-w-0;
}

.cus-input-radio__text {
  font-weight: var(--font-weight-semibold);

  @apply min-w-0;
}

.cus-input-radio__required {
  color: var(--color-accent-strong);
}

.cus-input-radio__description {
  color: var(--radio-description);
  font-size: var(--font-eyebrow);
  line-height: var(--line-base);
}

.cus-input-radio__error {
  margin: 0;
  min-height: calc(var(--font-eyebrow) * var(--line-base));
  color: var(--radio-error-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.cus-input-radio__error[data-visible='false'] {
  visibility: hidden;
}

.cus-input-radio[data-size='sm'] {
  --radio-current-box: var(--radio-box-sm);
  --radio-current-mark: var(--radio-mark-sm);
  --radio-current-gap: var(--radio-gap-sm);
  --radio-current-font: var(--radio-font-sm);
}

.cus-input-radio[data-size='md'] {
  --radio-current-box: var(--radio-box-md);
  --radio-current-mark: var(--radio-mark-md);
  --radio-current-gap: var(--radio-gap-md);
  --radio-current-font: var(--radio-font-md);
}

.cus-input-radio[data-size='lg'] {
  --radio-current-box: var(--radio-box-lg);
  --radio-current-mark: var(--radio-mark-lg);
  --radio-current-gap: var(--radio-gap-lg);
  --radio-current-font: var(--radio-font-lg);
}

.cus-input-radio:not([data-disabled='true']):hover .cus-input-radio__dot {
  border-color: var(--radio-hover-border);
  background-color: var(--radio-hover-bg);
}

.cus-input-radio__native:focus-visible + .cus-input-radio__dot,
.cus-input-radio:not([data-disabled='true'])[data-selected='true'] .cus-input-radio__dot {
  border-color: var(--radio-selected-border);
  outline-color: var(--radio-selected-outline);
  background-color: var(--radio-selected-bg);
}

.cus-input-radio:not([data-disabled='true'])[data-checked='true'] .cus-input-radio__dot {
  border-color: var(--radio-selected-border);
  background-color: var(--radio-selected-bg);
}

.cus-input-radio[data-checked='true'] .cus-input-radio__mark {
  background-color: var(--landing-color-header-strong);
  transform: scale(1);
}

.cus-input-radio:not([data-disabled='true'])[data-error='true'] .cus-input-radio__dot {
  border-color: var(--radio-error-border);
  outline-color: var(--radio-error-outline);
  background-color: var(--radio-error-bg);
}

.cus-input-radio:not([data-disabled='true'])[data-error='true'] .cus-input-radio__text {
  color: var(--radio-error-text);
}

.cus-input-radio[data-disabled='true'] .cus-input-radio__label {
  color: var(--radio-disabled-text);

  @apply cursor-not-allowed;
}

.cus-input-radio[data-disabled='true'] .cus-input-radio__dot {
  border-color: var(--radio-disabled-border);
  background-color: var(--radio-disabled-bg);
}

.cus-input-radio[data-disabled='true'] .cus-input-radio__mark {
  background-color: var(--radio-disabled-text);
}
</style>
