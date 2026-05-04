<template>
  <header class="landing-header" :class="{ 'landing-header--pinned': isPinned, 'landing-header--open': isMobileMenuOpen }" data-theme="landing" @keydown.escape="closeMobileMenu">
    <LandingHeaderBrand />
    <button class="landing-header__menu-button" type="button" :aria-label="'Menu'" :aria-expanded="isMobileMenuOpen" :aria-controls="mobileMenuId" @click="toggleMobileMenu">
      <Icon :name="isMobileMenuOpen ? 'lucide:x' : 'lucide:menu'" aria-hidden="true" />
    </button>
    <div :id="mobileMenuId" class="landing-header__menu" :data-menu-open="isMobileMenuOpen">
      <LandingHeaderNav :items="navItems" aria-label="Navigation principale" @close-mobile-menu="closeMobileMenu" />
      <div class="landing-header__actions">
        <HeaderLanguageSelector theme="landing" align="end" />
        <LandingHeaderActions :items="actionItems" @close-mobile-menu="closeMobileMenu" />
        <HeaderUserActions theme="landing" size="lg" />
      </div>
    </div>
    <LandingHeaderModal :id="mobileMenuId" :open="isMobileMenuOpen" @close="closeMobileMenu" />
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const isPinned = ref(false)
const isMobileMenuOpen = ref(false)
const mobileMenuId = `landing-header-menu-${useId()}`
let scrollFrame = 0

defineProps({
  navItems: { type: Array as () => Array<{ to: string; label: string; active?: boolean }>, required: true },
  actionItems: { type: Array as () => Array<{ to: string; label: string; variant?: 'default' | 'primary' }>, required: true }
})

const updatePinnedState = () => { isPinned.value = window.scrollY > 0 }

const requestPinnedStateUpdate = () => {
  if (scrollFrame) return
  scrollFrame = window.requestAnimationFrame(() => { scrollFrame = 0; updatePinnedState() })
}

const closeMobileMenu = () => { isMobileMenuOpen.value = false }
const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value }

onMounted(() => {
  updatePinnedState()
  window.addEventListener('scroll', requestPinnedStateUpdate, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', requestPinnedStateUpdate)
  document.documentElement.style.removeProperty('overflow')
  if (scrollFrame) window.cancelAnimationFrame(scrollFrame)
})

watch(() => route.fullPath, closeMobileMenu)

watch(isMobileMenuOpen, (isOpen) => {
  if (typeof document === 'undefined') return
  if (isOpen) {
    document.documentElement.style.setProperty('overflow', 'hidden')
    return
  }
  document.documentElement.style.removeProperty('overflow')
})
</script>

<style scoped lang="scss">
@use '~/assets/scss/mixins/breakpoints' as *;

.landing-header {
  --landing-header-space-inline: clamp(var(--space-2), calc(var(--space-1) + 3vw), var(--space-5));
  --landing-header-size-brand-mark: calc(var(--landing-header-brand-size) * 0.75);
  --landing-header-menu-offset-block: var(--landing-header-height);
  --landing-header-menu-height: calc(100svh - var(--landing-header-menu-offset-block));
  --landing-header-color-panel: color-mix(in oklch, var(--landing-color-header-bg) 92%, var(--color-bg));
  --landing-header-color-menu-panel: color-mix(in oklch, var(--color-bg) 92%, var(--color-surface));
  --landing-header-color-hover: color-mix(in oklch, var(--landing-color-header-line) 16%, var(--color-transparent));
  --landing-header-color-pinned-bg: var(--landing-color-header-bg);
  z-index: var(--landing-header-layer);
  grid-template-columns: minmax(0, auto) var(--landing-header-hit-size);
  gap: var(--space-3);
  height: var(--landing-header-height);
  padding: 0 var(--landing-header-space-inline);
  color: var(--landing-color-header-text);
  font-family: var(--font-ui, ui-sans-serif, system-ui, sans-serif);
  position: fixed;
  inset: 0 0 auto;
  transition-duration: var(--motion-fast);
  display: grid;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
}

.landing-header *, .landing-header *::before, .landing-header *::after { letter-spacing: 0; min-width: 0; box-sizing: border-box; }

.landing-header--pinned, .landing-header--open { background-color: var(--landing-header-color-pinned-bg); backdrop-filter: blur(var(--landing-blur-header)); }

.landing-header__menu-button {
  width: var(--landing-header-hit-size);
  padding: 0;
  border: var(--border) solid var(--color-transparent);
  border-radius: var(--radius);
  background-color: var(--color-transparent);
  justify-self: end;
  cursor: pointer;
  transition-duration: var(--motion-fast);
  height: var(--landing-header-hit-size);
  color: var(--landing-color-header-text);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.landing-header__menu-button:hover { background-color: var(--landing-header-color-hover); color: var(--landing-color-header-strong); }

.landing-header__menu-button svg { width: calc(var(--unit) * 3.5); height: calc(var(--unit) * 3.5); }

.landing-header__menu {
  position: fixed;
  inset: var(--landing-header-menu-offset-block) 0 auto 0;
  z-index: calc(var(--landing-header-layer) - 1);
  grid-template-rows: auto auto;
  gap: var(--space-4);
  height: var(--landing-header-menu-height);
  min-height: var(--landing-header-menu-height);
  max-height: var(--landing-header-menu-height);
  padding: var(--space-4) var(--landing-header-space-inline);
  border-top: var(--border) solid var(--color-transparent);
  background-color: var(--landing-header-color-menu-panel);
  overflow: auto;
  overscroll-behavior: contain;
  opacity: 0;
  pointer-events: none;
  transform: translateY(calc(var(--space-2) * -1));
  visibility: hidden;
  transition: opacity var(--motion-fast), transform var(--motion-fast), visibility var(--motion-fast);
  display: grid;
  align-items: center;
}

.landing-header__menu[data-menu-open='true'] { opacity: 1; pointer-events: auto; transform: translateY(0); visibility: visible; }

.landing-header__actions {
  gap: var(--space-2);
  padding-top: var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
}

.landing-header a:focus-visible, .landing-header__menu-button:focus-visible {
  outline: calc(var(--header-border) * 3) solid var(--header-color-focus);
  outline-offset: calc(var(--header-border) * 4);
}

@include breakpoint-lg {
  .landing-header {
    --landing-header-size-brand-mark: var(--landing-header-brand-size);
    grid-template-columns: minmax(0, auto) minmax(0, 1fr);
  }
  .landing-header__menu-button { display: none; }
  .landing-header__menu, .landing-header__menu[data-menu-open='true'] {
    position: static;
    inset: auto;
    grid-column: auto;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-rows: auto;
    gap: var(--space-3);
    height: auto;
    min-height: 0;
    max-height: none;
    padding: 0;
    border-top: 0;
    background-color: var(--color-transparent);
    overflow: visible;
    opacity: 1;
    pointer-events: auto;
    transform: none;
    visibility: visible;
  }
  .landing-header__actions {
    padding-top: 0;
    border-top: 0;
    flex-direction: row;
  }
}
</style>
