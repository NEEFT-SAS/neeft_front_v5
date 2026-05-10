<template>
  <div class="app-root">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <CustomModalProvider />
  </div>
</template>

<script setup lang="ts">
const resources = useResourcesStore()

if (import.meta.client) {
  void callOnce('resources:bootstrap', () => resources.bootstrap())
}

resources.clearCache()
await resources.refresh()

</script>
