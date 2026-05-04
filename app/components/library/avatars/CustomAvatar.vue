<template>
  <span
    class="cus-avatar"
    :data-theme="props.theme"
    :data-size="props.size"
    :data-shape="props.shape"
    :data-color="props.color"
    :aria-hidden="props.decorative ? 'true' : undefined"
    :aria-label="avatarLabel"
    :role="avatarRole"
  >
    <img
      v-if="showNativeImage"
      class="cus-avatar__image"
      :src="props.src"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      @error="onImageError"
    >
    <NuxtImg
      v-else-if="showImage"
      class="cus-avatar__image"
      :src="props.src"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      @error="onImageError"
    />
    <span v-else-if="displayInitials" class="cus-avatar__initials" aria-hidden="true">
      {{ displayInitials }}
    </span>
    <Icon v-else class="cus-avatar__icon" :name="props.icon" aria-hidden="true" />
  </span>
</template>

<script setup lang="ts">
import { isNativeImageSource } from '~/utils/imageSources'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  name: { type: String, default: '' },
  initials: { type: String, default: '' },
  icon: { type: String, default: 'lucide:user' },
  ariaLabel: { type: String, default: '' },
  decorative: { type: Boolean, default: false },
  initialsLength: {
    type: Number,
    default: 2,
    validator: (value: number) => Number.isInteger(value) && value >= 1 && value <= 3
  },
  theme: {
    type: String,
    default: 'landing',
    validator: (value: string) => ['landing', 'app'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].includes(value)
  },
  shape: {
    type: String,
    default: 'circle',
    validator: (value: string) => ['square', 'circle'].includes(value)
  },
  color: {
    type: String,
    default: 'neutral',
    validator: (value: string) => ['primary', 'secondary', 'neutral'].includes(value)
  }
})

const emit = defineEmits(['error'])

const imageFailed = ref(false)

watch(
  () => props.src,
  () => {
    imageFailed.value = false
  }
)

const showImage = computed(() => Boolean(props.src) && !imageFailed.value)
const showNativeImage = computed(() => showImage.value && isNativeImageSource(props.src))
const displayInitials = computed(() => {
  return createInitials(props.initials || props.name || props.alt, props.initialsLength)
})
const avatarRole = computed(() => props.decorative ? undefined : 'img')
const avatarLabel = computed(() => {
  if (props.decorative) return undefined

  return props.ariaLabel || props.alt || props.name || displayInitials.value || 'Avatar'
})

function onImageError() {
  imageFailed.value = true
  emit('error')
}

function createInitials(value: string, maxLength: number) {
  const normalizedValue = value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    

  if (!normalizedValue) return ''

  const words = normalizedValue.split(' ').filter(Boolean)
  const letters = words.length > 1
    ? words.map(word => Array.from(word)[0]).join('')
    : Array.from(words[0] || '').slice(0, maxLength).join('')

  return letters.toUpperCase().slice(0, maxLength)
}
</script>

<style scoped>
.cus-avatar {
  --avatar-size-xs: calc(var(--unit) * 4);
  --avatar-size-sm: calc(var(--unit) * 5);
  --avatar-size-md: calc(var(--unit) * 6);
  --avatar-size-lg: calc(var(--unit) * 8);
  --avatar-size-xl: calc(var(--unit) * 10);
  --avatar-size-2xl: calc(var(--unit) * 12);
  --avatar-size-3xl: calc(var(--unit) * 15);
  --avatar-size-4xl: calc(var(--unit) * 18);
  --avatar-size-5xl: calc(var(--unit) * 22);
  --avatar-size: var(--avatar-size-md);
  --avatar-font-size: calc(var(--avatar-size) * 0.34);
  --avatar-icon-size: calc(var(--avatar-size) * 0.44);
  --avatar-surface: var(--color-surface);
  --avatar-text-base: var(--color-text);
  --avatar-line: var(--color-line);
  --avatar-transparent: var(--color-transparent);
  --avatar-source: var(--color-muted);
  --avatar-bg: color-mix(in oklch, var(--avatar-source) 12%, var(--avatar-surface));
  --avatar-text: color-mix(in oklch, var(--avatar-source) 68%, var(--avatar-text-base));
  --avatar-border: color-mix(in oklch, var(--avatar-source) 10%, var(--avatar-transparent));
  width: var(--avatar-size);
  height: var(--avatar-size);
  min-width: var(--avatar-size);
  min-height: var(--avatar-size);
  aspect-ratio: 1;
  border: var(--border) solid var(--avatar-border);
  border-radius: var(--radius-round);
  background-color: var(--avatar-bg);
  color: var(--avatar-text);
  font-size: var(--avatar-font-size);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);

  @apply inline-flex shrink-0 select-none items-center justify-center overflow-hidden align-middle uppercase;
}

.cus-avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;

  @apply block;
}

.cus-avatar__initials {
  @apply leading-none;
}

.cus-avatar__icon {
  width: var(--avatar-icon-size);
  height: var(--avatar-icon-size);

  @apply shrink-0;
}

.cus-avatar[data-theme='app'] {
  --avatar-surface: var(--app-color-panel);
  --avatar-text-base: var(--app-color-text);
  --avatar-line: var(--app-color-line);
  --avatar-transparent: var(--app-color-transparent);
}

.cus-avatar[data-color='primary'] {
  --avatar-source: var(--color-accent);
}

.cus-avatar[data-color='secondary'] {
  --avatar-source: var(--landing-color-header-strong);
}

.cus-avatar[data-color='neutral'] {
  --avatar-source: var(--color-muted);
}

.cus-avatar[data-theme='app'][data-color='primary'] {
  --avatar-source: var(--app-color-accent);
}

.cus-avatar[data-theme='app'][data-color='secondary'] {
  --avatar-source: var(--app-color-text);
}

.cus-avatar[data-theme='app'][data-color='neutral'] {
  --avatar-source: var(--app-color-muted);
}

.cus-avatar[data-size='xs'] {
  --avatar-size: var(--avatar-size-xs);
}

.cus-avatar[data-size='sm'] {
  --avatar-size: var(--avatar-size-sm);
}

.cus-avatar[data-size='md'] {
  --avatar-size: var(--avatar-size-md);
}

.cus-avatar[data-size='lg'] {
  --avatar-size: var(--avatar-size-lg);
}

.cus-avatar[data-size='xl'] {
  --avatar-size: var(--avatar-size-xl);
}

.cus-avatar[data-size='2xl'] {
  --avatar-size: var(--avatar-size-2xl);
}

.cus-avatar[data-size='3xl'] {
  --avatar-size: var(--avatar-size-3xl);
}

.cus-avatar[data-size='4xl'] {
  --avatar-size: var(--avatar-size-4xl);
}

.cus-avatar[data-size='5xl'] {
  --avatar-size: var(--avatar-size-5xl);
}

.cus-avatar[data-shape='square'] {
  border-radius: var(--radius);
}

.cus-avatar[data-shape='circle'] {
  border-radius: var(--radius-round);
}
</style>
