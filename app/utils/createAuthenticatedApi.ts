import type { AuthTokenRef, ApiSuccessBody, CreateAuthenticatedApiOptions } from '~/types/api.types'

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const isApiSuccessBody = (value: unknown): value is ApiSuccessBody => {
  return isRecord(value) && 'data' in value
}

export const createAuthenticatedApi = (baseURL: string, token: AuthTokenRef, options: CreateAuthenticatedApiOptions = {} ) => {
  const unwrapData = options.unwrapData ?? true

  return $fetch.create({
    baseURL,
    onRequest({ options }) {
      const headers = new Headers(options.headers as HeadersInit)
      const rawToken = String(token.value ?? '')

      if (rawToken) {
        const normalizedToken = rawToken.replace(/^bearer\s+/i, '')
        headers.set('authorization', `Bearer ${normalizedToken}`)
      }

      options.headers = headers
    },
    onResponse({ response }) {
      if (!unwrapData) return

      if (isApiSuccessBody(response._data)) {
        response._data = response._data.data
      }
    }
  })
}
