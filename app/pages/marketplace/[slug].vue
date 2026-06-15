<template>
  <MarketplaceServiceDetailLayout>
    <template #hero>
      <MarketplaceServiceDetailHero
        :service="detail.service"
        :rating="detail.reviewRating"
        :review-count="detail.reviewCount"
        :is-owner="detail.isOwner"
        @contact="detail.requestQuote"
        @share="detail.shareService"
        @edit="detail.isServiceEditOpen = true"
        @delete="detail.isDeleteServiceOpen = true"
      />
    </template>

    <MarketplaceServiceDescriptionWidget :description="detail.service.description" />

    <MarketplaceServiceGalleryWidget
      :images="detail.service.images || []"
      :service-name="detail.service.name"
    />

    <MarketplaceServiceReviewsWidget
      :reviews="detail.reviews"
      :rating="detail.reviewRating"
      :review-count="detail.reviewCount"
      :pending="detail.areReviewsPending"
      :error="detail.reviewsError"
      :seller-profile-id="detail.service.sellerProfileId"
      @changed="detail.refreshReviews"
    />

    <template #sidebar>
      <MarketplaceServiceOffersWidget
        v-model:selected-offer-id="detail.selectedOfferId"
        :offers="detail.service.services || []"
        :selected-offer="detail.selectedOffer"
        :can-order="detail.canOrder"
        @order="detail.openOrderModal"
      />

      <MarketplaceServiceSellerWidget
        :seller="detail.service.seller"
        @contact="detail.requestQuote"
      />
    </template>

    <template #overlays>
      <MarketplaceOrderModal
        v-if="detail.selectedOffer && detail.canOrder"
        v-model="detail.isOrderModalOpen"
        :service="detail.service"
        :offer="detail.selectedOffer"
      />
      <HeaderServiceProposalModal
        v-model="detail.isServiceEditOpen"
        :service="detail.service"
        :refresh-on-saved="false"
        @saved="detail.handleServiceSaved"
      />
      <MarketplaceServiceDeleteModal
        v-model="detail.isDeleteServiceOpen"
        :service="detail.service"
        :deleting="detail.isDeletingService"
        @confirm="detail.deleteService"
      />
      <MarketplaceOrderMessageModal
        v-model="detail.isContactModalOpen"
        mode="contact"
        :counterpart-name="detail.service.seller?.username || 'vendeur'"
        :processing="detail.isContacting"
        @confirm="detail.sendContactMessage"
      />
    </template>
  </MarketplaceServiceDetailLayout>
</template>

<script setup lang="ts">
import type { MarketplaceServiceLinePresenter, MarketplaceServicePresenter } from '~/plugins/marketplace-api'

const REVIEWS_LIMIT = 8
const SERVICE_NOT_FOUND_MESSAGE = 'Service marketplace introuvable'

const normalizeRouteParam = (value: unknown) => {
  return String(Array.isArray(value) ? value[0] || '' : value || '')
}

const getShortDescription = (description: string) => {
  const normalized = description.replace(/\s+/g, ' ').trim()
  if (normalized.length <= 180) return normalized

  return `${normalized.slice(0, 177).trim()}...`
}

definePageMeta({
  layout: 'app'
})

const route = useRoute()
const marketplaceToast = useMarketplaceToasts()
const config = useConfig()
const sessionStore = useSessionStore()
const { $marketplaceAPI, $messagingAPI } = useNuxtApp()
const routeSlug = normalizeRouteParam(route.params.slug)

if (!routeSlug) {
  throw createError({ statusCode: 404, statusMessage: SERVICE_NOT_FOUND_MESSAGE })
}

const { data, error } = await useAsyncData(`marketplace-service-${routeSlug}`, () => {
  return $marketplaceAPI.services.get(routeSlug)
})

if (error.value || !data.value) {
  const statusCode = Number((error.value as { statusCode?: unknown } | null)?.statusCode || 404)
  throw createError({ statusCode, statusMessage: SERVICE_NOT_FOUND_MESSAGE })
}

const service = ref(data.value as MarketplaceServicePresenter)
const selectedOfferId = ref('')
const selectedOffer = ref<MarketplaceServiceLinePresenter>()
const isOwner = ref(false)
const isOrderModalOpen = ref(false)
const isServiceEditOpen = ref(false)
const isDeleteServiceOpen = ref(false)
const isDeletingService = ref(false)
const isContactModalOpen = ref(false)
const isContacting = ref(false)

const reviewsResponse = await useAsyncData(`marketplace-service-reviews-${routeSlug}`, () => {
  return $marketplaceAPI.reviews.listForService(routeSlug, { limit: REVIEWS_LIMIT })
})

const reviews = ref(reviewsResponse.data.value?.data || [])
const reviewRating = ref(Number(reviewsResponse.data.value?.meta?.ratingAvg ?? service.value.ratingAvg ?? 0))
const reviewCount = ref(Number(reviewsResponse.data.value?.meta?.total ?? service.value.ratingCount ?? 0))

