<template>
  <article class="marketplace-managed-service-card">
    <NuxtLink class="marketplace-managed-service-card__cover" :to="servicePath" :aria-label="`Voir le service ${service.name}`">
      <MarketplaceSafeImage :src="config.marketplace.service.getServiceBannerUrl(service.bannerUrl)" :alt="`Banniere du service ${service.name}`" class="marketplace-managed-service-card__cover-image" empty-class="marketplace-managed-service-card__cover-empty" width="360" height="220" loading="lazy" decoding="async" />
      <span :data-status="service.status">{{ statusLabel }}</span>
    </NuxtLink>

    <div class="marketplace-managed-service-card__content">
      <div class="marketplace-managed-service-card__heading">
        <div>
          <p class="marketplace-managed-service-card__eyebrow">
            Marketplace
          </p>
          <h3>{{ service.name }}</h3>
        </div>
        <strong v-if="priceLabel">{{ priceLabel }}</strong>
      </div>

      <p class="marketplace-managed-service-card__description">
        {{ shortDescription }}
      </p>

      <dl class="marketplace-managed-service-card__facts">
        <div>
          <dt>Commandes</dt>
          <dd>{{ service.ordersCount }}</dd>
        </div>
        <div>
          <dt>Note</dt>
          <dd>{{ ratingLabel }}</dd>
        </div>
        <div>
          <dt>Prestations</dt>
          <dd>{{ offerCountLabel }}</dd>
        </div>
        <div>
          <dt>Mise a jour</dt>
          <dd>{{ updatedAtLabel }}</dd>
        </div>
      </dl>

      <div class="marketplace-managed-service-card__tracking">
        <span>
          <small>Suivi commandes</small>
          <strong>{{ trackingHeadline }}</strong>
        </span>
        <span>
          <small>A valider</small>
          <strong>{{ tracking?.reviewCount ?? 0 }}</strong>
        </span>
        <CustomLink
          label="Voir le suivi"
          :to="salesTrackingPath"
          left-icon="lucide:clipboard-list"
          theme="app"
          variant="outlined"
          color="secondary"
          size="sm"
        />
      </div>

      <div class="marketplace-managed-service-card__actions">
        <CustomLink label="Voir" :to="servicePath" left-icon="lucide:eye" theme="app" variant="outlined" color="secondary" size="sm" />
        <CustomButton label="Modifier" left-icon="lucide:pencil" theme="app" variant="outlined" color="secondary" size="sm" :disabled="updating || deleting" @click="emit('edit', service)" />
        <CustomButton :label="statusActionLabel" :left-icon="statusActionIcon" theme="app" variant="outlined" color="secondary" size="sm" :disabled="updating || deleting" @click="emit('toggleStatus', service)" />
        <CustomButton label="Supprimer" left-icon="lucide:trash-2" theme="app" variant="ghost" color="secondary" size="sm" :disabled="updating || deleting" @click="emit('delete', service)" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { MarketplaceServicePresenter, MarketplaceServiceStatus } from '~/plugins/marketplace-api'

type MarketplaceManagedServiceTracking = {
  activeCount: number
  reviewCount: number
  latestStatusLabel: string
}

const props = defineProps<{
  service: MarketplaceServicePresenter
  tracking?: MarketplaceManagedServiceTracking
  updating?: boolean
  deleting?: boolean
}>()

const emit = defineEmits<{
  edit: [service: MarketplaceServicePresenter]
  toggleStatus: [service: MarketplaceServicePresenter]
  delete: [service: MarketplaceServicePresenter]
}>()

const config = useConfig()

const statusLabels: Record<MarketplaceServiceStatus, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publie',
  ARCHIVED: 'Archive'
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })

const formatMarketplacePrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(price)
}

const servicePath = computed(() => `/marketplace/${props.service.slug}`)
const salesTrackingPath = computed(() => `/marketplace/sales?serviceId=${encodeURIComponent(props.service.id)}`)
const statusLabel = computed(() => statusLabels[props.service.status])

const shortDescription = computed(() => {
  const normalized = props.service.description.replace(/\s+/g, ' ').trim()
  if (normalized.length <= 180) return normalized
  return `${normalized.slice(0, 177).trim()}...`
})

const offerCountLabel = computed(() => {
  const count = props.service.services.length
  return `${count} prestation${count > 1 ? 's' : ''}`
})

const priceLabel = computed(() => {
  const prices = props.service.services
    .map(line => Number(line.price))
    .filter(price => Number.isFinite(price))

  return prices.length ? formatMarketplacePrice(Math.min(...prices)) : ''
})

const ratingLabel = computed(() => {
  if (!props.service.ratingCount) return 'Aucune note'
  return `${Number(props.service.ratingAvg).toFixed(1).replace('.', ',')} (${props.service.ratingCount})`
})

const updatedAtLabel = computed(() => {
  const date = new Date(props.service.updatedAt)
  if (Number.isNaN(date.getTime())) return 'Date inconnue'
  return dateFormatter.format(date)
})

const trackingHeadline = computed(() => {
  if (!props.tracking || (!props.tracking.activeCount && !props.tracking.reviewCount)) {
    return props.service.ordersCount ? props.tracking?.latestStatusLabel || 'Historique disponible' : 'Aucune commande'
  }

  return `${props.tracking.activeCount} ouverte${props.tracking.activeCount > 1 ? 's' : ''} - ${props.tracking.latestStatusLabel}`
})

const statusActionLabel = computed(() => {
  if (props.service.status === 'PUBLISHED') return 'Desactiver'
  if (props.service.status === 'ARCHIVED') return 'Republier'
  return 'Publier'
})

