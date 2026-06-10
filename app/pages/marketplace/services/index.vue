<template>
  <main class="marketplace-services" aria-labelledby="marketplace-services-title">
    <section class="marketplace-services__hero">
      <div class="marketplace-services__shell marketplace-services__hero-inner">
        <div class="marketplace-services__hero-copy">
          <p class="marketplace-services__eyebrow">
            Marketplace
          </p>
          <h1 id="marketplace-services-title">
            Mes services
          </h1>
          <p>Gere tes fiches, leur visibilite et les prestations que les clients peuvent commander.</p>
        </div>

        <nav class="marketplace-services__tabs" aria-label="Vues du suivi marketplace">
          <NuxtLink class="marketplace-services__tab" to="/marketplace/orders">
            <Icon name="lucide:shopping-bag" aria-hidden="true" />
            <span>Achats</span>
          </NuxtLink>
          <NuxtLink class="marketplace-services__tab" to="/marketplace/sales">
            <Icon name="lucide:inbox" aria-hidden="true" />
            <span>Ventes</span>
          </NuxtLink>
          <NuxtLink class="marketplace-services__tab marketplace-services__tab--active" to="/marketplace/services" aria-current="page">
            <Icon name="lucide:store" aria-hidden="true" />
            <span>Services</span>
          </NuxtLink>
        </nav>
      </div>
    </section>

    <div class="marketplace-services__shell marketplace-services__body">
      <section class="marketplace-services__workspace" aria-labelledby="marketplace-services-list-title">
        <header class="marketplace-services__toolbar">
          <div>
            <p class="marketplace-services__eyebrow">
              Services publies
            </p>
            <h2 id="marketplace-services-list-title">
              {{ visibleServices.length }} service{{ visibleServices.length > 1 ? 's' : '' }}
            </h2>
          </div>

          <div class="marketplace-services__toolbar-actions">
            <CustomInputText v-model="searchQuery" label="Rechercher un service" label-position="inside" left-icon="lucide:search" size="sm" />
            <CustomButton label="Proposer un service" left-icon="lucide:plus" theme="app" variant="filled" color="primary" size="sm" @click="isServiceProposalOpen = true" />
          </div>
        </header>

        <div class="marketplace-services__filters" aria-label="Filtrer les services">
          <CustomButton
            v-for="filter in statusFilters"
            :key="filter.value"
            :label="`${filter.label} (${getStatusCount(filter.value)})`"
            :left-icon="filter.icon"
            theme="app"
            variant="outlined"
            color="secondary"
            size="sm"
            :selected="activeStatus === filter.value"
            :aria-pressed="activeStatus === filter.value"
            @click="activeStatus = filter.value"
          />
        </div>

        <section v-if="isServicesPending" class="marketplace-services__empty" aria-live="polite">
          <Icon name="lucide:loader-circle" aria-hidden="true" />
          <h2>Chargement des services</h2>
          <p>Recuperation de tes fiches marketplace.</p>
        </section>

        <section v-else-if="servicesError" class="marketplace-services__empty" aria-live="polite">
          <Icon name="lucide:circle-alert" aria-hidden="true" />
          <h2>Services indisponibles</h2>
          <p>Impossible de charger tes services marketplace.</p>
          <CustomButton label="Reessayer" left-icon="lucide:refresh-cw" theme="app" variant="outlined" color="secondary" size="sm" @click="refreshMarketplaceServices" />
        </section>

        <ul v-else-if="visibleServices.length" class="marketplace-services__list" aria-live="polite">
          <li v-for="service in visibleServices" :key="service.id">
            <article class="marketplace-services__card">
              <NuxtLink class="marketplace-services__cover" :to="getServicePath(service)" :aria-label="`Voir le service ${service.name}`">
                <NuxtImg v-if="service.bannerUrl" :src="service.bannerUrl" :alt="`Banniere du service ${service.name}`" width="360" height="220" format="webp" loading="lazy" decoding="async" />
                <div v-else class="marketplace-services__cover-empty" aria-hidden="true">
                  <Icon name="lucide:image" />
                </div>
                <span :data-status="service.status">{{ getStatusLabel(service.status) }}</span>
              </NuxtLink>

              <div class="marketplace-services__card-content">
                <div class="marketplace-services__card-heading">
                  <div>
                    <p class="marketplace-services__eyebrow">
                      Marketplace
                    </p>
                    <h3>{{ service.name }}</h3>
                  </div>
                  <strong v-if="getServicePriceLabel(service)">{{ getServicePriceLabel(service) }}</strong>
                </div>

                <p class="marketplace-services__description">
                  {{ getShortDescription(service.description) }}
                </p>

                <dl class="marketplace-services__facts">
                  <div>
                    <dt>Commandes</dt>
                    <dd>{{ service.ordersCount }}</dd>
                  </div>
                  <div>
                    <dt>Note</dt>
                    <dd>{{ getRatingLabel(service.ratingAvg, service.ratingCount) }}</dd>
                  </div>
                  <div>
                    <dt>Prestations</dt>
                    <dd>{{ getOfferCountLabel(service) }}</dd>
                  </div>
                  <div>
                    <dt>Mise a jour</dt>
                    <dd>{{ getDateLabel(service.updatedAt) }}</dd>
                  </div>
                </dl>

                <div class="marketplace-services__actions">
                  <CustomLink label="Voir" :to="getServicePath(service)" left-icon="lucide:eye" theme="app" variant="outlined" color="secondary" size="sm" />
                  <CustomButton :label="getStatusActionLabel(service.status)" :left-icon="getStatusActionIcon(service.status)" theme="app" variant="outlined" color="secondary" size="sm" :disabled="updatingServiceId === service.id || deletingServiceId === service.id" @click="toggleServiceStatus(service)" />
                  <CustomButton label="Supprimer" left-icon="lucide:trash-2" theme="app" variant="ghost" color="secondary" size="sm" :disabled="updatingServiceId === service.id || deletingServiceId === service.id" @click="deleteService(service)" />
                </div>
              </div>
            </article>
          </li>
        </ul>

        <section v-else class="marketplace-services__empty" aria-live="polite">
          <Icon name="lucide:search-x" aria-hidden="true" />
          <h2>{{ hasServices ? 'Aucun service trouve' : 'Aucun service cree' }}</h2>
          <p>{{ hasServices ? 'Ajuste la recherche ou le statut selectionne.' : 'Cree ton premier service pour apparaitre dans la marketplace.' }}</p>
          <CustomButton v-if="!hasServices" label="Proposer un service" left-icon="lucide:plus" theme="app" variant="filled" color="primary" size="sm" @click="isServiceProposalOpen = true" />
        </section>
      </section>
    </div>

    <HeaderServiceProposalModal v-model="isServiceProposalOpen" />
  </main>
