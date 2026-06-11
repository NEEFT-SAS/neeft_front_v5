<template>
  <MarketplaceServiceDetailLayout>
    <template #hero>
      <MarketplaceServiceDetailHero
        :service="service"
        :games="serviceGames"
        :rating="serviceReviewRating"
        :review-count="serviceReviewCount"
        :is-owner="isServiceOwner"
        @contact="requestQuote"
        @share="shareService"
        @edit="isServiceEditOpen = true"
        @delete="isDeleteServiceOpen = true"
      />
    </template>

    <MarketplaceServiceDescriptionWidget :paragraphs="descriptionParagraphs" />

    <MarketplaceServiceGalleryWidget
      v-if="serviceGalleryImages.length"
      :images="serviceGalleryImages"
      :service-name="service.name"
    />

    <MarketplaceServiceReviewsWidget
      :reviews="serviceReviews"
      :rating="serviceReviewRating"
      :review-count="serviceReviewCount"
      :pending="areServiceReviewsPending"
      :error="serviceReviewsError"
    />

    <template #sidebar>
      <MarketplaceServiceOffersWidget
        v-model:selected-offer-id="selectedOfferId"
        :offers="serviceOffers"
        :selected-offer="selectedOffer"
        @order="openOrderModal"
      />

      <MarketplaceServiceSellerWidget
        :seller-name="sellerName"
        :seller-avatar-src="sellerAvatarSrc"
        :seller-summary="sellerSummary"
        @contact="requestQuote"
      />
    </template>

    <template #overlays>
      <MarketplaceOrderModal
        v-if="selectedOffer"
        v-model="isOrderModalOpen"
        :service="service"
        :offer="selectedOffer"
      />
      <HeaderServiceProposalModal
        v-model="isServiceEditOpen"
        :service="service"
        :refresh-on-saved="false"
        @saved="handleServiceSaved"
      />
      <MarketplaceServiceDeleteModal
        v-model="isDeleteServiceOpen"
        :service="service"
        :deleting="isDeletingService"
        @confirm="deleteService"
      />
    </template>
  </MarketplaceServiceDetailLayout>
</template>

<script setup lang="ts">
import type { MarketplaceServiceLinePresenter, MarketplaceServicePresenter } from '~/plugins/marketplace-api'
import { getSafeMarketplaceImageSrc, isSafeMarketplaceImageSrc } from '~/utils/marketplaceImages'

definePageMeta({
  layout: 'app'
})

const route = useRoute()
const marketplaceToast = useMarketplaceToasts()
const sessionStore = useSessionStore()
const { $marketplaceAPI } = useNuxtApp()
const routeSlug = String(Array.isArray(route.params.slug) ? route.params.slug[0] || '' : route.params.slug || '')

const getDescriptionParagraphs = (description: string) => {
  return description.split(/\n{2,}/).map(paragraph => paragraph.trim()).filter(Boolean)
}

const getShortDescription = (description: string) => {
  const normalized = description.replace(/\s+/g, ' ').trim()
  if (normalized.length <= 180) return normalized
  return `${normalized.slice(0, 177).trim()}...`
}

if (!routeSlug) {
  throw createError({ statusCode: 404, statusMessage: 'Service marketplace introuvable' })
}

const { data: apiService, error: serviceError } = await useAsyncData(`marketplace-service-${routeSlug}`, () => $marketplaceAPI.services.get(routeSlug))

if (serviceError.value || !apiService.value) {
  const statusCode = Number((serviceError.value as { statusCode?: unknown } | null)?.statusCode || 404)
  throw createError({ statusCode, statusMessage: 'Service marketplace introuvable' })
}

const { data: serviceReviewsResponse, pending: areServiceReviewsPending, error: serviceReviewsError } = await useAsyncData(`marketplace-service-reviews-${routeSlug}`, () => {
  return $marketplaceAPI.reviews.listForService(routeSlug, { limit: 8 })
})

