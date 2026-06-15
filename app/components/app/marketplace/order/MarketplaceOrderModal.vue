<template>
  <CustomModal
    :model-value="modelValue"
    :title="modalTitle"
    :desc="modalDescription"
    icon="lucide:shopping-bag"
    theme="app"
    size="lg"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('update:modelValue', false)"
  >
    <div class="marketplace-order-modal" :data-step="currentStep">
      <ol class="marketplace-order-modal__steps" aria-label="Progression de la commande">
        <li :data-active="currentStep === 'details' ? 'true' : 'false'" :data-complete="currentStep === 'payment' ? 'true' : 'false'">
          <span>1</span>
          <strong>Informations</strong>
        </li>
        <li :data-active="currentStep === 'payment' ? 'true' : 'false'">
          <span>2</span>
          <strong>Paiement</strong>
        </li>
      </ol>

      <section class="marketplace-order-modal__summary" aria-label="Resume de la commande">
        <MarketplaceSafeImage
          class="marketplace-order-modal__cover"
          empty-class="marketplace-order-modal__cover--empty"
          :src="config.marketplace.service.getServiceBannerUrl(service.bannerUrl)"
          :alt="`Banniere du service ${service.name}`"
          width="168"
          height="104"
          loading="lazy"
          decoding="async"
        />

        <div class="marketplace-order-modal__summary-copy">
          <p>{{ sellerName }}</p>
          <h3>{{ service.name }}</h3>
          <span>{{ offer.name }}</span>
        </div>

        <dl class="marketplace-order-modal__price" aria-label="Prix">
          <div>
            <dt>Sous-total HT</dt>
            <dd>{{ subtotalLabel }}</dd>
          </div>
          <div>
            <dt>TVA {{ vatPercentLabel }}</dt>
            <dd>{{ vatLabel }}</dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>{{ totalLabel }}</dd>
          </div>
        </dl>
      </section>

      <form
        v-if="currentStep === 'details'"
        :id="detailsFormId"
        class="marketplace-order-modal__details"
        novalidate
        @submit.prevent="preparePayment"
      >
        <CustomInputTextarea
          v-model="form.brief"
          name="orderBrief"
          label="Informations pour le vendeur"
          placeholder="Precise ton besoin, ton contexte, tes disponibilites, ton niveau actuel ou les liens utiles."
          :rows="6"
          :max-length="900"
          :show-count="true"
          :error-message="errors.brief"
        />

        <div class="marketplace-order-modal__notice">
          <strong>Paiement securise</strong>
          <p>Neeft conserve le paiement jusqu'a validation de la prestation. Le vendeur recoit les informations apres la commande.</p>
        </div>
      </form>

      <section v-else class="marketplace-order-modal__payment" aria-label="Paiement Stripe">
        <div class="marketplace-order-modal__payment-head">
          <span aria-hidden="true">
            <Icon name="logos:stripe" />
          </span>
          <div>
            <h3>Paiement par carte</h3>
            <p>{{ totalLabel }} a regler pour confirmer la commande.</p>
          </div>
        </div>

        <div v-if="isPreparingPayment" class="marketplace-order-modal__loading" aria-live="polite">
          Preparation du formulaire Stripe...
        </div>

        <AppStripePaymentForm
          v-else-if="paymentIntent?.clientSecret"
          :client-secret="paymentIntent.clientSecret"
          :return-url="paymentReturnUrl"
          :submit-label="`Payer ${totalLabel}`"
          @succeeded="handlePaymentSucceeded"
          @error="handlePaymentError"
        />

        <div v-else class="marketplace-order-modal__loading marketplace-order-modal__loading--error" role="alert">
          Impossible de charger le paiement Stripe.
        </div>
      </section>
    </div>

    <template #footer>
      <CustomButton
        v-if="currentStep === 'payment'"
        type="button"
        label="Retour"
        theme="app"
        variant="ghost"
        color="secondary"
        :disabled="isPreparingPayment"
        @click="currentStep = 'details'"
      />
      <CustomButton
        v-else
        type="button"
        label="Annuler"
        theme="app"
        variant="ghost"
        color="secondary"
        :disabled="isPreparingPayment"
        @click="emit('update:modelValue', false)"
      />
      <CustomButton
        v-if="currentStep === 'details'"
        type="submit"
        :form="detailsFormId"
        :label="nextLabel"
        right-icon="lucide:arrow-right"
        theme="app"
        variant="filled"
        color="primary"
        :disabled="isPreparingPayment"
      />
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import type { MarketplaceOrderDeadline, MarketplaceOrderObjective, MarketplaceOrderPaymentIntentPresenter, MarketplaceOrderPresenter, MarketplaceServiceLinePresenter, MarketplaceServicePresenter } from '~/plugins/marketplace-api'

type OrderStep = 'details' | 'payment'

type OrderForm = {
  brief: string
}

type OrderErrors = Record<keyof OrderForm, string>

const VAT_RATE = 0.2

