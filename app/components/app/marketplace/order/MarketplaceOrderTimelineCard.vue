<template>
  <section class="marketplace-order-timeline-card" aria-labelledby="marketplace-orders-timeline-title">
    <header class="marketplace-order-timeline-card__header">
      <div>
        <p class="marketplace-order-timeline-card__eyebrow">
          Timeline
        </p>
        <h3 id="marketplace-orders-timeline-title">
          Avancement
        </h3>
      </div>
      <span>{{ order.progress }}%</span>
    </header>

    <ol class="marketplace-order-timeline-card__list">
      <li v-for="milestone in order.milestones" :key="`${order.id}-${milestone.title}`" :data-state="milestone.state">
        <span class="marketplace-order-timeline-card__marker" aria-hidden="true">
          <Icon :name="getMilestoneIcon(milestone.state)" />
        </span>
        <div>
          <span>{{ milestone.date }}</span>
          <h4>{{ milestone.title }}</h4>
          <p>{{ milestone.description }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import type { MarketplaceOrder, MarketplaceTimelineState } from '~/datas/marketplace/orders'

defineProps<{
  order: MarketplaceOrder
}>()

const getMilestoneIcon = (state: MarketplaceTimelineState) => {
  if (state === 'done') return 'lucide:check'
  if (state === 'current') return 'lucide:radio'
  return 'lucide:circle'
}
</script>

<style scoped>
.marketplace-order-timeline-card {
  display: grid;
  gap: var(--orders-space-3);
  padding-bottom: var(--orders-space-4);
  border-bottom: var(--orders-border) solid var(--orders-color-line);
  background-color: transparent;
}

.marketplace-order-timeline-card__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--orders-space-3);
  align-items: start;
}

.marketplace-order-timeline-card__header > span {
  display: inline-flex;
  align-items: center;
  color: var(--orders-color-accent);
  font-size: var(--orders-font-small);
  font-weight: 800;
  line-height: var(--orders-line-tight);
  text-align: right;
}

.marketplace-order-timeline-card__eyebrow,
.marketplace-order-timeline-card h3,
.marketplace-order-timeline-card h4,
.marketplace-order-timeline-card p {
  margin: 0;
}

.marketplace-order-timeline-card__eyebrow {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-body);
  text-transform: uppercase;
}

.marketplace-order-timeline-card h3 {
  color: var(--orders-color-text);
  font-size: var(--orders-font-section);
  font-weight: 600;
  line-height: var(--orders-line-title);
}

.marketplace-order-timeline-card__list {
  display: grid;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.marketplace-order-timeline-card__list li {
  position: relative;
  display: grid;
  grid-template-columns: var(--orders-hit-size) minmax(0, 1fr);
  gap: var(--orders-space-2);
  min-height: calc(var(--orders-unit) * 9);
  padding-top: var(--orders-space-2);
}

.marketplace-order-timeline-card__list li::before {
  position: absolute;
  top: var(--orders-hit-size);
  bottom: calc(var(--orders-space-2) * -1);
  left: calc(var(--orders-hit-size) / 2);
  width: var(--orders-border);
  background-color: var(--orders-color-line);
  content: "";
}

.marketplace-order-timeline-card__list li:last-child::before {
  display: none;
}

.marketplace-order-timeline-card__marker {
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--orders-hit-size);
  height: var(--orders-hit-size);
  border: 0;
  border-radius: var(--orders-radius-round);
  background-color: transparent;
  color: var(--orders-color-subtle);
}

.marketplace-order-timeline-card__marker svg {
  width: calc(var(--orders-icon-size) * 0.8);
  height: calc(var(--orders-icon-size) * 0.8);
}

.marketplace-order-timeline-card__list li[data-state='done'] .marketplace-order-timeline-card__marker {
  border-color: color-mix(in oklch, var(--orders-color-success) 58%, var(--orders-color-line));
  color: var(--orders-color-success);
}

.marketplace-order-timeline-card__list li[data-state='current'] .marketplace-order-timeline-card__marker {
  border-color: color-mix(in oklch, var(--orders-color-accent) 68%, var(--orders-color-line));
  color: var(--orders-color-accent);
}

.marketplace-order-timeline-card__list div {
  display: grid;
  gap: calc(var(--orders-unit) * 0.5);
  padding-bottom: var(--orders-space-3);
  border-bottom: var(--orders-border) solid color-mix(in oklch, var(--orders-color-line) 70%, var(--orders-color-transparent));
}

.marketplace-order-timeline-card__list li:last-child div {
  border-bottom: 0;
}

.marketplace-order-timeline-card__list span {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-body);
}

.marketplace-order-timeline-card h4 {
  color: var(--orders-color-text);
  font-size: var(--orders-font-small);
  font-weight: 600;
  line-height: var(--orders-line-title);
}

.marketplace-order-timeline-card p {
  color: var(--orders-color-muted);
  font-size: var(--orders-font-body);
  line-height: var(--orders-line-body);
  text-wrap: pretty;
}

@media (max-width: 46rem) {
  .marketplace-order-timeline-card__header {
    grid-template-columns: 1fr;
  }

  .marketplace-order-timeline-card__header > span {
    max-width: none;
    text-align: left;
  }
}
</style>
