<template>
  <div
    class="cus-input-upload"
    :data-size="props.size"
    :data-shape="props.shape"
    :data-selected="props.selected ? 'true' : 'false'"
    :data-disabled="props.disabled ? 'true' : 'false'"
    :data-error="hasError ? 'true' : 'false'"
    :data-dragging="dragActive ? 'true' : 'false'"
    :data-has-value="hasValue ? 'true' : 'false'"
    :data-crop-open="showCropEditor ? 'true' : 'false'"
    :style="rootStyle"
  >
    <label v-if="props.label" class="cus-input-upload__label" :for="inputId">
      <span>{{ props.label }}</span>
      <span v-if="props.required" class="cus-input-upload__required" aria-hidden="true">*</span>
    </label>

    <p v-if="props.description" :id="descriptionId" class="cus-input-upload__description">
      {{ props.description }}
    </p>

    <div class="cus-input-upload__control">
      <div class="cus-input-upload__preview" aria-live="polite">
        <img
          v-if="displayPreviewUrl"
          class="cus-input-upload__preview-image"
          :src="displayPreviewUrl"
          :alt="previewAlt"
        >
        <div v-else class="cus-input-upload__placeholder" aria-hidden="true">
          <Icon class="cus-input-upload__placeholder-icon" name="lucide:image-up" />
          <span class="cus-input-upload__placeholder-text">{{ props.placeholder }}</span>
        </div>
      </div>

      <div
        class="cus-input-upload__dropzone"
        role="button"
        :tabindex="props.disabled ? -1 : 0"
        :aria-label="dropzoneAriaLabel"
        :aria-disabled="props.disabled ? 'true' : undefined"
        :aria-invalid="hasError ? 'true' : undefined"
        :aria-describedby="describedBy"
        @click="openFileDialog"
        @keydown.enter.prevent="openFileDialog"
        @keydown.space.prevent="openFileDialog"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
      >
        <input
          :id="inputId"
          ref="fileInput"
          class="cus-input-upload__native"
          type="file"
          :name="props.name || undefined"
          :accept="props.accept"
          :required="props.required"
          :disabled="props.disabled"
          :aria-describedby="describedBy"
          @change="onInputChange"
          @focus="emit('focus', $event)"
          @blur="emit('blur', $event)"
        >

        <Icon class="cus-input-upload__drop-icon" name="lucide:cloud-upload" aria-hidden="true" />
        <span class="cus-input-upload__drop-title">{{ dropTitle }}</span>
        <span class="cus-input-upload__drop-meta">{{ uploadMeta }}</span>
      </div>

      <div v-if="hasValue" class="cus-input-upload__actions">
        <button
          v-if="canCrop"
          class="cus-input-upload__action"
          type="button"
          :disabled="props.disabled"
          @click="toggleCropEditor"
        >
          <Icon class="cus-input-upload__action-icon" name="lucide:scan" aria-hidden="true" />
          <span>{{ cropToggleLabel }}</span>
        </button>
        <button
          class="cus-input-upload__action cus-input-upload__action--danger"
          type="button"
          :disabled="props.disabled"
          @click="removeFile"
        >
          <Icon class="cus-input-upload__action-icon" name="lucide:trash-2" aria-hidden="true" />
          <span>{{ props.removeLabel }}</span>
        </button>
      </div>
    </div>

    <div v-if="showCropEditor" class="cus-input-upload__crop">
      <div class="cus-input-upload__crop-stage">
        <img
          class="cus-input-upload__crop-image"
          :src="sourcePreviewUrl"
          :alt="cropAlt"
          draggable="false"
        >
        <div class="cus-input-upload__crop-overlay" aria-hidden="true"></div>
      </div>

      <div class="cus-input-upload__crop-controls">
        <label class="cus-input-upload__range">
          <span>{{ props.zoomLabel }}</span>
          <input
            v-model.number="cropZoom"
            class="cus-input-upload__range-input"
            type="range"
            :min="MIN_CROP_ZOOM"
            :max="MAX_CROP_ZOOM"
            :step="CROP_ZOOM_STEP"
            :disabled="props.disabled || cropPending"
          >
        </label>
        <label class="cus-input-upload__range">
          <span>{{ props.horizontalLabel }}</span>
          <input
            v-model.number="cropX"
            class="cus-input-upload__range-input"
            type="range"
            :min="MIN_CROP_OFFSET"
            :max="MAX_CROP_OFFSET"
            :step="CROP_OFFSET_STEP"
            :disabled="props.disabled || cropPending"
          >
        </label>
        <label class="cus-input-upload__range">
          <span>{{ props.verticalLabel }}</span>
          <input
            v-model.number="cropY"
            class="cus-input-upload__range-input"
            type="range"
            :min="MIN_CROP_OFFSET"
            :max="MAX_CROP_OFFSET"
            :step="CROP_OFFSET_STEP"
            :disabled="props.disabled || cropPending"
          >
        </label>
      </div>

      <div class="cus-input-upload__crop-actions">
        <button
          class="cus-input-upload__crop-button"
          type="button"
          :disabled="props.disabled || cropPending"
          @click="applyCrop"
        >
          <Icon class="cus-input-upload__action-icon" name="lucide:check" aria-hidden="true" />
          <span>{{ cropPending ? props.cropPendingLabel : props.applyCropLabel }}</span>
        </button>
      </div>
    </div>

    <p
      :id="errorId"
      class="cus-input-upload__error"
      :data-visible="hasError ? 'true' : 'false'"
      :aria-live="hasError ? 'polite' : undefined"
      :aria-hidden="hasError ? undefined : 'true'"
    >
      {{ displayedError }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

type UploadShape = 'square' | 'circle' | 'wide'
type UploadMimeType = 'image/jpeg' | 'image/png' | 'image/webp'

type UploadCrop = {
  x: number
  y: number
  zoom: number
  aspectRatio: number
}

type UploadValue = {
  file: File | null
  croppedFile: File | null
  previewUrl: string
  croppedPreviewUrl: string
  crop: UploadCrop | null
}

type RootStyle = Record<string, string>

const MIN_CROP_ZOOM = 1
const MAX_CROP_ZOOM = 3
const CROP_ZOOM_STEP = 0.01
const MIN_CROP_OFFSET = -100
const MAX_CROP_OFFSET = 100
const CROP_OFFSET_STEP = 1
const BYTES_PER_MEGABYTE = 1024 * 1024
const DEFAULT_CROP_BASE_SIZE = 720
const DEFAULT_ASPECT_RATIO = 1
const IMAGE_FILE_EXTENSIONS = ['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']

const generatedId = useId()

const props = defineProps({
  modelValue: {
    type: Object as PropType<UploadValue | null>,
    default: null
  },
  id: { type: String, default: '' },
  name: { type: String, default: '' },
  label: { type: String, default: '' },
  description: { type: String, default: '' },
  placeholder: { type: String, default: 'Preview' },
  dropLabel: { type: String, default: 'Deposer une image ou parcourir' },
  changeLabel: { type: String, default: 'Remplacer l\'image' },
  accept: { type: String, default: 'image/*' },
  maxSizeMb: {
    type: Number,
    default: 8,
    validator: (value: number) => Number.isFinite(value) && value > 0
  },
  aspectRatio: {
    type: Number,
    default: DEFAULT_ASPECT_RATIO,
    validator: (value: number) => Number.isFinite(value) && value > 0
  },
  crop: { type: Boolean, default: true },
  cropOnSelect: { type: Boolean, default: false },
  cropOutputWidth: {
    type: Number,
    default: 0,
    validator: (value: number) => Number.isFinite(value) && value >= 0
  },
  cropOutputHeight: {
    type: Number,
    default: 0,
    validator: (value: number) => Number.isFinite(value) && value >= 0
  },
  cropMimeType: {
    type: String as PropType<UploadMimeType>,
    default: 'image/webp',
    validator: (value: string) => ['image/jpeg', 'image/png', 'image/webp'].includes(value)
  },
  cropQuality: {
    type: Number,
    default: 0.92,
    validator: (value: number) => Number.isFinite(value) && value > 0 && value <= 1
  },
  cropLabel: { type: String, default: 'Recadrer' },
  closeCropLabel: { type: String, default: 'Fermer le recadrage' },
  applyCropLabel: { type: String, default: 'Appliquer le recadrage' },
  cropPendingLabel: { type: String, default: 'Recadrage en cours' },
  removeLabel: { type: String, default: 'Retirer' },
  zoomLabel: { type: String, default: 'Zoom' },
  horizontalLabel: { type: String, default: 'Horizontal' },
  verticalLabel: { type: String, default: 'Vertical' },
  invalidTypeMessage: { type: String, default: 'Format de fichier non autorise.' },
  invalidSizeMessage: { type: String, default: 'Le fichier depasse la taille autorisee.' },
  cropErrorMessage: { type: String, default: 'Impossible de recadrer cette image.' },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  shape: {
    type: String as PropType<UploadShape>,
    default: 'square',
    validator: (value: string) => ['square', 'circle', 'wide'].includes(value)
  },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
  errorMessage: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'change', 'remove', 'crop', 'error', 'focus', 'blur'])

const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const croppedFile = ref<File | null>(null)
const sourcePreviewUrl = ref('')
const croppedPreviewUrl = ref('')
const externalPreviewUrl = ref('')
const dragActive = ref(false)
const cropOpen = ref(false)
const cropPending = ref(false)
const cropZoom = ref(MIN_CROP_ZOOM)
const cropX = ref(0)
const cropY = ref(0)
const localError = ref('')
const ownedUrls = new Set<string>()
const lastEmittedValue = shallowRef<UploadValue | null>(null)

const inputId = computed(() => props.id || `cus-input-upload-${generatedId}`)
const descriptionId = computed(() => `${inputId.value}-description`)
const errorId = computed(() => `${inputId.value}-error`)
const displayedError = computed(() => props.errorMessage || localError.value)
const hasError = computed(() => displayedError.value.length > 0)
const hasValue = computed(() => Boolean(file.value || sourcePreviewUrl.value || croppedPreviewUrl.value || externalPreviewUrl.value))
const uploadMeta = computed(() => `${props.accept || 'Tous formats'} - max ${props.maxSizeMb} Mo`)
const dropTitle = computed(() => hasValue.value ? props.changeLabel : props.dropLabel)
const dropzoneAriaLabel = computed(() => props.label || props.dropLabel)
const displayPreviewUrl = computed(() => croppedPreviewUrl.value || sourcePreviewUrl.value || externalPreviewUrl.value)
const canCrop = computed(() => props.crop && Boolean(file.value?.type.startsWith('image/') && sourcePreviewUrl.value))
const showCropEditor = computed(() => canCrop.value && cropOpen.value)
const cropToggleLabel = computed(() => cropOpen.value ? props.closeCropLabel : props.cropLabel)
const cropAlt = computed(() => file.value?.name || props.label || props.placeholder)
const previewAlt = computed(() => file.value?.name || props.label || props.placeholder)
const normalizedAspectRatio = computed(() => {
  if (!Number.isFinite(props.aspectRatio) || props.aspectRatio <= 0) return DEFAULT_ASPECT_RATIO
  return props.aspectRatio
})
const rootStyle = computed<RootStyle>(() => ({
  '--upload-aspect-ratio': String(normalizedAspectRatio.value),
  '--upload-crop-zoom': String(cropZoom.value),
  '--upload-crop-x': `${cropX.value / 4}%`,
  '--upload-crop-y': `${cropY.value / 4}%`
}))
const acceptTokens = computed(() => {
  return props.accept
    .split(',')
    .map(token => token)
    .filter(Boolean)
})
const describedBy = computed(() => {
  const ids = []
  if (props.description) ids.push(descriptionId.value)
  if (hasError.value) ids.push(errorId.value)
  return ids.length > 0 ? ids.join(' ') : undefined
})

const revokeOwnedUrl = (url: string) => {
  if (!url || !ownedUrls.has(url)) return
  URL.revokeObjectURL(url)
  ownedUrls.delete(url)
}

const revokeAllOwnedUrls = () => {
  ownedUrls.forEach(url => URL.revokeObjectURL(url))
  ownedUrls.clear()
}

const createPreviewUrl = (nextFile: File) => {
  const url = URL.createObjectURL(nextFile)
  ownedUrls.add(url)
  return url
}

const resetCropControls = () => {
  cropZoom.value = MIN_CROP_ZOOM
  cropX.value = 0
  cropY.value = 0
}

const buildValue = (): UploadValue | null => {
  if (!file.value && !displayPreviewUrl.value) return null

  return {
    file: file.value,
    croppedFile: croppedFile.value,
    previewUrl: sourcePreviewUrl.value || externalPreviewUrl.value,
    croppedPreviewUrl: croppedPreviewUrl.value,
    crop: croppedFile.value
      ? {
          x: cropX.value,
          y: cropY.value,
          zoom: cropZoom.value,
          aspectRatio: normalizedAspectRatio.value
        }
      : null
  }
}

const emitValue = () => {
  const nextValue = buildValue()
  lastEmittedValue.value = nextValue
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
}

const clearLocalState = () => {
  revokeAllOwnedUrls()
  file.value = null
  croppedFile.value = null
  sourcePreviewUrl.value = ''
  croppedPreviewUrl.value = ''
  externalPreviewUrl.value = ''
  cropOpen.value = false
  localError.value = ''
  resetCropControls()
}

const isAccepted = (nextFile: File) => {
  if (!acceptTokens.value.length) return true

  const mimeType = nextFile.type
  const fileName = nextFile.name.toLowerCase()

  return acceptTokens.value.some((token) => {
    const normalizedToken = token.toLowerCase()

    if (normalizedToken.startsWith('.')) {
      return fileName.endsWith(normalizedToken)
    }

    if (normalizedToken.endsWith('/*')) {
      const [group] = normalizedToken.split('/')
      if (!mimeType && group === 'image') {
        return IMAGE_FILE_EXTENSIONS.some(extension => fileName.endsWith(extension))
      }

      return mimeType.startsWith(`${group}/`)
    }

    return mimeType === normalizedToken
  })
}

const validateFile = (nextFile: File) => {
  if (!isAccepted(nextFile)) return props.invalidTypeMessage
  if (nextFile.size > props.maxSizeMb * BYTES_PER_MEGABYTE) return props.invalidSizeMessage
  if (props.crop && !nextFile.type.startsWith('image/')) return props.invalidTypeMessage
  return ''
}

const selectFile = (nextFile: File) => {
  const validationError = validateFile(nextFile)

  if (validationError) {
    localError.value = validationError
    emit('error', validationError)
    return
  }

  clearLocalState()
  file.value = nextFile
  sourcePreviewUrl.value = createPreviewUrl(nextFile)
  cropOpen.value = props.cropOnSelect && canCrop.value
  emitValue()
}

const openFileDialog = () => {
  if (props.disabled) return
  fileInput.value?.click()
}

const onInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const [nextFile] = Array.from(target.files ?? [])

  if (nextFile) {
    selectFile(nextFile)
  }

  target.value = ''
}