const props = defineProps<{
  modelValue: boolean
  service: MarketplaceServicePresenter
  offer: MarketplaceServiceLinePresenter
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const marketplaceToast = useMarketplaceToasts()
const config = useConfig()
const { $marketplaceAPI } = useNuxtApp()
const generatedId = useId()

const currentStep = ref<OrderStep>('details')
const isPreparingPayment = ref(false)
const confirmedOrder = ref<MarketplaceOrderPresenter | null>(null)
const paymentIntent = ref<MarketplaceOrderPaymentIntentPresenter | null>(null)

const form = reactive<OrderForm>({
  brief: '',
})
const errors = reactive<OrderErrors>({
  brief: '',
})

const formatMarketplacePrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

const detailsFormId = computed(() => `marketplace-order-details-form-${generatedId}`)
const modalTitle = computed(() => currentStep.value === 'payment' ? 'Paiement securise' : 'Commander ce service')
const modalDescription = computed(() => currentStep.value === 'payment'
  ? 'Renseigne ta carte pour confirmer la commande.'
  : 'Ajoute les informations utiles si besoin avant de passer au paiement.'
)
const sellerName = computed(() => props.service.seller?.username || 'Vendeur marketplace')
const totalAmount = computed(() => Number(props.offer.price) || 0)
const subtotalAmount = computed(() => totalAmount.value / (1 + VAT_RATE))
const vatAmount = computed(() => totalAmount.value - subtotalAmount.value)
const totalLabel = computed(() => formatMarketplacePrice(totalAmount.value))
const subtotalLabel = computed(() => formatMarketplacePrice(subtotalAmount.value))
const vatLabel = computed(() => formatMarketplacePrice(vatAmount.value))
const vatPercentLabel = computed(() => `${Math.round(VAT_RATE * 100)}%`)
const nextLabel = computed(() => isPreparingPayment.value ? 'Preparation...' : 'Suivant')
const paymentReturnUrl = computed(() => {
  if (!import.meta.client) {
    return ''
  }

  return `${window.location.origin}/marketplace/services/${props.service.slug}?payment=return`
})

const resetForm = () => {
  currentStep.value = 'details'
  isPreparingPayment.value = false
  confirmedOrder.value = null
  paymentIntent.value = null
  form.brief = ''
  errors.brief = ''
}

const validateOrder = () => {
  errors.brief = ''
  return true
}

const buildOrderInput = () => ({
  serviceLineId: props.offer.id,
  brief: form.brief.trim(),
  objective: 'other' as MarketplaceOrderObjective,
  deadline: 'flexible' as MarketplaceOrderDeadline,
  contact: 'Neeft',
  confirmed: true,
})

const buildOrderConfirmationInput = () => {
  const { confirmed: _confirmed, ...input } = buildOrderInput()
  return input
}

const createPaymentIntentIfNeeded = async () => {
  if (paymentIntent.value) {
    return paymentIntent.value
  }

  paymentIntent.value = await $marketplaceAPI.orders.createPaymentIntentForService(props.service.id, buildOrderInput())
  return paymentIntent.value
}

const preparePayment = async () => {
  if (!validateOrder()) {
    return
  }

  isPreparingPayment.value = true

  try {
    await createPaymentIntentIfNeeded()
    currentStep.value = 'payment'
  } catch {
    marketplaceToast.orders.paymentPreparationFailed()
  } finally {
    isPreparingPayment.value = false
  }
}

const handlePaymentSucceeded = async (paymentIntentId: string) => {
  const confirmedPaymentIntentId = paymentIntentId || paymentIntent.value?.id || ''

  if (!confirmedPaymentIntentId) {
    marketplaceToast.orders.paymentFailed('Impossible de confirmer la commande.')
    return
  }

  try {
    confirmedOrder.value = await $marketplaceAPI.orders.confirmPaymentForService({
      paymentIntentId: confirmedPaymentIntentId,
      serviceId: props.service.id,
      ...buildOrderConfirmationInput(),
    })
  } catch {
    marketplaceToast.orders.paymentFailed('Le paiement est confirme par Stripe, mais la commande n a pas pu etre synchronisee.')
    return
  }

  await refreshNuxtData(['marketplace-orders-buyer-list', 'marketplace-orders-seller-list'])

  marketplaceToast.orders.paymentConfirmed()

  emit('update:modelValue', false)

  if (confirmedOrder.value) {
    await navigateTo(`/marketplace/orders/${confirmedOrder.value.id}?payment=success`)
  }
}

const handlePaymentError = (message: string) => {
  marketplaceToast.orders.paymentFailed(message)
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      resetForm()
    }
  },
)
</script>

<style scoped>
.marketplace-order-modal {
  display: grid;
  gap: 20px;
  min-width: min(640px, calc(100vw - 48px));
}

