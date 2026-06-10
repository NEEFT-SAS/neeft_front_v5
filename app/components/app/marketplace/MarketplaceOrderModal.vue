<template>
  <CustomModal
    :model-value="modelValue"
    title="Commander ce service"
    desc="Envoie une demande claire au vendeur avant demarrage."
    icon="lucide:shopping-bag"
    theme="app"
    size="xl"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('update:modelValue', false)"
  >
    <form :id="formId" class="marketplace-order-modal" novalidate @submit.prevent="submitOrder">
      <section class="marketplace-order-modal__summary" aria-label="Resume de la commande">
        <div class="marketplace-order-modal__service">
          <NuxtImg
            v-if="service.bannerUrl"
            class="marketplace-order-modal__cover"
            :src="service.bannerUrl"
            :alt="`Banniere du service ${service.name}`"
            width="168"
            height="96"
            format="webp"
            loading="lazy"
            decoding="async"
          />
          <div v-else class="marketplace-order-modal__cover marketplace-order-modal__cover--empty" aria-hidden="true">
            <Icon name="lucide:image" />
          </div>

          <div class="marketplace-order-modal__service-copy">
            <p>Marketplace</p>
            <h3>{{ service.name }}</h3>
            <span>{{ sellerName }}</span>
          </div>
        </div>

        <dl class="marketplace-order-modal__facts">
          <div>
            <dt>Offre</dt>
            <dd>{{ offer.name }}</dd>
          </div>
          <div>
            <dt>Prix</dt>
            <dd>{{ orderPriceLabel }}</dd>
          </div>
          <div>
            <dt>Vendeur</dt>
            <dd>{{ sellerName }}</dd>
          </div>
        </dl>
      </section>

      <section class="marketplace-order-modal__section">
        <div class="marketplace-order-modal__section-head">
          <h3>Brief</h3>
          <p>Plus le contexte est precis, plus le vendeur peut repondre vite.</p>
        </div>

        <CustomInputTextarea
          v-model="form.brief"
          name="orderBrief"
          label="Besoin"
          placeholder="Explique ce que tu veux obtenir, ton contexte actuel et ce qui compte le plus pour toi."
          :rows="5"
          :max-length="900"
          :show-count="true"
          :required="true"
          :error-message="errors.brief"
        />

        <div class="marketplace-order-modal__grid">
          <CustomInputSelection
            v-model="form.objective"
            name="orderObjective"
            label="Objectif principal"
            placeholder="Choisir un objectif"
            :options="objectiveOptions"
            :required="true"
            :error-message="errors.objective"
          />

          <CustomInputSelection
            v-model="form.deadline"
            name="orderDeadline"
            label="Delai souhaite"
            placeholder="Choisir un delai"
            :options="deadlineOptions"
            :required="true"
            :error-message="errors.deadline"
          />
        </div>
      </section>

      <section class="marketplace-order-modal__section">
        <div class="marketplace-order-modal__section-head">
          <h3>Elements utiles</h3>
          <p>Ajoute les liens, ressources ou infos de contact qui aideront au cadrage.</p>
        </div>

        <CustomInputTextarea
          v-model="form.assets"
          name="orderAssets"
          label="Liens ou ressources"
          placeholder="Lien Discord, VOD, drive, profil, brief existant..."
          :rows="3"
          :max-length="500"
          :show-count="true"
          :error-message="errors.assets"
        />

        <CustomInputText
          v-model="form.contact"
          name="orderContact"
          label="Contact prefere"
          placeholder="Pseudo Neeft, Discord ou email"
          :required="true"
          :error-message="errors.contact"
        />

        <CustomInputCheckbox
          v-model="form.confirmed"
          name="orderConfirmation"
          label="Je confirme que ma demande est prete a etre envoyee"
          description="Le vendeur pourra accepter, refuser ou demander des precisions avant demarrage."
          :required="true"
          :error-message="errors.confirmed"
        />
      </section>
    </form>

    <template #footer>
      <CustomButton
        type="button"
        label="Annuler"
        theme="app"
        variant="ghost"
        color="secondary"
        :disabled="isSubmitting"
        @click="emit('update:modelValue', false)"
      />
      <CustomButton
        type="submit"
        :form="formId"
        :label="submitLabel"
        theme="app"
        variant="filled"
        color="primary"
        :disabled="isSubmitting"
      />
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import type { MarketplaceOrderDeadline, MarketplaceOrderObjective, MarketplaceServiceLinePresenter, MarketplaceServicePresenter } from '~/plugins/marketplace-api'

type OrderForm = {
  brief: string
  objective: string
  deadline: string
  assets: string
  contact: string
  confirmed: boolean
}

type OrderErrors = Record<keyof OrderForm, string>

const props = defineProps<{
  modelValue: boolean
  service: MarketplaceServicePresenter
  offer: MarketplaceServiceLinePresenter
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const toast = useToast()
const { $marketplaceAPI } = useNuxtApp()
const generatedId = useId()
const isSubmitting = ref(false)

const formatMarketplacePrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(price)
}

const formId = computed(() => `marketplace-order-form-${generatedId}`)
const sellerName = computed(() => props.service.seller?.username || 'Vendeur marketplace')
const orderPriceLabel = computed(() => formatMarketplacePrice(Number(props.offer.price) || 0))
const submitLabel = computed(() => isSubmitting.value ? 'Envoi...' : 'Envoyer la commande')

