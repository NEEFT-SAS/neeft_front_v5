<template>
  <div :id="id" class="app-header-modal" :data-open="open">
    <div class="app-header-modal__content">
      <nav class="app-header-modal__nav" aria-label="Navigation principale">
        <NuxtLink v-for="item in navigationLinks" :key="item.to" :to="item.to" @click="$emit('close')">
          <Icon :name="item.icon" aria-hidden="true" />
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
type NavigationItem = { label: string; to: string; icon: string }

const navigationLinks: NavigationItem[] = [
  { label: 'Feed', to: '/feed', icon: 'lucide:newspaper' },
  { label: 'Offres de recrutement', to: '/recruitment', icon: 'lucide:briefcase-business' }
]

defineProps({
  id: { type: String, default: '' },
  open: { type: Boolean, default: false }
})

defineEmits(['close'])
</script>

<style scoped lang="scss">
.app-header-modal {
  position: fixed;
  inset: var(--app-header-height) 0 0 0;
  z-index: calc(var(--app-layer-header) - 1);
  background-color: var(--app-color-bg);
  overflow: auto;
  overscroll-behavior: contain;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transition: opacity var(--app-motion-fast), visibility var(--app-motion-fast);
}

.app-header-modal[data-open='true'] {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
}

.app-header-modal__content {
  padding: var(--app-space-4);
}

.app-header-modal__nav {
  display: grid;
  gap: var(--app-space-2);
}

.app-header-modal__nav a {
  gap: var(--app-space-3);
  padding: var(--app-space-3);
  border-radius: var(--app-radius);
  color: var(--app-color-text);
  font-size: var(--app-font-body);
  font-weight: var(--app-font-weight-medium);
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.app-header-modal__nav a:hover {
  background-color: var(--app-color-panel-hover);
}

.app-header-modal__nav a svg {
  width: var(--app-icon-size);
  height: var(--app-icon-size);
}
</style>
