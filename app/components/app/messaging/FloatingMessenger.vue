<template>
  <aside
    class="floating-messenger"
    data-theme="app"
    :data-open="isOpen ? 'true' : 'false'"
  >
    <div
      v-if="!isOpen"
      class="floating-messenger__collapsed"
    >
      <CustomButton
        class="floating-messenger__collapsed-action"
        label="Messagerie"
        left-icon="lucide:message-circle"
        right-icon="lucide:chevron-up"
        theme="app"
        variant="outlined"
        color="secondary"
        size="sm"
        shape="rectangular"
        :aria-label="launcherLabel"
        :aria-expanded="isOpen"
        :aria-controls="panelId"
        @click="openMessenger"
      />
      <span v-if="unreadTotal" class="floating-messenger__badge floating-messenger__badge--floating" aria-hidden="true">
        {{ compactUnreadTotal }}
      </span>
    </div>

    <div
      v-else
      :id="panelId"
      ref="panelElement"
      class="floating-messenger__dock"
      role="region"
      :aria-labelledby="titleId"
      tabindex="-1"
      @keydown.escape.stop="closeMessenger"
    >
      <template v-if="sessionStore.isLoggedIn">
        <div
          v-if="openConversationViews.length"
          class="floating-messenger__mini-chats"
          aria-label="Conversations ouvertes"
        >
          <section
            v-for="conversation in openConversationViews"
            :key="conversation.id"
            class="floating-messenger__mini-chat"
            :data-active="activeConversationId === conversation.id ? 'true' : 'false'"
            :aria-labelledby="getThreadTitleId(conversation.id)"
            @focusin="activateConversation(conversation.id)"
          >
            <header class="floating-messenger__thread-header">
              <span class="floating-messenger__avatar" aria-hidden="true">
                <img v-if="conversation.avatarUrl" :src="conversation.avatarUrl" alt="" decoding="async" loading="lazy">
                <span v-else>{{ conversation.initials }}</span>
              </span>
              <div>
                <h3 :id="getThreadTitleId(conversation.id)">{{ conversation.name }}</h3>
                <p>{{ conversation.kindLabel }} - {{ selectedIdentityLabel }}</p>
              </div>
              <div class="floating-messenger__thread-actions" aria-label="Actions conversation">
                <CustomLink
                  class="floating-messenger__thread-expand"
                  :to="{ path: '/messages', query: { conversation: conversation.id } }"
                  left-icon="lucide:expand"
                  theme="app"
                  variant="ghost"
                  color="secondary"
                  size="sm"
                  shape="circle"
                  aria-label="Ouvrir la conversation complete"
                  title="Ouvrir la conversation complete"
                />
                <CustomButton
                  left-icon="lucide:x"
                  theme="app"
                  variant="ghost"
                  color="secondary"
                  size="sm"
                  shape="circle"
                  aria-label="Fermer la conversation"
                  title="Fermer la conversation"
                  @click="closeConversation(conversation.id)"
                />
              </div>
            </header>

            <div
              v-if="isConversationLoading(conversation.id) && !getConversationMessages(conversation.id).length"
              class="floating-messenger__state floating-messenger__state--thread"
              role="status"
            >
              <Icon class="floating-messenger__loader" name="lucide:loader-circle" aria-hidden="true" />
              <span>Chargement</span>
            </div>

            <div
              v-else-if="getConversationError(conversation.id) && !getConversationMessages(conversation.id).length"
              class="floating-messenger__state floating-messenger__state--thread"
              role="alert"
            >
              <Icon name="lucide:circle-alert" aria-hidden="true" />
              <span>{{ getConversationError(conversation.id) }}</span>
            </div>

            <ol
              v-else-if="getConversationMessages(conversation.id).length"
              :ref="element => setMessageElement(conversation.id, element)"
              class="floating-messenger__messages"
            >
              <li
                v-for="message in getConversationMessages(conversation.id)"
                :key="message.id"
                :class="{ 'is-mine': message.isOwn, 'is-system': message.senderType === 'SYSTEM' }"
              >
                <div class="floating-messenger__bubble">
                  <p>{{ message.content }}</p>
                  <time :datetime="message.createdAt">{{ formatMessageTime(message.createdAt) }}</time>
                </div>
              </li>
            </ol>

            <div v-else class="floating-messenger__state floating-messenger__state--thread">
              <Icon name="lucide:send" aria-hidden="true" />
              <span>Aucun message</span>
            </div>

            <form class="floating-messenger__composer" aria-label="Composer un message" @submit.prevent="sendMessage(conversation.id)">
              <CustomInputTextarea
                class="floating-messenger__composer-input"
                :model-value="getConversationDraft(conversation.id)"
                label="Message"
                label-position="inside"
                placeholder="Ecris un message..."
                :rows="2"
                :max-length="1200"
                resize="none"
                size="sm"
                :disabled="isConversationSending(conversation.id)"
                @update:model-value="value => setConversationDraft(conversation.id, String(value))"
              />
              <CustomButton
                class="floating-messenger__composer-submit"
                type="submit"
                left-icon="lucide:send-horizontal"
                theme="app"
                variant="filled"
                color="primary"
                size="sm"
                shape="circle"
                :disabled="!canSendConversationMessage(conversation.id)"
                aria-label="Envoyer le message"
                title="Envoyer le message"
              />
            </form>
          </section>
        </div>
      </template>

      <section class="floating-messenger__panel floating-messenger__list-panel" :aria-labelledby="titleId">
        <header class="floating-messenger__header">
          <div class="floating-messenger__header-title">
            <span class="floating-messenger__avatar" aria-hidden="true">
              <img v-if="selectedIdentity.avatarUrl" :src="selectedIdentity.avatarUrl" alt="" decoding="async" loading="lazy">
              <span v-else>{{ selectedIdentity.initials }}</span>
            </span>
            <div>
              <h2 :id="titleId">Messages</h2>
              <p>{{ selectedIdentity.label }}</p>
            </div>
          </div>
          <div class="floating-messenger__header-actions" aria-label="Actions messagerie">
            <CustomLink to="/messages" left-icon="lucide:edit-3" theme="app" variant="ghost" color="secondary" size="sm" shape="circle" aria-label="Ouvrir la messagerie complete" title="Ouvrir la messagerie complete" />
            <CustomButton left-icon="lucide:minus" theme="app" variant="ghost" color="secondary" size="sm" shape="circle" aria-label="Reduire la messagerie" title="Reduire la messagerie" @click="closeMessenger" />
          </div>
        </header>

        <div v-if="!sessionStore.isLoggedIn" class="floating-messenger__signed-out">
          <Icon name="lucide:message-circle" aria-hidden="true" />
          <div>
            <strong>Connecte-toi pour ouvrir tes conversations.</strong>
            <p>La messagerie charge les conversations et les equipes depuis ton compte.</p>
          </div>
          <CustomLink to="/login" label="Se connecter" left-icon="lucide:log-in" theme="app" variant="filled" color="primary" size="sm" shape="circle" />
        </div>

        <template v-else>
          <div class="floating-messenger__identity-bar" aria-label="Profil de reponse">
            <button
              v-for="identity in identities"
              :key="identity.key"
              class="floating-messenger__identity"
              type="button"
              :data-selected="identity.key === selectedIdentityKey ? 'true' : 'false'"
              :aria-pressed="identity.key === selectedIdentityKey"
              :aria-label="`Repondre avec ${identity.label}`"
              :title="identity.label"
              @click="selectIdentity(identity.key)"
            >
              <span class="floating-messenger__avatar" aria-hidden="true">
                <img v-if="identity.avatarUrl" :src="identity.avatarUrl" alt="" decoding="async" loading="lazy">
                <span v-else>{{ identity.initials }}</span>
              </span>
              <span v-if="getIdentityUnread(identity.key)" class="floating-messenger__identity-badge" aria-hidden="true">
                {{ formatBadgeCount(getIdentityUnread(identity.key)) }}
              </span>
            </button>
          </div>

          <section class="floating-messenger__inbox" aria-label="Conversations">
            <CustomInputText
              v-model="searchQuery"
              class="floating-messenger__search"
              label="Rechercher"
              label-position="inside"
              left-icon="lucide:search"
              size="sm"
            />

            <div v-if="isLoadingConversations" class="floating-messenger__state" role="status">
              <Icon class="floating-messenger__loader" name="lucide:loader-circle" aria-hidden="true" />
              <span>Chargement</span>
            </div>

            <div v-else-if="loadError" class="floating-messenger__state" role="alert">
              <Icon name="lucide:circle-alert" aria-hidden="true" />
              <span>{{ loadError }}</span>
            </div>

            <ul v-else-if="filteredConversations.length" class="floating-messenger__conversation-list">
              <li v-for="conversation in filteredConversations" :key="conversation.id">
                <button
                  class="floating-messenger__conversation"
                  type="button"
                  :data-selected="selectedConversationId === conversation.id ? 'true' : 'false'"
                  @click="selectConversation(conversation.id)"
                >
                  <span class="floating-messenger__avatar" aria-hidden="true">
                    <img v-if="conversation.avatarUrl" :src="conversation.avatarUrl" alt="" decoding="async" loading="lazy">
                    <span v-else>{{ conversation.initials }}</span>
                  </span>
                  <span class="floating-messenger__conversation-copy">
                    <span class="floating-messenger__conversation-line">
                      <strong>{{ conversation.name }}</strong>
                      <time v-if="conversation.timeLabel" :datetime="conversation.timeIso">{{ conversation.timeLabel }}</time>
                    </span>
                    <small>{{ conversation.kindLabel }}</small>
                    <span>{{ conversation.preview }}</span>
                  </span>
                  <span v-if="conversation.unread" class="floating-messenger__conversation-badge" aria-label="Messages non lus">
                    {{ formatBadgeCount(conversation.unread) }}
                  </span>
                </button>
              </li>
            </ul>

            <div v-else class="floating-messenger__state">
              <Icon name="lucide:message-circle-off" aria-hidden="true" />
              <span>Aucune conversation</span>
            </div>
          </section>
        </template>
      </section>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { MessagingConversationSummaryPresenter, MessagingMessagePresenter, MessagingScope } from '@neeft-sas/shared'
