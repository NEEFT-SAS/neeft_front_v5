<template>
  <main class="marketplace-orders" aria-labelledby="marketplace-orders-title">
    <section class="marketplace-orders__hero">
      <div class="marketplace-orders__shell marketplace-orders__hero-inner">
        <div class="marketplace-orders__hero-copy">
          <p class="marketplace-orders__eyebrow">
            {{ content.eyebrow }}
          </p>
          <h1 id="marketplace-orders-title">
            {{ content.title }}
          </h1>
          <p>{{ content.description }}</p>
        </div>

        <MarketplaceTrackingTabs :active="props.role === 'buyer' ? 'orders' : 'sales'" />
      </div>
    </section>

    <div class="marketplace-orders__shell marketplace-orders__body">
      <template v-if="props.view === 'list'">
        <section
          class="marketplace-orders__workspace marketplace-orders__workspace--list"
          aria-label="Liste des commandes marketplace"
        >
          <aside
            class="marketplace-orders__list-panel marketplace-orders__list-panel--full"
            aria-labelledby="marketplace-orders-list-title"
          >
            <header class="marketplace-orders__toolbar">
              <div>
                <p class="marketplace-orders__eyebrow">
                  {{ content.listTitle }}
                </p>
                <h2 id="marketplace-orders-list-title">
                  {{ visibleOrders.length }} commande{{ visibleOrders.length > 1 ? 's' : '' }}
                </h2>
              </div>

              <CustomInputText
                v-model="searchQuery"
                label="Rechercher une commande"
                label-position="inside"
                left-icon="lucide:search"
                size="sm"
              />
            </header>

            <div class="marketplace-orders__filters" aria-label="Filtrer les commandes">
              <CustomButton
                v-for="filter in marketplaceOrderStatusFilters"
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

            <ul v-if="visibleOrders.length" class="marketplace-orders__list marketplace-orders__list--grid" aria-live="polite">
              <li v-for="order in visibleOrders" :key="order.id">
                <MarketplaceOrderListCard
                  :order="order"
                  :role="props.role"
                  :detail-path="getOrderDetailPath(order)"
                  :counterpart-label="content.counterpartLabel"
                />
              </li>
            </ul>

            <section v-else-if="isOrdersPending" class="marketplace-orders__empty" aria-live="polite">
              <Icon name="lucide:loader-circle" aria-hidden="true" />
              <h2>Chargement des commandes</h2>
              <p>Recuperation du suivi marketplace.</p>
            </section>

            <section v-else-if="ordersError" class="marketplace-orders__empty" aria-live="polite">
              <Icon name="lucide:circle-alert" aria-hidden="true" />
              <h2>Commandes indisponibles</h2>
              <p>Impossible de charger cette vue marketplace.</p>
              <CustomButton label="Reessayer" left-icon="lucide:refresh-cw" theme="app" variant="outlined" color="secondary" size="sm" @click="refreshMarketplaceOrders" />
            </section>

            <section v-else class="marketplace-orders__empty" aria-live="polite">
              <Icon name="lucide:search-x" aria-hidden="true" />
              <h2>{{ content.emptyTitle }}</h2>
              <p>{{ content.emptyDescription }}</p>
            </section>
          </aside>
        </section>
      </template>

      <section v-else class="marketplace-orders__detail-view" aria-label="Detail de commande marketplace">
        <nav class="marketplace-orders__breadcrumb" aria-label="Retour liste">
          <CustomLink
            :label="content.listTitle"
            :to="listPath"
            left-icon="lucide:arrow-left"
            theme="app"
            variant="outlined"
            color="secondary"
            size="sm"
          />
          <span v-if="selectedOrder">{{ selectedOrder.id }}</span>
        </nav>

        <section v-if="isOrdersPending" class="marketplace-orders__empty marketplace-orders__empty--standalone" aria-live="polite">
          <Icon name="lucide:loader-circle" aria-hidden="true" />
          <h2>Chargement de la commande</h2>
          <p>Recuperation du detail marketplace.</p>
        </section>

        <section v-else-if="ordersError" class="marketplace-orders__empty marketplace-orders__empty--standalone" aria-live="polite">
          <Icon name="lucide:circle-alert" aria-hidden="true" />
          <h2>Commande indisponible</h2>
          <p>Impossible de charger cette commande marketplace.</p>
          <CustomButton label="Reessayer" left-icon="lucide:refresh-cw" theme="app" variant="outlined" color="secondary" size="sm" @click="refreshMarketplaceOrders" />
        </section>

        <section v-else-if="selectedOrder" class="marketplace-orders__detail marketplace-orders__detail--standalone" :aria-labelledby="detailTitleId">
          <div class="marketplace-orders__detail-cover">
            <MarketplaceSafeImage
              :src="selectedOrder.serviceCoverImage"
              :alt="`Image du service ${selectedOrder.serviceTitle}`"
              empty-class="marketplace-orders__detail-cover-empty"
              width="920"
              height="300"
              loading="lazy"
              decoding="async"
            />
          </div>

          <header class="marketplace-orders__detail-header">
            <div class="marketplace-orders__detail-heading">
              <p class="marketplace-orders__eyebrow">
                {{ selectedOrder.id }} - {{ content.detailTitle }}
              </p>
              <h2 :id="detailTitleId">
                {{ selectedOrder.serviceTitle }}
              </h2>
              <p>{{ selectedOrder.scope }}</p>
            </div>

            <MarketplaceOrderStatus :status="selectedOrder.status" size="lg" />
          </header>

          <MarketplaceOrderNextActionCard
            :order="selectedOrder"
            :role="props.role"
            :action-order-id="actionOrderId"
            @run="runPrimaryAction"
          />

          <div class="marketplace-orders__detail-grid">
            <MarketplaceOrderTimelineCard :order="selectedOrder" />
            <MarketplaceOrderCounterpartCard :order="selectedOrder" :role="props.role" :counterpart-label="content.counterpartLabel" />
          </div>

          <MarketplaceOrderDeliverablesCard :order="selectedOrder" />
          <MarketplaceOrderMessagesCard :order="selectedOrder" @open="openMessages" />
        </section>

        <section v-else class="marketplace-orders__empty marketplace-orders__empty--standalone" aria-live="polite">
          <Icon name="lucide:file-x-2" aria-hidden="true" />
          <h2>Commande introuvable</h2>
          <p>Cette commande n existe pas dans cette vue ou n est plus accessible.</p>
          <CustomLink
            :label="`Retour ${content.listTitle.toLocaleLowerCase('fr-FR')}`"
            :to="listPath"
            left-icon="lucide:arrow-left"
            theme="app"
            variant="filled"
            color="primary"
            size="sm"
          />
        </section>
      </section>
    </div>

    <MarketplaceOrderStatusConfirmModal
      :model-value="Boolean(pendingStatusAction)"
      :order="pendingStatusAction?.order || null"
      :target-status="pendingStatusAction?.nextStatus || null"
      :processing="Boolean(actionOrderId)"
      @update:model-value="handleStatusConfirmationToggle"
      @confirm="confirmPendingStatusAction"
    />
  </main>
