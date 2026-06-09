<template>
  <article class="marketplace-service-card">
    <NuxtLinkLocale
      class="marketplace-service-card__link"
      :to="servicePath"
      :aria-label="`Voir le service ${props.service.title}`"
    >
      <div class="marketplace-service-card__visual">
        <NuxtImg
          class="marketplace-service-card__banner"
          :src="props.service.coverImage"
          :alt="`Banniere du service ${props.service.title}`"
          width="320"
          height="180"
          format="webp"
          loading="lazy"
          decoding="async"
        />

        <div class="marketplace-service-card__visual-meta">
          <span class="marketplace-service-card__category">
            <Icon :name="props.service.icon" aria-hidden="true" />
            {{ props.service.categoryLabel }}
          </span>

          <div class="marketplace-service-card__games" aria-label="Jeux concernes">
            <span v-for="game in gameIcons" :key="game.label" :aria-label="game.label">
              <Icon :name="game.icon" aria-hidden="true" />
            </span>
          </div>
        </div>

        <h2 class="marketplace-service-card__title">
          {{ props.service.title }}
        </h2>
      </div>

      <div class="marketplace-service-card__content">
        <MarketplaceRating
          :rating="props.service.rating"
          :review-count="props.service.reviewCount"
        />

        <p class="marketplace-service-card__description">
          {{ props.service.shortDescription }}
        </p>

        <footer class="marketplace-service-card__footer">
          <div class="marketplace-service-card__seller">
            <span class="marketplace-service-card__seller-icon" aria-hidden="true">
              <Icon name="lucide:user-round" />
            </span>
            <span>{{ props.service.provider }}</span>
          </div>

          <span class="marketplace-service-card__price">
            {{ priceLabel }}
          </span>
        </footer>
      </div>
    </NuxtLinkLocale>
  </article>
</template>

<script setup lang="ts">
import type { MarketplaceService } from '~/datas/marketplace/services'
import { formatMarketplacePrice } from '~/datas/marketplace/services'
import { searchGameOptions } from '~/datas/searchs'

const props = defineProps<{
  service: MarketplaceService
}>()

const servicePath = computed(() => `/marketplace/${props.service.slug}`)
const priceLabel = computed(() => formatMarketplacePrice(props.service.price))
const gameIconFallback = 'lucide:gamepad-2'

const gameIcons = computed(() => {
  return props.service.games.map((game) => {
    const gameOption = searchGameOptions.find(option => option.label === game)

    return {
      label: game,
      icon: gameOption?.icon || gameIconFallback
    }
  })
})
</script>

<style scoped>
.marketplace-service-card {
  border-radius: var(--search-radius);
  background-color: var(--search-color-section);
  box-shadow: 0 var(--search-space-3) var(--search-space-8) var(--search-color-shadow);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  @apply h-full overflow-hidden;
}

.marketplace-service-card:hover {
  box-shadow: 0 var(--search-space-4) var(--search-space-12) var(--search-color-shadow);
  transform: translateY(calc(var(--search-border) * -2));
}

.marketplace-service-card__link {
  color: inherit;
  text-decoration: none;

  @apply grid h-full;
}

.marketplace-service-card__link:focus-visible {
  outline: calc(var(--search-border) * 3) solid var(--search-color-accent);
  outline-offset: calc(var(--search-border) * 3);
}

.marketplace-service-card__visual {
  height: var(--search-player-visual-height);
  background-color: var(--search-color-panel-soft);

  @apply relative overflow-hidden;
}

.marketplace-service-card__banner {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.28s ease;
}

.marketplace-service-card:hover .marketplace-service-card__banner {
  transform: scale(1.035);
}

.marketplace-service-card__visual::after {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, var(--search-color-transparent), var(--search-color-overlay-mid), var(--search-color-panel)),
    linear-gradient(90deg, color-mix(in oklch, var(--search-color-panel) 70%, var(--search-color-transparent)), var(--search-color-transparent));
  content: "";
}