import type { ComponentPublicInstance } from 'vue'

type ReplyIdentity = {
  key: string
  scope: MessagingScope
  teamId?: string
  label: string
  sublabel: string
  initials: string
  avatarUrl: string
}

type ConversationView = {
  id: string
  name: string
  initials: string
  avatarUrl: string
  kindLabel: string
  preview: string
  unread: number
  timeIso: string
  timeLabel: string
}

const MAX_OPEN_CHATS = 2

const config = useConfig()
const sessionStore = useSessionStore()
const { $messagingAPI } = useNuxtApp()
const generatedId = useId()
const panelId = `floating-messenger-panel-${generatedId}`
const titleId = `floating-messenger-title-${generatedId}`
const panelElement = ref<HTMLElement | null>(null)
const messageElements = new Map<string, HTMLOListElement>()
const isOpen = ref(false)
const isLoadingConversations = ref(false)
const hasLoadedConversations = ref(false)
const loadError = ref('')
const searchQuery = ref('')
const selectedIdentityKey = ref('self')
const selectedConversationId = ref('')
const activeConversationId = ref('')
const openConversationIds = ref<string[]>([])
const messageRowsByConversation = ref<Record<string, MessagingMessagePresenter[]>>({})
const messageDrafts = ref<Record<string, string>>({})
const loadingMessages = ref<Record<string, boolean>>({})
const sendingMessages = ref<Record<string, boolean>>({})
const messageErrors = ref<Record<string, string>>({})
const conversationCache = ref<Record<string, MessagingConversationSummaryPresenter[]>>({})

