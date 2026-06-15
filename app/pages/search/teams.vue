<template>
  <ProfileSearchPage
    layout-theme="app"
    profile-kind="teams"
    profile-path-prefix="/teams"
    :eyebrow="t('app.search.teams.hero.eyebrow')"
    :title="t('app.search.teams.hero.title')"
    :description="t('app.search.teams.hero.description')"
    :search-label="t('app.search.teams.filters.searchLabel')"
    :search-placeholder="t('app.search.teams.filters.searchPlaceholder')"
    :result-singular="t('app.search.teams.results.singular')"
    :result-plural="t('app.search.teams.results.plural')"
    :empty-message="t('app.search.teams.results.empty')"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()
const config = useConfig()
const pageConfig = config.search.teams

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