const refreshReviews = async () => {
  await reviewsResponse.refresh()
  reviews.value = reviewsResponse.data.value?.data || []
  reviewRating.value = Number(reviewsResponse.data.value?.meta?.ratingAvg ?? 0)
  reviewCount.value = Number(reviewsResponse.data.value?.meta?.total ?? 0)
}

const syncSelectedOffer = () => {
  const offers = service.value.services || []
  selectedOffer.value = offers.find(offer => offer.id === selectedOfferId.value) || offers[0]

  if (selectedOffer.value && selectedOfferId.value !== selectedOffer.value.id) {
    selectedOfferId.value = selectedOffer.value.id
  }
}

const syncOwner = () => {
  const currentProfileId = String(sessionStore.me?.profileId || '')
  const sellerProfileId = String(service.value.sellerProfileId || '')
  const sellerSlug = service.value.seller?.slug
  const ownsByProfileId = Boolean(currentProfileId && sellerProfileId && currentProfileId === sellerProfileId)
  const ownsBySlug = Boolean(sellerSlug && sessionStore.mySlug && sellerSlug === sessionStore.mySlug)

  isOwner.value = Boolean(sessionStore.isLoggedIn && (ownsByProfileId || ownsBySlug))
}

const canOrder = computed(() => sessionStore.isLoggedIn && !isOwner.value)

syncSelectedOffer()
syncOwner()

watch(selectedOfferId, syncSelectedOffer)
watch(() => [sessionStore.isLoggedIn, sessionStore.me?.profileId, sessionStore.mySlug, service.value.sellerProfileId, service.value.seller?.slug], syncOwner)

const requestQuote = () => {
  isContactModalOpen.value = true
}

const sendContactMessage = async (content: string) => {
  if (!service.value.sellerProfileId) return
  isContacting.value = true
  try {
    const conversation = await $messagingAPI.startConversation({
      targetType: 'PLAYER',
      targetId: service.value.sellerProfileId,
      content
    })
    isContactModalOpen.value = false
    await navigateTo({ path: '/messages', query: { conversation: conversation.conversationId } })
  } finally {
    isContacting.value = false
  }
}

const openOrderModal = () => {
  if (!selectedOffer.value || !canOrder.value) return

  isOrderModalOpen.value = true
}

const shareService = async () => {
  if (!import.meta.client) return

  const url = window.location.href

  try {
    if (navigator.share) {
      await navigator.share({
        title: service.value.name,
        text: getShortDescription(service.value.description),
        url
      })
      return
    }

    await navigator.clipboard?.writeText(url)
    marketplaceToast.services.linkCopied()
  } catch (shareError) {
    if (shareError instanceof DOMException && shareError.name === 'AbortError') return

    marketplaceToast.services.shareFailed()
  }
}

const handleServiceSaved = async (savedService: MarketplaceServicePresenter) => {
  service.value = savedService
  data.value = savedService
  syncSelectedOffer()
  syncOwner()

  if (savedService.slug && savedService.slug !== routeSlug) {
    await navigateTo(`/marketplace/${savedService.slug}`)
  }
}

const deleteService = async (targetService: MarketplaceServicePresenter) => {
  if (!isOwner.value) return

  isDeletingService.value = true

  try {
    await $marketplaceAPI.services.delete(targetService.id)
    await refreshNuxtData(['marketplace-services', 'marketplace-services-mine', `marketplace-service-${routeSlug}`])
    marketplaceToast.services.deleted(targetService.name)
    isDeleteServiceOpen.value = false
    await navigateTo('/marketplace/services')
  } catch {
    marketplaceToast.services.deleteFailed()
  } finally {
    isDeletingService.value = false
  }
}

onMounted(async () => {
  await sessionStore.bootstrap()
  syncOwner()
})

useSeoMeta({
  title: () => service.value.name,
  description: () => getShortDescription(service.value.description),
  ogTitle: () => service.value.name,
  ogDescription: () => getShortDescription(service.value.description),
  ogImage: () => config.marketplace.service.getServiceBannerUrl(service.value.bannerUrl),
  twitterCard: 'summary_large_image',
  twitterImage: () => config.marketplace.service.getServiceBannerUrl(service.value.bannerUrl)
})

const detail = reactive({
  service,
  selectedOfferId,
  selectedOffer,
  canOrder,
  reviews,
  reviewRating,
  reviewCount,
  isOwner,
  isOrderModalOpen,
  isServiceEditOpen,
  isDeleteServiceOpen,
  isDeletingService,
  isContactModalOpen,
  isContacting,
  areReviewsPending: reviewsResponse.pending,
  reviewsError: reviewsResponse.error,
  requestQuote,
  sendContactMessage,
  openOrderModal,
  shareService,
  handleServiceSaved,
  deleteService,
  refreshReviews
})
</script>
