<template>
  <NuxtLink
    class="marketplace-order-list-card"
    :to="detailPath"
    :data-urgent="action.urgent ? 'true' : 'false'"
    :aria-label="`Voir le detail de ${order.id}, ${order.serviceTitle}`"
  >
    <span class="marketplace-order-list-card__main">
      <span class="marketplace-order-list-card__service-icon" aria-hidden="true">
        <Icon :name="order.serviceIcon" />
      </span>

      <span class="marketplace-order-list-card__content">
        <span class="marketplace-order-list-card__heading">
          <span class="marketplace-order-list-card__title">
            <strong>{{ order.serviceTitle }}</strong>
            <span>{{ order.id }} - {{ counterpartLabel }} {{ counterpart.name }}</span>
          </span>
          <span v-if="hasUnread" class="marketplace-order-list-card__unread" aria-label="Message non lu" />
        </span>

        <span class="marketplace-order-list-card__action">
          <Icon :name="action.icon" aria-hidden="true" />
          <span>
            <small>Prochaine action</small>
            <strong>{{ action.title }}</strong>
          </span>
        </span>

        <span class="marketplace-order-list-card__progress-head">
          <span>{{ order.nextCheckpoint }}</span>
          <strong>{{ order.progress }}%</strong>
        </span>

        <span
          class="marketplace-order-list-card__progress"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="order.progress"
          :aria-label="`Progression ${order.progress}%`"
          :style="{ '--marketplace-order-progress': `${order.progress}%` }"
        >
          <span />
        </span>

        <span class="marketplace-order-list-card__tracking" aria-label="Suivi de la commande">
          <span
            v-for="milestone in order.milestones"
            :key="`${order.id}-${milestone.title}`"
            :data-state="milestone.state"
          >
            <i aria-hidden="true" />
            <small>{{ milestone.title }}</small>
          </span>
        </span>
      </span>
    </span>

    <span class="marketplace-order-list-card__side">
      <MarketplaceOrderStatus :status="order.status" />
      <strong>{{ amountLabel }}</strong>
      <span class="marketplace-order-list-card__due">
        <Icon name="lucide:calendar-clock" aria-hidden="true" />
        <span>{{ order.dueAt }}</span>
      </span>
      <span class="marketplace-order-list-card__detail-cta">
        Voir le suivi
      </span>
      <Icon name="lucide:chevron-right" aria-hidden="true" />
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
import { getMarketplaceOrderAmountLabel, type MarketplaceOrder, type MarketplaceOrderRole } from '~/datas/marketplace/orders'

const props = defineProps<{
  order: MarketplaceOrder
  role: MarketplaceOrderRole
  detailPath: string
  counterpartLabel: string
}>()

const counterpart = computed(() => props.role === 'buyer' ? props.order.seller : props.order.buyer)
const action = computed(() => props.order.nextActions[props.role])
const amountLabel = computed(() => getMarketplaceOrderAmountLabel(props.order))
const hasUnread = computed(() => props.order.messages.some(message => message.unreadFor?.includes(props.role)))
</script>

<style scoped>
.marketplace-order-list-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  width: 100%;
  min-height: 100%;
  gap: var(--orders-space-4);
  padding: var(--orders-space-4) 0;
  border-bottom: var(--orders-border) solid var(--orders-color-line);
  background-color: var(--orders-color-transparent);
  color: inherit;
  font: inherit;
  text-align: left;
  text-decoration: none;
  transition-duration: var(--motion-fast);
}

.marketplace-order-list-card:hover {
  background-color: color-mix(in oklch, var(--orders-color-panel) 38%, var(--orders-color-transparent));
}

.marketplace-order-list-card:focus-visible {
  outline: calc(var(--orders-border) * 3) solid var(--orders-color-accent);
  outline-offset: calc(var(--orders-border) * 3);
}

.marketplace-order-list-card[data-urgent='true'] {
  border-color: color-mix(in oklch, var(--orders-color-warning) 34%, var(--orders-color-line));
}

.marketplace-order-list-card__main {
  display: grid;
  grid-template-columns: var(--orders-hit-size) minmax(0, 1fr);
  gap: var(--orders-space-3);
  align-items: start;
}

