import type {
  MessagingConversationsPresenter,
  MessagingMarkConversationReadPresenter,
  MessagingMessagesPresenter,
  MessagingMessagePresenter,
  MessagingStartConversationPresenter
} from '@neeft-sas/shared'
import { createAuthenticatedApi } from '~/utils/createAuthenticatedApi'

export type MessagingApi = {
  listConversations: (query?: { scope?: 'SELF' | 'TEAM'; teamId?: string; limit?: number; offset?: number }) => Promise<MessagingConversationsPresenter>
  getMessages: (conversationId: string, query?: { limit?: number; beforeMessageId?: string }) => Promise<MessagingMessagesPresenter>
  startConversation: (input: { targetType: 'PLAYER' | 'TEAM'; targetId?: string; targetSlug?: string; content: string }) => Promise<MessagingStartConversationPresenter>
  sendMessage: (conversationId: string, content: string) => Promise<MessagingMessagePresenter>
  markRead: (conversationId: string, upToMessageId?: string) => Promise<MessagingMarkConversationReadPresenter>
}

const getQuery = <TQuery extends Record<string, unknown>>(query: TQuery = {} as TQuery) => {
  return Object.fromEntries(Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== ''))
}

export default defineNuxtPlugin(() => {
  const auth = useAuth()
  const api = createAuthenticatedApi(useRuntimeConfig().public.apiBaseUrl, auth.token)

  const messagingAPI: MessagingApi = {
    listConversations: query => api('/messaging/conversations', { method: 'GET', query: getQuery(query), cache: 'no-store' }),
    getMessages: (conversationId, query = {}) => api(`/messaging/conversations/${encodeURIComponent(conversationId)}/messages`, { method: 'GET', query: getQuery(query), cache: 'no-store' }),
    startConversation: input => api('/messaging/conversations', { method: 'POST', body: input, cache: 'no-store' }),
    sendMessage: (conversationId, content) => api(`/messaging/conversations/${encodeURIComponent(conversationId)}/messages`, { method: 'POST', body: { content }, cache: 'no-store' }),
    markRead: (conversationId, upToMessageId) => api(`/messaging/conversations/${encodeURIComponent(conversationId)}/read`, { method: 'POST', body: { upToMessageId }, cache: 'no-store' })
  }

  return { provide: { messagingAPI } }
})

declare module '#app' {
  interface NuxtApp {
    $messagingAPI: MessagingApi
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $messagingAPI: MessagingApi
  }
}
