<template>
  <ul class="hero-references" :aria-label="t('landing.home.hero.aria.partners')">
    <li
      v-for="partner in partnerLogos"
      :key="partner.name"
      :class="{ 'hero-references__item--wide': partner.wide }"
    >
      <NuxtImg
        :src="partner.src"
        :alt="partner.alt"
        :width="partner.width"
        :height="partner.height"
        format="webp"
        loading="lazy"
        decoding="async"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
const { t } = useI18n()

const partnerLogos = [
  {
    name: 'dwes',
    alt: 'DWES',
    src: '/logos/partners/partner_dwes.png',
    width: 500,
    height: 500
  },
  {
    name: 'kay0',
    alt: 'Kay0',
    src: '/logos/partners/partner_kay0.png',
    width: 2000,
    height: 2000
  },
  {
    name: 'French Tech',
    alt: 'French Tech',
    src: '/logos/partners/partner_frenchTech.png',
    width: 854,
    height: 459,
    wide: true
  },
  {
    name: 'tkr',
    alt: 'TKR',
    src: '/logos/partners/partner_tkr.png',
    width: 1000,
    height: 1000
  }
]
</script>

<style scoped lang="scss">
.hero-references {
  --reference-min: calc(var(--unit) * 19);
  --reference-logo: calc(var(--unit) * 8);
  --reference-padding: var(--space-2);
  --reference-opacity: 0.9;
  --reference-hover-scale: 1.04;
  --reference-hover-opacity: 1;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--reference-min)), 1fr));
  gap: var(--space-4) var(--space-6);
  margin: var(--space-10) 0 0;
  padding: 0;
  color: var(--color-text);
  list-style: none;
  align-items: center;
}

.hero-references li {
  min-height: calc(var(--unit) * 6);
  padding: var(--reference-padding);
  opacity: var(--reference-opacity);
  transition-duration: var(--motion-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  transition-property: opacity, transform;
}

.hero-references li:hover {
  opacity: var(--reference-hover-opacity);
  transform: scale(var(--reference-hover-scale));
}

.hero-references img {
  width: var(--reference-logo);
  max-width: 100%;
  height: auto;
  max-height: var(--reference-logo);
  object-fit: contain;
}

.hero-references__item--wide img {
  width: auto;
  height: var(--reference-logo);
}

@media (max-width: 42rem) {
  .hero-references {
    --reference-min: calc(var(--unit) * 12);
    --reference-logo: calc(var(--unit) * 6);
  }
}
</style>
