<template>
  <nav class="landing-header-nav" :aria-label="ariaLabel">
    <NuxtLink 
      v-for="item in items" 
      :key="item.to"
      :to="item.to"
      @click="$emit('closeMobileMenu')"
    >
      {{ item.label }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
defineProps({
  ariaLabel: { type: String, default: 'Navigation principale' },
  items: { type: Array as () => Array<{ to: string; label: string; active?: boolean }>, required: true }
})

defineEmits(['closeMobileMenu'])
</script>

<style scoped lang="scss">
@use '~/assets/scss/mixins/breakpoints' as *;

.landing-header-nav {
  gap: var(--space-1);
  padding: 0;
  display: grid;
}

.landing-header-nav a {
  width: 100%;
  padding: 0 var(--space-2);
  border-radius: var(--radius);
  color: var(--landing-color-header-muted);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
  min-height: var(--landing-header-hit-size);
  display: inline-flex;
  align-items: center;
  justify-content: start;
  text-decoration: none;
  white-space: nowrap;
}

.landing-header-nav a:hover {
  background-color: color-mix(in oklch, var(--landing-color-header-line) 16%, var(--color-transparent));
  color: var(--landing-color-header-strong);
}

@include breakpoint-lg {
  .landing-header-nav {
    gap: var(--space-3);
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .landing-header-nav a {
    width: auto;
    padding: 0;
    justify-content: center;
  }

  .landing-header-nav a:hover {
    background-color: var(--color-transparent);
  }
}
</style>
