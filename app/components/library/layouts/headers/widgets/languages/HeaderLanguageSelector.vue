<template>
  <div ref="selectorElement" class="header-language-selector" :class="[`header-language-selector--${theme}`, `header-language-selector--align-${align}`]" @focusout="closeMenuOnFocusout" @keydown.escape.stop="closeMenu">
    <div class="header-language-selector__flags">
      <button v-for="language in appLanguages" :key="language.code" class="header-language-selector__flag-button" type="button" :lang="language.language" :aria-label="language.label" :aria-current="isCurrentLanguage(language.code) ? 'true' : undefined" @click="selectLanguage(language.code)">
        <span class="header-language-selector__flag" :data-code="language.code" aria-hidden="true">{{ language.flag }}</span>
      </button>
    </div>
    <button :id="triggerId" class="header-language-selector__trigger" type="button" :aria-label="languageButtonLabel" :aria-expanded="isOpen" :aria-controls="panelId" @click="toggleMenu">
      <Icon name="lucide:globe" aria-hidden="true" />
    </button>
    <HeaderPopup :id="panelId" :open="isOpen" :theme="theme" :align="align" :labelledby-id="triggerId">
      <button v-for="language in appLanguages" :key="language.code" class="header-language-selector-popup__option" :class="{ 'header-language-selector-popup__option--active': isCurrentLanguage(language.code) }" type="button" role="menuitem" :lang="language.language" :aria-pressed="isCurrentLanguage(language.code)" :aria-current="isCurrentLanguage(language.code) ? 'true' : undefined" @click="selectLanguage(language.code)">
        <span class="header-language-selector-popup__label">{{ language.label }}</span>
        <Icon v-if="isCurrentLanguage(language.code)" class="header-language-selector-popup__check" name="lucide:check" aria-hidden="true" />
      </button>
    </HeaderPopup>
  </div>
</template>

<script setup lang="ts">
type HeaderLanguageSelectorTheme = 'app' | 'landing'
type HeaderLanguageSelectorAlign = 'start' | 'end'

const { theme = 'app', align = 'end' } = defineProps<{ theme?: HeaderLanguageSelectorTheme; align?: HeaderLanguageSelectorAlign }>()

const { locale, setLocale } = useI18n()
const selectorElement = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const generatedId = useId()
const panelId = `header-language-selector-panel-${generatedId}`
const appLanguages = [
  { code: 'fr', label: 'Français', language: 'fr', flag: '🇫🇷' },
  { code: 'en', label: 'English', language: 'en', flag: '🇬🇧' }
]

const currentLanguage = computed(() => appLanguages.find(language => language.code === locale.value) ?? appLanguages[0])
const languageButtonLabel = computed(() => `Changer de langue. Langue actuelle: ${currentLanguage.value?.label ?? locale.value}`)

const closeMenu = () => { isOpen.value = false }
const openMenu = () => { isOpen.value = true }
const toggleMenu = () => { isOpen.value ? closeMenu() : openMenu() }
const isCurrentLanguage = (languageCode: string) => locale.value === languageCode
const selectLanguage = async (languageCode: string) => {
  if (isCurrentLanguage(languageCode)) { closeMenu(); return }
  try { await setLocale(languageCode) } finally { closeMenu() }
}
const focusRemainsInside = (event: FocusEvent) => event.relatedTarget instanceof Node && event.currentTarget instanceof HTMLElement && event.currentTarget.contains(event.relatedTarget)
const closeMenuOnFocusout = (event: FocusEvent) => { if (!focusRemainsInside(event)) closeMenu() }
const closeMenuOnOutsidePointer = (event: PointerEvent) => { if (event.target instanceof Node && selectorElement.value?.contains(event.target)) return; closeMenu() }

onMounted(() => { document.addEventListener('pointerdown', closeMenuOnOutsidePointer) })
onBeforeUnmount(() => { document.removeEventListener('pointerdown', closeMenuOnOutsidePointer) })
</script>

<style scoped lang="scss">
@use '~/assets/scss/mixins/breakpoints' as *;

