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

        <nav class="marketplace-orders__role-tabs" aria-label="Vues du suivi marketplace">
          <NuxtLink
            class="marketplace-orders__role-tab"
            :class="{ 'marketplace-orders__role-tab--active': props.role === 'buyer' }"
            to="/marketplace/orders"
            :aria-current="props.role === 'buyer' ? 'page' : undefined"
          >
            <Icon name="lucide:shopping-bag" aria-hidden="true" />
            <span>Achats</span>
          </NuxtLink>
          <NuxtLink
            class="marketplace-orders__role-tab"
            :class="{ 'marketplace-orders__role-tab--active': props.role === 'seller' }"
            to="/marketplace/sales"
            :aria-current="props.role === 'seller' ? 'page' : undefined"
          >
            <Icon name="lucide:inbox" aria-hidden="true" />
            <span>Ventes</span>
          </NuxtLink>
          <NuxtLink
            class="marketplace-orders__role-tab"
            to="/marketplace/services"
          >
            <Icon name="lucide:store" aria-hidden="true" />
            <span>Services</span>
          </NuxtLink>
        </nav>
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
                <NuxtLink
                  class="marketplace-orders__card"
                  :to="getOrderDetailPath(order)"
                  :data-urgent="getAction(order).urgent ? 'true' : 'false'"
                  :aria-label="`Voir le detail de ${order.id}, ${order.serviceTitle}`"
                >
                  <span class="marketplace-orders__card-main">
                    <span class="marketplace-orders__service-icon" aria-hidden="true">
                      <Icon :name="order.serviceIcon" />
                    </span>

                    <span class="marketplace-orders__card-content">
                      <span class="marketplace-orders__card-heading">
                        <span class="marketplace-orders__card-title">
                          <strong>{{ order.serviceTitle }}</strong>
                          <span>{{ order.id }} - {{ content.counterpartLabel }} {{ getCounterpart(order).name }}</span>
                        </span>
                        <span v-if="hasUnread(order)" class="marketplace-orders__unread" aria-label="Message non lu" />
                      </span>

                      <span class="marketplace-orders__card-action">
                        <Icon :name="getAction(order).icon" aria-hidden="true" />
                        <span>
                          <small>Prochaine action</small>
                          <strong>{{ getAction(order).title }}</strong>
                        </span>
                      </span>

                      <span class="marketplace-orders__card-progress-head">
                        <span>{{ order.nextCheckpoint }}</span>
                        <strong>{{ order.progress }}%</strong>
                      </span>

                      <span
                        class="marketplace-orders__progress"
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        :aria-valuenow="order.progress"
                        :aria-label="`Progression ${order.progress}%`"
                        :style="{ '--marketplace-order-progress': `${order.progress}%` }"
                      >
                        <span />
                      </span>
                    </span>
                  </span>

                  <span class="marketplace-orders__card-side">
                    <MarketplaceOrderStatus :status="order.status" />
                    <strong>{{ getMarketplaceOrderAmountLabel(order) }}</strong>
                    <span class="marketplace-orders__card-due">
                      <Icon name="lucide:calendar-clock" aria-hidden="true" />
                      <span>{{ order.dueAt }}</span>
                    </span>
                    <Icon name="lucide:chevron-right" aria-hidden="true" />
                  </span>
                </NuxtLink>
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
            <NuxtImg
              :src="selectedOrder.serviceCoverImage"
              :alt="`Image du service ${selectedOrder.serviceTitle}`"
              width="920"
              height="300"
              format="webp"
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

          <section class="marketplace-orders__next-action" :data-urgent="getAction(selectedOrder).urgent ? 'true' : 'false'">
            <span class="marketplace-orders__next-action-icon" aria-hidden="true">
              <Icon :name="getAction(selectedOrder).icon" />
            </span>
            <div>
              <p class="marketplace-orders__eyebrow">
                Prochaine action
              </p>
              <h3>{{ getAction(selectedOrder).title }}</h3>
              <p>{{ getAction(selectedOrder).description }}</p>
            </div>
            <CustomButton
              :label="actionOrderId === selectedOrder.id ? 'Mise a jour...' : getAction(selectedOrder).ctaLabel"
              :left-icon="getAction(selectedOrder).icon"
              theme="app"
              variant="filled"
              color="primary"
              size="sm"
              :disabled="getAction(selectedOrder).disabled || actionOrderId === selectedOrder.id"
              @click="runPrimaryAction(selectedOrder)"
            />
          </section>

          <div class="marketplace-orders__detail-grid">
            <section class="marketplace-orders__panel marketplace-orders__panel--timeline" aria-labelledby="marketplace-orders-timeline-title">
              <header class="marketplace-orders__panel-header">
                <div>
                  <p class="marketplace-orders__eyebrow">
                    Timeline
                  </p>
                  <h3 id="marketplace-orders-timeline-title">
                    Avancement
                  </h3>
                </div>
                <span>{{ selectedOrder.progress }}%</span>
              </header>

              <ol class="marketplace-orders__timeline">
                <li v-for="milestone in selectedOrder.milestones" :key="`${selectedOrder.id}-${milestone.title}`" :data-state="milestone.state">
                  <span class="marketplace-orders__timeline-marker" aria-hidden="true">
                    <Icon :name="getMilestoneIcon(milestone.state)" />
                  </span>
                  <div>
                    <span>{{ milestone.date }}</span>
                    <h4>{{ milestone.title }}</h4>
                    <p>{{ milestone.description }}</p>
                  </div>
                </li>
              </ol>
            </section>

            <section class="marketplace-orders__panel" aria-labelledby="marketplace-orders-context-title">
              <header class="marketplace-orders__panel-header">
                <div>
                  <p class="marketplace-orders__eyebrow">
                    {{ content.counterpartLabel }}
                  </p>
                  <h3 id="marketplace-orders-context-title">
                    {{ getCounterpart(selectedOrder).name }}
                  </h3>
                </div>
                <span class="marketplace-orders__avatar" aria-hidden="true">
                  {{ getInitials(getCounterpart(selectedOrder).name) }}
                </span>
              </header>

              <dl class="marketplace-orders__facts">
                <div>
                  <dt>Role</dt>
                  <dd>{{ getCounterpart(selectedOrder).role }}</dd>
                </div>
                <div>
                  <dt>Commande</dt>
                  <dd>{{ selectedOrder.orderedAt }}</dd>
                </div>
                <div>
                  <dt>Echeance</dt>
                  <dd>{{ selectedOrder.dueAt }}</dd>
                </div>
                <div>
                  <dt>Mise a jour</dt>
                  <dd>{{ selectedOrder.updatedAt }}</dd>
                </div>
              </dl>

              <CustomLink
                label="Voir le service"
                :to="`/marketplace/${selectedOrder.serviceSlug}`"
                left-icon="lucide:external-link"
                theme="app"
                variant="outlined"
                color="secondary"
                size="sm"
              />
            </section>
          </div>

          <section class="marketplace-orders__panel" aria-labelledby="marketplace-orders-deliverables-title">
            <header class="marketplace-orders__panel-header">
              <div>
                <p class="marketplace-orders__eyebrow">
                  Mission
                </p>
                <h3 id="marketplace-orders-deliverables-title">
                  Livrables
                </h3>
              </div>
              <span>{{ selectedOrder.nextCheckpoint }}</span>
            </header>

            <ul class="marketplace-orders__deliverables">
              <li v-for="deliverable in selectedOrder.deliverables" :key="deliverable.title" :data-status="deliverable.status">
                <Icon :name="getDeliverableIcon(deliverable.status)" aria-hidden="true" />
                <span>
                  <strong>{{ deliverable.title }}</strong>
                  <small>{{ deliverable.description }}</small>
                </span>
                <em>{{ getDeliverableLabel(deliverable.status) }}</em>
              </li>
            </ul>
          </section>

          <section class="marketplace-orders__panel" aria-labelledby="marketplace-orders-messages-title">
            <header class="marketplace-orders__panel-header">
              <div>
                <p class="marketplace-orders__eyebrow">
                  Conversation
                </p>
                <h3 id="marketplace-orders-messages-title">
                  Derniers messages
                </h3>
              </div>
              <CustomButton
                label="Ouvrir"
                left-icon="lucide:message-circle"
                theme="app"
                variant="outlined"
                color="secondary"
                size="sm"
                @click="openMessages(selectedOrder)"
              />
            </header>

            <ul class="marketplace-orders__messages">
              <li v-for="message in selectedOrder.messages" :key="`${message.author}-${message.date}-${message.excerpt}`">
                <span class="marketplace-orders__message-icon" aria-hidden="true">
                  <Icon :name="message.role === 'system' ? 'lucide:bot' : 'lucide:user-round'" />
                </span>
                <span>
                  <strong>{{ message.author }}</strong>
                  <small>{{ message.date }}</small>
                  <p>{{ message.excerpt }}</p>
                </span>
              </li>
            </ul>
          </section>
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
  </main>