</template>

<script setup lang="ts">
import type { MarketplaceOrderStatus as MarketplaceApiOrderStatus } from '~/plugins/marketplace-api'
import { getMarketplaceOrderAmountLabel, marketplaceOrderRoleContent, marketplaceOrderStatusFilters, marketplaceOrderStatusMeta, toMarketplaceOrder, toMarketplaceOrders, type MarketplaceOrder, type MarketplaceOrderRole, type MarketplaceOrderStatus, type MarketplaceOrderStatusFilter } from '~/datas/marketplace/orders'

const props = withDefaults(defineProps<{
  role: MarketplaceOrderRole
  view?: 'list' | 'detail'
  orderId?: string
}>(), {
  view: 'list',
  orderId: ''
})

const marketplaceToast = useMarketplaceToasts()
const { $marketplaceAPI } = useNuxtApp()
const route = useRoute()
const generatedId = useId()
const detailTitleId = `marketplace-orders-detail-title-${generatedId}`

const searchQuery = ref('')
const activeStatus = ref<MarketplaceOrderStatusFilter>('all')
const actionOrderId = ref('')
const pendingStatusAction = ref<{ order: MarketplaceOrder; nextStatus: MarketplaceApiOrderStatus } | null>(null)

const content = computed(() => marketplaceOrderRoleContent[props.role])
const listPath = computed(() => props.role === 'buyer' ? '/marketplace/orders' : '/marketplace/sales')
const marketplaceOrdersDataKey = computed(() => props.view === 'detail' && props.orderId ? `marketplace-orders-${props.role}-${props.orderId}` : `marketplace-orders-${props.role}-list`)
const serviceIdFilter = computed(() => {
  const value = route.query.serviceId
  return Array.isArray(value) ? value[0] || '' : String(value || '')
})

