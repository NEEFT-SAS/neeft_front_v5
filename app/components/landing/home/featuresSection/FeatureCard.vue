<template>
  <article class="feature-card">
    <Icon class="feature-card__icon" :name="icon" aria-hidden="true" />
    <h3 class="feature-card__title">
      {{ t(`landing.home.features.cards.${translationKey}.title`) }}
    </h3>
    <p class="feature-card__text">{{ t(`landing.home.features.cards.${translationKey}.text`) }}</p>
  </article>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  translationKey: string
}

defineProps<Props>()

const { t } = useI18n()
</script>

<style scoped lang="scss">
.feature-card {
  --card-height: calc(var(--unit) * 43);

  min-height: auto;
  gap: var(--space-2);
  padding: var(--space-6) var(--space-4);
  border-radius: var(--radius);
  background-color: var(--color-surface);
  text-align: center;

  @apply grid content-center justify-items-center;
}

.feature-card__icon {
  width: var(--space-5);
  height: var(--space-5);
  margin-bottom: var(--space-2);
  color: var(--color-text);
}

.feature-card__title {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-lead);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-title);
}

.feature-card__text {
  margin: 0;
  max-width: calc(var(--unit) * 42);
  color: var(--color-muted);
  font-size: var(--font-lead);
  line-height: var(--line-base);
}

@media (min-width: 58rem) {
  .feature-card {
    min-height: var(--card-height);
    padding: var(--space-8) var(--space-4);
  }
}
</style>
