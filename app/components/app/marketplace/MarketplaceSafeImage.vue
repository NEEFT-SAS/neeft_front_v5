<template>
  <img
    v-if="safeSrc"
    v-bind="attrs"
    :src="safeSrc"
    :alt="props.alt"
    @error="hasLoadError = true"
  >
  <div v-else v-bind="fallbackAttrs">
    <slot>
      <Icon :name="props.icon" />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { getSafeMarketplaceImageSrc } from '~/utils/marketplaceImages'

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<{
  src?: string | null
  alt: string
  emptyClass?: string
  icon?: string
}>(), {
  src: '',
  emptyClass: '',
  icon: 'lucide:image'
})

const attrs = useAttrs()
const hasLoadError = ref(false)

const safeSrc = computed(() => {
  if (hasLoadError.value) return ''
  return getSafeMarketplaceImageSrc(props.src)
})

const fallbackAttrs = computed(() => ({
  class: [attrs.class, props.emptyClass].filter(Boolean),
  style: attrs.style,
  'aria-hidden': 'true'
}))

watch(() => props.src, () => {
  hasLoadError.value = false
})
</script>
