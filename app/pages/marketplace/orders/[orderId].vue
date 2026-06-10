<template>
  <MarketplaceOrderCenter role="buyer" view="detail" :order-id="orderId" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'app'
})

const route = useRoute()
const orderId = computed(() => {
  const value = route.params.orderId
  return Array.isArray(value) ? value[0] || '' : value || ''
})

useSeoMeta({
  title: () => `Detail commande ${orderId.value}`,
  description: 'Detail et suivi d une commande marketplace achetee.',
  ogTitle: () => `Detail commande ${orderId.value}`,
  ogDescription: 'Detail et suivi d une commande marketplace achetee.',
  twitterCard: 'summary'
})
</script>
