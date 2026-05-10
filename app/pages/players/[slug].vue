<template>
  <PlayerProfileLayout
    :profile="profile"
    :active-tab="activeTab"
    :tabs="tabs"
    :can-edit="canEdit"
    :show-sidebar="activeTab !== 'recommendations'"
  >
    <NuxtPage />
  </PlayerProfileLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'app',
  key: route => String(route.params.slug)
})

const route = useRoute()
const routeSlug = computed(() => route.params.slug)

if (!routeSlug.value) {
  throw createError({ statusCode: 404, statusMessage: 'Player not found' })
}

const { profile, refresh, error, canEdit } = useViewedUserProfile(() => route.params.slug)
await refresh()

if (error.value || !profile.value) {
  throw createError({ statusCode: 404, statusMessage: 'Player not found' })
}

const activeTab = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  const slugIndex = parts.findIndex(part => part === routeSlug.value)
  const segment = slugIndex >= 0 ? parts[slugIndex + 1] || '' : ''

  const validTabs = ['overview', 'stats', 'experiences', 'marketplace', 'recommendations']
  return validTabs.includes(segment) ? segment : 'overview'
})

const tabs = computed(() => [
  { label: 'Apercu', value: 'overview', to: `/players/${routeSlug.value}`, exact: true },
  { label: 'Stats', value: 'stats', to: `/players/${routeSlug.value}/stats`, badge: 'Pro', exact: true },
  { label: 'Experiences', value: 'experiences', to: `/players/${routeSlug.value}/experiences`, exact: true },
  { label: 'Marketplace', value: 'marketplace', to: `/players/${routeSlug.value}/marketplace`, exact: true },
  { label: 'Recommandations', value: 'recommendations', to: `/players/${routeSlug.value}/recommendations`, exact: true }
])

</script>