const onDragOver = () => {
  if (props.disabled) return
  dragActive.value = true
}

const onDragLeave = () => {
  dragActive.value = false
}

const onDrop = (event: DragEvent) => {
  dragActive.value = false
  if (props.disabled) return

  const [nextFile] = Array.from(event.dataTransfer?.files ?? [])
  if (!nextFile) return

  selectFile(nextFile)
}

const removeFile = () => {
  if (props.disabled) return
  clearLocalState()
  lastEmittedValue.value = null
  emit('update:modelValue', null)
  emit('change', null)
  emit('remove')
}

const toggleCropEditor = () => {
  if (props.disabled || !canCrop.value) return
  cropOpen.value = !cropOpen.value
}

const loadImage = (url: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(props.cropErrorMessage))
    image.src = url
  })
}

const canvasToBlob = (canvas: HTMLCanvasElement, mimeType: UploadMimeType, quality: number) => {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error(props.cropErrorMessage))
        return
      }

      resolve(blob)
    }, mimeType, quality)
  })
}

const resolveExtension = (mimeType: UploadMimeType) => {
  if (mimeType === 'image/png') return 'png'
  if (mimeType === 'image/webp') return 'webp'
  return 'jpg'
}

const buildCroppedFileName = (sourceName: string, mimeType: UploadMimeType) => {
  const baseName = sourceName.replace(/\.[^/.]+$/, '') || 'image'
  return `${baseName}-cropped.${resolveExtension(mimeType)}`
}

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value))
}

