<template>
  <MarketplaceOrderCenter role="seller" view="detail" :order-id="orderId" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'app'
})

const route = useRoute()
const config = useConfig()
const orderId = computed(() => {
  const value = route.params.orderId
  return Array.isArray(value) ? value[0] || '' : value || ''
})
const seo = computed(() => config.marketplace.saleDetail.seo(orderId.value))

useSeoMeta({
  title: () => seo.value.title,
  description: () => seo.value.description,
  ogTitle: () => seo.value.ogTitle,
  ogDescription: () => seo.value.ogDescription,
  twitterCard: () => seo.value.twitterCard
})
</script>
