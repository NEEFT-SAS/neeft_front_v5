<template>
  <NuxtLink class="landing-footer-brand" to="/">
    <img src="/images/logos/neeft/Logo_NEEFT_FOX.png" alt="" loading="lazy" decoding="async">
  </NuxtLink>
</template>

<style scoped lang="scss">
@use '~/assets/scss/mixins/breakpoints' as *;

.landing-footer-brand {
  gap: var(--space-2);
  color: var(--landing-color-footer-text);
  font-size: var(--landing-font-footer-brand);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
  grid-column: 1 / -1;
  display: inline-flex;
  align-items: center;
  justify-self: center;
  text-decoration: none;
}

.landing-footer-brand img {
  width: var(--space-10);
  height: var(--space-10);
  object-fit: contain;
}

.landing-footer-brand:hover {
  color: var(--landing-color-footer-text);
}

@include breakpoint-lg {
  .landing-footer-brand {
    grid-column: auto;
    justify-self: start;
  }

  .landing-footer-brand img {
    width: var(--space-12);
    height: var(--space-12);
  }
}
</style>
