import { createAuthenticatedApi } from '~/utils/createAuthenticatedApi'

export type MarketplaceServiceStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type MarketplaceOrderStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED'
export type MarketplaceOrderObjective = 'performance' | 'deliverable' | 'team' | 'growth' | 'other'
export type MarketplaceOrderDeadline = 'flexible' | 'week' | 'two-weeks' | 'month'

export type MarketplaceProfilePresenter = {
  id: string
  username: string
  slug: string
  profilePicture: string | null
}

export type MarketplaceServiceLinePresenter = {
  id: string
  name: string
  description: string
  price: number
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type MarketplaceServiceListOfferPresenter = {
  id: string
  title: string
  description: string
  price: number
}

export type MarketplaceRscOptionPresenter = {
  id: string
  label: string
  slug: string | null
  icon: string | null
}

export type MarketplaceRscGamePresenter = {
  id: number
  name: string
  shortName: string | null
  slug: string
  icon: string | null
  banner: string | null
}

export type MarketplaceServiceListItemPresenter = {
  id: string
  title: string
  slug: string
  rscCategories: MarketplaceRscOptionPresenter[]
  coverImageUrl: string | null
  shortDescription: string
  rscGames: MarketplaceRscGamePresenter[]
  offers: MarketplaceServiceListOfferPresenter[]
  seller: MarketplaceProfilePresenter | null
  rating: number
  reviewCount: number
}

export type MarketplaceServicePresenter = {
  id: string
  sellerProfileId: string
  seller: MarketplaceProfilePresenter | null
  name: string
  slug: string
  description: string
  bannerUrl: string | null
  images: string[]
  rscGames: MarketplaceRscGamePresenter[]
  status: MarketplaceServiceStatus
  ordersCount: number
  ratingAvg: number
  ratingCount: number
  services: MarketplaceServiceLinePresenter[]
  createdAt: string
  updatedAt: string
}

export type MarketplaceOrderServiceSnapshotPresenter = {
  id: string
  name: string
  slug: string
  bannerUrl: string | null
  status: MarketplaceServiceStatus
}

export type MarketplaceOrderServiceLineSnapshotPresenter = {
  id: string
  name: string
  description: string
  price: number
}

export type MarketplaceOrderPresenter = {
  id: string
  serviceId: string | null
  serviceLineId: string | null
  buyerProfileId: string
  sellerProfileId: string
  buyer: MarketplaceProfilePresenter | null
  seller: MarketplaceProfilePresenter | null
  service: MarketplaceOrderServiceSnapshotPresenter | null
  serviceLine: MarketplaceOrderServiceLineSnapshotPresenter | null
  serviceName: string
  serviceLineName: string
  amount: number
  currency: string
  status: MarketplaceOrderStatus
  objective: MarketplaceOrderObjective
  deadline: MarketplaceOrderDeadline
  brief: string
  assets: string | null
  contact: string
  statusNote: string | null
  createdAt: string
  updatedAt: string
}

export type MarketplaceListMeta = {
  total: number
  limit: number
  offset: number
}

export type MarketplaceEnvelope<TData, TMeta = Record<string, unknown>> = {
  data: TData
  meta?: TMeta
}

export type MarketplaceServiceLineInput = {
  name: string
  description: string
  price: number
}

export type CreateMarketplaceServiceInput = {
  name: string
  description: string
  bannerUrl?: string | null
  images?: string[]
  gameIds?: number[]
  status?: MarketplaceServiceStatus
  services: MarketplaceServiceLineInput[]
}

export type UpdateMarketplaceServiceInput = Partial<CreateMarketplaceServiceInput>

export type SearchMarketplaceServicesQuery = {
  q?: string
  status?: MarketplaceServiceStatus
  sellerProfileId?: string
  limit?: number
  offset?: number
}

export type CreateMarketplaceOrderInput = {
  serviceLineId: string
  brief: string
  objective: MarketplaceOrderObjective
  deadline: MarketplaceOrderDeadline
  assets?: string
  contact: string
  confirmed?: boolean
}

export type UpdateMarketplaceOrderInput = Partial<Omit<CreateMarketplaceOrderInput, 'serviceLineId' | 'confirmed'>>

export type UpdateMarketplaceOrderStatusInput = {
  status: MarketplaceOrderStatus
  note?: string
}

export type MarketplaceOrdersQuery = {
  status?: MarketplaceOrderStatus
  limit?: number
  offset?: number
}

export type MarketplaceApi = {
  services: {
    search: (query?: SearchMarketplaceServicesQuery) => Promise<MarketplaceEnvelope<MarketplaceServiceListItemPresenter[], MarketplaceListMeta>>
    mine: (query?: SearchMarketplaceServicesQuery) => Promise<MarketplaceEnvelope<MarketplaceServicePresenter[], MarketplaceListMeta>>
    get: (idOrSlug: string) => Promise<MarketplaceServicePresenter>
    create: (input: CreateMarketplaceServiceInput) => Promise<MarketplaceServicePresenter>
    update: (serviceId: string, input: UpdateMarketplaceServiceInput) => Promise<MarketplaceServicePresenter>
    delete: (serviceId: string) => Promise<{ deleted: boolean }>
  }
  orders: {
    create: (serviceId: string, input: CreateMarketplaceOrderInput) => Promise<MarketplaceOrderPresenter>
    listBuyer: (query?: MarketplaceOrdersQuery) => Promise<MarketplaceEnvelope<MarketplaceOrderPresenter[], MarketplaceListMeta>>
    listSeller: (query?: MarketplaceOrdersQuery) => Promise<MarketplaceEnvelope<MarketplaceOrderPresenter[], MarketplaceListMeta>>
    getBuyer: (orderId: string) => Promise<MarketplaceOrderPresenter>
    getSeller: (orderId: string) => Promise<MarketplaceOrderPresenter>
    update: (orderId: string, input: UpdateMarketplaceOrderInput) => Promise<MarketplaceOrderPresenter>
    updateBuyerStatus: (orderId: string, input: UpdateMarketplaceOrderStatusInput) => Promise<MarketplaceOrderPresenter>
    updateSellerStatus: (orderId: string, input: UpdateMarketplaceOrderStatusInput) => Promise<MarketplaceOrderPresenter>
    delete: (orderId: string) => Promise<{ deleted: boolean }>
  }
}

const unwrap = async <TData>(request: Promise<MarketplaceEnvelope<TData>>): Promise<TData> => {
  const response = await request
  return response.data
}

const getQuery = <TQuery extends Record<string, unknown>>(query: TQuery = {} as TQuery) => {
  return Object.fromEntries(Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== ''))
}

