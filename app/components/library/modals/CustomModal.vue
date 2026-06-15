<template>
  <Teleport to="body">
    <Transition name="cus-modal-motion">
      <div
        v-if="props.modelValue"
        class="cus-modal-viewport"
        :data-theme="props.theme"
        @mousedown.self="handleBackdropClose"
      >
        <section
          ref="modalRef"
          class="cus-modal"
          :data-size="props.size"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="computedTitleId"
          :aria-describedby="computedDescId"
          tabindex="-1"
          @keydown="handleKeydown"
        >
          <header class="cus-modal__header">
            <span v-if="props.icon" class="cus-modal__icon-wrap" aria-hidden="true">
              <Icon class="cus-modal__icon" :name="props.icon" />
            </span>

            <div class="cus-modal__heading">
              <h2 :id="computedTitleId" class="cus-modal__title">
                <slot name="title">
                  {{ props.title }}
                </slot>
              </h2>
              <p v-if="hasDescription" :id="computedDescId" class="cus-modal__desc">
                <slot name="desc">
                  {{ props.desc }}
                </slot>
              </p>
            </div>

            <button
              v-if="props.closable"
              class="cus-modal__close"
              type="button"
              :aria-label="props.closeLabel"
              @click="closeModal('close')"
            >
              <Icon class="cus-modal__close-icon" name="lucide:x" aria-hidden="true" />
            </button>
          </header>

          <div class="cus-modal__body">
            <slot />
          </div>

          <footer v-if="slots.footer" class="cus-modal__footer">
            <slot name="footer" />
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
type CloseReason = 'close' | 'backdrop' | 'escape'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
  icon: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  closable: { type: Boolean, default: true },
  closeOnBackdrop: { type: Boolean, default: true },
  closeOnEscape: { type: Boolean, default: true },
  closeLabel: { type: String, default: 'Fermer la modale' },
  theme: {
    type: String,
    default: 'landing',
    validator: (value: string) => ['landing', 'app'].includes(value)
  },
  titleId: { type: String, default: '' },
  descId: { type: String, default: '' }
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: [reason: CloseReason]
}>()

const slots = useSlots()
const modalId = useId()
const modalRef = ref<HTMLElement | null>(null)
const previousFocusedElement = ref<HTMLElement | null>(null)
const previousBodyOverflow = ref('')
const isScrollLocked = ref(false)
const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

const computedTitleId = computed(() => props.titleId || `${modalId}-title`)
const hasDescription = computed(() => Boolean(props.desc || slots.desc))
const computedDescId = computed(() => {
  if (!hasDescription.value) {
    return undefined
  }

  return props.descId || `${modalId}-desc`
})

const getFocusableElements = () => {
  if (!modalRef.value) {
    return []
  }

  return Array.from(modalRef.value.querySelectorAll<HTMLElement>(focusableSelector))
    .filter((element) => element.offsetParent !== null || element === document.activeElement)
}

const focusModal = async () => {
  await nextTick()

  const [firstFocusableElement] = getFocusableElements()
  const target = firstFocusableElement || modalRef.value
  target?.focus({ preventScroll: true })
}

const lockBodyScroll = () => {
  if (isScrollLocked.value) {
    return
  }

  previousBodyOverflow.value = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  isScrollLocked.value = true
}

const unlockBodyScroll = () => {
  if (!isScrollLocked.value) {
    return
  }

  document.body.style.overflow = previousBodyOverflow.value
  isScrollLocked.value = false
}

const closeModal = (reason: CloseReason) => {
  emit('update:modelValue', false)
  emit('close', reason)
}

const handleBackdropClose = () => {
  if (!props.closeOnBackdrop) {
    return
  }

  closeModal('backdrop')
}

const trapFocus = (event: KeyboardEvent) => {
  const focusableElements = getFocusableElements()

  if (!focusableElements.length) {
    event.preventDefault()
    modalRef.value?.focus({ preventScroll: true })
    return
  }

  const firstFocusableElement = focusableElements[0]
  const lastFocusableElement = focusableElements[focusableElements.length - 1]

  if (event.shiftKey && document.activeElement === firstFocusableElement) {
    event.preventDefault()
    lastFocusableElement?.focus({ preventScroll: true })
    return
  }

  if (!event.shiftKey && document.activeElement === lastFocusableElement) {
    event.preventDefault()
    firstFocusableElement?.focus({ preventScroll: true })
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnEscape) {
    event.preventDefault()
    closeModal('escape')
    return
  }

  if (event.key === 'Tab') {
    trapFocus(event)
  }
}

watch(() => props.modelValue, async (isOpen) => {
  if (!import.meta.client) {
    return
  }

  if (isOpen) {
    previousFocusedElement.value = document.activeElement as HTMLElement | null
    lockBodyScroll()
    await focusModal()
    return
  }

  unlockBodyScroll()
  previousFocusedElement.value?.focus?.({ preventScroll: true })
}, { immediate: true })

onBeforeUnmount(() => {
  if (import.meta.client && props.modelValue) {
    unlockBodyScroll()
  }
})
</script>

<style scoped>
.cus-modal-viewport {
  --modal-viewport-padding: var(--space-3);
  --modal-backdrop-bg: color-mix(in oklch, var(--color-bg) 78%, var(--color-transparent));
  --modal-header-height: var(--landing-header-height);
  position: fixed;
  inset-block: var(--modal-header-height) 0;
  inset-inline: 0;
  z-index: var(--layer-popover);
  padding: var(--modal-viewport-padding);
  background-color: var(--modal-backdrop-bg);
  backdrop-filter: blur(var(--landing-blur-header));

  @apply grid place-items-center;
}

