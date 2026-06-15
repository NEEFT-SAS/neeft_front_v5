<template>
  <BaseProfileSection
    title="Suivi de commande"
    eyebrow="Suivi"
    surface="plain"
    id="marketplace-order-tracking"
  >
    <div class="marketplace-order-tracking-widget__current">
      <h3>{{ currentMilestone?.title || order.nextCheckpoint }}</h3>
    </div>

    <ol class="marketplace-order-tracking-widget__steps">
      <li v-for="milestone in order.milestones" :key="`${order.id}-summary-${milestone.title}`" :data-state="milestone.state">
        <i aria-hidden="true" />
        <strong>{{ milestone.title }}</strong>
        <small>{{ milestone.date }}</small>
      </li>
    </ol>
  </BaseProfileSection>
</template>

<script setup lang="ts">
import type { MarketplaceOrder } from '~/datas/marketplace/orders'

const props = defineProps<{
  order: MarketplaceOrder
}>()

const currentMilestone = computed(() => {
  return props.order.milestones.find(milestone => milestone.state === 'current')
    || [...props.order.milestones].reverse().find(milestone => milestone.state === 'done')
    || props.order.milestones[0]
})
</script>

<style scoped>
.marketplace-order-tracking-widget__current {
  display: grid;
  gap: var(--orders-space-3);
}

.marketplace-order-tracking-widget__current h3 {
  margin: 0;
  color: var(--orders-color-text);
  font-size: var(--orders-font-section);
  font-weight: 600;
  line-height: var(--orders-line-title);
  overflow-wrap: anywhere;
}

.marketplace-order-tracking-widget__steps {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: var(--orders-space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.marketplace-order-tracking-widget__steps li {
  position: relative;
  display: grid;
  gap: calc(var(--orders-unit) * 0.75);
  align-content: start;
  padding-top: var(--orders-space-2);
}

.marketplace-order-tracking-widget__steps li::before {
  position: absolute;
  top: calc(var(--orders-unit) * 0.5);
  right: 0;
  left: 0;
  height: calc(var(--orders-border) * 2);
  background-color: color-mix(in oklch, var(--orders-color-line) 78%, var(--orders-color-transparent));
  content: "";
}

.marketplace-order-tracking-widget__steps li[data-state='done']::before {
  background-color: color-mix(in oklch, var(--orders-color-success) 62%, var(--orders-color-line));
}

.marketplace-order-tracking-widget__steps li[data-state='current']::before {
  background-color: var(--orders-color-accent);
}

.marketplace-order-tracking-widget__steps i {
  position: relative;
  z-index: 1;
  width: calc(var(--orders-unit) * 1.25);
  height: calc(var(--orders-unit) * 1.25);
  border: calc(var(--orders-border) * 2) solid var(--orders-color-line);
  border-radius: var(--orders-radius-round);
  background-color: var(--orders-color-bg);
}

.marketplace-order-tracking-widget__steps li[data-state='done'] i {
  border-color: var(--orders-color-success);
  background-color: var(--orders-color-success);
}

.marketplace-order-tracking-widget__steps li[data-state='current'] i {
  border-color: var(--orders-color-accent);
}

.marketplace-order-tracking-widget__steps strong {
  color: var(--orders-color-text);
  font-size: var(--orders-font-label);
  font-weight: 700;
  line-height: var(--orders-line-tight);
  overflow-wrap: anywhere;
}

.marketplace-order-tracking-widget__steps small {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-tight);
  overflow-wrap: anywhere;
}

@media (max-width: 46rem) {
  .marketplace-order-tracking-widget__steps {
    grid-template-columns: 1fr;
    gap: var(--orders-space-3);
  }

  .marketplace-order-tracking-widget__steps li {
    grid-template-columns: calc(var(--orders-unit) * 2) minmax(0, 1fr);
    gap: 0 var(--orders-space-2);
    padding-top: 0;
  }

  .marketplace-order-tracking-widget__steps li::before {
    top: calc(var(--orders-unit) * 1.5);
    right: auto;
    bottom: calc(var(--orders-space-3) * -1);
    left: calc(var(--orders-unit) * 0.55);
    width: calc(var(--orders-border) * 2);
    height: auto;
  }

  .marketplace-order-tracking-widget__steps li:last-child::before {
    display: none;
  }

  .marketplace-order-tracking-widget__steps i {
    grid-row: 1 / span 2;
    align-self: start;
    margin-top: calc(var(--orders-unit) * 0.25);
  }

  .marketplace-order-tracking-widget__steps strong,
  .marketplace-order-tracking-widget__steps small {
    grid-column: 2;
  }
}
</style>
