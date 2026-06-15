<template>
  <BaseProfileSection
    title="Avis"
    eyebrow="Confiance"
    surface="plain"
    id="marketplace-service-reviews"
  >
    <div class="marketplace-service-profile-reviews__summary">
      <MarketplaceRating
        :rating="rating"
        :review-count="reviewCount"
      />
      <span>{{ reviewCount }} avis</span>
    </div>

    <p v-if="pending" class="marketplace-service-profile-reviews__state">
      Chargement des avis...
    </p>

    <p v-else-if="error" class="marketplace-service-profile-reviews__state marketplace-service-profile-reviews__state--error">
      Impossible de charger les avis.
    </p>

    <ul v-else-if="reviews.length" class="marketplace-service-profile-reviews">
      <li v-for="review in reviews" :key="review.id">
        <NuxtImg
          class="marketplace-service-profile-reviews__avatar"
          :src="config.profile.getUserAvatarUrl(review.author?.profilePicture)"
          :alt="getAuthorAvatarAlt(review)"
          width="48"
          height="48"
          loading="lazy"
          decoding="async"
        />

        <article class="marketplace-service-profile-reviews__content">
          <header>
            <div>
              <h3>{{ review.author?.username || 'Utilisateur marketplace' }}</h3>
              <time :datetime="review.createdAt">{{ formatReviewDate(review.createdAt) }}</time>
            </div>

            <MarketplaceRating
              :rating="review.rating"
              :review-count="0"
              :show-reviews="false"
            />
          </header>

          <p>{{ review.comment }}</p>
        </article>
      </li>
    </ul>

    <p v-else class="marketplace-service-profile-reviews__state">
      Aucun avis pour ce service pour le moment.
    </p>
  </BaseProfileSection>
</template>

<script setup lang="ts">
import type { MarketplaceServiceReviewPresenter } from '~/plugins/marketplace-api'

const props = defineProps<{
  reviews: MarketplaceServiceReviewPresenter[]
  rating: number
  reviewCount: number
  pending?: boolean
  error?: unknown
}>()

const config = useConfig()

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
})

const formatReviewDate = (date: string) => {
  const parsedDate = new Date(date)
  if (Number.isNaN(parsedDate.getTime())) return ''

  return dateFormatter.format(parsedDate)
}

const getAuthorAvatarAlt = (review: MarketplaceServiceReviewPresenter) => {
  return review.author?.username ? `Avatar de ${review.author.username}` : 'Avatar utilisateur'
}
</script>

<style>
.marketplace-service-profile-reviews__summary {
  display: flex;
  flex-wrap: wrap;
  gap: var(--profile-space-2);
  align-items: center;
  color: var(--profile-color-muted);
  font-size: var(--profile-font-small);
  line-height: var(--profile-line-body);
}

.marketplace-service-profile-reviews__summary > span {
  color: var(--profile-color-subtle);
  font-weight: 700;
}

.marketplace-service-profile-reviews {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}

.marketplace-service-profile-reviews li {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--profile-space-3);
  padding: var(--profile-space-4) 0;
  border-top: var(--profile-border) solid var(--profile-color-border);
}

.marketplace-service-profile-reviews li:first-child {
  padding-top: 0;
  border-top: 0;
}

.marketplace-service-profile-reviews li:last-child {
  padding-bottom: 0;
}

.marketplace-service-profile-reviews__avatar {
  width: calc(var(--profile-unit) * 6);
  height: calc(var(--profile-unit) * 6);
  border-radius: var(--profile-radius);
  background-color: var(--profile-color-panel-strong);
  object-fit: cover;
}

.marketplace-service-profile-reviews__content {
  display: grid;
  gap: var(--profile-space-2);
  min-width: 0;
}

.marketplace-service-profile-reviews__content header {
  display: flex;
  flex-wrap: wrap;
  gap: var(--profile-space-2);
  align-items: start;
  justify-content: space-between;
}

.marketplace-service-profile-reviews__content header > div {
  display: grid;
  gap: var(--profile-space-1);
  min-width: 0;
}

.marketplace-service-profile-reviews__content h3,
.marketplace-service-profile-reviews__content p,
.marketplace-service-profile-reviews__content time,
.marketplace-service-profile-reviews__state {
  margin: 0;
}

.marketplace-service-profile-reviews__content h3 {
  color: var(--profile-color-text);
  font-size: var(--profile-font-body);
  font-weight: 800;
  line-height: var(--profile-line-title);
  overflow-wrap: anywhere;
}

.marketplace-service-profile-reviews__content time {
  color: var(--profile-color-subtle);
  font-size: var(--profile-font-label);
  line-height: var(--profile-line-body);
}

.marketplace-service-profile-reviews__content p,
.marketplace-service-profile-reviews__state {
  color: var(--profile-color-muted);
  font-size: var(--profile-font-body);
  line-height: var(--profile-line-body);
}

.marketplace-service-profile-reviews__content p {
  overflow-wrap: anywhere;
  text-wrap: pretty;
}

.marketplace-service-profile-reviews__state--error {
  color: var(--profile-color-danger);
}

@media (max-width: 40rem) {
  .marketplace-service-profile-reviews li {
    grid-template-columns: 1fr;
  }
}
</style>
