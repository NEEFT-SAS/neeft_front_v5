<template>
  <main class="messages-page" aria-labelledby="messages-title">
    <section class="messages-page__hero">
      <div class="messages-page__shell messages-page__hero-inner">
        <div>
          <p class="messages-page__eyebrow">
            Messagerie globale
          </p>
          <h1 id="messages-title">
            Conversations
          </h1>
          <p>Centralise tes echanges avec joueurs, equipes, staffs et partenaires dans une interface rapide et lisible.</p>
        </div>

        <div class="messages-page__hero-actions" aria-label="Actions rapides messagerie">
          <CustomButton class="messages-page__pill-action" label="Nouveau message" left-icon="lucide:edit-3" theme="app" variant="filled" color="primary" size="sm" shape="circle" />
          <CustomButton class="messages-page__icon-action" left-icon="lucide:sliders-horizontal" theme="app" variant="outlined" color="secondary" size="sm" shape="circle" aria-label="Filtres" title="Filtres" />
        </div>
      </div>
    </section>

    <section class="messages-page__shell messages-page__workspace" aria-label="Interface de messagerie">
      <aside class="messages-page__inbox" aria-labelledby="messages-inbox-title">
        <header class="messages-page__panel-header">
          <div>
            <p class="messages-page__eyebrow">
              Inbox
            </p>
            <h2 id="messages-inbox-title">
              Messages
            </h2>
          </div>
          <span class="messages-page__count">{{ unreadTotal }}</span>
        </header>

        <CustomInputText
          v-model="searchQuery"
          class="messages-page__search"
          label="Rechercher une conversation"
          label-position="inside"
          left-icon="lucide:search"
          size="sm"
        />

        <nav class="messages-page__tabs" aria-label="Filtres de messagerie">
          <CustomButton
            v-for="tab in tabs"
            :key="tab.value"
            class="messages-page__tab-action"
            :label="tab.label"
            theme="app"
            variant="ghost"
            color="secondary"
            size="sm"
            shape="circle"
            :selected="activeTab === tab.value"
            :aria-pressed="activeTab === tab.value"
            @click="activeTab = tab.value"
          />
        </nav>

        <ul class="messages-page__conversation-list">
          <li v-for="conversation in filteredConversations" :key="conversation.id">
            <button type="button" class="messages-page__conversation" :class="{ 'is-active': selectedConversation.id === conversation.id, 'has-unread': conversation.unread }" @click="selectConversation(conversation.id)">
              <span class="messages-page__avatar" :class="`messages-page__avatar--${conversation.kind}`" aria-hidden="true">
                {{ conversation.initials }}
              </span>
              <span class="messages-page__conversation-main">
                <span class="messages-page__conversation-topline">
                  <strong>{{ conversation.name }}</strong>
                  <small>{{ conversation.time }}</small>
                </span>
                <span class="messages-page__conversation-role">{{ conversation.role }}</span>
                <span class="messages-page__conversation-preview">{{ conversation.preview }}</span>
              </span>
              <span v-if="conversation.unread" class="messages-page__unread" aria-label="Messages non lus">{{ conversation.unread }}</span>
            </button>
          </li>
        </ul>
      </aside>

      <section class="messages-page__chat" :aria-labelledby="chatTitleId">
        <header class="messages-page__chat-header">
          <div class="messages-page__chat-identity">
            <span class="messages-page__avatar messages-page__avatar--large" :class="`messages-page__avatar--${selectedConversation.kind}`" aria-hidden="true">
              {{ selectedConversation.initials }}
            </span>
            <div>
              <p class="messages-page__eyebrow">
                {{ selectedConversation.kindLabel }}
              </p>
              <h2 :id="chatTitleId">
                {{ selectedConversation.name }}
              </h2>
              <p class="messages-page__presence">
                <span aria-hidden="true" />
                {{ selectedConversation.status }}
              </p>
            </div>
          </div>

          <div class="messages-page__chat-actions" aria-label="Actions de conversation">
            <CustomButton class="messages-page__icon-action" left-icon="lucide:phone" theme="app" variant="ghost" color="secondary" size="sm" shape="circle" aria-label="Appel vocal" title="Appel vocal" />
            <CustomButton class="messages-page__icon-action" left-icon="lucide:user-round" theme="app" variant="ghost" color="secondary" size="sm" shape="circle" aria-label="Voir le profil" title="Voir le profil" />
            <CustomButton class="messages-page__icon-action" left-icon="lucide:more-horizontal" theme="app" variant="ghost" color="secondary" size="sm" shape="circle" aria-label="Plus d options" title="Plus d options" />
          </div>
        </header>

        <div class="messages-page__match-card">
          <Icon name="lucide:trophy" aria-hidden="true" />
          <span>
            <strong>{{ selectedConversation.contextTitle }}</strong>
            <small>{{ selectedConversation.context }}</small>
          </span>
        </div>

        <ol class="messages-page__thread">
          <li v-for="message in selectedConversation.messages" :key="message.id" :class="{ 'is-mine': message.mine, 'is-system': message.system }">
            <div class="messages-page__bubble">
              <p>{{ message.text }}</p>
              <time>{{ message.time }}</time>
            </div>
          </li>
        </ol>

        <footer class="messages-page__composer" aria-label="Composer un message">
          <CustomButton class="messages-page__icon-action" left-icon="lucide:paperclip" theme="app" variant="ghost" color="secondary" size="sm" shape="circle" aria-label="Ajouter une piece jointe" title="Ajouter une piece jointe" />
          <CustomInputTextarea
            v-model="messageDraft"
            label="Message"
            label-position="inside"
            placeholder="Ecris un message..."
            :rows="2"
            resize="none"
            size="sm"
          />
          <CustomButton class="messages-page__send-action" left-icon="lucide:send-horizontal" theme="app" variant="filled" color="primary" size="sm" shape="circle" aria-label="Envoyer le message" title="Envoyer le message" :disabled="isSending || !messageDraft.trim() || !selectedConversation.id" @click="sendMessage" />
        </footer>
      </section>

      <aside class="messages-page__profile" aria-labelledby="messages-profile-title">
        <div class="messages-page__profile-card">
          <span class="messages-page__avatar messages-page__avatar--xl" :class="`messages-page__avatar--${selectedConversation.kind}`" aria-hidden="true">
            {{ selectedConversation.initials }}
          </span>
          <p class="messages-page__eyebrow">
            Profil
          </p>
          <h2 id="messages-profile-title">
            {{ selectedConversation.name }}
          </h2>
          <p>{{ selectedConversation.bio }}</p>
        </div>

        <div class="messages-page__profile-section">
          <h3>Tags</h3>
          <div class="messages-page__tags">
            <span v-for="tag in selectedConversation.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>

        <div class="messages-page__profile-section">
          <h3>Actions rapides</h3>
          <CustomButton class="messages-page__profile-action" label="Planifier un call" left-icon="lucide:calendar-plus" theme="app" variant="ghost" color="secondary" size="sm" shape="circle" />
          <CustomButton class="messages-page__profile-action" label="Sauvegarder" left-icon="lucide:bookmark" theme="app" variant="ghost" color="secondary" size="sm" shape="circle" />
          <CustomButton class="messages-page__profile-action" label="Signaler" left-icon="lucide:flag" theme="app" variant="ghost" color="secondary" size="sm" shape="circle" />
        </div>
      </aside>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { MessagingConversationSummaryPresenter, MessagingMessagePresenter } from '@neeft-sas/shared'

