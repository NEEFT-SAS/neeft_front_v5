<template>
  <fieldset
    class="cus-input-rating"
    :data-size="props.size"
    :data-selected="props.selected ? 'true' : 'false'"
    :data-disabled="props.disabled ? 'true' : 'false'"
    :data-preview="props.preview ? 'true' : 'false'"
    :data-error="hasError ? 'true' : 'false'"
    :disabled="props.disabled"
    :aria-describedby="describedBy"
    :aria-label="accessibleLabel"
  >
    <legend v-if="props.label" class="cus-input-rating__legend">
      <span>{{ props.label }}</span>
      <span v-if="props.required" class="cus-input-rating__required" aria-hidden="true">*</span>
    </legend>

    <p v-if="props.description" :id="descriptionId" class="cus-input-rating__description">
      {{ props.description }}
    </p>

    <div
      v-if="props.preview"
      class="cus-input-rating__items"
      role="img"
      :aria-label="previewLabelValue"
    >
      <span
        v-for="rating in ratingOptions"
        :key="`preview-${rating}`"
        class="cus-input-rating__item cus-input-rating__item--preview"
        :data-active="rating <= ratingValue ? 'true' : 'false'"
        :data-checked="rating === ratingValue ? 'true' : 'false'"
        aria-hidden="true"
      >
        <Icon class="cus-input-rating__icon" :name="props.icon" aria-hidden="true" />
      </span>
    </div>

    <div v-else class="cus-input-rating__items" @mouseleave="hoverValue = 0">
      <label
        v-for="rating in ratingOptions"
        :key="rating"
        class="cus-input-rating__item"
        :for="`${ratingId}-${rating}`"
        :data-active="rating <= visualValue ? 'true' : 'false'"
        :data-checked="rating === ratingValue ? 'true' : 'false'"
      >
        <input
          :id="`${ratingId}-${rating}`"
          class="cus-input-rating__native"
          type="radio"
          :name="groupName"
          :value="rating"
          :checked="rating === ratingValue"
          :disabled="props.disabled"
          :required="props.required"
          :aria-label="getRatingLabel(rating)"
          :aria-invalid="hasError ? 'true' : undefined"
          :aria-describedby="describedBy"
          @change="selectRating(rating, $event)"
          @focus="onRatingFocus(rating, $event)"
          @blur="onRatingBlur($event)"
        >
        <Icon class="cus-input-rating__icon" :name="props.icon" aria-hidden="true" />
      </label>
    </div>

    <p
      :id="errorId"
      class="cus-input-rating__error"
      :data-visible="hasError ? 'true' : 'false'"
      :aria-live="hasError ? 'polite' : undefined"
      :aria-hidden="hasError ? undefined : 'true'"
    >
      {{ props.errorMessage }}
    </p>
  </fieldset>
</template>

<script setup lang="ts">
const generatedId = useId()

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  label: { type: String, default: '' },
  description: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
  icon: { type: String, default: 'lucide:star' },
  max: {
    type: Number,
    default: 5,
    validator: (value: number) => Number.isInteger(value) && value >= 1 && value <= 10
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  preview: { type: Boolean, default: false },
  previewLabel: { type: String, default: '' },
  selected: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur'])

const hoverValue = ref(0)
const ratingId = computed(() => props.id || `cus-input-rating-${generatedId}`)
const groupName = computed(() => props.name || ratingId.value)
const descriptionId = computed(() => `${ratingId.value}-description`)
const errorId = computed(() => `${ratingId.value}-error`)
const hasError = computed(() => props.errorMessage.length > 0)
const describedBy = computed(() => {
  const ids = []
  if (props.description) ids.push(descriptionId.value)
  if (props.errorMessage) ids.push(errorId.value)
  return ids.length > 0 ? ids.join(' ') : undefined
})
const accessibleLabel = computed(() => {
  if (props.label) return undefined
  return props.ariaLabel || props.name || ratingId.value
})
const ratingOptions = computed(() => Array.from({ length: props.max }, (_, index) => index + 1))
const ratingValue = computed(() => {
  if (!Number.isFinite(props.modelValue)) return 0
  if (props.modelValue < 1 || props.modelValue > props.max) return 0
  return Math.trunc(props.modelValue)
})
const visualValue = computed(() => hoverValue.value || ratingValue.value)
const previewLabelValue = computed(() => props.previewLabel || `${ratingValue.value} sur ${props.max}`)

const getRatingLabel = (rating: number) => `${rating} sur ${props.max}`

const selectRating = (rating: number, event: Event) => {
  if (props.preview || props.disabled) return
  emit('update:modelValue', rating)
  emit('change', rating, event)
}

const onRatingFocus = (rating: number, event: FocusEvent) => {
  hoverValue.value = rating
  emit('focus', rating, event)
}

const onRatingBlur = (event: FocusEvent) => {
  hoverValue.value = 0
  emit('blur', event)
}
</script>

<style scoped>
.cus-input-rating {
  --rating-item-sm: calc(var(--unit) * 3);
  --rating-item-md: calc(var(--unit) * 3.5);
  --rating-item-lg: calc(var(--unit) * 4.5);
  --rating-icon-sm: calc(var(--unit) * 2);
  --rating-icon-md: calc(var(--unit) * 2.5);
  --rating-icon-lg: calc(var(--unit) * 3.25);
  --rating-gap-sm: calc(var(--unit) * 0.5);
  --rating-gap-md: calc(var(--unit) * 0.75);
  --rating-gap-lg: var(--space-1);
  --rating-label: var(--color-muted);
  --rating-description: var(--color-subtle);
  --rating-icon: color-mix(in oklch, var(--color-subtle) 72%, var(--color-transparent));
  --rating-active: var(--color-accent-strong);
  --rating-hover-bg: color-mix(in oklch, var(--landing-color-header-strong) 10%, var(--color-transparent));
  --rating-outline: color-mix(in oklch, var(--color-accent-strong) 42%, var(--color-transparent));
  --rating-error: oklch(66% 0.19 28);
  --rating-error-text: color-mix(in oklch, var(--rating-error) 80%, var(--landing-color-header-strong));
  --rating-disabled-text: color-mix(in oklch, var(--color-text) 42%, var(--color-transparent));
  --rating-current-item: var(--rating-item-md);
  --rating-current-icon: var(--rating-icon-md);
  --rating-current-gap: var(--rating-gap-md);
  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
  gap: var(--space-1);

  @apply grid;
}

.cus-input-rating__legend {
  gap: calc(var(--unit) * 0.5);
  margin: 0;
  padding: 0;
  color: var(--rating-label);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);

  @apply w-fit;
}

