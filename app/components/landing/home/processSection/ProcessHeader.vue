<template>
  <div class="process-header">
    <p class="process-header__eyebrow">
      {{ t('landing.home.process.eyebrow') }}
    </p>
    <h2 id="landing-home-process-title" class="process-header__title">
      {{ t('landing.home.process.title') }}
    </h2>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<style scoped lang="scss">
.process-header {
  display: grid;
  gap: var(--space-2);
}

.process-header__eyebrow,
.process-header__title {
  margin: 0;
}

.process-header__eyebrow {
  color: var(--color-accent);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.process-header__title {
  max-width: var(--landing-copy-max);
  color: var(--color-text);
  font-size: var(--font-section);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-title);
  overflow-wrap: anywhere;
}
</style>
