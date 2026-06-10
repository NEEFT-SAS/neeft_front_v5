<template>
  <CustomModal
    :model-value="modelValue"
    :title="modalTitle"
    :desc="modalDescription"
    :icon="modalIcon"
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
          :error-message="bannerErrorMessage"
          @change="onBannerImageChange"
        />
        <p
          v-if="getUploadStatusText(bannerUpload)"
          class="header-action-form__upload-state"
          :data-status="bannerUpload.status"
        >
          {{ getUploadStatusText(bannerUpload) }}
        </p>

        <div class="header-action-form__media-grid">
          <div
            v-for="(_, index) in galleryImages"
            :key="`gallery-${index}`"
            class="header-action-form__media-item"
          >
            <CustomInputUpload
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
              :error-message="getGalleryErrorMessage(index)"
              @change="onGalleryImageChange($event, index)"
            />
            <p
              v-if="getUploadStatusText(galleryUploads[index])"
              class="header-action-form__upload-state"
              :data-status="galleryUploads[index]?.status"
            >
              {{ getUploadStatusText(galleryUploads[index]) }}
            </p>
          </div>
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
        :disabled="isSubmitting || hasMediaUploading"
      />
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import type { CreateMarketplaceServiceInput, MarketplaceServicePresenter } from '~/plugins/marketplace-api'

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

type MediaUploadStatus = 'idle' | 'uploading' | 'success' | 'error'

type MediaUploadState = {
  remoteUrl: string
  status: MediaUploadStatus
  error: string
  signature: string
  promise: Promise<string> | null
  runId: number
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
  banner: string
}

type ServiceItemErrors = Omit<ServiceItem, 'id'>

const props = defineProps<{
  modelValue: boolean
  service?: MarketplaceServicePresenter | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: [service: MarketplaceServicePresenter]
}>()

const toast = useToast()
const { $marketplaceAPI } = useNuxtApp()
const { uploadMarketplaceServiceImage, isConfigured } = useFirebaseUpload()
const resourcesStore = useResourcesStore()
const generatedId = useId()
const isSubmitting = ref(false)

const formId = computed(() => `header-service-proposal-form-${generatedId}`)

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
  banner: '',
})

