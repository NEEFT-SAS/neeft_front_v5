<template>
  <CustomModal
    :model-value="modelValue"
    title="Proposer un remboursement"
    desc="Explique rapidement pourquoi tu proposes de rembourser cette commande."
    icon="lucide:rotate-ccw"
    theme="app"
    size="sm"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('update:modelValue', false)"
  >
    <div class="marketplace-order-refund-modal">
      <div v-if="order" class="marketplace-order-refund-modal__summary">
        <strong>{{ order.serviceTitle }}</strong>
        <span>{{ order.scope }}</span>
      </div>

      <CustomInputTextarea
        v-model="reason"
        label="Motif"
        label-position="inside"
        size="sm"
        :rows="5"
        :max-length="500"
        show-count
        resize="vertical"
        :disabled="processing"
        :error-message="reasonError"
      />
    </div>

    <template #footer>
      <CustomButton type="button" label="Annuler" theme="app" variant="ghost" color="secondary" :disabled="processing" @click="emit('update:modelValue', false)" />
      <CustomButton type="button" :label="processing ? 'Envoi...' : 'Proposer'" theme="app" variant="filled" color="primary" :disabled="processing || !order" @click="confirmRefund" />
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import type { MarketplaceOrder } from '~/datas/marketplace/orders'
import type { ProposeMarketplaceOrderRefundInput } from '~/plugins/marketplace-api'

const props = defineProps<{
  modelValue: boolean
  order: MarketplaceOrder | null
  processing?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [input: ProposeMarketplaceOrderRefundInput]
}>()

const reason = ref('')
const reasonError = ref('')

watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) return
  reason.value = ''
  reasonError.value = ''
})

watch(reason, () => {
  if (reasonError.value) reasonError.value = ''
})

const confirmRefund = () => {
  const normalizedReason = reason.value.trim()
  if (normalizedReason.length < 3) {
    reasonError.value = 'Indique un motif court.'
    return
  }

  emit('confirm', { reason: normalizedReason })
}
</script>

<style scoped>
.marketplace-order-refund-modal {
  display: grid;
  gap: 14px;
  width: 100%;
}

.marketplace-order-refund-modal__summary {
  display: grid;
  gap: 6px;
  padding: 12px;
  border: 1px solid var(--modal-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--modal-surface) 92%, transparent);
}

.marketplace-order-refund-modal__summary strong {
  color: var(--modal-text);
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.marketplace-order-refund-modal__summary span {
  color: var(--modal-muted);
  font-size: 0.88rem;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

</style>