.marketplace-order-list-card__service-icon {
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

.marketplace-order-list-card__service-icon svg,
.marketplace-order-list-card__action svg,
.marketplace-order-list-card__due svg,
.marketplace-order-list-card__side > svg {
  width: var(--orders-icon-size);
  height: var(--orders-icon-size);
}

.marketplace-order-list-card__content {
  display: grid;
  gap: var(--orders-space-2);
}

.marketplace-order-list-card__heading {
  display: flex;
  gap: var(--orders-space-2);
  align-items: start;
  justify-content: space-between;
}

.marketplace-order-list-card__title {
  display: grid;
  gap: calc(var(--orders-unit) * 0.5);
}

.marketplace-order-list-card__title strong,
.marketplace-order-list-card__action strong {
  color: var(--orders-color-text);
  font-size: var(--orders-font-small);
  font-weight: 600;
  line-height: var(--orders-line-title);
  overflow-wrap: anywhere;
}

.marketplace-order-list-card__title span,
.marketplace-order-list-card__action,
.marketplace-order-list-card__progress-head,
.marketplace-order-list-card__due {
  color: var(--orders-color-muted);
  font-size: var(--orders-font-small);
  line-height: var(--orders-line-body);
}

.marketplace-order-list-card__unread {
  width: calc(var(--orders-unit) * 1.25);
  height: calc(var(--orders-unit) * 1.25);
  border-radius: var(--orders-radius-round);
  background-color: var(--orders-color-danger);
}

.marketplace-order-list-card__action {
  display: inline-grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  justify-self: start;
  gap: var(--orders-space-1);
  font-weight: 600;
}

.marketplace-order-list-card__action small {
  display: block;
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-tight);
}

.marketplace-order-list-card__action svg {
  color: var(--orders-color-accent);
}

.marketplace-order-list-card__progress-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--orders-space-2);
  align-items: center;
}

.marketplace-order-list-card__progress-head span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.marketplace-order-list-card__progress-head strong {
  color: var(--orders-color-text);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-tight);
}

.marketplace-order-list-card__side {
  display: grid;
  min-width: calc(var(--orders-unit) * 24);
  gap: var(--orders-space-1);
  justify-items: end;
}

.marketplace-order-list-card__side > strong {
  color: var(--orders-color-text);
  font-size: var(--orders-font-section);
  font-weight: 600;
  line-height: var(--orders-line-tight);
}

.marketplace-order-list-card__due {
  display: inline-flex;
  align-items: center;
  gap: var(--orders-space-1);
}

.marketplace-order-list-card__side > svg {
  margin-top: var(--orders-space-1);
  color: var(--orders-color-subtle);
}

.marketplace-order-list-card__progress {
  display: block;
  height: calc(var(--orders-border) * 4);
  overflow: hidden;
  border-radius: var(--orders-radius-round);
  background-color: color-mix(in oklch, var(--orders-color-line) 72%, var(--orders-color-transparent));
}

.marketplace-order-list-card__progress span {
  display: block;
  width: var(--marketplace-order-progress);
  height: 100%;
  border-radius: inherit;
  background: var(--gradient-action);
}

.marketplace-order-list-card__tracking {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: var(--orders-space-1);
}

.marketplace-order-list-card__tracking > span {
  display: grid;
  gap: calc(var(--orders-unit) * 0.5);
  align-content: start;
}

.marketplace-order-list-card__tracking i {
  display: block;
  width: 100%;
  height: calc(var(--orders-border) * 3);
  border-radius: var(--orders-radius-round);
  background-color: color-mix(in oklch, var(--orders-color-line) 72%, var(--orders-color-transparent));
}

.marketplace-order-list-card__tracking span[data-state='done'] i {
  background-color: color-mix(in oklch, var(--orders-color-success) 70%, var(--orders-color-line));
}

.marketplace-order-list-card__tracking span[data-state='current'] i {
  background-color: var(--orders-color-accent);
}

.marketplace-order-list-card__tracking small {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-tight);
  overflow-wrap: anywhere;
}

.marketplace-order-list-card__detail-cta {
  color: var(--orders-color-accent);
  font-size: var(--orders-font-label);
  font-weight: 700;
  line-height: var(--orders-line-tight);
}

@media (max-width: 46rem) {
  .marketplace-order-list-card {
    grid-template-columns: 1fr;
  }

  .marketplace-order-list-card__side {
    min-width: 0;
    grid-template-columns: repeat(auto-fit, minmax(calc(var(--orders-unit) * 12), auto));
    align-items: center;
    justify-content: start;
    justify-items: start;
    gap: var(--orders-space-2);
  }

  .marketplace-order-list-card__tracking {
    grid-template-columns: 1fr;
  }

  .marketplace-order-list-card__side > strong {
    font-size: var(--orders-font-small);
  }
}
</style>
