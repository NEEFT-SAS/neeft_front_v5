<template>
  <BaseProfileSection
    title="Images"
    eyebrow="Portfolio"
    surface="plain"
    id="marketplace-service-gallery"
  >
    <ul class="marketplace-service-profile-gallery" aria-label="Images du service">
      <li v-for="image in images" :key="image">
        <MarketplaceSafeImage
          :src="image"
          :alt="`Image du service ${serviceName}`"
          width="520"
          height="320"
          loading="lazy"
          decoding="async"
        />
      </li>
    </ul>
  </BaseProfileSection>
</template>

<script setup lang="ts">
defineProps<{
  images: string[]
  serviceName: string
}>()
</script>

<style>
.marketplace-service-profile-gallery {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--profile-space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.marketplace-service-profile-gallery li {
  overflow: hidden;
  border-radius: var(--profile-radius);
  background-color: var(--profile-color-panel-strong);
  box-shadow: 0 var(--profile-space-3) var(--profile-space-8) var(--profile-color-shadow);
}

.marketplace-service-profile-gallery img {
  display: block;
  width: 100%;
  height: calc(var(--profile-unit) * 24);
  object-fit: cover;
}

@media (max-width: 62rem) {
  .marketplace-service-profile-gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 40rem) {
  .marketplace-service-profile-gallery {
    grid-template-columns: 1fr;
  }
}
</style>
