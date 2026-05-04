import type { ToastId, ToastPosition, ToastVariant, CustomToastItem, AddToastOptions, UpdateToastOptions } from '~/types/api.types'

const defaultToastPosition: ToastPosition = 'top-right'
const defaultToastVariant: ToastVariant = 'info'
const defaultToastDuration = 5000
const maxToastId = Number.MAX_SAFE_INTEGER

export const toastPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const satisfies readonly ToastPosition[]

export const useToast = () => {
  const toasts = useState<CustomToastItem[]>('custom-toasts', () => [])
  const sequence = useState<ToastId>('custom-toast-sequence', () => 0)

  const getNextId = () => {
    sequence.value = sequence.value >= maxToastId ? 1 : sequence.value + 1
    return sequence.value
  }

  const add = (options: AddToastOptions = {}) => {
    const id = getNextId()

    toasts.value = [
      ...toasts.value,
      {
        id,
        position: options.position ?? defaultToastPosition,
        variant: options.variant ?? defaultToastVariant,
        title: options.title ?? '',
        desc: options.desc ?? '',
        icon: options.icon ?? '',
        duration: options.duration ?? defaultToastDuration,
        timer: options.timer ?? true,
        closable: options.closable ?? true,
        closeLabel: options.closeLabel ?? 'Fermer la notification'
      }
    ]

    return id
  }

  const remove = (id: ToastId) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  const update = (id: ToastId, options: UpdateToastOptions) => {
    toasts.value = toasts.value.map((toast) => (
      toast.id === id
        ? { ...toast, ...options }
        : toast
    ))
  }

  const clear = (position?: ToastPosition) => {
    toasts.value = position
      ? toasts.value.filter((toast) => toast.position !== position)
      : []
  }

  const byPosition = computed<Record<ToastPosition, CustomToastItem[]>>(() => {
    const grouped = toastPositions.reduce((accumulator, position) => {
      accumulator[position] = []
      return accumulator
    }, {} as Record<ToastPosition, CustomToastItem[]>)

    toasts.value.forEach((toast) => {
      grouped[toast.position].push(toast)
    })

    toastPositions.forEach((position) => {
      if (position.startsWith('top')) {
        grouped[position] = [...grouped[position]].reverse()
      }
    })

    return grouped
  })

  return {
    toasts: readonly(toasts),
    byPosition,
    add,
    remove,
    update,
    clear
  }
}
