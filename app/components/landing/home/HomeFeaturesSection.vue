<template>
  <section class="landing-home-features" aria-labelledby="landing-home-features-title">
    <div class="landing-home-section-inner landing-home-features__inner">
      <h2 id="landing-home-features-title" class="landing-home-section-title">
        {{ t('landing.home.features.title') }}
      </h2>

      <ul class="landing-home-features__grid" :aria-label="t('landing.home.features.aria.grid')">
        <li v-for="feature in featureCards" :key="feature.translationKey">
          <FeatureCard :icon="feature.icon" :translation-key="feature.translationKey" />
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()

const featureCards = [
  {
    icon: 'lucide:life-buoy',
    translationKey: 'profiles'
  },
  {
    icon: 'lucide:coins',
    translationKey: 'search'
  },
  {
    icon: 'lucide:messages-square',
    translationKey: 'recruitment'
  },
  {
    icon: 'lucide:list',
    translationKey: 'applications'
  },
  {
    icon: 'lucide:crown',
    translationKey: 'messages'
  },
  {
    icon: 'lucide:trending-up',
    translationKey: 'visibility'
  }
]
</script>

<style scoped lang="scss">
.landing-home-features {
  --card-min: var(--landing-card-min);
  --content-max: var(--landing-content-max);

  container-name: landing-home-features;
  container-type: inline-size;
  background-color: var(--color-bg);

  @apply w-full;
}

.landing-home-section-inner {
  width: min(calc(100% - (var(--space-fluid) * 2)), var(--content-max));

  @apply mx-auto grid;
}

.landing-home-section-title {
  margin: 0;
  max-width: var(--landing-copy-max);
  color: var(--color-text);
  font-size: var(--font-section);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-title);
  overflow-wrap: anywhere;
}

.landing-home-features__inner {
  justify-items: center;
  padding: var(--space-14) 0 var(--space-16);
}

.landing-home-features__inner h2 {
  margin-bottom: var(--space-10);
  text-align: center;
}

.landing-home-features__grid {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--card-min)), 1fr));
  gap: var(--space-4);
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;

  @apply grid;
}

@container landing-home-features (max-width: 42rem) {
  .landing-home-features__inner {
    padding: var(--space-12) 0 var(--space-14);
  }

  .landing-home-features__inner h2 {
    margin-bottom: var(--space-6);
    text-align: start;
  }
}
</style>
