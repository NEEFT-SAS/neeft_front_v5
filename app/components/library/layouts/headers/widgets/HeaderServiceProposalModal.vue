<template>
  <CustomModal
    :model-value="modelValue"
    title="Proposer un service"
    desc="Compose ta fiche avec une presentation claire, des jeux optionnels et des prestations tarifees."
    icon="lucide:store"
    theme="app"
    size="xl"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('update:modelValue', false)"
  >
    <form :id="formId" class="header-action-form" novalidate @submit.prevent="submitForm">
      <section class="header-action-form__section">
        <div class="header-action-form__section-head">
          <h3 class="header-action-form__title">Presentation</h3>
          <p class="header-action-form__hint">
            Donne un nom lisible et explique rapidement ce que tu proposes.
          </p>
        </div>

        <div class="header-action-form__grid">
          <CustomInputText
            v-model="form.name"
            name="serviceName"
            label="Nom"
            placeholder="Coaching performance Valorant"
            :required="true"
            :error-message="errors.name"
          />

          <CustomInputMultiselect
            v-model="selectedGameIds"
            name="serviceGames"
            label="Jeux"
            placeholder="Tous les jeux ou selection specifique"
            :options="gameOptions"
            searchable
          />

          <CustomInputTextarea
            v-model="form.description"
            class="header-action-form__field--wide"
            name="serviceDescription"
            label="Description"
            placeholder="Detaille le resultat attendu, la methode, les prerequis et ce que le client recoit."
            :rows="5"
            :max-length="700"
            :show-count="true"
            :required="true"
            :error-message="errors.description"
          />
        </div>
      </section>

      <section class="header-action-form__section">
        <div class="header-action-form__section-head header-action-form__section-head--inline">
          <div>
            <h3 class="header-action-form__title">Services</h3>
            <p class="header-action-form__hint">
              Decoupe ton offre en prestations simples a comparer.
            </p>
          </div>

          <CustomButton
            type="button"
            label="Ajouter un service"
            theme="app"
            variant="outlined"
            color="secondary"
            @click="addService"
          />
        </div>

        <div class="header-action-form__services">
          <article
            v-for="(service, index) in services"
            :key="service.id"
            class="header-action-form__service-card"
          >
            <div class="header-action-form__service-head">
              <h4 class="header-action-form__service-title">Prestation {{ index + 1 }}</h4>

              <CustomButton
                v-if="services.length > 1"
                type="button"
                label="Retirer"
                theme="app"
                variant="ghost"
                color="secondary"
                @click="removeService(service.id)"
              />
            </div>

            <div class="header-action-form__grid header-action-form__grid--service">
              <CustomInputText
                v-model="service.name"
                :name="`serviceItemName-${service.id}`"
                label="Nom"
                placeholder="Session 1h"
                :required="true"
                :error-message="serviceErrors[index]?.name"
              />

              <CustomInputText
                v-model="service.price"
                :name="`serviceItemPrice-${service.id}`"
                label="Prix"
                placeholder="49 EUR"
                :required="true"
                :error-message="serviceErrors[index]?.price"
              />

              <CustomInputTextarea
                v-model="service.description"
                class="header-action-form__field--wide"
                :name="`serviceItemDescription-${service.id}`"
                label="Description"
                placeholder="Ce qui est inclus, la duree, le livrable ou le deroulement."
                :rows="3"
                :max-length="280"
                :show-count="true"
                :required="true"
                :error-message="serviceErrors[index]?.description"
              />
            </div>
          </article>
        </div>
      </section>

      <section class="header-action-form__section">
        <div class="header-action-form__section-head">
          <h3 class="header-action-form__title">Visuels</h3>
          <p class="header-action-form__hint">
            La banniere installe l'ambiance, les images rassurent sur le contenu.
          </p>
        </div>

        <CustomInputUpload
          v-model="bannerImage"
          label="Banniere"
          description="Image large optionnelle affichee en haut de la fiche service."
          placeholder="Importer une banniere"
          drop-label="Depose une image large"
          change-label="Changer la banniere"
          shape="wide"
          :aspect-ratio="16 / 7"
          :crop="true"
          :crop-on-select="true"
          :crop-output-width="1600"
          :crop-output-height="700"
          :max-size-mb="8"
        />

        <div class="header-action-form__media-grid">
          <CustomInputUpload
            v-for="(_, index) in galleryImages"
            :key="`gallery-${index}`"
            v-model="galleryImages[index]"
            :label="`Image ${index + 1}`"
            description="Image optionnelle."
            placeholder="Importer"
            drop-label="Depose une image"
            change-label="Changer"
            shape="square"
            :aspect-ratio="4 / 3"
            :crop="true"
            :crop-on-select="true"
            :crop-output-width="960"
            :crop-output-height="720"
            :max-size-mb="6"
            :error-message="galleryErrors[index]"
          />
        </div>
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
import type { CreateMarketplaceServiceInput } from '~/plugins/marketplace-api'

