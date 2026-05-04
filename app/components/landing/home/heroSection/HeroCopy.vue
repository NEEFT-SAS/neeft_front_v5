<template>
  <div class="hero-copy">
    <p class="hero-copy__eyebrow">
      {{ t('landing.home.hero.eyebrow') }}
    </p>
    <h1 id="landing-home-title" class="hero-copy__title">
      {{ t('landing.home.hero.title') }}
    </h1>
    <p class="hero-copy__lead">
      {{ t('landing.home.hero.lead') }}
    </p>

    <div class="hero-copy__actions" :aria-label="t('landing.home.hero.aria.primaryActions')">
      <CustomLink :label="t('landing.home.hero.actions.primary')" to="/register" theme="landing" variant="filled" color="primary" shape="rectangular" />
      <CustomLink :label="t('landing.home.hero.actions.secondary')" to="/marketing" theme="landing" variant="outlined" color="secondary" shape="rectangular" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<style scoped lang="scss">
.hero-copy {
  max-width: calc(var(--unit) * 70);
  display: grid;
  gap: var(--space-4);
}

.hero-copy__eyebrow,
.hero-copy__title,
.hero-copy__lead {
  margin: 0;
}

.hero-copy__eyebrow {
  color: var(--color-accent);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.hero-copy__title {
  color: var(--color-text);
  font-size: var(--font-display);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
  overflow-wrap: anywhere;
}

.hero-copy__lead {
  max-width: var(--landing-copy-max);
  color: var(--color-muted);
  font-size: var(--font-lead);
  line-height: var(--line-base);
}

.hero-copy__actions {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  align-items: center;
}

@media (max-width: 42rem) {
  .hero-copy__actions {
    align-items: stretch;
    display: grid;
  }
}
</style>
