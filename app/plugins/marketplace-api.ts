import { createAuthenticatedApi } from '~/utils/createAuthenticatedApi'

export type MarketplaceServiceStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type MarketplaceOrderStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED'
export type MarketplaceOrderObjective = 'performance' | 'deliverable' | 'team' | 'growth' | 'other'
export type MarketplaceOrderDeadline = 'flexible' | 'week' | 'two-weeks' | 'month'

export type MarketplaceProfilePresenter = {
  id: string
  username: string
  slug: string
  description: string | null
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

export type MarketplaceServiceReviewPresenter = {
  id: string
  rating: number
  comment: string
  author: MarketplaceProfilePresenter | null
  createdAt: string
  updatedAt: string
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
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED'
  paidAt: string | null
  objective: MarketplaceOrderObjective
  deadline: MarketplaceOrderDeadline
  brief: string
  assets: string | null
  contact: string
  statusNote: string | null
  disputeOpenedAt: string | null
  disputeOpenedByProfileId: string | null
  disputeReason: string | null
  disputeDetails: string | null
  sellerAcceptanceDeadlineAt: string | null
  acceptedAt: string | null
  deliveredAt: string | null
  buyerValidationDeadlineAt: string | null
  completedAt: string | null
  autoCompletedAt: string | null
  refundStatus: 'NONE' | 'PROPOSED' | 'REFUNDED'
  refundProposedAt: string | null
  refundProposedByProfileId: string | null
  refundReason: string | null
  refundedAt: string | null
  stripeRefundId: string | null
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
  brief?: string
  objective: MarketplaceOrderObjective
  deadline: MarketplaceOrderDeadline
  assets?: string
  contact: string
  confirmed?: boolean
}

export type CreateMarketplaceOrderCheckoutInput = {
  successUrl?: string
  cancelUrl?: string
}

export type MarketplaceOrderCheckoutPresenter = {
  id: string
  url: string | null
}

export type MarketplaceOrderPaymentIntentPresenter = {
  id: string
  intentType: 'payment'
  clientSecret: string | null
  orderId: string | null
}

export type ConfirmMarketplaceOrderPaymentInput = {
  paymentIntentId: string
}

export type ConfirmMarketplaceOrderCreationPaymentInput = ConfirmMarketplaceOrderPaymentInput & Omit<CreateMarketplaceOrderInput, 'confirmed'> & {
  serviceId: string
}

export type MarketplaceOrderPaymentDocumentPresenter = {
  receiptUrl: string | null
  invoiceUrl: string | null
  invoicePdf: string | null
}

export type OpenMarketplaceOrderDisputeInput = {
  reason: string
  details?: string
}

export type ProposeMarketplaceOrderRefundInput = {
  reason: string
}

export type CreateMarketplaceServiceReviewInput = {
  rating: number
  comment: string
}

export type UpdateMarketplaceOrderInput = Partial<Omit<CreateMarketplaceOrderInput, 'serviceLineId' | 'confirmed'>>

export type UpdateMarketplaceOrderStatusInput = {
  status: MarketplaceOrderStatus
  note?: string
}

export type MarketplaceOrdersQuery = {
  status?: MarketplaceOrderStatus
  serviceId?: string
  limit?: number
  offset?: number
}

export type MarketplaceServiceReviewsQuery = {
  limit?: number
  offset?: number
}

export type MarketplaceServiceReviewsMeta = MarketplaceListMeta & {
  ratingAvg: number
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
  reviews: {
    listForService: (serviceIdOrSlug: string, query?: MarketplaceServiceReviewsQuery) => Promise<MarketplaceEnvelope<MarketplaceServiceReviewPresenter[], MarketplaceServiceReviewsMeta>>
  }
  orders: {
    create: (serviceId: string, input: CreateMarketplaceOrderInput) => Promise<MarketplaceOrderPresenter>
    checkout: (orderId: string, input?: CreateMarketplaceOrderCheckoutInput) => Promise<MarketplaceOrderCheckoutPresenter>
    createPaymentIntent: (orderId: string) => Promise<MarketplaceOrderPaymentIntentPresenter>
    createPaymentIntentForService: (serviceId: string, input: CreateMarketplaceOrderInput) => Promise<MarketplaceOrderPaymentIntentPresenter>
    confirmPayment: (orderId: string, input: ConfirmMarketplaceOrderPaymentInput) => Promise<MarketplaceOrderPresenter>
    confirmPaymentForService: (input: ConfirmMarketplaceOrderCreationPaymentInput) => Promise<MarketplaceOrderPresenter>
    listBuyer: (query?: MarketplaceOrdersQuery) => Promise<MarketplaceEnvelope<MarketplaceOrderPresenter[], MarketplaceListMeta>>
    listSeller: (query?: MarketplaceOrdersQuery) => Promise<MarketplaceEnvelope<MarketplaceOrderPresenter[], MarketplaceListMeta>>
    getBuyer: (orderId: string) => Promise<MarketplaceOrderPresenter>
    getSeller: (orderId: string) => Promise<MarketplaceOrderPresenter>
    getBuyerPaymentDocuments: (orderId: string) => Promise<MarketplaceOrderPaymentDocumentPresenter>
    getSellerPaymentDocuments: (orderId: string) => Promise<MarketplaceOrderPaymentDocumentPresenter>
    update: (orderId: string, input: UpdateMarketplaceOrderInput) => Promise<MarketplaceOrderPresenter>
    updateBuyerStatus: (orderId: string, input: UpdateMarketplaceOrderStatusInput) => Promise<MarketplaceOrderPresenter>
    updateSellerStatus: (orderId: string, input: UpdateMarketplaceOrderStatusInput) => Promise<MarketplaceOrderPresenter>
    openBuyerDispute: (orderId: string, input: OpenMarketplaceOrderDisputeInput) => Promise<MarketplaceOrderPresenter>
    openSellerDispute: (orderId: string, input: OpenMarketplaceOrderDisputeInput) => Promise<MarketplaceOrderPresenter>
    proposeSellerRefund: (orderId: string, input: ProposeMarketplaceOrderRefundInput) => Promise<MarketplaceOrderPresenter>
    createReview: (orderId: string, input: CreateMarketplaceServiceReviewInput) => Promise<MarketplaceServiceReviewPresenter>
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
    reviews: {
      listForService: async (serviceIdOrSlug: string, query = {}) => {
        return await api<MarketplaceEnvelope<MarketplaceServiceReviewPresenter[], MarketplaceServiceReviewsMeta>>(`/marketplace/services/${encodeURIComponent(serviceIdOrSlug)}/reviews`, { method: 'GET', query: getQuery(query), cache: 'no-store' })
      }
    },
    orders: {
      create: async (serviceId: string, input: CreateMarketplaceOrderInput) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceOrderPresenter>>(`/marketplace/services/${encodeURIComponent(serviceId)}/orders`, { method: 'POST', body: input, cache: 'no-store' }))
      },
      checkout: async (orderId: string, input: CreateMarketplaceOrderCheckoutInput = {}) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceOrderCheckoutPresenter>>(`/marketplace/orders/${encodeURIComponent(orderId)}/checkout`, { method: 'POST', body: input, cache: 'no-store' }))
      },
      createPaymentIntent: async (orderId: string) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceOrderPaymentIntentPresenter>>(`/marketplace/orders/${encodeURIComponent(orderId)}/payment-intent`, { method: 'POST', cache: 'no-store' }))
      },
      createPaymentIntentForService: async (serviceId: string, input: CreateMarketplaceOrderInput) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceOrderPaymentIntentPresenter>>(`/marketplace/services/${encodeURIComponent(serviceId)}/orders/payment-intent`, { method: 'POST', body: input, cache: 'no-store' }))
      },
      confirmPayment: async (orderId: string, input: ConfirmMarketplaceOrderPaymentInput) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceOrderPresenter>>(`/marketplace/orders/${encodeURIComponent(orderId)}/confirm-payment`, { method: 'POST', body: input, cache: 'no-store' }))
      },
      confirmPaymentForService: async (input: ConfirmMarketplaceOrderCreationPaymentInput) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceOrderPresenter>>('/marketplace/orders/confirm-payment', { method: 'POST', body: input, cache: 'no-store' }))
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
      getBuyerPaymentDocuments: async (orderId: string) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceOrderPaymentDocumentPresenter>>(`/marketplace/orders/${encodeURIComponent(orderId)}/payment-documents`, { method: 'GET', cache: 'no-store' }))
      },
      getSellerPaymentDocuments: async (orderId: string) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceOrderPaymentDocumentPresenter>>(`/marketplace/sales/${encodeURIComponent(orderId)}/payment-documents`, { method: 'GET', cache: 'no-store' }))
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
      openBuyerDispute: async (orderId: string, input: OpenMarketplaceOrderDisputeInput) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceOrderPresenter>>(`/marketplace/orders/${encodeURIComponent(orderId)}/disputes`, { method: 'POST', body: input, cache: 'no-store' }))
      },
      openSellerDispute: async (orderId: string, input: OpenMarketplaceOrderDisputeInput) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceOrderPresenter>>(`/marketplace/sales/${encodeURIComponent(orderId)}/disputes`, { method: 'POST', body: input, cache: 'no-store' }))
      },
      proposeSellerRefund: async (orderId: string, input: ProposeMarketplaceOrderRefundInput) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceOrderPresenter>>(`/marketplace/sales/${encodeURIComponent(orderId)}/refund-proposals`, { method: 'POST', body: input, cache: 'no-store' }))
      },
      createReview: async (orderId: string, input: CreateMarketplaceServiceReviewInput) => {
        return await unwrap(api<MarketplaceEnvelope<MarketplaceServiceReviewPresenter>>(`/marketplace/orders/${encodeURIComponent(orderId)}/reviews`, { method: 'POST', body: input, cache: 'no-store' }))
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