const getCropSourceRect = (image: HTMLImageElement) => {
  const ratio = normalizedAspectRatio.value
  const imageRatio = image.naturalWidth / image.naturalHeight
  const baseWidth = imageRatio > ratio ? image.naturalHeight * ratio : image.naturalWidth
  const baseHeight = baseWidth / ratio
  const sourceWidth = baseWidth / cropZoom.value
  const sourceHeight = baseHeight / cropZoom.value
  const maxX = Math.max(0, image.naturalWidth - sourceWidth)
  const maxY = Math.max(0, image.naturalHeight - sourceHeight)
  const sourceX = clamp((maxX / 2) + ((cropX.value / MAX_CROP_OFFSET) * (maxX / 2)), 0, maxX)
  const sourceY = clamp((maxY / 2) + ((cropY.value / MAX_CROP_OFFSET) * (maxY / 2)), 0, maxY)

  return {
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight
  }
}

const resolveCropOutput = () => {
  if (props.cropOutputWidth > 0 && props.cropOutputHeight > 0) {
    return {
      width: props.cropOutputWidth,
      height: props.cropOutputHeight
    }
  }

  if (props.cropOutputWidth > 0) {
    return {
      width: props.cropOutputWidth,
      height: Math.round(props.cropOutputWidth / normalizedAspectRatio.value)
    }
  }

  if (props.cropOutputHeight > 0) {
    return {
      width: Math.round(props.cropOutputHeight * normalizedAspectRatio.value),
      height: props.cropOutputHeight
    }
  }

  return {
    width: DEFAULT_CROP_BASE_SIZE,
    height: Math.round(DEFAULT_CROP_BASE_SIZE / normalizedAspectRatio.value)
  }
}

