<template>
  <BaseProfileSection
    title="Services similaires"
    eyebrow="Marketplace"
    surface="plain"
    id="marketplace-service-related"
  >
    <ul class="marketplace-service-profile-related">
      <li v-for="relatedService in services" :key="relatedService.slug">
        <NuxtLinkLocale
          class="marketplace-service-profile-related__link"
          :to="`/marketplace/${relatedService.slug}`"
          :aria-label="`Voir le service ${relatedService.title}`"
        >
          <MarketplaceSafeImage
            :src="relatedService.coverImageUrl"
            :alt="`Banniere du service ${relatedService.title}`"
            empty-class="marketplace-service-profile-related__empty"
            width="320"
            height="160"
            loading="lazy"
            decoding="async"
          />
          <span>
            <small v-if="getCategoryLabel(relatedService)">{{ getCategoryLabel(relatedService) }}</small>
            <strong>{{ relatedService.title }}</strong>
          </span>
          <em v-if="getPriceLabel(relatedService)">{{ getPriceLabel(relatedService) }}</em>
        </NuxtLinkLocale>
      </li>
    </ul>
  </BaseProfileSection>
</template>

<script setup lang="ts">
import type { MarketplaceServiceListItemPresenter } from '~/plugins/marketplace-api'

defineProps<{
  services: MarketplaceServiceListItemPresenter[]
}>()

const formatMarketplacePrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(price)
}

const getCategoryLabel = (relatedService: MarketplaceServiceListItemPresenter) => {
  return relatedService.rscCategories?.[0]?.label || ''
}

const getPriceLabel = (relatedService: MarketplaceServiceListItemPresenter) => {
  const prices = (relatedService.offers || [])
    .map(offer => Number(offer.price))
    .filter(price => Number.isFinite(price))

  return prices.length ? formatMarketplacePrice(Math.min(...prices)) : ''
}
</script>

<style>
.marketplace-service-profile-related {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(var(--profile-unit) * 28)), 1fr));
  gap: var(--profile-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.marketplace-service-profile-related__link {
  display: grid;
  grid-template-rows: calc(var(--profile-unit) * 16) minmax(calc(var(--profile-unit) * 9), 1fr) auto;
  height: 100%;
  overflow: hidden;
  border-radius: var(--profile-radius);
  background-color: var(--profile-color-panel-strong);
  color: inherit;
  text-decoration: none;
  box-shadow: 0 var(--profile-space-3) var(--profile-space-8) var(--profile-color-shadow);
  transition-duration: var(--motion-fast);
}

.marketplace-service-profile-related__link:hover {
  transform: translateY(calc(var(--profile-border) * -2));
}

.marketplace-service-profile-related__link:focus-visible {
  outline: calc(var(--profile-border) * 3) solid var(--profile-color-focus);
  outline-offset: calc(var(--profile-border) * 3);
}

.marketplace-service-profile-related__link img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.marketplace-service-profile-related__empty {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: var(--profile-color-subtle);
  background-color: var(--profile-color-panel);
}

.marketplace-service-profile-related__empty svg {
  width: calc(var(--profile-unit) * 5);
  height: calc(var(--profile-unit) * 5);
}

.marketplace-service-profile-related__link span {
  display: grid;
  gap: var(--profile-space-1);
  padding: var(--profile-space-3);
}

.marketplace-service-profile-related__link small {
  color: var(--profile-color-subtle);
  font-size: var(--profile-font-label);
  font-weight: 800;
  line-height: var(--profile-line-tight);
  text-transform: uppercase;
}

.marketplace-service-profile-related__link strong {
  color: var(--profile-color-text);
  font-size: var(--profile-font-small);
  font-weight: 800;
  line-height: var(--profile-line-title);
}

.marketplace-service-profile-related__link em {
  align-self: end;
  padding: 0 var(--profile-space-3) var(--profile-space-3);
  color: var(--profile-color-text);
  font-size: var(--profile-font-small);
  font-style: normal;
  font-weight: 900;
  line-height: var(--profile-line-tight);
}

.marketplace-service-profile-related__link span,
.marketplace-service-profile-related__link small,
.marketplace-service-profile-related__link strong,
.marketplace-service-profile-related__link em {
  margin: 0;
}

@media (max-width: 40rem) {
  .marketplace-service-profile-related {
    grid-template-columns: 1fr;
  }
}
</style>
