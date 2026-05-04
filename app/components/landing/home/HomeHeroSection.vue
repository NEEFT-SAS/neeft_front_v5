<template>
  <section class="landing-home-hero">
    <HeroBackground />

    <div class="landing-home-section-inner landing-home-hero__inner">
      <div class="landing-home-hero__stage">
        <HeroCopy />
        <HeroShowcase />
      </div>

      <HeroReferences />
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.landing-home-hero {
  --viewport-height: 100svh;
  --content-max: var(--landing-content-max);

  container-name: landing-home-hero;
  container-type: inline-size;
  min-height: var(--viewport-height);
  background-color: var(--color-bg);
  isolation: isolate;

  @apply relative grid w-full overflow-hidden;
}

.landing-home-section-inner {
  width: min(calc(100% - (var(--space-fluid) * 2)), var(--content-max));

  @apply mx-auto grid;
}

.landing-home-hero a:focus-visible,
.landing-home-hero button:focus-visible {
  outline: calc(var(--border) * 3) solid var(--color-accent);
  outline-offset: calc(var(--border) * 4);
}

.landing-home-hero__inner {
  z-index: 2;
  min-height: var(--viewport-height);
  padding: calc(var(--landing-header-height) + var(--space-8)) 0 var(--space-10);

  @apply relative content-between;
}

.landing-home-hero__stage {
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-8);

  @apply grid items-center;
}

@container landing-home-hero (max-width: 42rem) {
  .landing-home-hero__inner {
    padding: calc(var(--header-height) + var(--space-6)) 0 var(--space-8);
  }
}

@container landing-home-hero (min-width: 72rem) {
  .landing-home-hero__stage {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(var(--unit) * 58)), 1fr));
  }
}
</style>