const omitKey = <TValue>(record: Record<string, TValue>, key: string) => Object.fromEntries(
  Object.entries(record).filter(([recordKey]) => recordKey !== key)
) as Record<string, TValue>

const formatBadgeCount = (count: number) => count > 99 ? '99+' : String(count)
const createInitials = (value: string) => value
  .replace(/[_-]+/g, ' ')
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map(part => Array.from(part)[0] || '')
  .join('')
  .toLocaleUpperCase('fr-FR')
  .slice(0, 2) || '?'

const selfIdentity = computed<ReplyIdentity>(() => {
  const label = sessionStore.myUsername || 'Mon profil'

  return {
    key: 'self',
    scope: 'SELF',
    label,
    sublabel: 'Profil personnel',
    initials: createInitials(label),
    avatarUrl: config.profile.getUserAvatarUrl(sessionStore.myAvatar)
  }
})

const identities = computed<ReplyIdentity[]>(() => [
  selfIdentity.value,
  ...sessionStore.myTeams.map(team => {
    const label = team.name || team.acronym || team.slug

    return {
      key: `team:${team.teamId}`,
      scope: 'TEAM' as const,
      teamId: team.teamId,
      label,
      sublabel: team.title || team.role || 'Equipe',
      initials: createInitials(team.acronym || label),
      avatarUrl: config.profile.getTeamAvatarUrl(team.logoUrl)
    }
  })
])

const selectedIdentity = computed(() => identities.value.find(identity => identity.key === selectedIdentityKey.value) || identities.value[0] || selfIdentity.value)
const selectedIdentityLabel = computed(() => `Reponse avec ${selectedIdentity.value.label}`)
const selectedIdentityConversations = computed(() => conversationCache.value[selectedIdentity.value.key] || [])
const unreadTotal = computed(() => Object.values(conversationCache.value).flat().reduce((total, conversation) => total + conversation.unreadCount, 0))
const compactUnreadTotal = computed(() => formatBadgeCount(unreadTotal.value))
const launcherLabel = computed(() => unreadTotal.value ? `Ouvrir la messagerie, ${unreadTotal.value} messages non lus` : 'Ouvrir la messagerie')
const conversations = computed<ConversationView[]>(() => selectedIdentityConversations.value.map(toConversationView))
const filteredConversations = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('fr-FR')

  return conversations.value.filter((conversation) => {
    if (!query) return true

    return [conversation.name, conversation.kindLabel, conversation.preview]
      .join(' ')
      .toLocaleLowerCase('fr-FR')
      .includes(query)
  })
})
const openConversationViews = computed(() => openConversationIds.value
  .map(conversationId => conversations.value.find(conversation => conversation.id === conversationId))
  .filter((conversation): conversation is ConversationView => Boolean(conversation)))

const getIdentityUnread = (identityKey: string) => (conversationCache.value[identityKey] || []).reduce((total, conversation) => total + conversation.unreadCount, 0)
const getThreadTitleId = (conversationId: string) => `floating-messenger-thread-title-${generatedId}-${conversationId}`
const getConversationMessages = (conversationId: string) => messageRowsByConversation.value[conversationId] || []
const getConversationDraft = (conversationId: string) => messageDrafts.value[conversationId] || ''
const getConversationError = (conversationId: string) => messageErrors.value[conversationId] || ''
const isConversationLoading = (conversationId: string) => Boolean(loadingMessages.value[conversationId])
const isConversationSending = (conversationId: string) => Boolean(sendingMessages.value[conversationId])
const canSendConversationMessage = (conversationId: string) => Boolean(getConversationDraft(conversationId).trim() && !isConversationSending(conversationId))

