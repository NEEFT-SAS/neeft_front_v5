<template>
  <main class="marketplace-service-profile-page" aria-labelledby="marketplace-service-title">
    <section class="marketplace-service-profile-hero">
      <div class="marketplace-service-profile-shell">
        <div class="marketplace-service-profile-hero__banner">
          <MarketplaceSafeImage
            class="marketplace-service-profile-hero__image"
            empty-class="marketplace-service-profile-hero__image--empty"
            :src="service.bannerUrl"
            :alt="`Banniere du service ${service.name}`"
            width="1440"
            height="360"
            loading="eager"
            decoding="async"
          />

          <div class="marketplace-service-profile-hero__back">
            <CustomLink
              label="Marketplace"
              to="/marketplace"
              left-icon="lucide:arrow-left"
              theme="app"
              variant="outlined"
              color="secondary"
              size="sm"
            />
          </div>

          <div v-if="serviceGames.length" class="marketplace-service-profile-hero__games" aria-label="Jeux concernes">
            <span v-for="game in serviceGames" :key="game.id" class="marketplace-service-profile-hero__game">
              <Icon v-if="game.icon" :name="game.icon" aria-hidden="true" />
              {{ game.shortName || game.name }}
            </span>
          </div>

          <div class="marketplace-service-profile-hero__identity">
            <span class="marketplace-service-profile-hero__logo" aria-hidden="true">
              <Icon name="lucide:store" />
            </span>

            <div class="marketplace-service-profile-hero__copy">
              <p class="marketplace-service-profile-eyebrow">
                Marketplace
              </p>
              <h1 id="marketplace-service-title">
                {{ service.name }}
              </h1>
              <p>{{ serviceShortDescription }}</p>

              <ul class="marketplace-service-profile-hero__meta" aria-label="Informations du service">
                <li>
                  <MarketplaceRating
                    :rating="service.ratingAvg"
                    :review-count="service.ratingCount"
                    :show-reviews="false"
                  />
                  <span>{{ service.ratingCount }} avis</span>
                </li>
                <li>{{ getStatusLabel(service.status) }}</li>
                <li>{{ serviceOfferCountLabel }}</li>
              </ul>
            </div>

            <div class="marketplace-service-profile-hero__actions" aria-label="Actions principales">
              <CustomButton
                label=""
                left-icon="lucide:message-circle"
                theme="app"
                variant="filled"
                color="primary"
                size="sm"
                shape="circle"
                aria-label="Contacter le vendeur"
                @click="requestQuote"
              />
              <CustomButton
                label=""
                left-icon="lucide:share-2"
                theme="app"
                variant="outlined"
                color="secondary"
                size="sm"
                shape="circle"
                aria-label="Partager le service"
                @click="shareService"
              />
              <CustomButton
                v-if="isServiceOwner"
                label=""
                left-icon="lucide:pencil"
                theme="app"
                variant="outlined"
                color="secondary"
                size="sm"
                shape="circle"
                aria-label="Modifier le service"
                @click="isServiceEditOpen = true"
              />
              <CustomButton
                v-if="isServiceOwner"
                label=""
                left-icon="lucide:trash-2"
                theme="app"
                variant="outlined"
                color="secondary"
                size="sm"
                shape="circle"
                aria-label="Supprimer le service"
                @click="isDeleteServiceOpen = true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="marketplace-service-profile-shell marketplace-service-profile-layout">
      <div class="marketplace-service-profile-main">
        <BaseProfileSection
          title="Description"
          eyebrow="Service"
          surface="plain"
          id="marketplace-service-description"
        >
          <div class="marketplace-service-profile-copy">
            <p v-for="paragraph in descriptionParagraphs" :key="paragraph">
              {{ paragraph }}
            </p>
          </div>
        </BaseProfileSection>

        <BaseProfileSection
          v-if="serviceGalleryImages.length"
          title="Images"
          eyebrow="Portfolio"
          surface="plain"
          id="marketplace-service-gallery"
        >
          <ul class="marketplace-service-profile-gallery" aria-label="Images du service">
            <li v-for="image in serviceGalleryImages" :key="image">
              <MarketplaceSafeImage
                :src="image"
                :alt="`Image du service ${service.name}`"
                width="520"
                height="320"
                loading="lazy"
                decoding="async"
              />
            </li>
          </ul>
        </BaseProfileSection>

        <BaseProfileSection
          v-if="relatedServices.length"
          title="Services similaires"
          eyebrow="Marketplace"
          surface="plain"
          id="marketplace-service-related"
        >
          <ul class="marketplace-service-profile-related">
            <li v-for="relatedService in relatedServices" :key="relatedService.slug">
              <NuxtLinkLocale
                class="marketplace-service-profile-related__link"
                :to="`/marketplace/${relatedService.slug}`"
                :aria-label="`Voir le service ${relatedService.title}`"
              >
                <MarketplaceSafeImage
                  :src="relatedService.coverImageUrl"
                  :alt="`Banniere du service ${relatedService.title}`"
                  empty-class="marketplace-service-profile-related__empty"
                  width="320"
                  height="160"
                  loading="lazy"
                  decoding="async"
                />
                <span>
                  <small v-if="getRelatedServiceCategoryLabel(relatedService)">{{ getRelatedServiceCategoryLabel(relatedService) }}</small>
                  <strong>{{ relatedService.title }}</strong>
                </span>
                <em v-if="getRelatedServicePriceLabel(relatedService)">{{ getRelatedServicePriceLabel(relatedService) }}</em>
              </NuxtLinkLocale>
            </li>
          </ul>
        </BaseProfileSection>

      </div>

      <aside class="marketplace-service-profile-sidebar" aria-label="Resume du service">
        <section class="marketplace-service-profile-panel marketplace-service-profile-offers">
          <header class="marketplace-service-profile-panel__header">
            <div>
              <p class="marketplace-service-profile-eyebrow">Commande</p>
              <h2>Choisir une offre</h2>
            </div>
            <strong v-if="priceLabel">{{ priceLabel }}</strong>
          </header>

          <div class="marketplace-service-profile-offers__list" role="radiogroup" aria-label="Offres disponibles">
            <label
              v-for="offer in serviceOffers"
              :key="offer.id"
              class="marketplace-service-profile-offer"
              :data-selected="offer.id === selectedOfferId ? 'true' : 'false'"
            >
              <input
                v-model="selectedOfferId"
                type="radio"
                name="marketplace-service-offer"
                :value="offer.id"
              >
              <span class="marketplace-service-profile-offer__check" aria-hidden="true">
                <Icon v-if="offer.id === selectedOfferId" name="lucide:check" />
              </span>
              <span class="marketplace-service-profile-offer__body">
                <strong>{{ offer.name }}</strong>
                <span>{{ offer.description }}</span>
              </span>
              <strong class="marketplace-service-profile-offer__price">
                {{ formatMarketplacePrice(offer.price) }}
              </strong>
            </label>
          </div>

          <CustomButton
            label="Commander"
            left-icon="lucide:shopping-bag"
            theme="app"
            variant="filled"
            color="primary"
            size="lg"
            :disabled="!selectedOffer"
            @click="openOrderModal"
          />
        </section>

        <section class="marketplace-service-profile-panel marketplace-service-profile-seller-card">
          <header class="marketplace-service-profile-seller-card__header">
            <CustomAvatar
              :name="sellerName"
              :alt="`Avatar de ${sellerName}`"
              size="xl"
              shape="square"
              theme="app"
              color="primary"
            />
            <div class="marketplace-service-profile-seller-card__identity">
              <p class="marketplace-service-profile-eyebrow">Vendeur</p>
              <h2>{{ sellerName }}</h2>
              <span>Vendeur marketplace</span>
            </div>
          </header>

          <p class="marketplace-service-profile-seller-card__summary">
            {{ sellerSummary }}
          </p>

          <dl class="marketplace-service-profile-seller-facts">
            <div v-for="fact in sellerFacts" :key="fact.label">
              <dt>
                <Icon :name="fact.icon" aria-hidden="true" />
                {{ fact.label }}
              </dt>
              <dd>{{ fact.value }}</dd>
            </div>
          </dl>

          <CustomButton
            label="Contacter"
            left-icon="lucide:message-circle"
            theme="app"
            variant="outlined"
            color="secondary"
            size="md"
            @click="requestQuote"
          />
        </section>
      </aside>
    </div>

    <MarketplaceOrderModal
      v-if="selectedOffer"
      v-model="isOrderModalOpen"
      :service="service"
      :offer="selectedOffer"
    />
    <HeaderServiceProposalModal
      v-model="isServiceEditOpen"
      :service="service"
      @saved="handleServiceSaved"
    />
    <MarketplaceServiceDeleteModal
      v-model="isDeleteServiceOpen"
      :service="service"
      :deleting="isDeletingService"
      @confirm="deleteService"
    />
  </main>