</template>

<script setup lang="ts">
import type { MarketplaceOrderStatus as MarketplaceApiOrderStatus } from '~/plugins/marketplace-api'
import { getMarketplaceOrderAmountLabel, marketplaceOrderRoleContent, marketplaceOrderStatusFilters, marketplaceOrderStatusMeta, toMarketplaceOrder, toMarketplaceOrders, type MarketplaceDeliverableStatus, type MarketplaceOrder, type MarketplaceOrderRole, type MarketplaceOrderStatus, type MarketplaceOrderStatusFilter, type MarketplaceTimelineState } from '~/datas/marketplace/orders'

const props = withDefaults(defineProps<{
  role: MarketplaceOrderRole
  view?: 'list' | 'detail'
  orderId?: string
}>(), {
  view: 'list',
  orderId: ''
})

const toast = useToast()
const { $marketplaceAPI } = useNuxtApp()
const generatedId = useId()
const detailTitleId = `marketplace-orders-detail-title-${generatedId}`

const searchQuery = ref('')
const activeStatus = ref<MarketplaceOrderStatusFilter>('all')
const actionOrderId = ref('')

const content = computed(() => marketplaceOrderRoleContent[props.role])
const listPath = computed(() => props.role === 'buyer' ? '/marketplace/orders' : '/marketplace/sales')
const marketplaceOrdersDataKey = computed(() => props.view === 'detail' && props.orderId ? `marketplace-orders-${props.role}-${props.orderId}` : `marketplace-orders-${props.role}-list`)