.marketplace-service-card__visual-meta {
  position: absolute;
  left: var(--search-space-3);
  right: var(--search-space-3);
  top: var(--search-space-3);
  z-index: 1;
  gap: var(--search-space-2);

  @apply flex items-start justify-between;
}

.marketplace-service-card__category {
  gap: var(--search-space-1);
  color: var(--search-color-text);
  font-size: var(--search-font-small);
  line-height: var(--search-line-tight);
  text-shadow: 0 var(--search-border) var(--search-space-2) var(--search-color-shadow);

  @apply inline-flex items-center font-semibold;
}

.marketplace-service-card__category svg {
  width: calc(var(--search-fact-icon-size) * 0.58);
  height: calc(var(--search-fact-icon-size) * 0.58);
  color: var(--search-color-accent);
}

.marketplace-service-card__games {
  gap: calc(var(--search-unit) * 0.75);

  @apply flex shrink-0 flex-wrap items-center justify-end;
}

.marketplace-service-card__games span {
  width: calc(var(--search-font-small) * 1.1);
  min-width: calc(var(--search-font-small) * 1.1);
  height: calc(var(--search-font-small) * 1.1);
  color: var(--search-color-accent);
  line-height: 0;
  filter: drop-shadow(0 var(--search-border) var(--search-space-2) var(--search-color-shadow));

  @apply inline-flex items-center justify-center;
}

.marketplace-service-card__games svg {
  width: var(--search-font-small);
  height: var(--search-font-small);
}

.marketplace-service-card__title,
.marketplace-service-card__description {
  margin: 0;
}

.marketplace-service-card__title {
  position: absolute;
  left: var(--search-space-3);
  right: var(--search-space-3);
  bottom: var(--search-space-3);
  z-index: 1;
  max-width: calc(var(--search-unit) * 34);
  color: var(--search-color-text);
  font-size: var(--search-font-card-title);
  line-height: var(--search-line-title);
  overflow-wrap: anywhere;
  text-shadow: 0 var(--search-border) var(--search-space-2) var(--search-color-shadow);

  @apply font-semibold;
}

.marketplace-service-card__content {
  padding: var(--search-space-3);
  gap: var(--search-space-2);
  grid-template-rows: auto minmax(0, 1fr) auto;

  @apply grid;
}

.marketplace-service-card__seller {
  gap: var(--search-space-2);
  min-height: var(--search-hit-size);
  color: var(--search-color-muted);
  font-size: var(--search-font-small);
  line-height: var(--search-line-tight);

  @apply flex items-center font-semibold;
}

.marketplace-service-card__seller span:last-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.marketplace-service-card__seller-icon {
  width: calc(var(--search-hit-size) * 0.8);
  height: calc(var(--search-hit-size) * 0.8);
  border: var(--search-border) solid var(--search-color-panel-line);
  border-radius: var(--search-radius);
  background-color: var(--search-color-panel);
  color: var(--search-color-accent);

  @apply inline-flex shrink-0 items-center justify-center;
}

.marketplace-service-card__seller-icon svg {
  width: calc(var(--search-hit-size) * 0.42);
  height: calc(var(--search-hit-size) * 0.42);
}

.marketplace-service-card__description {
  min-height: calc(var(--search-line-base) * var(--search-font-small) * 3);
  color: var(--search-color-muted);
  font-size: var(--search-font-small);
  line-height: var(--search-line-base);
}

.marketplace-service-card__footer {
  margin-top: var(--search-space-1);
  gap: var(--search-space-2);

  @apply flex items-center justify-between;
}

.marketplace-service-card__price {
  color: var(--search-color-text);
  font-size: calc(var(--search-font-small) * 1.08);
  line-height: var(--search-line-tight);
  text-align: right;
  white-space: nowrap;

  @apply font-semibold;
}
</style>
