<template>
  <BaseProfileSection
    title="Avis client"
    eyebrow="Evaluation"
    id="marketplace-order-review"
  >
    <article class="marketplace-order-review-widget">
      <header>
        <div class="marketplace-order-review-widget__author">
          <MarketplaceSafeImage
            class="marketplace-order-review-widget__avatar"
            empty-class="marketplace-order-review-widget__avatar--empty"
            :src="config.profile.getUserAvatarUrl(review.author?.profilePicture)"
            :alt="review.author?.username ? `Avatar de ${review.author.username}` : 'Avatar du client'"
            width="44"
            height="44"
          />
          <div>
            <strong>{{ review.author?.username || 'Client marketplace' }}</strong>
            <time :datetime="review.createdAt">{{ formattedDate }}</time>
          </div>
        </div>

        <div class="marketplace-order-review-widget__rating" :aria-label="`Note ${review.rating} sur 5`">
          <Icon
            v-for="star in 5"
            :key="star"
            name="lucide:star"
            :data-active="star <= review.rating ? 'true' : 'false'"
            aria-hidden="true"
          />
        </div>
      </header>

      <p>{{ review.comment }}</p>

      <blockquote v-if="review.sellerResponse">
        <strong>Reponse du vendeur</strong>
        <p>{{ review.sellerResponse }}</p>
      </blockquote>
    </article>
  </BaseProfileSection>
</template>

<script setup lang="ts">
import type { MarketplaceServiceReviewPresenter } from '~/plugins/marketplace-api'

const props = defineProps<{
  review: MarketplaceServiceReviewPresenter
}>()

const config = useConfig()
const formattedDate = computed(() => new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
}).format(new Date(props.review.createdAt)))
</script>

<style scoped>
.marketplace-order-review-widget {
  display: grid;
  gap: var(--orders-space-3);
}

.marketplace-order-review-widget header,
.marketplace-order-review-widget__author {
  display: flex;
  gap: var(--orders-space-2);
  align-items: center;
}

.marketplace-order-review-widget header {
  justify-content: space-between;
}

.marketplace-order-review-widget__avatar {
  width: calc(var(--orders-unit) * 5.5);
  height: calc(var(--orders-unit) * 5.5);
  border-radius: var(--orders-radius-round);
  object-fit: cover;
}

.marketplace-order-review-widget__avatar--empty {
  background: var(--orders-color-line);
}

.marketplace-order-review-widget__author > div {
  display: grid;
  gap: calc(var(--orders-unit) * 0.5);
}

.marketplace-order-review-widget strong {
  color: var(--orders-color-text);
  font-size: var(--orders-font-small);
}

.marketplace-order-review-widget time {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
}

.marketplace-order-review-widget__rating {
  display: flex;
  gap: calc(var(--orders-unit) * 0.5);
  color: var(--orders-color-line);
}

.marketplace-order-review-widget__rating svg {
  width: calc(var(--orders-unit) * 2.25);
  height: calc(var(--orders-unit) * 2.25);
}

.marketplace-order-review-widget__rating svg[data-active='true'] {
  fill: var(--orders-color-accent);
  color: var(--orders-color-accent);
}

.marketplace-order-review-widget > p,
.marketplace-order-review-widget blockquote p {
  margin: 0;
  color: var(--orders-color-muted);
  font-size: var(--orders-font-body);
  line-height: var(--orders-line-body);
  white-space: pre-wrap;
}

.marketplace-order-review-widget blockquote {
  display: grid;
  gap: var(--orders-space-1);
  padding: var(--orders-space-2) var(--orders-space-3);
  margin: 0;
  border-left: calc(var(--orders-border) * 3) solid var(--orders-color-accent);
  background: color-mix(in oklch, var(--orders-color-accent) 7%, var(--orders-color-transparent));
}

@media (max-width: 36rem) {
  .marketplace-order-review-widget header {
    display: grid;
  }
}
</style>
