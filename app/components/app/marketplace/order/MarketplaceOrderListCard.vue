<template>
  <NuxtLink
    class="marketplace-order-list-card"
    :to="detailPath"
    :data-urgent="hasUrgentAction ? 'true' : 'false'"
    :aria-label="`Voir le detail de ${order.id}, ${order.serviceTitle}`"
  >
    <span class="marketplace-order-list-card__cover">
      <MarketplaceSafeImage
        class="marketplace-order-list-card__cover-image"
        :src="config.marketplace.service.getServiceBannerUrl(order.serviceCoverImage)"
        :alt="`Image du service ${order.serviceTitle}`"
        empty-class="marketplace-order-list-card__cover-empty"
        width="168"
        height="112"
        loading="lazy"
        decoding="async"
      />
      <span v-if="hasUnread" class="marketplace-order-list-card__unread">
        Nouveau
      </span>
    </span>

    <span class="marketplace-order-list-card__content">
      <span class="marketplace-order-list-card__heading">
        <span class="marketplace-order-list-card__title">
          <small>{{ order.id }}</small>
          <strong>{{ order.serviceTitle }}</strong>
        </span>

        <MarketplaceOrderStatus :status="order.status" />
      </span>

      <span class="marketplace-order-list-card__counterpart">
        <CustomAvatar
          :src="config.profile.getUserAvatarUrl(counterpart.profilePicture)"
          :name="counterpart.name"
          :alt="`Avatar de ${counterpart.name}`"
          size="sm"
          theme="app"
          color="primary"
        />
        <span>
          <small>{{ counterpartLabel }}</small>
          <strong>{{ counterpart.name }}</strong>
        </span>
      </span>

      <span class="marketplace-order-list-card__tracking" aria-label="Suivi de la commande">
        <span class="marketplace-order-list-card__tracking-head">
          <small>Suivi</small>
          <strong>{{ currentMilestone?.title || order.nextCheckpoint }}</strong>
        </span>

        <span class="marketplace-order-list-card__steps">
          <span
            v-for="(milestone, index) in order.milestones"
            :key="`${order.id}-${milestone.title}`"
            :data-state="milestone.state"
            :aria-label="`${index + 1}. ${milestone.title}`"
          >
            <i aria-hidden="true" />
            <small>{{ milestone.title }}</small>
          </span>
        </span>
      </span>
    </span>

    <span class="marketplace-order-list-card__side">
      <strong>{{ amountLabel }}</strong>
      <span class="marketplace-order-list-card__due">
        <Icon name="lucide:calendar-clock" aria-hidden="true" />
        <span>{{ order.dueAt }}</span>
      </span>
      <span class="marketplace-order-list-card__detail-cta">
        Voir le suivi
        <Icon name="lucide:chevron-right" aria-hidden="true" />
      </span>
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

const config = useConfig()
const counterpart = computed(() => props.role === 'buyer' ? props.order.seller : props.order.buyer)
const hasUrgentAction = computed(() => Boolean(props.order.nextActions[props.role]?.urgent))
const amountLabel = computed(() => getMarketplaceOrderAmountLabel(props.order))
const hasUnread = computed(() => props.order.messages.some(message => message.unreadFor?.includes(props.role)))
const currentMilestone = computed(() => props.order.milestones.find(milestone => milestone.state === 'current') || [...props.order.milestones].reverse().find(milestone => milestone.state === 'done') || props.order.milestones[0])
</script>

<style scoped>
.marketplace-order-list-card {
  display: grid;
  grid-template-columns: minmax(calc(var(--orders-unit) * 18), calc(var(--orders-unit) * 21)) minmax(0, 1fr) auto;
  align-items: stretch;
  width: 100%;
  min-height: 100%;
  gap: var(--orders-space-3);
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

.marketplace-order-list-card__cover {
  position: relative;
  display: block;
  min-height: calc(var(--orders-unit) * 13);
  overflow: hidden;
  border-radius: var(--orders-radius);
  background-color: var(--orders-color-panel-strong);
}

.marketplace-order-list-card__cover-image,
.marketplace-order-list-card__cover-empty {
  display: block;
  width: 100%;
  height: 100%;
}

.marketplace-order-list-card__cover-image {
  object-fit: cover;
}

.marketplace-order-list-card__cover-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--orders-color-subtle);
}

.marketplace-order-list-card__cover-empty svg {
  width: calc(var(--orders-unit) * 5);
  height: calc(var(--orders-unit) * 5);
}