const objectiveOptions = [
  { value: 'performance', label: 'Ameliorer mes performances' },
  { value: 'deliverable', label: 'Recevoir un livrable' },
  { value: 'team', label: 'Structurer une equipe' },
  { value: 'growth', label: 'Developper ma visibilite' },
  { value: 'other', label: 'Autre besoin' },
]

const deadlineOptions = [
  { value: 'flexible', label: 'Flexible' },
  { value: 'week', label: 'Sous 7 jours' },
  { value: 'two-weeks', label: 'Sous 2 semaines' },
  { value: 'month', label: 'Dans le mois' },
]

const initialForm = (): OrderForm => ({
  brief: '',
  objective: '',
  deadline: '',
  assets: '',
  contact: '',
  confirmed: false,
})

const initialErrors = (): OrderErrors => ({
  brief: '',
  objective: '',
  deadline: '',
  assets: '',
  contact: '',
  confirmed: '',
})

const form = reactive(initialForm())
const errors = reactive(initialErrors())

const resetForm = () => {
  Object.assign(form, initialForm())
  Object.assign(errors, initialErrors())
}

const validateOrder = () => {
  errors.brief = form.brief.trim() ? '' : 'Explique ton besoin.'
  errors.objective = form.objective ? '' : 'Choisis un objectif.'
  errors.deadline = form.deadline ? '' : 'Choisis un delai.'
  errors.assets = ''
  errors.contact = form.contact.trim() ? '' : 'Indique comment te recontacter.'
  errors.confirmed = form.confirmed ? '' : 'Confirmation requise.'

  return !Object.values(errors).some(Boolean)
}

const submitOrder = async () => {
  if (!validateOrder()) {
    return
  }

  isSubmitting.value = true

  try {
    await $marketplaceAPI.orders.create(props.service.id, {
      serviceLineId: props.offer.id,
      brief: form.brief.trim(),
      objective: form.objective as MarketplaceOrderObjective,
      deadline: form.deadline as MarketplaceOrderDeadline,
      assets: form.assets.trim() || undefined,
      contact: form.contact.trim(),
      confirmed: form.confirmed,
    })

    await refreshNuxtData(['marketplace-orders-buyer-list', 'marketplace-orders-seller-list'])

    toast.add({
      title: 'Commande envoyee',
      desc: `${props.service.name} - ${props.offer.name} a ete transmis au vendeur.`,
      icon: 'lucide:shopping-bag',
      variant: 'success',
    })
    emit('update:modelValue', false)
  } catch {
    toast.add({
      title: 'Commande non envoyee',
      desc: 'Impossible de creer la commande pour le moment.',
      icon: 'lucide:circle-alert',
      variant: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
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
  gap: 24px;
  min-width: min(760px, calc(100vw - 48px));
}

.marketplace-order-modal__summary {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(260px, 0.75fr);
  gap: 16px;
  padding: 16px;
  border: 1px solid var(--modal-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--modal-surface) 92%, transparent);
}

.marketplace-order-modal__service {
  display: grid;
  grid-template-columns: 168px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
}

.marketplace-order-modal__cover {
  width: 100%;
  aspect-ratio: 7 / 4;
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

.marketplace-order-modal__service-copy {
  display: grid;
  gap: 4px;
}

.marketplace-order-modal__service-copy p,
.marketplace-order-modal__service-copy h3,
.marketplace-order-modal__service-copy span {
  margin: 0;
}

.marketplace-order-modal__service-copy p,
.marketplace-order-modal__facts dt,
.marketplace-order-modal__section-head p {
  color: var(--modal-muted);
}

.marketplace-order-modal__service-copy p,
.marketplace-order-modal__facts dt {
  font-size: 0.78rem;
  font-weight: 800;
  line-height: 1.2;
  text-transform: uppercase;
}

.marketplace-order-modal__service-copy h3,
.marketplace-order-modal__section-head h3 {
  margin: 0;
  color: var(--modal-text);
  font-weight: 800;
  letter-spacing: 0;
}

.marketplace-order-modal__service-copy h3 {
  font-size: 1rem;
  line-height: 1.25;
}

.marketplace-order-modal__service-copy span {
  color: var(--modal-muted);
  font-size: 0.88rem;
  line-height: 1.4;
}

.marketplace-order-modal__facts {
  display: grid;
  gap: 10px;
  margin: 0;
}

.marketplace-order-modal__facts div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--modal-border);
}

.marketplace-order-modal__facts div:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.marketplace-order-modal__facts dd {
  margin: 0;
  color: var(--modal-text);
  font-weight: 800;
  text-align: right;
}

.marketplace-order-modal__section {
  display: grid;
  gap: 16px;
}

.marketplace-order-modal__section + .marketplace-order-modal__section {
  padding-top: 24px;
  border-top: 1px solid var(--modal-border);
}

.marketplace-order-modal__section-head {
  display: grid;
  gap: 4px;
}

.marketplace-order-modal__section-head h3 {
  font-size: 0.98rem;
}

.marketplace-order-modal__section-head p {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.45;
}

.marketplace-order-modal__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 760px) {
  .marketplace-order-modal {
    min-width: 0;
  }

  .marketplace-order-modal__summary,
  .marketplace-order-modal__service,
  .marketplace-order-modal__grid {
    grid-template-columns: 1fr;
  }

  .marketplace-order-modal__facts dd {
    text-align: left;
  }
}
</style>