const createMediaUploadState = (): MediaUploadState => ({
  remoteUrl: '',
  status: 'idle',
  error: '',
  signature: '',
  promise: null,
  runId: 0,
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
const bannerUpload = reactive(createMediaUploadState())
const galleryUploads = ref<MediaUploadState[]>([
  createMediaUploadState(),
  createMediaUploadState(),
  createMediaUploadState(),
])
const selectedGameIds = ref<Array<string | number>>([])
const services = ref<ServiceItem[]>([createServiceItem()])
const serviceErrors = ref<ServiceItemErrors[]>([createServiceErrors()])

const isEditMode = computed(() => Boolean(props.service?.id))

const modalTitle = computed(() => isEditMode.value ? 'Modifier le service' : 'Proposer un service')
const modalDescription = computed(() => isEditMode.value
  ? 'Ajuste la fiche, les offres, les jeux et les visuels publies.'
  : 'Compose ta fiche avec une presentation claire, des jeux optionnels et des prestations tarifees.'
)
const modalIcon = computed(() => isEditMode.value ? 'lucide:pencil' : 'lucide:store')

const hasMediaUploading = computed(() => {
  return bannerUpload.status === 'uploading'
    || galleryUploads.value.some(upload => upload.status === 'uploading')
})
const submitLabel = computed(() => {
  if (isSubmitting.value) return isEditMode.value ? 'Mise a jour...' : 'Publication...'
  if (hasMediaUploading.value) return 'Upload en cours...'
  return isEditMode.value ? 'Enregistrer' : 'Envoyer'
})
const bannerErrorMessage = computed(() => errors.banner || bannerUpload.error)

const gameOptions = computed(() => {
  return [...(resourcesStore.rscGames || [])]
    .sort((left, right) => String(left.name || '').localeCompare(String(right.name || ''), 'fr-FR'))
    .map(game => ({
      value: game.id,
      label: game.shortName || game.name,
      icon: game.icon || undefined,
    }))
})

const resetMediaUploadState = (state: MediaUploadState) => {
  state.runId += 1
  state.remoteUrl = ''
  state.status = 'idle'
  state.error = ''
  state.signature = ''
  state.promise = null
}

const createGalleryUploadStates = (count = 3) => Array.from({ length: count }, () => createMediaUploadState())

const isPersistedMediaUrl = (url?: string) => {
  return Boolean(url && !/^(blob:|data:|file:|javascript:)/i.test(url))
}

const createExistingUploadValue = (url?: string | null): UploadValue | null => {
  const previewUrl = typeof url === 'string' ? url.trim() : ''

  if (!isPersistedMediaUrl(previewUrl)) {
    return null
  }

  return {
    file: null,
    croppedFile: null,
    previewUrl,
    croppedPreviewUrl: '',
    crop: null,
  }
}

const getExistingUploadUrl = (value: UploadValue | null) => {
  const previewUrl = value?.croppedPreviewUrl || value?.previewUrl || ''
  return isPersistedMediaUrl(previewUrl) ? previewUrl : ''
}

const resetCreateForm = () => {
  Object.assign(form, initialForm())
  Object.assign(errors, createFormErrors())
  bannerImage.value = null
  galleryImages.value = [null, null, null]
  galleryErrors.value = ['', '', '']
  resetMediaUploadState(bannerUpload)
  galleryUploads.value = createGalleryUploadStates()
  selectedGameIds.value = []
  services.value = [createServiceItem()]
  serviceErrors.value = [createServiceErrors()]
}

const hydrateEditForm = (service: MarketplaceServicePresenter) => {
  Object.assign(form, {
    name: service.name || '',
    description: service.description || '',
  })
  Object.assign(errors, createFormErrors())

  bannerImage.value = createExistingUploadValue(service.bannerUrl)
  resetMediaUploadState(bannerUpload)
  bannerUpload.remoteUrl = getExistingUploadUrl(bannerImage.value)

  const imageUrls = Array.isArray(service.images) ? service.images : []
  const gallerySlotCount = Math.max(3, Math.min(8, imageUrls.length || 3))
  galleryImages.value = Array.from({ length: gallerySlotCount }, (_, index) => createExistingUploadValue(imageUrls[index]))
  galleryErrors.value = Array.from({ length: gallerySlotCount }, () => '')
  galleryUploads.value = createGalleryUploadStates(gallerySlotCount)
  galleryImages.value.forEach((image, index) => {
    const state = galleryUploads.value[index]
    if (state) state.remoteUrl = getExistingUploadUrl(image)
  })

  selectedGameIds.value = (service.rscGames || []).map(game => game.id)
  services.value = (service.services || []).map((serviceLine) => ({
    id: `service-${serviceIdSeed++}`,
    name: serviceLine.name || '',
    description: serviceLine.description || '',
    price: String(serviceLine.price ?? ''),
  }))

  if (!services.value.length) {
    services.value = [createServiceItem()]
  }

  serviceErrors.value = services.value.map(() => createServiceErrors())
}

const resetForm = () => {
  if (props.service) {
    hydrateEditForm(props.service)
    return
  }

  resetCreateForm()
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
  errors.banner = ''
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

const getUploadFile = (value: UploadValue | null) => {
  return value?.croppedFile || value?.file || null
}

const getUploadSignature = (file: File) => {
  return [file.name, file.size, file.lastModified, file.type].join(':')
}

const getUploadStatusText = (state?: MediaUploadState) => {
  if (!state) return ''
  if (state.status === 'uploading') return 'Envoi de l image...'
  if (state.status === 'success') return 'Image prete'
  return ''
}

const getGalleryErrorMessage = (index: number) => {
  return galleryErrors.value[index] || galleryUploads.value[index]?.error || ''
}

const resolveMediaUploadError = (error: unknown) => {
  if (error instanceof Error && error.message) return error.message
  return 'Upload de l image impossible.'
}

const uploadMediaValue = async (
  value: UploadValue | null,
  state: MediaUploadState,
  target: 'banner' | 'gallery',
  index = 0,
) => {
  const file = getUploadFile(value)

  if (!file) {
    const existingUrl = getExistingUploadUrl(value)
    resetMediaUploadState(state)
    state.remoteUrl = existingUrl
    return existingUrl
  }

  const signature = getUploadSignature(file)

  if (state.signature === signature && state.remoteUrl) {
    return state.remoteUrl
  }

  if (state.signature === signature && state.promise) {
    return await state.promise
  }

  const runId = state.runId + 1
  state.runId = runId
  state.signature = signature
  state.status = 'uploading'
  state.error = ''
  state.remoteUrl = ''

  if (!isConfigured.value) {
    const error = new Error('Firebase Storage n est pas configure.')
    state.status = 'error'
    state.error = error.message
    throw error
  }

  const promise = uploadMarketplaceServiceImage({
    file,
    serviceName: form.name || 'service',
    target,
    index,
  })
    .then((url) => {
      if (state.runId === runId) {
        state.remoteUrl = url
        state.status = 'success'
        state.error = ''
        state.promise = null
      }

      return url
    })
    .catch((error: unknown) => {
      if (state.runId === runId) {
        state.remoteUrl = ''
        state.status = 'error'
        state.error = resolveMediaUploadError(error)
        state.promise = null
      }

      throw error
    })

  state.promise = promise
  return await promise
}

const onBannerImageChange = (value: UploadValue | null) => {
  bannerImage.value = value
  void uploadMediaValue(value, bannerUpload, 'banner').catch(() => {})
}

const onGalleryImageChange = (value: UploadValue | null, index: number) => {
  galleryImages.value[index] = value

  const state = galleryUploads.value[index]
  if (!state) return

  void uploadMediaValue(value, state, 'gallery', index).catch(() => {})
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

const uploadServiceMedia = async () => {
  const images: string[] = []
  let bannerUrl = ''

  try {
    bannerUrl = await uploadMediaValue(bannerImage.value, bannerUpload, 'banner')
  } catch (error) {
    errors.banner = resolveMediaUploadError(error)
    throw error
  }

  for (const [index, image] of galleryImages.value.entries()) {
    const state = galleryUploads.value[index]
    if (!state) continue

    try {
      const imageUrl = await uploadMediaValue(image, state, 'gallery', index)
      if (imageUrl) images.push(imageUrl)
    } catch (error) {
      galleryErrors.value[index] = resolveMediaUploadError(error)
      throw error
    }
  }

  return { bannerUrl, images }
}

const toMarketplaceServicePayload = ({ bannerUrl, images }: { bannerUrl: string, images: string[] }): CreateMarketplaceServiceInput => {
  const gameIds = getSelectedGameIds()

  const payload: CreateMarketplaceServiceInput = {
    name: form.name.trim(),
    description: form.description.trim(),
    services: services.value.map(service => ({
      name: service.name.trim(),
      description: service.description.trim(),
      price: parsePrice(service.price)
    }))
  }

  if (!isEditMode.value) payload.status = 'PUBLISHED'
  if (bannerUrl || isEditMode.value) payload.bannerUrl = bannerUrl || null
  if (images.length || isEditMode.value) payload.images = images
  if (gameIds.length || isEditMode.value) payload.gameIds = gameIds

  return payload
}

const getRefreshKeys = (service: MarketplaceServicePresenter) => {
  const keys = ['marketplace-services', 'marketplace-services-mine']
  const currentSlug = props.service?.slug

  if (currentSlug) keys.push(`marketplace-service-${currentSlug}`)
  if (service.slug && service.slug !== currentSlug) keys.push(`marketplace-service-${service.slug}`)

  return keys
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const media = await uploadServiceMedia()
    const payload = toMarketplaceServicePayload(media)
    const savedService = props.service?.id
      ? await $marketplaceAPI.services.update(props.service.id, payload)
      : await $marketplaceAPI.services.create(payload)

    await refreshNuxtData(getRefreshKeys(savedService))

    toast.add({
      title: isEditMode.value ? 'Service modifie' : 'Service propose',
      desc: isEditMode.value ? 'La fiche service est a jour.' : 'Ta fiche est publiee sur la marketplace.',
      icon: isEditMode.value ? 'lucide:pencil' : 'lucide:store',
      variant: 'success',
    })
    emit('saved', savedService)
    emit('update:modelValue', false)

    if (!isEditMode.value) {
      await navigateTo(`/marketplace/${savedService.slug}`)
    }
  } catch {
    toast.add({
      title: isEditMode.value ? 'Service non modifie' : 'Service non envoye',
      desc: isEditMode.value ? 'Impossible de modifier ce service pour le moment.' : 'Impossible de publier ce service pour le moment.',
      icon: 'lucide:circle-alert',
      variant: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}

watch(
  [() => props.modelValue, () => props.service?.id],
  ([isOpen]) => {
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

.header-action-form__media-item {
  display: grid;
  align-content: start;
  gap: 6px;
}

.header-action-form__upload-state {
  margin: -6px 0 0;
  color: var(--modal-muted);
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.35;
}

.header-action-form__upload-state[data-status='success'] {
  color: color-mix(in oklch, var(--color-success) 72%, var(--modal-text));
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
