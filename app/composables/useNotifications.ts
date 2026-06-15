import type { AppNotificationPresenter } from '~/plugins/notifications-api'

type NotificationsQuery = {
  filter?: 'ALL' | 'UNREAD'
  limit?: number
  offset?: number
}

type NotificationsCreatedPayload = {
  items?: AppNotificationPresenter[]
}

type NotificationsIdsPayload = {
  notificationIds?: string[]
  all?: boolean
}

type NotificationsUnreadCountPayload = {
  unreadCount?: number
}

let notificationsSource: EventSource | null = null
let notificationsSourceToken = ''
let notificationsTokenWatcherReady = false

const NOTIFICATIONS_DEFAULT_QUERY: NotificationsQuery = { filter: 'UNREAD', limit: 12 }

const normalizeAuthToken = (token: unknown) => String(token ?? '').replace(/^bearer\s+/i, '').trim()

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const parseStreamPayload = <TPayload>(event: MessageEvent): TPayload | null => {
  try {
    const parsed = JSON.parse(String(event.data || '{}'))
    return isRecord(parsed) ? parsed as TPayload : null
  } catch {
    return null
  }
}

const buildStreamUrl = (apiBaseUrl: string, token: string) => {
  const baseUrl = apiBaseUrl.replace(/\/+$/, '')
  return `${baseUrl}/notifications/stream?token=${encodeURIComponent(token)}`
}

export const useNotifications = () => {
  const { $notificationsAPI } = useNuxtApp()
  const auth = useAuth()
  const runtimeConfig = useRuntimeConfig()
  const notifications = useState<AppNotificationPresenter[]>('notifications:items', () => [])
  const unreadNotificationsCount = useState<number>('notifications:unread-count', () => 0)
  const isNotificationsLoading = useState<boolean>('notifications:loading', () => false)

  const loadNotifications = async (query: NotificationsQuery = NOTIFICATIONS_DEFAULT_QUERY) => {
    const token = normalizeAuthToken(auth.token.value)
    if (!token) {
      notifications.value = []
      unreadNotificationsCount.value = 0
      return
    }

    isNotificationsLoading.value = true
    try {
      const response = await $notificationsAPI.list(query)
      notifications.value = response.items
      unreadNotificationsCount.value = response.unreadCount
    } catch {
      return
    } finally {
      isNotificationsLoading.value = false
    }
  }

  const closeNotificationsStream = () => {
    notificationsSource?.close()
    notificationsSource = null
    notificationsSourceToken = ''
  }

  const prependNotifications = (items: AppNotificationPresenter[]) => {
    if (!items.length) return

    const incomingIds = new Set(items.map(notification => notification.id))
    notifications.value = [
      ...items,
      ...notifications.value.filter(notification => !incomingIds.has(notification.id))
    ].slice(0, NOTIFICATIONS_DEFAULT_QUERY.limit)
  }

  const removeNotifications = (payload: NotificationsIdsPayload | null) => {
    if (!payload) {
      void loadNotifications()
      return
    }

    if (payload.all) {
      notifications.value = []
      return
    }

    const notificationIds = Array.isArray(payload.notificationIds) ? payload.notificationIds : []
    if (!notificationIds.length) {
      void loadNotifications()
      return
    }

    const ids = new Set(notificationIds)
    notifications.value = notifications.value.filter(notification => !ids.has(notification.id))
  }

  const connectNotificationsStream = () => {
    if (!import.meta.client) return

    const token = normalizeAuthToken(auth.token.value)
    if (!token) {
      closeNotificationsStream()
      return
    }

    if (notificationsSource && notificationsSourceToken === token) return

    closeNotificationsStream()
    notificationsSourceToken = token
    notificationsSource = new EventSource(buildStreamUrl(runtimeConfig.public.apiBaseUrl, token))

    notificationsSource.addEventListener('notifications.created', (event) => {
      const payload = parseStreamPayload<NotificationsCreatedPayload>(event as MessageEvent)
      const items = Array.isArray(payload?.items) ? payload.items : []
      if (!items.length) {
        void loadNotifications()
        return
      }

      prependNotifications(items)
    })

    notificationsSource.addEventListener('notifications.read', (event) => {
      removeNotifications(parseStreamPayload<NotificationsIdsPayload>(event as MessageEvent))
    })

    notificationsSource.addEventListener('notifications.deleted', (event) => {
      removeNotifications(parseStreamPayload<NotificationsIdsPayload>(event as MessageEvent))
    })

    notificationsSource.addEventListener('notifications.unread-count.updated', (event) => {
      const payload = parseStreamPayload<NotificationsUnreadCountPayload>(event as MessageEvent)
      const unreadCount = Number(payload?.unreadCount)
      unreadNotificationsCount.value = Number.isFinite(unreadCount) ? unreadCount : unreadNotificationsCount.value
    })
  }

  const markNotificationRead = async (notificationId: string) => {
    await $notificationsAPI.markRead(notificationId)
    await loadNotifications()
  }

  const deleteNotification = async (notificationId: string) => {
    await $notificationsAPI.delete(notificationId)
    await loadNotifications()
  }

  const executeNotificationAction = async (notificationId: string, actionKey: string) => {
    await $notificationsAPI.executeAction(notificationId, actionKey)
    await loadNotifications()
  }

  if (import.meta.client && !notificationsTokenWatcherReady) {
    notificationsTokenWatcherReady = true
    watch(() => normalizeAuthToken(auth.token.value), (token) => {
      if (!token) {
        closeNotificationsStream()
        notifications.value = []
        unreadNotificationsCount.value = 0
        return
      }

      connectNotificationsStream()
      void loadNotifications()
    })
  }

  return {
    notifications,
    unreadNotificationsCount,
    isNotificationsLoading,
    loadNotifications,
    connectNotificationsStream,
    closeNotificationsStream,
    markNotificationRead,
    deleteNotification,
    executeNotificationAction
  }
}