export default defineNuxtPlugin(() => {
  const auth = useAuth()
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
  const api = createAuthenticatedApi(apiBaseUrl, auth.token, { unwrapData: false })

  const marketplaceAPI: MarketplaceApi = {
    services: {
      search: async (query = {}) => {
        return await api<MarketplaceEnvelope<MarketplaceServiceListItemPresenter[], MarketplaceListMeta>>('/marketplace/services', { method: 'GET', query: getQuery(query), cache: 'no-store' })
      },
      mine: async (query = {}) => {
        return await api<MarketplaceEnvelope<MarketplaceServicePresenter[], MarketplaceListMeta>>('/marketplace/services/mine', { method: 'GET', query: getQuery(query), cache: 'no-store' })
      },
      get: async (idOrSlug: string) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceServicePresenter>>(`/marketplace/services/${encodeURIComponent(idOrSlug)}`, { method: 'GET', cache: 'no-store' }))
      },
      create: async (input: CreateMarketplaceServiceInput) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceServicePresenter>>('/marketplace/services', { method: 'POST', body: input, cache: 'no-store' }))
      },
      update: async (serviceId: string, input: UpdateMarketplaceServiceInput) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceServicePresenter>>(`/marketplace/services/${encodeURIComponent(serviceId)}`, { method: 'PATCH', body: input, cache: 'no-store' }))
      },
      delete: async (serviceId: string) => {
        return await unwrap(api<MarketplaceEnvelope<{ deleted: boolean }>>(`/marketplace/services/${encodeURIComponent(serviceId)}`, { method: 'DELETE', cache: 'no-store' }))
      }
    },
    orders: {
      create: async (serviceId: string, input: CreateMarketplaceOrderInput) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceOrderPresenter>>(`/marketplace/services/${encodeURIComponent(serviceId)}/orders`, { method: 'POST', body: input, cache: 'no-store' }))
      },
      listBuyer: async (query = {}) => {
        return await api<MarketplaceEnvelope<MarketplaceOrderPresenter[], MarketplaceListMeta>>('/marketplace/orders', { method: 'GET', query: getQuery(query), cache: 'no-store' })
      },
      listSeller: async (query = {}) => {
        return await api<MarketplaceEnvelope<MarketplaceOrderPresenter[], MarketplaceListMeta>>('/marketplace/sales', { method: 'GET', query: getQuery(query), cache: 'no-store' })
      },
      getBuyer: async (orderId: string) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceOrderPresenter>>(`/marketplace/orders/${encodeURIComponent(orderId)}`, { method: 'GET', cache: 'no-store' }))
      },
      getSeller: async (orderId: string) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceOrderPresenter>>(`/marketplace/sales/${encodeURIComponent(orderId)}`, { method: 'GET', cache: 'no-store' }))
      },
      update: async (orderId: string, input: UpdateMarketplaceOrderInput) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceOrderPresenter>>(`/marketplace/orders/${encodeURIComponent(orderId)}`, { method: 'PATCH', body: input, cache: 'no-store' }))
      },
      updateBuyerStatus: async (orderId: string, input: UpdateMarketplaceOrderStatusInput) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceOrderPresenter>>(`/marketplace/orders/${encodeURIComponent(orderId)}/status`, { method: 'PATCH', body: input, cache: 'no-store' }))
      },
      updateSellerStatus: async (orderId: string, input: UpdateMarketplaceOrderStatusInput) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceOrderPresenter>>(`/marketplace/sales/${encodeURIComponent(orderId)}/status`, { method: 'PATCH', body: input, cache: 'no-store' }))
      },
      delete: async (orderId: string) => {
        return await unwrap(api<MarketplaceEnvelope<{ deleted: boolean }>>(`/marketplace/orders/${encodeURIComponent(orderId)}`, { method: 'DELETE', cache: 'no-store' }))
      }
    }
  }

  return { provide: { marketplaceAPI } }
})

declare module '#app' {
  interface NuxtApp {
    $marketplaceAPI: MarketplaceApi
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $marketplaceAPI: MarketplaceApi
  }
}