type MessageTab = 'all' | 'unread' | 'teams'

type ConversationMessage = {
  id: string
  text: string
  time: string
  mine?: boolean
  system?: boolean
}

type Conversation = {
  id: string
  name: string
  initials: string
  role: string
  kind: 'player' | 'team' | 'staff' | 'partner'
  kindLabel: string
  status: string
  time: string
  preview: string
  unread: number
  contextTitle: string
  context: string
  bio: string
  tags: string[]
  messages: ConversationMessage[]
}

definePageMeta({
  layout: 'app'
})

const config = useConfig()
useSeoMeta(config.messages.seo)

const { $messagingAPI } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const generatedId = useId()
const chatTitleId = `messages-chat-title-${generatedId}`
const searchQuery = ref('')
const messageDraft = ref('')
const activeTab = ref<MessageTab>('all')
const selectedConversationId = ref(String(route.query.conversation || ''))
const messageRows = ref<MessagingMessagePresenter[]>([])
const isSending = ref(false)

const tabs: { value: MessageTab; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'unread', label: 'Non lus' },
  { value: 'teams', label: 'Equipes' }
]

const { data: conversationResponse, refresh: refreshConversations } = await useAsyncData(
  'messaging-conversations',
  () => $messagingAPI.listConversations({ scope: 'SELF', limit: 100 })
)

