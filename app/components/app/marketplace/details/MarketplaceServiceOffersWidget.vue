<template>
  <MarketplaceServiceSidebarPanel class="marketplace-service-profile-offers">
    <template #header>
      <div>
        <p class="marketplace-service-profile-eyebrow">Commande</p>
        <h2>Choisir une offre</h2>
      </div>
      <strong v-if="selectedOffer">{{ formatMarketplacePrice(Number(selectedOffer.price) || 0) }}</strong>
    </template>

    <div class="marketplace-service-profile-offers__list" role="radiogroup" aria-label="Offres disponibles">
      <label
        v-for="offer in offers"
        :key="offer.id"
        class="marketplace-service-profile-offer"
        :data-selected="offer.id === selectedOfferId ? 'true' : 'false'"
      >
        <input
          type="radio"
          name="marketplace-service-offer"
          :value="offer.id"
          :checked="offer.id === selectedOfferId"
          @change="emit('update:selectedOfferId', offer.id)"
        >
        <span class="marketplace-service-profile-offer__check" aria-hidden="true">
          <Icon v-if="offer.id === selectedOfferId" name="lucide:check" />
        </span>
        <span class="marketplace-service-profile-offer__body">
          <strong>{{ offer.name }}</strong>
          <span>{{ offer.description }}</span>
        </span>
        <strong class="marketplace-service-profile-offer__price">
          {{ formatMarketplacePrice(offer.price) }}
        </strong>
      </label>
    </div>

    <CustomButton
      label="Commander"
      left-icon="lucide:shopping-bag"
      theme="app"
      variant="filled"
      color="primary"
      size="lg"
      :disabled="!selectedOffer || !canOrder"
      @click="emit('order')"
    />
  </MarketplaceServiceSidebarPanel>
</template>

<script setup lang="ts">
import type { MarketplaceServiceLinePresenter } from '~/plugins/marketplace-api'

const props = defineProps<{
  offers: MarketplaceServiceLinePresenter[]
  selectedOfferId: string
  selectedOffer?: MarketplaceServiceLinePresenter
  canOrder: boolean
}>()

const emit = defineEmits<{
  'update:selectedOfferId': [value: string]
  order: []
}>()

const formatMarketplacePrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(price)
}
</script>

<style>
.marketplace-service-profile-offers {
  gap: var(--profile-space-4);
}

.marketplace-service-profile-offers__list {
  display: grid;
  gap: var(--profile-space-2);
}

.marketplace-service-profile-offer {
  position: relative;
  display: grid;
  grid-template-columns: calc(var(--profile-unit) * 4) minmax(0, 1fr) auto;
  gap: var(--profile-space-2);
  align-items: center;
  min-height: calc(var(--profile-unit) * 8.5);
  padding: var(--profile-space-2);
  border: var(--profile-border) solid var(--profile-color-border);
  border-radius: var(--profile-radius);
  background-color: var(--profile-color-panel-strong);
  cursor: pointer;
  transition-duration: var(--motion-fast);
}

.marketplace-service-profile-offer:hover,
.marketplace-service-profile-offer[data-selected='true'] {
  border-color: color-mix(in oklch, var(--profile-color-accent) 64%, var(--profile-color-border));
  background-color: color-mix(in oklch, var(--profile-color-accent) 12%, var(--profile-color-panel));
}

.marketplace-service-profile-offer input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.marketplace-service-profile-offer:has(input:focus-visible) {
  outline: calc(var(--profile-border) * 3) solid color-mix(in oklch, var(--profile-color-focus) 70%, var(--profile-color-transparent));
  outline-offset: calc(var(--profile-border) * 2);
}

.marketplace-service-profile-offer__check {
  display: inline-flex;
  width: calc(var(--profile-unit) * 3);
  height: calc(var(--profile-unit) * 3);
  align-items: center;
  justify-content: center;
  border: calc(var(--profile-border) * 2) solid color-mix(in oklch, var(--profile-color-muted) 52%, var(--profile-color-border));
  border-radius: var(--profile-radius-round);
  color: var(--profile-color-text);
}

.marketplace-service-profile-offer[data-selected='true'] .marketplace-service-profile-offer__check {
  border-color: var(--profile-color-accent);
  background: var(--gradient-action);
}

.marketplace-service-profile-offer__check svg {
  width: calc(var(--profile-unit) * 1.75);
  height: calc(var(--profile-unit) * 1.75);
}

.marketplace-service-profile-offer__body {
  display: grid;
  gap: calc(var(--profile-unit) * 0.5);
}

.marketplace-service-profile-offer__body strong,
.marketplace-service-profile-offer__price {
  margin: 0;
  color: var(--profile-color-text);
  font-size: var(--profile-font-small);
  font-style: normal;
  font-weight: 800;
  line-height: var(--profile-line-tight);
}

.marketplace-service-profile-offer__body span {
  display: -webkit-box;
  overflow: hidden;
  color: var(--profile-color-muted);
  font-size: var(--profile-font-label);
  line-height: var(--profile-line-body);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.marketplace-service-profile-offer__price {
  text-align: right;
  white-space: nowrap;
}

@media (max-width: 40rem) {
  .marketplace-service-profile-offer {
    grid-template-columns: calc(var(--profile-unit) * 4) minmax(0, 1fr);
  }

  .marketplace-service-profile-offer__price {
    grid-column: 2;
    text-align: left;
  }
}
</style>
