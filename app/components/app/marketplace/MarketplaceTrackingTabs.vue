<template>
  <nav class="marketplace-tracking-tabs" aria-label="Vues du suivi marketplace">
    <NuxtLink
      v-for="item in items"
      :key="item.value"
      class="marketplace-tracking-tabs__item"
      :class="{ 'marketplace-tracking-tabs__item--active': active === item.value }"
      :to="item.to"
      :aria-current="active === item.value ? 'page' : undefined"
    >
      <Icon :name="item.icon" aria-hidden="true" />
      <span>{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
type MarketplaceTrackingTab = 'orders' | 'sales' | 'services'

defineProps<{
  active: MarketplaceTrackingTab
}>()

const items = [
  { value: 'orders', label: 'Achats', icon: 'lucide:shopping-bag', to: '/marketplace/orders' },
  { value: 'sales', label: 'Ventes', icon: 'lucide:inbox', to: '/marketplace/sales' },
  { value: 'services', label: 'Services', icon: 'lucide:store', to: '/marketplace/services' }
] as const satisfies readonly { value: MarketplaceTrackingTab, label: string, icon: string, to: string }[]
</script>

<style scoped>
.marketplace-tracking-tabs {
  --marketplace-tabs-unit: var(--orders-unit, var(--services-unit));
  --marketplace-tabs-space-1: var(--orders-space-1, var(--services-space-1));
  --marketplace-tabs-space-2: var(--orders-space-2, var(--services-space-2));
  --marketplace-tabs-border: var(--orders-border, var(--services-border));
  --marketplace-tabs-radius-round: var(--orders-radius-round, var(--services-radius-round));
  --marketplace-tabs-hit-size: var(--orders-hit-size, var(--services-hit-size));
  --marketplace-tabs-icon-size: var(--orders-icon-size, var(--services-icon-size));
  --marketplace-tabs-font-small: var(--orders-font-small, var(--services-font-small));
  --marketplace-tabs-line-tight: var(--orders-line-tight, var(--services-line-tight));
  --marketplace-tabs-color-bg: var(--orders-color-bg, var(--services-color-bg));
  --marketplace-tabs-color-line: var(--orders-color-line, var(--services-color-line));
  --marketplace-tabs-color-muted: var(--orders-color-muted, var(--services-color-muted));
  --marketplace-tabs-color-text: var(--orders-color-text, var(--services-color-text));
  --marketplace-tabs-color-accent: var(--orders-color-accent, var(--services-color-accent));
  display: inline-grid;
  grid-template-columns: repeat(3, minmax(calc(var(--marketplace-tabs-unit) * 13), 1fr));
  gap: var(--marketplace-tabs-space-1);
  padding: var(--marketplace-tabs-space-1);
  border: var(--marketplace-tabs-border) solid var(--marketplace-tabs-color-line);
  border-radius: var(--marketplace-tabs-radius-round);
  background-color: var(--marketplace-tabs-color-bg);
}

.marketplace-tracking-tabs__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--marketplace-tabs-hit-size);
  gap: var(--marketplace-tabs-space-1);
  padding: 0 var(--marketplace-tabs-space-2);
  border-radius: var(--marketplace-tabs-radius-round);
  color: var(--marketplace-tabs-color-muted);
  font-size: var(--marketplace-tabs-font-small);
  font-weight: 600;
  line-height: var(--marketplace-tabs-line-tight);
  text-decoration: none;
}

.marketplace-tracking-tabs__item:hover,
.marketplace-tracking-tabs__item--active {
  background-color: color-mix(in oklch, var(--marketplace-tabs-color-accent) 14%, var(--marketplace-tabs-color-bg));
  color: var(--marketplace-tabs-color-text);
}

.marketplace-tracking-tabs__item:focus-visible {
  outline: calc(var(--marketplace-tabs-border) * 3) solid var(--marketplace-tabs-color-accent);
  outline-offset: calc(var(--marketplace-tabs-border) * 3);
}

.marketplace-tracking-tabs__item svg {
  width: var(--marketplace-tabs-icon-size);
  height: var(--marketplace-tabs-icon-size);
}

@media (max-width: 46rem) {
  .marketplace-tracking-tabs {
    width: 100%;
  }
}
</style>
