<template>
  <div class="app-root">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <CustomModalProvider />
    <CustomToastProvider />
  </div>
</template>

<script setup lang="ts">
const resources = useResourcesStore()
const session = useSessionStore()

if (import.meta.client) {
  void callOnce('session:bootstrap', () => session.bootstrap())
  void callOnce('resources:bootstrap', () => resources.bootstrap())
}

resources.clearCache()
await resources.refresh()

</script>
