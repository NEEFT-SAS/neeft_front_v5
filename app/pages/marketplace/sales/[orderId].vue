<template>
  <MarketplaceOrderCenter role="seller" view="detail" :order-id="orderId" />
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
  title: () => `Detail vente ${orderId.value}`,
  description: 'Detail et suivi d une vente marketplace.',
  ogTitle: () => `Detail vente ${orderId.value}`,
  ogDescription: 'Detail et suivi d une vente marketplace.',
  twitterCard: 'summary'
})
</script>