</template>

<script setup lang="ts">
import type { MarketplaceServicePresenter, MarketplaceServiceStatus } from '~/plugins/marketplace-api'

type ServiceStatusFilter = MarketplaceServiceStatus | 'all'

definePageMeta({
  layout: 'app'
})

useSeoMeta({
  title: 'Mes services marketplace',
  description: 'Gestion des services proposes sur la marketplace.',
  ogTitle: 'Mes services marketplace',
  ogDescription: 'Gestion des fiches services et prestations marketplace.',
  twitterCard: 'summary'
})

const { $marketplaceAPI } = useNuxtApp()
const toast = useToast()

const statusFilters = [
  { value: 'all', label: 'Tous', icon: 'lucide:layout-grid' },
  { value: 'PUBLISHED', label: 'Publies', icon: 'lucide:badge-check' },
  { value: 'DRAFT', label: 'Brouillons', icon: 'lucide:file-pen-line' },
  { value: 'ARCHIVED', label: 'Archives', icon: 'lucide:archive' }
] as const satisfies readonly { value: ServiceStatusFilter, label: string, icon: string }[]

const statusLabels: Record<MarketplaceServiceStatus, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publie',
  ARCHIVED: 'Archive'
}

const { data: marketplaceServicesData, pending: isServicesPending, error: servicesError, refresh } = await useAsyncData('marketplace-services-mine', async () => {
  const response = await $marketplaceAPI.services.mine({ limit: 100 })
  return response.data
})