const fetchMarketplaceOrders = async () => {
  if (props.view === 'detail' && props.orderId) {
    const order = props.role === 'buyer'
      ? await $marketplaceAPI.orders.getBuyer(props.orderId)
      : await $marketplaceAPI.orders.getSeller(props.orderId)

    return [toMarketplaceOrder(order, props.role)]
  }

  const response = props.role === 'buyer'
    ? await $marketplaceAPI.orders.listBuyer({ limit: 100 })
    : await $marketplaceAPI.orders.listSeller({ limit: 100 })

  return toMarketplaceOrders(response.data, props.role)
}

const { data: marketplaceOrders, pending: isOrdersPending, error: ordersError, refresh: refreshOrders } = await useAsyncData(marketplaceOrdersDataKey.value, fetchMarketplaceOrders, { watch: [() => props.role, () => props.view, () => props.orderId] })
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

    if (!matchesStatus) return false
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

const hasUnread = (order: MarketplaceOrder) => {
  return order.messages.some(message => message.unreadFor?.includes(props.role))
}

const getOrderDetailPath = (order: MarketplaceOrder) => {
  return props.role === 'buyer' ? `/marketplace/orders/${order.id}` : `/marketplace/sales/${order.id}`
}

const getInitials = (value: string) => {
  const words = value.trim().split(/\s+/).filter(Boolean)
  if (!words.length) return ''

  return words
    .slice(0, 2)
    .map(word => Array.from(word)[0])
    .join('')
    .toUpperCase()
}

