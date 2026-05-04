<template>
  <div
    class="cus-input-text"
    :data-size="props.size"
    :data-selected="props.selected ? 'true' : 'false'"
    :data-disabled="props.disabled ? 'true' : 'false'"
    :data-error="hasError ? 'true' : 'false'"
    :data-label-position="props.labelPosition"
    :data-empty="props.modelValue.length === 0 ? 'true' : 'false'"
    :data-has-inside-label="hasInsideLabel ? 'true' : 'false'"
    :data-has-left-icon="props.leftIcon ? 'true' : 'false'"
    :data-has-right-icon="props.rightIcon ? 'true' : 'false'"
  >
    <label v-if="hasExternalLabel" class="cus-input-text__label" :for="inputId">
      <span>{{ props.label }}</span>
      <span v-if="props.required" class="cus-input-text__required" aria-hidden="true">*</span>
    </label>

    <div class="cus-input-text__control">
      <span v-if="showInsideLabel" class="cus-input-text__inside-label" aria-hidden="true">
        <span class="cus-input-text__inside-label-text">{{ props.label }}</span>
        <span v-if="props.required" class="cus-input-text__required">*</span>
      </span>
      <button
        v-if="props.leftIcon && props.leftIconAction"
        class="cus-input-text__icon-button cus-input-text__icon-button--left"
        type="button"
        :disabled="props.disabled"
        :aria-label="leftIconAriaLabelValue"
        :aria-pressed="leftIconPressedValue"
        @click="emit('left-icon-click', $event)"
      >
        <Icon class="cus-input-text__icon" :name="props.leftIcon" aria-hidden="true" />
      </button>
      <Icon v-else-if="props.leftIcon" class="cus-input-text__icon cus-input-text__icon--left" :name="props.leftIcon" aria-hidden="true" />
      <input
        :id="inputId"
        class="cus-input-text__input"
        :name="props.name || undefined"
        :type="props.type"
        :value="props.modelValue"
        :placeholder="placeholderValue"
        :required="props.required"
        :disabled="props.disabled"
        :autocomplete="autocompleteValue"
        :inputmode="inputModeValue"
        :aria-label="accessibleLabel"
        :aria-invalid="hasError ? 'true' : undefined"
        :aria-describedby="describedBy"
        @input="onInput"
        @change="emit('change', $event)"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      >
      <button
        v-if="props.rightIcon && props.rightIconAction"
        class="cus-input-text__icon-button cus-input-text__icon-button--right"
        type="button"
        :disabled="props.disabled"
        :aria-label="rightIconAriaLabelValue"
        :aria-pressed="rightIconPressedValue"
        @click="emit('right-icon-click', $event)"
      >
        <Icon class="cus-input-text__icon" :name="props.rightIcon" aria-hidden="true" />
      </button>
      <Icon v-else-if="props.rightIcon" class="cus-input-text__icon cus-input-text__icon--right" :name="props.rightIcon" aria-hidden="true" />
    </div>

    <p
      :id="errorId"
      class="cus-input-text__error"
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
  modelValue: { type: String, default: '' },
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  label: { type: String, default: '' },
  labelPosition: {
    type: String,
    default: 'outside',
    validator: (value: string) => ['inside', 'outside'].includes(value)
  },
  placeholder: { type: String, default: '' },
  leftIcon: { type: String, default: '' },
  rightIcon: { type: String, default: '' },
  leftIconAction: { type: Boolean, default: false },
  rightIconAction: { type: Boolean, default: false },
  leftIconAriaLabel: { type: String, default: '' },
  rightIconAriaLabel: { type: String, default: '' },
  leftIconToggle: { type: Boolean, default: false },
  rightIconToggle: { type: Boolean, default: false },
  leftIconPressed: { type: Boolean, default: false },
  rightIconPressed: { type: Boolean, default: false },
  type: {
    type: String,
    default: 'text',
    validator: (value: string) => ['email', 'password', 'text'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  autocomplete: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur', 'left-icon-click', 'right-icon-click'])

const inputId = computed(() => props.id || `cus-input-text-${generatedId}`)
const errorId = computed(() => `${inputId.value}-error`)
const hasError = computed(() => props.errorMessage.length > 0)
const hasExternalLabel = computed(() => props.label.length > 0 && props.labelPosition === 'outside')
const hasInsideLabel = computed(() => props.label.length > 0 && props.labelPosition === 'inside')
const showInsideLabel = computed(() => hasInsideLabel.value && props.modelValue.length === 0)
const placeholderValue = computed(() => {
  return props.placeholder || undefined
})
const describedBy = computed(() => {
  if (!props.errorMessage) return undefined
  return errorId.value
})

const autocompleteValue = computed(() => {
  if (props.autocomplete) return props.autocomplete
  if (props.type === 'email') return 'email'
  if (props.type === 'password') return 'current-password'
  return undefined
})

const inputModeValue = computed(() => {
  if (props.type === 'email') return 'email'
  return undefined
})

const accessibleLabel = computed(() => {
  if (hasExternalLabel.value) return undefined
  if (props.label) return props.label
  if (props.placeholder) return props.placeholder
  if (props.name) return props.name
  return undefined
})

const leftIconAriaLabelValue = computed(() => props.leftIconAriaLabel || 'Input left action')
const rightIconAriaLabelValue = computed(() => props.rightIconAriaLabel || 'Input right action')
const leftIconPressedValue = computed(() => {
  if (!props.leftIconToggle) return undefined
  return String(props.leftIconPressed)
})
const rightIconPressedValue = computed(() => {
  if (!props.rightIconToggle) return undefined
  return String(props.rightIconPressed)
})

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('input', event)
}
</script>

<style scoped>
.cus-input-text {
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
  --input-current-height: var(--input-height-md);
  --input-current-padding-x: var(--input-padding-x-md);
  --input-current-gap: var(--input-gap-md);
  --input-current-font: var(--input-font-md);
  --input-current-icon: var(--input-icon-md);
  gap: var(--space-1);

  @apply grid w-full;
}

.cus-input-text__label {
  gap: calc(var(--unit) * 0.5);
  color: var(--input-label);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);

  @apply inline-flex w-fit items-center;
}

