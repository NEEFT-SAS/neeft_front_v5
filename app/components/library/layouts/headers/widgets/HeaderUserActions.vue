<template>
  <div v-if="isLoggedIn" ref="actionsElement" class="header-user-actions" :data-user-actions-theme="theme" :data-user-actions-size="size" aria-label="Actions utilisateur">
    <div class="header-user-actions__quick-actions" aria-label="Acces rapides">
      <button class="header-user-actions__icon-button" type="button" aria-label="Creer">
        <Icon name="lucide:plus" aria-hidden="true" />
      </button>
      <button class="header-user-actions__icon-button" type="button" aria-label="Messagerie">
        <Icon name="lucide:message-circle" aria-hidden="true" />
      </button>
      <button class="header-user-actions__icon-button" type="button" aria-label="Notifications">
        <Icon name="lucide:bell" aria-hidden="true" />
      </button>
    </div>
    <span class="header-user-actions__divider" aria-hidden="true" />
    <NuxtLink class="header-user-actions__profile" to="/profile" aria-label="Mon profil">
      <img class="header-user-actions__avatar" src="/images/logos/neeft/Logo_NEEFT_FOX.png" alt="" decoding="async">
      <span class="header-user-actions__username">Username</span>
    </NuxtLink>
    <div class="header-user-actions__settings">
      <button class="header-user-actions__icon-button" type="button" aria-label="Parametres">
        <Icon name="lucide:settings" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
type HeaderUserActionsTheme = 'landing' | 'app'
type HeaderUserActionsSize = 'sm' | 'md' | 'lg'

const { theme = 'app', size = 'sm' } = defineProps<{ theme?: HeaderUserActionsTheme; size?: HeaderUserActionsSize }>()

const isLoggedIn = ref(false)
const actionsElement = ref<HTMLElement | null>(null)
</script>

<style scoped lang="scss">
@use '~/assets/scss/mixins/breakpoints' as *;

.header-user-actions {
  --header-user-actions-gap-1: var(--app-space-1);
  --header-user-actions-gap-2: var(--app-space-2);
  --header-user-actions-radius: var(--app-radius);
  --header-user-actions-border: var(--app-border);
  --header-user-actions-avatar-size: calc(var(--app-unit) * 3);
  --header-user-actions-profile-height: var(--app-header-hit-size);
  --header-user-actions-profile-padding: var(--app-space-1) var(--app-space-2);
  --header-user-actions-icon-size: var(--app-header-icon-size);
  --header-user-actions-icon-hit-size: var(--app-header-hit-size);
  --header-user-actions-font-size: var(--app-font-sm);
  --header-user-actions-font-weight: var(--app-font-weight-semibold);
  --header-user-actions-line: var(--app-line-tight);
  --header-user-actions-color-text: var(--app-color-text);
  --header-user-actions-color-muted: color-mix(in oklch, var(--app-color-muted) 86%, var(--app-color-text));
  --header-user-actions-color-panel: color-mix(in oklch, var(--app-color-panel) 86%, var(--app-color-bg));
  --header-user-actions-color-hover: color-mix(in oklch, var(--app-color-panel-hover) 76%, var(--app-color-bg));
  --header-user-actions-color-line: color-mix(in oklch, var(--app-color-line) 82%, var(--app-color-transparent));
  --header-user-actions-color-focus: var(--app-color-focus);
  --header-user-actions-color-transparent: var(--app-color-transparent);
  --header-user-actions-zero: calc(var(--header-user-actions-border) * 0);
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

.header-user-actions[data-user-actions-size='md'] { --header-user-actions-avatar-size: calc(var(--app-unit) * 3.25); }
.header-user-actions[data-user-actions-size='lg'] { --header-user-actions-avatar-size: calc(var(--unit) * 3.5); }

.header-user-actions__quick-actions, .header-user-actions__profile { display: flex; align-items: center; }
.header-user-actions__quick-actions { gap: var(--header-user-actions-zero); }

.header-user-actions__icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--header-user-actions-icon-hit-size);
  min-width: var(--header-user-actions-icon-hit-size);
  height: var(--header-user-actions-icon-hit-size);
  padding: var(--header-user-actions-zero);
  border: var(--header-user-actions-zero);
  border-radius: var(--header-user-actions-radius);
  background-color: var(--header-user-actions-color-transparent);
  color: var(--header-user-actions-color-muted);
  cursor: pointer;
}

.header-user-actions__icon-button:hover { background-color: var(--header-user-actions-color-hover); color: var(--header-user-actions-color-text); }
.header-user-actions__icon-button svg { width: var(--header-user-actions-icon-size); height: var(--header-user-actions-icon-size); }

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
  width: var(--header-user-actions-avatar-size);
  height: var(--header-user-actions-avatar-size);
  border: var(--header-user-actions-border) solid var(--header-user-actions-color-line);
  border-radius: var(--header-user-actions-radius);
  background-color: var(--header-user-actions-color-hover);
  object-fit: cover;
}

.header-user-actions__username { color: var(--header-user-actions-color-text); white-space: nowrap; }

.header-user-actions__icon-button:focus-visible, .header-user-actions__profile:focus-visible {
  outline: calc(var(--header-user-actions-border) * 3) solid var(--header-user-actions-color-focus);
  outline-offset: calc(var(--header-user-actions-border) * 3);
}
</style>