const setConversationDraft = (conversationId: string, value: string) => {
  messageDrafts.value = { ...messageDrafts.value, [conversationId]: value }
}

const setConversationCache = (identityKey: string, conversations: MessagingConversationSummaryPresenter[]) => {
  conversationCache.value = { ...conversationCache.value, [identityKey]: conversations }
}

const setMessageElement = (conversationId: string, element: Element | ComponentPublicInstance | null) => {
  if (typeof HTMLOListElement !== 'undefined' && element instanceof HTMLOListElement) {
    messageElements.set(conversationId, element)
    return
  }

  messageElements.delete(conversationId)
}

const scrollMessagesToEnd = async (conversationId: string) => {
  await nextTick()
  const element = messageElements.get(conversationId)
  element?.scrollTo({ top: element.scrollHeight, behavior: 'smooth' })
}

const clearConversationState = (conversationId: string) => {
  messageRowsByConversation.value = omitKey(messageRowsByConversation.value, conversationId)
  messageDrafts.value = omitKey(messageDrafts.value, conversationId)
  loadingMessages.value = omitKey(loadingMessages.value, conversationId)
  sendingMessages.value = omitKey(sendingMessages.value, conversationId)
  messageErrors.value = omitKey(messageErrors.value, conversationId)
  messageElements.delete(conversationId)
}

const resetOpenConversations = () => {
  selectedConversationId.value = ''
  activeConversationId.value = ''
  openConversationIds.value = []
  messageRowsByConversation.value = {}
  messageDrafts.value = {}
  loadingMessages.value = {}
  sendingMessages.value = {}
  messageErrors.value = {}
  messageElements.clear()
}

const getDefaultConversationId = () => conversations.value.find(conversation => conversation.unread)?.id || conversations.value[0]?.id || ''

const ensureSelectedConversation = () => {
  const validConversationIds = new Set(conversations.value.map(conversation => conversation.id))
  const staleConversationIds = openConversationIds.value.filter(conversationId => !validConversationIds.has(conversationId))
  staleConversationIds.forEach(clearConversationState)
  openConversationIds.value = openConversationIds.value.filter(conversationId => validConversationIds.has(conversationId))

  if (!conversations.value.length) {
    selectedConversationId.value = ''
    activeConversationId.value = ''
    return
  }

  if (!validConversationIds.has(selectedConversationId.value)) {
    selectedConversationId.value = getDefaultConversationId()
  }

  if (activeConversationId.value && !validConversationIds.has(activeConversationId.value)) {
    activeConversationId.value = openConversationIds.value[0] || selectedConversationId.value
  }
}

const getConversationQuery = (identity: ReplyIdentity) => identity.scope === 'TEAM'
  ? { scope: identity.scope, teamId: identity.teamId, limit: 50 }
  : { scope: identity.scope, limit: 50 }

const loadIdentityConversations = async (identity: ReplyIdentity) => {
  if (identity.scope === 'TEAM' && !identity.teamId) return []

  const response = await $messagingAPI.listConversations(getConversationQuery(identity))
  setConversationCache(identity.key, response.items)
  return response.items
}

const loadAllConversations = async () => {
  if (!sessionStore.isLoggedIn || !identities.value.length || isLoadingConversations.value) return

  isLoadingConversations.value = true
  loadError.value = ''

  try {
    const results = await Promise.all(identities.value.map(async (identity) => {
      try {
        await loadIdentityConversations(identity)
        return true
      } catch {
        setConversationCache(identity.key, [])
        return false
      }
    }))
    if (!results.some(Boolean)) loadError.value = 'Impossible de charger les conversations'
    hasLoadedConversations.value = true
    ensureSelectedConversation()
  } catch {
    loadError.value = 'Impossible de charger les conversations'
  } finally {
    isLoadingConversations.value = false
  }
}

const refreshSelectedIdentityConversations = async () => {
  loadError.value = ''

  try {
    await loadIdentityConversations(selectedIdentity.value)
    ensureSelectedConversation()
  } catch {
    loadError.value = 'Impossible de charger les conversations'
  }
}

const loadMessages = async (conversationId: string) => {
  if (!conversationId || !isOpen.value) return

  loadingMessages.value = { ...loadingMessages.value, [conversationId]: true }
  messageErrors.value = omitKey(messageErrors.value, conversationId)

  try {
    const response = await $messagingAPI.getMessages(conversationId, { limit: 50 })
    const rows = [...response.items].reverse()
    messageRowsByConversation.value = { ...messageRowsByConversation.value, [conversationId]: rows }
    await scrollMessagesToEnd(conversationId)

    const lastMessageId = rows.at(-1)?.id
    if (lastMessageId) {
      try {
        await $messagingAPI.markRead(conversationId, lastMessageId)
        await refreshSelectedIdentityConversations()
      } catch {
        // Reading the thread is still useful even if the read receipt fails.
      }
    }
  } catch {
    messageErrors.value = { ...messageErrors.value, [conversationId]: 'Impossible de charger les messages' }
  } finally {
    loadingMessages.value = { ...loadingMessages.value, [conversationId]: false }
  }
}