.cus-input-rating__required {
  color: var(--color-accent-strong);
}

.cus-input-rating__description {
  margin: 0;
  color: var(--rating-description);
  font-size: var(--font-eyebrow);
  line-height: var(--line-base);
}

.cus-input-rating__items {
  gap: var(--rating-current-gap);

  @apply inline-flex w-fit items-center;
}

.cus-input-rating__item {
  width: var(--rating-current-item);
  height: var(--rating-current-item);
  border-radius: var(--radius);
  color: var(--rating-icon);
  transition-duration: var(--motion-fast);

  @apply relative inline-flex cursor-pointer items-center justify-center transition-colors;
}

.cus-input-rating__native {
  inset: 0;
  margin: 0;
  opacity: 0;

  @apply absolute cursor-pointer;
}

.cus-input-rating__item--preview {
  @apply cursor-default;
}

.cus-input-rating__icon {
  width: var(--rating-current-icon);
  height: var(--rating-current-icon);
  fill: currentColor;
  pointer-events: none;
}

.cus-input-rating__error {
  margin: 0;
  min-height: calc(var(--font-eyebrow) * var(--line-base));
  color: var(--rating-error-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.cus-input-rating__error[data-visible='false'] {
  visibility: hidden;
}

.cus-input-rating[data-size='sm'] {
  --rating-current-item: var(--rating-item-sm);
  --rating-current-icon: var(--rating-icon-sm);
  --rating-current-gap: var(--rating-gap-sm);
}

.cus-input-rating[data-size='md'] {
  --rating-current-item: var(--rating-item-md);
  --rating-current-icon: var(--rating-icon-md);
  --rating-current-gap: var(--rating-gap-md);
}

.cus-input-rating[data-size='lg'] {
  --rating-current-item: var(--rating-item-lg);
  --rating-current-icon: var(--rating-icon-lg);
  --rating-current-gap: var(--rating-gap-lg);
}

.cus-input-rating:not([data-disabled='true']):not([data-preview='true']) .cus-input-rating__item:hover,
.cus-input-rating:not([data-disabled='true']):not([data-preview='true'])[data-selected='true'] .cus-input-rating__item[data-checked='true'] {
  background-color: var(--rating-hover-bg);
}

.cus-input-rating__native:focus-visible + .cus-input-rating__icon {
  outline: calc(var(--border) * 2) solid var(--rating-outline);
  outline-offset: calc(var(--border) * 2);
  border-radius: var(--radius);
}

.cus-input-rating__item[data-active='true'] {
  color: var(--rating-active);
}

.cus-input-rating[data-error='true'] .cus-input-rating__legend {
  color: var(--rating-error-text);
}

.cus-input-rating[data-error='true'] .cus-input-rating__item[data-active='true'] {
  color: var(--rating-error-text);
}

.cus-input-rating[data-disabled='true'] .cus-input-rating__legend,
.cus-input-rating[data-disabled='true'] .cus-input-rating__description,
.cus-input-rating[data-disabled='true'] .cus-input-rating__item {
  color: var(--rating-disabled-text);
}

.cus-input-rating[data-disabled='true'] .cus-input-rating__item,
.cus-input-rating[data-disabled='true'] .cus-input-rating__native {
  @apply cursor-not-allowed;
}
</style>