.marketplace-order-modal__steps {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.marketplace-order-modal__steps li {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  padding: 8px 10px;
  border: 1px solid var(--modal-border);
  border-radius: 8px;
  color: var(--modal-muted);
  background: color-mix(in srgb, var(--modal-surface) 84%, transparent);
}

.marketplace-order-modal__steps li[data-active='true'],
.marketplace-order-modal__steps li[data-complete='true'] {
  color: var(--modal-text);
  border-color: color-mix(in oklch, var(--color-accent) 58%, var(--modal-border));
  background: color-mix(in oklch, var(--color-accent) 12%, var(--modal-surface));
}

.marketplace-order-modal__steps span {
  display: inline-grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border-radius: 999px;
  color: var(--modal-text);
  background: color-mix(in srgb, var(--modal-border) 64%, var(--modal-surface));
  font-size: 0.78rem;
  font-weight: 800;
}

.marketplace-order-modal__steps li[data-active='true'] span,
.marketplace-order-modal__steps li[data-complete='true'] span {
  background: var(--color-accent);
}

.marketplace-order-modal__steps strong {
  font-size: 0.86rem;
  font-weight: 800;
  line-height: 1.2;
}

.marketplace-order-modal__summary {
  display: grid;
  grid-template-columns: 168px minmax(0, 1fr) minmax(160px, auto);
  gap: 16px;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--modal-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--modal-surface) 90%, var(--modal-border));
}

.marketplace-order-modal__cover {
  width: 100%;
  aspect-ratio: 21 / 13;
  border-radius: 8px;
  object-fit: cover;
  background: var(--modal-border);
}

.marketplace-order-modal__cover--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--modal-muted);
}

.marketplace-order-modal__cover--empty svg {
  width: 32px;
  height: 32px;
}

.marketplace-order-modal__summary-copy {
  display: grid;
  gap: 4px;
}

.marketplace-order-modal__summary-copy p,
.marketplace-order-modal__summary-copy h3,
.marketplace-order-modal__summary-copy span,
.marketplace-order-modal__price,
.marketplace-order-modal__notice p,
.marketplace-order-modal__payment-head h3,
.marketplace-order-modal__payment-head p {
  margin: 0;
}

.marketplace-order-modal__summary-copy p,
.marketplace-order-modal__summary-copy span {
  color: var(--modal-muted);
  font-size: 0.86rem;
  line-height: 1.35;
}

.marketplace-order-modal__summary-copy h3 {
  color: var(--modal-text);
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.marketplace-order-modal__price {
  display: grid;
  gap: 6px;
}

.marketplace-order-modal__price div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;
  color: var(--modal-muted);
  font-size: 0.84rem;
  line-height: 1.3;
}

.marketplace-order-modal__price div:last-child {
  padding-top: 8px;
  border-top: 1px solid var(--modal-border);
  color: var(--modal-text);
  font-weight: 800;
}

.marketplace-order-modal__price dd {
  margin: 0;
  color: var(--modal-text);
  font-weight: 800;
  white-space: nowrap;
}

.marketplace-order-modal__details,
.marketplace-order-modal__payment {
  display: grid;
  gap: 16px;
}

.marketplace-order-modal__notice {
  display: grid;
  gap: 4px;
  padding: 12px 14px;
  border: 1px solid color-mix(in oklch, var(--color-accent) 36%, var(--modal-border));
  border-radius: 8px;
  background: color-mix(in oklch, var(--color-accent) 8%, var(--modal-surface));
}

.marketplace-order-modal__notice strong {
  color: var(--modal-text);
  font-size: 0.88rem;
  font-weight: 800;
}

.marketplace-order-modal__notice p {
  color: var(--modal-muted);
  font-size: 0.84rem;
  line-height: 1.45;
}

.marketplace-order-modal__payment-head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: center;
}

.marketplace-order-modal__payment-head > span {
  display: inline-grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border: 1px solid var(--modal-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--modal-surface) 88%, transparent);
}

.marketplace-order-modal__payment-head svg {
  width: 28px;
  height: 28px;
}

.marketplace-order-modal__payment-head h3 {
  color: var(--modal-text);
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.25;
}

.marketplace-order-modal__payment-head p {
  color: var(--modal-muted);
  font-size: 0.86rem;
  line-height: 1.45;
}

.marketplace-order-modal__loading {
  padding: 18px;
  border: 1px solid var(--modal-border);
  border-radius: 8px;
  color: var(--modal-muted);
  background: color-mix(in srgb, var(--modal-surface) 92%, transparent);
  font-size: 0.9rem;
  font-weight: 700;
  text-align: center;
}

.marketplace-order-modal__loading--error {
  color: color-mix(in oklch, var(--color-danger) 72%, var(--modal-text));
}

@media (max-width: 760px) {
  .marketplace-order-modal {
    min-width: 0;
  }

  .marketplace-order-modal__summary {
    grid-template-columns: 1fr;
  }

  .marketplace-order-modal__price {
    max-width: none;
  }
}

@media (max-width: 520px) {
  .marketplace-order-modal__steps {
    grid-template-columns: 1fr;
  }
}
</style>