const activateConversation = (conversationId: string) => {
  activeConversationId.value = conversationId
  selectedConversationId.value = conversationId
}

const openConversation = async (conversationId: string) => {
  if (!conversationId) return

  activateConversation(conversationId)
  const previousConversationIds = openConversationIds.value
  const nextConversationIds = [
    conversationId,
    ...previousConversationIds.filter(openConversationId => openConversationId !== conversationId)
  ].slice(0, MAX_OPEN_CHATS)

  previousConversationIds
    .filter(openConversationId => !nextConversationIds.includes(openConversationId))
    .forEach(clearConversationState)

  openConversationIds.value = nextConversationIds
  await nextTick()

  if (!getConversationMessages(conversationId).length && !isConversationLoading(conversationId)) {
    await loadMessages(conversationId)
  } else {
    await scrollMessagesToEnd(conversationId)
  }
}

const closeConversation = (conversationId: string) => {
  openConversationIds.value = openConversationIds.value.filter(openConversationId => openConversationId !== conversationId)
  clearConversationState(conversationId)

  if (activeConversationId.value === conversationId) {
    activeConversationId.value = openConversationIds.value[0] || ''
  }

  if (selectedConversationId.value === conversationId) {
    selectedConversationId.value = activeConversationId.value || getDefaultConversationId()
  }
}

const openMessenger = async () => {
  isOpen.value = true
  if (!sessionStore.isLoggedIn) await sessionStore.bootstrap()

  if (!sessionStore.isLoggedIn) {
    await nextTick()
    panelElement.value?.focus({ preventScroll: true })
    return
  }

  if (!hasLoadedConversations.value) await loadAllConversations()
  ensureSelectedConversation()

  const conversationId = activeConversationId.value || getDefaultConversationId()
  if (conversationId && !openConversationIds.value.length) await openConversation(conversationId)

  await nextTick()
  panelElement.value?.focus({ preventScroll: true })
}

const closeMessenger = () => {
  isOpen.value = false
}

const selectIdentity = async (identityKey: string) => {
  if (identityKey === selectedIdentityKey.value) return

  selectedIdentityKey.value = identityKey
  searchQuery.value = ''
  resetOpenConversations()
  await refreshSelectedIdentityConversations()

  const conversationId = getDefaultConversationId()
  if (isOpen.value && conversationId) await openConversation(conversationId)
}

const selectConversation = async (conversationId: string) => {
  await openConversation(conversationId)
}

const sendMessage = async (conversationId: string) => {
  const content = getConversationDraft(conversationId).trim()
  if (!content || isConversationSending(conversationId)) return

  sendingMessages.value = { ...sendingMessages.value, [conversationId]: true }
  messageErrors.value = omitKey(messageErrors.value, conversationId)

  try {
    await $messagingAPI.sendMessage(conversationId, content)
    setConversationDraft(conversationId, '')
    await loadMessages(conversationId)
  } catch {
    messageErrors.value = { ...messageErrors.value, [conversationId]: 'Impossible d envoyer le message' }
  } finally {
    sendingMessages.value = { ...sendingMessages.value, [conversationId]: false }
  }
}

const formatDate = (value: string, options: Intl.DateTimeFormatOptions) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('fr-FR', options).format(date)
}

const formatConversationTime = (value?: string | null) => value
  ? formatDate(value, { day: '2-digit', month: 'short' })
  : ''

const formatMessageTime = (value: string) => formatDate(value, { hour: '2-digit', minute: '2-digit' })

function toConversationView(conversation: MessagingConversationSummaryPresenter): ConversationView {
  const name = conversation.counterpart.displayName || conversation.counterpart.slug

  return {
    id: conversation.id,
    name,
    initials: createInitials(name),
    avatarUrl: conversation.counterpart.avatarUrl || '',
    kindLabel: conversation.counterpart.type === 'TEAM' ? 'Equipe' : 'Profil',
    preview: conversation.lastMessage?.preview || 'Nouvelle conversation',
    unread: conversation.unreadCount,
    timeIso: conversation.lastMessage?.createdAt || '',
    timeLabel: formatConversationTime(conversation.lastMessage?.createdAt)
  }
}

watch(identities, async (items) => {
  if (!items.some(identity => identity.key === selectedIdentityKey.value)) {
    selectedIdentityKey.value = items[0]?.key || 'self'
    resetOpenConversations()
  }

  if (sessionStore.isLoggedIn) await loadAllConversations()
}, { deep: true })

watch(selectedIdentityConversations, ensureSelectedConversation)

onMounted(async () => {
  await sessionStore.bootstrap()
  if (sessionStore.isLoggedIn) await loadAllConversations()
})
</script>

