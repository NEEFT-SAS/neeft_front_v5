<template>
  <CustomModal
    :model-value="modelValue"
    title="Ouvrir un litige"
    :desc="modalDescription"
    icon="lucide:flag"
    theme="app"
    size="sm"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('update:modelValue', false)"
  >
    <div class="marketplace-order-dispute-modal">
      <div v-if="order" class="marketplace-order-dispute-modal__summary">
        <strong>{{ order.serviceTitle }}</strong>
        <span>{{ order.scope }}</span>
      </div>

      <CustomInputText
        v-model="reason"
        label="Raison du litige"
        label-position="inside"
        size="sm"
        :disabled="processing"
        :error-message="reasonError"
      />

      <CustomInputTextarea
        v-model="details"
        label="Details"
        label-position="inside"
        size="sm"
        :rows="5"
        :max-length="2000"
        show-count
        resize="vertical"
        :disabled="processing"
      />
    </div>

    <template #footer>
      <CustomButton
        type="button"
        label="Annuler"
        theme="app"
        variant="ghost"
        color="secondary"
        :disabled="processing"
        @click="emit('update:modelValue', false)"
      />
      <CustomButton
        type="button"
        :label="processing ? 'Ouverture...' : 'Ouvrir le litige'"
        theme="app"
        variant="filled"
        color="primary"
        :disabled="processing || !order"
        @click="confirmDispute"
      />
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import type { MarketplaceOrder } from '~/datas/marketplace/orders'
import type { OpenMarketplaceOrderDisputeInput } from '~/plugins/marketplace-api'

const props = defineProps<{
  modelValue: boolean
  order: MarketplaceOrder | null
  processing?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [input: OpenMarketplaceOrderDisputeInput]
}>()

const reason = ref('')
const details = ref('')
const reasonError = ref('')

const modalDescription = computed(() => props.order
  ? 'Explique rapidement le blocage. Le dossier sera attache a cette commande.'
  : 'Explique rapidement le blocage pour ouvrir un dossier.'
)

watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) return
  reason.value = ''
  details.value = ''
  reasonError.value = ''
})

watch(reason, () => {
  if (reasonError.value) reasonError.value = ''
})

const confirmDispute = () => {
  const normalizedReason = reason.value.trim()
  if (normalizedReason.length < 3) {
    reasonError.value = 'Indique une raison courte.'
    return
  }

  emit('confirm', {
    reason: normalizedReason,
    details: details.value.trim() || undefined,
  })
}
</script>

<style scoped>
.marketplace-order-dispute-modal {
  display: grid;
  gap: 14px;
  width: 100%;
}

.marketplace-order-dispute-modal__summary {
  display: grid;
  gap: 6px;
  padding: 12px;
  border: 1px solid var(--modal-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--modal-surface) 92%, transparent);
}

.marketplace-order-dispute-modal__summary strong {
  color: var(--modal-text);
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.marketplace-order-dispute-modal__summary span {
  color: var(--modal-muted);
  font-size: 0.88rem;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

</style>