const fetchMarketplaceOrders = async () => {
  if (props.view === 'detail' && props.orderId) {
    const order = props.role === 'buyer'
      ? await $marketplaceAPI.orders.getBuyer(props.orderId)
      : await $marketplaceAPI.orders.getSeller(props.orderId)

    return [toMarketplaceOrder(order, props.role)]
  }

  const query = serviceIdFilter.value ? { limit: 100, serviceId: serviceIdFilter.value } : { limit: 100 }
  const response = props.role === 'buyer'
    ? await $marketplaceAPI.orders.listBuyer(query)
    : await $marketplaceAPI.orders.listSeller(query)

  return toMarketplaceOrders(response.data, props.role)
}

const { data: marketplaceOrders, pending: isOrdersPending, error: ordersError, refresh: refreshOrders } = await useAsyncData(marketplaceOrdersDataKey.value, fetchMarketplaceOrders, { watch: [() => props.role, () => props.view, () => props.orderId, serviceIdFilter] })
const orders = computed(() => marketplaceOrders.value || [])
const refreshMarketplaceOrders = () => refreshOrders()

const normalizeSearch = (value: string) => value
  .toLocaleLowerCase('fr-FR')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')

const statusMeta = (status: MarketplaceOrderStatus) => marketplaceOrderStatusMeta[status]

const getCounterpart = (order: MarketplaceOrder) => props.role === 'buyer' ? order.seller : order.buyer
const getAction = (order: MarketplaceOrder) => order.nextActions[props.role]

const visibleOrders = computed(() => {
  const query = normalizeSearch(searchQuery.value.trim())

  return orders.value.filter((order) => {
    const matchesStatus = activeStatus.value === 'all' || order.status === activeStatus.value
    const matchesService = !serviceIdFilter.value || order.serviceId === serviceIdFilter.value

    if (!matchesStatus || !matchesService) return false
    if (!query) return true

    const index = normalizeSearch([
      order.id,
      order.serviceTitle,
      order.scope,
      order.nextCheckpoint,
      statusMeta(order.status).label,
      getCounterpart(order).name,
      getCounterpart(order).role,
      order.dueAt,
      getMarketplaceOrderAmountLabel(order)
    ].join(' '))

    return index.includes(query)
  })
})

const selectedOrder = computed(() => {
  if (!props.orderId) return null
  return orders.value.find(order => order.id === props.orderId) || null
})

const getStatusCount = (status: MarketplaceOrderStatusFilter) => {
  if (status === 'all') return orders.value.length
  return orders.value.filter(order => order.status === status).length
}

const getOrderDetailPath = (order: MarketplaceOrder) => {
  return props.role === 'buyer' ? `/marketplace/orders/${order.id}` : `/marketplace/sales/${order.id}`
}

