<template>
  <main class="player-profile-page" aria-labelledby="player-profile-title">
    <PlayerProfileHero
      :profile="profile"
      :can-edit="canEdit"
    />

    <div class="player-profile-shell">
      <CustomRouteTabs
        :items="tabs"
        :model-value="activeTab"
        aria-label="Navigation du profil joueur"
        theme="app"
        size="md"
      />
    </div>

    <div
      class="player-profile-shell player-profile-layout"
      :data-sidebar="showSidebar ? 'true' : 'false'"
    >
      <div class="player-profile-main">
        <slot />
      </div>

      <aside v-if="showSidebar" class="player-profile-sidebar" aria-label="Resume profil">
        <slot name="sidebar" />
      </aside>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { PlayerProfilePresenter } from '@neeft-sas/shared'

defineProps<{
  profile: PlayerProfilePresenter
  activeTab: string
  tabs: {
    label: string
    value: string
    to: string
    icon?: string
    badge?: string
    exact?: boolean
  }[]
  canEdit?: boolean
  showSidebar?: boolean
}>()
</script>

<style>
.player-profile-page {
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
  --profile-color-bg-soft: color-mix(in oklch, var(--app-color-panel) 62%, var(--color-bg));
  --profile-color-panel: var(--app-color-panel);
  --profile-color-panel-strong: color-mix(in oklch, var(--app-color-panel) 82%, var(--color-bg));
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
  min-height: calc(100vh - var(--app-header-height));
  background-color: var(--profile-color-bg);
  color: var(--profile-color-text);
  font-family: var(--font-ui, ui-sans-serif, system-ui, sans-serif);
  letter-spacing: 0;
}

.player-profile-page *,
.player-profile-page *::before,
.player-profile-page *::after {
  box-sizing: border-box;
  min-width: 0;
  letter-spacing: 0;
}

.player-profile-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--profile-sidebar-width);
  gap: var(--profile-space-4);
  padding: var(--profile-space-4) 0 var(--profile-space-10);
}

.player-profile-layout[data-sidebar='false'] {
  grid-template-columns: minmax(0, 1fr);
}

.player-profile-main,
.player-profile-sidebar {
  display: grid;
  align-content: start;
  gap: var(--profile-space-4);
}

.player-profile-sidebar {
  position: sticky;
  top: calc(var(--app-header-height) + var(--profile-space-4));
}

@media (max-width: 62rem) {
  .player-profile-layout {
    grid-template-columns: 1fr;
  }

  .player-profile-sidebar {
    position: static;
  }
}
</style>