const getMilestoneIcon = (state: MarketplaceTimelineState) => {
  if (state === 'done') return 'lucide:check'
  if (state === 'current') return 'lucide:radio'
  return 'lucide:circle'
}

const getDeliverableIcon = (status: MarketplaceDeliverableStatus) => {
  if (status === 'approved') return 'lucide:circle-check'
  if (status === 'ready') return 'lucide:file-check-2'
  return 'lucide:file-clock'
}

const getDeliverableLabel = (status: MarketplaceDeliverableStatus) => {
  if (status === 'approved') return 'Valide'
  if (status === 'ready') return 'Pret'
  return 'A venir'
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

const runPrimaryAction = async (order: MarketplaceOrder) => {
  const action = getAction(order)
  const nextStatus = getNextMarketplaceStatus(order)

  if (action.disabled) return

  if (!nextStatus) {
    toast.add({
      title: action.title,
      desc: `${order.id} - ${action.ctaLabel}`,
      icon: action.icon,
      variant: action.urgent ? 'warning' : 'info'
    })
    return
  }

  actionOrderId.value = order.id

  try {
    if (props.role === 'seller') {
      await $marketplaceAPI.orders.updateSellerStatus(order.id, { status: nextStatus })
    } else {
      await $marketplaceAPI.orders.updateBuyerStatus(order.id, { status: nextStatus })
    }

    await refreshOrders()

    toast.add({
      title: 'Commande mise a jour',
      desc: `${order.id} - ${action.ctaLabel}`,
      icon: action.icon,
      variant: 'success'
    })
  } catch {
    toast.add({
      title: 'Action impossible',
      desc: 'La commande n a pas pu etre mise a jour.',
      icon: 'lucide:circle-alert',
      variant: 'error'
    })
  } finally {
    actionOrderId.value = ''
  }
}

const openMessages = (order: MarketplaceOrder) => {
  toast.add({
    title: 'Conversation',
    desc: `${order.id} - messagerie de commande`,
    icon: 'lucide:message-circle',
    variant: 'neutral'
  })
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
.marketplace-orders__detail-heading > p,
.marketplace-orders__next-action p,
.marketplace-orders__timeline p,
.marketplace-orders__messages p {
  color: var(--orders-color-muted);
  font-size: var(--orders-font-body);
  line-height: var(--orders-line-body);
  text-wrap: pretty;
}

.marketplace-orders__role-tabs {
  display: inline-grid;
  grid-template-columns: repeat(3, minmax(calc(var(--orders-unit) * 13), 1fr));
  gap: var(--orders-space-1);
  padding: var(--orders-space-1);
  border: var(--orders-border) solid var(--orders-color-line);
  border-radius: var(--orders-radius-round);
  background-color: var(--orders-color-bg);
}

.marketplace-orders__role-tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--orders-hit-size);
  gap: var(--orders-space-1);
  padding: 0 var(--orders-space-2);
  border-radius: var(--orders-radius-round);
  color: var(--orders-color-muted);
  font-size: var(--orders-font-small);
  font-weight: 600;
  line-height: var(--orders-line-tight);
  text-decoration: none;
}

.marketplace-orders__role-tab:hover,
.marketplace-orders__role-tab--active {
  background-color: color-mix(in oklch, var(--orders-color-accent) 14%, var(--orders-color-bg));
  color: var(--orders-color-text);
}

.marketplace-orders__role-tab:focus-visible,
.marketplace-orders__card:focus-visible {
  outline: calc(var(--orders-border) * 3) solid var(--orders-color-accent);
  outline-offset: calc(var(--orders-border) * 3);
}

.marketplace-orders__body {
  display: grid;
  gap: var(--orders-space-5);
  padding: var(--orders-space-5) 0 var(--orders-space-10);
}

