<template>
  <section class="marketplace-order-messages-card" aria-labelledby="marketplace-orders-messages-title">
    <header class="marketplace-order-messages-card__header">
      <div>
        <p class="marketplace-order-messages-card__eyebrow">
          Conversation
        </p>
        <h3 id="marketplace-orders-messages-title">
          Derniers messages
        </h3>
      </div>
      <CustomButton
        label="Ouvrir"
        left-icon="lucide:message-circle"
        theme="app"
        variant="outlined"
        color="secondary"
        size="sm"
        @click="emit('open', order)"
      />
    </header>

    <ul class="marketplace-order-messages-card__list">
      <li v-for="message in order.messages" :key="`${message.author}-${message.date}-${message.excerpt}`">
        <span class="marketplace-order-messages-card__icon" aria-hidden="true">
          <Icon :name="message.role === 'system' ? 'lucide:bot' : 'lucide:user-round'" />
        </span>
        <span>
          <strong>{{ message.author }}</strong>
          <small>{{ message.date }}</small>
          <p>{{ message.excerpt }}</p>
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { MarketplaceOrder } from '~/datas/marketplace/orders'

defineProps<{
  order: MarketplaceOrder
}>()

const emit = defineEmits<{
  open: [order: MarketplaceOrder]
}>()
</script>

<style scoped>
.marketplace-order-messages-card {
  display: grid;
  gap: var(--orders-space-3);
  padding: var(--orders-space-3) 0 0;
  border-top: var(--orders-border) solid var(--orders-color-line);
}

.marketplace-order-messages-card__header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--orders-space-3);
  align-items: start;
}

.marketplace-order-messages-card__eyebrow,
.marketplace-order-messages-card h3,
.marketplace-order-messages-card p {
  margin: 0;
}

.marketplace-order-messages-card__eyebrow {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-body);
  text-transform: uppercase;
}

.marketplace-order-messages-card h3 {
  color: var(--orders-color-text);
  font-size: var(--orders-font-section);
  font-weight: 600;
  line-height: var(--orders-line-title);
}

.marketplace-order-messages-card__list {
  display: grid;
  gap: var(--orders-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}

.marketplace-order-messages-card__list li {
  display: grid;
  grid-template-columns: var(--orders-hit-size) minmax(0, 1fr);
  gap: var(--orders-space-2);
  align-items: center;
  min-height: calc(var(--orders-unit) * 8);
  padding: var(--orders-space-2) 0;
  border-bottom: var(--orders-border) solid var(--orders-color-line);
  background-color: var(--orders-color-transparent);
}

.marketplace-order-messages-card__icon {
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

.marketplace-order-messages-card__icon svg {
  width: var(--orders-icon-size);
  height: var(--orders-icon-size);
}

.marketplace-order-messages-card__list span:last-child {
  display: grid;
  gap: calc(var(--orders-unit) * 0.5);
}

.marketplace-order-messages-card__list strong {
  color: var(--orders-color-text);
  font-size: var(--orders-font-small);
  font-weight: 600;
  line-height: var(--orders-line-title);
  overflow-wrap: anywhere;
}

.marketplace-order-messages-card__list small {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-body);
}

.marketplace-order-messages-card__list p {
  color: var(--orders-color-muted);
  font-size: var(--orders-font-body);
  line-height: var(--orders-line-body);
  text-wrap: pretty;
}

@media (max-width: 46rem) {
  .marketplace-order-messages-card__header {
    grid-template-columns: 1fr;
  }
}
</style>
