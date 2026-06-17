<template>
  <NuxtLink
    class="cus-link"
    :data-action-theme="props.theme"
    :data-variant="props.variant"
    :data-color="props.color"
    :data-shape="props.shape"
    :data-size="props.size"
    :data-icon-only="isIconOnly ? 'true' : 'false'"
    :aria-disabled="props.disabled ? 'true' : undefined"
    :tabindex="props.disabled ? -1 : undefined"
    :to="props.to"
    :target="props.target || undefined"
    :rel="linkRel"
    @click="onLinkClick"
  >
    <Icon v-if="props.leftIcon" class="cus-link__icon cus-link__icon--left" :name="props.leftIcon" aria-hidden="true" />
    <span v-if="props.label || hasDefaultSlot" class="cus-link__label">
      <slot>{{ props.label }}</slot>
    </span>
    <Icon v-if="props.rightIcon" class="cus-link__icon cus-link__icon--right" :name="props.rightIcon" aria-hidden="true" />
  </NuxtLink>
</template>

<script setup lang="ts">
const slots = useSlots()

const props = defineProps({
  label: { type: String, default: '' },
  leftIcon: { type: String, default: '' },
  rightIcon: { type: String, default: '' },
  to: { type: [String, Object], default: '/' },
  variant: {
    type: String,
    default: 'filled',
    validator: (value: string) => ['filled', 'outlined', 'ghost'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary'].includes(value)
  },
  theme: {
    type: String,
    default: 'landing',
    validator: (value: string) => ['landing', 'app'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  shape: {
    type: String,
    default: 'rectangular',
    validator: (value: string) => ['circle', 'rectangular'].includes(value)
  },
  target: { type: String, default: '' },
  rel: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

const hasDefaultSlot = computed(() => Boolean(slots.default))
const isIconOnly = computed(() => {
  return !props.label && !hasDefaultSlot.value && Boolean(props.leftIcon || props.rightIcon)
})

const linkRel = computed(() => {
  if (props.rel) return props.rel
  if (props.target === '_blank') return 'noopener noreferrer'
  return undefined
})

const onLinkClick = (event: MouseEvent) => {
  if (!props.disabled) return
  event.preventDefault()
  event.stopPropagation()
}
</script>

<style scoped>
.cus-link {
  --action-height-sm: calc(var(--unit) * 4.5);
  --action-height-md: calc(var(--unit) * 5);
  --action-height-lg: calc(var(--unit) * 5.5);
  --action-width-sm: calc(var(--unit) * 16);
  --action-width-md: calc(var(--unit) * 19);
  --action-width-lg: calc(var(--unit) * 22);
  --action-padding-y-sm: calc(var(--unit) * 0.75);
  --action-padding-y-md: calc(var(--unit) * 1);
  --action-padding-y-lg: calc(var(--unit) * 1.25);
  --action-padding-x-sm: calc(var(--unit) * 2);
  --action-padding-x-md: calc(var(--unit) * 2.5);
  --action-padding-x-lg: calc(var(--unit) * 3);
  --action-font-sm: calc(var(--unit) * 1.5);
  --action-font-md: calc(var(--unit) * 1.625);
  --action-font-lg: calc(var(--unit) * 1.75);
  --action-icon-sm: calc(var(--unit) * 1.75);
  --action-icon-md: calc(var(--unit) * 2);
  --action-icon-lg: calc(var(--unit) * 2.25);
  --action-disabled-bg: var(--color-transparent);
  --action-disabled-text: color-mix(in oklch, var(--color-text) 40%, var(--color-transparent));
  --action-disabled-border: color-mix(in oklch, var(--color-line) 80%, var(--color-transparent));
  --action-primary-filled-bg: var(--gradient-action);
  --action-primary-filled-text: var(--color-text);
  --action-primary-filled-border: var(--color-transparent);
  --action-primary-filled-hover-bg: linear-gradient(135deg, color-mix(in oklch, var(--color-accent) 82%, var(--landing-color-header-strong)), color-mix(in oklch, var(--color-accent-strong) 86%, var(--landing-color-header-strong)));
  --action-primary-filled-hover-text: var(--color-text);
  --action-primary-filled-hover-border: color-mix(in oklch, var(--color-accent-strong) 72%, var(--landing-color-header-strong));
  --action-primary-filled-disabled-bg: color-mix(in oklch, var(--color-accent) 55%, var(--color-transparent));
  --action-primary-filled-disabled-text: color-mix(in oklch, var(--color-text) 70%, var(--color-transparent));
  --action-primary-filled-disabled-border: var(--color-transparent);
  --action-primary-outlined-bg: var(--color-transparent);
  --action-primary-outlined-text: var(--landing-color-header-text);
  --action-primary-outlined-border: var(--landing-color-header-line);
  --action-primary-outlined-hover-bg: color-mix(in oklch, var(--landing-color-header-line) 18%, var(--color-transparent));
  --action-primary-outlined-hover-text: var(--landing-color-header-strong);
  --action-primary-outlined-hover-border: var(--landing-color-header-strong);
  --action-primary-outlined-disabled-bg: var(--action-disabled-bg);
  --action-primary-outlined-disabled-text: var(--action-disabled-text);
  --action-primary-outlined-disabled-border: var(--landing-color-header-line-disabled);
  --action-secondary-filled-bg: var(--landing-color-header-strong);
  --action-secondary-filled-text: var(--landing-color-header-inverse);
  --action-secondary-filled-border: var(--color-transparent);
  --action-secondary-filled-hover-bg: color-mix(in oklch, var(--landing-color-header-strong) 90%, var(--color-accent-strong));
  --action-secondary-filled-hover-text: var(--landing-color-header-inverse);
  --action-secondary-filled-hover-border: color-mix(in oklch, var(--landing-color-header-strong) 76%, var(--color-accent-strong));
  --action-secondary-filled-disabled-bg: color-mix(in oklch, var(--landing-color-header-strong) 35%, var(--color-transparent));
  --action-secondary-filled-disabled-text: color-mix(in oklch, var(--landing-color-header-inverse) 50%, var(--color-transparent));
  --action-secondary-filled-disabled-border: var(--color-transparent);
  --action-secondary-outlined-bg: var(--color-bg-soft);
  --action-secondary-outlined-text: var(--color-text);
  --action-secondary-outlined-border: var(--color-panel-line);
  --action-secondary-outlined-hover-bg: color-mix(in oklch, var(--color-bg-soft-hover) 88%, var(--color-accent));
  --action-secondary-outlined-hover-text: var(--color-text);
  --action-secondary-outlined-hover-border: color-mix(in oklch, var(--color-line) 76%, var(--color-accent));
  --action-secondary-outlined-disabled-bg: var(--color-transparent);
  --action-secondary-outlined-disabled-text: var(--action-disabled-text);
  --action-secondary-outlined-disabled-border: var(--action-disabled-border);
  --action-primary-ghost-bg: var(--color-transparent);
  --action-primary-ghost-text: var(--landing-color-header-text);
  --action-primary-ghost-border: var(--color-transparent);
  --action-primary-ghost-hover-bg: color-mix(in oklch, var(--color-accent) 14%, var(--color-transparent));
  --action-primary-ghost-hover-text: var(--landing-color-header-strong);
  --action-primary-ghost-hover-border: color-mix(in oklch, var(--color-accent) 24%, var(--color-transparent));
  --action-primary-ghost-disabled-bg: var(--action-disabled-bg);
  --action-primary-ghost-disabled-text: var(--action-disabled-text);
  --action-primary-ghost-disabled-border: var(--color-transparent);
  --action-secondary-ghost-bg: var(--color-transparent);
  --action-secondary-ghost-text: var(--color-text);
  --action-secondary-ghost-border: var(--color-transparent);
  --action-secondary-ghost-hover-bg: color-mix(in oklch, var(--color-bg-soft-hover) 72%, var(--color-transparent));
  --action-secondary-ghost-hover-text: var(--color-text);
  --action-secondary-ghost-hover-border: color-mix(in oklch, var(--color-line) 24%, var(--color-transparent));
  --action-secondary-ghost-disabled-bg: var(--action-disabled-bg);
  --action-secondary-ghost-disabled-text: var(--action-disabled-text);
  --action-secondary-ghost-disabled-border: var(--color-transparent);
  --action-bg: var(--action-primary-filled-bg);
  --action-text: var(--action-primary-filled-text);
  --action-border: var(--action-primary-filled-border);
  --action-hover-bg: var(--action-bg);
  --action-hover-text: var(--action-text);
  --action-hover-border: var(--action-border);
  --action-current-disabled-bg: var(--action-disabled-bg);
  --action-current-disabled-text: var(--action-disabled-text);
  --action-current-disabled-border: var(--action-disabled-border);
  --action-icon-size: var(--action-icon-md);
  gap: var(--space-1);
  min-height: var(--action-height-md);
  min-width: var(--action-width-md);
  padding: var(--action-padding-y-md) var(--action-padding-x-md);
  border: var(--border) solid var(--action-border);
  border-radius: var(--radius);
  background: var(--action-bg);
  color: var(--action-text);
  font-size: var(--action-font-md);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
  transition-duration: var(--motion-fast);

  @apply inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap no-underline transition-colors;
}

.cus-link__icon {
  width: var(--action-icon-size);
  height: var(--action-icon-size);

  @apply shrink-0;
}

.cus-link__label {
  @apply leading-none;
}

.cus-link[data-action-theme='landing'][data-color='primary'][data-variant='filled'],
.cus-link[data-action-theme='app'][data-color='primary'][data-variant='filled'] {
  --action-bg: var(--action-primary-filled-bg);
  --action-text: var(--action-primary-filled-text);
  --action-border: var(--action-primary-filled-border);
  --action-hover-bg: var(--action-primary-filled-hover-bg);
  --action-hover-text: var(--action-primary-filled-hover-text);
  --action-hover-border: var(--action-primary-filled-hover-border);
  --action-current-disabled-bg: var(--action-primary-filled-disabled-bg);
  --action-current-disabled-text: var(--action-primary-filled-disabled-text);
  --action-current-disabled-border: var(--action-primary-filled-disabled-border);
}

.cus-link[data-action-theme='landing'][data-color='primary'][data-variant='outlined'],
.cus-link[data-action-theme='app'][data-color='primary'][data-variant='outlined'] {
  --action-bg: var(--action-primary-outlined-bg);
  --action-text: var(--action-primary-outlined-text);
  --action-border: var(--action-primary-outlined-border);
  --action-hover-bg: var(--action-primary-outlined-hover-bg);
  --action-hover-text: var(--action-primary-outlined-hover-text);
  --action-hover-border: var(--action-primary-outlined-hover-border);
  --action-current-disabled-bg: var(--action-primary-outlined-disabled-bg);
  --action-current-disabled-text: var(--action-primary-outlined-disabled-text);
  --action-current-disabled-border: var(--action-primary-outlined-disabled-border);
}

.cus-link[data-action-theme='landing'][data-color='secondary'][data-variant='filled'] {
  --action-bg: var(--action-secondary-filled-bg);
  --action-text: var(--action-secondary-filled-text);
  --action-border: var(--action-secondary-filled-border);
  --action-hover-bg: var(--action-secondary-filled-hover-bg);
  --action-hover-text: var(--action-secondary-filled-hover-text);
  --action-hover-border: var(--action-secondary-filled-hover-border);
  --action-current-disabled-bg: var(--action-secondary-filled-disabled-bg);
  --action-current-disabled-text: var(--action-secondary-filled-disabled-text);
  --action-current-disabled-border: var(--action-secondary-filled-disabled-border);
}

.cus-link[data-action-theme='app'][data-color='secondary'][data-variant='filled'] {
  --action-bg: var(--color-text);
  --action-text: var(--color-inverse);
  --action-border: var(--color-transparent);
  --action-hover-bg: color-mix(in oklch, var(--color-text) 90%, var(--color-accent-strong));
  --action-hover-text: var(--color-inverse);
  --action-hover-border: color-mix(in oklch, var(--color-text) 76%, var(--color-accent-strong));
  --action-current-disabled-bg: var(--action-secondary-filled-disabled-bg);
  --action-current-disabled-text: var(--action-secondary-filled-disabled-text);
  --action-current-disabled-border: var(--action-secondary-filled-disabled-border);
}

.cus-link[data-action-theme='landing'][data-color='secondary'][data-variant='outlined'],
.cus-link[data-action-theme='app'][data-color='secondary'][data-variant='outlined'] {
  --action-bg: var(--action-secondary-outlined-bg);
  --action-text: var(--action-secondary-outlined-text);
  --action-border: var(--action-secondary-outlined-border);
  --action-hover-bg: var(--action-secondary-outlined-hover-bg);
  --action-hover-text: var(--action-secondary-outlined-hover-text);
  --action-hover-border: var(--action-secondary-outlined-hover-border);
  --action-current-disabled-bg: var(--action-secondary-outlined-disabled-bg);
  --action-current-disabled-text: var(--action-secondary-outlined-disabled-text);
  --action-current-disabled-border: var(--action-secondary-outlined-disabled-border);
}

.cus-link[data-action-theme='landing'][data-color='primary'][data-variant='ghost'],
.cus-link[data-action-theme='app'][data-color='primary'][data-variant='ghost'] {
  --action-bg: var(--action-primary-ghost-bg);
  --action-text: var(--action-primary-ghost-text);
  --action-border: var(--action-primary-ghost-border);
  --action-hover-bg: var(--action-primary-ghost-hover-bg);
  --action-hover-text: var(--action-primary-ghost-hover-text);
  --action-hover-border: var(--action-primary-ghost-hover-border);
  --action-current-disabled-bg: var(--action-primary-ghost-disabled-bg);
  --action-current-disabled-text: var(--action-primary-ghost-disabled-text);
  --action-current-disabled-border: var(--action-primary-ghost-disabled-border);
}

.cus-link[data-action-theme='landing'][data-color='secondary'][data-variant='ghost'],
.cus-link[data-action-theme='app'][data-color='secondary'][data-variant='ghost'] {
  --action-bg: var(--action-secondary-ghost-bg);
  --action-text: var(--action-secondary-ghost-text);
  --action-border: var(--action-secondary-ghost-border);
  --action-hover-bg: var(--action-secondary-ghost-hover-bg);
  --action-hover-text: var(--action-secondary-ghost-hover-text);
  --action-hover-border: var(--action-secondary-ghost-hover-border);
  --action-current-disabled-bg: var(--action-secondary-ghost-disabled-bg);
  --action-current-disabled-text: var(--action-secondary-ghost-disabled-text);
  --action-current-disabled-border: var(--action-secondary-ghost-disabled-border);
}

.cus-link[data-shape='circle'] {
  border-radius: var(--radius-round);
}

.cus-link[data-shape='rectangular'] {
  border-radius: var(--radius);
}

.cus-link[data-size='sm'] {
  --action-icon-size: var(--action-icon-sm);
  min-height: var(--action-height-sm);
  min-width: var(--action-width-sm);
  padding: var(--action-padding-y-sm) var(--action-padding-x-sm);
  font-size: var(--action-font-sm);
}

.cus-link[data-size='md'] {
  --action-icon-size: var(--action-icon-md);
  min-height: var(--action-height-md);
  min-width: var(--action-width-md);
  padding: var(--action-padding-y-md) var(--action-padding-x-md);
  font-size: var(--action-font-md);
}

.cus-link[data-size='lg'] {
  --action-icon-size: var(--action-icon-lg);
  min-height: var(--action-height-lg);
  min-width: var(--action-width-lg);
  padding: var(--action-padding-y-lg) var(--action-padding-x-lg);
  font-size: var(--action-font-lg);
}

.cus-link[data-icon-only='true'] {
  min-width: var(--action-height-md);
  padding-inline: 0;
}

.cus-link[data-icon-only='true'][data-size='sm'] {
  min-width: var(--action-height-sm);
}

.cus-link[data-icon-only='true'][data-size='lg'] {
  min-width: var(--action-height-lg);
}

.cus-link:not([aria-disabled='true']):hover {
  border-color: var(--action-hover-border);
  background: var(--action-hover-bg);
  color: var(--action-hover-text);
}

.cus-link[aria-disabled='true'] {
  border-color: var(--action-current-disabled-border);
  background: var(--action-current-disabled-bg);
  color: var(--action-current-disabled-text);

  @apply cursor-not-allowed;
}
</style>
