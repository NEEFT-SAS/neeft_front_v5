<template>
  <MarketplaceServiceSidebarPanel class="marketplace-service-profile-seller-card">
    <header class="marketplace-service-profile-seller-card__header">
      <CustomAvatar
        :src="sellerAvatarSrc"
        :name="sellerName"
        :alt="`Avatar de ${sellerName}`"
        size="lg"
        theme="app"
        color="primary"
      />
      <div class="marketplace-service-profile-seller-card__identity">
        <p class="marketplace-service-profile-eyebrow">Vendeur</p>
        <h2>{{ sellerName }}</h2>
        <span>Prestataire marketplace</span>
      </div>
    </header>

    <p class="marketplace-service-profile-seller-card__summary">
      {{ sellerSummary }}
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
defineProps<{
  sellerName: string
  sellerAvatarSrc: string
  sellerSummary: string
}>()

const emit = defineEmits<{
  contact: []
}>()
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