const getNextMarketplaceStatus = (order: MarketplaceOrder): MarketplaceApiOrderStatus | null => {
  if (props.role === 'seller') {
    if (order.apiStatus === 'PENDING') return 'ACCEPTED'
    if (order.apiStatus === 'ACCEPTED') return 'IN_PROGRESS'
    if (order.apiStatus === 'IN_PROGRESS') return 'DELIVERED'
  }

  if (props.role === 'buyer' && order.apiStatus === 'DELIVERED') {
    return 'COMPLETED'
  }

  return null
}

const requiresStatusConfirmation = (nextStatus: MarketplaceApiOrderStatus) => {
  return nextStatus === 'DELIVERED' || nextStatus === 'COMPLETED'
}

const getStatusNote = (nextStatus: MarketplaceApiOrderStatus) => {
  if (nextStatus === 'ACCEPTED') return 'Commande acceptee par le vendeur.'
  if (nextStatus === 'IN_PROGRESS') return 'Mission demarree par le vendeur.'
  if (nextStatus === 'DELIVERED') return 'Livraison envoyee par le vendeur. Validation client attendue.'
  if (nextStatus === 'COMPLETED') return 'Livraison validee par le client. Commande terminee.'
  return undefined
}

const runPrimaryAction = async (order: MarketplaceOrder) => {
  const action = getAction(order)
  const nextStatus = getNextMarketplaceStatus(order)

  if (action.disabled) return

  if (!nextStatus) {
    marketplaceToast.orders.actionInfo({
      title: action.title,
      desc: `${order.id} - ${action.ctaLabel}`,
      icon: action.icon,
      urgent: action.urgent
    })
    return
  }

  if (requiresStatusConfirmation(nextStatus)) {
    pendingStatusAction.value = { order, nextStatus }
    return
  }

  await updateOrderStatus(order, nextStatus)
}

const updateOrderStatus = async (order: MarketplaceOrder, nextStatus: MarketplaceApiOrderStatus) => {
  const action = getAction(order)
  actionOrderId.value = order.id

  try {
    if (props.role === 'seller') {
      await $marketplaceAPI.orders.updateSellerStatus(order.id, { status: nextStatus, note: getStatusNote(nextStatus) })
    } else {
      await $marketplaceAPI.orders.updateBuyerStatus(order.id, { status: nextStatus, note: getStatusNote(nextStatus) })
    }

    await refreshOrders()
    pendingStatusAction.value = null

    marketplaceToast.orders.statusUpdated(order.id, action.ctaLabel, action.icon)
  } catch {
    marketplaceToast.orders.statusUpdateFailed()
  } finally {
    actionOrderId.value = ''
  }
}

const handleStatusConfirmationToggle = (value: boolean) => {
  if (!value && !actionOrderId.value) {
    pendingStatusAction.value = null
  }
}

const confirmPendingStatusAction = async () => {
  if (!pendingStatusAction.value) return
  await updateOrderStatus(pendingStatusAction.value.order, pendingStatusAction.value.nextStatus)
}

const openMessages = (order: MarketplaceOrder) => {
  marketplaceToast.orders.conversationOpened(order.id)
}
</script>

