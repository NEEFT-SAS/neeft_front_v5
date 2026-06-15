<template>
  <div class="header-user-menu-shell">
    <button
      :id="triggerId"
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
            <div class="header-user-menu__notification-copy">
              <div class="header-user-menu__notification-meta">
                <span>{{ notification.label }}</span>
                <time :datetime="notification.createdAt">{{ notification.createdAtLabel }}</time>
              </div>
              <strong>{{ notification.title }}</strong>
              <small>{{ notification.description }}</small>
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
                  @click="dismissNotification(notification.id)"
                >
                  x
                </button>
              </template>
              <template v-else>
                <button
                  class="header-user-menu__action"
                  type="button"
                  role="menuitem"
                  @click="resolveNotification(notification.id, notification.acceptActionKey)"
                >
                  Accepter
                </button>
                <button
                  class="header-user-menu__action header-user-menu__action--muted"
                  type="button"
                  role="menuitem"
                  @click="resolveNotification(notification.id, notification.rejectActionKey)"
                >
                  Refuser
                </button>
              </template>
            </div>
          </article>
        </template>
        <p v-else class="header-user-menu__empty">Aucune notification</p>
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
  label: string
  title: string
  description: string
  createdAt: string
  createdAtLabel: string
  orderTo?: string
  acceptActionKey?: string
  rejectActionKey?: string
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

const {
  notifications: notificationItems,
  unreadNotificationsCount,
  loadNotifications,
  connectNotificationsStream,
  markNotificationRead,
  executeNotificationAction
} = useNotifications()

const marketplaceLabels: Record<string, string> = {
  MARKETPLACE_ORDER_CREATED: 'Nouvelle vente',
  MARKETPLACE_ORDER_STATUS_UPDATED: 'Commande mise a jour',
  MARKETPLACE_ORDER_DISPUTE_OPENED: 'Litige',
  MARKETPLACE_ORDER_REFUND_PROPOSED: 'Remboursement',
}

const notificationDateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const getPayload = (notification: AppNotificationPresenter) => notification.payload || {}

const getPayloadString = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key]
  return typeof value === 'string' ? value : ''
}

const getActions = (payload: Record<string, unknown>) => {
  const actions = Array.isArray(payload.actions) ? payload.actions : []
  return actions
    .filter((action): action is Record<string, unknown> => Boolean(action) && typeof action === 'object')
    .map(action => String(action.key || '').toLowerCase())
    .filter(Boolean)
}

const formatNotificationDateTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return notificationDateTimeFormatter.format(date)
}

const toHeaderNotification = (notification: AppNotificationPresenter): HeaderNotification => {
  const payload = getPayload(notification)
  const intent = getPayloadString(payload, 'intent') || notification.type
  const actions = getActions(payload)
  const acceptActionKey = actions.find(action => action === 'accept') || actions[0]
  const rejectActionKey = actions.find(action => action === 'reject' || action === 'decline') || actions[1]

  return {
    id: notification.id,
    kind: acceptActionKey && rejectActionKey ? 'decision' : 'sale',
    label: marketplaceLabels[intent] || notification.title || 'Notification',
    title: notification.title || 'Notification',
    description: notification.body || '',
    createdAt: notification.createdAt,
    createdAtLabel: formatNotificationDateTime(notification.createdAt),
    orderTo: getPayloadString(payload, 'targetPath') || undefined,
    acceptActionKey,
    rejectActionKey,
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

const dismissNotification = resolveNotification
const getNotificationDismissLabel = (notification: HeaderNotification) => `Ignorer ${notification.title}`

watch(() => props.open, (isOpen) => {
  if (isOpen) void loadNotifications()
})

onMounted(() => {
  connectNotificationsStream()
  void loadNotifications()
})
</script>
