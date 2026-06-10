<template>
  <div
    v-if="isLoggedIn"
    ref="actionsElement"
    class="header-user-actions"
    :data-user-actions-theme="theme"
    :data-user-actions-size="size"
    aria-label="Actions utilisateur"
    @focusout="closeMenusOnFocusout"
    @keydown.escape.stop="closeMenus"
  >
    <div class="header-user-actions__quick-actions" aria-label="Acces rapides">
      <HeaderCreateMenu
        :open="isCreateMenuOpen"
        :theme="theme"
        :trigger-id="createTriggerId"
        :panel-id="createPanelId"
        @toggle="toggleCreateMenu"
        @close="closeCreateMenu"
        @open-service-form="openServiceProposalModal"
        @open-team-form="openTeamCreationModal"
      />
      <button class="header-user-actions__icon-button" type="button" aria-label="Messagerie">
        <Icon name="lucide:message-circle" aria-hidden="true" />
      </button>
      <HeaderNotificationsMenu
        :open="isNotificationsMenuOpen"
        :theme="theme"
        :trigger-id="notificationsTriggerId"
        :panel-id="notificationsPanelId"
        @toggle="toggleNotificationsMenu"
        @close="closeNotificationsMenu"
      />
    </div>
    <span class="header-user-actions__divider" aria-hidden="true" />
    <NuxtLink class="header-user-actions__profile" :to="profileTo" :aria-label="profileAriaLabel">
      <img class="header-user-actions__avatar" :src="avatarSrc" alt="" decoding="async">
      <span class="header-user-actions__username">{{ profileLabel }}</span>
    </NuxtLink>
    <HeaderSettingsMenu
      :open="isSettingsMenuOpen"
      :theme="theme"
      :trigger-id="settingsTriggerId"
      :panel-id="settingsPanelId"
      :profile-to="profileTo"
      @toggle="toggleSettingsMenu"
      @close="closeSettingsMenu"
      @logout="logout"
    />
    <HeaderServiceProposalModal v-model="isServiceProposalModalOpen" />
    <HeaderTeamCreationModal v-model="isTeamCreationModalOpen" />
  </div>
</template>

<script setup lang="ts">
type HeaderUserActionsTheme = 'landing' | 'app'
type HeaderUserActionsSize = 'sm' | 'md' | 'lg'

const { theme = 'app', size = 'sm' } = defineProps<{ theme?: HeaderUserActionsTheme; size?: HeaderUserActionsSize }>()

const sessionStore = useSessionStore()
const route = useRoute()
const actionsElement = ref<HTMLElement | null>(null)
const isCreateMenuOpen = ref(false)
const isSettingsMenuOpen = ref(false)
const isNotificationsMenuOpen = ref(false)
const isServiceProposalModalOpen = ref(false)
const isTeamCreationModalOpen = ref(false)
const generatedId = useId()
const createTriggerId = `header-user-create-trigger-${generatedId}`
const createPanelId = `header-user-create-panel-${generatedId}`
const settingsTriggerId = `header-user-settings-trigger-${generatedId}`
const settingsPanelId = `header-user-settings-panel-${generatedId}`
const notificationsTriggerId = `header-user-notifications-trigger-${generatedId}`
const notificationsPanelId = `header-user-notifications-panel-${generatedId}`

const isLoggedIn = computed(() => sessionStore.isLoggedIn)
const profileLabel = computed(() => sessionStore.myUsername || 'Mon profil')
const profileTo = computed(() => {
  const slug = sessionStore.mySlug
  return slug ? `/players/${encodeURIComponent(slug)}` : '/app'
})
const profileAriaLabel = computed(() => sessionStore.myUsername ? `Profil de ${sessionStore.myUsername}` : 'Mon profil')
const avatarSrc = computed(() => sessionStore.myAvatar || '/images/logos/neeft/Logo_NEEFT_FOX.png')

const closeCreateMenu = () => { isCreateMenuOpen.value = false }
const closeSettingsMenu = () => { isSettingsMenuOpen.value = false }
const closeNotificationsMenu = () => { isNotificationsMenuOpen.value = false }
const closeMenus = () => {
  closeCreateMenu()
  closeSettingsMenu()
  closeNotificationsMenu()
}
const openCreateMenu = () => {
  closeSettingsMenu()
  closeNotificationsMenu()
  isCreateMenuOpen.value = true
}
const toggleCreateMenu = () => { isCreateMenuOpen.value ? closeCreateMenu() : openCreateMenu() }
const openSettingsMenu = () => {
  closeCreateMenu()
  closeNotificationsMenu()
  isSettingsMenuOpen.value = true
}
const toggleSettingsMenu = () => { isSettingsMenuOpen.value ? closeSettingsMenu() : openSettingsMenu() }
const openNotificationsMenu = () => {
  closeCreateMenu()
  closeSettingsMenu()
  isNotificationsMenuOpen.value = true
}
const toggleNotificationsMenu = () => { isNotificationsMenuOpen.value ? closeNotificationsMenu() : openNotificationsMenu() }
const openServiceProposalModal = () => {
  closeMenus()
  isServiceProposalModalOpen.value = true
}
const openTeamCreationModal = () => {
  closeMenus()
  isTeamCreationModalOpen.value = true
}
const focusRemainsInside = (event: FocusEvent) => event.relatedTarget instanceof Node && event.currentTarget instanceof HTMLElement && event.currentTarget.contains(event.relatedTarget)
const closeMenusOnFocusout = (event: FocusEvent) => { if (!focusRemainsInside(event)) closeMenus() }
const closeMenusOnOutsidePointer = (event: PointerEvent) => { if (event.target instanceof Node && actionsElement.value?.contains(event.target)) return; closeMenus() }
const logout = async () => {
  closeMenus()
  await sessionStore.logout()
  await navigateTo('/')
}

