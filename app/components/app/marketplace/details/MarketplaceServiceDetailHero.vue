<template>
  <section class="marketplace-service-profile-hero">
    <div class="marketplace-service-profile-shell">
      <div class="marketplace-service-profile-hero__banner">
        <MarketplaceSafeImage
          class="marketplace-service-profile-hero__image"
          empty-class="marketplace-service-profile-hero__image--empty"
          :src="config.marketplace.service.getServiceBannerUrl(service.bannerUrl)"
          :alt="`Banniere du service ${service.name}`"
          width="1440"
          height="360"
          loading="eager"
          decoding="async"
        />

        <div class="marketplace-service-profile-hero__back">
          <CustomLink
            label="Marketplace"
            to="/marketplace"
            left-icon="lucide:arrow-left"
            theme="app"
            variant="outlined"
            color="secondary"
            size="sm"
          />
        </div>

        <div v-if="service.rscGames?.length" class="marketplace-service-profile-hero__games" aria-label="Jeux concernes">
          <span v-for="game in service.rscGames" :key="game.id" class="marketplace-service-profile-hero__game">
            <Icon v-if="game.icon" :name="game.icon" aria-hidden="true" />
            {{ game.shortName || game.name }}
          </span>
        </div>

        <div class="marketplace-service-profile-hero__identity">
          <div class="marketplace-service-profile-hero__copy">
            <p class="marketplace-service-profile-eyebrow">
              Marketplace
            </p>
            <h1 id="marketplace-service-title">
              {{ service.name }}
            </h1>

            <ul class="marketplace-service-profile-hero__meta" aria-label="Informations du service">
              <li>
                <MarketplaceRating
                  :rating="rating"
                  :review-count="reviewCount"
                  :show-reviews="false"
                />
              </li>
            </ul>
          </div>

          <div class="marketplace-service-profile-hero__actions" aria-label="Actions principales">
            <CustomButton
              label=""
              left-icon="lucide:message-circle"
              theme="app"
              variant="filled"
              color="primary"
              size="sm"
              shape="circle"
              aria-label="Contacter le vendeur"
              @click="emit('contact')"
            />
            <CustomButton
              label=""
              left-icon="lucide:share-2"
              theme="app"
              variant="outlined"
              color="secondary"
              size="sm"
              shape="circle"
              aria-label="Partager le service"
              @click="emit('share')"
            />
            <CustomButton
              v-if="isOwner"
              label=""
              left-icon="lucide:pencil"
              theme="app"
              variant="outlined"
              color="secondary"
              size="sm"
              shape="circle"
              aria-label="Modifier le service"
              @click="emit('edit')"
            />
            <CustomButton
              v-if="isOwner"
              label=""
              left-icon="lucide:trash-2"
              theme="app"
              variant="outlined"
              color="secondary"
              size="sm"
              shape="circle"
              aria-label="Supprimer le service"
              @click="emit('delete')"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { MarketplaceServicePresenter } from '~/plugins/marketplace-api'

defineProps<{
  service: MarketplaceServicePresenter
  rating: number
  reviewCount: number
  isOwner?: boolean
}>()

const emit = defineEmits<{
  contact: []
  share: []
  edit: []
  delete: []
}>()

const config = useConfig()
</script>

<style>
.marketplace-service-profile-hero {
  padding: var(--profile-space-8) 0 var(--profile-space-4);
  background-color: var(--profile-color-bg-soft);
}

.marketplace-service-profile-hero__banner {
  position: relative;
  height: var(--profile-banner-height);
  overflow: hidden;
  border: var(--profile-border) solid var(--profile-color-border);
  border-radius: var(--profile-radius);
  background-color: var(--profile-color-panel);
}

.marketplace-service-profile-hero__banner::after {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, oklch(0% 0 0 / 0.05), oklch(0% 0 0 / 0.64));
  content: "";
}

