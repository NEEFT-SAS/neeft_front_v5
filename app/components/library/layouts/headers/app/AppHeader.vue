<template>
  <header
    ref="headerElement"
    class="app-header"
    :class="{ 'app-header--menu-open': isResponsiveMenuOpen }"
    @keydown.escape="closeResponsiveMenu"
  >
    <NuxtLink class="app-header__brand" to="/" aria-label="Accueil NEEFT" @click="closeResponsiveMenu">
      <img src="/images/logos/neeft/Logo_NEEFT_FOX.png" alt="" decoding="async">
    </NuxtLink>

    <button
      class="app-header__menu-button"
      type="button"
      :aria-label="responsiveMenuLabel"
      aria-haspopup="dialog"
      :aria-expanded="isResponsiveMenuOpen"
      :aria-controls="responsiveMenuId"
      @click="toggleResponsiveMenu"
    >
      <Icon :name="isResponsiveMenuOpen ? 'lucide:x' : 'lucide:menu'" aria-hidden="true" />
    </button>

    <AppHeaderModal
      :id="responsiveMenuId"
      :open="isResponsiveMenuOpen"
      :navigation-menus="navigationMenus"
      :navigation-links="navigationLinks"
      @close="closeResponsiveMenu"
    />
  </header>
</template>

<script setup lang="ts">
type NavigationItem = { label: string; to: string; icon?: string }
type NavigationMenu = { key: string; label: string; icon: string; items: NavigationItem[] }

const route = useRoute()
const headerElement = ref<HTMLElement | null>(null)
const isResponsiveMenuOpen = ref(false)
const responsiveMenuId = `app-header-menu-${useId()}`
const responsiveMenuLabel = computed(() => isResponsiveMenuOpen.value ? 'Fermer la navigation' : 'Ouvrir la navigation')

const navigationMenus: NavigationMenu[] = [
  {
    key: 'directories',
    label: 'Rechercher',
    icon: 'lucide:search',
    items: [
      { label: 'Rechercher un joueur', to: '/search/players', icon: 'lucide:gamepad-2' },
      { label: 'Rechercher une equipe', to: '/search/teams', icon: 'lucide:users-round' },
      { label: 'Rechercher un staff', to: '/search/staffs', icon: 'lucide:user-round-cog' }
    ]
  }
]

const navigationLinks: NavigationItem[] = [
  { label: 'Marketplace', to: '/marketplace', icon: 'lucide:store' },
  { label: 'Feed', to: '/feed', icon: 'lucide:newspaper' },
  { label: 'Offres de recrutement', to: '/recruitment', icon: 'lucide:briefcase-business' }
]

const closeResponsiveMenu = () => { isResponsiveMenuOpen.value = false }
const toggleResponsiveMenu = () => { isResponsiveMenuOpen.value = !isResponsiveMenuOpen.value }

const closeMenuOnOutsidePointer = (event: PointerEvent) => {
  if (event.target instanceof Node && headerElement.value?.contains(event.target)) return
  closeResponsiveMenu()
}

onMounted(() => { document.addEventListener('pointerdown', closeMenuOnOutsidePointer) })

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', closeMenuOnOutsidePointer)
  if (typeof document !== 'undefined') document.documentElement.style.removeProperty('overflow')
})

watch(() => route.fullPath, closeResponsiveMenu)

watch(isResponsiveMenuOpen, (isOpen) => {
  if (typeof document === 'undefined') return
  if (isOpen) {
    document.documentElement.style.setProperty('overflow', 'hidden')
    return
  }
  document.documentElement.style.removeProperty('overflow')
})
</script>

<style lang="scss">
.app-header {
  --app-header-height: 3.5rem;
  --app-header-hit-size: 2.5rem;
  --app-header-logo-size: 2rem;
  --app-header-icon-size: 1.25rem;
  --app-header-search-width: 24rem;
  --app-header-gap: 0.75rem;
  --app-header-pad-inline: clamp(0.5rem, 2vw, 1.5rem);
  --app-header-radius: 0.5rem;
  --app-header-border: 0.0625rem;
  --app-header-layer: 40;
  --app-header-color-bg: oklch(15% 0.018 255);
  --app-header-color-panel: oklch(24% 0.03 260);
  --app-header-color-panel-strong: oklch(18% 0.022 255);
  --app-header-color-panel-hover: oklch(22% 0.025 260);
  --app-header-color-text: oklch(98% 0.004 255);
  --app-header-color-muted: oklch(73% 0.045 260);
  --app-header-color-subtle: oklch(62% 0.04 260);
  --app-header-color-accent: oklch(70% 0.19 43);
  --app-header-color-line: oklch(98% 0.004 255 / 0.08);
  --app-header-color-focus: oklch(76% 0.17 58);
  --app-header-color-transparent: oklch(0% 0 0 / 0);
  position: sticky;
  top: 0;
  z-index: var(--app-header-layer);
  display: grid;
  grid-template-columns: minmax(0, auto) var(--app-header-hit-size);
  align-items: center;
  width: 100%;
  gap: var(--app-header-gap);
  min-height: var(--app-header-height);
  padding: 0 var(--app-header-pad-inline);
  border-bottom: var(--app-header-border) solid var(--app-header-color-line);
  background-color: var(--app-header-color-bg);
  color: var(--app-header-color-text);
  font-family: var(--font-ui, ui-sans-serif, system-ui, sans-serif);
  letter-spacing: 0;
}

.app-header--menu-open {
  border-bottom-color: var(--app-header-color-transparent);
}

.app-header *,
.app-header *::before,
.app-header *::after {
  box-sizing: border-box;
  min-width: 0;
  letter-spacing: 0;
}

.app-header__brand,
.app-header__menu-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--app-header-hit-size);
  min-height: var(--app-header-hit-size);
  color: var(--app-header-color-muted);
  font: inherit;
  text-decoration: none;
}

.app-header__brand {
  color: var(--app-header-color-accent);
}

.app-header__brand img {
  width: var(--app-header-logo-size);
  height: var(--app-header-logo-size);
  object-fit: contain;
}

.app-header__menu-button {
  padding: 0;
  border: 0;
  border-radius: var(--app-header-radius);
  background-color: var(--app-header-color-transparent);
  justify-self: end;
  cursor: pointer;
}

.app-header__menu-button:hover {
  background-color: var(--app-header-color-panel-hover);
  color: var(--app-header-color-text);
}

.app-header__menu-button svg {
  width: var(--app-header-icon-size);
  height: var(--app-header-icon-size);
}

.app-header a:focus-visible,
.app-header button:focus-visible {
  outline: calc(var(--app-header-border) * 3) solid var(--app-header-color-focus);
  outline-offset: calc(var(--app-header-border) * 3);
}

@media (min-width: 72rem) {
  .app-header {
    grid-template-columns: minmax(0, auto) minmax(0, 1fr);
  }

  .app-header__menu-button {
    display: none;
  }
}
</style>