const applyCrop = async () => {
  if (props.disabled || !file.value || !sourcePreviewUrl.value || cropPending.value) return

  cropPending.value = true
  localError.value = ''

  try {
    const image = await loadImage(sourcePreviewUrl.value)
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error(props.cropErrorMessage)
    }

    const output = resolveCropOutput()
    const cropRect = getCropSourceRect(image)
    canvas.width = output.width
    canvas.height = output.height
    context.drawImage(
      image,
      cropRect.sourceX,
      cropRect.sourceY,
      cropRect.sourceWidth,
      cropRect.sourceHeight,
      0,
      0,
      output.width,
      output.height
    )

    const blob = await canvasToBlob(canvas, props.cropMimeType, props.cropQuality)
    const nextCroppedFile = new File([blob], buildCroppedFileName(file.value.name, props.cropMimeType), {
      type: props.cropMimeType,
      lastModified: Date.now()
    })
    const nextCroppedPreviewUrl = createPreviewUrl(nextCroppedFile)

    revokeOwnedUrl(croppedPreviewUrl.value)
    croppedFile.value = nextCroppedFile
    croppedPreviewUrl.value = nextCroppedPreviewUrl
    cropOpen.value = false
    emitValue()
    emit('crop', buildValue())
  } catch (error) {
    const message = error instanceof Error ? error.message : props.cropErrorMessage
    localError.value = message
    emit('error', message)
  } finally {
    cropPending.value = false
  }
}

