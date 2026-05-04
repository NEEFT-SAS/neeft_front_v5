<template>
  <div
    class="cus-input-switch"
    :data-size="props.size"
    :data-checked="isChecked ? 'true' : 'false'"
    :data-selected="props.selected ? 'true' : 'false'"
    :data-disabled="props.disabled ? 'true' : 'false'"
    :data-error="hasError ? 'true' : 'false'"
  >
    <label class="cus-input-switch__label" :for="switchId">
      <input
        :id="switchId"
        class="cus-input-switch__native"
        type="checkbox"
        role="switch"
        :name="props.name || undefined"
        :value="props.value"
        :checked="isChecked"
        :disabled="props.disabled"
        :required="props.required"
        :aria-checked="isChecked ? 'true' : 'false'"
        :aria-invalid="hasError ? 'true' : undefined"
        :aria-describedby="describedBy"
        :aria-label="accessibleLabel"
        @change="onChange"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      >
      <span class="cus-input-switch__track" aria-hidden="true">
        <span class="cus-input-switch__state">
          {{ stateLabel }}
        </span>
        <span class="cus-input-switch__thumb"></span>
      </span>
      <span class="cus-input-switch__content">
        <span v-if="props.label" class="cus-input-switch__text">
          {{ props.label }}
          <span v-if="props.required" class="cus-input-switch__required" aria-hidden="true">*</span>
        </span>
        <span v-if="props.description" class="cus-input-switch__description">
          {{ props.description }}
        </span>
      </span>
    </label>

    <p
      :id="errorId"
      class="cus-input-switch__error"
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
  onLabel: { type: String, default: 'On' },
  offLabel: { type: String, default: 'Off' },
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

const switchId = computed(() => props.id || `cus-input-switch-${generatedId}`)
const errorId = computed(() => `${switchId.value}-error`)
const hasError = computed(() => props.errorMessage.length > 0)
const describedBy = computed(() => {
  if (!props.errorMessage) return undefined
  return errorId.value
})
const accessibleLabel = computed(() => {
  if (props.label) return undefined
  return props.ariaLabel || props.name || switchId.value
})
const isChecked = computed(() => props.modelValue)
const stateLabel = computed(() => isChecked.value ? props.onLabel : props.offLabel)

const onChange = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  emit('update:modelValue', checked)
  emit('change', checked, event)
}
</script>

<style scoped>
.cus-input-switch {
  --switch-track-width-sm: calc(var(--unit) * 7);
  --switch-track-width-md: calc(var(--unit) * 8);
  --switch-track-width-lg: calc(var(--unit) * 10);
  --switch-track-height-sm: calc(var(--unit) * 3.5);
  --switch-track-height-md: calc(var(--unit) * 4);
  --switch-track-height-lg: calc(var(--unit) * 5);
  --switch-thumb-sm: calc(var(--unit) * 2.5);
  --switch-thumb-md: calc(var(--unit) * 3);
  --switch-thumb-lg: calc(var(--unit) * 4);
  --switch-gap-sm: calc(var(--unit) * 0.75);
  --switch-gap-md: var(--space-1);
  --switch-gap-lg: calc(var(--unit) * 1.25);
  --switch-font-sm: calc(var(--unit) * 1.875);
  --switch-font-md: var(--font-body);
  --switch-font-lg: calc(var(--unit) * 2.25);
  --switch-track-bg: color-mix(in oklch, var(--color-bg-soft) 88%, var(--color-panel));
  --switch-track-text: var(--color-muted);
  --switch-track-border: var(--color-panel-line);
  --switch-thumb-bg: var(--color-muted);
  --switch-text: var(--color-text);
  --switch-description: var(--color-subtle);
  --switch-hover-bg: var(--color-bg-soft-hover);
  --switch-hover-border: color-mix(in oklch, var(--color-line) 68%, var(--color-accent));
  --switch-selected-bg: color-mix(in oklch, var(--color-bg-soft-hover) 84%, var(--color-accent));
  --switch-selected-border: var(--color-accent-strong);
  --switch-selected-outline: color-mix(in oklch, var(--color-accent-strong) 42%, var(--color-transparent));
  --switch-selected-thumb: var(--landing-color-header-strong);
  --switch-error: oklch(66% 0.19 28);
  --switch-error-bg: color-mix(in oklch, var(--switch-error) 14%, var(--color-bg-soft));
  --switch-error-border: var(--switch-error);
  --switch-error-outline: color-mix(in oklch, var(--switch-error) 34%, var(--color-transparent));
  --switch-error-text: color-mix(in oklch, var(--switch-error) 80%, var(--landing-color-header-strong));
  --switch-disabled-bg: color-mix(in oklch, var(--color-surface-deep) 72%, var(--color-transparent));
  --switch-disabled-text: color-mix(in oklch, var(--color-text) 42%, var(--color-transparent));
  --switch-disabled-border: color-mix(in oklch, var(--color-line) 68%, var(--color-transparent));
  --switch-current-track-width: var(--switch-track-width-md);
  --switch-current-track-height: var(--switch-track-height-md);
  --switch-current-thumb: var(--switch-thumb-md);
  --switch-current-gap: var(--switch-gap-md);
  --switch-current-font: var(--switch-font-md);
  gap: var(--space-1);

  @apply grid;
}