const searchQuery = ref('')
const activeStatus = ref<ServiceStatusFilter>('all')
const isServiceProposalOpen = ref(false)
const updatingServiceId = ref('')
const deletingServiceId = ref('')
const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

const apiServices = computed(() => marketplaceServicesData.value || [])
const services = computed(() => apiServices.value)
const hasServices = computed(() => services.value.length > 0)

const normalizedSearch = computed(() => normalizeText(searchQuery.value))

const visibleServices = computed(() => {
  return services.value.filter((service) => {
    const matchesStatus = activeStatus.value === 'all' || service.status === activeStatus.value
    const searchable = normalizeText(`${service.name} ${service.description} ${service.services.map(line => line.name).join(' ')}`)
    const matchesQuery = !normalizedSearch.value || searchable.includes(normalizedSearch.value)
    return matchesStatus && matchesQuery
  })
})

const refreshMarketplaceServices = () => refresh()

const normalizeText = (value: string) => value.toLocaleLowerCase('fr-FR').normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const formatMarketplacePrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(price)
}

const getShortDescription = (description: string) => {
  const normalized = description.replace(/\s+/g, ' ').trim()
  if (normalized.length <= 180) return normalized
  return `${normalized.slice(0, 177).trim()}...`
}

const getStatusCount = (status: ServiceStatusFilter) => {
  if (status === 'all') return services.value.length
  return services.value.filter(service => service.status === status).length
}

const getStatusLabel = (status: MarketplaceServiceStatus) => statusLabels[status]

const getServicePath = (service: MarketplaceServicePresenter) => `/marketplace/${service.slug}`

const getOfferCountLabel = (service: MarketplaceServicePresenter) => {
  const count = service.services.length
  return `${count} prestation${count > 1 ? 's' : ''}`
}

const getServicePriceLabel = (service: MarketplaceServicePresenter) => {
  const prices = service.services
    .map(line => Number(line.price))
    .filter(price => Number.isFinite(price))

  return prices.length ? formatMarketplacePrice(Math.min(...prices)) : ''
}

const getRatingLabel = (rating: number, ratingCount: number) => {
  if (!ratingCount) return 'Aucune note'
  return `${Number(rating).toFixed(1).replace('.', ',')} (${ratingCount})`
}

const getDateLabel = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date inconnue'
  return dateFormatter.format(date)
}

const getStatusActionLabel = (status: MarketplaceServiceStatus) => {
  if (status === 'PUBLISHED') return 'Desactiver'
  if (status === 'ARCHIVED') return 'Republier'
  return 'Publier'
}

const getStatusActionIcon = (status: MarketplaceServiceStatus) => {
  if (status === 'PUBLISHED') return 'lucide:archive'
  return 'lucide:badge-check'
}

const toggleServiceStatus = async (service: MarketplaceServicePresenter) => {
  const nextStatus: MarketplaceServiceStatus = service.status === 'PUBLISHED' ? 'ARCHIVED' : 'PUBLISHED'
  updatingServiceId.value = service.id

  try {
    await $marketplaceAPI.services.update(service.id, { status: nextStatus })
    await refreshNuxtData(['marketplace-services', 'marketplace-services-mine'])
    await refreshMarketplaceServices()
    toast.add({
      variant: 'success',
      title: nextStatus === 'PUBLISHED' ? 'Service publie' : 'Service desactive',
      desc: `${service.name} a ete mis a jour.`
    })
  } catch {
    toast.add({
      variant: 'error',
      title: 'Mise a jour impossible',
      desc: 'Le statut du service n a pas pu etre modifie.'
    })
  } finally {
    updatingServiceId.value = ''
  }
}