const formatTime = (value?: string | null) => {
  if (!value) return ''
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}

const initials = (name: string) => name.split(/\s+/).slice(0, 2).map(part => part[0] || '').join('').toLocaleUpperCase('fr-FR')

const mapConversation = (summary: MessagingConversationSummaryPresenter): Conversation => {
  const name = summary.counterpart.displayName || summary.counterpart.slug
  const selectedMessages: ConversationMessage[] = summary.id === selectedConversationId.value
    ? messageRows.value.map(message => ({
        id: message.id,
        text: message.content,
        time: formatTime(message.createdAt),
        mine: message.isOwn,
        system: message.senderType === 'SYSTEM'
      }))
    : []

  return {
    id: summary.id,
    name,
    initials: initials(name),
    role: summary.counterpart.type === 'TEAM' ? 'Equipe Neeft' : 'Profil Neeft',
    kind: summary.counterpart.type === 'TEAM' ? 'team' : 'player',
    kindLabel: summary.counterpart.type === 'TEAM' ? 'Equipe' : 'Joueur',
    status: 'Conversation Neeft',
    time: formatTime(summary.lastMessage?.createdAt),
    preview: summary.lastMessage?.preview || 'Nouvelle conversation',
    unread: summary.unreadCount,
    contextTitle: summary.scope === 'TEAM' ? summary.context.displayName : 'Conversation directe',
    context: summary.scope === 'TEAM' ? 'Echange dans un contexte equipe' : 'Echange entre profils Neeft',
    bio: `Profil ${summary.counterpart.slug}`,
    tags: [summary.counterpart.type === 'TEAM' ? 'Equipe' : 'Profil'],
    messages: selectedMessages
  }
}

const conversations = computed(() => (conversationResponse.value?.items || []).map(mapConversation))
const emptyConversation: Conversation = {
  id: '', name: 'Aucune conversation', initials: '--', role: '', kind: 'player', kindLabel: 'Messagerie', status: '', time: '', preview: '', unread: 0,
  contextTitle: 'Selectionne une conversation', context: '', bio: 'Tes conversations apparaitront ici.', tags: [], messages: []
}

const unreadTotal = computed(() => conversations.value.reduce((total, conversation) => total + conversation.unread, 0))
const selectedConversation = computed(() => conversations.value.find(conversation => conversation.id === selectedConversationId.value) || emptyConversation)
const filteredConversations = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('fr-FR')

  return conversations.value.filter((conversation) => {
    if (activeTab.value === 'unread' && !conversation.unread) return false
    if (activeTab.value === 'teams' && conversation.kind !== 'team') return false
    if (!query) return true

    return [conversation.name, conversation.role, conversation.preview, ...conversation.tags]
      .join(' ')
      .toLocaleLowerCase('fr-FR')
      .includes(query)
  })
})

const loadMessages = async (conversationId: string) => {
  if (!conversationId) {
    messageRows.value = []
    return
  }

  const response = await $messagingAPI.getMessages(conversationId, { limit: 50 })
  messageRows.value = [...response.items].reverse()
  const lastMessageId = messageRows.value.at(-1)?.id
  if (lastMessageId) await $messagingAPI.markRead(conversationId, lastMessageId)
  await refreshConversations()
}

