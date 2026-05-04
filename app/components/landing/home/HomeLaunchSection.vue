<template>
  <section class="landing-home-launch" aria-labelledby="landing-home-launch-title">
    <div class="landing-home-section-inner landing-home-launch__inner">
      <LaunchHeader />

      <ul class="landing-home-launch__cards" :aria-label="t('landing.home.launch.aria.cards')">
        <li v-for="card in launchCards" :key="card.key">
          <LaunchCard :icon="card.icon" :key="card.key" :to="card.to" />
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()

const launchCards = [
  {
    icon: 'lucide:list-checks',
    key: 'player',
    to: '/players'
  },
  {
    icon: 'lucide:code-xml',
    key: 'staff',
    to: '/staff'
  },
  {
    icon: 'lucide:flag',
    key: 'team',
    to: '/teams'
  }
]
</script>

<style scoped lang="scss">
.landing-home-launch {
  --card-min: var(--landing-card-min);
  --content-max: var(--landing-content-max);

  container-name: landing-home-launch;
  container-type: inline-size;
  background-color: var(--color-surface-deep);

  @apply w-full;
}

.landing-home-section-inner {
  width: min(calc(100% - (var(--space-fluid) * 2)), var(--content-max));

  @apply mx-auto grid;
}

.landing-home-launch a:focus-visible,
.landing-home-launch button:focus-visible {
  outline: calc(var(--border) * 3) solid var(--color-accent);
  outline-offset: calc(var(--border) * 4);
}

.landing-home-launch__inner {
  padding: var(--space-14) 0 var(--space-16);
}

.landing-home-launch__cards {
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;

  @apply grid;
}

@container landing-home-launch (max-width: 42rem) {
  .landing-home-launch__inner {
    padding: var(--space-12) 0 var(--space-14);
  }
}

@container landing-home-launch (min-width: 58rem) {
  .landing-home-launch__cards {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--card-min)), 1fr));
  }
}
</style>