<style scoped>
.floating-messenger {
  --messenger-space-1: var(--space-1);
  --messenger-space-2: var(--space-2);
  --messenger-space-3: var(--space-3);
  --messenger-radius: var(--radius);
  --messenger-round: var(--radius-round);
  --messenger-border: var(--border);
  --messenger-header-height: calc(var(--unit) * 6);
  --messenger-list-width: calc(var(--unit) * 40);
  --messenger-chat-width: calc(var(--unit) * 42);
  --messenger-list-height: min(calc(100dvh - var(--space-4)), calc(var(--unit) * 72));
  --messenger-chat-height: min(calc(100dvh - var(--space-4)), calc(var(--unit) * 58));
  --messenger-layer: calc(var(--app-layer-modal, var(--layer-header)) + var(--layer-step));
  --messenger-panel: var(--color-panel);
  --messenger-surface: var(--color-surface);
  --messenger-hover: color-mix(in oklch, var(--color-bg-soft-hover) 72%, var(--color-transparent));
  --messenger-line: color-mix(in oklch, var(--color-line) 62%, var(--color-transparent));
  --messenger-text: var(--color-text);
  --messenger-muted: var(--app-color-muted);
  --messenger-subtle: var(--app-color-subtle);
  --messenger-accent: var(--color-accent);
  --messenger-danger: var(--color-danger);
  --messenger-shadow: var(--color-shadow);
  position: fixed;
  inset-block-end: env(safe-area-inset-bottom);
  inset-inline-end: max(calc(var(--unit) * 3), env(safe-area-inset-right));
  z-index: var(--messenger-layer);
  color: var(--messenger-text);
  font-family: var(--font-ui);
}

.floating-messenger *,
.floating-messenger *::before,
.floating-messenger *::after {
  box-sizing: border-box;
  min-width: 0;
  letter-spacing: 0;
}

.floating-messenger h2,
.floating-messenger h3,
.floating-messenger p {
  margin: 0;
}

.floating-messenger h2,
.floating-messenger h3 {
  overflow: hidden;
  color: var(--messenger-text);
  font-size: calc(var(--unit) * 1.8);
  font-weight: 700;
  line-height: var(--line-tight);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.floating-messenger__collapsed {
  position: relative;
  width: var(--messenger-list-width);
  min-width: var(--messenger-list-width);
}

.floating-messenger__collapsed-action {
  width: 100%;
}

.floating-messenger__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--unit) * 4);
  height: calc(var(--unit) * 4);
  min-width: calc(var(--unit) * 4);
  overflow: hidden;
  border-radius: var(--messenger-round);
  background-color: color-mix(in oklch, var(--messenger-accent) 12%, var(--messenger-surface));
  color: var(--messenger-text);
  font-size: calc(var(--unit) * 1.35);
  font-weight: 800;
  line-height: var(--line-tight);
}

.floating-messenger__avatar img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.floating-messenger__badge,
.floating-messenger__identity-badge,
.floating-messenger__conversation-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: calc(var(--unit) * 2.4);
  height: calc(var(--unit) * 2.4);
  padding-inline: calc(var(--unit) * 0.65);
  border-radius: var(--messenger-round);
  background-color: var(--messenger-danger);
  color: var(--color-text);
  font-size: calc(var(--unit) * 1.25);
  font-weight: 800;
  line-height: var(--line-tight);
}

.floating-messenger__badge--floating {
  position: absolute;
  inset-block-start: calc(var(--unit) * -0.5);
  inset-inline-end: calc(var(--unit) * -0.5);
  pointer-events: none;
}

.floating-messenger__dock {
  display: flex;
  gap: var(--messenger-space-1);
  align-items: end;
  max-width: calc(100vw - (var(--space-3) * 2));
  outline: 0;
}

.floating-messenger__panel,
.floating-messenger__mini-chat {
  overflow: hidden;
  border: var(--messenger-border) solid var(--messenger-line);
  border-bottom-width: 0;
  border-radius: var(--messenger-radius) var(--messenger-radius) 0 0;
  background-color: var(--messenger-panel);
  box-shadow: 0 calc(var(--unit) * -0.5) calc(var(--unit) * 3.25) color-mix(in oklch, var(--messenger-shadow) 26%, var(--color-transparent));
}

.floating-messenger__panel {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
}

.floating-messenger__list-panel {
  width: var(--messenger-list-width);
  height: var(--messenger-list-height);
}

.floating-messenger__mini-chats {
  display: flex;
  flex-direction: row-reverse;
  gap: var(--messenger-space-1);
  align-items: end;
  min-width: 0;
}

.floating-messenger__mini-chat {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  width: var(--messenger-chat-width);
  height: var(--messenger-chat-height);
}

.floating-messenger__header,
.floating-messenger__thread-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--messenger-space-1);
  align-items: center;
  min-height: var(--messenger-header-height);
  padding: 0 var(--messenger-space-1) 0 var(--messenger-space-2);
  border-bottom: var(--messenger-border) solid var(--messenger-line);
  background-color: var(--messenger-panel);
}

.floating-messenger__thread-header {
  grid-template-columns: auto minmax(0, 1fr) auto;
}

.floating-messenger__header-title {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--messenger-space-1);
  align-items: center;
}

