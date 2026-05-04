<template>
  <div class="hero-showcase" :aria-label="t('landing.home.hero.aria.showcase')">
    <div class="hero-showcase__lines" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>

    <NuxtLink class="hero-showcase__play" to="/register" :aria-label="t('landing.home.hero.aria.play')">
      <Icon name="lucide:play" aria-hidden="true" />
    </NuxtLink>

    <div class="hero-showcase__phone" aria-hidden="true">
      <span />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<style scoped lang="scss">
.hero-showcase {
  --showcase-height: clamp(calc(var(--unit) * 34), calc(var(--unit) * 22 + 12vw), calc(var(--unit) * 66));
  --phone-width: calc(var(--unit) * 14);
  --phone-height: calc(var(--unit) * 28);
  --line-size: var(--unit);
  --play-size: calc(var(--unit) * 8);
  --line-position-start: calc(100% / 3 - var(--space-2));
  --line-position-center: calc(100% / 2);
  --line-position-end: calc((100% / 3) * 2 + var(--space-2));
  --line-marker-left: calc(100% / 4 - var(--space-1));
  --center-position: calc(100% / 2);
  --center-shift: -50%;
  --play-hover-scale: 1.04;

  position: relative;
  min-height: var(--showcase-height);
  border: var(--border) solid var(--color-panel-line);
  border-radius: var(--radius);
  background-color: var(--color-panel);
  box-shadow: 0 var(--space-5) var(--space-14) var(--color-shadow);
  overflow: hidden;
}

.hero-showcase__lines {
  position: absolute;
  inset: 0;
}

.hero-showcase__lines span {
  position: absolute;
  right: var(--space-10);
  left: 0;
  height: var(--line-size);
  border-radius: var(--radius-round);
  background: var(--landing-gradient-line);
}

.hero-showcase__lines span:nth-child(1) {
  top: var(--line-position-start);
}

.hero-showcase__lines span:nth-child(2) {
  top: var(--line-position-center);
}

.hero-showcase__lines span:nth-child(3) {
  top: var(--line-position-end);
}

.hero-showcase__lines span:nth-child(1)::after {
  position: absolute;
  top: calc(var(--line-size) * -1);
  left: var(--line-marker-left);
  width: calc(var(--line-size) * 3);
  height: calc(var(--line-size) * 3);
  border: var(--border) solid var(--color-warm);
  border-radius: var(--radius-round);
  background-color: var(--color-text);
  box-shadow: 0 0 var(--space-3) var(--color-warm);
  content: "";
}

.hero-showcase__play {
  position: absolute;
  top: var(--center-position);
  left: var(--center-position);
  width: var(--play-size);
  height: var(--play-size);
  border-radius: var(--radius-round);
  background-color: var(--color-text);
  color: var(--color-bg);
  transform: translate(var(--center-shift), var(--center-shift));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition-duration: var(--motion-fast);
}

.hero-showcase__play svg {
  width: var(--space-3);
  height: var(--space-3);
  transform: translateX(var(--border));
}

.hero-showcase__play:hover {
  transform: translate(var(--center-shift), var(--center-shift)) scale(var(--play-hover-scale));
}

.hero-showcase__phone {
  position: absolute;
  top: var(--center-position);
  right: var(--space-12);
  width: var(--phone-width);
  height: var(--phone-height);
  border: var(--space-1) solid var(--color-shadow);
  border-radius: calc(var(--radius) * 2);
  background-color: var(--color-bg);
  transform: translateY(var(--center-shift));
}

.hero-showcase__phone::before {
  position: absolute;
  top: var(--space-1);
  left: var(--center-position);
  width: calc(var(--unit) * 4);
  height: var(--border);
  border-radius: var(--radius-round);
  background-color: var(--color-text);
  transform: translateX(var(--center-shift));
  content: "";
}

.hero-showcase__phone span {
  position: absolute;
  inset: var(--space-2);
  border-radius: var(--radius);
  background-color: var(--color-bg-soft);
}

@media (max-width: 42rem) {
  .hero-showcase {
    --play-size: calc(var(--unit) * 7);
  }

  .hero-showcase__lines span {
    right: var(--space-5);
  }

  .hero-showcase__phone {
    right: var(--space-4);
    opacity: 0.9;
  }
}
</style>
