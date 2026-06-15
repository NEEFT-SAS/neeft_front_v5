<template>
  <MarketplaceOrderCenter role="buyer" view="list" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'app'
})

const config = useConfig()

useSeoMeta(config.marketplace.orders.seo)
</script>
