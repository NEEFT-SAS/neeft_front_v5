<template>
  <div class="cus-toast-provider">
    <div
      v-for="position in toastPositions"
      :key="position"
      class="cus-toast-provider__region"
      :data-position="position"
    >
      <TransitionGroup name="cus-toast-provider-toast" tag="div" class="cus-toast-provider__list">
        <CustomToast
          v-for="toastItem in byPosition[position]"
          :key="toastItem.id"
          :variant="toastItem.variant"
          :title="toastItem.title"
          :desc="toastItem.desc"
          :icon="toastItem.icon"
          :duration="toastItem.duration"
          :timer="toastItem.timer"
          :closable="toastItem.closable"
          :close-label="toastItem.closeLabel"
          @close="remove(toastItem.id)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toastPositions } from '~/composables/useToast'

const { byPosition, remove } = useToast()
</script>

<style scoped>
.cus-toast-provider {
  position: fixed;
  inset-block: var(--landing-header-height) 0;
  inset-inline: 0;
  z-index: var(--layer-popover);
  pointer-events: none;
}

.cus-toast-provider__region {
  --toast-provider-edge: var(--space-2);
  --toast-provider-safe-edge: max(var(--toast-provider-edge), var(--space-3));
  --toast-provider-width: calc(var(--unit) * 64);
  position: fixed;
  width: min(calc(100% - (var(--toast-provider-edge) * 2)), var(--toast-provider-width));
  pointer-events: none;
}

.cus-toast-provider__region[data-position='top-left'] {
  inset-block-start: calc(var(--landing-header-height) + var(--toast-provider-safe-edge));
  inset-inline-start: var(--toast-provider-edge);
}

.cus-toast-provider__region[data-position='top-right'] {
  inset-block-start: calc(var(--landing-header-height) + var(--toast-provider-safe-edge));
  inset-inline-end: var(--toast-provider-edge);
}

.cus-toast-provider__region[data-position='bottom-left'] {
  inset-block-end: var(--toast-provider-edge);
  inset-inline-start: var(--toast-provider-edge);
}

.cus-toast-provider__region[data-position='bottom-right'] {
  inset-block-end: var(--toast-provider-edge);
  inset-inline-end: var(--toast-provider-edge);
}

.cus-toast-provider__list {
  gap: var(--space-2);
  pointer-events: auto;

  @apply flex flex-col;
}

.cus-toast-provider-toast-enter-active,
.cus-toast-provider-toast-leave-active {
  transition-duration: var(--motion-fast);
  transition-property: opacity, transform;
}

.cus-toast-provider-toast-enter-from,
.cus-toast-provider-toast-leave-to {
  opacity: 0;
  transform: translateY(calc(var(--unit) * -1));
}

.cus-toast-provider__region[data-position^='bottom'] .cus-toast-provider-toast-enter-from,
.cus-toast-provider__region[data-position^='bottom'] .cus-toast-provider-toast-leave-to {
  transform: translateY(var(--unit));
}
</style>