.cus-input-text__required {
  color: var(--input-error);
}

.cus-input-text__control {
  position: relative;
  gap: var(--input-current-gap);
  height: var(--input-current-height);
  min-height: var(--input-current-height);
  padding: 0 var(--input-current-padding-x);
  border: var(--border) solid var(--input-border);
  border-radius: var(--radius);
  outline: calc(var(--border) * 2) solid var(--color-transparent);
  outline-offset: calc(var(--border) * 2);
  background-color: var(--input-bg);
  color: var(--input-text);
  transition-duration: var(--motion-fast);

  @apply flex w-full items-center transition-colors;
}

.cus-input-text__inside-label {
  position: absolute;
  inset-inline: var(--input-current-padding-x);
  top: 50%;
  z-index: 1;
  gap: calc(var(--unit) * 0.5);
  max-width: calc(100% - (var(--input-current-padding-x) * 2));
  color: var(--input-placeholder);
  font-size: var(--input-current-font);
  line-height: var(--line-tight);
  pointer-events: none;
  transform: translateY(-50%);

  @apply inline-flex items-center overflow-hidden whitespace-nowrap;
}

.cus-input-text__inside-label-text {
  @apply truncate;
}

.cus-input-text[data-has-left-icon='true'] .cus-input-text__inside-label {
  inset-inline-start: calc(var(--input-current-padding-x) + var(--input-current-icon) + var(--input-current-gap));
}

.cus-input-text[data-has-right-icon='true'] .cus-input-text__inside-label {
  inset-inline-end: calc(var(--input-current-padding-x) + var(--input-current-icon) + var(--input-current-gap));
}

