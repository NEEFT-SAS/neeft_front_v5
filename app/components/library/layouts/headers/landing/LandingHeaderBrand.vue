<template>
  <NuxtLink class="landing-header-brand" to="/" aria-label="NEEFT">
    <img src="/images/logos/neeft/Logo_NEEFT_FOX.png" alt="" decoding="async">
  </NuxtLink>
</template>

<style scoped lang="scss">
@use '~/assets/scss/mixins/breakpoints' as *;

.landing-header-brand {
  --landing-header-size-brand-mark: calc(var(--landing-header-brand-size) * 0.75);
  gap: var(--space-1);
  min-height: var(--landing-header-hit-size);
  color: var(--landing-color-header-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  justify-self: start;
}

.landing-header-brand img {
  width: var(--landing-header-size-brand-mark);
  height: var(--landing-header-size-brand-mark);
  object-fit: contain;
}

.landing-header-brand:hover {
  color: var(--landing-color-header-strong);
}

@include breakpoint-lg {
  .landing-header-brand {
    --landing-header-size-brand-mark: var(--landing-header-brand-size);
  }
}
</style>
