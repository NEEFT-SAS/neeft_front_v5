<template>
  <section class="marketplace-order-counterpart-card" aria-labelledby="marketplace-orders-context-title">
    <header class="marketplace-order-counterpart-card__header">
      <div>
        <p class="marketplace-order-counterpart-card__eyebrow">
          {{ counterpartLabel }}
        </p>
        <h3 id="marketplace-orders-context-title">
          {{ counterpart.name }}
        </h3>
      </div>
      <span class="marketplace-order-counterpart-card__avatar" aria-hidden="true">
        {{ initials }}
      </span>
    </header>

    <dl class="marketplace-order-counterpart-card__facts">
      <div>
        <dt>Role</dt>
        <dd>{{ counterpart.role }}</dd>
      </div>
      <div>
        <dt>Commande</dt>
        <dd>{{ order.orderedAt }}</dd>
      </div>
      <div>
        <dt>Echeance</dt>
        <dd>{{ order.dueAt }}</dd>
      </div>
      <div>
        <dt>Mise a jour</dt>
        <dd>{{ order.updatedAt }}</dd>
      </div>
    </dl>

    <CustomLink
      label="Voir le service"
      :to="`/marketplace/${order.serviceSlug}`"
      left-icon="lucide:external-link"
      theme="app"
      variant="outlined"
      color="secondary"
      size="sm"
    />
  </section>
</template>

<script setup lang="ts">
import type { MarketplaceOrder, MarketplaceOrderRole } from '~/datas/marketplace/orders'

const props = defineProps<{
  order: MarketplaceOrder
  role: MarketplaceOrderRole
  counterpartLabel: string
}>()

const counterpart = computed(() => props.role === 'buyer' ? props.order.seller : props.order.buyer)

const initials = computed(() => {
  const words = counterpart.value.name.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return ''

  return words
    .slice(0, 2)
    .map(word => Array.from(word)[0])
    .join('')
    .toUpperCase()
})
</script>

<style scoped>
.marketplace-order-counterpart-card {
  display: grid;
  gap: var(--orders-space-3);
  padding: var(--orders-space-3) 0 0;
  border-top: var(--orders-border) solid var(--orders-color-line);
}

.marketplace-order-counterpart-card__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--orders-space-3);
  align-items: start;
}

.marketplace-order-counterpart-card__eyebrow,
.marketplace-order-counterpart-card h3,
.marketplace-order-counterpart-card dl,
.marketplace-order-counterpart-card dd {
  margin: 0;
}

.marketplace-order-counterpart-card__eyebrow {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-body);
  text-transform: uppercase;
}

.marketplace-order-counterpart-card h3 {
  color: var(--orders-color-text);
  font-size: var(--orders-font-section);
  font-weight: 600;
  line-height: var(--orders-line-title);
}

.marketplace-order-counterpart-card__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--orders-hit-size);
  height: var(--orders-hit-size);
  border: var(--orders-border) solid var(--orders-color-line);
  border-radius: var(--orders-radius-round);
  background-color: var(--orders-color-bg);
  color: var(--orders-color-text);
  font-size: var(--orders-font-small);
  font-weight: 600;
  line-height: var(--orders-line-tight);
}

.marketplace-order-counterpart-card__facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--orders-space-2);
}

.marketplace-order-counterpart-card__facts div {
  display: grid;
  gap: calc(var(--orders-unit) * 0.5);
}

.marketplace-order-counterpart-card__facts dt {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-body);
}

.marketplace-order-counterpart-card__facts dd {
  color: var(--orders-color-muted);
  font-size: var(--orders-font-small);
  line-height: var(--orders-line-body);
}

@media (max-width: 46rem) {
  .marketplace-order-counterpart-card__header,
  .marketplace-order-counterpart-card__facts {
    grid-template-columns: 1fr;
  }
}
</style>