type UploadValue = {
  file: File | null
  croppedFile?: File | null
  previewUrl?: string
  croppedPreviewUrl?: string
  crop?: {
    x: number
    y: number
    zoom: number
    aspectRatio?: number
  } | null
}

type ServiceItem = {
  id: string
  name: string
  description: string
  price: string
}

type FormErrors = {
  name: string
  description: string
}

type ServiceItemErrors = Omit<ServiceItem, 'id'>

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const toast = useToast()
const { $marketplaceAPI } = useNuxtApp()
const resourcesStore = useResourcesStore()
const generatedId = useId()
const isSubmitting = ref(false)

const formId = computed(() => `header-service-proposal-form-${generatedId}`)
const submitLabel = computed(() => isSubmitting.value ? 'Envoi...' : 'Envoyer')

let serviceIdSeed = 0

const createServiceItem = (): ServiceItem => ({
  id: `service-${serviceIdSeed++}`,
  name: '',
  description: '',
  price: '',
})

const createServiceErrors = (): ServiceItemErrors => ({
  name: '',
  description: '',
  price: '',
})

const createFormErrors = (): FormErrors => ({
  name: '',
  description: '',
})

const initialForm = () => ({
  name: '',
  description: '',
})

const form = reactive(initialForm())
const errors = reactive(createFormErrors())
const bannerImage = ref<UploadValue | null>(null)
const galleryImages = ref<Array<UploadValue | null>>([null, null, null])
const galleryErrors = ref(['', '', ''])
const selectedGameIds = ref<Array<string | number>>([])
const services = ref<ServiceItem[]>([createServiceItem()])
const serviceErrors = ref<ServiceItemErrors[]>([createServiceErrors()])

const gameOptions = computed(() => {
  return [...(resourcesStore.rscGames || [])]
    .sort((left, right) => String(left.name || '').localeCompare(String(right.name || ''), 'fr-FR'))
    .map(game => ({
      value: game.id,
      label: game.shortName || game.name,
      icon: game.icon || undefined,
    }))
})

const resetForm = () => {
  Object.assign(form, initialForm())
  Object.assign(errors, createFormErrors())
  bannerImage.value = null
  galleryImages.value = [null, null, null]
  galleryErrors.value = ['', '', '']
  selectedGameIds.value = []
  services.value = [createServiceItem()]
  serviceErrors.value = [createServiceErrors()]
}

const addService = () => {
  services.value.push(createServiceItem())
  serviceErrors.value.push(createServiceErrors())
}

const removeService = (serviceId: string) => {
  if (services.value.length <= 1) {
    return
  }

  const serviceIndex = services.value.findIndex((service) => service.id === serviceId)

  if (serviceIndex === -1) {
    return
  }

  services.value.splice(serviceIndex, 1)
  serviceErrors.value.splice(serviceIndex, 1)
}