const selectConversation = async (conversationId: string) => {
  selectedConversationId.value = conversationId
  await router.replace({ query: { ...route.query, conversation: conversationId } })
}

const sendMessage = async () => {
  const content = messageDraft.value.trim()
  if (!content || !selectedConversationId.value || isSending.value) return

  isSending.value = true
  try {
    await $messagingAPI.sendMessage(selectedConversationId.value, content)
    messageDraft.value = ''
    await loadMessages(selectedConversationId.value)
  } finally {
    isSending.value = false
  }
}

watch(conversations, (items) => {
  if (!items.length) return
  if (!items.some(item => item.id === selectedConversationId.value)) selectedConversationId.value = items[0].id
}, { immediate: true })

watch(selectedConversationId, conversationId => loadMessages(conversationId), { immediate: true })
</script>

<style scoped>
.messages-page {
  --messages-unit: var(--unit);
  --messages-space-1: var(--space-1);
  --messages-space-2: var(--space-2);
  --messages-space-3: var(--space-3);
  --messages-space-4: calc(var(--messages-unit) * 4);
  --messages-space-5: calc(var(--messages-unit) * 5);
  --messages-space-6: calc(var(--messages-unit) * 6);
  --messages-content-max: calc(var(--messages-unit) * 150);
  --messages-panel-min: calc(var(--messages-unit) * 34);
  --messages-radius: var(--radius);
  --messages-radius-round: var(--radius-round);
  --messages-border: var(--border);
  --messages-color-bg: var(--color-bg);
  --messages-color-panel: var(--color-surface);
  --messages-color-line: var(--app-color-line);
  --messages-color-text: var(--color-text);
  --messages-color-muted: var(--app-color-muted);
  --messages-color-subtle: var(--app-color-subtle);
  --messages-color-accent: var(--color-accent);
  --messages-color-success: var(--color-success);
  --messages-color-shadow: var(--color-shadow);
  min-height: calc(100vh - var(--app-header-height));
  background: radial-gradient(circle at top left, color-mix(in oklch, var(--messages-color-accent) 14%, transparent), transparent 32%), var(--messages-color-bg);
  color: var(--messages-color-text);
}

.messages-page *,
.messages-page *::before,
.messages-page *::after {
  box-sizing: border-box;
  min-width: 0;
}

.messages-page__shell {
  width: min(calc(100% - (var(--messages-space-4) * 2)), var(--messages-content-max));
  margin: 0 auto;
}

.messages-page__hero {
  border-bottom: var(--messages-border) solid var(--messages-color-line);
  background-color: color-mix(in oklch, var(--messages-color-panel) 72%, var(--messages-color-bg));
}

.messages-page__hero-inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--messages-space-4);
  align-items: end;
  padding: var(--messages-space-5) 0 var(--messages-space-4);
}

.messages-page h1,
.messages-page h2,
.messages-page h3,
.messages-page p {
  margin: 0;
}

.messages-page h1 {
  font-size: clamp(calc(var(--messages-unit) * 4), 4vw, calc(var(--messages-unit) * 6));
  font-weight: 700;
  line-height: var(--line-tight);
}

.messages-page h2 {
  font-size: calc(var(--messages-unit) * 2.7);
  font-weight: 700;
  line-height: var(--line-title);
}

.messages-page h3 {
  font-size: calc(var(--messages-unit) * 2);
  font-weight: 700;
}

.messages-page__hero p,
.messages-page__profile-card p,
.messages-page__conversation-preview,
.messages-page__conversation-role {
  color: var(--messages-color-muted);
  line-height: var(--line-base);
}

.messages-page__eyebrow {
  color: var(--messages-color-subtle);
  font-size: calc(var(--messages-unit) * 1.45);
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: var(--line-base);
  text-transform: uppercase;
}

.messages-page__hero-actions,
.messages-page__chat-actions,
.messages-page__tabs,
.messages-page__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--messages-space-2);
}

