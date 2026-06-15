<template>
  <BaseProfileSection
    :id="titleId"
    :title="order.serviceTitle"
    :eyebrow="detailTitle"
    surface="plain"
  >
    <div class="marketplace-order-overview-widget">
      <div class="marketplace-order-overview-widget__cover">
        <MarketplaceSafeImage
          :src="config.marketplace.service.getServiceBannerUrl(order.serviceCoverImage)"
          :alt="`Image du service ${order.serviceTitle}`"
          empty-class="marketplace-order-overview-widget__cover-empty"
          width="240"
          height="150"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div class="marketplace-order-overview-widget__body">
        <strong>{{ order.serviceTitle }}</strong>
        <p>{{ order.scope }}</p>
        <span>{{ order.id }}</span>
      </div>

      <div class="marketplace-order-overview-widget__state">
        <MarketplaceOrderStatus :status="order.status" size="lg" />
        <strong>{{ getMarketplaceOrderAmountLabel(order) }}</strong>
      </div>

      <dl class="marketplace-order-overview-widget__facts">
        <div>
          <dt>Date de commande</dt>
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
    </div>
  </BaseProfileSection>
</template>

<script setup lang="ts">
import { getMarketplaceOrderAmountLabel, type MarketplaceOrder } from '~/datas/marketplace/orders'

defineProps<{
  order: MarketplaceOrder
  detailTitle: string
  titleId: string
}>()

const config = useConfig()
</script>

<style scoped>
.marketplace-order-overview-widget {
  display: grid;
  grid-template-columns: calc(var(--orders-unit) * 20) minmax(0, 1fr) auto;
  gap: var(--orders-space-3);
  align-items: center;
}

.marketplace-order-overview-widget__cover {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: calc(var(--orders-radius) * 0.75);
  background-color: var(--orders-color-panel-strong);
}

.marketplace-order-overview-widget__cover img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.marketplace-order-overview-widget__cover-empty {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: var(--orders-color-subtle);
}

.marketplace-order-overview-widget__cover-empty svg {
  width: calc(var(--orders-unit) * 4);
  height: calc(var(--orders-unit) * 4);
}

.marketplace-order-overview-widget__body {
  display: grid;
  gap: calc(var(--orders-unit) * 0.75);
}

.marketplace-order-overview-widget__body strong {
  color: var(--orders-color-text);
  font-size: var(--orders-font-body);
  font-weight: 700;
  line-height: var(--orders-line-title);
  overflow-wrap: anywhere;
}

.marketplace-order-overview-widget__body p {
  margin: 0;
  color: var(--orders-color-muted);
  font-size: var(--orders-font-small);
  line-height: var(--orders-line-body);
  text-wrap: pretty;
}

.marketplace-order-overview-widget__body span {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-body);
  overflow-wrap: anywhere;
}

.marketplace-order-overview-widget__state {
  display: grid;
  gap: calc(var(--orders-unit) * 0.75);
  justify-items: end;
  text-align: right;
}

.marketplace-order-overview-widget__state strong {
  color: var(--orders-color-text);
  font-size: calc(var(--orders-unit) * 2.4);
  font-weight: 700;
  line-height: var(--orders-line-tight);
}

.marketplace-order-overview-widget__facts {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--orders-space-2);
  margin: 0;
  padding: 0;
}

.marketplace-order-overview-widget__facts div {
  display: grid;
  gap: calc(var(--orders-unit) * 0.5);
  padding-top: var(--orders-space-2);
  border-top: var(--orders-border) solid var(--orders-color-line);
}

.marketplace-order-overview-widget__facts dt {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 700;
  line-height: var(--orders-line-tight);
  text-transform: uppercase;
}

.marketplace-order-overview-widget__facts dd {
  margin: 0;
  color: var(--orders-color-text);
  font-size: var(--orders-font-small);
  font-weight: 600;
  line-height: var(--orders-line-body);
  overflow-wrap: anywhere;
}

@media (max-width: 72rem) {
  .marketplace-order-overview-widget {
    grid-template-columns: calc(var(--orders-unit) * 20) minmax(0, 1fr);
  }

  .marketplace-order-overview-widget__state {
    grid-column: 1 / -1;
    justify-items: start;
    text-align: left;
  }
}

@media (max-width: 46rem) {
  .marketplace-order-overview-widget,
  .marketplace-order-overview-widget__facts {
    grid-template-columns: 1fr;
  }
}
</style>
