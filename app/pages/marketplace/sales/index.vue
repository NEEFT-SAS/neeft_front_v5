<template>
  <MarketplaceOrderCenter role="seller" view="list" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'app'
})

const config = useConfig()

useSeoMeta(config.marketplace.sales.seo)
</script>
