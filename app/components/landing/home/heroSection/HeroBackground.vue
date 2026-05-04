<template>
  <div class="hero-background">
    <NuxtImg
      class="hero-background__image"
      src="/images/landing/home-crowd.jpg"
      alt=""
      width="1400"
      height="933"
      format="webp"
      preload
      decoding="async"
    />

    <div class="hero-background__overlay-start" />
    <div class="hero-background__overlay-mid" />
    <div class="hero-background__overlay-end" />
    <div class="hero-background__depth" />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.hero-background {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
}

.hero-background__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-background__overlay-start {
  position: absolute;
  inset: 0;
  background-color: color-mix(in oklch, var(--color-bg) 92%, var(--color-transparent));
}

.hero-background__overlay-mid {
  position: absolute;
  inset: 0;
  background-color: color-mix(in oklch, var(--color-bg) 76%, var(--color-transparent));
}

.hero-background__overlay-end {
  position: absolute;
  inset: 0;
  background-color: color-mix(in oklch, var(--color-bg) 86%, var(--color-transparent));
}

.hero-background__depth {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, var(--color-transparent), var(--color-bg));
}
</style>