watch(
  () => props.modelValue,
  (value) => {
    if (value === lastEmittedValue.value) return

    if (!value) {
      clearLocalState()
      return
    }

    clearLocalState()
    file.value = value.file
    croppedFile.value = value.croppedFile
    sourcePreviewUrl.value = value.file ? value.previewUrl || createPreviewUrl(value.file) : ''
    croppedPreviewUrl.value = value.croppedFile ? value.croppedPreviewUrl || createPreviewUrl(value.croppedFile) : value.croppedPreviewUrl
    externalPreviewUrl.value = value.file ? '' : value.croppedPreviewUrl || value.previewUrl || ''

    if (value.crop) {
      cropX.value = value.crop.x
      cropY.value = value.crop.y
      cropZoom.value = value.crop.zoom
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  revokeAllOwnedUrls()
})
</script>

<style scoped>
.cus-input-upload {
  --upload-preview-sm: calc(var(--unit) * 12);
  --upload-preview-md: calc(var(--unit) * 16);
  --upload-preview-lg: calc(var(--unit) * 20);
  --upload-icon-sm: calc(var(--unit) * 2.25);
  --upload-icon-md: calc(var(--unit) * 2.75);
  --upload-icon-lg: calc(var(--unit) * 3.25);
  --upload-padding-sm: calc(var(--unit) * 1.5);
  --upload-padding-md: calc(var(--unit) * 2);
  --upload-padding-lg: calc(var(--unit) * 3);
  --upload-font-sm: calc(var(--unit) * 1.875);
  --upload-font-md: calc(var(--unit) * 2);
  --upload-font-lg: calc(var(--unit) * 2.125);
  --upload-bg: color-mix(in oklch, var(--color-bg-soft) 88%, var(--color-panel));
  --upload-bg-strong: color-mix(in oklch, var(--color-bg-soft-hover) 84%, var(--color-panel));
  --upload-text: var(--color-text);
  --upload-label: var(--color-muted);
  --upload-description: var(--color-subtle);
  --upload-border: var(--color-panel-line);
  --upload-border-hover: color-mix(in oklch, var(--color-line) 68%, var(--color-accent));
  --upload-placeholder: color-mix(in oklch, var(--color-subtle) 72%, var(--color-transparent));
  --upload-accent: var(--color-accent-strong);
  --upload-accent-soft: color-mix(in oklch, var(--color-accent-strong) 16%, var(--color-transparent));
  --upload-outline: color-mix(in oklch, var(--color-accent-strong) 42%, var(--color-transparent));
  --upload-danger: oklch(66% 0.19 28);
  --upload-danger-soft: color-mix(in oklch, var(--upload-danger) 14%, var(--color-transparent));
  --upload-danger-text: color-mix(in oklch, var(--upload-danger) 80%, var(--landing-color-header-strong));
  --upload-disabled-bg: color-mix(in oklch, var(--color-surface-deep) 72%, var(--color-transparent));
  --upload-disabled-text: color-mix(in oklch, var(--color-text) 42%, var(--color-transparent));
  --upload-disabled-border: color-mix(in oklch, var(--color-line) 68%, var(--color-transparent));
  --upload-current-preview: var(--upload-preview-md);
  --upload-current-icon: var(--upload-icon-md);
  --upload-current-padding: var(--upload-padding-md);
  --upload-current-font: var(--upload-font-md);
  --upload-circle-radius: 50%;
  gap: var(--space-1);

  @apply grid w-full;
}

.cus-input-upload__label {
  gap: calc(var(--unit) * 0.5);
  color: var(--upload-label);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);

  @apply inline-flex w-fit items-center;
}