.header-language-selector {
  position: relative;
  color: var(--app-color-muted);
  font: inherit;
  font-size: var(--app-font-sm);
  font-weight: var(--app-font-weight-semibold);
  line-height: var(--app-line-tight);
  display: inline-flex;
  align-items: center;
}

.header-language-selector--landing {
  color: var(--landing-color-header-muted);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
  align-self: center;
}

.header-language-selector *, .header-language-selector *::before, .header-language-selector *::after { letter-spacing: 0; min-width: 0; box-sizing: border-box; }

.header-language-selector__flags {
  display: flex;
  gap: var(--app-space-1);
  align-items: center;
}

.header-language-selector--landing .header-language-selector__flags {
  gap: var(--space-1);
}

.header-language-selector__flag-button {
  min-height: var(--app-header-hit-size);
  border: 0;
  border-radius: var(--app-radius);
  background-color: var(--app-color-transparent);
  color: var(--app-color-muted);
  font: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 var(--app-space-1);
}

.header-language-selector--landing .header-language-selector__flag-button {
  min-height: var(--landing-header-hit-size);
  border-radius: var(--radius);
  color: var(--landing-color-header-muted);
  padding: 0 var(--space-1);
}

.header-language-selector__flag-button:hover { background-color: var(--app-color-panel-hover); color: var(--app-color-text); }
.header-language-selector--landing .header-language-selector__flag-button:hover { background-color: var(--color-bg-soft-hover); color: var(--landing-color-header-strong); }
.header-language-selector__flag-button[aria-current='true'] { color: var(--app-color-text); font-weight: var(--app-font-weight-semibold); }
.header-language-selector--landing .header-language-selector__flag-button[aria-current='true'] { color: var(--landing-color-header-strong); font-weight: var(--font-weight-semibold); }

.header-language-selector__flag {
  font-size: var(--app-font-sm);
  font-weight: var(--app-font-weight-semibold);
  line-height: var(--app-line-tight);
}

.header-language-selector--landing .header-language-selector__flag {
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
}

.header-language-selector__trigger {
  width: var(--app-header-hit-size);
  height: var(--app-header-hit-size);
  padding: 0;
  border: 0;
  border-radius: var(--app-radius);
  background-color: var(--app-color-transparent);
  color: var(--app-color-muted);
  font: inherit;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
}

.header-language-selector--landing .header-language-selector__trigger {
  width: var(--landing-header-hit-size);
  height: var(--landing-header-hit-size);
  border-radius: var(--radius);
  color: var(--landing-color-header-muted);
}

.header-language-selector__trigger:hover { background-color: var(--app-color-panel-hover); color: var(--app-color-text); }
.header-language-selector--landing .header-language-selector__trigger:hover { background-color: var(--color-bg-soft-hover); color: var(--landing-color-header-strong); }

.header-language-selector__trigger svg { width: var(--app-header-icon-size); height: var(--app-header-icon-size); }
.header-language-selector--landing .header-language-selector__trigger svg { width: calc(var(--unit) * 3.5); height: calc(var(--unit) * 3.5); }

.header-language-selector-popup__option {
  grid-template-columns: 1fr auto;
}

.header-language-selector-popup__label {
  overflow-wrap: anywhere;
}

.header-language-selector-popup__check {
  width: var(--app-header-icon-size);
  height: var(--app-header-icon-size);
  color: var(--app-color-accent);
}

.header-language-selector--landing .header-language-selector-popup__check {
  width: calc(var(--unit) * 3.5);
  height: calc(var(--unit) * 3.5);
  color: var(--color-accent);
}

.header-language-selector__flag-button:focus-visible, .header-language-selector__trigger:focus-visible {
  outline: calc(var(--app-border) * 3) solid var(--app-color-focus);
  outline-offset: calc(var(--app-border) * 3);
}

.header-language-selector--landing .header-language-selector__flag-button:focus-visible, .header-language-selector--landing .header-language-selector__trigger:focus-visible {
  outline: calc(var(--border) * 3) solid var(--color-accent-strong);
  outline-offset: calc(var(--border) * 3);
}

@include breakpoint-lg {
  .header-language-selector__flags { display: none; }
  .header-language-selector__trigger { display: inline-flex; }
}
</style>
