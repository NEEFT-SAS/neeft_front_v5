<template>
  <MarketplaceServiceSidebarPanel class="marketplace-service-profile-seller-card">
    <header class="marketplace-service-profile-seller-card__header">
      <CustomAvatar
        :src="config.profile.getUserAvatarUrl(seller?.profilePicture)"
        :name="getSellerName(seller)"
        :alt="`Avatar de ${getSellerName(seller)}`"
        size="lg"
        theme="app"
        color="primary"
      />
      <div class="marketplace-service-profile-seller-card__identity">
        <p class="marketplace-service-profile-eyebrow">Vendeur</p>
        <h2>{{ getSellerName(seller) }}</h2>
        <span>Prestataire marketplace</span>
      </div>
    </header>

    <p class="marketplace-service-profile-seller-card__summary">
      {{ getSellerName(seller) }} est la personne qui realise ce service. Contacte le vendeur pour clarifier le besoin avant de commander.
    </p>

    <CustomButton
      label="Contacter"
      left-icon="lucide:message-circle"
      theme="app"
      variant="outlined"
      color="secondary"
      size="md"
      @click="emit('contact')"
    />
  </MarketplaceServiceSidebarPanel>
</template>

<script setup lang="ts">
import type { MarketplaceProfilePresenter } from '~/plugins/marketplace-api'

defineProps<{
  seller: MarketplaceProfilePresenter | null
}>()

const emit = defineEmits<{
  contact: []
}>()

const config = useConfig()

const getSellerName = (seller: MarketplaceProfilePresenter | null) => {
  return seller?.username || 'Vendeur marketplace'
}
</script>

<style>
.marketplace-service-profile-seller-card__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--profile-space-3);
  align-items: center;
}

.marketplace-service-profile-seller-card__identity {
  display: grid;
  gap: calc(var(--profile-unit) * 0.5);
}

.marketplace-service-profile-seller-card__identity span {
  margin: 0;
  color: var(--profile-color-subtle);
  font-size: var(--profile-font-label);
  line-height: var(--profile-line-body);
}

.marketplace-service-profile-seller-card__summary {
  color: var(--profile-color-muted);
  font-size: var(--profile-font-body);
  line-height: var(--profile-line-body);
  text-wrap: pretty;
}
</style>
