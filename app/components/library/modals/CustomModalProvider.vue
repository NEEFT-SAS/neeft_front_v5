<template>
  <CustomModal
    v-if="activeModal"
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
        :modal-id="activeModal.id"
        @close="modal.close(activeModal.id, 'action')"
      />
    </div>

    <template v-if="activeModal.actions.length" #footer>
      <CustomButton
        v-for="action in activeModal.actions"
        :key="action.label"
        :label="action.label"
        :left-icon="action.leftIcon || ''"
        :right-icon="action.rightIcon || ''"
        :variant="action.variant || 'filled'"
        :color="action.color || 'primary'"
        :type="action.type || 'button'"
        :form="action.form || ''"
        :disabled="action.disabled || false"
        @click="handleAction(action)"
      />
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import type { ModalAction, ModalCloseReason, UpdateModalOptions } from '~/composables/useModal'

const modal = useModal()
const activeModal = modal.active

const getActionContext = (modalId: number, modalItem: NonNullable<typeof activeModal.value>) => ({
  id: modalId,
  modal: modalItem,
  close: () => modal.close(modalId, 'action'),
  remove: () => modal.remove(modalId),
  update: (options: UpdateModalOptions) => modal.update(modalId, options),
  clear: () => modal.clear()
})

const handleClose = (reason: ModalCloseReason) => {
  if (!activeModal.value) {
    return
  }

  modal.close(activeModal.value.id, reason)
}

const handleAction = async (action: ModalAction) => {
  if (!activeModal.value || action.disabled) {
    return
  }

  const modalItem = activeModal.value
  const result = await action.onClick?.(getActionContext(modalItem.id, modalItem))
  const shouldClose = action.close ?? action.type !== 'submit'

  if (shouldClose && result !== false) {
    modal.close(modalItem.id, 'action')
  }
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