.floating-messenger__header-title p,
.floating-messenger__thread-header p {
  overflow: hidden;
  color: var(--messenger-muted);
  font-size: calc(var(--unit) * 1.35);
  line-height: var(--line-tight);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.floating-messenger__header-actions,
.floating-messenger__thread-actions {
  display: flex;
  gap: calc(var(--unit) * 0.25);
}

.floating-messenger__identity-bar {
  display: flex;
  gap: calc(var(--unit) * 0.5);
  overflow-x: auto;
  padding: calc(var(--unit) * 0.75) var(--messenger-space-2);
  border-bottom: var(--messenger-border) solid var(--messenger-line);
  background-color: color-mix(in oklch, var(--messenger-surface) 36%, var(--messenger-panel));
}

.floating-messenger__identity,
.floating-messenger__conversation {
  border: 0;
  background-color: var(--color-transparent);
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: start;
}

.floating-messenger__identity {
  position: relative;
  display: inline-grid;
  place-items: center;
  min-width: calc(var(--unit) * 5.5);
  min-height: calc(var(--unit) * 5.5);
  padding: calc(var(--unit) * 0.5);
  border: var(--messenger-border) solid var(--color-transparent);
  border-radius: var(--messenger-round);
  color: var(--messenger-muted);
}

.floating-messenger__identity .floating-messenger__avatar {
  width: calc(var(--unit) * 4.5);
  height: calc(var(--unit) * 4.5);
  min-width: calc(var(--unit) * 4.5);
  font-size: calc(var(--unit) * 1.1);
}

.floating-messenger__identity:hover,
.floating-messenger__identity[data-selected='true'] {
  background-color: var(--messenger-hover);
  color: var(--messenger-text);
}

.floating-messenger__identity[data-selected='true'] {
  border-color: color-mix(in oklch, var(--messenger-accent) 54%, var(--color-transparent));
}

.floating-messenger__identity-badge {
  position: absolute;
  inset-block-start: calc(var(--unit) * 0.2);
  inset-inline-end: calc(var(--unit) * 0.2);
  min-width: calc(var(--unit) * 2.1);
  height: calc(var(--unit) * 2.1);
  padding-inline: calc(var(--unit) * 0.45);
  border: var(--messenger-border) solid var(--messenger-panel);
  font-size: calc(var(--unit) * 1.05);
  pointer-events: none;
}

.floating-messenger__conversation-copy {
  display: grid;
  gap: calc(var(--unit) * 0.35);
}

.floating-messenger__conversation-copy strong {
  overflow: hidden;
  color: var(--messenger-text);
  font-size: calc(var(--unit) * 1.45);
  font-weight: 700;
  line-height: var(--line-tight);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.floating-messenger__conversation-copy small,
.floating-messenger__conversation-copy > span:last-child {
  overflow: hidden;
  color: var(--messenger-muted);
  font-size: calc(var(--unit) * 1.32);
  line-height: var(--line-tight);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.floating-messenger__inbox {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-height: 0;
  background-color: var(--messenger-panel);
}

.floating-messenger__search {
  gap: 0;
  width: auto;
  max-width: calc(100% - (var(--messenger-space-2) * 2));
  margin: var(--messenger-space-1) var(--messenger-space-2);
  padding-block-end: 0;
  justify-self: stretch;
}

.floating-messenger__search :deep(.cus-input-text__error[data-visible='false']) {
  display: none;
}

.floating-messenger__conversation-list,
.floating-messenger__messages {
  overflow: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}

.floating-messenger__conversation {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: var(--messenger-space-1);
  align-items: center;
  width: 100%;
  min-height: calc(var(--unit) * 8.5);
  padding: var(--messenger-space-1) var(--messenger-space-2);
  border-bottom: var(--messenger-border) solid color-mix(in oklch, var(--messenger-line) 58%, var(--color-transparent));
}

.floating-messenger__conversation:hover,
.floating-messenger__conversation[data-selected='true'] {
  background-color: var(--messenger-hover);
}

.floating-messenger__conversation-line {
  display: flex;
  gap: var(--messenger-space-1);
  align-items: baseline;
  justify-content: space-between;
}

.floating-messenger__conversation-line time {
  flex: 0 0 auto;
  color: var(--messenger-subtle);
  font-size: calc(var(--unit) * 1.2);
  font-weight: 600;
}

.floating-messenger__messages {
  display: flex;
  flex-direction: column;
  gap: var(--messenger-space-1);
  padding: var(--messenger-space-2);
  background-color: color-mix(in oklch, var(--messenger-surface) 28%, var(--messenger-panel));
}

.floating-messenger__messages li {
  display: flex;
  justify-content: flex-start;
}

.floating-messenger__messages li.is-mine {
  justify-content: flex-end;
}

.floating-messenger__messages li.is-system {
  justify-content: center;
}

.floating-messenger__bubble {
  max-width: min(82%, calc(var(--unit) * 31));
  padding: calc(var(--unit) * 0.75) var(--messenger-space-2);
  border-radius: calc(var(--messenger-radius) * 1.25);
  background-color: var(--messenger-panel);
  box-shadow: 0 var(--messenger-border) calc(var(--unit) * 0.75) color-mix(in oklch, var(--messenger-shadow) 10%, var(--color-transparent));
}

.floating-messenger__messages li.is-mine .floating-messenger__bubble {
  background-color: color-mix(in oklch, var(--messenger-accent) 18%, var(--messenger-panel));
}

.floating-messenger__messages li.is-system .floating-messenger__bubble {
  max-width: 88%;
  color: var(--messenger-muted);
  text-align: center;
}

.floating-messenger__bubble p {
  color: var(--messenger-text);
  font-size: calc(var(--unit) * 1.5);
  line-height: var(--line-base);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.floating-messenger__bubble time {
  display: block;
  margin-top: calc(var(--unit) * 0.35);
  color: var(--messenger-subtle);
  font-size: calc(var(--unit) * 1.15);
  font-weight: 600;
  text-align: end;
}

.floating-messenger__composer {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--messenger-space-1);
  align-items: stretch;
  padding: var(--messenger-space-1) var(--messenger-space-2);
  border-top: var(--messenger-border) solid var(--messenger-line);
  background-color: var(--messenger-panel);
}

.floating-messenger__composer-input {
  gap: 0;
  margin-block-end: 0;
  padding-block-end: 0;
  width: 100%;
}

.floating-messenger__composer-input :deep(.cus-input-textarea__counter),
.floating-messenger__composer-input :deep(.cus-input-textarea__error[data-visible='false']) {
  display: none;
}

.floating-messenger__composer :deep(.floating-messenger__composer-submit.cus-button) {
  justify-self: end;
  width: calc(var(--unit) * 5.5);
  height: calc(var(--unit) * 5.5);
  min-width: calc(var(--unit) * 5.5);
  min-height: calc(var(--unit) * 5.5);
  padding: 0;
  border-radius: var(--messenger-round);
}

.floating-messenger__composer :deep(.cus-input-textarea__control) {
  min-height: calc(var(--unit) * 6.5);
  border-radius: var(--messenger-radius);
}

.floating-messenger__signed-out {
  grid-row: 2 / -1;
  display: grid;
  place-items: center;
  align-content: center;
  gap: var(--messenger-space-2);
  padding: var(--space-4);
  color: var(--messenger-muted);
  text-align: center;
}

.floating-messenger__signed-out > svg {
  width: calc(var(--unit) * 5);
  height: calc(var(--unit) * 5);
  color: var(--messenger-accent);
}

.floating-messenger__signed-out strong {
  display: block;
  color: var(--messenger-text);
  font-size: calc(var(--unit) * 1.8);
  line-height: var(--line-title);
}

.floating-messenger__signed-out p {
  margin-top: var(--messenger-space-1);
  color: var(--messenger-muted);
  font-size: calc(var(--unit) * 1.45);
  line-height: var(--line-base);
}

.floating-messenger__state {
  display: grid;
  place-items: center;
  align-content: center;
  gap: var(--messenger-space-1);
  min-height: calc(var(--unit) * 14);
  padding: var(--messenger-space-3);
  color: var(--messenger-muted);
  font-size: calc(var(--unit) * 1.45);
  font-weight: 700;
  line-height: var(--line-base);
  text-align: center;
}

.floating-messenger__state--thread {
  min-height: 100%;
}

.floating-messenger__state svg {
  width: calc(var(--unit) * 2.5);
  height: calc(var(--unit) * 2.5);
}

.floating-messenger__loader {
  animation: floating-messenger-spin var(--motion-fast) linear infinite;
}

.floating-messenger button:focus-visible,
.floating-messenger a:focus-visible,
.floating-messenger__dock:focus-visible {
  outline: calc(var(--messenger-border) * 3) solid var(--messenger-accent);
  outline-offset: calc(var(--messenger-border) * 2);
}

@keyframes floating-messenger-spin {
  to { transform: rotate(1turn); }
}

@media (prefers-reduced-motion: reduce) {
  .floating-messenger *,
  .floating-messenger *::before,
  .floating-messenger *::after {
    scroll-behavior: auto !important;
    transition-duration: 1ms !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
  }
}

@media (max-width: 64rem) {
  .floating-messenger {
    inset-inline: var(--space-2);
    inset-block-end: env(safe-area-inset-bottom);
  }

  .floating-messenger__collapsed {
    width: 100%;
    min-width: 100%;
  }

  .floating-messenger__dock {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    width: 100%;
    max-width: none;
    max-height: calc(100dvh - var(--space-2));
  }

  .floating-messenger__mini-chats {
    flex-direction: row;
    overflow-x: auto;
    width: 100%;
  }

  .floating-messenger__mini-chat {
    width: min(calc(100vw - (var(--space-2) * 2)), var(--messenger-chat-width));
    height: min(48dvh, var(--messenger-chat-height));
    flex: 0 0 auto;
  }

  .floating-messenger__list-panel {
    width: 100%;
    height: min(52dvh, var(--messenger-list-height));
  }
}

@media (max-width: 40rem) {
  .floating-messenger__mini-chats {
    display: grid;
  }

  .floating-messenger__mini-chat {
    width: 100%;
  }

  .floating-messenger__mini-chat:not(:first-child) {
    display: none;
  }

  .floating-messenger__list-panel {
    height: min(50dvh, calc(var(--unit) * 56));
  }

  .floating-messenger__thread-expand {
    display: none;
  }
}
</style>
