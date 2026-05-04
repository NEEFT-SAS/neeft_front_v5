<template>
  <header class="app-header" :class="{ 'app-header--menu-open': isResponsiveMenuOpen }" @keydown.escape="closeResponsiveMenu">
    <AppHeaderBrand @click="closeResponsiveMenu" />
    <button class="app-header__menu-button" type="button" :aria-label="isResponsiveMenuOpen ? 'Fermer la navigation' : 'Ouvrir la navigation'" aria-haspopup="dialog" :aria-expanded="isResponsiveMenuOpen" :aria-controls="responsiveMenuId" @click="toggleResponsiveMenu">
      <Icon :name="isResponsiveMenuOpen ? 'lucide:x' : 'lucide:menu'" aria-hidden="true" />
    </button>
    <div class="app-header__extras">
      <HeaderLanguageSelector theme="app" align="end" />
      <HeaderUserActions theme="app" size="sm" />
    </div>
    <AppHeaderModal :id="responsiveMenuId" :open="isResponsiveMenuOpen" @close="closeResponsiveMenu" />
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const isResponsiveMenuOpen = ref(false)
const responsiveMenuId = `app-header-menu-${useId()}`

const closeResponsiveMenu = () => { isResponsiveMenuOpen.value = false }
const toggleResponsiveMenu = () => { isResponsiveMenuOpen.value = !isResponsiveMenuOpen.value }

const closeMenuOnOutsidePointer = (event: PointerEvent) => {
  const headerElement = document.querySelector('.app-header')
  if (event.target instanceof Node && headerElement?.contains(event.target)) return
  closeResponsiveMenu()
}

onMounted(() => { document.addEventListener('pointerdown', closeMenuOnOutsidePointer) })

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', closeMenuOnOutsidePointer)
  document.documentElement.style.removeProperty('overflow')
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

<style scoped lang="scss">
@use '~/assets/scss/mixins/breakpoints' as *;

.app-header {
  z-index: var(--app-layer-header);
  grid-template-columns: minmax(0, auto) var(--app-header-hit-size);
  gap: var(--app-space-3);
  min-height: var(--app-header-height);
  padding: 0 var(--app-space-fluid);
  border-bottom: var(--app-border) solid var(--app-color-line);
  background-color: var(--app-color-bg);
  color: var(--app-color-text);
  font-family: var(--font-ui, ui-sans-serif, system-ui, sans-serif);
  position: sticky;
  top: 0;
  display: grid;
  width: 100%;
  align-items: center;
  box-sizing: border-box;
}

.app-header *, .app-header *::before, .app-header *::after { letter-spacing: 0; min-width: 0; box-sizing: border-box; }

.app-header--menu-open { border-bottom-color: var(--app-color-transparent); }

.app-header__menu-button {
  width: var(--app-header-hit-size);
  min-height: var(--app-header-hit-size);
  padding: 0;
  border: 0;
  border-radius: var(--app-radius);
  background-color: var(--app-color-transparent);
  color: var(--app-color-muted);
  font: inherit;
  justify-self: end;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.app-header__menu-button:hover {
  background-color: var(--app-color-panel-hover);
  color: var(--app-color-text);
}

.app-header__menu-button svg {
  width: var(--app-header-icon-size);
  height: var(--app-header-icon-size);
}

@include breakpoint-lg {
  .app-header { grid-template-columns: minmax(0, auto) minmax(0, 1fr) auto; }
  .app-header__menu-button { display: none; }
}

.app-header__extras {
  display: flex;
  gap: var(--app-space-2);
  align-items: center;
  justify-content: end;
}

@include breakpoint-lg {
  .app-header__extras { display: flex; }
}
</style>