</template>

<script setup lang="ts">
import type { MarketplaceServiceLinePresenter, MarketplaceServiceListItemPresenter, MarketplaceServicePresenter, MarketplaceServiceStatus } from '~/plugins/marketplace-api'
import { getSafeMarketplaceImageSrc, isSafeMarketplaceImageSrc } from '~/utils/marketplaceImages'

definePageMeta({
  layout: 'app'
})

const route = useRoute()
const toast = useToast()
const sessionStore = useSessionStore()
const { $marketplaceAPI } = useNuxtApp()
const routeSlug = String(Array.isArray(route.params.slug) ? route.params.slug[0] || '' : route.params.slug || '')

const statusLabels: Record<MarketplaceServiceStatus, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publie',
  ARCHIVED: 'Archive'
}

const formatMarketplacePrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(price)
}

const getDescriptionParagraphs = (description: string) => {
  return description.split(/\n{2,}/).map(paragraph => paragraph.trim()).filter(Boolean)
}

const getShortDescription = (description: string) => {
  const normalized = description.replace(/\s+/g, ' ').trim()
  if (normalized.length <= 180) return normalized
  return `${normalized.slice(0, 177).trim()}...`
}

const getStatusLabel = (status: MarketplaceServiceStatus) => statusLabels[status]

if (!routeSlug) {
  throw createError({ statusCode: 404, statusMessage: 'Service marketplace introuvable' })
}

