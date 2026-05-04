<template>
  <span
    class="cus-badge"
    :data-theme="props.theme"
    :data-variant="props.variant"
    :data-color="props.color"
    :data-size="props.size"
    :data-shape="props.shape"
    :data-dot="props.dot ? 'true' : 'false'"
    :data-content="hasVisibleContent ? 'true' : 'false'"
    :aria-hidden="props.decorative ? 'true' : undefined"
    :aria-label="ariaLabelValue"
    :role="roleValue"
    :aria-live="ariaLiveValue"
  >
    <span v-if="props.dot" class="cus-badge__dot" aria-hidden="true" />
    <Icon v-if="props.icon && !props.dot" class="cus-badge__icon" :name="props.icon" aria-hidden="true" />
    <span v-if="hasVisibleContent" class="cus-badge__label">
      <slot>{{ displayLabel }}</slot>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  max: { type: Number, default: 99 },
  showZero: { type: Boolean, default: false },
  dot: { type: Boolean, default: false },
  icon: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
  live: { type: Boolean, default: false },
  decorative: { type: Boolean, default: false },
  theme: {
    type: String,
    default: 'landing',
    validator: (value: string) => ['landing', 'app'].includes(value)
  },
  variant: {
    type: String,
    default: 'soft',
    validator: (value: string) => ['filled', 'outlined', 'soft'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  shape: {
    type: String,
    default: 'circle',
    validator: (value: string) => ['rectangular', 'circle'].includes(value)
  }
})

const slots = useSlots()

const displayLabel = computed(() => {
  if (props.label) return props.label

  if (typeof props.value === 'number') {
    if (props.value === 0 && !props.showZero) return ''

    const maxValue = Math.max(0, props.max)

    if (maxValue > 0 && props.value > maxValue) {
      return `${maxValue}+`
    }

    return String(props.value)
  }

  return props.value
})

const hasVisibleContent = computed(() => displayLabel.value.length > 0 || Boolean(slots.default))
const ariaLabelValue = computed(() => {
  if (props.decorative) return undefined
  return props.ariaLabel || undefined
})
const roleValue = computed(() => {
  if (props.decorative || !props.live) return undefined
  return 'status'
})
const ariaLiveValue = computed(() => {
  if (props.decorative || !props.live) return undefined
  return 'polite'
})
</script>

<style scoped>
.cus-badge {
  --badge-height-sm: calc(var(--unit) * 2.75);
  --badge-height-md: calc(var(--unit) * 3.25);
  --badge-height-lg: calc(var(--unit) * 4);
  --badge-padding-x-sm: calc(var(--unit) * 1);
  --badge-padding-x-md: calc(var(--unit) * 1.25);
  --badge-padding-x-lg: calc(var(--unit) * 1.5);
  --badge-gap-sm: calc(var(--unit) * 0.5);
  --badge-gap-md: calc(var(--unit) * 0.625);
  --badge-gap-lg: calc(var(--unit) * 0.75);
  --badge-font-sm: calc(var(--unit) * 1.375);
  --badge-font-md: calc(var(--unit) * 1.5);
  --badge-font-lg: calc(var(--unit) * 1.625);
  --badge-icon-sm: calc(var(--unit) * 1.5);
  --badge-icon-md: calc(var(--unit) * 1.625);
  --badge-icon-lg: calc(var(--unit) * 1.75);
  --badge-dot-sm: calc(var(--unit) * 0.875);
  --badge-dot-md: var(--space-1);
  --badge-dot-lg: calc(var(--unit) * 1.125);
  --badge-dot-only-sm: calc(var(--unit) * 1.5);
  --badge-dot-only-md: calc(var(--unit) * 1.75);
  --badge-dot-only-lg: calc(var(--unit) * 2);
  --badge-soft-bg-weight: 18%;
  --badge-soft-border-weight: 34%;
  --badge-soft-text-weight: 84%;
  --badge-outlined-border-weight: 58%;
  --badge-outlined-text-weight: 88%;
  --badge-surface: var(--color-surface);
  --badge-text-base: var(--color-text);
  --badge-line: var(--color-line);
  --badge-transparent: var(--color-transparent);
  --badge-source: var(--color-accent);
  --badge-contrast: var(--color-inverse);
  --badge-bg: color-mix(in oklch, var(--badge-source) var(--badge-soft-bg-weight), var(--badge-surface));
  --badge-text: color-mix(in oklch, var(--badge-source) var(--badge-soft-text-weight), var(--badge-text-base));
  --badge-border: color-mix(in oklch, var(--badge-source) var(--badge-soft-border-weight), var(--badge-transparent));
  --badge-height: var(--badge-height-md);
  --badge-padding-x: var(--badge-padding-x-md);
  --badge-gap: var(--badge-gap-md);
  --badge-font: var(--badge-font-md);
  --badge-icon: var(--badge-icon-md);
  --badge-dot: var(--badge-dot-md);
  --badge-dot-only: var(--badge-dot-only-md);
  min-width: var(--badge-height);
  max-width: 100%;
  height: var(--badge-height);
  padding: 0 var(--badge-padding-x);
  gap: var(--badge-gap);
  border: var(--border) solid var(--badge-border);
  border-radius: var(--radius-round);
  background: var(--badge-bg);
  color: var(--badge-text);
  font-size: var(--badge-font);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);

  @apply inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap align-middle;
}