.messages-page__hero-actions :deep(.cus-button),
.messages-page__tabs :deep(.cus-button),
.messages-page__chat-actions :deep(.cus-button),
.messages-page__composer :deep(.cus-button),
.messages-page__profile-section :deep(.cus-button) {
  min-width: auto;
  border-radius: var(--messages-radius-round);
}

.messages-page__pill-action :deep(.cus-button) {
  padding-inline: var(--messages-space-3);
  box-shadow: 0 calc(var(--messages-unit) * 1.2) calc(var(--messages-unit) * 4) color-mix(in oklch, var(--messages-color-accent) 22%, transparent);
}

.messages-page__icon-action :deep(.cus-button),
.messages-page__send-action :deep(.cus-button) {
  width: calc(var(--messages-unit) * 4.6);
  min-width: calc(var(--messages-unit) * 4.6);
  height: calc(var(--messages-unit) * 4.6);
  padding: 0;
  border-radius: var(--messages-radius-round);
}

.messages-page__icon-action :deep(.cus-button) {
  background: color-mix(in oklch, var(--messages-color-panel) 72%, transparent);
  backdrop-filter: blur(calc(var(--messages-unit) * 1.5));
}

.messages-page__send-action :deep(.cus-button) {
  box-shadow: 0 calc(var(--messages-unit) * 1) calc(var(--messages-unit) * 3.5) color-mix(in oklch, var(--messages-color-accent) 30%, transparent);
}

.messages-page__tab-action :deep(.cus-button) {
  min-height: calc(var(--messages-unit) * 3.6);
  padding-inline: var(--messages-space-2);
  background-color: color-mix(in oklch, var(--messages-color-bg) 44%, transparent);
  font-size: calc(var(--messages-unit) * 1.4);
}

.messages-page__tab-action :deep(.cus-button[data-selected='true']) {
  background-color: color-mix(in oklch, var(--messages-color-accent) 16%, var(--messages-color-panel));
  color: var(--messages-color-accent);
}

.messages-page__profile-action :deep(.cus-button) {
  justify-content: flex-start;
  width: 100%;
  padding-inline: var(--messages-space-2);
  background-color: color-mix(in oklch, var(--messages-color-bg) 38%, transparent);
}

.messages-page__workspace {
  display: grid;
  grid-template-columns: minmax(var(--messages-panel-min), 0.82fr) minmax(0, 1.55fr) minmax(var(--messages-panel-min), 0.78fr);
  gap: var(--messages-space-3);
  align-items: stretch;
  padding: var(--messages-space-4) 0 var(--messages-space-6);
}

.messages-page__inbox,
.messages-page__chat,
.messages-page__profile {
  overflow: hidden;
  border: var(--messages-border) solid var(--messages-color-line);
  border-radius: calc(var(--messages-radius) * 1.25);
  background-color: color-mix(in oklch, var(--messages-color-panel) 94%, var(--messages-color-bg));
  box-shadow: 0 calc(var(--messages-unit) * 2) calc(var(--messages-unit) * 8) color-mix(in oklch, var(--messages-color-shadow) 14%, transparent);
}

.messages-page__inbox,
.messages-page__profile {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - var(--app-header-height) - var(--messages-space-6));
}

.messages-page__panel-header,
.messages-page__chat-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--messages-space-3);
  align-items: center;
  padding: var(--messages-space-3);
  border-bottom: var(--messages-border) solid var(--messages-color-line);
}

.messages-page__count,
.messages-page__unread {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: calc(var(--messages-unit) * 2.7);
  height: calc(var(--messages-unit) * 2.7);
  border-radius: var(--messages-radius-round);
  background-color: var(--messages-color-accent);
  color: var(--color-white, white);
  font-size: calc(var(--messages-unit) * 1.35);
  font-weight: 800;
}

.messages-page__search {
  margin: var(--messages-space-3);
}

.messages-page__tabs {
  padding: 0 var(--messages-space-3) var(--messages-space-2);
}

.messages-page__conversation-list {
  display: grid;
  gap: 0;
  overflow: auto;
  margin: 0;
  padding: 0;
  list-style: none;
}