.cus-input-text__input {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
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

.cus-input-text__input::placeholder {
  color: var(--input-placeholder);
  opacity: 1;
}

.cus-input-text[data-has-inside-label='true'][data-empty='true'] .cus-input-text__input::placeholder {
  color: var(--color-transparent);
}

.cus-input-text__icon {
  width: var(--input-current-icon);
  height: var(--input-current-icon);
  color: var(--input-icon);

  @apply shrink-0;
}

.cus-input-text__icon-button {
  width: calc(var(--input-current-icon) + var(--input-current-gap));
  height: calc(var(--input-current-icon) + var(--input-current-gap));
  padding: 0;
  border: 0;
  border-radius: var(--radius);
  background-color: var(--color-transparent);
  color: var(--input-icon);
  transition-duration: var(--motion-fast);

  @apply inline-flex shrink-0 cursor-pointer items-center justify-center transition-colors;
}

.cus-input-text__icon-button:hover {
  background-color: color-mix(in oklch, var(--landing-color-header-strong) 10%, var(--color-transparent));
  color: var(--landing-color-header-strong);
}

.cus-input-text__icon-button:focus-visible {
  outline: calc(var(--border) * 2) solid var(--color-accent-strong);
  outline-offset: calc(var(--border) * 2);
}

.cus-input-text__icon-button:disabled {
  color: var(--input-disabled-text);

  @apply cursor-not-allowed;
}

.cus-input-text__error {
  margin: 0;
  min-height: calc(var(--font-eyebrow) * var(--line-base));
  color: var(--input-error-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.cus-input-text__error[data-visible='false'] {
  visibility: hidden;
}

.cus-input-text[data-size='sm'] {
  --input-current-height: var(--input-height-sm);
  --input-current-padding-x: var(--input-padding-x-sm);
  --input-current-gap: var(--input-gap-sm);
  --input-current-font: var(--input-font-sm);
  --input-current-icon: var(--input-icon-sm);
}

.cus-input-text[data-size='md'] {
  --input-current-height: var(--input-height-md);
  --input-current-padding-x: var(--input-padding-x-md);
  --input-current-gap: var(--input-gap-md);
  --input-current-font: var(--input-font-md);
  --input-current-icon: var(--input-icon-md);
}

.cus-input-text[data-size='lg'] {
  --input-current-height: var(--input-height-lg);
  --input-current-padding-x: var(--input-padding-x-lg);
  --input-current-gap: var(--input-gap-lg);
  --input-current-font: var(--input-font-lg);
  --input-current-icon: var(--input-icon-lg);
}

.cus-input-text:not([data-disabled='true']):hover .cus-input-text__control {
  border-color: var(--input-hover-border);
  background-color: var(--input-hover-bg);
}

.cus-input-text:not([data-disabled='true'])[data-error='true'] .cus-input-text__label {
  color: var(--input-error-text);
}

.cus-input-text:not([data-disabled='true'])[data-error='true'] .cus-input-text__control {
  border-color: var(--input-error-border);
  outline-color: var(--input-error-outline);
  background-color: var(--input-error-bg);
}

.cus-input-text:not([data-disabled='true']):not([data-error='true']):focus-within .cus-input-text__control,
.cus-input-text:not([data-disabled='true']):not([data-error='true'])[data-selected='true'] .cus-input-text__control {
  border-color: var(--input-selected-border);
  outline-color: var(--input-selected-outline);
  background-color: var(--input-selected-bg);
}

.cus-input-text:not([data-disabled='true']):not([data-error='true']):focus-within .cus-input-text__label,
.cus-input-text:not([data-disabled='true']):not([data-error='true'])[data-selected='true'] .cus-input-text__label {
  color: var(--color-accent-strong);
}

.cus-input-text[data-disabled='true'] .cus-input-text__label,
.cus-input-text[data-disabled='true'] .cus-input-text__control,
.cus-input-text[data-disabled='true'] .cus-input-text__icon {
  color: var(--input-disabled-text);
}

.cus-input-text[data-disabled='true'] .cus-input-text__control {
  border-color: var(--input-disabled-border);
  background-color: var(--input-disabled-bg);

  @apply cursor-not-allowed;
}

.cus-input-text[data-disabled='true'] .cus-input-text__input {
  @apply cursor-not-allowed;
}
</style>
