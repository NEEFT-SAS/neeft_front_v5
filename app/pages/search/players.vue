<template>
  <ProfileSearchPage
    layout-theme="app"
    :eyebrow="t('app.search.players.hero.eyebrow')"
    :title="t('app.search.players.hero.title')"
    :description="t('app.search.players.hero.description')"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()

definePageMeta({
  layout: 'app'
})

useSeoMeta({
  title: () => t('app.search.players.seo.title'),
  description: () => t('app.search.players.seo.description'),
  ogTitle: () => t('app.search.players.seo.title'),
  ogDescription: () => t('app.search.players.seo.description'),
  ogImage: '/images/landing/competition-arena.jpg',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/landing/competition-arena.jpg'
})
</script>
