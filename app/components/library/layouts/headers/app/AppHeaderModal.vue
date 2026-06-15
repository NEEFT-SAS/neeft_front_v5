<template>
  <section
    v-if="open"
    :id="id"
    ref="mobileElement"
    class="app-header-modal app-header-modal--mobile"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="mobileTitleId"
    tabindex="-1"
    @keydown.escape.stop="closeModal"
  >
    <div class="app-header-modal__content">
      <div class="app-header-modal__topbar">
        <h2 :id="mobileTitleId" class="app-header-modal__title">Menu</h2>
      </div>

      <nav class="app-header-modal__primary-nav" aria-label="Navigation principale">
        <NuxtLink
          v-for="item in mobileNavigationLinks"
          :key="item.to"
          class="app-header-modal__primary-link"
          :class="{ 'app-header-modal__primary-link--active': isLinkActive(item.to) }"
          :to="item.to"
          @click="closeModal"
        >
          <Icon class="app-header-modal__primary-icon" :name="item.icon || fallbackIcon" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </div>
  </section>

  <div ref="desktopElement" class="app-header-modal app-header-modal--desktop">
    <nav class="app-header-modal__desktop-nav" aria-label="Navigation app">
      <div
        v-for="menu in navigationMenus"
        :key="menu.key"
        class="app-header-modal__desktop-menu"
        @focusout="closeMenuOnFocusout"
      >
        <button
          :id="`${menu.key}-trigger`"
          class="app-header-modal__desktop-trigger"
          :class="{ 'app-header-modal__desktop-trigger--active': isMenuActive(menu) }"
          type="button"
          :aria-expanded="openNavigationMenu === menu.key"
          :aria-controls="`${menu.key}-panel`"
          @click="toggleNavigationMenu(menu.key)"
        >
          <span>{{ menu.label }}</span>
          <Icon class="app-header-modal__desktop-trigger-icon" name="lucide:chevron-down" aria-hidden="true" />
        </button>

        <div
          v-show="openNavigationMenu === menu.key"
          :id="`${menu.key}-panel`"
          class="app-header-modal__desktop-panel"
          :aria-labelledby="`${menu.key}-trigger`"
        >
          <NuxtLink
            v-for="item in menu.items"
            :key="item.to"
            class="app-header-modal__desktop-panel-link"
            :to="item.to"
            @click="closeAllMenus"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>

      <NuxtLink
        v-for="item in navigationLinks"
        :key="item.to"
        :to="item.to"
        @click="closeAllMenus"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>

    <AppHeaderSearch />

    <div class="app-header-modal__actions" aria-label="Actions">
      <CustomLink
        label="Télécharger"
        leftIcon="lucide:download"
        theme="app"
        variant="outlined"
        color="secondary"
        size="sm"
      />
      <HeaderLanguageSelector theme="app" align="end" @open="closeNavigationMenu" />
      <HeaderUserActions v-if="sessionStore.isLoggedIn" theme="app" size="md" />
      <template v-else>
        <CustomLink
          label="Se connecter"
          to="/login"
          theme="app"
          variant="outlined"
          color="secondary"
          size="sm"
          @click="closeAllMenus"
        />
        <CustomLink
          label="S'inscrire"
          to="/register"
          theme="app"
          variant="filled"
          color="secondary"
          size="sm"
          @click="closeAllMenus"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AppNavigationItem, AppNavigationMenu } from '~/composables/useConfig'

const props = defineProps<{
  id: string
  open: boolean
  navigationMenus: readonly AppNavigationMenu[]
  navigationLinks: readonly AppNavigationItem[]
}>()

const emit = defineEmits<{ close: [] }>()

const route = useRoute()
const sessionStore = useSessionStore()
const generatedId = useId()
const mobileTitleId = `app-header-modal-title-${generatedId}`
const mobileElement = ref<HTMLElement | null>(null)
const desktopElement = ref<HTMLElement | null>(null)
const openNavigationMenu = ref<string | null>(null)
const fallbackIcon = 'lucide:circle'

const mobileNavigationLinks = computed<AppNavigationItem[]>(() => [
  ...props.navigationMenus.flatMap(menu => menu.items),
  ...props.navigationLinks
])

const closeNavigationMenu = () => { openNavigationMenu.value = null }
const closeAllMenus = () => { closeNavigationMenu() }
const closeModal = () => { closeAllMenus(); emit('close') }

const toggleNavigationMenu = (menuKey: string) => {
  openNavigationMenu.value = openNavigationMenu.value === menuKey ? null : menuKey
}

const focusRemainsInside = (event: FocusEvent) => {
  const next = event.relatedTarget
  return next instanceof Node && event.currentTarget instanceof HTMLElement && event.currentTarget.contains(next)
}

const closeMenuOnFocusout = (event: FocusEvent) => {
  if (focusRemainsInside(event)) return
  closeNavigationMenu()
}