const validateForm = () => {
  errors.name = form.name.trim().length >= 3 ? '' : 'Nom requis, 3 caracteres minimum.'
  errors.description = form.description.trim().length >= 20 ? '' : 'Description requise, 20 caracteres minimum.'
  galleryErrors.value = ['', '', '']

  serviceErrors.value = services.value.map((service) => ({
    name: service.name.trim().length >= 2 ? '' : 'Nom requis.',
    description: service.description.trim().length >= 10 ? '' : 'Description requise, 10 caracteres minimum.',
    price: parsePrice(service.price) > 0 ? '' : 'Prix numerique requis.',
  }))

  const hasFormErrors = Object.values(errors).some(Boolean)
  const hasGalleryErrors = galleryErrors.value.some(Boolean)
  const hasServiceErrors = serviceErrors.value.some((serviceError) =>
    Object.values(serviceError).some(Boolean),
  )

  return !hasFormErrors && !hasGalleryErrors && !hasServiceErrors
}

const getUploadUrl = (value: UploadValue | null) => {
  return value?.croppedPreviewUrl || value?.previewUrl || ''
}

const parsePrice = (value: string) => {
  const normalizedValue = value.replace(',', '.').replace(/[^\d.]/g, '')
  const price = Number(normalizedValue)
  return Number.isFinite(price) ? price : 0
}

const getSelectedGameIds = () => {
  return selectedGameIds.value
    .map(value => Number(value))
    .filter(value => Number.isInteger(value) && value > 0)
}

const toMarketplaceServicePayload = (): CreateMarketplaceServiceInput => {
  const bannerUrl = getUploadUrl(bannerImage.value)
  const images = galleryImages.value.map(getUploadUrl).filter(Boolean)
  const gameIds = getSelectedGameIds()

  const payload: CreateMarketplaceServiceInput = {
    name: form.name.trim(),
    description: form.description.trim(),
    status: 'PUBLISHED',
    services: services.value.map(service => ({
      name: service.name.trim(),
      description: service.description.trim(),
      price: parsePrice(service.price)
    }))
  }

  if (bannerUrl) payload.bannerUrl = bannerUrl
  if (images.length) payload.images = images
  if (gameIds.length) payload.gameIds = gameIds

  return payload
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const createdService = await $marketplaceAPI.services.create(toMarketplaceServicePayload())
    await refreshNuxtData('marketplace-services')

    toast.add({
      title: 'Service propose',
      desc: 'Ta fiche est publiee sur la marketplace.',
      icon: 'lucide:store',
      variant: 'success',
    })
    emit('update:modelValue', false)
    await navigateTo(`/marketplace/${createdService.slug}`)
  } catch {
    toast.add({
      title: 'Service non envoye',
      desc: 'Impossible de publier ce service pour le moment.',
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

onMounted(() => {
  void resourcesStore.bootstrap()
})
</script>

<style scoped lang="scss">
.header-action-form {
  display: grid;
  gap: 28px;
  min-width: min(760px, calc(100vw - 48px));
}

.header-action-form__section {
  display: grid;
  gap: 16px;
  padding-top: 4px;

  & + & {
    padding-top: 24px;
    border-top: 1px solid var(--modal-border);
  }
}

.header-action-form__section-head {
  display: grid;
  gap: 4px;
}

.header-action-form__section-head--inline {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 16px;
}

.header-action-form__title,
.header-action-form__service-title {
  margin: 0;
  color: var(--modal-text);
  font-weight: 800;
  letter-spacing: 0;
}

.header-action-form__title {
  font-size: 0.98rem;
}

.header-action-form__service-title {
  font-size: 0.92rem;
}

.header-action-form__hint {
  margin: 0;
  color: var(--modal-muted);
  font-size: 0.86rem;
  line-height: 1.45;
}

.header-action-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.header-action-form__grid--service {
  align-items: start;
}

.header-action-form__field--wide {
  grid-column: 1 / -1;
}

.header-action-form__media-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.header-action-form__services {
  display: grid;
  gap: 14px;
}

.header-action-form__service-card {
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--modal-border);
  border-radius: 8px;
  background: color-mix(in srgb, var(--modal-surface) 92%, transparent);
}

.header-action-form__service-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

@media (max-width: 760px) {
  .header-action-form {
    min-width: 0;
  }

  .header-action-form__section-head--inline,
  .header-action-form__grid,
  .header-action-form__media-grid {
    grid-template-columns: 1fr;
  }

  .header-action-form__section-head--inline {
    align-items: stretch;
  }

  .header-action-form__service-head {
    align-items: flex-start;
  }
}
</style>
