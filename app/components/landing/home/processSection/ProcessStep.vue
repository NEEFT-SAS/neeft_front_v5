<template>
  <li class="process-step">
    <Icon class="process-step__icon" :name="icon" aria-hidden="true" />
    <h3 class="process-step__title">
      {{ t(`landing.home.process.steps.${key}.title`) }}
    </h3>
    <p class="process-step__text">{{ t(`landing.home.process.steps.${key}.text`) }}</p>
    <Icon v-if="showArrow" class="process-step__arrow" name="lucide:arrow-right" aria-hidden="true" />
  </li>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  key: string
  showArrow?: boolean
}

defineProps<Props>()

const { t } = useI18n()
</script>

<style scoped lang="scss">
.process-step {
  position: relative;
  display: grid;
  gap: var(--space-2);
  color: var(--color-subtle);
  content-start: true;
}

.process-step__icon {
  width: var(--space-4);
  height: var(--space-4);
  margin-bottom: var(--space-1);
  color: var(--color-text);
}

.process-step__title {
  margin: 0;
  color: var(--color-text);
  font-size: var(--font-card);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-card);
}

.process-step__text {
  margin: 0;
  max-width: calc(var(--unit) * 36);
  color: var(--color-subtle);
  font-size: var(--font-lead);
  line-height: var(--line-base);
}

.process-step__arrow {
  position: absolute;
  top: calc(var(--space-4) + var(--space-2));
  right: calc(var(--space-5) * -1);
  width: var(--space-3);
  height: var(--space-3);
  color: var(--color-subtle);
  display: none;
}

@media (min-width: 64rem) {
  .process-step__arrow {
    display: block;
  }
}
</style>