.marketplace-service-profile-hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.marketplace-service-profile-hero__image--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--profile-color-subtle);
  background-color: var(--profile-color-panel-strong);
}

.marketplace-service-profile-hero__image--empty svg {
  width: calc(var(--profile-unit) * 8);
  height: calc(var(--profile-unit) * 8);
}

.marketplace-service-profile-hero__back {
  position: absolute;
  top: var(--profile-space-3);
  left: var(--profile-space-3);
  z-index: 3;
}

.marketplace-service-profile-hero__games {
  position: absolute;
  top: var(--profile-space-3);
  right: var(--profile-space-3);
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  gap: var(--profile-space-1);
  justify-content: end;
  max-width: min(62%, calc(var(--profile-unit) * 58));
}

.marketplace-service-profile-hero__game {
  display: inline-flex;
  min-height: calc(var(--profile-unit) * 4.5);
  align-items: center;
  gap: var(--profile-space-1);
  padding: 0 var(--profile-space-2);
  border: var(--profile-border) solid color-mix(in oklch, var(--profile-color-border) 72%, var(--profile-color-transparent));
  border-radius: var(--profile-radius-round);
  background-color: color-mix(in oklch, var(--profile-color-panel) 72%, var(--profile-color-transparent));
  color: var(--profile-color-text);
  font-size: var(--profile-font-label);
  font-weight: 800;
  line-height: var(--profile-line-tight);
  box-shadow: 0 var(--profile-space-2) var(--profile-space-5) var(--profile-color-shadow);
  backdrop-filter: blur(calc(var(--profile-unit) * 1.5));
}

.marketplace-service-profile-hero__game svg {
  width: calc(var(--profile-unit) * 2);
  height: calc(var(--profile-unit) * 2);
  color: var(--profile-color-accent);
}

.marketplace-service-profile-hero__identity {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--profile-space-4);
  align-items: end;
  max-height: 100%;
  padding: var(--profile-space-4);
  overflow: hidden;
  background: linear-gradient(180deg, oklch(0% 0 0 / 0), oklch(0% 0 0 / 0.42));
}

.marketplace-service-profile-hero__copy {
  display: grid;
  gap: var(--profile-space-1);
}

.marketplace-service-profile-hero__copy h1,
.marketplace-service-profile-hero__copy p,
.marketplace-service-profile-hero__meta {
  margin: 0;
}

.marketplace-service-profile-hero__copy h1 {
  color: var(--profile-color-text);
  font-size: var(--profile-font-title);
  font-weight: 900;
  line-height: var(--profile-line-tight);
  overflow-wrap: anywhere;
}

.marketplace-service-profile-hero__copy > p,
.marketplace-service-profile-hero__meta {
  color: var(--profile-color-muted);
  font-size: var(--profile-font-small);
  line-height: var(--profile-line-body);
}

.marketplace-service-profile-hero__copy > p {
  max-width: calc(var(--profile-unit) * 78);
  text-wrap: pretty;
}

.marketplace-service-profile-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--profile-space-2);
  padding: 0;
  list-style: none;
}

.marketplace-service-profile-hero__meta li {
  display: inline-flex;
  align-items: center;
  gap: var(--profile-space-1);
}

.marketplace-service-profile-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--profile-space-2);
  justify-content: end;
}

@media (max-width: 62rem) {
  .marketplace-service-profile-hero__identity {
    grid-template-columns: 1fr;
  }

  .marketplace-service-profile-hero__actions {
    justify-content: start;
  }
}

@media (max-width: 40rem) {
  .marketplace-service-profile-hero__identity {
    padding: var(--profile-space-3);
  }

  .marketplace-service-profile-hero__games {
    top: calc(var(--profile-space-8) + var(--profile-space-1));
    right: var(--profile-space-3);
    left: var(--profile-space-3);
    justify-content: start;
    max-width: none;
  }

  .marketplace-service-profile-hero__game {
    min-height: calc(var(--profile-unit) * 4);
  }
}
</style>
