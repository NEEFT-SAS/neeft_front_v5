<template>
  <BaseProfileSection
    title="Actions"
    eyebrow="Commande"
    compact
    id="marketplace-order-actions"
  >
    <div class="marketplace-order-actions-widget" role="group" aria-label="Actions de commande">
      <CustomButton
        v-if="showPrimaryAction"
        :label="isUpdating ? 'Mise a jour...' : action.ctaLabel"
        :left-icon="action.icon"
        theme="app"
        variant="filled"
        color="primary"
        size="sm"
        :disabled="action.disabled || isUpdating"
        @click="emit('primary', order)"
      />
      <CustomButton
        v-if="showSellerDecisionButtons"
        :label="isUpdating ? 'Mise a jour...' : 'Refuser'"
        left-icon="lucide:x"
        theme="app"
        variant="outlined"
        color="secondary"
        size="sm"
        :disabled="isUpdating"
        @click="emit('reject', order)"
      />
      <CustomButton
        :label="role === 'buyer' ? 'Contacter le vendeur' : 'Contacter le client'"
        left-icon="lucide:message-circle"
        theme="app"
        variant="outlined"
        color="secondary"
        size="sm"
        @click="emit('contact', order)"
      />
      <CustomButton
        v-if="role === 'buyer'"
        :label="isReceiptLoading ? 'Ouverture...' : 'Telecharger le recu'"
        left-icon="lucide:receipt-text"
        theme="app"
        variant="ghost"
        color="secondary"
        size="sm"
        :disabled="isReceiptLoading"
        @click="emit('receipt', order)"
      />
      <CustomButton
        :label="isInvoiceLoading ? 'Ouverture...' : 'Facture'"
        left-icon="lucide:file-text"
        theme="app"
        variant="ghost"
        color="secondary"
        size="sm"
        :disabled="isInvoiceLoading"
        @click="emit('invoice', order)"
      />
      <CustomButton
        v-if="role === 'seller'"
        label="Ajouter une mise a jour"
        left-icon="lucide:send"
        theme="app"
        variant="ghost"
        color="secondary"
        size="sm"
        @click="emit('sellerUpdate', order)"
      />
      <CustomButton
        v-if="showRefundProposalButton"
        :label="order.refundStatus === 'PROPOSED' ? 'Remboursement propose' : 'Proposer un remboursement'"
        left-icon="lucide:rotate-ccw"
        theme="app"
        variant="ghost"
        color="secondary"
        size="sm"
        :disabled="order.refundStatus === 'PROPOSED' || isRefundLoading"
        @click="emit('refund', order)"
      />
      <CustomButton
        v-if="showReviewButton"
        label="Noter le vendeur"
        left-icon="lucide:star"
        theme="app"
        variant="ghost"
        color="secondary"
        size="sm"
        :disabled="isReviewLoading"
        @click="emit('review', order)"
      />
      <CustomButton
        :label="order.disputeOpenedAt ? 'Litige ouvert' : isDisputeLoading ? 'Ouverture...' : 'Ouvrir un litige'"
        left-icon="lucide:flag"
        theme="app"
        variant="outlined"
        color="secondary"
        size="sm"
        :disabled="Boolean(order.disputeOpenedAt) || isClosedOrder || isDisputeLoading"
        @click="emit('dispute', order)"
      />
    </div>
  </BaseProfileSection>
</template>

<script setup lang="ts">
import type { MarketplaceOrder, MarketplaceOrderRole } from '~/datas/marketplace/orders'

const props = defineProps<{
  order: MarketplaceOrder
  role: MarketplaceOrderRole
  actionOrderId: string
  documentActionId?: string
  disputeOrderId?: string
  refundOrderId?: string
  reviewOrderId?: string
}>()

const emit = defineEmits<{
  primary: [order: MarketplaceOrder]
  reject: [order: MarketplaceOrder]
  contact: [order: MarketplaceOrder]
  receipt: [order: MarketplaceOrder]
  invoice: [order: MarketplaceOrder]
  sellerUpdate: [order: MarketplaceOrder]
  dispute: [order: MarketplaceOrder]
  refund: [order: MarketplaceOrder]
  review: [order: MarketplaceOrder]
}>()

const action = computed(() => props.order.nextActions[props.role])
const isUpdating = computed(() => props.actionOrderId === props.order.id)
const isReceiptLoading = computed(() => props.documentActionId === `${props.order.id}:receipt`)
const isInvoiceLoading = computed(() => props.documentActionId === `${props.order.id}:invoice`)
const isDisputeLoading = computed(() => props.disputeOrderId === props.order.id)
const isRefundLoading = computed(() => props.refundOrderId === props.order.id)
const isReviewLoading = computed(() => props.reviewOrderId === props.order.id)
const isClosedOrder = computed(() => ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(String(props.order.apiStatus || '')))
const nextMarketplaceStatus = computed(() => {
  if (props.role === 'seller') {
    if (props.order.apiStatus === 'PENDING') return 'ACCEPTED'
    if (props.order.apiStatus === 'ACCEPTED') return 'IN_PROGRESS'
    if (props.order.apiStatus === 'IN_PROGRESS') return 'DELIVERED'
  }

  if (props.role === 'buyer' && props.order.apiStatus === 'DELIVERED') {
    return 'COMPLETED'
  }

  return null
})

const showPrimaryAction = computed(() => Boolean(nextMarketplaceStatus.value) && !action.value.disabled)
const showSellerDecisionButtons = computed(() => props.role === 'seller' && props.order.apiStatus === 'PENDING' && !action.value.disabled)
const showRefundProposalButton = computed(() => props.role === 'seller' && !isClosedOrder.value && props.order.refundStatus !== 'REFUNDED')
const showReviewButton = computed(() => props.role === 'buyer' && props.order.apiStatus === 'COMPLETED')
</script>

<style scoped>
.marketplace-order-actions-widget {
  display: grid;
  gap: var(--orders-space-2);
}

.marketplace-order-actions-widget :deep(.cus-button) {
  width: 100%;
  justify-content: center;
}
</style>