.cus-input-upload__required {
  color: var(--upload-danger);
}

.cus-input-upload__description {
  margin: 0;
  color: var(--upload-description);
  font-size: var(--font-eyebrow);
  line-height: var(--line-base);
}

.cus-input-upload__control {
  gap: var(--space-2);

  @apply grid;
}

.cus-input-upload__preview,
.cus-input-upload__dropzone,
.cus-input-upload__crop {
  border: var(--border) solid var(--upload-border);
  border-radius: var(--radius);
  background-color: var(--upload-bg);
  transition-duration: var(--motion-fast);
}

.cus-input-upload__preview {
  position: relative;
  aspect-ratio: var(--upload-aspect-ratio);
  min-height: var(--upload-current-preview);
  overflow: hidden;
  color: var(--upload-placeholder);

  @apply flex w-full items-center justify-center transition-colors;
}

.cus-input-upload[data-shape='circle'] .cus-input-upload__preview {
  aspect-ratio: 1;
  max-width: var(--upload-current-preview);
  border-radius: var(--upload-circle-radius);
}

.cus-input-upload[data-shape='wide'] .cus-input-upload__preview {
  aspect-ratio: var(--upload-aspect-ratio);
}

.cus-input-upload__preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;

  @apply block;
}

.cus-input-upload__placeholder {
  gap: var(--space-1);
  padding: var(--upload-current-padding);
  text-align: center;

  @apply grid justify-items-center;
}

