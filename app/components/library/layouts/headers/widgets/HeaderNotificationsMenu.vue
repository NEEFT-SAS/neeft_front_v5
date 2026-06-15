<template>
  <div class="header-user-menu-shell">
    <button
      :id="triggerId"
      ref="triggerElement"
      class="header-user-actions__icon-button"
      type="button"
      aria-label="Ouvrir les notifications"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="emit('toggle')"
    >
      <Icon name="lucide:bell" aria-hidden="true" />
      <span v-if="unreadNotificationsCount" class="header-user-menu__badge">
        {{ unreadNotificationsCount }}
      </span>
    </button>
    <HeaderPopup
      :id="panelId"
      class="header-user-menu-popup"
      :open="open"
      :theme="theme"
      align="end"
      :labelledby-id="triggerId"
    >
      <div class="header-user-menu header-user-menu--wide" role="none">
        <template v-if="notifications.length">
          <article
            v-for="notification in notifications"
            :key="notification.id"
            class="header-user-menu__notification"
            role="none"
          >
            <span class="header-user-menu__notification-icon" aria-hidden="true">
              <MarketplaceSafeImage
                v-if="notification.isMarketplace"
                class="header-user-menu__notification-logo"
                empty-class="header-user-menu__notification-logo--empty"
                :src="config.marketplace.service.getServiceBannerUrl(notification.serviceImageUrl)"
                alt=""
                width="44"
                height="44"
                loading="lazy"
                decoding="async"
              >
                <Icon :name="notification.icon" />
              </MarketplaceSafeImage>
              <Icon v-else :name="notification.icon" />
            </span>
            <div class="header-user-menu__notification-copy">
              <div class="header-user-menu__notification-meta">
                <span>{{ notification.category }}</span>
                <time :datetime="notification.createdAt" :title="notification.createdAtExact">{{ notification.createdAtLabel }}</time>
              </div>
              <strong>{{ notification.title }}</strong>
              <p v-if="notification.description">{{ notification.description }}</p>
            </div>
            <div class="header-user-menu__notification-actions">
              <template v-if="notification.kind === 'sale'">
                <NuxtLink
                  class="header-user-menu__action"
                  :to="notification.orderTo || '/marketplace/sales'"
                  role="menuitem"
                  @click="openNotification(notification)"
                >
                  Voir la commande
                </NuxtLink>
                <button
                  class="header-user-menu__dismiss"
                  type="button"
                  role="menuitem"
                  :aria-label="getNotificationDismissLabel(notification)"
                  @click.stop="dismissNotification(notification.id)"
                >
                  <Icon name="lucide:x" aria-hidden="true" />
                </button>
              </template>
              <template v-else>
                <button
                  class="header-user-menu__action"
                  type="button"
                  role="menuitem"
                  @click="resolveNotification(notification.id, notification.acceptActionKey)"
                >
                  {{ notification.acceptActionLabel }}
                </button>
                <button
                  class="header-user-menu__action header-user-menu__action--muted"
                  type="button"
                  role="menuitem"
                  @click="resolveNotification(notification.id, notification.rejectActionKey)"
                >
                  {{ notification.rejectActionLabel }}
                </button>
              </template>
            </div>
          </article>
        </template>
        <div v-else class="header-user-menu__empty">
          <Icon name="lucide:bell-off" aria-hidden="true" />
          <span>Aucune nouvelle notification</span>
        </div>
      </div>
    </HeaderPopup>
  </div>
</template>

<script setup lang="ts">
import type { AppNotificationPresenter } from '~/plugins/notifications-api'

type HeaderMenuTheme = 'landing' | 'app'
type HeaderNotification = {
  id: string
  kind: 'decision' | 'sale'
  category: string
  icon: string
  isMarketplace: boolean
  serviceImageUrl?: string
  title: string
  description: string
  createdAt: string
  createdAtLabel: string
  createdAtExact: string
  orderTo?: string
  acceptActionKey?: string
  rejectActionKey?: string
  acceptActionLabel: string
  rejectActionLabel: string
}

const props = withDefaults(defineProps<{
  open: boolean
  theme?: HeaderMenuTheme
  triggerId: string
  panelId: string
}>(), { theme: 'app' })

const emit = defineEmits<{
  toggle: []
  close: []
}>()

const config = useConfig()
const triggerElement = ref<HTMLButtonElement | null>(null)

const {
  notifications: notificationItems,
  unreadNotificationsCount,
  loadNotifications,
  connectNotificationsStream,
  markNotificationRead,
  executeNotificationAction
} = useNotifications()

const notificationContexts: Record<string, { category: string; icon: string }> = {
  MARKETPLACE_ORDER_CREATED: { category: 'Marketplace', icon: 'lucide:shopping-bag' },
  MARKETPLACE_ORDER_STATUS_UPDATED: { category: 'Marketplace', icon: 'lucide:package-check' },
  MARKETPLACE_ORDER_DISPUTE_OPENED: { category: 'Marketplace', icon: 'lucide:flag' },
  MARKETPLACE_ORDER_REFUND_PROPOSED: { category: 'Marketplace', icon: 'lucide:rotate-ccw' },
  MARKETPLACE_ORDER_REFUND_RESPONDED: { category: 'Marketplace', icon: 'lucide:rotate-ccw' },
  MARKETPLACE_ORDER_DEADLINE_REMINDER: { category: 'Marketplace', icon: 'lucide:clock-3' },
  MARKETPLACE_SERVICE_REVIEW_CREATED: { category: 'Marketplace', icon: 'lucide:star' },
}

const notificationDateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})
const notificationRelativeTimeFormatter = new Intl.RelativeTimeFormat('fr-FR', { numeric: 'auto' })

const getPayload = (notification: AppNotificationPresenter) => notification.payload || {}

const getPayloadString = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key]
  return typeof value === 'string' ? value : ''
}

const getActions = (payload: Record<string, unknown>) => {
  const actions = Array.isArray(payload.actions) ? payload.actions : []
  return actions
    .filter((action): action is Record<string, unknown> => Boolean(action) && typeof action === 'object')
    .map(action => ({
      key: String(action.key || '').toLowerCase(),
      label: String(action.label || ''),
    }))
    .filter(action => Boolean(action.key))
}

const formatNotificationDateTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return notificationDateTimeFormatter.format(date)
}

const formatNotificationRelativeTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const elapsedSeconds = Math.round((date.getTime() - Date.now()) / 1000)
  const intervals = [
    { limit: 60, divisor: 1, unit: 'second' },
    { limit: 3600, divisor: 60, unit: 'minute' },
    { limit: 86400, divisor: 3600, unit: 'hour' },
    { limit: 604800, divisor: 86400, unit: 'day' },
  ] as const
  const absoluteSeconds = Math.abs(elapsedSeconds)
  const interval = intervals.find(item => absoluteSeconds < item.limit)
  if (!interval) return formatNotificationDateTime(value)

  return notificationRelativeTimeFormatter.format(Math.round(elapsedSeconds / interval.divisor), interval.unit)
}

const getNotificationContext = (intent: string) => {
  if (notificationContexts[intent]) return notificationContexts[intent]
  if (intent.includes('TEAM') || intent.includes('INVITATION')) return { category: 'Equipe', icon: 'lucide:users' }
  if (intent.includes('MESSAGE') || intent.includes('CONVERSATION')) return { category: 'Messagerie', icon: 'lucide:message-circle' }
  if (intent.includes('RECRUIT')) return { category: 'Recrutement', icon: 'lucide:briefcase-business' }

  return { category: 'Neeft', icon: 'lucide:bell' }
}

const removeDuplicateDescription = (title: string, description: string) => {
  const normalize = (value: string) => value.trim().replace(/[.!?]+$/, '').toLocaleLowerCase('fr-FR')
  return normalize(title) === normalize(description) ? '' : description
}

const toHeaderNotification = (notification: AppNotificationPresenter): HeaderNotification => {
  const payload = getPayload(notification)
  const intent = getPayloadString(payload, 'intent') || notification.type
  const actions = getActions(payload)
  const acceptAction = actions.find(action => action.key === 'accept') || actions[0]
  const rejectAction = actions.find(action => action.key === 'reject' || action.key === 'decline') || actions[1]
  const context = getNotificationContext(intent)
  const title = notification.title || 'Notification'

  return {
    id: notification.id,
    kind: acceptAction?.key && rejectAction?.key ? 'decision' : 'sale',
    category: context.category,
    icon: context.icon,
    isMarketplace: intent.startsWith('MARKETPLACE_'),
    serviceImageUrl: getPayloadString(payload, 'serviceBannerUrl') || undefined,
    title,
    description: removeDuplicateDescription(title, notification.body || ''),
    createdAt: notification.createdAt,
    createdAtLabel: formatNotificationRelativeTime(notification.createdAt),
    createdAtExact: formatNotificationDateTime(notification.createdAt),
    orderTo: getPayloadString(payload, 'targetPath') || undefined,
    acceptActionKey: acceptAction?.key,
    rejectActionKey: rejectAction?.key,
    acceptActionLabel: acceptAction?.label || 'Accepter',
    rejectActionLabel: rejectAction?.label || 'Refuser',
  }
}

const notifications = computed(() => notificationItems.value.map(toHeaderNotification))

const resolveNotification = async (notificationId: string, actionKey?: string) => {
  try {
    if (actionKey) {
      await executeNotificationAction(notificationId, actionKey)
    } else {
      await markNotificationRead(notificationId)
    }
  } catch {
    return
  }
}

const openNotification = async (notification: HeaderNotification) => {
  emit('close')
  await resolveNotification(notification.id)
}

const dismissNotification = async (notificationId: string) => {
  triggerElement.value?.focus({ preventScroll: true })
  await resolveNotification(notificationId)
}
const getNotificationDismissLabel = (notification: HeaderNotification) => `Ignorer ${notification.title}`

watch(() => props.open, (isOpen) => {
  if (isOpen) void loadNotifications()
})

onMounted(() => {
  connectNotificationsStream()
  void loadNotifications()
})
</script>