.marketplace-orders__service-icon,
.marketplace-orders__next-action-icon,
.marketplace-orders__message-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--orders-hit-size) * 0.82);
  height: calc(var(--orders-hit-size) * 0.82);
  min-width: calc(var(--orders-hit-size) * 0.82);
  border-radius: var(--orders-radius-round);
  background-color: color-mix(in oklch, var(--orders-color-accent) 10%, var(--orders-color-panel));
  color: var(--orders-color-accent);
}

.marketplace-orders__role-tab svg,
.marketplace-orders__service-icon svg,
.marketplace-orders__next-action-icon svg,
.marketplace-orders__message-icon svg {
  width: var(--orders-icon-size);
  height: var(--orders-icon-size);
}

.marketplace-orders__facts dt,
.marketplace-orders__deliverables small,
.marketplace-orders__messages small {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-body);
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
.marketplace-orders__detail-header h2,
.marketplace-orders__panel h3,
.marketplace-orders__next-action h3 {
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

.marketplace-orders__list,
.marketplace-orders__timeline,
.marketplace-orders__deliverables,
.marketplace-orders__messages {
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

.marketplace-orders__card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  width: 100%;
  min-height: 100%;
  gap: var(--orders-space-4);
  padding: var(--orders-space-4) 0;
  border-bottom: var(--orders-border) solid var(--orders-color-line);
  background-color: var(--orders-color-transparent);
  color: inherit;
  font: inherit;
  text-align: left;
  text-decoration: none;
  transition-duration: var(--motion-fast);
}

.marketplace-orders__card:hover {
  background-color: color-mix(in oklch, var(--orders-color-panel) 38%, var(--orders-color-transparent));
}

.marketplace-orders__card[data-urgent='true'] {
  border-color: color-mix(in oklch, var(--orders-color-warning) 34%, var(--orders-color-line));
}

.marketplace-orders__card-main {
  display: grid;
  grid-template-columns: var(--orders-hit-size) minmax(0, 1fr);
  gap: var(--orders-space-3);
  align-items: start;
}

.marketplace-orders__card-content {
  display: grid;
  gap: var(--orders-space-2);
}

.marketplace-orders__card-heading {
  display: flex;
  gap: var(--orders-space-2);
  align-items: start;
  justify-content: space-between;
}

.marketplace-orders__card-title {
  display: grid;
  gap: calc(var(--orders-unit) * 0.5);
}

.marketplace-orders__card-title strong,
.marketplace-orders__deliverables strong,
.marketplace-orders__messages strong {
  color: var(--orders-color-text);
  font-size: var(--orders-font-small);
  font-weight: 600;
  line-height: var(--orders-line-title);
  overflow-wrap: anywhere;
}

.marketplace-orders__card-title span,
.marketplace-orders__card-action,
.marketplace-orders__card-progress-head,
.marketplace-orders__card-due,
.marketplace-orders__facts dd {
  color: var(--orders-color-muted);
  font-size: var(--orders-font-small);
  line-height: var(--orders-line-body);
}

.marketplace-orders__unread {
  width: calc(var(--orders-unit) * 1.25);
  height: calc(var(--orders-unit) * 1.25);
  border-radius: var(--orders-radius-round);
  background-color: var(--orders-color-danger);
}

.marketplace-orders__card-action {
  display: inline-grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  justify-self: start;
  gap: var(--orders-space-1);
  font-weight: 600;
}

.marketplace-orders__card-action small {
  display: block;
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-tight);
}

.marketplace-orders__card-action strong {
  display: block;
  color: var(--orders-color-text);
  font-size: var(--orders-font-small);
  font-weight: 600;
  line-height: var(--orders-line-title);
}

.marketplace-orders__card-action svg {
  width: var(--orders-icon-size);
  height: var(--orders-icon-size);
  color: var(--orders-color-accent);
}

.marketplace-orders__card-progress-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--orders-space-2);
  align-items: center;
}

.marketplace-orders__card-progress-head span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.marketplace-orders__card-progress-head strong {
  color: var(--orders-color-text);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-tight);
}

.marketplace-orders__card-side {
  display: grid;
  min-width: calc(var(--orders-unit) * 24);
  gap: var(--orders-space-1);
  justify-items: end;
}

