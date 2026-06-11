<template>
  <main class="marketplace-service-profile-page" aria-labelledby="marketplace-service-title">
    <slot name="hero" />

    <div class="marketplace-service-profile-shell marketplace-service-profile-layout">
      <div class="marketplace-service-profile-main">
        <slot />
      </div>

      <aside v-if="$slots.sidebar" class="marketplace-service-profile-sidebar" aria-label="Resume du service">
        <slot name="sidebar" />
      </aside>
    </div>

    <slot name="overlays" />
  </main>
</template>

<style>
.marketplace-service-profile-page {
  --profile-unit: var(--unit);
  --profile-space-1: var(--space-1);
  --profile-space-2: var(--space-2);
  --profile-space-3: var(--space-3);
  --profile-space-4: calc(var(--profile-unit) * 4);
  --profile-space-5: calc(var(--profile-unit) * 5);
  --profile-space-6: calc(var(--profile-unit) * 6);
  --profile-space-8: calc(var(--profile-unit) * 8);
  --profile-space-10: calc(var(--profile-unit) * 10);
  --profile-space-fluid: clamp(var(--profile-space-3), calc(var(--profile-space-2) + 3vw), var(--profile-space-8));
  --profile-content-max: calc(var(--profile-unit) * 140);
  --profile-sidebar-width: calc(var(--profile-unit) * 40);
  --profile-banner-height: calc(var(--profile-unit) * 44);
  --profile-logo-size: calc(var(--profile-unit) * 15);
  --profile-icon-size: calc(var(--profile-unit) * 3);
  --profile-radius: var(--radius);
  --profile-radius-round: var(--radius-round);
  --profile-border: var(--border);
  --profile-font-title: calc(var(--profile-unit) * 5.5);
  --profile-font-section: calc(var(--profile-unit) * 2.75);
  --profile-font-body: calc(var(--profile-unit) * 2);
  --profile-font-small: calc(var(--profile-unit) * 1.75);
  --profile-font-label: calc(var(--profile-unit) * 1.5);
  --profile-line-tight: var(--line-tight);
  --profile-line-title: var(--line-title);
  --profile-line-body: var(--line-base);
  --profile-color-bg: var(--color-bg);
  --profile-color-panel: var(--color-surface);
  --profile-color-bg-soft: color-mix(in oklch, var(--profile-color-panel) 62%, var(--profile-color-bg));
  --profile-color-panel-strong: color-mix(in oklch, var(--profile-color-panel) 82%, var(--profile-color-bg));
  --profile-color-border: var(--app-color-line);
  --profile-color-text: var(--color-text);
  --profile-color-muted: var(--app-color-muted);
  --profile-color-subtle: var(--app-color-subtle);
  --profile-color-accent: var(--color-accent);
  --profile-color-danger: var(--color-danger);
  --profile-color-focus: var(--color-accent);
  --profile-color-shadow: var(--color-shadow);
  --profile-color-transparent: var(--color-transparent);
  --profile-color-overlay-mid: oklch(0% 0 0 / 0.36);
  --profile-hit-size: calc(var(--profile-unit) * 5);
  --search-unit: var(--profile-unit);
  --search-font-small: var(--profile-font-small);
  --search-line-tight: var(--profile-line-tight);
  --search-color-text: var(--profile-color-text);
  --search-color-muted: var(--profile-color-muted);
  --search-color-subtle: var(--profile-color-subtle);
  --search-color-accent: var(--profile-color-accent);
  --search-color-transparent: var(--profile-color-transparent);
  min-height: calc(100vh - var(--app-header-height));
  background-color: var(--profile-color-bg);
  color: var(--profile-color-text);
  font-family: var(--font-ui, ui-sans-serif, system-ui, sans-serif);
  letter-spacing: 0;
}

.marketplace-service-profile-page *,
.marketplace-service-profile-page *::before,
.marketplace-service-profile-page *::after {
  box-sizing: border-box;
  min-width: 0;
  letter-spacing: 0;
}

.marketplace-service-profile-shell {
  width: min(calc(100% - (var(--profile-space-fluid) * 2)), var(--profile-content-max));
  margin: 0 auto;
}

.marketplace-service-profile-eyebrow {
  margin: 0;
  color: var(--profile-color-subtle);
  font-size: var(--profile-font-label);
  font-weight: 800;
  line-height: var(--profile-line-body);
  text-transform: uppercase;
}

.marketplace-service-profile-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--profile-sidebar-width);
  gap: var(--profile-space-4);
  padding: var(--profile-space-4) 0 var(--profile-space-10);
}

.marketplace-service-profile-main,
.marketplace-service-profile-sidebar {
  display: grid;
  align-content: start;
  gap: var(--profile-space-4);
}

.marketplace-service-profile-sidebar {
  position: sticky;
  top: calc(var(--app-header-height) + var(--profile-space-4));
}

@media (max-width: 62rem) {
  .marketplace-service-profile-layout {
    grid-template-columns: 1fr;
  }

  .marketplace-service-profile-sidebar {
    position: static;
  }
}
</style>
