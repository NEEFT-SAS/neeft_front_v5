<template>
  <div class="marketplace-rating" role="img" :aria-label="ratingLabel">
    <span class="marketplace-rating__stars" aria-hidden="true">
      <Icon
        v-for="star in totalStars"
        :key="star"
        name="lucide:star"
        class="marketplace-rating__star"
        :data-filled="star <= filledStars ? 'true' : 'false'"
      />
    </span>
    <span class="marketplace-rating__score" aria-hidden="true">{{ formattedRating }}</span>
    <span v-if="props.showReviews" class="marketplace-rating__reviews" aria-hidden="true">
      {{ props.reviewCount }} avis
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  rating: { type: Number, required: true },
  reviewCount: { type: Number, default: 0 },
  showReviews: { type: Boolean, default: true }
})

const totalStars = 5
const formattedRating = computed(() => props.rating.toFixed(1).replace('.', ','))
const filledStars = computed(() => Math.max(0, Math.min(totalStars, Math.round(props.rating))))
const ratingLabel = computed(() => {
  const reviewLabel = props.reviewCount > 1 ? 'avis' : 'avis'
  return `Note ${formattedRating.value} sur 5, ${props.reviewCount} ${reviewLabel}`
})
</script>

<style scoped>
.marketplace-rating {
  --marketplace-rating-star: calc(var(--search-unit, var(--unit)) * 1.875);
  --marketplace-rating-gap: calc(var(--search-unit, var(--unit)) * 0.75);
  display: inline-flex;
  align-items: center;
  gap: var(--marketplace-rating-gap);
  min-height: calc(var(--search-unit, var(--unit)) * 3);
  color: var(--search-color-muted, var(--color-muted));
  font-size: var(--search-font-small, calc(var(--unit) * 1.625));
  font-weight: var(--font-weight-semibold);
  line-height: var(--search-line-tight, var(--line-tight));
}

.marketplace-rating__stars {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--search-unit, var(--unit)) * 0.25);
  color: var(--search-color-accent, var(--color-accent));
}

.marketplace-rating__star {
  width: var(--marketplace-rating-star);
  height: var(--marketplace-rating-star);
  fill: var(--search-color-transparent, var(--color-transparent));
  stroke: currentcolor;
}

.marketplace-rating__star :deep(svg) {
  width: 100%;
  height: 100%;
  fill: inherit;
  stroke: currentcolor;
}

.marketplace-rating__star[data-filled='true'] {
  fill: currentcolor;
}

.marketplace-rating__score {
  color: var(--search-color-text, var(--color-text));
}

.marketplace-rating__reviews {
  color: var(--search-color-subtle, var(--app-color-subtle));
}
</style>