.cus-badge__label {
  @apply min-w-0 overflow-hidden text-ellipsis;
}

.cus-badge__icon {
  width: var(--badge-icon);
  height: var(--badge-icon);

  @apply shrink-0;
}

.cus-badge__dot {
  width: var(--badge-dot);
  height: var(--badge-dot);
  border-radius: var(--radius-round);
  background-color: currentColor;

  @apply shrink-0;
}

.cus-badge[data-theme='app'] {
  --badge-surface: var(--app-color-panel);
  --badge-text-base: var(--app-color-text);
  --badge-line: var(--app-color-line);
  --badge-transparent: var(--app-color-transparent);
}

.cus-badge[data-color='primary'] {
  --badge-source: var(--color-accent);
  --badge-contrast: var(--color-inverse);
}

.cus-badge[data-color='secondary'] {
  --badge-source: var(--landing-color-header-strong);
  --badge-contrast: var(--landing-color-header-inverse);
}

.cus-badge[data-color='neutral'] {
  --badge-source: var(--color-muted);
  --badge-contrast: var(--color-inverse);
}

.cus-badge[data-color='success'] {
  --badge-source: var(--color-success);
  --badge-contrast: var(--color-inverse);
}

.cus-badge[data-color='warning'] {
  --badge-source: var(--color-warning);
  --badge-contrast: var(--color-inverse);
}

.cus-badge[data-color='danger'] {
  --badge-source: var(--color-danger);
  --badge-contrast: var(--color-inverse);
}

.cus-badge[data-theme='app'][data-color='primary'] {
  --badge-source: var(--app-color-accent);
}

.cus-badge[data-theme='app'][data-color='success'] {
  --badge-source: var(--app-color-success);
}

.cus-badge[data-theme='app'][data-color='warning'] {
  --badge-source: var(--app-color-warning);
}

.cus-badge[data-theme='app'][data-color='danger'] {
  --badge-source: var(--app-color-danger);
}

.cus-badge[data-variant='filled'] {
  --badge-bg: var(--badge-source);
  --badge-text: var(--badge-contrast);
  --badge-border: var(--badge-transparent);
}

.cus-badge[data-variant='outlined'] {
  --badge-bg: var(--badge-transparent);
  --badge-text: color-mix(in oklch, var(--badge-source) var(--badge-outlined-text-weight), var(--badge-text-base));
  --badge-border: color-mix(in oklch, var(--badge-source) var(--badge-outlined-border-weight), var(--badge-line));
}

.cus-badge[data-variant='soft'] {
  --badge-bg: color-mix(in oklch, var(--badge-source) var(--badge-soft-bg-weight), var(--badge-surface));
  --badge-text: color-mix(in oklch, var(--badge-source) var(--badge-soft-text-weight), var(--badge-text-base));
  --badge-border: color-mix(in oklch, var(--badge-source) var(--badge-soft-border-weight), var(--badge-transparent));
}

.cus-badge[data-size='sm'] {
  --badge-height: var(--badge-height-sm);
  --badge-padding-x: var(--badge-padding-x-sm);
  --badge-gap: var(--badge-gap-sm);
  --badge-font: var(--badge-font-sm);
  --badge-icon: var(--badge-icon-sm);
  --badge-dot: var(--badge-dot-sm);
  --badge-dot-only: var(--badge-dot-only-sm);
}

.cus-badge[data-size='lg'] {
  --badge-height: var(--badge-height-lg);
  --badge-padding-x: var(--badge-padding-x-lg);
  --badge-gap: var(--badge-gap-lg);
  --badge-font: var(--badge-font-lg);
  --badge-icon: var(--badge-icon-lg);
  --badge-dot: var(--badge-dot-lg);
  --badge-dot-only: var(--badge-dot-only-lg);
}

.cus-badge[data-shape='rectangular'] {
  border-radius: var(--radius);
}

.cus-badge[data-shape='circle'] {
  border-radius: var(--radius-round);
}

.cus-badge[data-content='false'] {
  width: var(--badge-height);
  padding: 0;
}

.cus-badge[data-dot='true'][data-content='false'] {
  width: var(--badge-dot-only);
  min-width: var(--badge-dot-only);
  height: var(--badge-dot-only);
  border-radius: var(--radius-round);
}

.cus-badge[data-dot='true'][data-content='false'] .cus-badge__dot {
  width: 100%;
  height: 100%;
}
</style>
