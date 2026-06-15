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
          <blockquote v-if="review.sellerResponse" class="marketplace-service-profile-reviews__response">
            <strong>Reponse du vendeur</strong>
            <span>{{ review.sellerResponse }}</span>
          </blockquote>
          <div v-if="canEdit(review) || isSeller" class="marketplace-service-profile-reviews__actions">
            <CustomButton v-if="canEdit(review)" label="Modifier" theme="app" variant="ghost" color="secondary" size="sm" @click="editReview(review)" />
            <CustomButton v-if="canEdit(review)" label="Supprimer" theme="app" variant="ghost" color="secondary" size="sm" @click="deleteReview(review)" />
            <CustomButton v-if="isSeller" :label="review.sellerResponse ? 'Modifier la reponse' : 'Repondre'" theme="app" variant="ghost" color="secondary" size="sm" @click="respondToReview(review)" />
          </div>
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
  sellerProfileId?: string
}>()

const emit = defineEmits<{ changed: [] }>()

const config = useConfig()
const sessionStore = useSessionStore()
const { $marketplaceAPI } = useNuxtApp()
const currentProfileId = computed(() => String(sessionStore.me?.profileId || ''))
const isSeller = computed(() => Boolean(currentProfileId.value && currentProfileId.value === props.sellerProfileId))
const canEdit = (review: MarketplaceServiceReviewPresenter) => Boolean(currentProfileId.value && review.author?.id === currentProfileId.value)

const editReview = async (review: MarketplaceServiceReviewPresenter) => {
  const comment = window.prompt('Modifier votre avis', review.comment)?.trim()
  if (!comment || comment === review.comment) return
  await $marketplaceAPI.reviews.update(review.id, { comment })
  emit('changed')
}

const deleteReview = async (review: MarketplaceServiceReviewPresenter) => {
  if (!window.confirm('Supprimer definitivement cet avis ?')) return
  await $marketplaceAPI.reviews.delete(review.id)
  emit('changed')
}

const respondToReview = async (review: MarketplaceServiceReviewPresenter) => {
  const response = window.prompt('Reponse publique du vendeur', review.sellerResponse || '')?.trim()
  if (!response || response === review.sellerResponse) return
  await $marketplaceAPI.reviews.respond(review.id, response)
  emit('changed')
}

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

.marketplace-service-profile-reviews__response {
  display: grid;
  gap: var(--profile-space-1);
  margin: 0;
  padding: var(--profile-space-2);
  border-left: calc(var(--profile-border) * 3) solid var(--profile-color-border);
  color: var(--profile-color-muted);
}

.marketplace-service-profile-reviews__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--profile-space-1);
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