.cus-input-upload__placeholder-icon {
  width: var(--upload-current-icon);
  height: var(--upload-current-icon);
}

.cus-input-upload__placeholder-text {
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.cus-input-upload__dropzone {
  gap: calc(var(--unit) * 0.75);
  padding: var(--upload-current-padding);
  border-style: dashed;
  color: var(--upload-text);
  text-align: center;
  outline: calc(var(--border) * 2) solid var(--color-transparent);
  outline-offset: calc(var(--border) * 2);

  @apply grid cursor-pointer justify-items-center transition-colors;
}

.cus-input-upload__native {
  position: absolute;
  width: var(--border);
  height: var(--border);
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;

  @apply p-0;
}

.cus-input-upload__drop-icon {
  width: var(--upload-current-icon);
  height: var(--upload-current-icon);
  color: var(--upload-accent);
}

.cus-input-upload__drop-title {
  color: var(--upload-text);
  font-size: var(--upload-current-font);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
}

.cus-input-upload__drop-meta {
  color: var(--upload-description);
  font-size: var(--font-eyebrow);
  line-height: var(--line-base);
}

.cus-input-upload__actions,
.cus-input-upload__crop-actions {
  gap: var(--space-2);

  @apply flex flex-wrap items-center;
}

.cus-input-upload__action,
.cus-input-upload__crop-button {
  gap: calc(var(--unit) * 0.75);
  min-height: calc(var(--unit) * 4.5);
  padding: 0 var(--space-2);
  border: var(--border) solid var(--upload-border);
  border-radius: var(--radius);
  background-color: var(--upload-bg);
  color: var(--upload-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
  transition-duration: var(--motion-fast);

  @apply inline-flex cursor-pointer items-center justify-center transition-colors;
}

.cus-input-upload__action-icon {
  width: calc(var(--unit) * 2);
  height: calc(var(--unit) * 2);

  @apply shrink-0;
}

.cus-input-upload__action--danger {
  color: var(--upload-danger-text);
}

.cus-input-upload__crop {
  gap: var(--space-3);
  padding: var(--upload-current-padding);

  @apply grid;
}

.cus-input-upload__crop-stage {
  position: relative;
  aspect-ratio: var(--upload-aspect-ratio);
  overflow: hidden;
  border-radius: var(--radius);
  background-color: var(--color-surface-deep);

  @apply w-full;
}

.cus-input-upload__crop-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(var(--upload-crop-x), var(--upload-crop-y)) scale(var(--upload-crop-zoom));
  transition-duration: var(--motion-fast);
  user-select: none;

  @apply block transition-transform;
}

.cus-input-upload__crop-overlay {
  position: absolute;
  inset: 0;
  border: calc(var(--border) * 2) solid var(--upload-accent);
  box-shadow: inset 0 0 0 calc(var(--border) * 2) var(--upload-accent-soft);
  pointer-events: none;
}

.cus-input-upload__crop-controls {
  gap: var(--space-2);

  @apply grid;
}

.cus-input-upload__range {
  gap: var(--space-1);
  color: var(--upload-label);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);

  @apply grid;
}

.cus-input-upload__range-input {
  width: 100%;
  accent-color: var(--upload-accent);
}

.cus-input-upload__error {
  margin: 0;
  min-height: calc(var(--font-eyebrow) * var(--line-base));
  color: var(--upload-danger-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-base);
}