const { data: apiService, error: serviceError, refresh: refreshService } = await useAsyncData(`marketplace-service-${routeSlug}`, () => $marketplaceAPI.services.get(routeSlug))

if (serviceError.value || !apiService.value) {
  const statusCode = Number((serviceError.value as { statusCode?: unknown } | null)?.statusCode || 404)
  throw createError({ statusCode, statusMessage: 'Service marketplace introuvable' })
}

const { data: relatedServiceData } = await useAsyncData(`marketplace-service-related-${routeSlug}`, async () => {
  const response = await $marketplaceAPI.services.search({ limit: 12 })
  return response.data
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

const formattedRating = computed(() => Number(service.value.ratingAvg || 0).toFixed(1).replace('.', ','))
const priceLabel = computed(() => selectedOffer.value ? formatMarketplacePrice(Number(selectedOffer.value.price) || 0) : '')
const descriptionParagraphs = computed(() => getDescriptionParagraphs(service.value.description))
const serviceShortDescription = computed(() => getShortDescription(service.value.description))
const sellerName = computed(() => service.value.seller?.username || 'Vendeur marketplace')
const isServiceOwner = computed(() => {
  const sellerSlug = service.value.seller?.slug
  return Boolean(sessionStore.isLoggedIn && sellerSlug && sessionStore.mySlug && sellerSlug === sessionStore.mySlug)
})
const serviceGames = computed(() => service.value.rscGames || [])
const serviceGalleryImages = computed(() => (service.value.images || []).filter(isSafeMarketplaceImageSrc))
const serviceOfferCountLabel = computed(() => {
  const count = serviceOffers.value.length
  return `${count} prestation${count > 1 ? 's' : ''}`
})
const relatedServices = computed(() => (relatedServiceData.value || [])
  .filter(item => item.slug !== service.value.slug)
  .slice(0, 3))

const getRelatedServiceCategoryLabel = (relatedService: MarketplaceServiceListItemPresenter) => {
  return relatedService.rscCategories?.[0]?.label || ''
}

const getRelatedServicePriceLabel = (relatedService: MarketplaceServiceListItemPresenter) => {
  const prices = (relatedService.offers || [])
    .map(offer => Number(offer.price))
    .filter(price => Number.isFinite(price))

  return prices.length ? formatMarketplacePrice(Math.min(...prices)) : ''
}

const sellerSummary = computed(() => {
  return `${sellerName.value} propose ${serviceOfferCountLabel.value.toLocaleLowerCase('fr-FR')} sur la marketplace.`
})

const sellerFacts = computed(() => [
  { label: 'Commandes', value: String(service.value.ordersCount), icon: 'lucide:shopping-bag' },
  { label: 'Statut', value: getStatusLabel(service.value.status), icon: 'lucide:badge-check' },
  { label: 'Note', value: `${formattedRating.value}/5 - ${service.value.ratingCount} avis`, icon: 'lucide:star' }
])

const requestQuote = () => {
  toast.add({
    title: 'Demande de contact envoyee',
    desc: `${sellerName.value} pourra te repondre a propos de ${service.value.name}.`,
    icon: 'lucide:message-circle',
    variant: 'success'
  })
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

    toast.add({
      title: 'Lien copie',
      desc: 'Le lien du service a ete copie.',
      icon: 'lucide:share-2',
      variant: 'success'
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return

    toast.add({
      title: 'Partage indisponible',
      desc: 'Impossible de partager ce service pour le moment.',
      icon: 'lucide:circle-alert',
      variant: 'error'
    })
  }
}

const refreshMarketplaceServiceViews = async (savedService?: MarketplaceServicePresenter) => {
  const refreshKeys = ['marketplace-services', 'marketplace-services-mine', `marketplace-service-${routeSlug}`]

  if (savedService) {
    apiService.value = savedService

    if (savedService.slug && savedService.slug !== routeSlug) {
      refreshKeys.push(`marketplace-service-${savedService.slug}`)
    }
  }

  await refreshNuxtData(refreshKeys)

  if (savedService?.slug && savedService.slug !== routeSlug) {
    await navigateTo(`/marketplace/${savedService.slug}`)
    return
  }

  await refreshService()
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
    toast.add({
      title: 'Service supprime',
      desc: `${targetService.name} a ete retire de la marketplace.`,
      icon: 'lucide:trash-2',
      variant: 'success'
    })
    isDeleteServiceOpen.value = false
    await navigateTo('/marketplace/services')
  } catch {
    toast.add({
      title: 'Suppression impossible',
      desc: 'Le service n a pas pu etre supprime.',
      icon: 'lucide:circle-alert',
      variant: 'error'
    })
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

<style scoped>
.marketplace-service-profile-page {
  --profile-unit: var(--unit);
  --profile-space-1: var(--space-1);
  --profile-space-2: var(--space-2);
  --profile-space-3: var(--space-3);
  --profile-space-4: calc(var(--profile-unit) * 4);
  --profile-space-5: calc(var(--profile-unit) * 5);
  --profile-space-6: calc(var(--profile-unit) * 6);
  --profile-space-8: calc(var(--profile-unit) * 8);
  --profile-space-10: calc(var(--profile-unit) * 10);
  --profile-space-fluid: clamp(var(--profile-space-3), calc(var(--profile-space-2) + 3vw), var(--profile-space-8));
  --profile-content-max: calc(var(--profile-unit) * 140);
  --profile-sidebar-width: calc(var(--profile-unit) * 40);
  --profile-banner-height: calc(var(--profile-unit) * 44);
  --profile-logo-size: calc(var(--profile-unit) * 15);
  --profile-icon-size: calc(var(--profile-unit) * 3);
  --profile-radius: var(--radius);
  --profile-radius-round: var(--radius-round);
  --profile-border: var(--border);
  --profile-font-title: calc(var(--profile-unit) * 5.5);
  --profile-font-section: calc(var(--profile-unit) * 2.75);
  --profile-font-body: calc(var(--profile-unit) * 2);
  --profile-font-small: calc(var(--profile-unit) * 1.75);
  --profile-font-label: calc(var(--profile-unit) * 1.5);
  --profile-line-tight: var(--line-tight);
  --profile-line-title: var(--line-title);
  --profile-line-body: var(--line-base);
  --profile-color-bg: var(--color-bg);
  --profile-color-panel: var(--color-surface);
  --profile-color-bg-soft: color-mix(in oklch, var(--profile-color-panel) 62%, var(--profile-color-bg));
  --profile-color-panel-strong: color-mix(in oklch, var(--profile-color-panel) 82%, var(--profile-color-bg));
  --profile-color-border: var(--app-color-line);
  --profile-color-text: var(--color-text);
  --profile-color-muted: var(--app-color-muted);
  --profile-color-subtle: var(--app-color-subtle);
  --profile-color-accent: var(--color-accent);
  --profile-color-danger: var(--color-danger);
  --profile-color-focus: var(--color-accent);
  --profile-color-shadow: var(--color-shadow);
  --profile-color-transparent: var(--color-transparent);
  --profile-color-overlay-mid: oklch(0% 0 0 / 0.36);
  --profile-hit-size: calc(var(--profile-unit) * 5);
  --search-unit: var(--profile-unit);
  --search-font-small: var(--profile-font-small);
  --search-line-tight: var(--profile-line-tight);
  --search-color-text: var(--profile-color-text);
  --search-color-muted: var(--profile-color-muted);
  --search-color-subtle: var(--profile-color-subtle);
  --search-color-accent: var(--profile-color-accent);
  --search-color-transparent: var(--profile-color-transparent);
  min-height: calc(100vh - var(--app-header-height));
  background-color: var(--profile-color-bg);
  color: var(--profile-color-text);
  font-family: var(--font-ui, ui-sans-serif, system-ui, sans-serif);
  letter-spacing: 0;
}

.marketplace-service-profile-page *,
.marketplace-service-profile-page *::before,
.marketplace-service-profile-page *::after {
  box-sizing: border-box;
  min-width: 0;
  letter-spacing: 0;
}

.marketplace-service-profile-shell {
  width: min(calc(100% - (var(--profile-space-fluid) * 2)), var(--profile-content-max));
  margin: 0 auto;
}

.marketplace-service-profile-hero {
  padding: var(--profile-space-8) 0 var(--profile-space-4);
  background-color: var(--profile-color-bg-soft);
}

.marketplace-service-profile-hero__banner {
  position: relative;
  height: var(--profile-banner-height);
  overflow: hidden;
  border: var(--profile-border) solid var(--profile-color-border);
  border-radius: var(--profile-radius);
  background-color: var(--profile-color-panel);
}

.marketplace-service-profile-hero__banner::after {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, oklch(0% 0 0 / 0.05), oklch(0% 0 0 / 0.64));
  content: "";
}

.marketplace-service-profile-hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.marketplace-service-profile-hero__image--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--profile-color-subtle);
  background-color: var(--profile-color-panel-strong);
}

.marketplace-service-profile-hero__image--empty svg {
  width: calc(var(--profile-unit) * 8);
  height: calc(var(--profile-unit) * 8);
}

.marketplace-service-profile-hero__back {
  position: absolute;
  top: var(--profile-space-3);
  left: var(--profile-space-3);
  z-index: 3;
}

.marketplace-service-profile-hero__games {
  position: absolute;
  top: var(--profile-space-3);
  right: var(--profile-space-3);
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  gap: var(--profile-space-1);
  justify-content: end;
  max-width: min(62%, calc(var(--profile-unit) * 58));
}

.marketplace-service-profile-hero__game {
  display: inline-flex;
  min-height: calc(var(--profile-unit) * 4.5);
  align-items: center;
  gap: var(--profile-space-1);
  padding: 0 var(--profile-space-2);
  border: var(--profile-border) solid color-mix(in oklch, var(--profile-color-border) 72%, var(--profile-color-transparent));
  border-radius: var(--profile-radius-round);
  background-color: color-mix(in oklch, var(--profile-color-panel) 72%, var(--profile-color-transparent));
  color: var(--profile-color-text);
  font-size: var(--profile-font-label);
  font-weight: 800;
  line-height: var(--profile-line-tight);
  box-shadow: 0 var(--profile-space-2) var(--profile-space-5) var(--profile-color-shadow);
  backdrop-filter: blur(calc(var(--profile-unit) * 1.5));
}

.marketplace-service-profile-hero__game svg {
  width: calc(var(--profile-unit) * 2);
  height: calc(var(--profile-unit) * 2);
  color: var(--profile-color-accent);
}

.marketplace-service-profile-hero__identity {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--profile-space-4);
  align-items: end;
  max-height: 100%;
  padding: var(--profile-space-4);
  overflow: hidden;
  background: linear-gradient(180deg, oklch(0% 0 0 / 0), oklch(0% 0 0 / 0.42));
}

