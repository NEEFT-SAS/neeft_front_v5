<template>
  <CustomModal
    :model-value="modelValue"
    title="Ajouter des fichiers"
    desc="Ces fichiers seront ajoutes au suivi sans marquer la commande comme livree."
    icon="lucide:upload"
    theme="app"
    size="sm"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('update:modelValue', false)"
  >
    <div class="marketplace-order-delivery-modal">
      <CustomInputTextarea v-model="message" label="Message" label-position="outside" :rows="4" />
      <label>
        <span>Fichiers</span>
        <input type="file" multiple :disabled="busy" @change="onFilesChanged">
      </label>
      <ul v-if="files.length">
        <li v-for="file in files" :key="`${file.name}-${file.size}`">{{ file.name }} - {{ formatSize(file.size) }}</li>
      </ul>
      <p v-if="error" class="marketplace-order-delivery-modal__error">{{ error }}</p>
    </div>
    <template #footer>
      <CustomButton label="Annuler" theme="app" variant="ghost" color="secondary" :disabled="busy" @click="emit('update:modelValue', false)" />
      <CustomButton :label="busy ? 'Upload...' : 'Uploader'" theme="app" variant="filled" color="primary" :disabled="busy || !files.length" @click="submit" />
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import type { CreateMarketplaceOrderDeliveryInput } from '~/plugins/marketplace-api'
import type { MarketplaceOrder } from '~/datas/marketplace/orders'

const props = defineProps<{ modelValue: boolean; order: MarketplaceOrder | null; processing?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; confirm: [input: CreateMarketplaceOrderDeliveryInput] }>()
const { uploadMarketplaceOrderFile } = useFirebaseUpload()
const message = ref('')
const files = ref<File[]>([])
const uploading = ref(false)
const error = ref('')
const busy = computed(() => Boolean(props.processing) || uploading.value)

const onFilesChanged = (event: Event) => {
  files.value = Array.from((event.target as HTMLInputElement).files || []).slice(0, 10)
  error.value = ''
}

const formatSize = (size: number) => `${Math.max(1, Math.round(size / 1024))} Ko`

const submit = async () => {
  if (!props.order || !files.value.length) return
  uploading.value = true
  error.value = ''
  try {
    const uploaded = await Promise.all(files.value.map(async file => ({
      fileName: file.name,
      url: await uploadMarketplaceOrderFile(props.order!.id, file),
      mimeType: file.type || 'application/octet-stream',
      size: file.size
    })))
    emit('confirm', { message: message.value.trim() || undefined, files: uploaded })
  } catch (uploadError) {
    error.value = uploadError instanceof Error ? uploadError.message : 'Upload impossible.'
  } finally {
    uploading.value = false
  }
}

watch(() => props.modelValue, (open) => {
  if (!open) return
  message.value = ''
  files.value = []
  error.value = ''
})
</script>

<style scoped>
.marketplace-order-delivery-modal { display: grid; width: 100%; gap: 14px; }
.marketplace-order-delivery-modal label { display: grid; gap: 8px; color: var(--modal-text); font-weight: 700; }
.marketplace-order-delivery-modal input[type='file'] { width: 100%; min-width: 0; max-width: 100%; }
.marketplace-order-delivery-modal ul { min-width: 0; margin: 0; padding-left: 20px; color: var(--modal-muted); }
.marketplace-order-delivery-modal li { overflow-wrap: anywhere; }
.marketplace-order-delivery-modal__error { margin: 0; color: var(--color-danger, #d14343); }
</style>
