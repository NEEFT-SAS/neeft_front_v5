export type AuthTokenRef = {
  value: unknown
}

export type ApiSuccessBody<T = unknown> = {
  data: T
  meta?: unknown
}

export type CreateAuthenticatedApiOptions = {
  unwrapData?: boolean
}

export type ToastId = number
export type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
export type ToastVariant = 'info' | 'success' | 'warn' | 'warning' | 'error' | 'neutral'

export type CustomToastItem = {
  id: ToastId
  position: ToastPosition
  variant: ToastVariant
  title: string
  desc: string
  icon: string
  duration: number
  timer: boolean
  closable: boolean
  closeLabel: string
}

export type AddToastOptions = Partial<Omit<CustomToastItem, 'id'>>
export type UpdateToastOptions = Partial<Omit<CustomToastItem, 'id'>>