.marketplace-service-profile-hero__logo {
  display: inline-flex;
  width: var(--profile-logo-size);
  height: var(--profile-logo-size);
  min-width: var(--profile-logo-size);
  align-items: center;
  justify-content: center;
  border: var(--profile-border) solid color-mix(in oklch, var(--profile-color-border) 74%, var(--profile-color-transparent));
  border-radius: var(--profile-radius);
  background-color: color-mix(in oklch, var(--profile-color-panel) 88%, var(--profile-color-transparent));
  color: var(--profile-color-accent);
  box-shadow: 0 var(--profile-space-3) var(--profile-space-8) var(--profile-color-shadow);
}

.marketplace-service-profile-hero__logo svg {
  width: calc(var(--profile-logo-size) * 0.38);
  height: calc(var(--profile-logo-size) * 0.38);
}

.marketplace-service-profile-hero__copy {
  display: grid;
  gap: var(--profile-space-1);
}

.marketplace-service-profile-eyebrow,
.marketplace-service-profile-hero__copy h1,
.marketplace-service-profile-hero__copy p,
.marketplace-service-profile-hero__meta,
.marketplace-service-profile-copy p,
.marketplace-service-profile-panel h2,
.marketplace-service-profile-panel p,
.marketplace-service-profile-panel dl,
.marketplace-service-profile-panel dt,
.marketplace-service-profile-panel dd,
.marketplace-service-profile-review h3,
.marketplace-service-profile-review p,
.marketplace-service-profile-review span,
.marketplace-service-profile-reviews-summary p,
.marketplace-service-profile-reviews-score strong,
.marketplace-service-profile-reviews-score span,
.marketplace-service-profile-seller-card__identity span {
  margin: 0;
}

