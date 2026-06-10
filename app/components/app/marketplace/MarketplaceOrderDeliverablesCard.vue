<template>
  <section class="marketplace-order-deliverables-card" aria-labelledby="marketplace-orders-deliverables-title">
    <header class="marketplace-order-deliverables-card__header">
      <div>
        <p class="marketplace-order-deliverables-card__eyebrow">
          Mission
        </p>
        <h3 id="marketplace-orders-deliverables-title">
          Livrables
        </h3>
      </div>
      <span>{{ order.nextCheckpoint }}</span>
    </header>

    <ul class="marketplace-order-deliverables-card__list">
      <li v-for="deliverable in order.deliverables" :key="deliverable.title" :data-status="deliverable.status">
        <Icon :name="getDeliverableIcon(deliverable.status)" aria-hidden="true" />
        <span>
          <strong>{{ deliverable.title }}</strong>
          <small>{{ deliverable.description }}</small>
        </span>
        <em>{{ getDeliverableLabel(deliverable.status) }}</em>
      </li>
    </ul>
  </section>
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
.marketplace-order-deliverables-card {
  display: grid;
  gap: var(--orders-space-3);
  padding: var(--orders-space-3) 0 0;
  border-top: var(--orders-border) solid var(--orders-color-line);
}

.marketplace-order-deliverables-card__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--orders-space-3);
  align-items: start;
}

.marketplace-order-deliverables-card__header > span {
  max-width: calc(var(--orders-unit) * 36);
  color: var(--orders-color-muted);
  font-size: var(--orders-font-small);
  font-weight: 600;
  line-height: var(--orders-line-body);
  text-align: right;
}

.marketplace-order-deliverables-card__eyebrow,
.marketplace-order-deliverables-card h3 {
  margin: 0;
}

.marketplace-order-deliverables-card__eyebrow {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-body);
  text-transform: uppercase;
}

.marketplace-order-deliverables-card h3 {
  color: var(--orders-color-text);
  font-size: var(--orders-font-section);
  font-weight: 600;
  line-height: var(--orders-line-title);
}

.marketplace-order-deliverables-card__list {
  display: grid;
  gap: var(--orders-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}

.marketplace-order-deliverables-card__list li {
  display: grid;
  grid-template-columns: var(--orders-hit-size) minmax(0, 1fr) auto;
  gap: var(--orders-space-2);
  align-items: center;
  min-height: calc(var(--orders-unit) * 8);
  padding: var(--orders-space-2) 0;
  border-bottom: var(--orders-border) solid var(--orders-color-line);
  background-color: var(--orders-color-transparent);
}

.marketplace-order-deliverables-card__list svg {
  width: var(--orders-icon-size);
  height: var(--orders-icon-size);
  justify-self: center;
  color: var(--orders-color-subtle);
}

.marketplace-order-deliverables-card__list li[data-status='ready'] svg {
  color: var(--orders-color-accent);
}

.marketplace-order-deliverables-card__list li[data-status='approved'] svg {
  color: var(--orders-color-success);
}

.marketplace-order-deliverables-card__list span {
  display: grid;
  gap: calc(var(--orders-unit) * 0.5);
}

.marketplace-order-deliverables-card__list strong {
  color: var(--orders-color-text);
  font-size: var(--orders-font-small);
  font-weight: 600;
  line-height: var(--orders-line-title);
  overflow-wrap: anywhere;
}

.marketplace-order-deliverables-card__list small {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-body);
}

.marketplace-order-deliverables-card__list em {
  color: var(--orders-color-muted);
  font-size: var(--orders-font-label);
  font-style: normal;
  font-weight: 600;
  line-height: var(--orders-line-tight);
  white-space: nowrap;
}

@media (max-width: 46rem) {
  .marketplace-order-deliverables-card__header,
  .marketplace-order-deliverables-card__list li {
    grid-template-columns: 1fr;
  }

  .marketplace-order-deliverables-card__header > span {
    max-width: none;
    text-align: left;
  }

  .marketplace-order-deliverables-card__list em {
    justify-self: start;
  }
}
</style>