.marketplace-order-list-card__content {
  display: grid;
  align-content: start;
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

.marketplace-order-list-card__title small {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 700;
  line-height: var(--orders-line-tight);
}

.marketplace-order-list-card__title strong {
  color: var(--orders-color-text);
  font-size: var(--orders-font-section);
  font-weight: 600;
  line-height: var(--orders-line-title);
  overflow-wrap: anywhere;
}

.marketplace-order-list-card__counterpart,
.marketplace-order-list-card__tracking-head,
.marketplace-order-list-card__due {
  color: var(--orders-color-muted);
  font-size: var(--orders-font-small);
  line-height: var(--orders-line-body);
}

.marketplace-order-list-card__unread {
  position: absolute;
  top: var(--orders-space-2);
  left: var(--orders-space-2);
  display: inline-flex;
  min-height: calc(var(--orders-unit) * 3);
  align-items: center;
  padding: 0 var(--orders-space-2);
  border-radius: var(--orders-radius-round);
  background-color: var(--orders-color-danger);
  color: var(--orders-color-text);
  font-size: var(--orders-font-label);
  font-weight: 800;
  line-height: var(--orders-line-tight);
}

.marketplace-order-list-card__counterpart {
  display: inline-grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  justify-self: start;
  gap: var(--orders-space-2);
  min-height: calc(var(--orders-unit) * 6);
  padding: calc(var(--orders-unit) * 0.75) var(--orders-space-2);
  border: var(--orders-border) solid color-mix(in oklch, var(--orders-color-accent) 26%, var(--orders-color-line));
  border-radius: var(--orders-radius);
  background-color: color-mix(in oklch, var(--orders-color-accent) 8%, var(--orders-color-panel));
}

.marketplace-order-list-card__counterpart small,
.marketplace-order-list-card__tracking-head small {
  display: block;
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 700;
  line-height: var(--orders-line-tight);
  text-transform: uppercase;
}

.marketplace-order-list-card__counterpart strong,
.marketplace-order-list-card__tracking-head strong {
  display: block;
  color: var(--orders-color-text);
  font-size: var(--orders-font-small);
  font-weight: 700;
  line-height: var(--orders-line-tight);
  overflow-wrap: anywhere;
}

.marketplace-order-list-card__tracking {
  display: grid;
  gap: var(--orders-space-2);
}

.marketplace-order-list-card__steps {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: var(--orders-space-1);
}

.marketplace-order-list-card__steps > span {
  display: grid;
  align-content: start;
  gap: calc(var(--orders-unit) * 0.5);
}

.marketplace-order-list-card__steps i {
  display: block;
  width: 100%;
  height: calc(var(--orders-border) * 3);
  border-radius: var(--orders-radius-round);
  background-color: color-mix(in oklch, var(--orders-color-line) 72%, var(--orders-color-transparent));
}

.marketplace-order-list-card__steps span[data-state='done'] i {
  background-color: color-mix(in oklch, var(--orders-color-success) 70%, var(--orders-color-line));
}

.marketplace-order-list-card__steps span[data-state='current'] i {
  background-color: var(--orders-color-accent);
}

.marketplace-order-list-card__steps small {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-tight);
  overflow-wrap: anywhere;
}

.marketplace-order-list-card__side {
  display: grid;
  min-width: calc(var(--orders-unit) * 20);
  align-content: start;
  justify-items: end;
  gap: var(--orders-space-2);
}

.marketplace-order-list-card__side > strong {
  color: var(--orders-color-text);
  font-size: var(--orders-font-section);
  font-weight: 600;
  line-height: var(--orders-line-tight);
}

.marketplace-order-list-card__due,
.marketplace-order-list-card__detail-cta {
  display: inline-flex;
  align-items: center;
  gap: var(--orders-space-1);
}

.marketplace-order-list-card__due svg,
.marketplace-order-list-card__detail-cta svg {
  width: var(--orders-icon-size);
  height: var(--orders-icon-size);
}

.marketplace-order-list-card__detail-cta {
  color: var(--orders-color-accent);
  font-size: var(--orders-font-label);
  font-weight: 700;
  line-height: var(--orders-line-tight);
}

@media (max-width: 72rem) {
  .marketplace-order-list-card {
    grid-template-columns: minmax(calc(var(--orders-unit) * 16), calc(var(--orders-unit) * 20)) minmax(0, 1fr);
  }

  .marketplace-order-list-card__side {
    grid-column: 2;
    min-width: 0;
    grid-template-columns: repeat(auto-fit, minmax(calc(var(--orders-unit) * 12), auto));
    align-items: center;
    justify-content: start;
    justify-items: start;
  }
}

@media (max-width: 46rem) {
  .marketplace-order-list-card {
    grid-template-columns: 1fr;
  }

  .marketplace-order-list-card__cover {
    min-height: calc(var(--orders-unit) * 22);
  }

  .marketplace-order-list-card__side {
    grid-column: auto;
  }

  .marketplace-order-list-card__steps {
    grid-template-columns: 1fr;
  }

  .marketplace-order-list-card__side > strong {
    font-size: var(--orders-font-small);
  }
}
</style>