.marketplace-service-profile-eyebrow {
  color: var(--profile-color-subtle);
  font-size: var(--profile-font-label);
  font-weight: 800;
  line-height: var(--profile-line-body);
  text-transform: uppercase;
}

.marketplace-service-profile-hero__copy h1 {
  color: var(--profile-color-text);
  font-size: var(--profile-font-title);
  font-weight: 900;
  line-height: var(--profile-line-tight);
  overflow-wrap: anywhere;
}

.marketplace-service-profile-hero__copy > p,
.marketplace-service-profile-hero__meta {
  color: var(--profile-color-muted);
  font-size: var(--profile-font-small);
  line-height: var(--profile-line-body);
}

.marketplace-service-profile-hero__copy > p {
  max-width: calc(var(--profile-unit) * 78);
  text-wrap: pretty;
}

.marketplace-service-profile-hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--profile-space-2);
  padding: 0;
  list-style: none;
}

.marketplace-service-profile-hero__meta li {
  display: inline-flex;
  align-items: center;
  gap: var(--profile-space-1);
}

.marketplace-service-profile-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--profile-space-2);
  justify-content: end;
}

.marketplace-service-profile-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--profile-sidebar-width);
  gap: var(--profile-space-4);
  padding: var(--profile-space-4) 0 var(--profile-space-10);
}

