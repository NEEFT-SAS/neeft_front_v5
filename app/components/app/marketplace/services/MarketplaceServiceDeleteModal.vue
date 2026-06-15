<template>
  <CustomModal
    :model-value="modelValue"
    title="Supprimer le service"
    :desc="modalDescription"
    icon="lucide:trash-2"
    theme="app"
    size="sm"
    @update:model-value="emit('update:modelValue', $event)"
    @close="emit('update:modelValue', false)"
  >
    <div class="marketplace-service-delete-modal">
      <p class="marketplace-service-delete-modal__text">
        Cette action retire la fiche de la marketplace. Les commandes deja creees restent accessibles dans ton suivi.
      </p>

      <div v-if="service" class="marketplace-service-delete-modal__service">
        {{ service.name }}
      </div>
    </div>

    <template #footer>
      <CustomButton
        type="button"
        label="Annuler"
        theme="app"
        variant="ghost"
        color="secondary"
        :disabled="deleting"
        @click="emit('update:modelValue', false)"
      />
      <CustomButton
        type="button"
        label="Supprimer"
        theme="app"
        variant="filled"
        color="secondary"
        :disabled="deleting || !service"
        @click="confirmDelete"
      />
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import type { MarketplaceServicePresenter } from '~/plugins/marketplace-api'

const props = defineProps<{
  modelValue: boolean
  service: MarketplaceServicePresenter | null
  deleting?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [service: MarketplaceServicePresenter]
}>()

const modalDescription = computed(() => props.service
  ? `Confirme la suppression de "${props.service.name}".`
  : 'Confirme la suppression du service.'
)

const confirmDelete = () => {
  if (!props.service || props.deleting) return
  emit('confirm', props.service)
}
</script>

<style scoped lang="scss">
.marketplace-service-delete-modal {
  display: grid;
  gap: 14px;
  width: 100%;
}

.marketplace-service-delete-modal__text {
  margin: 0;
  color: var(--modal-muted);
  font-size: 0.92rem;
  line-height: 1.5;
}

.marketplace-service-delete-modal__service {
  min-width: 0;
  padding: 12px 14px;
  border: 1px solid var(--modal-border);
  border-radius: 8px;
  color: var(--modal-text);
  background: color-mix(in srgb, var(--modal-surface) 92%, transparent);
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

</style>
