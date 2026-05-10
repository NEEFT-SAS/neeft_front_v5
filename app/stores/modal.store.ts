import type { Component } from 'vue'
import { markRaw } from 'vue'
import { defineStore } from 'pinia'

export type ModalId = number
export type ModalSize = 'sm' | 'md' | 'lg'
export type ModalCloseReason = 'close' | 'backdrop' | 'escape' | 'remove' | 'clear'
export type ModalComponent = Component | string
export type ModalPresentation = 'shell' | 'component'

export type CustomModalItem = {
  id: ModalId
  title: string
  desc: string
  body: string
  icon: string
  size: ModalSize
  closable: boolean
  closeOnBackdrop: boolean
  closeOnEscape: boolean
  closeLabel: string
  presentation: ModalPresentation
  component: ModalComponent | null
  componentProps: Record<string, unknown>
  onClose?: (reason: ModalCloseReason, modal: CustomModalItem) => void
}

export type AddModalOptions = Partial<Omit<CustomModalItem, 'id' | 'component'>> & {
  component?: ModalComponent
}

export type UpdateModalOptions = Partial<Omit<CustomModalItem, 'id' | 'component'>> & {
  component?: ModalComponent | null
}

type ModalState = {
  modals: CustomModalItem[]
  modalSequence: number
}

const defaultModalSize: ModalSize = 'md'

const normalizeComponent = (component?: ModalComponent | null) => {
  if (!component) {
    return null
  }

  return typeof component === 'string' ? component : markRaw(component)
}

const createModal = (id: ModalId, options: AddModalOptions): CustomModalItem => ({
  id,
  title: options.title ?? '',
  desc: options.desc ?? '',
  body: options.body ?? '',
  icon: options.icon ?? '',
  size: options.size ?? defaultModalSize,
  closable: options.closable ?? true,
  closeOnBackdrop: options.closeOnBackdrop ?? true,
  closeOnEscape: options.closeOnEscape ?? true,
  closeLabel: options.closeLabel ?? 'Fermer la modale',
  presentation: options.presentation ?? 'shell',
  component: normalizeComponent(options.component),
  componentProps: options.componentProps ?? {},
  onClose: options.onClose
})

export const useModalStore = defineStore('modal', {
  state: (): ModalState => ({
    modals: [],
    modalSequence: 0
  }),

  getters: {
    activeModal: (state) => state.modals.at(-1) || null
  },

  actions: {
    getNextModalId(): ModalId {
      this.modalSequence = this.modalSequence >= Number.MAX_SAFE_INTEGER ? 1 : this.modalSequence + 1
      return this.modalSequence
    },

    add(options: AddModalOptions = {}): ModalId {
      const id = this.getNextModalId()
      this.modals = [...this.modals, createModal(id, options)]
      return id
    },

    remove(id: ModalId, reason: ModalCloseReason = 'remove') {
      const removedModal = this.modals.find((modal) => modal.id === id)
      this.modals = this.modals.filter((modal) => modal.id !== id)
      removedModal?.onClose?.(reason, removedModal)
    },

    close(id: ModalId = this.activeModal?.id || 0, reason: ModalCloseReason = 'close') {
      if (!id) {
        return
      }

      this.remove(id, reason)
    },

    update(id: ModalId, options: UpdateModalOptions) {
      this.modals = this.modals.map((modal) => {
        if (modal.id !== id) {
          return modal
        }

        return {
          ...modal,
          ...options,
          component: options.component === undefined ? modal.component : normalizeComponent(options.component),
          componentProps: options.componentProps
            ? { ...modal.componentProps, ...options.componentProps }
            : modal.componentProps
        }
      })
    },

    clear() {
      const removedModals = this.modals
      this.modals = []
      removedModals.forEach((modal) => modal.onClose?.('clear', modal))
    }
  }
})
