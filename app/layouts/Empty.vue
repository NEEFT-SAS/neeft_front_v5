<template>
  <div class="empty-layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  htmlAttrs: {
    lang: 'fr',
    class: 'font-ui',
    'data-theme': 'landing'
  }
})
</script>