<style scoped>
.marketplace-orders {
  --orders-unit: var(--unit);
  --orders-space-1: var(--space-1);
  --orders-space-2: var(--space-2);
  --orders-space-3: var(--space-3);
  --orders-space-4: calc(var(--orders-unit) * 4);
  --orders-space-5: calc(var(--orders-unit) * 5);
  --orders-space-6: calc(var(--orders-unit) * 6);
  --orders-space-8: calc(var(--orders-unit) * 8);
  --orders-space-10: calc(var(--orders-unit) * 10);
  --orders-space-fluid: clamp(var(--orders-space-3), calc(var(--orders-space-2) + 3vw), var(--orders-space-8));
  --orders-content-max: calc(var(--orders-unit) * 140);
  --orders-cover-height: calc(var(--orders-unit) * 28);
  --orders-hit-size: calc(var(--orders-unit) * 5);
  --orders-icon-size: calc(var(--orders-unit) * 2.1);
  --orders-border: var(--border);
  --orders-radius: var(--radius);
  --orders-radius-round: var(--radius-round);
  --orders-font-title: calc(var(--orders-unit) * 5.5);
  --orders-font-section: calc(var(--orders-unit) * 2.75);
  --orders-font-body: calc(var(--orders-unit) * 2);
  --orders-font-small: calc(var(--orders-unit) * 1.75);
  --orders-font-label: calc(var(--orders-unit) * 1.5);
  --orders-line-tight: var(--line-tight);
  --orders-line-title: var(--line-title);
  --orders-line-body: var(--line-base);
  --orders-color-bg: var(--color-bg);
  --orders-color-bg-soft: color-mix(in oklch, var(--orders-color-panel) 62%, var(--orders-color-bg));
  --orders-color-panel: var(--color-surface);
  --orders-color-panel-strong: color-mix(in oklch, var(--orders-color-panel) 82%, var(--orders-color-bg));
  --orders-color-panel-hover: color-mix(in oklch, var(--orders-color-panel) 88%, var(--orders-color-bg));
  --orders-color-line: var(--app-color-line);
  --orders-color-line-strong: color-mix(in oklch, var(--color-line) 72%, var(--color-accent));
  --orders-color-text: var(--color-text);
  --orders-color-muted: var(--app-color-muted);
  --orders-color-subtle: var(--app-color-subtle);
  --orders-color-accent: var(--color-accent);
  --orders-color-success: var(--color-success);
  --orders-color-warning: oklch(78% 0.16 72);
  --orders-color-danger: var(--color-danger);
  --orders-color-shadow: var(--color-shadow);
  --orders-color-transparent: var(--color-transparent);
  min-height: calc(100vh - var(--app-header-height));
  background-color: var(--orders-color-bg);
  color: var(--orders-color-text);
  font-family: var(--font-ui, ui-sans-serif, system-ui, sans-serif);
  letter-spacing: 0;
}

.marketplace-orders *,
.marketplace-orders *::before,
.marketplace-orders *::after {
  box-sizing: border-box;
  min-width: 0;
  letter-spacing: 0;
}

.marketplace-orders__shell {
  width: min(calc(100% - (var(--orders-space-fluid) * 2)), var(--orders-content-max));
  margin: 0 auto;
}

.marketplace-orders__hero {
  background-color: var(--orders-color-bg-soft);
}

.marketplace-orders__hero-inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--orders-space-3);
  align-items: end;
  padding: var(--orders-space-6) 0 var(--orders-space-4);
}

.marketplace-orders__hero-copy {
  display: grid;
  gap: var(--orders-space-2);
  max-width: calc(var(--orders-unit) * 88);
}

.marketplace-orders__eyebrow,
.marketplace-orders h1,
.marketplace-orders h2,
.marketplace-orders h3,
.marketplace-orders h4,
.marketplace-orders p,
.marketplace-orders dl,
.marketplace-orders dd {
  margin: 0;
}

.marketplace-orders__eyebrow {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-body);
  text-transform: uppercase;
}

.marketplace-orders h1 {
  color: var(--orders-color-text);
  font-size: var(--orders-font-title);
  font-weight: 600;
  line-height: var(--orders-line-tight);
  overflow-wrap: anywhere;
}

.marketplace-orders__hero-copy > p,
.marketplace-orders__detail-heading > p {
  color: var(--orders-color-muted);
  font-size: var(--orders-font-body);
  line-height: var(--orders-line-body);
  text-wrap: pretty;
}

.marketplace-orders__body {
  display: grid;
  gap: var(--orders-space-5);
  padding: var(--orders-space-5) 0 var(--orders-space-10);
}

.marketplace-orders__workspace--list {
  display: grid;
  grid-template-columns: 1fr;
}