const statusActionIcon = computed(() => {
  if (props.service.status === 'PUBLISHED') return 'lucide:archive'
  return 'lucide:badge-check'
})
</script>

<style scoped>
.marketplace-managed-service-card {
  display: grid;
  grid-template-columns: minmax(calc(var(--services-unit) * 28), 0.34fr) minmax(0, 1fr);
  overflow: hidden;
  border: var(--services-border) solid var(--services-color-line);
  border-radius: var(--services-radius);
  background-color: var(--services-color-panel);
  box-shadow: 0 var(--services-space-3) var(--services-space-8) color-mix(in oklch, var(--services-color-shadow) 54%, var(--services-color-transparent));
}

.marketplace-managed-service-card__cover {
  position: relative;
  display: block;
  min-height: calc(var(--services-unit) * 24);
  background-color: var(--services-color-panel-strong);
  color: inherit;
  text-decoration: none;
}

.marketplace-managed-service-card__cover:focus-visible {
  outline: calc(var(--services-border) * 3) solid var(--services-color-accent);
  outline-offset: calc(var(--services-border) * 3);
}

.marketplace-managed-service-card__cover-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.marketplace-managed-service-card__cover-empty {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: inherit;
  align-items: center;
  justify-content: center;
  color: var(--services-color-subtle);
  background-color: var(--services-color-panel-strong);
}

.marketplace-managed-service-card__cover-empty svg {
  width: calc(var(--services-unit) * 5);
  height: calc(var(--services-unit) * 5);
}

.marketplace-managed-service-card__cover span {
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

.marketplace-managed-service-card__cover span[data-status='PUBLISHED'] {
  color: var(--services-color-success);
}

.marketplace-managed-service-card__cover span[data-status='DRAFT'] {
  color: var(--services-color-warning);
}

.marketplace-managed-service-card__cover span[data-status='ARCHIVED'] {
  color: var(--services-color-subtle);
}

.marketplace-managed-service-card__content {
  display: grid;
  gap: var(--services-space-3);
  padding: var(--services-space-3);
}

.marketplace-managed-service-card__heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--services-space-3);
  align-items: start;
}

.marketplace-managed-service-card__heading > div {
  display: grid;
  gap: calc(var(--services-unit) * 0.5);
}

.marketplace-managed-service-card__heading h3,
.marketplace-managed-service-card__heading p,
.marketplace-managed-service-card__description,
.marketplace-managed-service-card__facts,
.marketplace-managed-service-card__facts dd {
  margin: 0;
}

.marketplace-managed-service-card__heading h3 {
  color: var(--services-color-text);
  font-size: calc(var(--services-unit) * 2.25);
  font-weight: 600;
  line-height: var(--services-line-title);
  overflow-wrap: anywhere;
}

.marketplace-managed-service-card__heading > strong {
  color: var(--services-color-text);
  font-size: calc(var(--services-unit) * 2.25);
  font-weight: 700;
  line-height: var(--services-line-tight);
  white-space: nowrap;
}

.marketplace-managed-service-card__eyebrow {
  color: var(--services-color-subtle);
  font-size: var(--services-font-label);
  font-weight: 600;
  line-height: var(--services-line-body);
  text-transform: uppercase;
}

.marketplace-managed-service-card__description {
  max-width: calc(var(--services-unit) * 88);
  color: var(--services-color-muted);
  font-size: var(--services-font-small);
  line-height: var(--services-line-body);
  text-wrap: pretty;
}

.marketplace-managed-service-card__facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--services-space-2);
}

.marketplace-managed-service-card__facts div {
  display: grid;
  gap: calc(var(--services-unit) * 0.5);
  padding-top: var(--services-space-2);
  border-top: var(--services-border) solid var(--services-color-line);
}

.marketplace-managed-service-card__facts dt {
  color: var(--services-color-muted);
  font-size: var(--services-font-label);
  font-weight: 600;
  line-height: var(--services-line-body);
}

.marketplace-managed-service-card__facts dd {
  color: var(--services-color-text);
  font-size: var(--services-font-small);
  font-weight: 700;
  line-height: var(--services-line-tight);
}

.marketplace-managed-service-card__tracking {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(calc(var(--services-unit) * 10), auto) auto;
  gap: var(--services-space-2);
  align-items: center;
  padding: var(--services-space-2) 0;
  border-top: var(--services-border) solid var(--services-color-line);
  border-bottom: var(--services-border) solid var(--services-color-line);
}

.marketplace-managed-service-card__tracking > span {
  display: grid;
  gap: calc(var(--services-unit) * 0.5);
}

.marketplace-managed-service-card__tracking small {
  color: var(--services-color-subtle);
  font-size: var(--services-font-label);
  font-weight: 700;
  line-height: var(--services-line-body);
  text-transform: uppercase;
}

.marketplace-managed-service-card__tracking strong {
  color: var(--services-color-text);
  font-size: var(--services-font-small);
  font-weight: 700;
  line-height: var(--services-line-tight);
  overflow-wrap: anywhere;
}

.marketplace-managed-service-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--services-space-2);
}

@media (max-width: 72rem) {
  .marketplace-managed-service-card {
    grid-template-columns: 1fr;
  }

  .marketplace-managed-service-card__facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .marketplace-managed-service-card__tracking {
    grid-template-columns: 1fr;
    align-items: start;
  }
}

@media (max-width: 46rem) {
  .marketplace-managed-service-card__facts,
  .marketplace-managed-service-card__heading {
    grid-template-columns: 1fr;
  }

  .marketplace-managed-service-card__heading > strong {
    white-space: normal;
  }
}
</style>
