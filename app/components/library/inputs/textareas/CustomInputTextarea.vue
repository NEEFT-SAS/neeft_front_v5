<template>
  <div
    class="cus-input-textarea"
    :data-size="props.size"
    :data-selected="props.selected ? 'true' : 'false'"
    :data-disabled="props.disabled ? 'true' : 'false'"
    :data-error="hasError ? 'true' : 'false'"
    :data-resize="props.resize"
    :data-label-position="props.labelPosition"
    :data-empty="props.modelValue.length === 0 ? 'true' : 'false'"
    :data-has-inside-label="hasInsideLabel ? 'true' : 'false'"
  >
    <label v-if="hasExternalLabel" class="cus-input-textarea__label" :for="textareaId">
      <span>{{ props.label }}</span>
      <span v-if="props.required" class="cus-input-textarea__required" aria-hidden="true">*</span>
    </label>

    <p v-if="props.description" :id="descriptionId" class="cus-input-textarea__description">
      {{ props.description }}
    </p>

    <div class="cus-input-textarea__control">
      <span v-if="showInsideLabel" class="cus-input-textarea__inside-label" aria-hidden="true">
        <span class="cus-input-textarea__inside-label-text">{{ props.label }}</span>
        <span v-if="props.required" class="cus-input-textarea__required">*</span>
      </span>
      <textarea
        :id="textareaId"
        class="cus-input-textarea__input"
        :name="props.name || undefined"
        :value="props.modelValue"
        :placeholder="placeholderValue"
        :required="props.required"
        :disabled="props.disabled"
        :autocomplete="props.autocomplete"
        :rows="props.rows"
        :minlength="nativeMinLength"
        :maxlength="nativeMaxLength"
        :aria-label="accessibleLabel"
        :aria-invalid="hasError ? 'true' : undefined"
        :aria-describedby="describedBy"
        @input="onInput"
        @change="emit('change', $event)"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      ></textarea>
    </div>

    <p
      v-if="showCounter"
      :id="counterId"
      class="cus-input-textarea__counter"
      aria-live="polite"
    >
      {{ characterCount }} / {{ props.maxLength }}
    </p>

    <p
      :id="errorId"
      class="cus-input-textarea__error"
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
  description: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  rows: {
    type: Number,
    default: 4,
    validator: (value: number) => Number.isInteger(value) && value >= 2 && value <= 12
  },
  minLength: {
    type: Number,
    default: 0,
    validator: (value: number) => Number.isInteger(value) && value >= 0
  },
  maxLength: {
    type: Number,
    default: 0,
    validator: (value: number) => Number.isInteger(value) && value >= 0
  },
  showCount: { type: Boolean, default: false },
  resize: {
    type: String,
    default: 'vertical',
    validator: (value: string) => ['none', 'vertical'].includes(value)
  },
  autocomplete: { type: String, default: 'off' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur'])

const textareaId = computed(() => props.id || `cus-input-textarea-${generatedId}`)
const descriptionId = computed(() => `${textareaId.value}-description`)
const counterId = computed(() => `${textareaId.value}-counter`)
const errorId = computed(() => `${textareaId.value}-error`)
const hasError = computed(() => props.errorMessage.length > 0)
const hasExternalLabel = computed(() => props.label.length > 0 && props.labelPosition === 'outside')
const hasInsideLabel = computed(() => props.label.length > 0 && props.labelPosition === 'inside')
const showInsideLabel = computed(() => hasInsideLabel.value && props.modelValue.length === 0)
const placeholderValue = computed(() => {
  return props.placeholder || undefined
})
const showCounter = computed(() => props.showCount && props.maxLength > 0)
const characterCount = computed(() => props.modelValue.length)
const nativeMinLength = computed(() => props.minLength > 0 ? props.minLength : undefined)
const nativeMaxLength = computed(() => props.maxLength > 0 ? props.maxLength : undefined)
const describedBy = computed(() => {
  const ids = []
  if (props.description) ids.push(descriptionId.value)
  if (showCounter.value) ids.push(counterId.value)
  if (props.errorMessage) ids.push(errorId.value)
  return ids.length > 0 ? ids.join(' ') : undefined
})
const accessibleLabel = computed(() => {
  if (hasExternalLabel.value) return undefined
  if (props.label) return props.label
  if (props.placeholder) return props.placeholder
  if (props.name) return props.name
  return undefined
})

const onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  emit('input', event)
}
</script>