const deleteService = async (service: MarketplaceServicePresenter) => {
  const confirmed = window.confirm(`Supprimer le service "${service.name}" ?`)
  if (!confirmed) return

  deletingServiceId.value = service.id

  try {
    await $marketplaceAPI.services.delete(service.id)
    await refreshNuxtData(['marketplace-services', 'marketplace-services-mine'])
    await refreshMarketplaceServices()
    toast.add({
      variant: 'success',
      title: 'Service supprime',
      desc: `${service.name} a ete retire de la marketplace.`
    })
  } catch {
    toast.add({
      variant: 'error',
      title: 'Suppression impossible',
      desc: 'Le service n a pas pu etre supprime.'
    })
  } finally {
    deletingServiceId.value = ''
  }
}
</script>

<style scoped>
.marketplace-services {
  --services-unit: var(--unit);
  --services-space-1: var(--space-1);
  --services-space-2: var(--space-2);
  --services-space-3: var(--space-3);
  --services-space-4: var(--space-4);
  --services-space-5: var(--space-5);
  --services-space-6: var(--space-6);
  --services-space-8: var(--space-8);
  --services-space-10: var(--space-10);
  --services-space-fluid: clamp(var(--services-space-3), calc(var(--services-space-2) + 3vw), var(--services-space-8));
  --services-content-max: calc(var(--services-unit) * 140);
  --services-hit-size: calc(var(--services-unit) * 5);
  --services-icon-size: calc(var(--services-unit) * 2.1);
  --services-border: var(--border);
  --services-radius: var(--radius);
  --services-radius-round: var(--radius-round);
  --services-font-title: calc(var(--services-unit) * 5.5);
  --services-font-section: calc(var(--services-unit) * 2.75);
  --services-font-body: calc(var(--services-unit) * 2);
  --services-font-small: calc(var(--services-unit) * 1.75);
  --services-font-label: calc(var(--services-unit) * 1.5);
  --services-line-tight: var(--line-tight);
  --services-line-title: var(--line-title);
  --services-line-body: var(--line-base);
  --services-color-bg: var(--color-bg);
  --services-color-bg-soft: color-mix(in oklch, var(--services-color-panel) 62%, var(--services-color-bg));
  --services-color-panel: var(--color-surface);
  --services-color-panel-strong: color-mix(in oklch, var(--services-color-panel) 82%, var(--services-color-bg));
  --services-color-panel-hover: color-mix(in oklch, var(--services-color-panel) 90%, var(--services-color-bg));
  --services-color-line: var(--app-color-line);
  --services-color-text: var(--color-text);
  --services-color-muted: var(--app-color-muted);
  --services-color-subtle: var(--app-color-subtle);
  --services-color-accent: var(--color-accent);
  --services-color-success: var(--color-success);
  --services-color-warning: oklch(78% 0.16 72);
  --services-color-danger: var(--color-danger);
  --services-color-shadow: var(--color-shadow);
  --services-color-transparent: var(--color-transparent);
  min-height: calc(100vh - var(--app-header-height));
  background-color: var(--services-color-bg);
  color: var(--services-color-text);
  font-family: var(--font-ui, ui-sans-serif, system-ui, sans-serif);
  letter-spacing: 0;
}

.marketplace-services *,
.marketplace-services *::before,
.marketplace-services *::after {
  box-sizing: border-box;
  min-width: 0;
  letter-spacing: 0;
}

.marketplace-services__shell {
  width: min(calc(100% - (var(--services-space-fluid) * 2)), var(--services-content-max));
  margin: 0 auto;
}

.marketplace-services__hero {
  background-color: var(--services-color-bg-soft);
}

.marketplace-services__hero-inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--services-space-3);
  align-items: end;
  padding: var(--services-space-6) 0 var(--services-space-4);
}

