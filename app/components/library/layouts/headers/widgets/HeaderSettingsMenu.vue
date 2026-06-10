<template>
  <div class="header-user-menu-shell">
    <button
      :id="triggerId"
      class="header-user-actions__icon-button"
      type="button"
      aria-label="Ouvrir le menu du compte"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="emit('toggle')"
    >
      <Icon name="lucide:settings" aria-hidden="true" />
    </button>
    <HeaderPopup
      :id="panelId"
      class="header-user-menu-popup"
      :open="open"
      :theme="theme"
      align="end"
      :labelledby-id="triggerId"
    >
      <div class="header-user-menu" role="none">
        <NuxtLink
          v-for="item in settingsLinks"
          :key="item.to"
          class="header-user-menu__item"
          :to="item.to"
          role="menuitem"
          @click="emit('close')"
        >
          <span>{{ item.label }}</span>
        </NuxtLink>
        <span class="header-user-menu__separator" role="separator" aria-hidden="true" />
        <button class="header-user-menu__item header-user-menu__item--danger" type="button" role="menuitem" @click="emit('logout')">
          <span>Deconnexion</span>
        </button>
      </div>
    </HeaderPopup>
  </div>
</template>

<script setup lang="ts">
type HeaderMenuTheme = 'landing' | 'app'

const props = withDefaults(defineProps<{
  open: boolean
  theme?: HeaderMenuTheme
  triggerId: string
  panelId: string
  profileTo: string
}>(), { theme: 'app' })

const emit = defineEmits<{
  toggle: []
  close: []
  logout: []
}>()

const settingsLinks = computed(() => [
  { label: 'Voir le profil', to: props.profileTo },
  { label: 'Mes commandes', to: '/marketplace/orders' },
  { label: 'Mes ventes', to: '/marketplace/sales' },
  { label: 'Mes services', to: '/marketplace/services' },
  { label: 'Marketplace', to: '/marketplace' }
])
</script>
