<template>
  <div :id="id" class="landing-header-modal" :data-open="open">
    <div class="landing-header-modal__content">
      <nav class="landing-header-modal__nav" aria-label="Navigation principale">
        <NuxtLink v-for="item in navigationLinks" :key="item.to" :to="item.to" @click="$emit('close')">
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
type NavigationItem = { label: string; to: string }

const navigationLinks: NavigationItem[] = [
  { label: 'Players', to: '/players' },
  { label: 'Teams', to: '/teams' },
  { label: 'Recruitment', to: '/recruitment' },
  { label: 'Staff', to: '/staff' },
  { label: 'Esport Map', to: '/maps/teams' },
  { label: 'Pricing', to: '/premium' }
]

defineProps({
  id: { type: String, default: '' },
  open: { type: Boolean, default: false }
})

defineEmits(['close'])
</script>

<style scoped lang="scss">
@use '~/assets/scss/mixins/breakpoints' as *;

.landing-header-modal {
  position: fixed;
  inset: var(--landing-header-height) 0 0 0;
  z-index: calc(var(--landing-header-layer) - 1);
  background-color: var(--color-bg);
  overflow: auto;
  overscroll-behavior: contain;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transition: opacity var(--motion-fast), visibility var(--motion-fast);
}

.landing-header-modal[data-open='true'] {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
}

.landing-header-modal__content {
  padding: var(--space-4);
}

.landing-header-modal__nav {
  display: grid;
  gap: var(--space-2);
}

.landing-header-modal__nav a {
  padding: var(--space-3);
  border-radius: var(--radius);
  color: var(--landing-color-header-text);
  font-size: var(--font-body);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
}

.landing-header-modal__nav a:hover {
  background-color: var(--color-bg-soft-hover);
}
</style>