.cus-input-switch__label {
  gap: var(--switch-current-gap);
  color: var(--switch-text);
  font-family: inherit;
  font-size: var(--switch-current-font);
  line-height: var(--line-base);

  @apply relative flex w-fit cursor-pointer items-start;
}

.cus-input-switch__native {
  inset-block-start: 0;
  inset-inline-start: 0;
  width: var(--switch-current-track-width);
  height: var(--switch-current-track-height);
  margin: 0;
  opacity: 0;

  @apply absolute;
}

.cus-input-switch__track {
  width: var(--switch-current-track-width);
  height: var(--switch-current-track-height);
  margin-top: calc((var(--switch-current-font) * var(--line-base) - var(--switch-current-track-height)) / 2);
  padding: calc(var(--unit) * 0.5);
  border: var(--border) solid var(--switch-track-border);
  border-radius: var(--radius-round);
  outline: calc(var(--border) * 2) solid var(--color-transparent);
  outline-offset: calc(var(--border) * 2);
  background-color: var(--switch-track-bg);
  color: var(--switch-track-text);
  transition-duration: var(--motion-fast);

  @apply relative inline-flex shrink-0 items-center transition-colors;
}

.cus-input-switch__state {
  inset: 0;
  padding-inline: calc(var(--unit) * 0.75);
  color: currentColor;
  font-size: calc(var(--unit) * 1.25);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
  text-transform: uppercase;

  @apply absolute flex items-center justify-end;
}

.cus-input-switch__thumb {
  width: var(--switch-current-thumb);
  height: var(--switch-current-thumb);
  border-radius: var(--radius-round);
  background-color: var(--switch-thumb-bg);
  transition-duration: var(--motion-fast);

  @apply relative block transition-transform;
}

.cus-input-switch__content {
  gap: calc(var(--unit) * 0.25);

  @apply grid min-w-0;
}

.cus-input-switch__text {
  font-weight: var(--font-weight-semibold);

  @apply min-w-0;
}

.cus-input-switch__required {
  color: var(--color-accent-strong);
}

.cus-input-switch__description {
  color: var(--switch-description);
  font-size: var(--font-eyebrow);
  line-height: var(--line-base);
}

.cus-input-switch__error {
  margin: 0;
  min-height: calc(var(--font-eyebrow) * var(--line-base));
  color: var(--switch-error-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.cus-input-switch__error[data-visible='false'] {
  visibility: hidden;
}

.cus-input-switch[data-size='sm'] {
  --switch-current-track-width: var(--switch-track-width-sm);
  --switch-current-track-height: var(--switch-track-height-sm);
  --switch-current-thumb: var(--switch-thumb-sm);
  --switch-current-gap: var(--switch-gap-sm);
  --switch-current-font: var(--switch-font-sm);
}

.cus-input-switch[data-size='md'] {
  --switch-current-track-width: var(--switch-track-width-md);
  --switch-current-track-height: var(--switch-track-height-md);
  --switch-current-thumb: var(--switch-thumb-md);
  --switch-current-gap: var(--switch-gap-md);
  --switch-current-font: var(--switch-font-md);
}

.cus-input-switch[data-size='lg'] {
  --switch-current-track-width: var(--switch-track-width-lg);
  --switch-current-track-height: var(--switch-track-height-lg);
  --switch-current-thumb: var(--switch-thumb-lg);
  --switch-current-gap: var(--switch-gap-lg);
  --switch-current-font: var(--switch-font-lg);
}

.cus-input-switch:not([data-disabled='true']):hover .cus-input-switch__track {
  border-color: var(--switch-hover-border);
  background-color: var(--switch-hover-bg);
}

.cus-input-switch__native:focus-visible + .cus-input-switch__track,
.cus-input-switch:not([data-disabled='true'])[data-selected='true'] .cus-input-switch__track {
  border-color: var(--switch-selected-border);
  outline-color: var(--switch-selected-outline);
  background-color: var(--switch-selected-bg);
}

.cus-input-switch:not([data-disabled='true'])[data-checked='true'] .cus-input-switch__track {
  border-color: var(--switch-selected-border);
  background-color: var(--switch-selected-bg);
  color: var(--landing-color-header-strong);
}

.cus-input-switch[data-checked='true'] .cus-input-switch__state {
  @apply justify-start;
}

.cus-input-switch[data-checked='true'] .cus-input-switch__thumb {
  background-color: var(--switch-selected-thumb);
  transform: translateX(calc(var(--switch-current-track-width) - var(--switch-current-thumb) - var(--unit)));
}

.cus-input-switch:not([data-disabled='true'])[data-error='true'] .cus-input-switch__track {
  border-color: var(--switch-error-border);
  outline-color: var(--switch-error-outline);
  background-color: var(--switch-error-bg);
}

.cus-input-switch:not([data-disabled='true'])[data-error='true'] .cus-input-switch__text {
  color: var(--switch-error-text);
}

.cus-input-switch[data-disabled='true'] .cus-input-switch__label {
  color: var(--switch-disabled-text);

  @apply cursor-not-allowed;
}

.cus-input-switch[data-disabled='true'] .cus-input-switch__track {
  border-color: var(--switch-disabled-border);
  background-color: var(--switch-disabled-bg);
  color: var(--switch-disabled-text);
}

.cus-input-switch[data-disabled='true'] .cus-input-switch__thumb {
  background-color: var(--switch-disabled-text);
}
</style>
