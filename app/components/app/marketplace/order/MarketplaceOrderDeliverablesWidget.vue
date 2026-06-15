<template>
  <BaseProfileSection
    title="Livrables"
    eyebrow="Mission"
    surface="plain"
    id="marketplace-order-deliverables"
  >
    <template #action>
      <span class="marketplace-order-deliverables-widget__checkpoint">{{ order.nextCheckpoint }}</span>
    </template>

    <ul class="marketplace-order-deliverables-widget__list">
      <li v-for="deliverable in order.deliverables" :key="deliverable.title" :data-status="deliverable.status">
        <Icon :name="getDeliverableIcon(deliverable.status)" aria-hidden="true" />
        <span>
          <a v-if="deliverable.url" :href="deliverable.url" target="_blank" rel="noopener noreferrer"><strong>{{ deliverable.title }}</strong></a>
          <strong v-else>{{ deliverable.title }}</strong>
          <small>{{ deliverable.description }}</small>
        </span>
        <em>{{ getDeliverableLabel(deliverable.status) }}</em>
      </li>
    </ul>
  </BaseProfileSection>
</template>

<script setup lang="ts">
import type { MarketplaceDeliverableStatus, MarketplaceOrder } from '~/datas/marketplace/orders'

defineProps<{
  order: MarketplaceOrder
}>()

const getDeliverableIcon = (status: MarketplaceDeliverableStatus) => {
  if (status === 'approved') return 'lucide:circle-check'
  if (status === 'ready') return 'lucide:file-check-2'
  return 'lucide:file-clock'
}

const getDeliverableLabel = (status: MarketplaceDeliverableStatus) => {
  if (status === 'approved') return 'Valide'
  if (status === 'ready') return 'Pret'
  return 'A venir'
}
</script>

<style scoped>
.marketplace-order-deliverables-widget__checkpoint {
  display: block;
  max-width: calc(var(--orders-unit) * 36);
  color: var(--orders-color-muted);
  font-size: var(--orders-font-small);
  font-weight: 600;
  line-height: var(--orders-line-body);
  text-align: right;
}

.marketplace-order-deliverables-widget__list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.marketplace-order-deliverables-widget__list li {
  display: grid;
  grid-template-columns: var(--orders-hit-size) minmax(0, 1fr) auto;
  gap: var(--orders-space-2);
  align-items: center;
  min-height: calc(var(--orders-unit) * 8);
  padding: var(--orders-space-2) 0;
  border-top: var(--orders-border) solid color-mix(in oklch, var(--orders-color-line) 70%, var(--orders-color-transparent));
  background-color: transparent;
}

.marketplace-order-deliverables-widget__list svg {
  width: var(--orders-icon-size);
  height: var(--orders-icon-size);
  justify-self: center;
  color: var(--orders-color-subtle);
}

.marketplace-order-deliverables-widget__list li[data-status='ready'] svg {
  color: var(--orders-color-accent);
}

.marketplace-order-deliverables-widget__list li[data-status='approved'] svg {
  color: var(--orders-color-success);
}

.marketplace-order-deliverables-widget__list span {
  display: grid;
  gap: calc(var(--orders-unit) * 0.5);
}

.marketplace-order-deliverables-widget__list strong {
  color: var(--orders-color-text);
  font-size: var(--orders-font-small);
  font-weight: 600;
  line-height: var(--orders-line-title);
  overflow-wrap: anywhere;
}

.marketplace-order-deliverables-widget__list small {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-body);
}

.marketplace-order-deliverables-widget__list em {
  display: inline-flex;
  min-height: calc(var(--orders-unit) * 3);
  align-items: center;
  padding: 0;
  background-color: transparent;
  color: var(--orders-color-muted);
  font-size: var(--orders-font-label);
  font-style: normal;
  font-weight: 600;
  line-height: var(--orders-line-tight);
  white-space: nowrap;
}

.marketplace-order-deliverables-widget__list li[data-status='ready'] em {
  color: var(--orders-color-accent);
}

.marketplace-order-deliverables-widget__list li[data-status='approved'] em {
  color: var(--orders-color-success);
}

@media (max-width: 46rem) {
  .marketplace-order-deliverables-widget__checkpoint {
    max-width: none;
    text-align: left;
  }

  .marketplace-order-deliverables-widget__list li {
    grid-template-columns: 1fr;
  }

  .marketplace-order-deliverables-widget__list em {
    justify-self: start;
  }
}
</style>
