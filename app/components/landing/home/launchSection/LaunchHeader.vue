<template>
  <div class="launch-header">
    <p class="launch-header__eyebrow">
      {{ t('landing.home.launch.eyebrow') }}
    </p>
    <h2 id="landing-home-launch-title" class="launch-header__title">
      {{ t('landing.home.launch.title') }}
    </h2>
    <p class="launch-header__lead">
      {{ t('landing.home.launch.lead') }}
    </p>

    <div class="launch-header__actions" :aria-label="t('landing.home.launch.aria.actions')">
      <CustomLink :label="t('landing.home.launch.actions.primary')" to="/register" theme="landing" variant="filled" color="primary" shape="rectangular" />
      <CustomLink :label="t('landing.home.launch.actions.secondary')" to="/marketing" theme="landing" variant="outlined" color="secondary" shape="rectangular" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<style scoped lang="scss">
.launch-header {
  justify-items: center;
  gap: var(--space-3);
  max-width: calc(var(--unit) * 78);
  margin: 0 auto var(--space-10);

  @apply grid text-center;
}

.launch-header__eyebrow,
.launch-header__title,
.launch-header__lead {
  margin: 0;
}

.launch-header__title,
.launch-header__lead {
  max-width: calc(var(--unit) * 72);
}

.launch-header__eyebrow {
  color: var(--color-accent);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.launch-header__title {
  color: var(--color-text);
  font-size: var(--font-section);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-title);
  overflow-wrap: anywhere;
}

.launch-header__lead {
  color: var(--color-subtle);
  font-size: var(--font-lead);
  line-height: var(--line-base);
}

.launch-header__actions {
  gap: var(--space-2);
  padding-top: var(--space-2);

  @apply flex flex-wrap items-center justify-center;
}

@media (max-width: 42rem) {
  .launch-header {
    justify-items: start;
    margin-bottom: var(--space-6);

    @apply text-left;
  }

  .launch-header__actions {
    align-items: stretch;
    width: 100%;

    @apply grid justify-stretch;
  }
}
</style>
