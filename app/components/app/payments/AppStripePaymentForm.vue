<template>
  <form class="app-stripe-payment-form" novalidate @submit.prevent="confirmPayment">
    <div v-if="initializing" class="app-stripe-payment-form__state" aria-live="polite">
      Initialisation du paiement...
    </div>

    <div
      :id="paymentElementId"
      class="app-stripe-payment-form__element"
      :data-ready="isReady ? 'true' : 'false'"
    />

    <p v-if="paymentError" class="app-stripe-payment-form__error" role="alert">
      {{ paymentError }}
    </p>

    <CustomButton
      type="submit"
      :label="buttonLabel"
      left-icon="lucide:lock-keyhole"
      theme="app"
      variant="filled"
      color="primary"
      size="lg"
      :disabled="disabled || initializing || processing || !isReady"
    />

    <p class="app-stripe-payment-form__secure">
      Paiement securise par Stripe. Neeft conserve le paiement jusqu'a validation de la prestation.
    </p>
  </form>
</template>

<script setup lang="ts">
import { loadStripe, type Stripe, type StripeElements, type StripePaymentElement } from '@stripe/stripe-js'

const props = withDefaults(defineProps<{
  clientSecret: string
  returnUrl?: string
  submitLabel?: string
  disabled?: boolean
}>(), {
  returnUrl: '',
  submitLabel: 'Payer',
  disabled: false,
})

const emit = defineEmits<{
  succeeded: [paymentIntentId: string]
  error: [message: string]
}>()

const config = useRuntimeConfig()
const generatedId = useId()

const stripe = shallowRef<Stripe | null>(null)
const elements = shallowRef<StripeElements | null>(null)
const paymentElement = shallowRef<StripePaymentElement | null>(null)
const initializing = ref(false)
const processing = ref(false)
const isReady = ref(false)
const paymentError = ref('')

const paymentElementId = computed(() => `stripe-payment-element-${generatedId}`)
const stripePublishableKey = computed(() => String(config.public.stripePublishableKey || config.public.STRIPE_PUBLISHABLE_KEY || ''))
const buttonLabel = computed(() => processing.value ? 'Paiement...' : props.submitLabel)

const cleanupStripe = () => {
  try {
    paymentElement.value?.unmount()
  } catch {
    // Stripe can throw if the element is already unmounted.
  }

  paymentElement.value = null
  elements.value = null
  isReady.value = false
}

const initializeStripe = async () => {
  if (!import.meta.client || !props.clientSecret) {
    return
  }

  initializing.value = true
  paymentError.value = ''
  cleanupStripe()

  try {
    if (!stripePublishableKey.value) {
      throw new Error('La cle publique Stripe est manquante.')
    }

    stripe.value ||= await loadStripe(stripePublishableKey.value)

    if (!stripe.value) {
      throw new Error('Stripe est indisponible.')
    }

    elements.value = stripe.value.elements({
      clientSecret: props.clientSecret,
      appearance: {
        theme: 'night',
        variables: {
          colorPrimary: '#23b7c9',
          colorBackground: '#1f2635',
          colorText: '#ffffff',
          colorDanger: '#fb7185',
          borderRadius: '8px',
          fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        },
      },
    })

    paymentElement.value = elements.value.create('payment', { layout: 'tabs' })

    await nextTick()

    paymentElement.value.mount(`#${paymentElementId.value}`)
    paymentElement.value.on('ready', () => {
      isReady.value = true
    })
    paymentElement.value.on('change', (event) => {
      paymentError.value = event.error?.message || ''
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Impossible de charger Stripe.'
    paymentError.value = message
    emit('error', message)
  } finally {
    initializing.value = false
  }
}

const confirmPayment = async () => {
  if (!stripe.value || !elements.value) {
    paymentError.value = 'Le formulaire Stripe n est pas pret.'
    return
  }

  processing.value = true
  paymentError.value = ''

  try {
    const returnUrl = props.returnUrl || `${window.location.origin}${window.location.pathname}?payment=success`
    const result = await stripe.value.confirmPayment({
      elements: elements.value,
      confirmParams: {
        return_url: returnUrl,
      },
      redirect: 'if_required',
    })

    if (result.error) {
      const message = result.error.message || 'Le paiement a echoue.'
      paymentError.value = message
      emit('error', message)
      return
    }

    const paymentIntentId = result.paymentIntent?.id || ''
    emit('succeeded', paymentIntentId)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Impossible de confirmer le paiement.'
    paymentError.value = message
    emit('error', message)
  } finally {
    processing.value = false
  }
}

watch(() => props.clientSecret, () => {
  void initializeStripe()
}, { immediate: true })

onBeforeUnmount(() => {
  cleanupStripe()
})
</script>

<style scoped>
.app-stripe-payment-form {
  display: grid;
  gap: 14px;
}

.app-stripe-payment-form__element {
  min-height: 116px;
  padding: 12px;
  border: 1px solid var(--modal-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--modal-surface) 92%, var(--modal-border));
}

.app-stripe-payment-form__element[data-ready='false'] {
  display: grid;
  place-items: center;
}

.app-stripe-payment-form__state,
.app-stripe-payment-form__secure {
  margin: 0;
  color: var(--modal-muted);
  font-size: 0.82rem;
  line-height: 1.45;
}

.app-stripe-payment-form__error {
  margin: 0;
  padding: 10px 12px;
  border: 1px solid color-mix(in oklch, var(--color-danger) 52%, var(--modal-border));
  border-radius: 8px;
  color: color-mix(in oklch, var(--color-danger) 72%, var(--modal-text));
  background: color-mix(in oklch, var(--color-danger) 10%, var(--modal-surface));
  font-size: 0.84rem;
  font-weight: 700;
  line-height: 1.4;
}

.app-stripe-payment-form__secure {
  text-align: center;
}
</style>
