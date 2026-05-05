import type { ResourcesPresenter } from '@neeft-sas/shared'

export type ResourceApi = {
  get: () => Promise<ResourcesPresenter>
}

export default defineNuxtPlugin(() => {
  const auth = useAuth()
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
  const api = $fetch.create({
    baseURL: apiBaseUrl,
    onRequest({ options }) {
      const headers = new Headers(options.headers as HeadersInit)
      const rawToken = String(auth.token.value ?? '')

      if (rawToken) {
        headers.set('authorization', `Bearer ${rawToken.replace(/^bearer\s+/i, '')}`)
      }

      options.headers = headers
    }
  })

  const resourceAPI: ResourceApi = {
    get: async () => {
      return await api<ResourcesPresenter>('/resources', { cache: 'no-store' })
    }
  }

  return {
    provide: {
      resourceAPI
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $resourceAPI: ResourceApi
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $resourceAPI: ResourceApi
  }
}
