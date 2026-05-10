<template>
  <article class="profile-recommandation-card">
    <header class="profile-recommandation-card__header">
      <NuxtImg
        class="profile-recommandation-card__avatar"
        :src="recommendation.authorAvatarUrl || '/images/logos/neeft/Logo_NEEFT_FOX.png'"
        :alt="recommendation.authorAvatarAlt || 'Avatar'"
        width="56"
        height="56"
        loading="lazy"
        decoding="async"
      />

      <div class="profile-recommandation-card__identity">
        <h3>{{ recommendation.authorName }}</h3>
        <span>{{ directionLabel }} - {{ recommendation.relationship }}</span>
      </div>
    </header>

    <p>{{ recommendation.content }}</p>

    <CustomInputRating
      :model-value="recommendation.rating || 0"
      :preview-label="`${recommendation.rating || 0} sur 5`"
      aria-label="Note de recommandation"
      size="sm"
      preview
    />
  </article>
</template>

<script setup lang="ts">
const props = defineProps({
  recommendation: {
    type: Object as PropType<any>,
    required: true
  }
})

const directionLabel = computed(() => {
  return props.recommendation.direction === 'given' ? 'Données' : 'Reçues'
})
</script>

<style scoped>
.profile-recommandation-card {
  display: grid;
  align-content: start;
  gap: var(--profile-space-3);
  height: 100%;
  padding: var(--profile-space-3);
  border: var(--profile-border) solid var(--profile-color-border);
  border-radius: var(--profile-radius);
  background-color: var(--profile-color-panel-strong);
}

.profile-recommandation-card__header {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--profile-space-2);
  align-items: center;
}

.profile-recommandation-card__avatar {
  width: calc(var(--profile-unit) * 7);
  height: calc(var(--profile-unit) * 7);
  border: var(--profile-border) solid var(--profile-color-border);
  border-radius: var(--profile-radius);
  background-color: var(--profile-color-panel);
  object-fit: contain;
}

.profile-recommandation-card__identity {
  display: grid;
  gap: var(--profile-space-1);
}

.profile-recommandation-card h3 {
  margin: 0;
  color: var(--profile-color-text);
  font-size: var(--profile-font-body);
  font-weight: var(--font-weight-semibold);
  line-height: var(--profile-line-title);
  overflow-wrap: anywhere;
}

.profile-recommandation-card span {
  color: var(--profile-color-subtle);
  font-size: var(--profile-font-label);
  line-height: var(--profile-line-body);
}

.profile-recommandation-card p {
  margin: 0;
  color: var(--profile-color-muted);
  font-size: var(--profile-font-body);
  line-height: var(--profile-line-body);
}
</style>