const service = computed(() => apiService.value as MarketplaceServicePresenter)
const selectedOfferId = ref('')
const isOrderModalOpen = ref(false)
const isServiceEditOpen = ref(false)
const isDeleteServiceOpen = ref(false)
const isDeletingService = ref(false)

const serviceOffers = computed(() => service.value.services || [])

watch(serviceOffers, (offers) => {
  if (!offers.length) return
  if (!offers.some(offer => offer.id === selectedOfferId.value)) {
    selectedOfferId.value = offers[0].id
  }
}, { immediate: true })

const selectedOffer = computed<MarketplaceServiceLinePresenter | undefined>(() => {
  return serviceOffers.value.find(offer => offer.id === selectedOfferId.value) || serviceOffers.value[0]
})

const descriptionParagraphs = computed(() => getDescriptionParagraphs(service.value.description))
const serviceShortDescription = computed(() => getShortDescription(service.value.description))
const sellerName = computed(() => service.value.seller?.username || 'Vendeur marketplace')
const sellerAvatarSrc = computed(() => service.value.seller?.profilePicture || '')
const isServiceOwner = computed(() => {
  const sellerSlug = service.value.seller?.slug
  return Boolean(sessionStore.isLoggedIn && sellerSlug && sessionStore.mySlug && sellerSlug === sessionStore.mySlug)
})
const serviceGames = computed(() => service.value.rscGames || [])
const serviceGalleryImages = computed(() => (service.value.images || []).filter(isSafeMarketplaceImageSrc))
const serviceReviews = computed(() => serviceReviewsResponse.value?.data || [])
const serviceReviewRating = computed(() => Number(serviceReviewsResponse.value?.meta?.ratingAvg ?? service.value.ratingAvg ?? 0))
const serviceReviewCount = computed(() => Number(serviceReviewsResponse.value?.meta?.total ?? service.value.ratingCount ?? 0))
const sellerSummary = computed(() => {
  return `${sellerName.value} est la personne qui realise ce service. Contacte le vendeur pour clarifier le besoin avant de commander.`
})

const requestQuote = () => {
  marketplaceToast.services.contactRequestSent(sellerName.value, service.value.name)
}

const openOrderModal = () => {
  if (!selectedOffer.value) return
  isOrderModalOpen.value = true
}

const shareService = async () => {
  if (!import.meta.client) return

  const url = window.location.href

  try {
    if (navigator.share) {
      await navigator.share({
        title: service.value.name,
        text: serviceShortDescription.value,
        url
      })
      return
    }

    await navigator.clipboard?.writeText(url)

    marketplaceToast.services.linkCopied()
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return

    marketplaceToast.services.shareFailed()
  }
}

const refreshMarketplaceServiceViews = async (savedService?: MarketplaceServicePresenter) => {
  if (savedService) {
    apiService.value = savedService

    if (savedService.slug && savedService.slug !== routeSlug) {
      await navigateTo(`/marketplace/${savedService.slug}`)
    }

    return
  }

  await refreshNuxtData(['marketplace-services', 'marketplace-services-mine'])
}

const handleServiceSaved = async (savedService: MarketplaceServicePresenter) => {
  await refreshMarketplaceServiceViews(savedService)
}

const deleteService = async (targetService: MarketplaceServicePresenter) => {
  if (!isServiceOwner.value) return

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

onMounted(() => {
  void sessionStore.bootstrap()
})

useSeoMeta({
  title: () => service.value.name,
  description: () => serviceShortDescription.value,
  ogTitle: () => service.value.name,
  ogDescription: () => serviceShortDescription.value,
  ogImage: () => getSafeMarketplaceImageSrc(service.value.bannerUrl) || undefined,
  twitterCard: 'summary_large_image',
  twitterImage: () => getSafeMarketplaceImageSrc(service.value.bannerUrl) || undefined
})
</script>
