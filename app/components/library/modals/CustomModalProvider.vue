<template>
  <component
    :is="activeModal?.component"
    v-if="activeModal && activeModal.presentation === 'component' && activeModal.component"
    v-bind="standaloneComponentProps"
  />

  <CustomModal
    v-else-if="activeModal"
    :model-value="true"
    :title="activeModal.title"
    :desc="activeModal.desc"
    :icon="activeModal.icon"
    :size="activeModal.size"
    :closable="activeModal.closable"
    :close-on-backdrop="activeModal.closeOnBackdrop"
    :close-on-escape="activeModal.closeOnEscape"
    :close-label="activeModal.closeLabel"
    @close="handleClose"
  >
    <div class="cus-modal-provider__content">
      <p v-if="activeModal.body" class="cus-modal-provider__body">
        {{ activeModal.body }}
      </p>

      <component
        :is="activeModal.component"
        v-if="activeModal.component"
        v-bind="activeModal.componentProps"
      />
    </div>
  </CustomModal>
</template>

<script setup lang="ts">
import type { ModalCloseReason } from '~/stores/modal.store'

const modalStore = useModalStore()
const { activeModal } = storeToRefs(modalStore)

const standaloneComponentProps = computed(() => {
  if (!activeModal.value) {
    return {}
  }

  return {
    ...activeModal.value.componentProps,
    modalId: activeModal.value.id
  }
})

const handleClose = (reason: ModalCloseReason) => {
  if (!activeModal.value) {
    return
  }

  modalStore.close(activeModal.value.id, reason)
}
</script>

<style scoped>
.cus-modal-provider__content {
  gap: var(--space-3);

  @apply grid;
}

.cus-modal-provider__body {
  margin: 0;
  color: var(--color-muted);
  font-size: var(--font-body);
  line-height: var(--line-base);
  overflow-wrap: anywhere;
}
</style>
