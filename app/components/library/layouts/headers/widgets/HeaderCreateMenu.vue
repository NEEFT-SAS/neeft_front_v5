<template>
  <div class="header-user-menu-shell">
    <button
      :id="triggerId"
      class="header-user-actions__icon-button"
      type="button"
      aria-label="Ouvrir le menu de creation"
      :aria-expanded="open"
      :aria-controls="panelId"
      @click="emit('toggle')"
    >
      <Icon name="lucide:plus" aria-hidden="true" />
    </button>
    <HeaderPopup
      :id="panelId"
      class="header-user-menu-popup"
      :open="open"
      :theme="theme"
      align="start"
      :labelledby-id="triggerId"
    >
      <div class="header-user-menu" role="none">
        <button
          v-for="item in createActions"
          :key="item.action"
          class="header-user-menu__item"
          type="button"
          role="menuitem"
          @click="openAction(item.action)"
        >
          <span>{{ item.label }}</span>
        </button>
      </div>
    </HeaderPopup>
  </div>
</template>

<script setup lang="ts">
type HeaderMenuTheme = 'landing' | 'app'

withDefaults(defineProps<{
  open: boolean
  theme?: HeaderMenuTheme
  triggerId: string
  panelId: string
}>(), { theme: 'app' })

const emit = defineEmits<{
  toggle: []
  close: []
  'open-service-form': []
  'open-team-form': []
}>()

type CreateAction = 'service' | 'team'

const createActions: Array<{ label: string; action: CreateAction }> = [
  { label: 'Proposer un service', action: 'service' },
  { label: 'Creer une equipe', action: 'team' }
]

const openAction = (action: CreateAction) => {
  emit('close')

  if (action === 'service') {
    emit('open-service-form')
    return
  }

  emit('open-team-form')
}
</script>
