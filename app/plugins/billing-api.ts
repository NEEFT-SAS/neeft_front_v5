import { createAuthenticatedApi } from '~/utils/createAuthenticatedApi'

export type BillingWalletPresenter = {
  id: string
  profileId: string
  currency: string
  pendingBalance: number
  availableBalance: number
  totalGrossEarned: number
  totalFees: number
  totalNetEarned: number
  commissionRate: number
  createdAt: string
  updatedAt: string
}

export type BillingApi = {
  wallet: {
    get: () => Promise<BillingWalletPresenter>
  }
}

export default defineNuxtPlugin(() => {
  const auth = useAuth()
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
  const api = createAuthenticatedApi(apiBaseUrl, auth.token)

  const billingAPI: BillingApi = {
    wallet: {
      get: async () => {
        return await api<BillingWalletPresenter>('/billing/wallet', { method: 'GET', cache: 'no-store' })
      }
    }
  }

  return { provide: { billingAPI } }
})

declare module '#app' {
  interface NuxtApp {
    $billingAPI: BillingApi
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $billingAPI: BillingApi
  }
}
