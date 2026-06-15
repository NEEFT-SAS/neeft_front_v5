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
const config = useConfig()
const pageConfig = config.search.players

definePageMeta({
  layout: 'app'
})

useSeoMeta({
  title: () => t(pageConfig.seo.titleKey),
  description: () => t(pageConfig.seo.descriptionKey),
  ogTitle: () => t(pageConfig.seo.ogTitleKey || pageConfig.seo.titleKey),
  ogDescription: () => t(pageConfig.seo.ogDescriptionKey || pageConfig.seo.descriptionKey),
  ogImage: pageConfig.seo.ogImage,
  twitterCard: pageConfig.seo.twitterCard,
  twitterImage: pageConfig.seo.twitterImage
})
</script>