.marketplace-service-profile-main,
.marketplace-service-profile-sidebar {
  display: grid;
  align-content: start;
  gap: var(--profile-space-4);
}

.marketplace-service-profile-sidebar {
  position: sticky;
  top: calc(var(--app-header-height) + var(--profile-space-4));
}

.marketplace-service-profile-copy {
  display: grid;
  gap: var(--profile-space-2);
  max-width: calc(var(--profile-unit) * 92);
}

.marketplace-service-profile-copy p,
.marketplace-service-profile-reviews-summary p,
.marketplace-service-profile-review p,
.marketplace-service-profile-seller-card__summary {
  color: var(--profile-color-text);
  font-size: var(--profile-font-body);
  line-height: var(--profile-line-body);
  text-wrap: pretty;
}

.marketplace-service-profile-gallery,
.marketplace-service-profile-related,
.marketplace-service-profile-reviews {
  margin: 0;
  padding: 0;
  list-style: none;
}

.marketplace-service-profile-gallery {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--profile-space-3);
}

.marketplace-service-profile-gallery li {
  overflow: hidden;
  border-radius: var(--profile-radius);
  background-color: var(--profile-color-panel-strong);
  box-shadow: 0 var(--profile-space-3) var(--profile-space-8) var(--profile-color-shadow);
}

.marketplace-service-profile-gallery img {
  display: block;
  width: 100%;
  height: calc(var(--profile-unit) * 24);
  object-fit: cover;
}

.marketplace-service-profile-panel {
  display: grid;
  gap: var(--profile-space-3);
  padding: var(--profile-space-4);
  border: var(--profile-border) solid var(--profile-color-border);
  border-radius: var(--profile-radius);
  background-color: var(--profile-color-panel);
  box-shadow: 0 var(--profile-space-2) var(--profile-space-6) var(--profile-color-shadow);
}

.marketplace-service-profile-panel__header {
  display: flex;
  gap: var(--profile-space-3);
  align-items: start;
  justify-content: space-between;
}

.marketplace-service-profile-panel__header > div {
  display: grid;
  gap: var(--profile-space-1);
}

.marketplace-service-profile-panel h2 {
  color: var(--profile-color-text);
  font-size: var(--profile-font-section);
  font-weight: 800;
  line-height: var(--profile-line-title);
}

.marketplace-service-profile-panel__header > strong {
  color: var(--profile-color-text);
  font-size: calc(var(--profile-unit) * 2.5);
  font-weight: 900;
  line-height: var(--profile-line-tight);
  text-align: right;
  white-space: nowrap;
}

.marketplace-service-profile-offers {
  gap: var(--profile-space-4);
}

.marketplace-service-profile-offers__list {
  display: grid;
  gap: var(--profile-space-2);
}

.marketplace-service-profile-offer {
  position: relative;
  display: grid;
  grid-template-columns: calc(var(--profile-unit) * 4) minmax(0, 1fr) auto;
  gap: var(--profile-space-2);
  align-items: center;
  min-height: calc(var(--profile-unit) * 8.5);
  padding: var(--profile-space-2);
  border: var(--profile-border) solid var(--profile-color-border);
  border-radius: var(--profile-radius);
  background-color: var(--profile-color-panel-strong);
  cursor: pointer;
  transition-duration: var(--motion-fast);
}

.marketplace-service-profile-offer:hover,
.marketplace-service-profile-offer[data-selected='true'] {
  border-color: color-mix(in oklch, var(--profile-color-accent) 64%, var(--profile-color-border));
  background-color: color-mix(in oklch, var(--profile-color-accent) 12%, var(--profile-color-panel));
}

