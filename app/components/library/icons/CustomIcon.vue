<template>
  <span class="cus-icon" :data-color="props.color" :data-size="props.size" :data-shape="props.shape" aria-hidden="true">
    <Icon class="cus-icon__glyph" :name="props.icon" />
  </span>
</template>

<script setup lang="ts">
const props = defineProps({
  icon: { type: String, default: 'lucide:arrow-up-right' },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'tertiary'].includes(value)
  },
  shape: {
    type: String,
    default: 'rectangular',
    validator: (value: string) => ['ghost', 'rectangular', 'circle'].includes(value)
  }
})
</script>

<style scoped>
.cus-icon {
  --icon-size-sm: calc(var(--unit) * 5);
  --icon-size-md: calc(var(--unit) * 6);
  --icon-size-lg: calc(var(--unit) * 7);
  --icon-glyph-sm: calc(var(--unit) * 2);
  --icon-glyph-md: calc(var(--unit) * 2.5);
  --icon-glyph-lg: calc(var(--unit) * 3);
  --icon-primary-bg: color-mix(in oklch, var(--color-accent) 24%, var(--color-surface));
  --icon-primary-text: var(--color-accent-strong);
  --icon-primary-border: var(--icon-primary-bg);
  --icon-secondary-bg: color-mix(in oklch, var(--landing-color-header-strong) 18%, var(--color-surface));
  --icon-secondary-text: var(--landing-color-header-strong);
  --icon-secondary-border: var(--icon-secondary-bg);
  --icon-tertiary-bg: color-mix(in oklch, var(--color-inverse) 78%, var(--color-surface));
  --icon-tertiary-text: color-mix(in oklch, var(--color-inverse) 34%, var(--landing-color-header-strong));
  --icon-tertiary-border: var(--icon-tertiary-bg);
  --icon-size: var(--icon-size-md);
  --icon-glyph-size: var(--icon-glyph-md);
  --icon-bg: var(--icon-primary-bg);
  --icon-text: var(--icon-primary-text);
  --icon-border: var(--icon-primary-border);
  width: var(--icon-size);
  height: var(--icon-size);
  border: var(--border) solid var(--icon-border);
  border-radius: var(--radius);
  background-color: var(--icon-bg);
  color: var(--icon-text);

  @apply inline-flex shrink-0 items-center justify-center;
}

.cus-icon__glyph {
  width: var(--icon-glyph-size);
  height: var(--icon-glyph-size);

  @apply shrink-0;
}

.cus-icon[data-size='sm'] {
  --icon-size: var(--icon-size-sm);
  --icon-glyph-size: var(--icon-glyph-sm);
}

.cus-icon[data-size='md'] {
  --icon-size: var(--icon-size-md);
  --icon-glyph-size: var(--icon-glyph-md);
}

.cus-icon[data-size='lg'] {
  --icon-size: var(--icon-size-lg);
  --icon-glyph-size: var(--icon-glyph-lg);
}

.cus-icon[data-color='primary'] {
  --icon-bg: var(--icon-primary-bg);
  --icon-text: var(--icon-primary-text);
  --icon-border: var(--icon-primary-border);
}

.cus-icon[data-color='secondary'] {
  --icon-bg: var(--icon-secondary-bg);
  --icon-text: var(--icon-secondary-text);
  --icon-border: var(--icon-secondary-border);
}

.cus-icon[data-color='tertiary'] {
  --icon-bg: var(--icon-tertiary-bg);
  --icon-text: var(--icon-tertiary-text);
  --icon-border: var(--icon-tertiary-border);
}

.cus-icon[data-shape='ghost'] {
  border-color: var(--color-transparent);
  background-color: var(--color-transparent);
  color: var(--icon-text);
}

.cus-icon[data-shape='rectangular'] {
  border-radius: var(--radius);
}

.cus-icon[data-shape='circle'] {
  border-radius: var(--radius-round);
}
</style>
