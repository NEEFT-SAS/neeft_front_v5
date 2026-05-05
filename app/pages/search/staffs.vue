<template>
  <ProfileSearchPage
    layout-theme="app"
    profile-kind="staffs"
    profile-path-prefix="/staffs"
    :eyebrow="t('app.search.staffs.hero.eyebrow')"
    :title="t('app.search.staffs.hero.title')"
    :description="t('app.search.staffs.hero.description')"
    :search-label="t('app.search.staffs.filters.searchLabel')"
    :search-placeholder="t('app.search.staffs.filters.searchPlaceholder')"
    :result-singular="t('app.search.staffs.results.singular')"
    :result-plural="t('app.search.staffs.results.plural')"
    :empty-message="t('app.search.staffs.results.empty')"
  />
</template>

<script setup lang="ts">
const { t } = useI18n()

definePageMeta({
  layout: 'app'
})

useSeoMeta({
  title: () => t('app.search.staffs.seo.title'),
  description: () => t('app.search.staffs.seo.description'),
  ogTitle: () => t('app.search.staffs.seo.title'),
  ogDescription: () => t('app.search.staffs.seo.description'),
  ogImage: '/images/landing/competition-arena.jpg',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/landing/competition-arena.jpg'
})
</script>