.marketplace-orders__card-side > strong {
  color: var(--orders-color-text);
  font-size: var(--orders-font-section);
  font-weight: 600;
  line-height: var(--orders-line-tight);
}

.marketplace-orders__card-due {
  display: inline-flex;
  align-items: center;
  gap: var(--orders-space-1);
}

.marketplace-orders__card-due svg,
.marketplace-orders__card-side > svg {
  width: var(--orders-icon-size);
  height: var(--orders-icon-size);
}

.marketplace-orders__card-side > svg {
  margin-top: var(--orders-space-1);
  color: var(--orders-color-subtle);
}

.marketplace-orders__progress {
  display: block;
  height: calc(var(--orders-border) * 4);
  overflow: hidden;
  border-radius: var(--orders-radius-round);
  background-color: color-mix(in oklch, var(--orders-color-line) 72%, var(--orders-color-transparent));
}

.marketplace-orders__progress span {
  display: block;
  width: var(--marketplace-order-progress);
  height: 100%;
  border-radius: inherit;
  background: var(--gradient-action);
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

.marketplace-orders__detail-header,
.marketplace-orders__panel-header,
.marketplace-orders__next-action {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--orders-space-3);
  align-items: start;
}

.marketplace-orders__detail-heading {
  display: grid;
  gap: var(--orders-space-1);
}

.marketplace-orders__next-action {
  grid-template-columns: var(--orders-hit-size) minmax(0, 1fr) auto;
  padding: var(--orders-space-3);
  border: var(--orders-border) solid color-mix(in oklch, var(--orders-color-accent) 28%, var(--orders-color-line));
  border-radius: var(--orders-radius);
  background-color: color-mix(in oklch, var(--orders-color-accent) 7%, var(--orders-color-bg));
}

.marketplace-orders__next-action[data-urgent='true'] {
  border-color: color-mix(in oklch, var(--orders-color-warning) 72%, var(--orders-color-line));
  background-color: color-mix(in oklch, var(--orders-color-warning) 8%, var(--orders-color-bg));
}

.marketplace-orders__detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: var(--orders-space-4);
  align-items: start;
}

.marketplace-orders__panel {
  display: grid;
  gap: var(--orders-space-3);
  padding: var(--orders-space-3) 0 0;
  border-top: var(--orders-border) solid var(--orders-color-line);
}

.marketplace-orders__panel-header > span {
  max-width: calc(var(--orders-unit) * 36);
  color: var(--orders-color-muted);
  font-size: var(--orders-font-small);
  font-weight: 600;
  line-height: var(--orders-line-body);
  text-align: right;
}

.marketplace-orders__timeline li {
  position: relative;
  display: grid;
  grid-template-columns: var(--orders-hit-size) minmax(0, 1fr);
  gap: var(--orders-space-2);
}

.marketplace-orders__timeline li::before {
  position: absolute;
  top: var(--orders-hit-size);
  bottom: calc(var(--orders-space-2) * -1);
  left: calc(var(--orders-hit-size) / 2);
  width: var(--orders-border);
  background-color: var(--orders-color-line);
  content: "";
}

.marketplace-orders__timeline li:last-child::before {
  display: none;
}

.marketplace-orders__timeline-marker {
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--orders-hit-size);
  height: var(--orders-hit-size);
  border: var(--orders-border) solid var(--orders-color-line);
  border-radius: var(--orders-radius-round);
  background-color: var(--orders-color-bg);
  color: var(--orders-color-subtle);
}

.marketplace-orders__timeline-marker svg {
  width: calc(var(--orders-icon-size) * 0.8);
  height: calc(var(--orders-icon-size) * 0.8);
}

.marketplace-orders__timeline li[data-state='done'] .marketplace-orders__timeline-marker {
  border-color: color-mix(in oklch, var(--orders-color-success) 58%, var(--orders-color-line));
  color: var(--orders-color-success);
}