.cus-modal-viewport[data-theme='app'] {
  --modal-header-height: var(--app-header-height);
}

.cus-modal {
  --modal-width-sm: calc(var(--unit) * 52);
  --modal-width-md: calc(var(--unit) * 72);
  --modal-width-lg: calc(var(--unit) * 96);
  --modal-width-xl: calc(var(--modal-width-lg) + (var(--modal-width-md) - var(--modal-width-sm)));
  --modal-width: var(--modal-width-md);
  --modal-max-height: calc(100dvh - var(--modal-header-height) - (var(--modal-viewport-padding) * 2));
  --modal-padding: var(--space-3);
  --modal-gap: var(--space-3);
  --modal-icon-box: calc(var(--unit) * 5);
  --modal-icon-size: calc(var(--unit) * 2.5);
  --modal-close-size: calc(var(--unit) * 4);
  --modal-close-icon: calc(var(--unit) * 2);
  --modal-bg: var(--color-surface-deep);
  --modal-border: color-mix(in oklch, var(--color-line) 86%, var(--color-transparent));
  --modal-shadow: color-mix(in oklch, var(--color-shadow) 72%, var(--color-bg) 28%);
  --modal-muted: color-mix(in oklch, var(--color-muted) 86%, var(--color-transparent));
  --modal-control-bg: color-mix(in oklch, var(--color-bg-soft) 86%, var(--color-transparent));
  --modal-control-hover-bg: color-mix(in oklch, var(--color-bg-soft-hover) 88%, var(--color-accent));
  width: min(100%, var(--modal-width));
  min-width: 0;
  max-height: var(--modal-max-height);
  max-width: 100%;
  border: var(--border) solid var(--modal-border);
  border-radius: var(--radius);
  background-color: var(--modal-bg);
  box-shadow: 0 var(--space-3) var(--space-8) var(--modal-shadow);
  color: var(--color-text);
  outline: none;

  @apply flex flex-col overflow-hidden;
}

.cus-modal[data-size='sm'] {
  --modal-width: var(--modal-width-sm);
}

.cus-modal[data-size='lg'] {
  --modal-width: var(--modal-width-lg);
}

.cus-modal[data-size='xl'] {
  --modal-width: var(--modal-width-xl);
}

.cus-modal__header {
  min-width: 0;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: var(--modal-gap);
  padding: var(--modal-padding);
  border-block-end: var(--border) solid var(--modal-border);

  @apply grid items-start;
}

.cus-modal__icon-wrap {
  width: var(--modal-icon-box);
  height: var(--modal-icon-box);
  border-radius: var(--radius);
  background: var(--gradient-action);
  color: var(--color-text);

  @apply inline-flex items-center justify-center;
}

.cus-modal__icon {
  width: var(--modal-icon-size);
  height: var(--modal-icon-size);
}

.cus-modal__heading {
  min-width: 0;
  gap: calc(var(--unit) * 0.5);

  @apply grid;
}

.cus-modal__title,
.cus-modal__desc {
  margin: 0;
  overflow-wrap: anywhere;
}

.cus-modal__title {
  color: var(--color-text);
  font-size: var(--font-card);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-card);
}

.cus-modal__desc {
  color: var(--modal-muted);
  font-size: var(--font-eyebrow);
  line-height: var(--line-base);
}

.cus-modal__close {
  width: var(--modal-close-size);
  height: var(--modal-close-size);
  border: var(--border) solid var(--color-transparent);
  border-radius: var(--radius);
  background-color: var(--modal-control-bg);
  color: var(--color-text);
  font-family: inherit;
  transition-duration: var(--motion-fast);

  @apply inline-flex cursor-pointer items-center justify-center transition-colors;
}

.cus-modal__close:hover {
  background-color: var(--modal-control-hover-bg);
}

.cus-modal__close-icon {
  width: var(--modal-close-icon);
  height: var(--modal-close-icon);
}

.cus-modal__body {
  flex: 1;
  min-width: 0;
  min-height: 0;
  padding: var(--modal-padding);
  color: var(--color-muted);
  font-size: var(--font-body);
  line-height: var(--line-base);

  overflow-x: hidden;

  @apply overflow-y-auto;
}

.cus-modal__body > * {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.cus-modal__footer {
  min-width: 0;
  gap: var(--space-2);
  padding: var(--modal-padding);
  border-block-start: var(--border) solid var(--modal-border);

  @apply flex flex-wrap items-center justify-end;
}

.cus-modal-motion-enter-active,
.cus-modal-motion-leave-active {
  transition-duration: var(--motion-fast);
  transition-property: opacity;
}

.cus-modal-motion-enter-active .cus-modal,
.cus-modal-motion-leave-active .cus-modal {
  transition-duration: var(--motion-fast);
  transition-property: opacity, transform;
}

.cus-modal-motion-enter-from,
.cus-modal-motion-leave-to {
  opacity: 0;
}

.cus-modal-motion-enter-from .cus-modal,
.cus-modal-motion-leave-to .cus-modal {
  opacity: 0;
  transform: translateY(calc(var(--unit) * -1));
}
</style>