.messages-page__conversation {
  display: grid;
  grid-template-columns: calc(var(--messages-unit) * 5.4) minmax(0, 1fr) auto;
  gap: var(--messages-space-2);
  align-items: center;
  width: 100%;
  padding: var(--messages-space-2) var(--messages-space-3);
  border: 0;
  border-bottom: var(--messages-border) solid var(--messages-color-line);
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.messages-page__conversation:hover,
.messages-page__conversation.is-active {
  background-color: color-mix(in oklch, var(--messages-color-accent) 10%, var(--messages-color-panel));
}

.messages-page__conversation.has-unread strong {
  color: var(--messages-color-accent);
}

.messages-page__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--messages-unit) * 5.2);
  height: calc(var(--messages-unit) * 5.2);
  border-radius: var(--messages-radius-round);
  background-color: color-mix(in oklch, var(--messages-color-accent) 18%, var(--messages-color-panel));
  color: var(--messages-color-text);
  font-weight: 800;
}

.messages-page__avatar--team { background-color: oklch(61% 0.18 255 / 0.18); }
.messages-page__avatar--player { background-color: oklch(68% 0.19 145 / 0.18); }
.messages-page__avatar--staff { background-color: oklch(72% 0.16 75 / 0.18); }
.messages-page__avatar--partner { background-color: oklch(66% 0.18 315 / 0.18); }
.messages-page__avatar--large { width: calc(var(--messages-unit) * 6); height: calc(var(--messages-unit) * 6); }
.messages-page__avatar--xl { width: calc(var(--messages-unit) * 9); height: calc(var(--messages-unit) * 9); font-size: calc(var(--messages-unit) * 2.6); }

.messages-page__conversation-main,
.messages-page__chat-identity,
.messages-page__profile-card,
.messages-page__profile-section {
  display: grid;
  gap: calc(var(--messages-unit) * 0.7);
}

.messages-page__conversation-topline {
  display: flex;
  gap: var(--messages-space-2);
  justify-content: space-between;
}

.messages-page__conversation-topline small,
.messages-page__bubble time {
  color: var(--messages-color-subtle);
  font-size: calc(var(--messages-unit) * 1.35);
  font-weight: 700;
}

.messages-page__conversation-preview,
.messages-page__conversation-role {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.messages-page__chat {
  display: grid;
  grid-template-rows: auto auto minmax(calc(var(--messages-unit) * 32), 1fr) auto;
  min-height: calc(var(--messages-unit) * 74);
}

.messages-page__chat-identity {
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
}

.messages-page__presence {
  display: flex;
  gap: var(--messages-space-1);
  align-items: center;
  color: var(--messages-color-muted);
}

.messages-page__presence span {
  width: calc(var(--messages-unit) * 1.1);
  height: calc(var(--messages-unit) * 1.1);
  border-radius: var(--messages-radius-round);
  background-color: var(--messages-color-success);
}

.messages-page__match-card > svg,
.messages-page__profile-section :deep(svg) {
  width: calc(var(--messages-unit) * 2);
  height: calc(var(--messages-unit) * 2);
}

.messages-page__match-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--messages-space-2);
  align-items: center;
  margin: var(--messages-space-3) var(--messages-space-3) 0;
  padding: var(--messages-space-2);
  border: var(--messages-border) solid color-mix(in oklch, var(--messages-color-accent) 30%, var(--messages-color-line));
  border-radius: var(--messages-radius);
  background-color: color-mix(in oklch, var(--messages-color-accent) 10%, var(--messages-color-panel));
}

.messages-page__match-card > svg {
  width: calc(var(--messages-unit) * 3.2);
  height: calc(var(--messages-unit) * 3.2);
  color: var(--messages-color-accent);
}

.messages-page__match-card span,
.messages-page__profile-section {
  display: grid;
  gap: calc(var(--messages-unit) * 0.5);
}

.messages-page__match-card small {
  color: var(--messages-color-muted);
}

