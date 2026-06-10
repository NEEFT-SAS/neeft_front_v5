<template>
  <MarketplaceOrderCenter role="buyer" view="list" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'app'
})

useSeoMeta({
  title: 'Commandes achetees',
  description: 'Suivi des commandes marketplace achetees a des vendeurs.',
  ogTitle: 'Commandes achetees',
  ogDescription: 'Suivi des services commandes sur la marketplace.',
  twitterCard: 'summary'
})
</script>
