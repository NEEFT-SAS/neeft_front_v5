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

definePageMeta({
  layout: 'app'
})

useSeoMeta({
  title: () => t('app.search.teams.seo.title'),
  description: () => t('app.search.teams.seo.description'),
  ogTitle: () => t('app.search.teams.seo.title'),
  ogDescription: () => t('app.search.teams.seo.description'),
  ogImage: '/images/landing/competition-arena.jpg',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/landing/competition-arena.jpg'
})
</script>
