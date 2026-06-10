<template>
  <section class="marketplace-order-next-action-card" :data-urgent="action.urgent ? 'true' : 'false'">
    <span class="marketplace-order-next-action-card__icon" aria-hidden="true">
      <Icon :name="action.icon" />
    </span>
    <div>
      <p class="marketplace-order-next-action-card__eyebrow">
        Prochaine action
      </p>
      <h3>{{ action.title }}</h3>
      <p>{{ action.description }}</p>
    </div>
    <CustomButton
      :label="actionOrderId === order.id ? 'Mise a jour...' : action.ctaLabel"
      :left-icon="action.icon"
      theme="app"
      variant="filled"
      color="primary"
      size="sm"
      :disabled="action.disabled || actionOrderId === order.id"
      @click="emit('run', order)"
    />
  </section>
</template>

<script setup lang="ts">
import type { MarketplaceOrder, MarketplaceOrderRole } from '~/datas/marketplace/orders'

const props = defineProps<{
  order: MarketplaceOrder
  role: MarketplaceOrderRole
  actionOrderId?: string
}>()

const emit = defineEmits<{
  run: [order: MarketplaceOrder]
}>()

const action = computed(() => props.order.nextActions[props.role])
</script>

<style scoped>
.marketplace-order-next-action-card {
  display: grid;
  grid-template-columns: var(--orders-hit-size) minmax(0, 1fr) auto;
  gap: var(--orders-space-3);
  align-items: start;
  padding: var(--orders-space-3);
  border: var(--orders-border) solid color-mix(in oklch, var(--orders-color-accent) 28%, var(--orders-color-line));
  border-radius: var(--orders-radius);
  background-color: color-mix(in oklch, var(--orders-color-accent) 7%, var(--orders-color-bg));
}

.marketplace-order-next-action-card[data-urgent='true'] {
  border-color: color-mix(in oklch, var(--orders-color-warning) 72%, var(--orders-color-line));
  background-color: color-mix(in oklch, var(--orders-color-warning) 8%, var(--orders-color-bg));
}

.marketplace-order-next-action-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--orders-hit-size) * 0.82);
  height: calc(var(--orders-hit-size) * 0.82);
  min-width: calc(var(--orders-hit-size) * 0.82);
  border-radius: var(--orders-radius-round);
  background-color: color-mix(in oklch, var(--orders-color-accent) 10%, var(--orders-color-panel));
  color: var(--orders-color-accent);
}

.marketplace-order-next-action-card__icon svg {
  width: var(--orders-icon-size);
  height: var(--orders-icon-size);
}

.marketplace-order-next-action-card h3,
.marketplace-order-next-action-card p {
  margin: 0;
}

.marketplace-order-next-action-card h3 {
  color: var(--orders-color-text);
  font-size: var(--orders-font-section);
  font-weight: 600;
  line-height: var(--orders-line-title);
}

.marketplace-order-next-action-card p:not(.marketplace-order-next-action-card__eyebrow) {
  color: var(--orders-color-muted);
  font-size: var(--orders-font-body);
  line-height: var(--orders-line-body);
  text-wrap: pretty;
}

.marketplace-order-next-action-card__eyebrow {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-body);
  text-transform: uppercase;
}

@media (max-width: 72rem) {
  .marketplace-order-next-action-card {
    padding: var(--orders-space-3);
  }
}

@media (max-width: 46rem) {
  .marketplace-order-next-action-card {
    grid-template-columns: 1fr;
  }
}
</style>
