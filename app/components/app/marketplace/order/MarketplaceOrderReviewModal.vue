<template>
  <CustomModal
    :model-value="modelValue"
    title="Noter le vendeur"
    desc="Ajoute une note et un retour sur la prestation."
    icon="lucide:star"
    theme="app"
    size="sm"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('update:modelValue', false)"
  >
    <div class="marketplace-order-review-modal">
      <div v-if="order" class="marketplace-order-review-modal__summary">
        <strong>{{ order.seller.name }}</strong>
        <span>{{ order.serviceTitle }}</span>
      </div>

      <CustomInputRating
        v-model="rating"
        name="marketplaceOrderRating"
        label="Note"
        :max="5"
        :disabled="processing"
        :error-message="ratingError"
        required
      />

      <CustomInputTextarea
        v-model="comment"
        label="Avis"
        label-position="inside"
        size="sm"
        :rows="5"
        :max-length="2000"
        show-count
        resize="vertical"
        :disabled="processing"
        :error-message="commentError"
      />
    </div>

    <template #footer>
      <CustomButton type="button" label="Annuler" theme="app" variant="ghost" color="secondary" :disabled="processing" @click="emit('update:modelValue', false)" />
      <CustomButton type="button" :label="processing ? 'Publication...' : 'Publier'" theme="app" variant="filled" color="primary" :disabled="processing || !order" @click="confirmReview" />
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import type { MarketplaceOrder } from '~/datas/marketplace/orders'
import type { CreateMarketplaceServiceReviewInput } from '~/plugins/marketplace-api'

const props = defineProps<{
  modelValue: boolean
  order: MarketplaceOrder | null
  processing?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [input: CreateMarketplaceServiceReviewInput]
}>()

const rating = ref(5)
const comment = ref('')
const ratingError = ref('')
const commentError = ref('')

watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) return
  rating.value = 5
  comment.value = ''
  ratingError.value = ''
  commentError.value = ''
})

watch([rating, comment], () => {
  ratingError.value = ''
  commentError.value = ''
})

const confirmReview = () => {
  const normalizedComment = comment.value.trim()

  if (!Number.isFinite(Number(rating.value)) || rating.value < 1 || rating.value > 5) {
    ratingError.value = 'Choisis une note entre 1 et 5.'
    return
  }

  if (normalizedComment.length < 3) {
    commentError.value = 'Ajoute un avis court.'
    return
  }

  emit('confirm', {
    rating: rating.value,
    comment: normalizedComment,
  })
}
</script>

<style scoped>
.marketplace-order-review-modal {
  display: grid;
  gap: 14px;
  min-width: min(460px, calc(100vw - 48px));
}

.marketplace-order-review-modal__summary {
  display: grid;
  gap: 6px;
  padding: 12px;
  border: 1px solid var(--modal-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--modal-surface) 92%, transparent);
}

.marketplace-order-review-modal__summary strong {
  color: var(--modal-text);
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.marketplace-order-review-modal__summary span {
  color: var(--modal-muted);
  font-size: 0.88rem;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

@media (max-width: 520px) {
  .marketplace-order-review-modal {
    min-width: 0;
  }
}
</style>
