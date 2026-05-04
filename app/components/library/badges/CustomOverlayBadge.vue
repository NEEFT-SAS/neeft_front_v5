<template>
  <span
    class="cus-overlay-badge"
    :data-position="props.position"
    :data-inset="props.inset ? 'true' : 'false'"
    :data-size="props.size"
  >
    <span class="cus-overlay-badge__anchor">
      <slot />
    </span>

    <CustomBadge v-if="isVisible && hasBadgeSlot" v-bind="badgeProps" class="cus-overlay-badge__badge">
      <slot name="badge" />
    </CustomBadge>
    <CustomBadge v-else-if="isVisible" v-bind="badgeProps" class="cus-overlay-badge__badge" />
  </span>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  max: { type: Number, default: 99 },
  showZero: { type: Boolean, default: false },
  show: { type: Boolean, default: true },
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
    default: 'filled',
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
  },
  position: {
    type: String,
    default: 'top-right',
    validator: (value: string) => ['top-right', 'top-left', 'bottom-right', 'bottom-left'].includes(value)
  },
  inset: { type: Boolean, default: false }
})

const slots = useSlots()

const hasBadgeSlot = computed(() => Boolean(slots.badge))
const isVisible = computed(() => {
  if (!props.show) return false
  if (props.dot || props.icon || props.label || hasBadgeSlot.value) return true

  if (typeof props.value === 'number') {
    return props.showZero || props.value !== 0
  }

  return props.value.length > 0
})

const badgeProps = computed(() => ({
  label: props.label,
  value: props.value,
  max: props.max,
  showZero: props.showZero,
  dot: props.dot,
  icon: props.icon,
  ariaLabel: props.ariaLabel,
  live: props.live,
  decorative: props.decorative,
  theme: props.theme,
  variant: props.variant,
  color: props.color,
  size: props.size,
  shape: props.shape
}))
</script>

<style scoped>
.cus-overlay-badge {
  --overlay-badge-layer: var(--layer-step);
  --overlay-badge-inset-sm: calc(var(--unit) * 0.25);
  --overlay-badge-inset-md: calc(var(--unit) * 0.5);
  --overlay-badge-inset-lg: calc(var(--unit) * 0.75);
  --overlay-badge-inset: var(--overlay-badge-inset-md);
  position: relative;
  max-width: 100%;

  @apply inline-flex align-middle;
}

.cus-overlay-badge__anchor {
  max-width: 100%;

  @apply inline-flex min-w-0;
}

.cus-overlay-badge__badge {
  position: absolute;
  z-index: var(--overlay-badge-layer);
  pointer-events: none;
}

.cus-overlay-badge[data-size='sm'] {
  --overlay-badge-inset: var(--overlay-badge-inset-sm);
}

.cus-overlay-badge[data-size='lg'] {
  --overlay-badge-inset: var(--overlay-badge-inset-lg);
}

.cus-overlay-badge[data-position='top-right'] .cus-overlay-badge__badge {
  inset-block-start: 0;
  inset-inline-end: 0;
  transform: translate(50%, -50%);
}

.cus-overlay-badge[data-position='top-left'] .cus-overlay-badge__badge {
  inset-block-start: 0;
  inset-inline-start: 0;
  transform: translate(-50%, -50%);
}

.cus-overlay-badge[data-position='bottom-right'] .cus-overlay-badge__badge {
  inset-block-end: 0;
  inset-inline-end: 0;
  transform: translate(50%, 50%);
}

.cus-overlay-badge[data-position='bottom-left'] .cus-overlay-badge__badge {
  inset-block-end: 0;
  inset-inline-start: 0;
  transform: translate(-50%, 50%);
}

.cus-overlay-badge[data-inset='true'][data-position='top-right'] .cus-overlay-badge__badge {
  inset-block-start: var(--overlay-badge-inset);
  inset-inline-end: var(--overlay-badge-inset);
  transform: none;
}

.cus-overlay-badge[data-inset='true'][data-position='top-left'] .cus-overlay-badge__badge {
  inset-block-start: var(--overlay-badge-inset);
  inset-inline-start: var(--overlay-badge-inset);
  transform: none;
}

.cus-overlay-badge[data-inset='true'][data-position='bottom-right'] .cus-overlay-badge__badge {
  inset-block-end: var(--overlay-badge-inset);
  inset-inline-end: var(--overlay-badge-inset);
  transform: none;
}

.cus-overlay-badge[data-inset='true'][data-position='bottom-left'] .cus-overlay-badge__badge {
  inset-block-end: var(--overlay-badge-inset);
  inset-inline-start: var(--overlay-badge-inset);
  transform: none;
}
</style>
