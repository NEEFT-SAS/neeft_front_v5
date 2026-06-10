<template>
  <span class="marketplace-order-status" :data-tone="meta.tone" :data-size="props.size">
    <Icon :name="meta.icon" aria-hidden="true" />
    <span>{{ meta.label }}</span>
  </span>
</template>

<script setup lang="ts">
import { marketplaceOrderStatusMeta, type MarketplaceOrderStatus } from '~/datas/marketplace/orders'

const props = withDefaults(defineProps<{
  status: MarketplaceOrderStatus
  size?: 'md' | 'lg'
}>(), {
  size: 'md'
})

const meta = computed(() => marketplaceOrderStatusMeta[props.status])
</script>

<style scoped>
.marketplace-order-status {
  --status-unit: var(--orders-unit, var(--unit));
  --status-source: var(--orders-color-muted, var(--color-muted));
  --status-text-base: var(--orders-color-text, var(--color-text));
  --status-text: color-mix(in oklch, var(--status-source) 82%, var(--status-text-base));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  min-height: calc(var(--status-unit) * 3);
  gap: calc(var(--status-unit) * 0.75);
  padding: 0;
  color: var(--status-text);
  font-size: calc(var(--status-unit) * 1.5);
  font-weight: 600;
  line-height: var(--line-tight);
}

.marketplace-order-status[data-size='lg'] {
  min-height: calc(var(--status-unit) * 3.5);
  font-size: calc(var(--status-unit) * 1.75);
}

.marketplace-order-status[data-tone='primary'] {
  --status-source: var(--orders-color-accent, var(--color-accent));
}

.marketplace-order-status[data-tone='success'] {
  --status-source: var(--orders-color-success, var(--color-success));
}

.marketplace-order-status[data-tone='warning'] {
  --status-source: var(--orders-color-warning, oklch(78% 0.16 72));
}

.marketplace-order-status[data-tone='danger'] {
  --status-source: var(--orders-color-danger, var(--color-danger));
}

.marketplace-order-status[data-tone='neutral'] {
  --status-source: var(--orders-color-muted, var(--color-muted));
}

.marketplace-order-status svg {
  width: calc(var(--status-unit) * 1.7);
  height: calc(var(--status-unit) * 1.7);
  flex: 0 0 auto;
}
</style>