.marketplace-services__hero-copy {
  display: grid;
  gap: var(--services-space-2);
  max-width: calc(var(--services-unit) * 88);
}

.marketplace-services__eyebrow,
.marketplace-services h1,
.marketplace-services h2,
.marketplace-services h3,
.marketplace-services p,
.marketplace-services dl,
.marketplace-services dd {
  margin: 0;
}

.marketplace-services__eyebrow {
  color: var(--services-color-subtle);
  font-size: var(--services-font-label);
  font-weight: 600;
  line-height: var(--services-line-body);
  text-transform: uppercase;
}

.marketplace-services h1 {
  color: var(--services-color-text);
  font-size: var(--services-font-title);
  font-weight: 600;
  line-height: var(--services-line-tight);
  overflow-wrap: anywhere;
}

.marketplace-services h2 {
  color: var(--services-color-text);
  font-size: var(--services-font-section);
  font-weight: 600;
  line-height: var(--services-line-title);
}

.marketplace-services h3 {
  color: var(--services-color-text);
  font-size: calc(var(--services-unit) * 2.25);
  font-weight: 600;
  line-height: var(--services-line-title);
  overflow-wrap: anywhere;
}

.marketplace-services__hero-copy > p,
.marketplace-services__description,
.marketplace-services__empty p {
  color: var(--services-color-muted);
  font-size: var(--services-font-body);
  line-height: var(--services-line-body);
  text-wrap: pretty;
}

.marketplace-services__tabs {
  display: inline-grid;
  grid-template-columns: repeat(3, minmax(calc(var(--services-unit) * 13), 1fr));
  gap: var(--services-space-1);
  padding: var(--services-space-1);
  border: var(--services-border) solid var(--services-color-line);
  border-radius: var(--services-radius-round);
  background-color: var(--services-color-bg);
}

.marketplace-services__tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--services-hit-size);
  gap: var(--services-space-1);
  padding: 0 var(--services-space-2);
  border-radius: var(--services-radius-round);
  color: var(--services-color-muted);
  font-size: var(--services-font-small);
  font-weight: 600;
  line-height: var(--services-line-tight);
  text-decoration: none;
}

.marketplace-services__tab:hover,
.marketplace-services__tab--active {
  background-color: color-mix(in oklch, var(--services-color-accent) 14%, var(--services-color-bg));
  color: var(--services-color-text);
}

.marketplace-services__tab:focus-visible,
.marketplace-services__cover:focus-visible {
  outline: calc(var(--services-border) * 3) solid var(--services-color-accent);
  outline-offset: calc(var(--services-border) * 3);
}

.marketplace-services__tab svg {
  width: var(--services-icon-size);
  height: var(--services-icon-size);
}

.marketplace-services__body {
  display: grid;
  gap: var(--services-space-5);
  padding: var(--services-space-5) 0 var(--services-space-10);
}

.marketplace-services__workspace {
  display: grid;
  gap: var(--services-space-3);
}

.marketplace-services__toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--services-space-3);
  align-items: end;
}

.marketplace-services__toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--services-space-2);
}

.marketplace-services__filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--services-space-2);
}

.marketplace-services__list {
  display: grid;
  gap: var(--services-space-3);
  padding: 0;
  margin: 0;
  list-style: none;
}

.marketplace-services__card {
  display: grid;
  grid-template-columns: minmax(calc(var(--services-unit) * 28), 0.34fr) minmax(0, 1fr);
  overflow: hidden;
  border: var(--services-border) solid var(--services-color-line);
  border-radius: var(--services-radius);
  background-color: var(--services-color-panel);
  box-shadow: 0 var(--services-space-3) var(--services-space-8) color-mix(in oklch, var(--services-color-shadow) 54%, var(--services-color-transparent));
}

.marketplace-services__cover {
  position: relative;
  display: block;
  min-height: calc(var(--services-unit) * 24);
  background-color: var(--services-color-panel-strong);
  color: inherit;
  text-decoration: none;
}