.cus-input-upload__error[data-visible='false'] {
  visibility: hidden;
}

.cus-input-upload[data-size='sm'] {
  --upload-current-preview: var(--upload-preview-sm);
  --upload-current-icon: var(--upload-icon-sm);
  --upload-current-padding: var(--upload-padding-sm);
  --upload-current-font: var(--upload-font-sm);
}

.cus-input-upload[data-size='md'] {
  --upload-current-preview: var(--upload-preview-md);
  --upload-current-icon: var(--upload-icon-md);
  --upload-current-padding: var(--upload-padding-md);
  --upload-current-font: var(--upload-font-md);
}

.cus-input-upload[data-size='lg'] {
  --upload-current-preview: var(--upload-preview-lg);
  --upload-current-icon: var(--upload-icon-lg);
  --upload-current-padding: var(--upload-padding-lg);
  --upload-current-font: var(--upload-font-lg);
}

.cus-input-upload:not([data-disabled='true']):hover .cus-input-upload__preview,
.cus-input-upload:not([data-disabled='true']):hover .cus-input-upload__dropzone,
.cus-input-upload:not([data-disabled='true']):hover .cus-input-upload__crop {
  border-color: var(--upload-border-hover);
}

.cus-input-upload:not([data-disabled='true']) .cus-input-upload__dropzone:focus-visible,
.cus-input-upload:not([data-disabled='true'])[data-selected='true'] .cus-input-upload__dropzone,
.cus-input-upload:not([data-disabled='true'])[data-dragging='true'] .cus-input-upload__dropzone {
  border-color: var(--upload-accent);
  outline-color: var(--upload-outline);
  background-color: var(--upload-bg-strong);
}

.cus-input-upload:not([data-disabled='true'])[data-error='true'] .cus-input-upload__label {
  color: var(--upload-danger-text);
}

.cus-input-upload:not([data-disabled='true'])[data-error='true'] .cus-input-upload__dropzone,
.cus-input-upload:not([data-disabled='true'])[data-error='true'] .cus-input-upload__preview {
  border-color: var(--upload-danger);
  outline-color: var(--upload-danger-soft);
  background-color: color-mix(in oklch, var(--upload-danger) 10%, var(--upload-bg));
}

.cus-input-upload__action:hover,
.cus-input-upload__crop-button:hover {
  border-color: var(--upload-border-hover);
  background-color: var(--upload-bg-strong);
}

.cus-input-upload__action--danger:hover {
  border-color: var(--upload-danger);
  background-color: var(--upload-danger-soft);
}

.cus-input-upload__action:focus-visible,
.cus-input-upload__crop-button:focus-visible {
  outline: calc(var(--border) * 2) solid var(--upload-accent);
  outline-offset: calc(var(--border) * 2);
}

.cus-input-upload[data-disabled='true'] .cus-input-upload__label,
.cus-input-upload[data-disabled='true'] .cus-input-upload__description,
.cus-input-upload[data-disabled='true'] .cus-input-upload__preview,
.cus-input-upload[data-disabled='true'] .cus-input-upload__dropzone,
.cus-input-upload[data-disabled='true'] .cus-input-upload__drop-meta,
.cus-input-upload[data-disabled='true'] .cus-input-upload__action,
.cus-input-upload[data-disabled='true'] .cus-input-upload__crop {
  color: var(--upload-disabled-text);
}

.cus-input-upload[data-disabled='true'] .cus-input-upload__preview,
.cus-input-upload[data-disabled='true'] .cus-input-upload__dropzone,
.cus-input-upload[data-disabled='true'] .cus-input-upload__crop,
.cus-input-upload[data-disabled='true'] .cus-input-upload__action {
  border-color: var(--upload-disabled-border);
  background-color: var(--upload-disabled-bg);
}

.cus-input-upload[data-disabled='true'] .cus-input-upload__dropzone,
.cus-input-upload[data-disabled='true'] .cus-input-upload__action {
  @apply cursor-not-allowed;
}
</style>
