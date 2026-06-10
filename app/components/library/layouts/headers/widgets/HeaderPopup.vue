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
  --header-popup-menu-width: max-content;
  --header-popup-space-1: var(--space-1);
  --header-popup-space-2: var(--space-2);
  --header-popup-space-3: var(--space-3);
  --header-popup-border: var(--app-header-border, var(--border));
  --header-popup-radius: var(--app-header-radius, var(--radius));
  --header-popup-layer: var(--app-header-layer, var(--layer-popover));
  --header-popup-height: var(--app-header-height);
  --header-popup-hit-size: var(--app-header-hit-size);
  --header-popup-icon-size: var(--app-header-icon-size);
  --header-popup-color-bg: var(--app-header-color-bg, var(--color-bg));
  --header-popup-color-panel: var(--app-header-color-panel, var(--color-panel));
  --header-popup-color-hover: var(--app-header-color-panel-hover, var(--color-bg-soft-hover));
  --header-popup-color-line: var(--app-header-color-line, var(--color-line));
  --header-popup-color-text: var(--app-header-color-text, var(--color-text));
  --header-popup-color-muted: var(--app-header-color-muted, var(--color-muted));
  --header-popup-color-focus: var(--app-header-color-focus, var(--color-accent-strong));
  --header-popup-color-transparent: var(--app-header-color-transparent, var(--color-transparent));
  position: absolute;
  inset-block-start: calc(100% + var(--header-popup-space-1));
  inset-inline-end: 0;
  z-index: var(--header-popup-layer);
  display: grid;
  width: var(--header-popup-menu-width);
  max-width: calc(100vw - (var(--header-popup-space-2) * 2));
  max-height: calc(100dvh - var(--header-popup-height) - (var(--header-popup-space-2) * 2));
  overflow-y: auto;
  padding: var(--header-popup-space-1);
  border: var(--header-popup-border) solid color-mix(in oklch, var(--header-popup-color-line) 82%, var(--header-popup-color-transparent));
  border-radius: var(--header-popup-radius);
  background-color: color-mix(in oklch, var(--header-popup-color-panel) 86%, var(--header-popup-color-bg));
  box-shadow: 0 var(--header-popup-space-2) var(--header-popup-space-3) color-mix(in oklch, var(--color-shadow) 64%, var(--header-popup-color-transparent));
  color: var(--header-popup-color-text);
}

.header-popup--landing {
  --header-popup-menu-width: max-content;
  inset-block-start: calc(100% + var(--space-1));
  inset-inline-end: 0;
  z-index: var(--layer-header);
  width: var(--header-popup-menu-width);
  max-width: calc(100vw - (var(--space-2) * 2));
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
  gap: var(--header-popup-space-2);
  width: 100%;
  min-height: var(--header-popup-hit-size);
  align-items: center;
  padding: 0 var(--header-popup-space-1);
  border: 0;
  border-radius: var(--header-popup-radius);
  background-color: var(--header-popup-color-transparent);
  color: color-mix(in oklch, var(--header-popup-color-muted) 86%, var(--header-popup-color-text));
  cursor: pointer;
  font: inherit;
  font-size: var(--font-eyebrow);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-tight);
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
  background-color: var(--header-popup-color-hover);
  color: var(--header-popup-color-text);
}

.header-popup--landing a:hover,
.header-popup--landing button:hover {
  background-color: color-mix(in oklch, var(--color-bg-soft-hover) 84%, var(--color-bg));
  color: var(--landing-color-header-strong);
}

.header-popup a:focus-visible,
.header-popup button:focus-visible {
  outline: calc(var(--header-popup-border) * 3) solid var(--header-popup-color-focus);
  outline-offset: calc(var(--header-popup-border) * 3);
}

.header-popup--landing a:focus-visible,
.header-popup--landing button:focus-visible {
  outline: calc(var(--border) * 3) solid var(--color-accent-strong);
  outline-offset: calc(var(--border) * 3);
}

.header-popup a svg,
.header-popup button svg {
  width: var(--header-popup-icon-size);
  height: var(--header-popup-icon-size);
}

.header-popup--landing a svg,
.header-popup--landing button svg {
  width: calc(var(--unit) * 3.5);
  height: calc(var(--unit) * 3.5);
}
</style>