.marketplace-services__cover img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.marketplace-services__cover-empty {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: inherit;
  align-items: center;
  justify-content: center;
  color: var(--services-color-subtle);
  background-color: var(--services-color-panel-strong);
}

.marketplace-services__cover-empty svg {
  width: calc(var(--services-unit) * 5);
  height: calc(var(--services-unit) * 5);
}

.marketplace-services__cover span {
  position: absolute;
  top: var(--services-space-2);
  left: var(--services-space-2);
  display: inline-flex;
  min-height: calc(var(--services-unit) * 3.5);
  align-items: center;
  padding: 0 var(--services-space-2);
  border: var(--services-border) solid color-mix(in oklch, var(--services-color-text) 18%, var(--services-color-transparent));
  border-radius: var(--services-radius-round);
  background-color: color-mix(in oklch, var(--services-color-bg) 88%, var(--services-color-transparent));
  color: var(--services-color-text);
  font-size: var(--services-font-label);
  font-weight: 700;
  line-height: var(--services-line-tight);
}

.marketplace-services__cover span[data-status='PUBLISHED'] {
  color: var(--services-color-success);
}

.marketplace-services__cover span[data-status='DRAFT'] {
  color: var(--services-color-warning);
}

.marketplace-services__cover span[data-status='ARCHIVED'] {
  color: var(--services-color-subtle);
}

.marketplace-services__card-content {
  display: grid;
  gap: var(--services-space-3);
  padding: var(--services-space-3);
}

.marketplace-services__card-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--services-space-3);
  align-items: start;
}

.marketplace-services__card-heading > div {
  display: grid;
  gap: calc(var(--services-unit) * 0.5);
}

.marketplace-services__card-heading > strong {
  color: var(--services-color-text);
  font-size: calc(var(--services-unit) * 2.25);
  font-weight: 700;
  line-height: var(--services-line-tight);
  white-space: nowrap;
}

.marketplace-services__description {
  max-width: calc(var(--services-unit) * 88);
  font-size: var(--services-font-small);
}

.marketplace-services__facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--services-space-2);
}

.marketplace-services__facts div {
  display: grid;
  gap: calc(var(--services-unit) * 0.5);
  padding-top: var(--services-space-2);
  border-top: var(--services-border) solid var(--services-color-line);
}

.marketplace-services__facts dt {
  color: var(--services-color-muted);
  font-size: var(--services-font-label);
  font-weight: 600;
  line-height: var(--services-line-body);
}

.marketplace-services__facts dd {
  color: var(--services-color-text);
  font-size: var(--services-font-small);
  font-weight: 700;
  line-height: var(--services-line-tight);
}

.marketplace-services__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--services-space-2);
}

.marketplace-services__empty {
  display: grid;
  justify-items: center;
  gap: var(--services-space-2);
  padding: var(--services-space-6) var(--services-space-3);
  border: var(--services-border) solid var(--services-color-line);
  border-radius: var(--services-radius);
  text-align: center;
}

.marketplace-services__empty svg {
  width: var(--services-hit-size);
  height: var(--services-hit-size);
  color: var(--services-color-subtle);
}

.marketplace-services__empty p {
  max-width: calc(var(--services-unit) * 56);
  font-size: var(--services-font-small);
}

@media (max-width: 72rem) {
  .marketplace-services__hero-inner,
  .marketplace-services__toolbar,
  .marketplace-services__card {
    grid-template-columns: 1fr;
  }

  .marketplace-services__toolbar-actions {
    justify-content: flex-start;
  }

  .marketplace-services__facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 46rem) {
  .marketplace-services__shell {
    width: min(calc(100% - (var(--services-space-3) * 2)), var(--services-content-max));
  }

  .marketplace-services__tabs {
    width: 100%;
  }

  .marketplace-services__facts,
  .marketplace-services__card-heading {
    grid-template-columns: 1fr;
  }

  .marketplace-services__card-heading > strong {
    white-space: normal;
  }
}
</style>
