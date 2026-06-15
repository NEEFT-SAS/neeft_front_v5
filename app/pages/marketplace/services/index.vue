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

        <MarketplaceTrackingTabs active="services" />
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
            <MarketplaceManagedServiceCard
              :service="service"
              :tracking="getServiceTracking(service)"
              :updating="updatingServiceId === service.id"
              :deleting="deletingServiceId === service.id"
              @edit="openEditServiceModal"
              @toggle-status="toggleServiceStatus"
              @delete="openDeleteServiceModal"
            />
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
    <HeaderServiceProposalModal v-model="isServiceEditOpen" :service="serviceBeingEdited" :refresh-on-saved="false" @saved="handleServiceSaved" />
    <MarketplaceServiceDeleteModal v-model="isDeleteServiceOpen" :service="serviceBeingDeleted" :deleting="Boolean(deletingServiceId)" @confirm="deleteService" />
  </main>
</template>

<script setup lang="ts">
import type { MarketplaceOrderPresenter, MarketplaceOrderStatus, MarketplaceServicePresenter, MarketplaceServiceStatus } from '~/plugins/marketplace-api'

type ServiceStatusFilter = MarketplaceServiceStatus | 'all'
type ServiceOrderTracking = {
  activeCount: number
  reviewCount: number
  latestStatusLabel: string
}

definePageMeta({
  layout: 'app'
})

const config = useConfig()

useSeoMeta(config.marketplace.services.seo)

const { $marketplaceAPI } = useNuxtApp()
const marketplaceToast = useMarketplaceToasts()

const statusFilters = [
  { value: 'all', label: 'Tous', icon: 'lucide:layout-grid' },
  { value: 'PUBLISHED', label: 'Publies', icon: 'lucide:badge-check' },
  { value: 'DRAFT', label: 'Brouillons', icon: 'lucide:file-pen-line' },
  { value: 'ARCHIVED', label: 'Archives', icon: 'lucide:archive' }
] as const satisfies readonly { value: ServiceStatusFilter, label: string, icon: string }[]

const { data: marketplaceServicesData, pending: isServicesPending, error: servicesError, refresh } = await useAsyncData('marketplace-services-mine', async () => {
  const response = await $marketplaceAPI.services.mine({ limit: 100 })
  return response.data
})

const { data: marketplaceSalesData, refresh: refreshSales } = await useAsyncData('marketplace-services-sales-summary', async () => {
  try {
    const response = await $marketplaceAPI.orders.listSeller({ limit: 100 })
    return response.data
  } catch {
    return [] as MarketplaceOrderPresenter[]
  }
})

const searchQuery = ref('')
const activeStatus = ref<ServiceStatusFilter>('all')
const isServiceProposalOpen = ref(false)
const isServiceEditOpen = ref(false)
const isDeleteServiceOpen = ref(false)
const serviceBeingEdited = ref<MarketplaceServicePresenter | null>(null)
const serviceBeingDeleted = ref<MarketplaceServicePresenter | null>(null)
const updatingServiceId = ref('')
const deletingServiceId = ref('')

const apiServices = computed(() => marketplaceServicesData.value || [])
const services = computed(() => apiServices.value)
const salesOrders = computed(() => marketplaceSalesData.value || [])
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

const refreshMarketplaceServices = async () => {
  await Promise.all([refresh(), refreshSales()])
}

const normalizeText = (value: string) => value.toLocaleLowerCase('fr-FR').normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const getStatusCount = (status: ServiceStatusFilter) => {
  if (status === 'all') return services.value.length
  return services.value.filter(service => service.status === status).length
}

const orderStatusLabels: Record<MarketplaceOrderStatus, string> = {
  PENDING: 'A accepter',
  ACCEPTED: 'Acceptee',
  IN_PROGRESS: 'En cours',
  DELIVERED: 'Livree',
  COMPLETED: 'Terminee',
  CANCELLED: 'Annulee',
  REJECTED: 'Refusee'
}

const trackingByService = computed(() => {
  const map = new Map<string, ServiceOrderTracking>()

  for (const order of salesOrders.value) {
    if (!order.serviceId) continue

    const current = map.get(order.serviceId) || {
      activeCount: 0,
      reviewCount: 0,
      latestStatusLabel: 'Aucune commande'
    }

    if (!['COMPLETED', 'CANCELLED', 'REJECTED'].includes(order.status)) {
      current.activeCount += 1
    }

    if (order.status === 'DELIVERED') {
      current.reviewCount += 1
    }

    current.latestStatusLabel = orderStatusLabels[order.status]
    map.set(order.serviceId, current)
  }

  return map
})

const getServiceTracking = (service: MarketplaceServicePresenter): ServiceOrderTracking => {
  return trackingByService.value.get(service.id) || {
    activeCount: 0,
    reviewCount: 0,
    latestStatusLabel: service.ordersCount ? 'Historique disponible' : 'Aucune commande'
  }
}

const openEditServiceModal = (service: MarketplaceServicePresenter) => {
  serviceBeingEdited.value = service
  isServiceEditOpen.value = true
}

const openDeleteServiceModal = (service: MarketplaceServicePresenter) => {
  serviceBeingDeleted.value = service
  isDeleteServiceOpen.value = true
}

const handleServiceSaved = async () => {
  await refreshMarketplaceServices()
}

const toggleServiceStatus = async (service: MarketplaceServicePresenter) => {
  const nextStatus: MarketplaceServiceStatus = service.status === 'PUBLISHED' ? 'ARCHIVED' : 'PUBLISHED'
  updatingServiceId.value = service.id

  try {
    await $marketplaceAPI.services.update(service.id, { status: nextStatus })
    await refreshNuxtData(['marketplace-services', 'marketplace-services-mine'])
    await refreshMarketplaceServices()
    marketplaceToast.services.statusUpdated(service.name, nextStatus)
  } catch {
    marketplaceToast.services.statusUpdateFailed()
  } finally {
    updatingServiceId.value = ''
  }
}

const deleteService = async (service: MarketplaceServicePresenter) => {
  deletingServiceId.value = service.id

  try {
    await $marketplaceAPI.services.delete(service.id)
    await refreshNuxtData(['marketplace-services', 'marketplace-services-mine'])
    await refreshMarketplaceServices()
    isDeleteServiceOpen.value = false
    serviceBeingDeleted.value = null
    marketplaceToast.services.deleted(service.name)
  } catch {
    marketplaceToast.services.deleteFailed()
  } finally {
    deletingServiceId.value = ''
  }
}

watch(isServiceEditOpen, (isOpen) => {
  if (!isOpen) serviceBeingEdited.value = null
})

watch(isDeleteServiceOpen, (isOpen) => {
  if (!isOpen && !deletingServiceId.value) serviceBeingDeleted.value = null
})
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
.marketplace-services__empty p {
  color: var(--services-color-muted);
  font-size: var(--services-font-body);
  line-height: var(--services-line-body);
  text-wrap: pretty;
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
  .marketplace-services__toolbar {
    grid-template-columns: 1fr;
  }

  .marketplace-services__toolbar-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 46rem) {
  .marketplace-services__shell {
    width: min(calc(100% - (var(--services-space-3) * 2)), var(--services-content-max));
  }

}
</style>
