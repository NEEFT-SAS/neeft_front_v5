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
    withdraw: (amount: number, requestKey: string) => Promise<BillingWithdrawalPresenter>
  }
  connect: {
    get: () => Promise<BillingConnectStatusPresenter>
    onboarding: () => Promise<{ url: string; expiresAt: number }>
  }
}

export type BillingConnectStatusPresenter = {
  connected: boolean
  detailsSubmitted: boolean
  chargesEnabled: boolean
  payoutsEnabled: boolean
  stripeAccountId: string | null
}

export type BillingWithdrawalPresenter = {
  id: string
  amount: number
  currency: string
  status: 'PROCESSING' | 'COMPLETED' | 'RETRYABLE' | 'FAILED'
  stripeTransferId: string | null
  createdAt: string
  updatedAt: string
}

export default defineNuxtPlugin(() => {
  const auth = useAuth()
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
  const api = createAuthenticatedApi(apiBaseUrl, auth.token)

  const billingAPI: BillingApi = {
    wallet: {
      get: async () => {
        return await api<BillingWalletPresenter>('/billing/wallet', { method: 'GET', cache: 'no-store' })
      },
      withdraw: async (amount: number, requestKey: string) => {
        return await api<BillingWithdrawalPresenter>('/billing/wallet/withdrawals', { method: 'POST', body: { amount, requestKey }, cache: 'no-store' })
      }
    },
    connect: {
      get: async () => api<BillingConnectStatusPresenter>('/billing/connect', { method: 'GET', cache: 'no-store' }),
      onboarding: async () => api<{ url: string; expiresAt: number }>('/billing/connect/onboarding', { method: 'POST', cache: 'no-store' })
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