watch(() => route.fullPath, closeMenus)
onMounted(() => { document.addEventListener('pointerdown', closeMenusOnOutsidePointer) })
onBeforeUnmount(() => { document.removeEventListener('pointerdown', closeMenusOnOutsidePointer) })
</script>

<style scoped lang="scss">
.header-user-actions {
  --header-user-actions-gap-1: var(--space-1);
  --header-user-actions-gap-2: var(--space-2);
  --header-user-actions-radius: var(--app-header-radius, var(--radius));
  --header-user-actions-border: var(--app-header-border, var(--border));
  --header-user-actions-avatar-size: calc(var(--unit) * 3);
  --header-user-actions-profile-height: var(--app-header-hit-size);
  --header-user-actions-profile-padding: var(--space-1) var(--space-2);
  --header-user-actions-icon-size: var(--app-header-icon-size);
  --header-user-actions-icon-hit-size: var(--app-header-hit-size);
  --header-user-actions-font-size: var(--font-eyebrow);
  --header-user-actions-font-weight: var(--font-weight-semibold);
  --header-user-actions-line: var(--line-tight);
  --header-user-actions-color-text: var(--app-header-color-text, var(--color-text));
  --header-user-actions-color-muted: var(--app-header-color-muted, var(--color-muted));
  --header-user-actions-color-panel: var(--app-header-color-panel, var(--color-panel));
  --header-user-actions-color-hover: var(--app-header-color-panel-hover, var(--color-bg-soft-hover));
  --header-user-actions-color-line: var(--app-header-color-line, var(--color-line));
  --header-user-actions-color-focus: var(--app-header-color-focus, var(--color-accent-strong));
  --header-user-actions-color-transparent: var(--app-header-color-transparent, var(--color-transparent));
  --header-user-actions-zero: calc(var(--header-user-actions-border) * 0);
  position: relative;
  display: flex;
  gap: var(--header-user-actions-gap-1);
  align-items: center;
}

.header-user-actions[data-user-actions-theme='landing'] {
  --header-user-actions-gap-1: var(--space-1);
  --header-user-actions-gap-2: var(--space-2);
  --header-user-actions-radius: var(--radius);
  --header-user-actions-border: var(--border);
  --header-user-actions-avatar-size: calc(var(--unit) * 3);
  --header-user-actions-profile-height: var(--landing-header-hit-size);
  --header-user-actions-profile-padding: var(--space-1) var(--space-2);
  --header-user-actions-icon-size: calc(var(--unit) * 3.5);
  --header-user-actions-icon-hit-size: var(--landing-header-hit-size);
  --header-user-actions-font-size: var(--font-eyebrow);
  --header-user-actions-font-weight: var(--font-weight-semibold);
  --header-user-actions-line: var(--line-tight);
  --header-user-actions-color-text: var(--landing-color-header-strong);
  --header-user-actions-color-muted: var(--landing-color-header-muted);
  --header-user-actions-color-panel: color-mix(in oklch, var(--color-bg-soft) 90%, var(--color-bg));
  --header-user-actions-color-hover: color-mix(in oklch, var(--color-bg-soft-hover) 84%, var(--color-bg));
  --header-user-actions-color-line: var(--landing-color-footer-line);
  --header-user-actions-color-focus: var(--color-accent-strong);
  --header-user-actions-color-transparent: var(--color-transparent);
}

.header-user-actions[data-user-actions-size='md'] { --header-user-actions-avatar-size: calc(var(--unit) * 3.25); }
.header-user-actions[data-user-actions-size='lg'] { --header-user-actions-avatar-size: calc(var(--unit) * 3.5); }

.header-user-actions__quick-actions, .header-user-actions__profile { display: flex; align-items: center; }
.header-user-actions__quick-actions { gap: var(--header-user-actions-zero); }

.header-user-actions__divider {
  width: var(--header-user-actions-border);
  height: calc(var(--header-user-actions-profile-height) - (var(--header-user-actions-gap-2) * 2));
  background-color: var(--header-user-actions-color-line);
}

.header-user-actions__profile {
  gap: var(--header-user-actions-gap-1);
  min-height: var(--header-user-actions-profile-height);
  padding: var(--header-user-actions-profile-padding);
  border: var(--header-user-actions-zero);
  border-radius: var(--header-user-actions-radius);
  background-color: var(--header-user-actions-color-transparent);
  color: var(--header-user-actions-color-text);
  font-size: var(--header-user-actions-font-size);
  font-weight: var(--header-user-actions-font-weight);
  line-height: var(--header-user-actions-line);
  text-decoration: none;
}

.header-user-actions__profile:hover { background-color: var(--header-user-actions-color-hover); }

.header-user-actions__avatar {
  display: block;
  flex: 0 0 var(--header-user-actions-avatar-size);
  width: var(--header-user-actions-avatar-size);
  max-width: var(--header-user-actions-avatar-size);
  height: var(--header-user-actions-avatar-size);
  max-height: var(--header-user-actions-avatar-size);
  border: var(--header-user-actions-border) solid var(--header-user-actions-color-line);
  border-radius: var(--header-user-actions-radius);
  background-color: var(--header-user-actions-color-hover);
  object-fit: cover;
}

.header-user-actions__username { color: var(--header-user-actions-color-text); white-space: nowrap; }

.header-user-actions__profile:focus-visible {
  outline: calc(var(--header-user-actions-border) * 3) solid var(--header-user-actions-color-focus);
  outline-offset: calc(var(--header-user-actions-border) * 3);
}
</style>

<style lang="scss">
@use '~/assets/scss/mixins/header-user-menu' as *;

@include header-user-action-button;
@include header-user-menu-shell;
@include header-user-menu-base;
</style>
