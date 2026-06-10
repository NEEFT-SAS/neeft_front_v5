<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'app'
})

await navigateTo('/marketplace/sales', { redirectCode: 301 })
</script>
