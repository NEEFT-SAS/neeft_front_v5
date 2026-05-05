<template>
  <div
    v-show="open"
    :id="id"
    class="header-popup"
    :class="[`header-popup--${theme}`, `header-popup--align-${align}`]"
    role="menu"
    :aria-labelledby="labelledbyId"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
type HeaderPopupTheme = 'app' | 'landing'
type HeaderPopupAlign = 'start' | 'end'

const { theme = 'app', align = 'end' } = defineProps<{
  id: string
  open: boolean
  theme?: HeaderPopupTheme
  align?: HeaderPopupAlign
  labelledbyId?: string
}>()
</script>

<style scoped lang="scss">
@use '~/assets/scss/mixins/breakpoints' as *;

.header-popup {
  --header-popup-menu-width: calc(var(--app-unit) * 31);
  position: absolute;
  inset-block-start: calc(100% + var(--app-space-1));
  inset-inline-end: 0;
  z-index: var(--app-layer-header);
  display: grid;
  width: min(var(--header-popup-menu-width), calc(100vw - (var(--app-space-2) * 2)));
  max-height: calc(100dvh - var(--app-header-height) - (var(--app-space-2) * 2));
  overflow-y: auto;
  padding: var(--app-space-1);
  border: var(--app-border) solid color-mix(in oklch, var(--app-color-line) 82%, var(--app-color-transparent));
  border-radius: var(--app-radius);
  background-color: color-mix(in oklch, var(--app-color-panel) 86%, var(--app-color-bg));
  box-shadow: 0 var(--app-space-2) var(--app-space-3) color-mix(in oklch, var(--app-color-shadow) 64%, var(--app-color-transparent));
  color: var(--app-color-text);
}

.header-popup--landing {
  --header-popup-menu-width: calc(var(--unit) * 31);
  inset-block-start: calc(100% + var(--space-1));
  inset-inline-end: 0;
  z-index: var(--layer-header);
  width: min(var(--header-popup-menu-width), calc(100vw - (var(--space-2) * 2)));
  max-height: calc(100dvh - var(--landing-header-height) - (var(--space-2) * 2));
  padding: var(--space-1);
  border: var(--border) solid var(--landing-color-footer-line);
  border-radius: var(--radius);
  background-color: color-mix(in oklch, var(--color-bg-soft) 90%, var(--color-bg));
  box-shadow: 0 var(--space-2) var(--space-3) color-mix(in oklch, var(--color-shadow) 64%, var(--color-transparent));
  color: var(--landing-color-header-strong);
}

.header-popup--align-start {
  inset-inline-start: 0;
  inset-inline-end: auto;
}

.header-popup--align-end {
  inset-inline-end: 0;
  inset-inline-start: auto;
}

.header-popup a,
.header-popup button {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--app-space-2);
  width: 100%;
  min-height: var(--app-header-hit-size);
  align-items: center;
  padding: 0 var(--app-space-1);
  border: 0;
  border-radius: var(--app-radius);
  background-color: var(--app-color-transparent);
  color: color-mix(in oklch, var(--app-color-muted) 86%, var(--app-color-text));
  cursor: pointer;
  font: inherit;
  font-size: var(--app-font-sm);
  font-weight: var(--app-font-weight-semibold);
  line-height: var(--app-line-tight);
  text-align: start;
  text-decoration: none;
}

.header-popup--landing a,
.header-popup--landing button {
  gap: var(--space-2);
  min-height: var(--landing-header-hit-size);
  padding: 0 var(--space-1);
  border-radius: var(--radius);
  color: var(--landing-color-header-muted);
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
}

.header-popup a:hover,
.header-popup button:hover {
  background-color: color-mix(in oklch, var(--app-color-panel-hover) 76%, var(--app-color-bg));
  color: var(--app-color-text);
}

.header-popup--landing a:hover,
.header-popup--landing button:hover {
  background-color: color-mix(in oklch, var(--color-bg-soft-hover) 84%, var(--color-bg));
  color: var(--landing-color-header-strong);
}

.header-popup a:focus-visible,
.header-popup button:focus-visible {
  outline: calc(var(--app-border) * 3) solid var(--app-color-focus);
  outline-offset: calc(var(--app-border) * 3);
}

.header-popup--landing a:focus-visible,
.header-popup--landing button:focus-visible {
  outline: calc(var(--border) * 3) solid var(--color-accent-strong);
  outline-offset: calc(var(--border) * 3);
}

.header-popup a svg,
.header-popup button svg {
  width: var(--app-header-icon-size);
  height: var(--app-header-icon-size);
}

.header-popup--landing a svg,
.header-popup--landing button svg {
  width: calc(var(--unit) * 3.5);
  height: calc(var(--unit) * 3.5);
}
</style>
