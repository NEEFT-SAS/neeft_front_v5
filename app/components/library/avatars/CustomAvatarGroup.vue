<template>
  <ul
    class="cus-avatar-group"
    :data-theme="props.theme"
    :data-size="props.size"
    :data-overlap="props.overlap"
    :aria-hidden="props.decorative ? 'true' : undefined"
    :aria-label="groupAriaLabel"
  >
    <li
      v-for="(item, index) in visibleItems"
      :key="getItemKey(item, index)"
      class="cus-avatar-group__item"
    >
      <CustomAvatar
        :src="item.src || ''"
        :alt="item.alt || ''"
        :name="item.name || ''"
        :initials="item.initials || ''"
        :icon="item.icon || props.icon"
        :aria-label="item.ariaLabel || ''"
        :decorative="props.decorative"
        :initials-length="props.initialsLength"
        :theme="props.theme"
        :size="props.size"
        :shape="props.shape"
        :color="item.color || props.color"
      />
    </li>

    <li v-if="remainingCount" class="cus-avatar-group__item">
      <CustomAvatar
        :initials="overflowInitials"
        :aria-label="overflowAriaLabel"
        :decorative="props.decorative"
        :initials-length="overflowInitials.length"
        :theme="props.theme"
        :size="props.size"
        :shape="props.shape"
        :color="props.color"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
type AvatarShape = 'square' | 'circle'
type AvatarTheme = 'landing' | 'app'
type AvatarColor = 'primary' | 'secondary' | 'neutral'
type AvatarGroupOverlap = 'sm' | 'md' | 'lg'

type AvatarGroupItem = {
  key?: string | number
  src?: string
  alt?: string
  name?: string
  initials?: string
  icon?: string
  ariaLabel?: string
  color?: AvatarColor
}

const DEFAULT_VISIBLE_AVATARS = 4
const MAX_VISIBLE_AVATARS = 12
const MAX_OVERFLOW_COUNT = 99

const props = defineProps({
  items: {
    type: Array as PropType<AvatarGroupItem[]>,
    default: () => []
  },
  max: {
    type: Number,
    default: DEFAULT_VISIBLE_AVATARS,
    validator: (value: number) => Number.isInteger(value) && value > 0 && value <= MAX_VISIBLE_AVATARS
  },
  ariaLabel: { type: String, default: '' },
  decorative: { type: Boolean, default: false },
  icon: { type: String, default: 'lucide:user' },
  initialsLength: {
    type: Number,
    default: 2,
    validator: (value: number) => Number.isInteger(value) && value >= 1 && value <= 3
  },
  theme: {
    type: String as PropType<AvatarTheme>,
    default: 'landing',
    validator: (value: string) => ['landing', 'app'].includes(value)
  },
  size: {
    type: String as PropType<AvatarSize>,
    default: 'md',
    validator: (value: string) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].includes(value)
  },
  shape: {
    type: String as PropType<AvatarShape>,
    default: 'circle',
    validator: (value: string) => ['square', 'circle'].includes(value)
  },
  color: {
    type: String as PropType<AvatarColor>,
    default: 'neutral',
    validator: (value: string) => ['primary', 'secondary', 'neutral'].includes(value)
  },
  overlap: {
    type: String as PropType<AvatarGroupOverlap>,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  }
})

const visibleItems = computed(() => props.items.slice(0, props.max))
const remainingCount = computed(() => Math.max(props.items.length - visibleItems.value.length, 0))
const normalizedRemainingCount = computed(() => Math.min(remainingCount.value, MAX_OVERFLOW_COUNT))
const overflowInitials = computed(() => `+${normalizedRemainingCount.value}`)
const overflowAriaLabel = computed(() => {
  if (!remainingCount.value) return ''

  return remainingCount.value > MAX_OVERFLOW_COUNT
    ? `${MAX_OVERFLOW_COUNT} autres profils ou plus`
    : `${remainingCount.value} autres profils`
})
const groupAriaLabel = computed(() => {
  if (props.decorative) return undefined
  if (props.ariaLabel) return props.ariaLabel

  const names = visibleItems.value
    .map(item => item.ariaLabel || item.alt || item.name || item.initials || '')
    .filter(Boolean)

  if (remainingCount.value) {
    names.push(overflowAriaLabel.value)
  }

  return names.length ? names.join(', ') : 'Groupe d avatars'
})

function getItemKey(item: AvatarGroupItem, index: number) {
  return item.key || item.src || item.name || item.initials || index
}
</script>

<style scoped>
.cus-avatar-group {
  --avatar-group-size-xs: calc(var(--unit) * 4);
  --avatar-group-size-sm: calc(var(--unit) * 5);
  --avatar-group-size-md: calc(var(--unit) * 6);
  --avatar-group-size-lg: calc(var(--unit) * 8);
  --avatar-group-size-xl: calc(var(--unit) * 10);
  --avatar-group-size-2xl: calc(var(--unit) * 12);
  --avatar-group-size-3xl: calc(var(--unit) * 15);
  --avatar-group-size-4xl: calc(var(--unit) * 18);
  --avatar-group-size-5xl: calc(var(--unit) * 22);
  --avatar-group-size: var(--avatar-group-size-md);
  --avatar-group-overlap-ratio: -0.28;
  --avatar-group-overlap: calc(var(--avatar-group-size) * var(--avatar-group-overlap-ratio));
  --avatar-group-ring: calc(var(--border) * 2);
  --avatar-group-surface: var(--color-bg);
  display: inline-flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cus-avatar-group__item {
  display: inline-flex;
  margin-inline-start: var(--avatar-group-overlap);
}

.cus-avatar-group__item:first-child {
  margin-inline-start: 0;
}

.cus-avatar-group__item :deep(.cus-avatar) {
  box-shadow: 0 0 0 var(--avatar-group-ring) var(--avatar-group-surface);
}

.cus-avatar-group[data-theme='app'] {
  --avatar-group-surface: var(--app-color-bg);
}

.cus-avatar-group[data-size='xs'] {
  --avatar-group-size: var(--avatar-group-size-xs);
}

.cus-avatar-group[data-size='sm'] {
  --avatar-group-size: var(--avatar-group-size-sm);
}

.cus-avatar-group[data-size='md'] {
  --avatar-group-size: var(--avatar-group-size-md);
}

.cus-avatar-group[data-size='lg'] {
  --avatar-group-size: var(--avatar-group-size-lg);
}

.cus-avatar-group[data-size='xl'] {
  --avatar-group-size: var(--avatar-group-size-xl);
}

.cus-avatar-group[data-size='2xl'] {
  --avatar-group-size: var(--avatar-group-size-2xl);
}

.cus-avatar-group[data-size='3xl'] {
  --avatar-group-size: var(--avatar-group-size-3xl);
}

.cus-avatar-group[data-size='4xl'] {
  --avatar-group-size: var(--avatar-group-size-4xl);
}

.cus-avatar-group[data-size='5xl'] {
  --avatar-group-size: var(--avatar-group-size-5xl);
}

.cus-avatar-group[data-overlap='sm'] {
  --avatar-group-overlap-ratio: -0.18;
}

.cus-avatar-group[data-overlap='md'] {
  --avatar-group-overlap-ratio: -0.28;
}

.cus-avatar-group[data-overlap='lg'] {
  --avatar-group-overlap-ratio: -0.38;
}
</style>