.marketplace-orders__timeline li[data-state='current'] .marketplace-orders__timeline-marker {
  border-color: color-mix(in oklch, var(--orders-color-accent) 68%, var(--orders-color-line));
  color: var(--orders-color-accent);
}

.marketplace-orders__timeline div {
  display: grid;
  gap: calc(var(--orders-unit) * 0.5);
  padding-bottom: var(--orders-space-2);
}

.marketplace-orders__timeline span {
  color: var(--orders-color-subtle);
  font-size: var(--orders-font-label);
  font-weight: 600;
  line-height: var(--orders-line-body);
}

.marketplace-orders__timeline h4 {
  color: var(--orders-color-text);
  font-size: var(--orders-font-small);
  font-weight: 600;
  line-height: var(--orders-line-title);
}

.marketplace-orders__facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--orders-space-2);
}

.marketplace-orders__facts div {
  display: grid;
  gap: calc(var(--orders-unit) * 0.5);
}

.marketplace-orders__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--orders-hit-size);
  height: var(--orders-hit-size);
  border: var(--orders-border) solid var(--orders-color-line);
  border-radius: var(--orders-radius-round);
  background-color: var(--orders-color-bg);
  color: var(--orders-color-text);
  font-size: var(--orders-font-small);
  font-weight: 600;
  line-height: var(--orders-line-tight);
}

.marketplace-orders__deliverables li,
.marketplace-orders__messages li {
  display: grid;
  grid-template-columns: var(--orders-hit-size) minmax(0, 1fr) auto;
  gap: var(--orders-space-2);
  align-items: center;
  min-height: calc(var(--orders-unit) * 8);
  padding: var(--orders-space-2) 0;
  border-bottom: var(--orders-border) solid var(--orders-color-line);
  background-color: var(--orders-color-transparent);
}

.marketplace-orders__deliverables svg {
  width: var(--orders-icon-size);
  height: var(--orders-icon-size);
  justify-self: center;
  color: var(--orders-color-subtle);
}

.marketplace-orders__deliverables li[data-status='ready'] svg {
  color: var(--orders-color-accent);
}

.marketplace-orders__deliverables li[data-status='approved'] svg {
  color: var(--orders-color-success);
}

.marketplace-orders__deliverables span,
.marketplace-orders__messages span:last-child {
  display: grid;
  gap: calc(var(--orders-unit) * 0.5);
}

.marketplace-orders__deliverables em {
  color: var(--orders-color-muted);
  font-size: var(--orders-font-label);
  font-style: normal;
  font-weight: 600;
  line-height: var(--orders-line-tight);
  white-space: nowrap;
}

.marketplace-orders__messages li {
  grid-template-columns: var(--orders-hit-size) minmax(0, 1fr);
}

.marketplace-orders__message-icon {
  width: calc(var(--orders-hit-size) * 0.82);
  height: calc(var(--orders-hit-size) * 0.82);
  min-width: calc(var(--orders-hit-size) * 0.82);
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

  .marketplace-orders__hero-inner,
  .marketplace-orders__next-action {
    padding: var(--orders-space-3);
  }

  .marketplace-orders__hero-inner,
  .marketplace-orders__toolbar,
  .marketplace-orders__card,
  .marketplace-orders__next-action,
  .marketplace-orders__detail-header,
  .marketplace-orders__panel-header,
  .marketplace-orders__deliverables li {
    grid-template-columns: 1fr;
  }

  .marketplace-orders__facts,
  .marketplace-orders__list--grid {
    grid-template-columns: 1fr;
  }

  .marketplace-orders__role-tabs {
    width: 100%;
  }

  .marketplace-orders__panel-header > span {
    max-width: none;
    text-align: left;
  }

  .marketplace-orders__card-side {
    min-width: 0;
    grid-template-columns: repeat(3, auto);
    align-items: center;
    justify-content: start;
    justify-items: start;
    gap: var(--orders-space-2);
  }

  .marketplace-orders__card-side > strong {
    font-size: var(--orders-font-small);
  }

  .marketplace-orders__deliverables em {
    justify-self: start;
  }
}
</style>