.messages-page__thread {
  display: flex;
  flex-direction: column;
  gap: var(--messages-space-2);
  overflow: auto;
  margin: 0;
  padding: var(--messages-space-4) var(--messages-space-3);
  list-style: none;
}

.messages-page__thread li {
  display: flex;
  justify-content: flex-start;
}

.messages-page__thread li.is-mine {
  justify-content: flex-end;
}

.messages-page__thread li.is-system {
  justify-content: center;
}

.messages-page__bubble {
  max-width: min(76%, calc(var(--messages-unit) * 72));
  padding: var(--messages-space-2);
  border: var(--messages-border) solid var(--messages-color-line);
  border-radius: calc(var(--messages-radius) * 1.15);
  border-bottom-left-radius: calc(var(--messages-unit) * 0.8);
  background-color: color-mix(in oklch, var(--messages-color-panel) 88%, var(--messages-color-bg));
}

.messages-page__thread li.is-mine .messages-page__bubble {
  border-color: color-mix(in oklch, var(--messages-color-accent) 42%, var(--messages-color-line));
  border-bottom-right-radius: calc(var(--messages-unit) * 0.8);
  border-bottom-left-radius: calc(var(--messages-radius) * 1.15);
  background-color: color-mix(in oklch, var(--messages-color-accent) 16%, var(--messages-color-panel));
}

.messages-page__thread li.is-system .messages-page__bubble {
  max-width: 80%;
  border-style: dashed;
  border-radius: var(--messages-radius-round);
  text-align: center;
}

.messages-page__bubble p {
  color: var(--messages-color-text);
  line-height: var(--line-base);
}

.messages-page__bubble time {
  display: block;
  margin-top: calc(var(--messages-unit) * 0.8);
  text-align: right;
}

.messages-page__composer {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: var(--messages-space-2);
  align-items: end;
  padding: var(--messages-space-3);
  border-top: var(--messages-border) solid var(--messages-color-line);
}

.messages-page__composer :deep(.cus-button) {
  align-self: end;
}

.messages-page__profile {
  gap: var(--messages-space-3);
  padding: var(--messages-space-3);
}

.messages-page__profile-card {
  justify-items: center;
  padding: var(--messages-space-4) var(--messages-space-2);
  border-bottom: var(--messages-border) solid var(--messages-color-line);
  text-align: center;
}

.messages-page__profile-section {
  padding: var(--messages-space-2) 0;
}

.messages-page__tags span {
  padding: calc(var(--messages-unit) * 0.7) var(--messages-space-2);
  border-radius: var(--messages-radius-round);
  background-color: color-mix(in oklch, var(--messages-color-accent) 12%, var(--messages-color-panel));
  color: var(--messages-color-accent);
  font-size: calc(var(--messages-unit) * 1.45);
  font-weight: 800;
}

.messages-page__profile-section button {
  justify-self: start;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

@media (max-width: 78rem) {
  .messages-page__workspace {
    grid-template-columns: minmax(calc(var(--messages-unit) * 32), 0.9fr) minmax(0, 1.5fr);
  }

  .messages-page__profile {
    display: none;
  }
}

@media (max-width: 56rem) {
  .messages-page__shell {
    width: min(calc(100% - (var(--messages-space-3) * 2)), var(--messages-content-max));
  }

  .messages-page__hero-inner,
  .messages-page__workspace,
  .messages-page__panel-header,
  .messages-page__chat-header {
    grid-template-columns: 1fr;
  }

  .messages-page__inbox,
  .messages-page__profile {
    max-height: none;
  }

  .messages-page__chat {
    min-height: calc(var(--messages-unit) * 68);
  }
}

@media (max-width: 40rem) {
  .messages-page__hero-actions,
  .messages-page__chat-actions {
    width: 100%;
  }

  .messages-page__conversation,
  .messages-page__composer {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .messages-page__unread,
  .messages-page__composer .messages-page__send {
    grid-column: 2;
    justify-self: end;
  }

  .messages-page__bubble {
    max-width: 88%;
  }
}
</style>