.marketplace-service-profile-offer input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.marketplace-service-profile-offer:has(input:focus-visible) {
  outline: calc(var(--profile-border) * 3) solid color-mix(in oklch, var(--profile-color-focus) 70%, var(--profile-color-transparent));
  outline-offset: calc(var(--profile-border) * 2);
}

.marketplace-service-profile-offer__check {
  display: inline-flex;
  width: calc(var(--profile-unit) * 3);
  height: calc(var(--profile-unit) * 3);
  align-items: center;
  justify-content: center;
  border: calc(var(--profile-border) * 2) solid color-mix(in oklch, var(--profile-color-muted) 52%, var(--profile-color-border));
  border-radius: var(--profile-radius-round);
  color: var(--profile-color-text);
}

.marketplace-service-profile-offer[data-selected='true'] .marketplace-service-profile-offer__check {
  border-color: var(--profile-color-accent);
  background: var(--gradient-action);
}

.marketplace-service-profile-offer__check svg {
  width: calc(var(--profile-unit) * 1.75);
  height: calc(var(--profile-unit) * 1.75);
}

.marketplace-service-profile-offer__body {
  display: grid;
  gap: calc(var(--profile-unit) * 0.5);
}

.marketplace-service-profile-offer__body strong,
.marketplace-service-profile-offer__price {
  color: var(--profile-color-text);
  font-size: var(--profile-font-small);
  font-style: normal;
  font-weight: 800;
  line-height: var(--profile-line-tight);
}

.marketplace-service-profile-offer__body span {
  display: -webkit-box;
  overflow: hidden;
  color: var(--profile-color-muted);
  font-size: var(--profile-font-label);
  line-height: var(--profile-line-body);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.marketplace-service-profile-offer__price {
  text-align: right;
  white-space: nowrap;
}

.marketplace-service-profile-seller-card {
  overflow: hidden;
  border-color: color-mix(in oklch, var(--profile-color-accent) 22%, var(--profile-color-border));
}

.marketplace-service-profile-seller-card__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--profile-space-3);
  align-items: center;
}

.marketplace-service-profile-seller-card__identity {
  display: grid;
  gap: calc(var(--profile-unit) * 0.5);
}

.marketplace-service-profile-seller-card__identity span,
.marketplace-service-profile-review span,
.marketplace-service-profile-reviews-score span {
  color: var(--profile-color-subtle);
  font-size: var(--profile-font-label);
  line-height: var(--profile-line-body);
}

.marketplace-service-profile-seller-card__summary {
  color: var(--profile-color-muted);
}

.marketplace-service-profile-seller-facts {
  display: grid;
  gap: var(--profile-space-2);
  padding-top: var(--profile-space-3);
  border-top: var(--profile-border) solid var(--profile-color-border);
}

.marketplace-service-profile-seller-facts div {
  display: grid;
  gap: var(--profile-space-1);
}

.marketplace-service-profile-seller-facts dt {
  display: inline-flex;
  align-items: center;
  gap: var(--profile-space-1);
  color: var(--profile-color-subtle);
  font-size: var(--profile-font-label);
  font-weight: 800;
  line-height: var(--profile-line-body);
}

.marketplace-service-profile-seller-facts dt svg {
  width: calc(var(--profile-unit) * 2);
  height: calc(var(--profile-unit) * 2);
  color: var(--profile-color-accent);
}

.marketplace-service-profile-seller-facts dd {
  color: var(--profile-color-text);
  font-size: var(--profile-font-small);
  font-weight: 800;
  line-height: var(--profile-line-title);
}

.marketplace-service-profile-related {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(var(--profile-unit) * 28)), 1fr));
  gap: var(--profile-space-3);
}

.marketplace-service-profile-related__link {
  display: grid;
  grid-template-rows: calc(var(--profile-unit) * 16) minmax(calc(var(--profile-unit) * 9), 1fr) auto;
  height: 100%;
  overflow: hidden;
  border-radius: var(--profile-radius);
  background-color: var(--profile-color-panel-strong);
  color: inherit;
  text-decoration: none;
  box-shadow: 0 var(--profile-space-3) var(--profile-space-8) var(--profile-color-shadow);
  transition-duration: var(--motion-fast);
}

.marketplace-service-profile-related__link:hover {
  transform: translateY(calc(var(--profile-border) * -2));
}

.marketplace-service-profile-related__link:focus-visible {
  outline: calc(var(--profile-border) * 3) solid var(--profile-color-focus);
  outline-offset: calc(var(--profile-border) * 3);
}

