<template>
  <article class="launch-card">
    <Icon class="launch-card__icon" :name="icon" aria-hidden="true" />
    <h3 class="launch-card__title">
      {{ t(`landing.home.launch.cards.${key}.title`) }}
    </h3>
    <p class="launch-card__text">{{ t(`landing.home.launch.cards.${key}.text`) }}</p>
    <NuxtLink :to="to" class="launch-card__link">
      {{ t(`landing.home.launch.cards.${key}.link`) }}
      <Icon name="lucide:arrow-right" aria-hidden="true" />
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  key: string
  to: string
}

defineProps<Props>()

const { t } = useI18n()
</script>

<style scoped lang="scss">
.launch-card {
  min-height: calc(var(--unit) * 29);
  gap: var(--space-2);
  padding: var(--space-4);
  border: var(--border) solid var(--color-panel-line);
  border-radius: var(--radius);
  background-color: var(--color-surface);

  @apply grid content-start;
}

.launch-card__icon {
  width: var(--space-4);
  height: var(--space-4);
  margin-bottom: var(--space-2);
  color: var(--color-text);
}

.launch-card__title {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-card);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-card);
}

.launch-card__text {
  margin: 0;
  max-width: calc(var(--unit) * 41);
  color: var(--color-subtle);
  font-size: var(--font-lead);
  line-height: var(--line-base);
}

.launch-card__link {
  gap: var(--space-1);
  margin-top: var(--space-1);
  color: var(--color-accent);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);

  @apply inline-flex items-center justify-self-start no-underline;
}

.launch-card__link svg {
  width: var(--space-2);
  height: var(--space-2);
}
</style>
