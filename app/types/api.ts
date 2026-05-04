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
