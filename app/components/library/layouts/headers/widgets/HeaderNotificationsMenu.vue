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
        <p class="header-user-menu__title">Notifications</p>
        <template v-if="notifications.length">
          <article
            v-for="notification in notifications"
            :key="notification.id"
            class="header-user-menu__notification"
            role="none"
          >
            <div class="header-user-menu__notification-copy">
              <span>{{ notification.label }}</span>
              <strong>{{ notification.title }}</strong>
              <small>{{ notification.description }}</small>
            </div>
            <div class="header-user-menu__notification-actions">
              <template v-if="notification.kind === 'sale'">
                <NuxtLink
                  class="header-user-menu__action"
                  :to="notification.orderTo || '/marketplace/sales'"
                  role="menuitem"
                  @click="emit('close')"
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
                  @click="resolveNotification(notification.id)"
                >
                  Accepter
                </button>
                <button
                  class="header-user-menu__action header-user-menu__action--muted"
                  type="button"
                  role="menuitem"
                  @click="resolveNotification(notification.id)"
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
type HeaderMenuTheme = 'landing' | 'app'
type HeaderNotification = {
  id: string
  kind: 'decision' | 'sale'
  label: string
  title: string
  description: string
  orderTo?: string
}

withDefaults(defineProps<{
  open: boolean
  theme?: HeaderMenuTheme
  triggerId: string
  panelId: string
}>(), { theme: 'app' })

const emit = defineEmits<{
  toggle: []
  close: []
}>()

const notifications = ref<HeaderNotification[]>([
  {
    id: 'friend-request',
    kind: 'decision',
    label: 'Demande d ami',
    title: 'Maya R. veut t ajouter',
    description: 'Accepter ou refuser la demande.'
  },
  {
    id: 'new-sale',
    kind: 'sale',
    label: 'Nouvelle vente',
    title: 'Commande CMD-2502 recue',
    description: 'Nina V. a commande ton service management.',
    orderTo: '/marketplace/sales/CMD-2502'
  },
  {
    id: 'team-join-request',
    kind: 'decision',
    label: 'Demande de rejoindre l equipe',
    title: 'Eliott P. veut rejoindre Nova Five',
    description: 'Accepter ou refuser la candidature.'
  },
  {
    id: 'team-invite',
    kind: 'decision',
    label: 'Invitation equipe',
    title: 'Aegis Club veut t integrer',
    description: 'Accepter ou refuser l invitation.'
  }
])

const unreadNotificationsCount = computed(() => notifications.value.length)

const resolveNotification = (notificationId: string) => {
  notifications.value = notifications.value.filter(notification => notification.id !== notificationId)
}
const dismissNotification = resolveNotification
const getNotificationDismissLabel = (notification: HeaderNotification) => `Ignorer ${notification.title}`
</script>