.marketplace-orders__list-panel {
  display: grid;
  gap: var(--orders-space-4);
}

.marketplace-orders__list-panel--full {
  position: static;
  max-height: none;
}

.marketplace-orders__toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(calc(var(--orders-unit) * 30), calc(var(--orders-unit) * 46));
  gap: var(--orders-space-4);
  align-items: end;
}

.marketplace-orders__toolbar h2,
.marketplace-orders__detail-header h2 {
  color: var(--orders-color-text);
  font-size: var(--orders-font-section);
  font-weight: 600;
  line-height: var(--orders-line-title);
}

.marketplace-orders__filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--orders-space-2);
}

.marketplace-orders__filters :deep(.cus-button) {
  min-width: auto;
}

.marketplace-orders__list {
  display: grid;
  gap: var(--orders-space-1);
  margin: 0;
  padding: 0;
  list-style: none;
}

.marketplace-orders__list--grid {
  grid-template-columns: 1fr;
  gap: 0;
  border-top: var(--orders-border) solid var(--orders-color-line);
}

.marketplace-orders__empty {
  display: grid;
  justify-items: center;
  gap: var(--orders-space-2);
  padding: var(--orders-space-6) var(--orders-space-3);
  text-align: center;
}

.marketplace-orders__empty--standalone {
  border: var(--orders-border) solid var(--orders-color-line);
  border-radius: var(--orders-radius);
  background-color: var(--orders-color-transparent);
}

.marketplace-orders__empty svg {
  width: var(--orders-hit-size);
  height: var(--orders-hit-size);
  color: var(--orders-color-subtle);
}

.marketplace-orders__empty h2 {
  color: var(--orders-color-text);
  font-size: var(--orders-font-section);
  font-weight: 600;
  line-height: var(--orders-line-title);
}

.marketplace-orders__empty p {
  max-width: calc(var(--orders-unit) * 56);
  color: var(--orders-color-muted);
  font-size: var(--orders-font-small);
  line-height: var(--orders-line-body);
}

.marketplace-orders__detail-view {
  display: grid;
  gap: var(--orders-space-4);
}

.marketplace-orders__breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: var(--orders-space-2);
  align-items: center;
  justify-content: space-between;
}

.marketplace-orders__breadcrumb > span {
  color: var(--orders-color-muted);
  font-size: var(--orders-font-small);
  font-weight: 600;
  line-height: var(--orders-line-body);
}

.marketplace-orders__detail {
  display: grid;
  gap: var(--orders-space-4);
}

.marketplace-orders__detail-cover {
  height: var(--orders-cover-height);
  overflow: hidden;
  border-radius: var(--orders-radius);
  background-color: var(--orders-color-panel-strong);
}

.marketplace-orders__detail-cover img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.marketplace-orders__detail-cover-empty {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: var(--orders-color-subtle);
}

.marketplace-orders__detail-cover-empty svg {
  width: calc(var(--orders-unit) * 6);
  height: calc(var(--orders-unit) * 6);
}

.marketplace-orders__detail-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--orders-space-3);
  align-items: start;
}

.marketplace-orders__detail-heading {
  display: grid;
  gap: var(--orders-space-1);
}

.marketplace-orders__detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: var(--orders-space-4);
  align-items: start;
}

@media (max-width: 72rem) {
  .marketplace-orders__hero-inner,
  .marketplace-orders__detail-grid {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 46rem) {
  .marketplace-orders__shell {
    width: min(calc(100% - (var(--orders-space-3) * 2)), var(--orders-content-max));
  }

  .marketplace-orders__hero-inner {
    padding: var(--orders-space-3);
  }

  .marketplace-orders__hero-inner,
  .marketplace-orders__toolbar,
  .marketplace-orders__detail-header {
    grid-template-columns: 1fr;
  }

  .marketplace-orders__list--grid {
    grid-template-columns: 1fr;
  }

}
</style>
