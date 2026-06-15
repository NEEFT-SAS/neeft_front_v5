<template>
  <CustomModal
    :model-value="modelValue"
    :title="modalTitle"
    :desc="modalDescription"
    :icon="modalIcon"
    theme="app"
    size="sm"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('update:modelValue', false)"
  >
    <div class="marketplace-order-status-confirm">
      <div v-if="order" class="marketplace-order-status-confirm__summary">
        <span>
          <small>Commande</small>
          <strong>{{ order.serviceTitle }}</strong>
        </span>
        <span>
          <small>Prestation</small>
          <strong>{{ order.scope }}</strong>
        </span>
        <span>
          <small>Montant</small>
          <strong>{{ amountLabel }}</strong>
        </span>
      </div>

      <p class="marketplace-order-status-confirm__notice">
        {{ notice }}
      </p>

      <section v-if="targetStatus === 'COMPLETED'" class="marketplace-order-status-confirm__review">
        <div class="marketplace-order-status-confirm__review-heading">
          <strong>Noter le vendeur</strong>
          <span>La note sera publiee avec la validation de la commande.</span>
        </div>

        <CustomInputRating
          v-model="rating"
          name="marketplaceOrderValidationRating"
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
          :rows="4"
          :max-length="2000"
          show-count
          resize="vertical"
          :disabled="processing"
          :error-message="commentError"
        />
      </section>
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
        :label="processing ? 'Mise a jour...' : confirmLabel"
        theme="app"
        variant="filled"
        color="primary"
        :disabled="processing || !order"
        @click="confirmStatus"
      />
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import { getMarketplaceOrderAmountLabel, type MarketplaceOrder } from '~/datas/marketplace/orders'
import type { CreateMarketplaceServiceReviewInput, MarketplaceOrderStatus } from '~/plugins/marketplace-api'

const props = defineProps<{
  modelValue: boolean
  order: MarketplaceOrder | null
  targetStatus: MarketplaceOrderStatus | null
  processing?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [review?: CreateMarketplaceServiceReviewInput]
}>()

const amountLabel = computed(() => props.order ? getMarketplaceOrderAmountLabel(props.order) : '')
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

const confirmStatus = () => {
  if (props.targetStatus !== 'COMPLETED') {
    emit('confirm')
    return
  }

  const normalizedComment = comment.value.trim()
  if (!Number.isFinite(Number(rating.value)) || rating.value < 1 || rating.value > 5) {
    ratingError.value = 'Choisis une note entre 1 et 5.'
    return
  }

  if (normalizedComment.length < 3) {
    commentError.value = 'Ajoute un avis court.'
    return
  }

  emit('confirm', { rating: rating.value, comment: normalizedComment })
}

const modalTitle = computed(() => {
  if (props.targetStatus === 'REJECTED') return 'Refuser la demande'
  if (props.targetStatus === 'COMPLETED') return 'Valider la livraison'
  if (props.targetStatus === 'DELIVERED') return 'Confirmer la livraison'
  return 'Confirmer l action'
})

const modalDescription = computed(() => {
  if (props.targetStatus === 'REJECTED') return 'Cette action ferme la demande et le client sera informe du refus.'
  if (props.targetStatus === 'COMPLETED') return 'Cette validation cloture la commande.'
  if (props.targetStatus === 'DELIVERED') return 'Le client devra confirmer que le service est bien livre.'
  return 'Confirme la mise a jour de cette commande.'
})

const modalIcon = computed(() => {
  if (props.targetStatus === 'REJECTED') return 'lucide:x-circle'
  if (props.targetStatus === 'COMPLETED') return 'lucide:clipboard-check'
  if (props.targetStatus === 'DELIVERED') return 'lucide:package-check'
  return 'lucide:circle-check'
})

const confirmLabel = computed(() => {
  if (props.targetStatus === 'REJECTED') return 'Refuser la demande'
  if (props.targetStatus === 'COMPLETED') return 'Valider la livraison'
  if (props.targetStatus === 'DELIVERED') return 'Marquer comme livre'
  return 'Confirmer'
})

const notice = computed(() => {
  if (props.targetStatus === 'REJECTED') {
    return 'Refuse uniquement si tu ne peux pas prendre cette commande. La demande sera fermee et ne pourra plus avancer dans le suivi.'
  }

  if (props.targetStatus === 'COMPLETED') {
    return 'Valide seulement si le service correspond a la commande. Une fois validee, la commande passe en terminee et le suivi est archive.'
  }

  if (props.targetStatus === 'DELIVERED') {
    return 'Cette action indique au client que la prestation est livree. La commande restera en attente tant que le client n aura pas valide la livraison.'
  }

  return 'Cette action mettra a jour le statut de la commande.'
})
</script>

<style scoped>
.marketplace-order-status-confirm {
  display: grid;
  gap: 14px;
  width: 100%;
}

.marketplace-order-status-confirm__summary {
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--modal-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--modal-surface) 92%, transparent);
}

.marketplace-order-status-confirm__summary span {
  display: grid;
  gap: 4px;
}

.marketplace-order-status-confirm__summary small {
  color: var(--modal-muted);
  font-size: 0.76rem;
  font-weight: 800;
  line-height: 1.2;
  text-transform: uppercase;
}

.marketplace-order-status-confirm__summary strong {
  color: var(--modal-text);
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.marketplace-order-status-confirm__notice {
  margin: 0;
  color: var(--modal-muted);
  font-size: 0.92rem;
  line-height: 1.5;
}

.marketplace-order-status-confirm__review {
  display: grid;
  gap: 14px;
  min-width: 0;
  padding-top: 14px;
  border-top: 1px solid var(--modal-border);
}

.marketplace-order-status-confirm__review-heading {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.marketplace-order-status-confirm__review-heading strong {
  color: var(--modal-text);
  font-size: 0.95rem;
  line-height: 1.35;
}

.marketplace-order-status-confirm__review-heading span {
  color: var(--modal-muted);
  font-size: 0.88rem;
  line-height: 1.45;
}
</style>
