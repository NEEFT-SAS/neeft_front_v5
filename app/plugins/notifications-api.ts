import { createAuthenticatedApi } from '~/utils/createAuthenticatedApi'

export type AppNotificationPresenter = {
  id: string
  type: string
  title: string | null
  body: string | null
  payload: Record<string, unknown> | null
  contextConversationId: string | null
  contextMessageId: string | null
  readAt: string | null
  createdAt: string
  actor: {
    id: string
    username: string
    slug: string
    profilePicture: string | null
  } | null
}

export type AppNotificationsListResponse = {
  items: AppNotificationPresenter[]
  total: number
  unreadCount: number
  limit: number
  offset: number
}

export type AppNotificationsApi = {
  list: (query?: { filter?: 'ALL' | 'UNREAD'; limit?: number; offset?: number }) => Promise<AppNotificationsListResponse>
  markRead: (notificationId: string) => Promise<{ notificationId: string; marked: boolean; unreadCount: number }>
  delete: (notificationId: string) => Promise<{ notificationId: string; deleted: boolean; unreadCount: number }>
  executeAction: (notificationId: string, actionKey: string) => Promise<{ notificationId: string; executed: boolean; unreadCount: number }>
}

const getQuery = <TQuery extends Record<string, unknown>>(query: TQuery = {} as TQuery) => {
  return Object.fromEntries(Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== ''))
}

export default defineNuxtPlugin(() => {
  const auth = useAuth()
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
  const api = createAuthenticatedApi(apiBaseUrl, auth.token, { unwrapData: true })

  const notificationsAPI: AppNotificationsApi = {
    list: async (query = {}) => {
      return await api<AppNotificationsListResponse>('/notifications', { method: 'GET', query: getQuery(query), cache: 'no-store' })
    },
    markRead: async (notificationId: string) => {
      return await api<{ notificationId: string; marked: boolean; unreadCount: number }>(`/notifications/${encodeURIComponent(notificationId)}/read`, { method: 'POST', cache: 'no-store' })
    },
    delete: async (notificationId: string) => {
      return await api<{ notificationId: string; deleted: boolean; unreadCount: number }>(`/notifications/${encodeURIComponent(notificationId)}/delete`, { method: 'POST', cache: 'no-store' })
    },
    executeAction: async (notificationId: string, actionKey: string) => {
      return await api<{ notificationId: string; executed: boolean; unreadCount: number }>(`/notifications/${encodeURIComponent(notificationId)}/actions/${encodeURIComponent(actionKey)}`, { method: 'POST', cache: 'no-store' })
    },
  }

  return { provide: { notificationsAPI } }
})

declare module '#app' {
  interface NuxtApp {
    $notificationsAPI: AppNotificationsApi
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $notificationsAPI: AppNotificationsApi
  }
}