.marketplace-service-profile-related__link img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.marketplace-service-profile-related__empty {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: var(--profile-color-subtle);
  background-color: var(--profile-color-panel);
}

.marketplace-service-profile-related__empty svg {
  width: calc(var(--profile-unit) * 5);
  height: calc(var(--profile-unit) * 5);
}

.marketplace-service-profile-related__link span {
  display: grid;
  gap: var(--profile-space-1);
  padding: var(--profile-space-3);
}

.marketplace-service-profile-related__link small {
  color: var(--profile-color-subtle);
  font-size: var(--profile-font-label);
  font-weight: 800;
  line-height: var(--profile-line-tight);
  text-transform: uppercase;
}

.marketplace-service-profile-related__link strong {
  color: var(--profile-color-text);
  font-size: var(--profile-font-small);
  font-weight: 800;
  line-height: var(--profile-line-title);
}

.marketplace-service-profile-related__link em {
  align-self: end;
  padding: 0 var(--profile-space-3) var(--profile-space-3);
  color: var(--profile-color-text);
  font-size: var(--profile-font-small);
  font-style: normal;
  font-weight: 900;
  line-height: var(--profile-line-tight);
}

.marketplace-service-profile-reviews-summary {
  display: grid;
  grid-template-columns: minmax(calc(var(--profile-unit) * 18), calc(var(--profile-unit) * 24)) minmax(0, 1fr);
  gap: var(--profile-space-4);
  align-items: center;
  padding-bottom: var(--profile-space-4);
  border-bottom: var(--profile-border) solid var(--profile-color-border);
}

.marketplace-service-profile-reviews-score {
  display: grid;
  gap: var(--profile-space-1);
}

.marketplace-service-profile-reviews-score strong {
  color: var(--profile-color-text);
  font-size: calc(var(--profile-unit) * 6);
  font-weight: 900;
  line-height: var(--profile-line-tight);
}

.marketplace-service-profile-reviews-summary p {
  max-width: calc(var(--profile-unit) * 80);
  color: var(--profile-color-muted);
}

.marketplace-service-profile-reviews {
  display: grid;
}

.marketplace-service-profile-review {
  display: grid;
  gap: var(--profile-space-3);
  padding: var(--profile-space-4) 0;
  border-bottom: var(--profile-border) solid var(--profile-color-border);
}

.marketplace-service-profile-review:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.marketplace-service-profile-review__header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: var(--profile-space-2);
  align-items: center;
}

.marketplace-service-profile-review__header > div {
  display: grid;
  gap: calc(var(--profile-unit) * 0.5);
}

.marketplace-service-profile-review__header :deep(.marketplace-rating) {
  justify-self: end;
}

.marketplace-service-profile-review h3 {
  color: var(--profile-color-text);
  font-size: var(--profile-font-body);
  font-weight: 800;
  line-height: var(--profile-line-title);
  overflow-wrap: anywhere;
}

.marketplace-service-profile-review p {
  max-width: calc(var(--profile-unit) * 92);
  color: var(--profile-color-muted);
}

@media (max-width: 62rem) {
  .marketplace-service-profile-hero__identity,
  .marketplace-service-profile-layout {
    grid-template-columns: 1fr;
  }

  .marketplace-service-profile-hero__actions {
    justify-content: start;
  }

  .marketplace-service-profile-sidebar {
    position: static;
  }

  .marketplace-service-profile-gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .marketplace-service-profile-reviews-summary {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 40rem) {
  .marketplace-service-profile-hero__identity,
  .marketplace-service-profile-panel {
    padding: var(--profile-space-3);
  }

  .marketplace-service-profile-hero__games {
    top: calc(var(--profile-space-8) + var(--profile-space-1));
    right: var(--profile-space-3);
    left: var(--profile-space-3);
    justify-content: start;
    max-width: none;
  }

  .marketplace-service-profile-hero__game {
    min-height: calc(var(--profile-unit) * 4);
  }

  .marketplace-service-profile-hero__logo {
    width: calc(var(--profile-logo-size) * 0.78);
    height: calc(var(--profile-logo-size) * 0.78);
    min-width: calc(var(--profile-logo-size) * 0.78);
  }

  .marketplace-service-profile-gallery,
  .marketplace-service-profile-related,
  .marketplace-service-profile-review__header {
    grid-template-columns: 1fr;
  }

  .marketplace-service-profile-review__header :deep(.marketplace-rating) {
    justify-self: start;
  }

  .marketplace-service-profile-offer {
    grid-template-columns: calc(var(--profile-unit) * 4) minmax(0, 1fr);
  }

  .marketplace-service-profile-offer__price {
    grid-column: 2;
    text-align: left;
  }
}
</style>
