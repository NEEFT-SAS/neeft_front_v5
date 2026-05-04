<template>
  <section class="landing-home-process" aria-labelledby="landing-home-process-title">
    <div class="landing-home-section-inner landing-home-process__inner">
      <div class="landing-home-process__head">
        <ProcessHeader />
      </div>

      <ol class="landing-home-process__steps">
        <ProcessStep
          v-for="(step, index) in integrationSteps"
          :key="step.key"
          :icon="step.icon"
          :show-arrow="index < integrationSteps.length - 1"
        />
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
const integrationSteps = [
  {
    icon: 'lucide:gamepad-2',
    key: 'profile'
  },
  {
    icon: 'lucide:code-xml',
    key: 'visibility'
  },
  {
    icon: 'lucide:monitor-smartphone',
    key: 'action'
  }
]
</script>

<style scoped lang="scss">
.landing-home-process {
  --step-min: calc(var(--unit) * 31);
  --content-max: var(--landing-content-max);

  container-name: landing-home-process;
  container-type: inline-size;
  background-color: var(--color-surface);

  @apply w-full;
}

.landing-home-section-inner {
  width: min(calc(100% - (var(--space-fluid) * 2)), var(--content-max));

  @apply mx-auto grid;
}

.landing-home-process__inner {
  padding: var(--space-12) 0 var(--space-14);
}

.landing-home-process__head {
  gap: var(--space-2);
  margin-bottom: var(--space-12);

  @apply grid;
}

.landing-home-process__steps {
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-6);
  margin: 0;
  padding: 0;
  list-style: none;

  @apply grid;
}

@container landing-home-process (min-width: 64rem) {
  .landing-home-process__steps {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--step-min)), 1fr));
    gap: var(--space-10);
  }
}
</style>