<style scoped>
.cus-input-textarea {
  --textarea-min-height-sm: calc(var(--unit) * 14);
  --textarea-min-height-md: calc(var(--unit) * 16);
  --textarea-min-height-lg: calc(var(--unit) * 20);
  --textarea-padding-sm: calc(var(--unit) * 1.5);
  --textarea-padding-md: calc(var(--unit) * 2);
  --textarea-padding-lg: calc(var(--unit) * 3);
  --textarea-font-sm: calc(var(--unit) * 2);
  --textarea-font-md: calc(var(--unit) * 2.125);
  --textarea-font-lg: calc(var(--unit) * 2.25);
  --textarea-bg: color-mix(in oklch, var(--color-bg-soft) 88%, var(--color-panel));
  --textarea-text: var(--color-text);
  --textarea-label: var(--color-muted);
  --textarea-description: var(--color-subtle);
  --textarea-placeholder: color-mix(in oklch, var(--color-subtle) 76%, var(--color-transparent));
  --textarea-border: var(--color-panel-line);
  --textarea-hover-bg: var(--color-bg-soft-hover);
  --textarea-hover-border: color-mix(in oklch, var(--color-line) 68%, var(--color-accent));
  --textarea-selected-bg: color-mix(in oklch, var(--color-bg-soft-hover) 84%, var(--color-accent));
  --textarea-selected-border: var(--color-accent-strong);
  --textarea-selected-outline: color-mix(in oklch, var(--color-accent-strong) 42%, var(--color-transparent));
  --textarea-error: oklch(66% 0.19 28);
  --textarea-error-bg: color-mix(in oklch, var(--textarea-error) 14%, var(--color-bg-soft));
  --textarea-error-border: var(--textarea-error);
  --textarea-error-outline: color-mix(in oklch, var(--textarea-error) 34%, var(--color-transparent));
  --textarea-error-text: color-mix(in oklch, var(--textarea-error) 80%, var(--landing-color-header-strong));
  --textarea-disabled-bg: color-mix(in oklch, var(--color-surface-deep) 72%, var(--color-transparent));
  --textarea-disabled-text: color-mix(in oklch, var(--color-text) 42%, var(--color-transparent));
  --textarea-disabled-border: color-mix(in oklch, var(--color-line) 68%, var(--color-transparent));
  --textarea-current-min-height: var(--textarea-min-height-md);
  --textarea-current-padding: var(--textarea-padding-md);
  --textarea-current-font: var(--textarea-font-md);
  gap: var(--space-1);

  @apply grid w-full;
}

.cus-input-textarea__label {
  gap: calc(var(--unit) * 0.5);
  color: var(--textarea-label);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);

  @apply inline-flex w-fit items-center;
}

.cus-input-textarea__required {
  color: var(--textarea-error);
}

.cus-input-textarea__description,
.cus-input-textarea__counter {
  margin: 0;
  color: var(--textarea-description);
  font-size: var(--font-eyebrow);
  line-height: var(--line-base);
}

.cus-input-textarea__counter {
  text-align: end;
}

.cus-input-textarea__control {
  position: relative;
  min-height: var(--textarea-current-min-height);
  padding: var(--textarea-current-padding);
  border: var(--border) solid var(--textarea-border);
  border-radius: var(--radius);
  outline: calc(var(--border) * 2) solid var(--color-transparent);
  outline-offset: calc(var(--border) * 2);
  background-color: var(--textarea-bg);
  color: var(--textarea-text);
  transition-duration: var(--motion-fast);

  @apply flex w-full transition-colors;
}

.cus-input-textarea__inside-label {
  position: absolute;
  inset-block-start: var(--textarea-current-padding);
  inset-inline: var(--textarea-current-padding);
  z-index: 1;
  gap: calc(var(--unit) * 0.5);
  max-width: calc(100% - (var(--textarea-current-padding) * 2));
  color: var(--textarea-placeholder);
  font-size: var(--textarea-current-font);
  line-height: var(--line-base);
  pointer-events: none;

  @apply inline-flex items-center overflow-hidden whitespace-nowrap;
}