const containsPointerTarget = (event: PointerEvent) => {
  if (!(event.target instanceof Node)) return false
  return Boolean(mobileElement.value?.contains(event.target) || desktopElement.value?.contains(event.target))
}

const closeMenuOnOutsidePointer = (event: PointerEvent) => {
  if (containsPointerTarget(event)) return
  closeNavigationMenu()
}

const isLinkActive = (to: string) => {
  if (to === '/') return route.path === to
  return route.path === to || route.path.startsWith(`${to}/`)
}

const isMenuActive = (menu: AppNavigationMenu) => menu.items.some(item => isLinkActive(item.to))

onMounted(() => { document.addEventListener('pointerdown', closeMenuOnOutsidePointer) })
onBeforeUnmount(() => { document.removeEventListener('pointerdown', closeMenuOnOutsidePointer) })

watch(() => route.fullPath, closeAllMenus)

watch(() => props.open, async (isOpen) => {
  if (!isOpen) {
    closeAllMenus()
    return
  }
  await nextTick()
  mobileElement.value?.focus()
})
</script>

<style lang="scss">
.app-header-modal {
  color: var(--app-header-color-text);
  font-family: var(--font-ui, ui-sans-serif, system-ui, sans-serif);
  letter-spacing: 0;
}

.app-header-modal *,
.app-header-modal *::before,
.app-header-modal *::after {
  box-sizing: border-box;
  min-width: 0;
  letter-spacing: 0;
}

.app-header-modal--mobile {
  position: fixed;
  inset: var(--app-header-height) 0 0 0;
  z-index: calc(var(--app-header-layer) - 1);
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  background-color: var(--app-header-color-bg);
  outline: 0;
  overflow: hidden;
}

.app-header-modal__content {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: var(--app-header-gap);
  padding: var(--app-header-gap) var(--app-header-pad-inline);
  overflow: auto;
  overscroll-behavior: contain;
}

.app-header-modal__topbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--app-header-gap);
  min-height: var(--app-header-hit-size);
}

.app-header-modal__title {
  margin: 0;
  color: var(--app-header-color-text);
  font-size: 1.125rem;
  font-weight: 600;
}

.app-header-modal__primary-nav {
  display: grid;
  gap: 0.25rem;
}

.app-header-modal__primary-link {
  display: grid;
  grid-template-columns: var(--app-header-hit-size) minmax(0, 1fr);
  align-items: center;
  gap: 0.25rem;
  min-height: var(--app-header-hit-size);
  border-radius: var(--app-header-radius);
  color: var(--app-header-color-muted);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.15s, color 0.15s;
}

.app-header-modal__primary-link:hover,
.app-header-modal__primary-link--active {
  background-color: var(--app-header-color-panel-hover);
  color: var(--app-header-color-text);
}

.app-header-modal__primary-icon {
  width: var(--app-header-icon-size);
  height: var(--app-header-icon-size);
  justify-self: center;
}

.app-header-modal--desktop {
  display: none;
}

.app-header-modal__desktop-menu {
  position: relative;
}

.app-header-modal__desktop-nav a,
.app-header-modal__desktop-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--app-header-hit-size);
  color: var(--app-header-color-muted);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
}

.app-header-modal__desktop-trigger {
  gap: 0.25rem;
  padding: 0;
  border: 0;
  border-radius: var(--app-header-radius);
  background-color: var(--app-header-color-transparent);
  cursor: pointer;
}

.app-header-modal__desktop-nav a:hover,
.app-header-modal__desktop-nav a.router-link-active,
.app-header-modal__desktop-trigger:hover,
.app-header-modal__desktop-trigger--active {
  color: var(--app-header-color-text);
}

.app-header-modal__desktop-trigger-icon {
  width: var(--app-header-icon-size);
  height: var(--app-header-icon-size);
}

.app-header-modal__desktop-panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  z-index: var(--app-header-layer);
  display: grid;
  width: max-content;
  min-width: 14rem;
  max-width: calc(100vw - (var(--app-header-pad-inline) * 2));
  padding: 0.25rem;
  border: var(--app-header-border) solid var(--app-header-color-line);
  border-radius: var(--app-header-radius);
  background-color: var(--app-header-color-panel);
}

.app-header-modal__desktop-panel-link {
  min-height: var(--app-header-hit-size);
  padding: 0 0.5rem;
  border-radius: var(--app-header-radius);
}

.app-header-modal__desktop-panel-link:hover,
.app-header-modal__desktop-panel-link.router-link-active {
  background-color: var(--app-header-color-panel-hover);
}

@media (min-width: 72rem) {
  .app-header-modal--mobile { display: none; }

  .app-header-modal--desktop {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, var(--app-header-search-width)) auto;
    gap: var(--app-header-gap);
    align-items: center;
  }

  .app-header-modal__desktop-nav,
  .app-header-modal__actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .app-header-modal__desktop-nav {
    gap: 0.5rem;
  }

  .app-header-modal__actions {
    gap: 0.25rem;
    justify-content: end;
    justify-self: end;
  }
}
</style>