.cus-input-textarea__inside-label-text {
  @apply truncate;
}

.cus-input-textarea__input {
  width: 100%;
  min-height: calc(var(--textarea-current-min-height) - var(--textarea-current-padding) * 2);
  border: 0;
  outline: 0;
  resize: vertical;
  background-color: var(--color-transparent);
  color: inherit;
  caret-color: var(--color-accent-strong);
  font-family: inherit;
  font-size: var(--textarea-current-font);
  line-height: var(--line-base);

  @apply appearance-none;
}

.cus-input-textarea__input::placeholder {
  color: var(--textarea-placeholder);
  opacity: 1;
}

.cus-input-textarea[data-has-inside-label='true'][data-empty='true'] .cus-input-textarea__input::placeholder {
  color: var(--color-transparent);
}

.cus-input-textarea__error {
  margin: 0;
  min-height: calc(var(--font-eyebrow) * var(--line-base));
  color: var(--textarea-error-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.cus-input-textarea__error[data-visible='false'] {
  visibility: hidden;
}

.cus-input-textarea[data-resize='none'] .cus-input-textarea__input {
  resize: none;
}

.cus-input-textarea[data-size='sm'] {
  --textarea-current-min-height: var(--textarea-min-height-sm);
  --textarea-current-padding: var(--textarea-padding-sm);
  --textarea-current-font: var(--textarea-font-sm);
}

.cus-input-textarea[data-size='md'] {
  --textarea-current-min-height: var(--textarea-min-height-md);
  --textarea-current-padding: var(--textarea-padding-md);
  --textarea-current-font: var(--textarea-font-md);
}

.cus-input-textarea[data-size='lg'] {
  --textarea-current-min-height: var(--textarea-min-height-lg);
  --textarea-current-padding: var(--textarea-padding-lg);
  --textarea-current-font: var(--textarea-font-lg);
}

.cus-input-textarea:not([data-disabled='true']):hover .cus-input-textarea__control {
  border-color: var(--textarea-hover-border);
  background-color: var(--textarea-hover-bg);
}

.cus-input-textarea:not([data-disabled='true'])[data-error='true'] .cus-input-textarea__label {
  color: var(--textarea-error-text);
}

.cus-input-textarea:not([data-disabled='true'])[data-error='true'] .cus-input-textarea__control {
  border-color: var(--textarea-error-border);
  outline-color: var(--textarea-error-outline);
  background-color: var(--textarea-error-bg);
}

.cus-input-textarea:not([data-disabled='true']):not([data-error='true']):focus-within .cus-input-textarea__control,
.cus-input-textarea:not([data-disabled='true']):not([data-error='true'])[data-selected='true'] .cus-input-textarea__control {
  border-color: var(--textarea-selected-border);
  outline-color: var(--textarea-selected-outline);
  background-color: var(--textarea-selected-bg);
}

.cus-input-textarea:not([data-disabled='true']):not([data-error='true']):focus-within .cus-input-textarea__label,
.cus-input-textarea:not([data-disabled='true']):not([data-error='true'])[data-selected='true'] .cus-input-textarea__label {
  color: var(--color-accent-strong);
}

.cus-input-textarea[data-disabled='true'] .cus-input-textarea__label,
.cus-input-textarea[data-disabled='true'] .cus-input-textarea__description,
.cus-input-textarea[data-disabled='true'] .cus-input-textarea__counter,
.cus-input-textarea[data-disabled='true'] .cus-input-textarea__control {
  color: var(--textarea-disabled-text);
}

.cus-input-textarea[data-disabled='true'] .cus-input-textarea__control {
  border-color: var(--textarea-disabled-border);
  background-color: var(--textarea-disabled-bg);

  @apply cursor-not-allowed;
}

.cus-input-textarea[data-disabled='true'] .cus-input-textarea__input {
  @apply cursor-not-allowed;
}
</style>
